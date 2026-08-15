import { generateText } from "ai";
import {
  assemblyRequestSchema, isSameOrigin, clientKey, rateLimit, rateHeaders,
} from "@/lib/api/guard";
import { aiProviderConfigured, resolveVidyaModel, VIDYA_MODELS } from "@/lib/ai/models";

export const maxDuration = 30;
export const runtime = "nodejs";

/** Assembly is once-a-day content, so this can be tight. Denials fall back to
 *  the hand-written local assembly rather than erroring — the kid still gets a
 *  greeting. See lib/api/guard.ts for the best-effort caveat. */
const RATE = { limit: 12, windowMs: 10 * 60 * 1000 };

const FALLBACK_THOUGHTS = [
  { author: "A.P.J. Abdul Kalam", line: "Dream is not what you see in sleep — it is the thing that does not let you sleep." },
  { author: "Mahatma Gandhi", line: "Live as if you were to die tomorrow. Learn as if you were to live forever." },
  { author: "Rabindranath Tagore", line: "You can't cross the sea merely by standing and staring at the water." },
  { author: "Savitribai Phule", line: "Go, get education. Be self-reliant, be industrious. Work — gather wisdom and riches." },
  { author: "Swami Vivekananda", line: "Take up one idea. Make that one idea your life — think of it, dream of it, live on that idea." },
  { author: "Sudha Murty", line: "When you give, you must give without expecting anything in return." },
  { author: "Helen Keller", line: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart." },
  { author: "Sachin Tendulkar", line: "I have always believed that the only thing better than dreams is dreams that come true through your own effort." },
];

function dailyFallback(name?: string) {
  const today = new Date().toISOString().slice(0, 10);
  // Stable per-day choice
  const seed = [...today].reduce((s, c) => s + c.charCodeAt(0), 0);
  const t = FALLBACK_THOUGHTS[seed % FALLBACK_THOUGHTS.length];
  const learner = name?.split(" ")[0] || "scholar";
  return {
    greeting: `Good morning, ${learner}. The Vidya assembly begins.`,
    thought: t.line,
    attribution: t.author,
    plan: [
      "Maths · place-value warm-up",
      "Science · forces & motion",
      "Library · pick a story you've never tried",
      "One Field Trip if there's time at evening",
    ],
    closing: "Let's make today a good one. Diya is waiting in the lobby.",
    source: "local",
  };
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Over the limit, serve the offline assembly instead of an error — the kid
  // should never see the school fail to open.
  const verdict = rateLimit(`assembly:${clientKey(req)}`, RATE);

  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    /* body is optional for this route */
  }

  const parsed = assemblyRequestSchema.safeParse(raw ?? {});
  const body = parsed.success ? parsed.data : {};

  if (!verdict.ok) {
    return Response.json(dailyFallback(body.name), {
      headers: rateHeaders(verdict, RATE.limit),
    });
  }

  if (!aiProviderConfigured()) {
    return Response.json(dailyFallback(body.name));
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const isIgcse = body.board === "cambridge-igcse" || (body.grade ?? 0) >= 9;
  // Cambridge Lower Secondary = Grades 6–8 (Stages 7–9). Without this branch
  // an 11–13 year old gets addressed as a 10-year-old.
  const isLowerSec = body.board === "cambridge-lower-secondary";
  const ageHint = isLowerSec
    ? "Speak to an 11–13 year old on Cambridge Lower Secondary. Warm but not childish."
    : isIgcse
    ? "Speak to a 15-year-old IGCSE student. Mature, motivating, but warm."
    : "Keep language simple for a 10-year-old.";
  const planHint = isIgcse
    ? "4 short bullets, max 8 words each, mixing IGCSE subjects (English, Maths, Sciences, Computer Science, ICT, Business) and one wellbeing item."
    : isLowerSec
    ? "4 short bullets, max 8 words each, mixing Lower Secondary subjects (English, Maths, Science, History, Geography, Global Perspectives, ICT) and one wellbeing item."
    : "4 short bullets, max 8 words each, mixing subjects and one fun item.";
  // Never assert a school the learner does not attend. Only the learner's own
  // school is named; with none supplied the principal stays generic.
  const schoolLabel = body.school?.trim() || null;
  const programmeLabel = isIgcse
    ? "Cambridge IGCSE Upper Secondary"
    : isLowerSec
    ? `Cambridge Lower Secondary, Stage ${(body.grade ?? 6) + 1}`
    : "Cambridge Primary";

  try {
    const result = await generateText({
      model: resolveVidyaModel(VIDYA_MODELS.haiku),
      maxOutputTokens: 600,
      temperature: 0.85,
      system: `You are the AI Principal of Vidya, a digital school${schoolLabel ? ` for students at ${schoolLabel}` : ""}. You give the daily morning assembly.

Output STRICT JSON only, no markdown, with this shape:
{
  "greeting": "warm 1-line good morning addressed to the student",
  "thought": "a 1-2 sentence thought for the day — quotable",
  "attribution": "name of the person quoted (Indian thinkers, scientists, writers preferred; mix of cultures welcome)",
  "plan": ["${planHint}"],
  "closing": "1 short uplifting line to end assembly"
}

${ageHint} Indian context welcome (festivals, weather, monsoon, cricket, ISRO).`,
      prompt: `Today is ${today}. Student first name: ${body.name?.split(" ")[0] || "scholar"}. Grade: ${body.grade ?? 5} (${programmeLabel}). Current streak: ${body.streak ?? 0} days. Level: ${body.level ?? 1}.`,
    });
    const text = result.text.trim();
    // Strip stray ``` fences
    const cleaned = text.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return Response.json({ ...parsed, source: "ai" });
  } catch (e) {
    // Non-fatal by design: the assembly always opens, AI or not.
    console.error("[api/assembly] falling back to local assembly:", e);
    return Response.json(dailyFallback(body.name));
  }
}
