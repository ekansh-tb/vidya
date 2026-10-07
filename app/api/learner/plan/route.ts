import { requireLearnerFrom } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { isSameOrigin } from "@/lib/api/guard";
import { loadPlanResponse, savePlanResponse, planResponse } from "@/lib/planning/service";
export const runtime = "nodejs";
export async function GET(req: Request) {
  if (!dbConfigured()) return planResponse({ error: "Link this learner to save a family plan." }, 503);
  try { const identity = await requireLearnerFrom(req); return identity ? await loadPlanResponse(identity.learner) : planResponse({ error: "Please link this learner again." }, 401); }
  catch { return planResponse({ error: "The plan could not be loaded. Please try again." }, 503); }
}
export async function PUT(req: Request) {
  if (!isSameOrigin(req)) return planResponse({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return planResponse({ error: "Planning storage is unavailable." }, 503);
  try { const identity = await requireLearnerFrom(req); return identity ? await savePlanResponse(req, identity.learner) : planResponse({ error: "Please link this learner again." }, 401); }
  catch { return planResponse({ error: "The plan could not be saved. Keep your edits and try again." }, 503); }
}
