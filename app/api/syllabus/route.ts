// Parse a school syllabus document into structured topics.
//
// WHY THIS EXISTS
// ---------------
// There is no public "exact Stage 7 syllabus" — Cambridge groups Humanities
// 0839 objectives across Stages 7–9 and lets each school choose its own
// periods, and CNS does not publish its scheme of work. See the long note in
// lib/content/school-syllabus.ts. The only source that can make the word
// "exact" true is the document the school actually issues, which arrives as a
// PDF, a portal screenshot, or a photo of a printed circular.
//
// This route turns one of those into structured topics so a parent does not
// have to type a syllabus out by hand.
//
// WHY IT IS NOT LIKE /api/tutor
//   · Tutor and assembly are deliberately PUBLIC — kids have no login. This is
//     a PARENT action, so it requires a signed-in parent. Middleware does not
//     protect /api/**, so the check lives here.
//   · It uses a stronger model than the chat routes. Reading a smudged photo
//     of a printed timetable is a harder task than a tutor turn, and a wrong
//     extraction here becomes a child's stated curriculum.
//
// WHAT IT DELIBERATELY DOES NOT DO
//   · It does not save anything. The parsed result goes back to the client for
//     a human to review and accept — an extraction is a proposal, not a fact.
//   · It does not store the uploaded document anywhere. The bytes live for the
//     length of one request.
//   · It does not invent. The prompt forbids filling gaps from prior knowledge
//     of Cambridge, and unmatched subjects are dropped rather than guessed.

import { generateObject } from "ai";
import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";
import { aiProviderConfigured, resolveVidyaModel, VIDYA_MODELS } from "@/lib/ai/models";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Document parsing is expensive — a much tighter budget than a tutor turn. */
const RATE = { limit: 12, windowMs: 30 * 60 * 1000 };

/** Vercel Functions accept far more, but a school circular is a handful of
 *  pages. Anything larger is a mistake, not a syllabus. */
const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_TEXT_CHARS = 60_000;
const MAX_SUBJECT_HINTS = 40;

const ACCEPTED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
]);

// The model maps what it reads onto the learner's real subject ids. Sending the
// allowed ids as part of the request is what stops it inventing one.
const subjectHint = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(80),
});

const extractedTopic = z.object({
  title: z.string().describe("The unit title exactly as the document writes it."),
  blurb: z.string().describe("One short line describing the unit. Empty string if the document gives none."),
  syllabus: z.array(z.string()).describe("Sub-topics or bullet points listed under this unit, verbatim where possible."),
  term: z.string().optional().describe("Term or period label if the document assigns one, e.g. 'Term 1'."),
});

const extraction = z.object({
  academicYear: z
    .string()
    .describe("Academic year as printed, e.g. '2026-27'. Empty string if the document does not state one."),
  documentKind: z
    .enum(["scheme-of-work", "syllabus-list", "timetable", "book-list", "other", "unreadable"])
    .describe("What this document actually is."),
  subjects: z.array(
    z.object({
      subjectId: z.string().describe("MUST be one of the provided subject ids, or the empty string if none fits."),
      subjectLabel: z.string().describe("The subject name as the document writes it."),
      textbooks: z.array(z.string()).describe("Textbooks named for this subject. Empty array if none."),
      topics: z.array(extractedTopic),
    }),
  ),
  notes: z
    .string()
    .describe("Anything a parent should know: pages that were unreadable, ambiguity, or content you could not place."),
});

