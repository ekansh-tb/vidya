import type { LearningActivity } from "./activity";

/** Surface a choice from each available area before repeating an area. */
export function variedActivities(activities: LearningActivity[], limit: number): LearningActivity[] {
  const first = activities.filter((activity, index) => activities.findIndex(other => other.domain === activity.domain) === index);
  const selected = new Set(first.map(activity => activity.id));
  return [...first, ...activities.filter(activity => !selected.has(activity.id))].slice(0, limit);
}
