import { describe, expect, it } from "vitest";
import type { Board, SubjectId } from "../types";
import { pickerGroupsForBoard, SUBJECT_MAP, subjectsForLearner } from "./subjects";

describe("generic subject choices", () => {
  it.each([6, 7, 8])("does not impose a school timetable on Cambridge Grade %i", (grade) => {
    const groups = pickerGroupsForBoard("cambridge-lower-secondary", grade);
    expect(groups.flatMap((g) => g.compulsoryIds || [])).toEqual([]);
    expect(groups.flatMap((g) => g.subjects)).toEqual(expect.arrayContaining([
      "cls-ict", "cls-art", "cls-pe", "cls-music", "cls-marathi", "cls-science", "cls-globalperspectives",
    ]));
  });

  it("does not force English 0500, Maths 0607 or Marathi on IGCSE learners", () => {
    expect(subjectsForLearner("cambridge-igcse", [], 10)).toEqual([]);
    expect(pickerGroupsForBoard("cambridge-igcse", 10).flatMap((g) => g.compulsoryIds || [])).toEqual([]);
  });

  it.each(["cambridge-lower-secondary", "cambridge-igcse", "icse", "cbse"] as Board[])(
    "%s does not infer a regional language mandate", (board) => {
      const groups = pickerGroupsForBoard(board, board === "cambridge-igcse" ? 10 : 7);
      expect(groups.flatMap((g) => g.compulsoryIds || []).filter((id) => /hindi|marathi|sanskrit/.test(id))).toEqual([]);
      expect(JSON.stringify(groups)).not.toMatch(/CNS|Maharashtra|state-mandated|legally required|7th-subject/);
      for (const group of groups) {
        for (const id of group.subjects) expect(SUBJECT_MAP[id]).toBeDefined();
        for (const id of group.compulsoryIds || []) expect(group.subjects).toContain(id);
      }
    },
  );

  it("preserves chosen subject IDs across grade changes without mutating saved choices", () => {
    const chosen: SubjectId[] = ["cls-marathi", "cls-art", "cls-pe", "cls-music", "cls-hobby", "cls-science", "cls-physics"];
    const original = [...chosen];
    for (const grade of [6, 8]) {
      expect(subjectsForLearner("cambridge-lower-secondary", chosen, grade).map((s) => s.id).sort()).toEqual([...chosen].sort());
    }
    expect(chosen).toEqual(original);
  });

  it("retains regional languages when learners explicitly chose them", () => {
    expect(subjectsForLearner("icse", ["icse-marathi", "icse-hindi"], 7).map((s) => s.id))
      .toEqual(expect.arrayContaining(["icse-marathi", "icse-hindi"]));
    expect(subjectsForLearner("cambridge-igcse", ["igcse-marathi"], 10).map((s) => s.id)).toEqual(["igcse-marathi"]);
  });
});
