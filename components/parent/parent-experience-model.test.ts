import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "@/lib/game-store";
import type { ActivityCompletion } from "@/lib/learning/activity";
import { familyParticipation, familyParticipationReport, parseParentAppearance, PARENT_DESTINATIONS } from "./parent-experience-model";

const now = new Date(2026, 9, 8, 12);
const record = (patch: Partial<ActivityCompletion> = {}): ActivityCompletion => ({
  key: "activity@1:2026-10-08:app", activityId: "activity", revision: 1, placement: "early-years:nursery", language: "en", day: "2026-10-08", source: "app", attempts: 3, independentResponses: 1, hints: 1, retries: 1, creation: false, delayedReview: false, ...patch,
});

describe("parent experience", () => {
  it("keeps exactly three named destinations and an independent light default", () => {
    expect(PARENT_DESTINATIONS).toEqual(["Overview", "Children", "Controls"]);
    expect(parseParentAppearance(null)).toBe("light");
    expect(parseParentAppearance("corrupted")).toBe("light");
    expect(parseParentAppearance("dark")).toBe("dark");
    expect(parseParentAppearance("system")).toBe("system");
  });
  it("counts only the last seven local calendar days and distinguishes caregiver evidence", () => {
    const state = { activities: { completions: [record(), record({ key: "caregiver", source: "caregiver", day: "2026-10-02", creation: true }), record({ key: "old", day: "2026-10-01" }), record({ key: "future", day: "2026-10-09" })] } };
    const result = familyParticipation(state, now);
    expect(result.window).toBe("2026-10-02 to 2026-10-08");
    expect(result.appCompletions).toBe(1);
    expect(result.caregiverReports).toBe(1);
    expect(result.completedCreations).toBe(1);
    expect(result.days[0]).toMatchObject({ day: "2026-10-02", app: false, caregiver: true });
  });
  it("deduplicates synchronized completion identities", () => {
    const result = familyParticipation({ activities: { completions: [record(), record()] } }, now);
    expect(result.appCompletions).toBe(1);
    expect(result.attempts).toBe(3);
  });
  it("keeps absence of evidence separate from inferred activity", () => {
    const result = familyParticipation(DEFAULT_STATE, now);
    expect(result.appCompletions).toBe(0);
    expect(result.days.every(day => !day.app && !day.caregiver)).toBe(true);
  });
  it("never reads or exports reflection bodies, transcript text, private notes or creation contents", () => {
    const state = {
      ...DEFAULT_STATE,
      activities: { completions: [record()], creations: { drawing: ["PRIVATE DRAWING"] } },
      dailyReflections: [{ date: "2026-10-08", savedAt: now.toISOString(), body: "PRIVATE JOURNAL", private: true }, { date: "2026-10-08", savedAt: now.toISOString(), body: "LEGACY SHARED JOURNAL", private: false }],
      notebook: { secret: "PRIVATE NOTE" },
      transcript: "PRIVATE AI CHAT",
    };
    const output = familyParticipationReport("Learner", "Nursery", state, now);
    for (const secret of ["PRIVATE DRAWING", "PRIVATE JOURNAL", "LEGACY SHARED JOURNAL", "PRIVATE NOTE", "PRIVATE AI CHAT"]) expect(output).not.toContain(secret);
    expect(output).toContain("Completion is participation, not proof of understanding");
  });
});
