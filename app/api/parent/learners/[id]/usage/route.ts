import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { usageForParent } from "@/lib/db/queries";
import { getLearnerAiAssignmentForParent } from "@/lib/db/ai-tutor-policies";
import { CAPABILITY_POLICIES } from "@/lib/capabilities/policies";
import type { CapabilityKey } from "@/lib/auth/types";
import { isSameOrigin } from "@/lib/api/guard";

export const runtime = "nodejs";

const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: privateHeaders });
}

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
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const { id } = await ctx.params;
  try {
    const rows = await usageForParent(parent.userId, id, 7);
    if (!rows) return json({ error: "Not found" }, 404);
    const assignment = await getLearnerAiAssignmentForParent(parent.userId, id);

    // Shared capabilities still use the capability map. Full tutor usage is
    // different because each learner has a parent-selected daily limit.
    const limits: Record<string, number> = {};
    for (const key of Object.keys(CAPABILITY_POLICIES) as CapabilityKey[]) {
      if (key === "ai.tutor.full") continue;
      const perDay = CAPABILITY_POLICIES[key].rateLimit?.perDay;
      if (perDay) limits[key] = perDay;
    }
    if (assignment) limits["ai.tutor.full"] = assignment.dailyTurnLimit;
    return json({ usage: rows, limits });
  } catch {
    console.error("[api/parent/learners/:id/usage] failed");
    return json({ error: "Could not read usage" }, 500);
  }
}
