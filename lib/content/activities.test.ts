import { describe, expect, it } from "vitest";
import { ACTIVITIES, ACTIVITY_MAP, activitySeconds, activityMinutesLabel } from "./activities";
import { subjectsForLearner } from "./subjects";

describe("Move Break activities", () => {
  it("has unique ids", () => {
    const ids = ACTIVITIES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every activity a real safety brief — the UI shows it before the timer", () => {
    for (const a of ACTIVITIES) {
      expect(a.safety.trim().length, `${a.id} safety`).toBeGreaterThan(40);
      expect(a.needs.trim().length, `${a.id} needs`).toBeGreaterThan(0);
    }
  });

  it("gives every step a cue, since the cue is all a moving child can read", () => {
    for (const a of ACTIVITIES) {
      expect(a.steps.length, `${a.id} steps`).toBeGreaterThan(2);
      for (const s of a.steps) {
        expect(s.cue.trim().length, `${a.id}/${s.label}`).toBeGreaterThan(0);
        expect(s.secs).toBeGreaterThan(0);
        expect(s.secs).toBeLessThanOrEqual(60);
      }
    }
  });

  it("keeps every activity inside a break-sized window", () => {
    for (const a of ACTIVITIES) {
      const secs = activitySeconds(a);
      expect(secs, `${a.id}`).toBeGreaterThan(60);
      expect(secs, `${a.id}`).toBeLessThanOrEqual(300);
    }
  });

  it("includes gymnastics, which is what was asked for", () => {
    expect(ACTIVITIES.some((a) => a.kind === "gymnastics")).toBe(true);
  });

  it("excludes the skills a child must not try unsupervised", () => {
    // Guards the rule written at the top of activities.ts. If someone adds a
    // flip or a headstand later, this fails before a child reads it.
    const banned = [
      "headstand", "handstand", "backbend", "kickover", "handspring",
      "flip", "somersault", "aerial", "vault", "back tuck", "dive roll",
    ];
    const haystack = ACTIVITIES.flatMap((a) => [
      a.name, a.tagline, a.safety, ...a.steps.flatMap((s) => [s.label, s.cue]),
    ]).join(" ").toLowerCase();
    for (const word of banned) {
      expect(haystack, `"${word}" must not appear in an unsupervised activity`)
        .not.toContain(word);
    }
  });

  it("maps and labels durations", () => {
    expect(Object.keys(ACTIVITY_MAP)).toHaveLength(ACTIVITIES.length);
    expect(activityMinutesLabel(ACTIVITIES[0])).toMatch(/min|sec/);
  });
});

describe("Art at Grade 6", () => {
  it("is on the timetable, so it is not something the learner has to pick", () => {
    const ids = subjectsForLearner("cambridge-lower-secondary", [], 6).map((s) => s.id);
    expect(ids).toContain("cls-art");
  });
});
