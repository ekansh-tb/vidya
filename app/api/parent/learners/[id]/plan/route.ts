import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { getLearnerForParent } from "@/lib/db/queries";
import { isSameOrigin } from "@/lib/api/guard";
import { loadPlanResponse, savePlanResponse, planResponse } from "@/lib/planning/service";
import { z } from "zod";
export const runtime = "nodejs";
async function owned(context: { params: Promise<{ id: string }> }) {
  const parent = await requireParent();
  if (!parent) return false;
  const { id } = await context.params;
  return z.string().uuid().safeParse(id).success ? getLearnerForParent(parent.userId, id) : null;
}
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  if (!dbConfigured()) return planResponse({ error: "Planning storage is unavailable." }, 503);
  try { const learner = await owned(context); return learner === false ? planResponse({ error: "Unauthorized" }, 401) : learner ? await loadPlanResponse(learner) : planResponse({ error: "Learner not found." }, 404); }
  catch { return planResponse({ error: "The plan could not be loaded. Please try again." }, 503); }
}
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return planResponse({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return planResponse({ error: "Planning storage is unavailable." }, 503);
  try { const learner = await owned(context); return learner === false ? planResponse({ error: "Unauthorized" }, 401) : learner ? await savePlanResponse(req, learner) : planResponse({ error: "Learner not found." }, 404); }
  catch { return planResponse({ error: "The plan could not be saved. Keep your edits and try again." }, 503); }
}
