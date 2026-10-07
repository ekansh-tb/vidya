export type LearningResume = { version: 1; room: "library" | "music" | "creation" | "none"; bookId?: string; updatedAt: string };

export function readLearningResume(value: unknown): LearningResume | undefined {
  if (!value || typeof value !== "object") return undefined;
  const r = value as Record<string, unknown>;
  if (r.version !== 1 || !["library", "music", "creation", "none"].includes(String(r.room)) || typeof r.updatedAt !== "string" || !Number.isFinite(Date.parse(r.updatedAt))) return undefined;
  if (r.room === "library" && (typeof r.bookId !== "string" || !/^[a-z0-9-]{1,100}$/.test(r.bookId))) return undefined;
  return { version: 1, room: r.room as LearningResume["room"], updatedAt: r.updatedAt, ...(r.room === "library" ? { bookId: r.bookId as string } : {}) };
}

/** A newer explicit exit persists so old devices cannot reopen a closed room. */
export function mergeLearningResume(local: LearningResume | undefined, remote: unknown): LearningResume | undefined {
  const a = readLearningResume(local), b = readLearningResume(remote);
  return b && (!a || Date.parse(b.updatedAt) > Date.parse(a.updatedAt)) ? b : a;
}
