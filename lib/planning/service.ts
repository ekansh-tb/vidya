import "server-only";
import type { LearnerRow } from "@/lib/db/queries";
import { databasePlacement, readLearningPlan, saveLearningPlan } from "@/lib/db/learning-plans";
import { listContent } from "@/lib/db/admin";
import { assignmentActivities } from "./eligibility";
import { planSaveSchema, planConflicts } from "./contracts";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { rateLimit } from "@/lib/api/guard";

export const privatePlanHeaders = { "Cache-Control": "private, no-store", Vary: "Cookie, x-vidya-device" };
export function planResponse(data: unknown, status = 200) { return Response.json(data, { status, headers: privatePlanHeaders }); }
export async function loadPlanResponse(learner: LearnerRow) {
  const stored = await readLearningPlan(learner);
  const records = await listContent();
  const placement = databasePlacement(learner);
  const activities = assignmentActivities(records, placement);
  // Only previously scheduled identities can preview an archived, published revision.
  const retained = records.filter(record => record.status === "archived" && stored.plan.sessions.some(session => session.activityId === record.id && session.revision === record.revision));
  const historical = assignmentActivities(retained.map(record => ({ ...record, status: "published" as const })), placement);
  return planResponse({ ...stored, activities, assignedActivities: [...activities, ...historical] });
}
export async function savePlanResponse(req: Request, learner: LearnerRow) {
  const rate = await rateLimit(`learning-plan:${learner.id}`, { limit: 30, windowMs: 600_000 });
  if (!rate.ok) return planResponse({ error: "Please try again later." }, rate.unavailable ? 503 : 429);
  const raw = await readBoundedJson(req, 32_000);
  if (!raw.ok) return planResponse({ error: "The plan could not be read." }, raw.reason === "too_large" ? 413 : 400);
  const parsed = planSaveSchema.safeParse(raw.value);
  if (!parsed.success) return planResponse({ error: "Check the plan’s dates, times and labels." }, 400);
  const conflicts = planConflicts(parsed.data.plan);
  if (conflicts.some(item => item.blocking)) return planResponse({ error: "Resolve activity time conflicts before saving.", conflicts }, 400);
  const revision = await saveLearningPlan(learner, parsed.data.plan, parsed.data.expectedRevision);
  if (revision === false) return planResponse({ error: "The saved plan, learner placement or published activities changed. Reload the saved plan before trying again." }, 409);
  return planResponse({ revision, plan: parsed.data.plan });
}
