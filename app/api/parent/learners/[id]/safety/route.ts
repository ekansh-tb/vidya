import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { safetySignalsForParent, markSafetySignalsSeen } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

const RATE = { limit: 60, windowMs: 10 * 60 * 1000 };

/**
 * What a child told Miss Vidya that a parent needs to know about.
 *
 * This is the read side of the one thing Vidya had no path for at all: a child
 * disclosing self-harm or that someone is hurting them. lib/safety/crisis.ts
 * answers the child; safety_signals records it; this route is how a human ever
 * finds out. Without it the detection is a diary nobody opens.
 *
 * Ownership is enforced inside both queries, scoped by parent_id, and a miss
 * answers 404 rather than 403 so another family's learner id is never confirmed.
 * Only the two escalating categories are ever written, so everything returned
 * here is something a parent is meant to see — the `despair` tier stays between
 * the child and Miss Vidya and never reaches this table.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const signals = await safetySignalsForParent(parent.userId, id, 20);
    if (!signals) return Response.json({ error: "Not found" }, { status: 404 });
    // The unseen count is computed here rather than queried separately: the
    // dashboard needs it on every load and the rows are already in hand.
    return Response.json({
      signals,
      unseen: signals.filter((s) => !s.seenAt).length,
    });
  } catch (e) {
    console.error("[api/parent/learners/:id/safety] read failed:", e);
    return Response.json({ error: "Could not read safety signals" }, { status: 500 });
  }
}

/**
 * Acknowledge everything currently unseen.
 *
 * PATCH with no body on purpose — the only supported operation is "I have read
 * these", applied to whatever is unread at the moment the parent clicks. There
 * is deliberately no per-row dismiss and no delete: the point of keeping the
 * history is that the same sentence twice in two months means something
 * different from the same sentence twice in one week.
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`safety:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const seen = await markSafetySignalsSeen(parent.userId, id);
    if (seen === null) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, seen });
  } catch (e) {
    console.error("[api/parent/learners/:id/safety] acknowledge failed:", e);
    return Response.json({ error: "Could not update" }, { status: 500 });
  }
}
