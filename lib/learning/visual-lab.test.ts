import { describe, expect, it } from "vitest";
import { graphValue, labValues, mergeVisualLab, visualLabFor } from "./visual-lab";
import { mergeGameState } from "../sync/merge";
import { DEFAULT_STATE } from "../game-store";
import { resumeForNavigation, viewForLearningResume } from "./resume";

describe("placement-specific visual exploration", () => {
  it("selects all exact levels, never an assumed default", () => {
    const ids = new Set<string>();
    for (let grade = 1; grade <= 13; grade++) ids.add(visualLabFor({ board: "cbse", grade })!.id);
    for (const level of ["nursery", "lkg", "ukg"] as const) {
      const lab = visualLabFor({ board: null, grade: null, placement: { version: 1, kind: "early-years", level } })!;
      ids.add(lab.id); expect(lab.model).toBe("count");
    }
    expect(ids.size).toBe(16);
    expect(visualLabFor({ board: null, grade: null })).toBeUndefined();
    expect(visualLabFor({ board: "cbse", grade: 0 })).toBeUndefined();
  });
  it("bounds saved controls and does not carry content across a placement correction", () => {
    const lab = visualLabFor({ board: "cbse", grade: 4 })!;
    const saved = { version: 1 as const, id: lab.id, placementKey: lab.placementKey, a: 90, b: -5, c: 99, updatedAt: "2026-10-08T08:00:00Z" };
    expect(labValues(lab, saved)).toEqual({ a: 2, b: 2, c: 3 });
    expect(labValues(visualLabFor({ board: "cbse", grade: 5 })!, saved)).toEqual({ a: 2, b: 4, c: 2 });
    expect(labValues(lab, { ...saved, placementKey: "icse:4" })).toEqual({ a: 2, b: 4, c: 2 });
  });
  it("syncs the newer setup without losing an offline edit or accepting malformed data", () => {
    const lab = visualLabFor({ board: "cbse", grade: 7 })!;
    const first = { version: 1 as const, id: lab.id, placementKey: lab.placementKey, a: 25, b: 1, c: 2, updatedAt: "2026-10-08T08:00:00Z" };
    const next = { ...first, a: 65, updatedAt: "2026-10-08T09:00:00Z" };
    expect(mergeVisualLab(first, next)).toEqual(next);
    expect(mergeVisualLab(next, first)).toEqual(next);
    expect(mergeVisualLab(next, { ...next, a: Infinity })).toEqual(next);
    expect(mergeGameState({ ...DEFAULT_STATE, visualLab: first }, { ...DEFAULT_STATE, visualLab: next }).visualLab).toEqual(next);
    expect(viewForLearningResume(resumeForNavigation("visual-lab"))).toEqual({ name: "visual-lab" });
  });
  it("calculates models correctly at negative, zero and positive values", () => {
    expect(graphValue("line", -2, 3, 1)).toBe(-5);
    expect(graphValue("quadratic", -2, -2, 1)).toBe(-7);
    expect(graphValue("wave", Math.PI / 2, 3, 1)).toBeCloseTo(3);
    expect(graphValue("tangent", -3, 0, 0)).toBe(9);
    expect(graphValue("line", 0, 0, 0)).toBe(0);
  });
});
