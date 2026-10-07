import { activitySchema } from "@/lib/admin/contracts";
import type { LearningActivity } from "./activity";
const PREFIX = "vidya-public-content-v1:";
const MAX_BYTES = 2_000_000;
/** Only public reviewed learning assets. No learner identity or progress is stored here. */
export function parsePublicActivities(raw: unknown, placement: string): LearningActivity[] | null {
  if (!Array.isArray(raw) || raw.length > 500) return null;
  const results = raw.map(a => activitySchema.safeParse(a));
  if (results.some(r => !r.success)) return null;
  const activities = results.map(r => r.data!);
  return activities.every(a => a.placements.includes(placement)) ? activities : null;
}
export function readPublicActivities(cacheKey: string, placement: string): LearningActivity[] | null {
  try { const raw = localStorage.getItem(PREFIX + cacheKey); if (!raw || raw.length > MAX_BYTES) return null; return parsePublicActivities(JSON.parse(raw), placement); } catch { return null; }
}
export function writePublicActivities(cacheKey: string, activities: LearningActivity[]) {
  try { const raw = JSON.stringify(activities); if (raw.length <= MAX_BYTES) localStorage.setItem(PREFIX + cacheKey, raw); } catch { /* Full or unavailable storage does not discard a successful online response. */ }
}
