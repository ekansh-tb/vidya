import { describe, it, expect } from "vitest";
import { ACTIVITY_CATALOG } from "./catalog";
import { eligibleActivities, completeActivity, companionUnlocks, mergeActivityState, type ActivityDraft, type LearningActivityState } from "./activity";
import { hasPack } from "../content/packs/pack-index";
const placement = { version: 1, kind: "early-years", level: "ukg" } as const;
const context = { placement, language: "en", day: "2026-10-03", source: "app" } as const;
const activity = ACTIVITY_CATALOG.find(a => a.id === "ukg-language-1")!;
const draft: ActivityDraft = { activityId: activity.id, revision: 1, step: activity.steps.length, picks: [], marks: [], attempts: 3, hints: 1, independentResponses: 1, retries: 1, hinted: false, updatedAt: "2026-10-03T00:00:00Z", startedDay: "2026-10-03" };
describe("reviewed activity coverage", () => {
  it.each(["nursery", "lkg", "ukg"] as const)("provides 30 bilingual activities with six balanced areas for %s", level => {
    for (const language of ["en", "hi"] as const) {
      const available = eligibleActivities(ACTIVITY_CATALOG, { ...placement, level }, language);
      expect(available).toHaveLength(30);
      for (const domain of ["language", "numeracy", "discovery", "creative", "social", "real-world"]) expect(available.filter(a => a.domain === domain)).toHaveLength(5);
      expect(available.every(a => a.review.checks.length === 5 && a.review.limits.includes("not a claim") && a.steps.every(s => s.instruction[language] && s.hint[language] && s.feedback[language]))).toBe(true);
    }
    expect(hasPack("maths", null)).toBe(false);
  });
  it("has stable unique identities and valid answers", () => {
    expect(new Set(ACTIVITY_CATALOG.map(a => a.id)).size).toBe(ACTIVITY_CATALOG.length);
    for (const a of ACTIVITY_CATALOG) for (const step of a.steps) {
      expect(new Set(step.items.map(i => i.id)).size).toBe(step.items.length);
      for (const answer of step.answer?.split("|") ?? []) expect(step.items.some(i => i.id === answer)).toBe(true);
    }
  });
  it("matches each counting answer to a concrete, named group", () => {
    for (const a of ACTIVITY_CATALOG.filter(a => a.interaction === "counting")) {
      const first = a.steps[0];
      expect(first.countingObjects?.length).toBe(Number(first.answer));
      expect(first.countingObjects?.every(o => o.picture && o.label.en && o.label.hi)).toBe(true);
    }
    expect(ACTIVITY_CATALOG.find(a => a.id === "grade-1-explore-1")!.steps[0].answer).toBe("3");
    expect(ACTIVITY_CATALOG.find(a => a.id === "grade-2-explore-1")!.steps[0].answer).toBe("6");
  });
  it("never selects another placement to conceal a gap", () => {
    for (let grade=1; grade<=13; grade++) {
      const available = eligibleActivities(ACTIVITY_CATALOG, {version:1,kind:"school",board:"cbse",grade}, "hi");
      expect(available).toHaveLength(3);
      expect(available.every(a => a.placements.length === 1 && a.placements[0] === `school:${grade}` && a.alignment === "general-exploration")).toBe(true);
    }
  });
  it("UKG final counting explores one fewer instead of duplicating the previous step", () => {
    for (const id of ["ukg-numeracy-1", "ukg-numeracy-2"]) {
      const activity = ACTIVITY_CATALOG.find(a => a.id === id)!;
      const final = activity.steps.at(-1)!;
      expect(activity.revision).toBe(3);
      expect(Number(final.answer)).toBe(Number(activity.steps[0].answer) - 1);
      expect(final.countingObjects).toHaveLength(Number(final.answer));
      expect(final.instruction.en).not.toBe(activity.steps[1].instruction.en);
      expect(final.instruction.hi).not.toBe(activity.steps[1].instruction.hi);
    }
  });
});
describe("participation and rewards", () => {
  it("deduplicates reload, replay and sync retries", () => {
    const first = completeActivity({ completions: [] }, activity, draft, context);
    expect(completeActivity(first, activity, draft, context).completions).toHaveLength(1);
    expect(mergeActivityState(first, first).completions).toHaveLength(1);
    expect(companionUnlocks(first)).toEqual(["leaf"]);
  });
  it("keeps caregiver evidence distinct and rejects wrong source or placement", () => {
    expect(completeActivity({ completions: [] }, activity, draft, {...context, source:"caregiver"}).completions).toHaveLength(0);
    expect(completeActivity({ completions: [] }, activity, draft, {...context, placement:{...placement,level:"lkg"}}).completions).toHaveLength(0);
    expect(completeActivity({ completions: [] }, activity, {...draft, step:0}, context).completions).toHaveLength(0);
  });
  it("keeps unlocks after absences and records delayed revisits", () => {
    let state: LearningActivityState = { completions: [] };
    for (const day of ["2026-09-01","2026-09-03","2026-09-04","2026-09-05","2026-09-10","2026-09-20","2026-10-03"]) state = completeActivity(state, activity, draft, {...context,day});
    expect(companionUnlocks(state)).toEqual(["leaf","scarf","star"]);
    expect(state.completions.at(-1)?.delayedReview).toBe(true);
  });
  it("cannot crash sync on malformed remote activity state", () => {
    expect(mergeActivityState({completions:[]}, {completions:"broken",creations:{bad:"broken"},draft:{}} as unknown as LearningActivityState)).toEqual({completions:[],creations:{},draft:undefined,nextActivityId:undefined});
  });
  it("retains artwork without awarding again", () => {
    const creation = ACTIVITY_CATALOG.find(a => a.id === "ukg-creative-1")!;
    const drawing = {...draft, activityId:creation.id,step:creation.steps.length,marks:["#248781",""]};
    const first = completeActivity({completions:[]}, creation, drawing, context);
    const replay = completeActivity(first, creation, {...drawing,marks:["#d64d46",""]},context);
    expect(replay.completions).toHaveLength(1);
    expect(Object.values(replay.creations!)[0]).toEqual(["#d64d46",""]);
    expect(mergeActivityState(replay,first).creations).toEqual(replay.creations);
  });
});
