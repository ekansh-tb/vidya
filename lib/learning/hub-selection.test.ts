import { describe, expect, it } from "vitest";
import { ACTIVITY_CATALOG } from "./catalog";
import { eligibleActivities } from "./activity";
import { hubActivities, variedActivities } from "./hub-selection";

describe("home activity choices", () => {
  it("opens only published content at the learner's exact placement", () => {
    const nursery = hubActivities({ board: null, grade: null, placement: { version: 1, kind: "early-years", level: "nursery" } }, "hi");
    expect(nursery).toHaveLength(30);
    expect(nursery.every(activity => activity.placements.includes("nursery"))).toBe(true);
    const school = hubActivities({ board: "cbse", grade: 2 }, "en");
    expect(school).toHaveLength(3);
    expect(school.every(activity => activity.placements.includes("school:2"))).toBe(true);
    expect(hubActivities({ board: "cbse", grade: 5 }, "en")).toEqual([]);
    expect(hubActivities({ board: null, grade: null }, "en")).toEqual([]);
  });
  it("offers all six nursery areas without moving another placement into the collection", () => {
    const available = eligibleActivities(ACTIVITY_CATALOG, { version: 1, kind: "early-years", level: "nursery" }, "en");
    const choices = variedActivities(available, 6);
    expect(new Set(choices.map(activity => activity.domain)).size).toBe(6);
    expect(choices.every(activity => activity.placements.includes("nursery"))).toBe(true);
    expect(new Set(choices.map(activity => activity.id)).size).toBe(6);
  });
  it("preserves every filtered activity when expanded and handles empty coverage", () => {
    const available = ACTIVITY_CATALOG.filter(activity => activity.placements.includes("lkg") && activity.domain === "language");
    expect(variedActivities(available, available.length)).toEqual(available);
    expect(variedActivities([], 6)).toEqual([]);
  });
});