const SYSTEM = `You extract school syllabus documents into structured data.

ABSOLUTE RULES — a wrong extraction becomes a child's stated curriculum, so err toward omission:
1. Extract ONLY what is present in the document. Never complete a list from your own knowledge of Cambridge, IGCSE, CBSE, ICSE or any other curriculum.
2. If a unit title is partly illegible, transcribe what is legible and say so in "notes". Do not guess the rest.
3. Map each subject onto one of the provided subject ids. If nothing fits, set subjectId to "" and still return the subject with its label — the parent will see it was dropped.
4. Keep the document's own wording and its own order. Do not tidy, translate, expand abbreviations, or reorder units.
5. If the document is not a syllabus at all (a fee circular, a letter, a photo of something else), set documentKind appropriately and return an empty subjects array.
6. Never output a topic that has no support in the document.`;

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!aiProviderConfigured()) {
    return Response.json(
      { error: "Syllabus extraction is unavailable until an AI provider is configured." },
      { status: 503 },
    );
  }

  const verdict = rateLimit(`syllabus:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json(
      { error: "Too many uploads. Try again shortly." },
      { status: 429, headers: rateHeaders(verdict, RATE.limit) },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected a multipart form." }, { status: 400 });
  }

  // Subject hints — the closed set the model is allowed to map onto.
  let hints: z.infer<typeof subjectHint>[] = [];
  const rawHints = form.get("subjects");
  if (typeof rawHints === "string" && rawHints.length > 0) {
    const parsed = z.array(subjectHint).max(MAX_SUBJECT_HINTS).safeParse(safeJson(rawHints));
    if (!parsed.success) return Response.json({ error: "Bad subject list." }, { status: 400 });
    hints = parsed.data;
  }
  if (hints.length === 0) {
    return Response.json({ error: "No subjects to map onto." }, { status: 400 });
  }

  const pastedRaw = form.get("text");
  const pasted = typeof pastedRaw === "string" ? pastedRaw.trim().slice(0, MAX_TEXT_CHARS) : "";
  const files = form.getAll("file").filter((f): f is File => f instanceof File);

  if (files.length === 0 && pasted.length === 0) {
    return Response.json({ error: "Attach a document or paste the syllabus text." }, { status: 400 });
  }

  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_FILE_BYTES) {
    return Response.json({ error: "Those files are too large. Keep it under 12 MB." }, { status: 413 });
  }
  for (const f of files) {
    if (!ACCEPTED.has(f.type)) {
      return Response.json(
        { error: `Unsupported file type: ${f.type || "unknown"}. Use a PDF or a photo.` },
        { status: 415 },
      );
    }
  }

  const allowed = hints.map((h) => `${h.id} = ${h.name}`).join("\n");
  const parts: Array<
    | { type: "text"; text: string }
    | { type: "file"; data: Uint8Array; mediaType: string }
  > = [
    {
      type: "text",
      text:
        `Extract this school's syllabus.\n\n` +
        `Subject ids you may map onto (use the id on the left, exactly):\n${allowed}\n\n` +
        (pasted ? `The parent also pasted this text:\n---\n${pasted}\n---\n` : ""),
    },
  ];

  for (const f of files) {
    parts.push({
      type: "file",
      data: new Uint8Array(await f.arrayBuffer()),
      mediaType: f.type,
    });
  }

  try {
    const { object } = await generateObject({
      // A stronger model than the chat routes on purpose — this reads scans and
      // photographs of printed timetables, and a misread here is durable.
      model: resolveVidyaModel(VIDYA_MODELS.sonnet),
      schema: extraction,
      system: SYSTEM,
      messages: [{ role: "user", content: parts }],
    });

    // Drop anything the model could not place onto a real subject, and anything
    // with no topics — an empty subject is noise on the review screen.
    const known = new Set(hints.map((h) => h.id));
    const subjects = object.subjects.filter(
      (s) => known.has(s.subjectId) && s.topics.length > 0,
    );
    const dropped = object.subjects
      .filter((s) => !known.has(s.subjectId) || s.topics.length === 0)
      .map((s) => s.subjectLabel)
      .filter(Boolean);

    return Response.json(
      { ...object, subjects, dropped },
      { headers: rateHeaders(verdict, RATE.limit) },
    );
  } catch (e) {
    // Never echo the provider error — it can carry model names and key hints.
    console.error("[api/syllabus] extraction failed:", e);
    return Response.json({ error: "Could not read that document." }, { status: 502 });
  }
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}
