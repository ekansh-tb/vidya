import { eligibleActivities, type LearningActivity, type LearningLanguage } from "./activity";
import { ACTIVITY_CATALOG } from "./catalog";
import { placementFor } from "./placement";
import { PUBLISHED_SCHOOL_GRADES } from "./release";
import type { LearnerProfile } from "../types";

export function hubActivities(learner: Pick<LearnerProfile, "board" | "grade" | "placement">, language: LearningLanguage): LearningActivity[] {
  const placement = placementFor(learner);
  if (!placement || (placement.kind === "school" && !PUBLISHED_SCHOOL_GRADES.includes(placement.grade))) return [];
  return eligibleActivities(ACTIVITY_CATALOG, placement, language);
}

/** Surface a choice from each available area before repeating an area. */
export function variedActivities(activities: LearningActivity[], limit: number): LearningActivity[] {
  const first = activities.filter((activity, index) => activities.findIndex(other => other.domain === activity.domain) === index);
  const selected = new Set(first.map(activity => activity.id));
  return [...first, ...activities.filter(activity => !selected.has(activity.id))].slice(0, limit);
}
