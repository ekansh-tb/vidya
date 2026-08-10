import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { listLearnersForParent, createLearner } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

const RATE = { limit: 60, windowMs: 10 * 60 * 1000 };

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  grade: z.number().int().min(1).max(13),
  board: z.enum([
    "cambridge-primary",
    "cambridge-lower-secondary",
    "cambridge-igcse",
    "icse",
    "cbse",
  ]),
  school: z.string().trim().max(160).optional(),
  city: z.string().trim().max(120).optional(),
  /** Client-side profile id, so a device can reconcile local profiles later. */
  localId: z.string().trim().max(128).optional(),
  pickedSubjects: z.array(z.string().max(64)).max(40).optional(),
  subjectsLocked: z.boolean().optional(),
});

/** Every learner this parent owns. Scoped by parent_id in SQL, never by id. */
export async function GET(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const learners = await listLearnersForParent(parent.userId);
  return Response.json({ learners });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`parent-learners:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const learner = await createLearner({
      parentId: parent.userId,
      name: parsed.data.name,
      grade: parsed.data.grade,
      board: parsed.data.board,
      school: parsed.data.school ?? null,
      city: parsed.data.city ?? null,
      localId: parsed.data.localId ?? null,
      pickedSubjects: (parsed.data.pickedSubjects ?? null) as never,
      subjectsLocked: parsed.data.subjectsLocked ?? false,
    });
    return Response.json({ learner }, { status: 201 });
  } catch (e) {
    console.error("[api/parent/learners] create failed:", e);
    return Response.json({ error: "Could not create learner" }, { status: 500 });
  }
}
