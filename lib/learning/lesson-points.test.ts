import { describe, expect, it } from "vitest";
import { lessonPoints, resolveLessonPoint } from "./lesson-points";

const topic = { id: "numbers", title: "Numbers", blurb: "Explore numbers", syllabus: ["Count objects.", "Compare two groups.", "Make ten."] };
describe("lesson positions", () => {
  it("keeps the chosen point when an earlier point is inserted or reordered", () => {
    const saved = lessonPoints(topic, "cbse-1")[1].id;
    const changed = lessonPoints({ ...topic, syllabus: ["A new idea.", ...topic.syllabus] }, "cbse-1");
    expect(resolveLessonPoint(changed, saved)).toEqual({ index: 2, changed: false });
    expect(changed[2].text).toBe("Compare two groups.");
  });
  it("explains a removed, edited or differently scoped point instead of claiming an exact resume", () => {
    const saved = lessonPoints(topic, "cbse-1")[1].id;
    for (const points of [lessonPoints({ ...topic, syllabus: ["New content"] }, "cbse-1"), lessonPoints(topic, "cbse-2")]) {
      expect(resolveLessonPoint(points, saved)).toEqual({ index: 0, changed: true });
    }
  });
  it("supports repeated points and a topic with only an introduction", () => {
    expect(new Set(lessonPoints({ ...topic, syllabus: ["Repeat", "Repeat"] }, "scope").map(p => p.id)).size).toBe(2);
    expect(lessonPoints({ ...topic, syllabus: [] }, "scope")[0].text).toBe(topic.blurb);
    expect(resolveLessonPoint(lessonPoints(topic, "scope"))).toEqual({ index: 0, changed: false });
  });
});
