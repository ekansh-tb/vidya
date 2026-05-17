import type { ExamPack } from "../exam-pack";
import type { SubjectId } from "../../types";
import { IGCSE_CS_PACK } from "./igcse-cs";
import { ICSE7_PACKS } from "./icse7-rest";

export const ALL_PACKS: ExamPack[] = [IGCSE_CS_PACK, ...ICSE7_PACKS];

export const PACK_BY_SUBJECT: Partial<Record<SubjectId, ExamPack>> =
  Object.fromEntries(ALL_PACKS.map((p) => [p.subjectId, p])) as Partial<Record<SubjectId, ExamPack>>;

export function packsForSubjects(subjectIds: SubjectId[] | undefined): ExamPack[] {
  if (!subjectIds || subjectIds.length === 0) return [];
  return subjectIds.map((id) => PACK_BY_SUBJECT[id]).filter((p): p is ExamPack => !!p);
}
