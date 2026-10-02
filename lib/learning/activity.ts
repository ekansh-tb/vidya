import type { LearningPlacement } from "./placement";
export type LearningLanguage = "en" | "hi";
export type Bilingual = Record<LearningLanguage, string>;
export type ActivityDomain = "language" | "numeracy" | "discovery" | "creative" | "social" | "real-world";
export type ActivityItem = { id: string; picture: string; pictureHi?: string; label: Bilingual };
export type ActivityStep = { instruction: Bilingual; hint: Bilingual; items: ActivityItem[]; answer?: string; feedback: Bilingual };
export type LearningActivity = {
  id: string; revision: number; placements: string[]; domain: ActivityDomain;
  title: Bilingual; objective: Bilingual;
  interaction: "matching" | "sorting" | "counting" | "sequence" | "creation" | "investigation" | "simulation" | "offline";
  steps: ActivityStep[]; offline: Bilingual; caregiver: Bilingual;
  alignment: "ncf-foundational" | "general-exploration";
  source: string; rights: "original-text-and-system-emoji";
  review: { status: "reviewed"; method: "source-grounded-editorial"; date: string; checks: string[]; limits: string };
  completion: "participated-in-all-steps" | "saved-creation" | "caregiver-reported";
};
export type ActivityDraft = {
  activityId: string; revision: number; step: number; picks: string[]; marks: string[];
  attempts: number; independentResponses: number; hints: number; retries: number;
  hinted: boolean; stepRetries?: number; paused?: boolean; updatedAt: string; startedDay: string;
};
export type ActivityCompletion = {
  key: string; activityId: string; revision: number; placement: string; language: LearningLanguage;
  day: string; source: "app" | "caregiver"; attempts: number; independentResponses: number;
  hints: number; retries: number; creation: boolean; delayedReview: boolean;
};
export type LearningActivityState = { draft?: ActivityDraft; completions: ActivityCompletion[]; creations?: Record<string, string[]>; nextActivityId?: string };
export function placementKey(placement: LearningPlacement): string {
  return placement.kind === "early-years" ? placement.level : `school:${placement.grade}`;
}
export function eligibleActivities(catalog: LearningActivity[], placement: LearningPlacement, language: LearningLanguage): LearningActivity[] {
  return catalog.filter(a => a.review.status === "reviewed" && a.placements.includes(placementKey(placement)) && a.title[language] && a.objective[language]);
}
export function completionKey(id: string, revision: number, day: string, source: "app" | "caregiver") { return `${id}@${revision}:${day}:${source}`; }
export function completeActivity(current: LearningActivityState, activity: LearningActivity, draft: ActivityDraft, context: { placement: LearningPlacement; language: LearningLanguage; day: string; source: "app" | "caregiver" }): LearningActivityState {
  if ((activity.interaction === "offline") !== (context.source === "caregiver")) return current;
  if (!activity.placements.includes(placementKey(context.placement)) || draft.activityId !== activity.id || draft.revision !== activity.revision || draft.step < activity.steps.length) return current;
  const key = completionKey(activity.id, activity.revision, context.day, context.source);
  const creations = activity.interaction === "creation" ? { ...current.creations, [key]: [...draft.marks] } : current.creations;
  if (current.completions.some(c => c.key === key)) return { ...current, draft: undefined, creations };
  const previous = current.completions.filter(c => c.activityId === activity.id && c.source === "app").map(c => c.day).sort().at(-1);
  const delayedReview = context.source === "app" && !!previous && Date.parse(context.day) - Date.parse(previous) >= 3 * 86_400_000;
  const event: ActivityCompletion = { key, activityId: activity.id, revision: activity.revision, placement: placementKey(context.placement), language: context.language, day: context.day, source: context.source, attempts: draft.attempts, independentResponses: draft.independentResponses, hints: draft.hints, retries: draft.retries, creation: activity.interaction === "creation", delayedReview };
  return { ...current, draft: undefined, creations, completions: [...current.completions, event] };
}
export function distinctLearningDays(state: LearningActivityState): string[] { return [...new Set(state.completions.map(c => c.day))].sort(); }
export function companionUnlocks(state: LearningActivityState): string[] {
  const days = distinctLearningDays(state).length;
  return [days >= 1 ? "leaf" : "", days >= 3 ? "scarf" : "", days >= 7 ? "star" : ""].filter(Boolean);
}
export function mergeActivityState(local?: LearningActivityState, remote?: LearningActivityState): LearningActivityState {
  const records = new Map<string, ActivityCompletion>();
  const safeCompletions = (state?: LearningActivityState): ActivityCompletion[] => Array.isArray(state?.completions) ? state.completions : [];
  for (const item of [...safeCompletions(remote), ...safeCompletions(local)]) {
    if (!item || ![item.attempts,item.hints,item.retries,item.independentResponses,item.revision].every(v => typeof v === "number" && Number.isFinite(v) && v >= 0) || typeof item.key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.day) || !["app", "caregiver"].includes(item.source)) continue;
    const existing = records.get(item.key);
    records.set(item.key, existing ? { ...existing, ...item, attempts: Math.max(existing.attempts, item.attempts), hints: Math.max(existing.hints, item.hints), retries: Math.max(existing.retries, item.retries), independentResponses: Math.min(existing.independentResponses, item.independentResponses), delayedReview: existing.delayedReview || item.delayedReview } : item);
  }
  const drafts = [local?.draft, remote?.draft].filter((d): d is ActivityDraft => !!d && typeof d.updatedAt === "string" && Array.isArray(d.marks) && Array.isArray(d.picks) && Number.isInteger(d.step) && d.step >= 0).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  const safeCreations = (state?: LearningActivityState): Record<string,string[]> => state?.creations && typeof state.creations === "object" ? Object.fromEntries(Object.entries(state.creations).filter(([k,v]) => k.length <= 240 && Array.isArray(v) && v.length <= 64 && v.every(c => c === "" || /^#[0-9a-f]{6}$/i.test(c)))) : {};
  return { creations: { ...safeCreations(remote), ...safeCreations(local) }, completions: [...records.values()].sort((a,b) => a.key.localeCompare(b.key)), draft: drafts[0], nextActivityId: local?.nextActivityId ?? remote?.nextActivityId };
}
