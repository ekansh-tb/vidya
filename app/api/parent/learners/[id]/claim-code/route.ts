import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { issueClaimCode } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

/** Tighter than most: issuing codes is a security-relevant action. */
const RATE = { limit: 20, windowMs: 10 * 60 * 1000 };

/**
 * Issues a single-use, expiring code the parent shows their child.
 *
 * Redeeming it is the ONLY way a learner reaches verification rung 2 — the
 * rung that unlocks the AI tutor. It replaces the old client-side rule where
 * any 4-digit PIN typed into localStorage self-promoted the learner.
 *
 * Ownership is enforced inside issueClaimCode: it re-reads the learner scoped
 * by parent_id and returns null if this parent does not own them, so a parent
 * cannot mint a code for someone else's child by guessing a UUID.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`claim-code:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const issued = await issueClaimCode(parent.userId, id);
    // Null means "not yours" — answered as 404 so we never confirm that
    // another family's learner id exists.
    if (!issued) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(issued);
  } catch (e) {
    console.error("[api/parent/learners/:id/claim-code] failed:", e);
    return Response.json({ error: "Could not issue a code" }, { status: 500 });
  }
}
