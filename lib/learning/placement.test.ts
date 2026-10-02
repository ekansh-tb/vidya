import { describe, it, expect } from "vitest";
import { placementFor, profilePlacementFields } from "./placement";
import { migrateProfiles } from "../storage";
import { serializeBackup, parseBackup } from "../backup";
import type { LearnerProfile } from "../types";
describe("placement compatibility", () => {
  it("retains school identity, family credentials, balance and historical state", () => {
    const learner = { id: "same", board: "cbse", grade: 4, remoteId: "family", deviceToken: "local-secret", createdAt: "now", name: "Fixture", state: { xp: 321, streak: 8 } } as unknown as LearnerProfile;
    const migrated = migrateProfiles({ version: 2, currentLearnerId: "same", learners: { same: learner } });
    expect(migrated.version).toBe(3);
    expect(migrated.learners.same).toMatchObject(learner);
    expect(migrated.learners.same.placement).toEqual({ version: 1, kind: "school", board: "cbse", grade: 4 });
  });
  it.each(["nursery", "lkg", "ukg"] as const)("round trips %s without a fabricated grade", level => {
    const learner = { id: "early", name: "Fixture", createdAt: "now", board: null, grade: null, placement: { version: 1, kind: "early-years", level }, state: { xp: 30 } } as unknown as LearnerProfile;
    const result = parseBackup(serializeBackup({ version: 3, currentLearnerId: "early", learners: { early: learner } }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.profiles.learners.early.placement).toEqual(learner.placement);
    expect(placementFor(learner)).toEqual(learner.placement);
  });
  it("rejects forged or conflicting placement and missing preschool level", () => {
    for (const placement of [{ version: 1, kind: "early-years", level: "ukg" }, { version: 1, kind: "school", board: "cbse", grade: 7 }]) {
      expect(profilePlacementFields.safeParse({ board: "cbse", grade: 5, placement }).success).toBe(false);
    }
    expect(profilePlacementFields.safeParse({ board: null, grade: null }).success).toBe(false);
    expect(placementFor({ board: "cbse", grade: 1.5 })).toBeNull();
  });
});
