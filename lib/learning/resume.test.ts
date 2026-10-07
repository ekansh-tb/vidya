import { describe, expect, it } from "vitest";
import { mergeLearningResume, readLearningResume } from "./resume";
describe("saved learning destination", () => {
  const active = { version: 1 as const, room: "library" as const, bookId: "vidya-red-cup", updatedAt: "2026-10-08T00:00:00Z" };
  it("allows bounded learning rooms, never a private or external destination", () => {
    expect(readLearningResume(active)).toEqual(active);
    expect(readLearningResume({ ...active, room: "admin" })).toBeUndefined();
    expect(readLearningResume({ ...active, bookId: "https://outside.test" })).toBeUndefined();
    expect(readLearningResume({ ...active, updatedAt: "invalid" })).toBeUndefined();
  });
  it("retains an explicit exit through stale device and legacy sync", () => {
    const closed = { version: 1 as const, room: "none" as const, updatedAt: "2026-10-08T00:01:00Z" };
    expect(mergeLearningResume(closed, active)).toEqual(closed);
    expect(mergeLearningResume(active, closed)).toEqual(closed);
    expect(mergeLearningResume(closed, undefined)).toEqual(closed);
  });
});
