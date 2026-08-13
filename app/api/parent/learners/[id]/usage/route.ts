import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { usageForParent } from "@/lib/db/queries";
import { CAPABILITY_POLICIES } from "@/lib/capabilities/policies";
import type { CapabilityKey } from "@/lib/auth/types";
import { isSameOrigin } from "@/lib/api/guard";

export const runtime = "nodejs";

/**
 * How much of each metered capability this learner has used, per day.
 *
 * The counter behind it exists to enforce a limit (see bumpCapabilityUsage);
 * this route exists so the limit is not invisible. A ceiling a parent cannot
 * see is one they cannot judge — they have no way to know whether 60 a day is
 * generous or stingy for their own child until they can watch it.
 *
 * Ownership is enforced in the query, scoped by parent_id, and a miss answers
 * 404 rather than 403 so another family's learner id is never confirmed.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const rows = await usageForParent(parent.userId, id, 7);
    if (!rows) return Response.json({ error: "Not found" }, { status: 404 });

    // The ceilings come from the policy map rather than the database, so the
    // number a parent reads is the one actually being enforced right now — not
    // whatever was in force on the day the row was written.
    const limits: Record<string, number> = {};
    for (const key of Object.keys(CAPABILITY_POLICIES) as CapabilityKey[]) {
      const perDay = CAPABILITY_POLICIES[key].rateLimit?.perDay;
      if (perDay) limits[key] = perDay;
    }
    return Response.json({ usage: rows, limits });
  } catch (e) {
    console.error("[api/parent/learners/:id/usage] failed:", e);
    return Response.json({ error: "Could not read usage" }, { status: 500 });
  }
}
