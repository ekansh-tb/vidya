import { SUBJECT_MAP, subjectsForLearner } from "../content/subjects";
import { hasPack } from "../content/packs/pack-index";
import { placementFor, samePlacement, placementSchema, type LearningPlacement } from "./placement";
import type { LearnerProfile, SubjectId, ViewName, ViewState } from "../types";

type LegacyLearningResume = {
  version: 1;
  room: "library" | "music" | "creation" | "none";
  bookId?: string;
  updatedAt: string;
};

type CurrentLearningResume =
  | { version: 2; room: "none" | "music" | "creation" | "visual-lab"; updatedAt: string }
  | { version: 2; room: "library"; bookId: string; updatedAt: string }
  | { version: 2; room: "exam-prep"; subjectId: SubjectId; topicId?: string; pointId?: string; placement?: LearningPlacement; updatedAt: string };

export type LearningResume = LegacyLearningResume | CurrentLearningResume;

const knownSubject = (value: unknown): value is SubjectId =>
  typeof value === "string" && Object.hasOwn(SUBJECT_MAP, value);

const safeId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9-]{1,100}$/.test(value);

export function readLearningResume(value: unknown): LearningResume | undefined {
  if (!value || typeof value !== "object") return undefined;
  const r = value as Record<string, unknown>;
  if ((r.version !== 1 && r.version !== 2) || typeof r.updatedAt !== "string" || !Number.isFinite(Date.parse(r.updatedAt))) return undefined;
  if (r.version === 1) {
    if (!["library", "music", "creation", "none"].includes(String(r.room))) return undefined;
    if (r.room === "library" && !safeId(r.bookId)) return undefined;
    return { version: 1, room: r.room as LegacyLearningResume["room"], updatedAt: r.updatedAt, ...(r.room === "library" ? { bookId: r.bookId as string } : {}) };
  }
  if (["none", "music", "creation", "visual-lab"].includes(String(r.room))) {
    return { version: 2, room: r.room as "none" | "music" | "creation" | "visual-lab", updatedAt: r.updatedAt };
  }
  if (r.room === "library" && safeId(r.bookId)) {
    return { version: 2, room: "library", bookId: r.bookId, updatedAt: r.updatedAt };
  }
  if (r.room === "exam-prep" && knownSubject(r.subjectId) && (r.topicId === undefined || safeId(r.topicId))) {
    if (r.pointId !== undefined && (!safeId(r.pointId) || !r.topicId)) return undefined;
    const placement = r.placement === undefined ? undefined : placementSchema.safeParse(r.placement);
    if (placement && (!placement.success || placement.data.kind !== "school")) return undefined;
    return { version: 2, room: "exam-prep", ...(placement?.success ? { placement: placement.data } : {}), subjectId: r.subjectId, ...(r.topicId ? { topicId: r.topicId as string } : {}), ...(r.pointId ? { pointId: r.pointId as string } : {}), updatedAt: r.updatedAt };
  }
  return undefined;
}

export function resumeForNavigation(name: ViewName, params?: Record<string, unknown>, updatedAt = new Date().toISOString(), placement?: LearningPlacement): LearningResume {
  if (name === "music" || name === "creation" || name === "visual-lab") return { version: 2, room: name, updatedAt };
  if (name === "exam-prep" && knownSubject(params?.subjectId) && (params?.topicId === undefined || safeId(params.topicId))) {
    return { version: 2, room: "exam-prep", ...(placement ? { placement } : {}), subjectId: params.subjectId, ...(params.topicId ? { topicId: params.topicId as string } : {}), ...(params.topicId && safeId(params.pointId) ? { pointId: params.pointId } : {}), updatedAt };
  }
  return { version: 2, room: "none", updatedAt };
}

export function viewForLearningResume(value: unknown, learner?: LearnerProfile): ViewState | undefined {
  const resume = readLearningResume(value);
  if (!resume || resume.room === "none") return undefined;
  if (resume.room === "exam-prep" && learner) {
    const placement = placementFor(learner);
    if (placement?.kind !== "school" || (resume.placement && !samePlacement(resume.placement, placement))) return undefined;
    if (!subjectsForLearner(placement.board, learner.pickedSubjects, placement.grade).some(subject => subject.id === resume.subjectId) || !hasPack(resume.subjectId, placement.grade)) return undefined;
  }
  if (resume.room === "library") return { name: "library", params: { bookId: resume.bookId } };
  if (resume.room === "exam-prep") return { name: "exam-prep", params: { subjectId: resume.subjectId, ...(resume.topicId ? { topicId: resume.topicId } : {}), ...("pointId" in resume && resume.pointId ? { pointId: resume.pointId } : {}) } };
  return { name: resume.room };
}

/** A newer explicit exit persists so old devices cannot reopen a closed room. */
export function mergeLearningResume(local: LearningResume | undefined, remote: unknown): LearningResume | undefined {
  const a = readLearningResume(local), b = readLearningResume(remote);
  return b && (!a || Date.parse(b.updatedAt) > Date.parse(a.updatedAt)) ? b : a;
}
