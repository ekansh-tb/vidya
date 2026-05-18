import type { ExamPack } from "../exam-pack";
import type { SubjectId } from "../../types";
import { IGCSE_CS_PACK } from "./igcse-cs";
import { ICSE7_PACKS } from "./icse7-rest";
import { ICSE6_PACKS } from "./icse6";
import { ICSE_LANGUAGE_PACKS } from "./icse-languages";
import { CBSE7_MATHS } from "./cbse7-maths";
import { CBSE7_SCIENCE } from "./cbse7-science";
import { CBSE7_ENGLISH } from "./cbse7-english";

export const ALL_PACKS: ExamPack[] = [
  IGCSE_CS_PACK,
  ...ICSE7_PACKS,
  ...ICSE6_PACKS,
  ...ICSE_LANGUAGE_PACKS,
  CBSE7_MATHS,
  CBSE7_SCIENCE,
  CBSE7_ENGLISH,
];

/**
 * Look up the best matching exam pack for a (subjectId, grade) combo.
 * - Exact grade match wins.
 * - Else, any pack with that subjectId.
 * - Else undefined.
 */
export function packFor(subjectId: SubjectId, grade?: number): ExamPack | undefined {
  if (grade != null) {
    const exact = ALL_PACKS.find((p) => p.subjectId === subjectId && p.grade === grade);
    if (exact) return exact;
  }
  return ALL_PACKS.find((p) => p.subjectId === subjectId);
}

/** All packs that exist for a given subjectId, sorted by grade ascending. */
export function packsForSubjectAcrossGrades(subjectId: SubjectId): ExamPack[] {
  return ALL_PACKS
    .filter((p) => p.subjectId === subjectId)
    .sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0));
}

/** All packs available to a learner — picks the best grade match per subject. */
export function packsForSubjects(
  subjectIds: SubjectId[] | undefined,
  grade?: number,
): ExamPack[] {
  if (!subjectIds || subjectIds.length === 0) return [];
  return subjectIds
    .map((id) => packFor(id, grade))
    .filter((p): p is ExamPack => !!p);
}

// Legacy export — kept for callers that don't yet pass grade.
// Returns the first pack found per subjectId (which will be IGCSE-CS for igcse-cs,
// ICSE Class 7 for icse-* by registration order). Prefer packFor(id, grade).
export const PACK_BY_SUBJECT: Partial<Record<SubjectId, ExamPack>> =
  Object.fromEntries(ALL_PACKS.map((p) => [p.subjectId, p])) as Partial<Record<SubjectId, ExamPack>>;
