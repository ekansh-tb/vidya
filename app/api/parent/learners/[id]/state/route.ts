import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/api/guard";
import { dbConfigured } from "@/lib/db/client";
import { getLearnerStateForParent } from "@/lib/db/queries";
import { buildParentReportResponse } from "@/lib/parent-report";

export const runtime = "nodejs";

const paramsSchema = z.object({ id: z.uuid() });
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: privateHeaders });
}

/**
 * Return only reporting fields from one learner's synced state.
 *
 * Authentication proves the caller is a parent. The database query separately
 * proves that this parent owns this learner, and returns no row for every other
 * family. The response omits unrelated gameplay state and strips the body of
 * every reflection the learner marked private.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const parsedParams = paramsSchema.safeParse(await ctx.params);
  if (!parsedParams.success) return json({ error: "Not found" }, 404);

  try {
    const source = await getLearnerStateForParent(parent.userId, parsedParams.data.id);
    if (!source) return json({ error: "Not found" }, 404);

    const report = buildParentReportResponse(source);
    if (source.state !== null && report.status === "unavailable") {
      console.error("[api/parent/learners/:id/state] invalid stored report state");
    }
    return json(report);
  } catch (error) {
    console.error("[api/parent/learners/:id/state] failed:", error);
    return json({ error: "Could not read synced progress" }, 500);
  }
}
