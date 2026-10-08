import { describe, expect, it } from "vitest";
import { mergeLearningResume, readLearningResume, resumeForNavigation, viewForLearningResume } from "./resume";
describe("saved learning destination", () => {
  const active = { version: 1 as const, room: "library" as const, bookId: "vidya-red-cup", updatedAt: "2026-10-08T00:00:00Z" };
  it("allows bounded learning rooms, never a private or external destination", () => {
    expect(readLearningResume(active)).toEqual(active);
    expect(readLearningResume({ ...active, room: "admin" })).toBeUndefined();
    expect(readLearningResume({ ...active, bookId: "https://outside.test" })).toBeUndefined();
    expect(readLearningResume({ ...active, updatedAt: "invalid" })).toBeUndefined();
  });
  it("retains an explicit exit through stale device and legacy sync", () => {
    const closed = { version: 2 as const, room: "none" as const, updatedAt: "2026-10-08T00:01:00Z" };
    expect(mergeLearningResume(closed, active)).toEqual(closed);
    expect(mergeLearningResume(active, closed)).toEqual(closed);
    expect(mergeLearningResume(closed, undefined)).toEqual(closed);
  });

  it("restores the exact school topic without changing legacy room records", () => {
    const resume = resumeForNavigation("exam-prep", { subjectId: "cls-maths", topicId: "integers" }, "2026-10-08T00:02:00Z");
    expect(readLearningResume(resume)).toEqual(resume);
    expect(viewForLearningResume(resume)).toEqual({ name: "exam-prep", params: { subjectId: "cls-maths", topicId: "integers" } });
    expect(viewForLearningResume(active)).toEqual({ name: "library", params: { bookId: "vidya-red-cup" } });
  });

  it("rejects malformed topic destinations and clears non-resumable navigation", () => {
    expect(readLearningResume({ version: 2, room: "exam-prep", subjectId: "cls-maths", topicId: "../admin", updatedAt: "2026-10-08T00:02:00Z" })).toBeUndefined();
    expect(resumeForNavigation("quiz", { subjectId: "cls-maths", topicId: "integers" }, "2026-10-08T00:03:00Z")).toEqual({ version: 2, room: "none", updatedAt: "2026-10-08T00:03:00Z" });
  });
  it("round trips an exact point through synchronization and navigation", () => {
    const saved = resumeForNavigation("exam-prep", { subjectId: "cls-maths", topicId: "integers", pointId: "point-abc123" }, "2026-10-08T01:00:00Z");
    expect(viewForLearningResume(readLearningResume(saved))?.params).toEqual({ subjectId: "cls-maths", topicId: "integers", pointId: "point-abc123" });
    expect(mergeLearningResume(active, saved)).toEqual(saved);
    expect(readLearningResume({ ...saved, pointId: "../invalid" })).toBeUndefined();
    expect(readLearningResume({ ...saved, topicId: undefined })).toBeUndefined();
  });
});
