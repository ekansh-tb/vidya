import type { SubjectId, ViewName, ViewState } from "../types";

type LegacyLearningResume = {
  version: 1;
  room: "library" | "music" | "creation" | "none";
  bookId?: string;
  updatedAt: string;
};

type CurrentLearningResume =
  | { version: 2; room: "none" | "music" | "creation"; updatedAt: string }
  | { version: 2; room: "library"; bookId: string; updatedAt: string }
  | { version: 2; room: "exam-prep"; subjectId: SubjectId; topicId?: string; updatedAt: string };

export type LearningResume = LegacyLearningResume | CurrentLearningResume;

const safeId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9-]{1,100}$/.test(value);

export function readLearningResume(value: unknown): LearningResume | undefined {
  if (!value || typeof value !== "object") return undefined;
  const r = value as Record<string, unknown>;
  if (![1, 2].includes(Number(r.version)) || typeof r.updatedAt !== "string" || !Number.isFinite(Date.parse(r.updatedAt))) return undefined;
  if (r.version === 1) {
    if (!["library", "music", "creation", "none"].includes(String(r.room))) return undefined;
    if (r.room === "library" && !safeId(r.bookId)) return undefined;
    return { version: 1, room: r.room as LegacyLearningResume["room"], updatedAt: r.updatedAt, ...(r.room === "library" ? { bookId: r.bookId as string } : {}) };
  }
  if (["none", "music", "creation"].includes(String(r.room))) {
    return { version: 2, room: r.room as "none" | "music" | "creation", updatedAt: r.updatedAt };
  }
  if (r.room === "library" && safeId(r.bookId)) {
    return { version: 2, room: "library", bookId: r.bookId, updatedAt: r.updatedAt };
  }
  if (r.room === "exam-prep" && safeId(r.subjectId) && (r.topicId === undefined || safeId(r.topicId))) {
    return { version: 2, room: "exam-prep", subjectId: r.subjectId as SubjectId, ...(r.topicId ? { topicId: r.topicId as string } : {}), updatedAt: r.updatedAt };
  }
  return undefined;
}

export function resumeForNavigation(name: ViewName, params?: Record<string, unknown>, updatedAt = new Date().toISOString()): LearningResume {
  if (name === "music" || name === "creation") return { version: 2, room: name, updatedAt };
  if (name === "exam-prep" && safeId(params?.subjectId) && (params?.topicId === undefined || safeId(params.topicId))) {
    return { version: 2, room: "exam-prep", subjectId: params.subjectId as SubjectId, ...(params.topicId ? { topicId: params.topicId as string } : {}), updatedAt };
  }
  return { version: 2, room: "none", updatedAt };
}

export function viewForLearningResume(value: unknown): ViewState | undefined {
  const resume = readLearningResume(value);
  if (!resume || resume.room === "none") return undefined;
  if (resume.room === "library") return { name: "library", params: { bookId: resume.bookId } };
  if (resume.room === "exam-prep") return { name: "exam-prep", params: { subjectId: resume.subjectId, ...(resume.topicId ? { topicId: resume.topicId } : {}) } };
  return { name: resume.room };
}

/** A newer explicit exit persists so old devices cannot reopen a closed room. */
export function mergeLearningResume(local: LearningResume | undefined, remote: unknown): LearningResume | undefined {
  const a = readLearningResume(local), b = readLearningResume(remote);
  return b && (!a || Date.parse(b.updatedAt) > Date.parse(a.updatedAt)) ? b : a;
}
