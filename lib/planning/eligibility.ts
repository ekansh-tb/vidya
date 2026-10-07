import { activitySchema, reviewSchema, type ContentRevision } from "@/lib/admin/contracts";
import type { LearningPlacement } from "@/lib/learning/placement";
import { PUBLISHED_SCHOOL_GRADES } from "@/lib/learning/release";

/** Placement comes from the authenticated database profile, never a plan body. */
export function assignmentActivities(records: ContentRevision[], placement: LearningPlacement | null) {
  if (!placement || (placement.kind === "school" && !PUBLISHED_SCHOOL_GRADES.includes(placement.grade))) return [];
  const key = placement.kind === "early-years" ? placement.level : `school:${placement.grade}`;
  return records.filter(record => record.status === "published" && Boolean(record.publishedAt && record.reviewedAt && record.reviewedBy) && reviewSchema.safeParse(record.reviewRecord).success)
    .flatMap(record => {
      const parsed = activitySchema.safeParse(record.payload);
      return parsed.success && parsed.data.id === record.id && parsed.data.revision === record.revision && parsed.data.placements.includes(key) ? [parsed.data] : [];
    });
}
