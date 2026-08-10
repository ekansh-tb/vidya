// Locks in the fix for the self-promotion hole.
//
// `computeRung` used to return 2 for any 4-digit `parentPin`, and rung 2
// unlocks the AI tutor. The parent room opens in "set a PIN" mode on a fresh
// profile, so a child typed four digits twice and promoted themselves. These
// tests exist so that path cannot quietly return.

import { describe, it, expect } from "vitest";
import { computeRung } from "./use-capability";
import { CAPABILITY_POLICIES } from "./policies";
import type { LearnerProfile } from "../types";

function learner(patch: Partial<LearnerProfile> = {}): LearnerProfile {
  return {
    id: "learner-primary",
    name: "Test",
    grade: 6,
    board: "cambridge-lower-secondary",
    createdAt: "2026-08-01T00:00:00.000Z",
    state: {} as LearnerProfile["state"],
    ...patch,
  };
}

describe("computeRung", () => {
  it("a brand-new learner is rung 0", () => {
    expect(computeRung(learner())).toBe(0);
  });

  it("A PIN GRANTS NOTHING — this is the whole point", () => {
    expect(computeRung(learner({ parentPin: "1234" }))).toBe(0);
    expect(computeRung(learner({ parentPin: "0000" }))).toBe(0);
    expect(computeRung(learner({ parentPin: "9999" }))).toBe(0);
  });

  it("a PIN cannot lift a learner to the tutor rung", () => {
    const withPin = learner({ parentPin: "1234" });
    const required = CAPABILITY_POLICIES["ai.tutor.full"].minRung;
    expect(computeRung(withPin)).toBeLessThan(required);
  });

  it("only a server-issued verifiedLevel raises the rung", () => {
    expect(computeRung(learner({ verifiedLevel: 2 }))).toBe(2);
    expect(computeRung(learner({ verifiedLevel: 3 }))).toBe(3);
    expect(computeRung(learner({ verifiedLevel: 1 }))).toBe(1);
  });

  it("a linked learner reaches the tutor rung", () => {
    const linked = learner({ verifiedLevel: 2 });
    expect(computeRung(linked)).toBeGreaterThanOrEqual(
      CAPABILITY_POLICIES["ai.tutor.full"].minRung,
    );
  });

  it("verifiedLevel 0 stays 0 even alongside a PIN", () => {
    expect(computeRung(learner({ verifiedLevel: 0, parentPin: "4321" }))).toBe(0);
  });

  it("ignores a nonsense verifiedLevel rather than trusting it", () => {
    // Defensive: the field is a mirror of server data, but it lives in
    // localStorage, which a determined kid can edit. Out-of-range values must
    // not become a rung.
    const tampered = learner({ verifiedLevel: 99 as unknown as 3 });
    expect(computeRung(tampered)).toBe(0);
  });
});

describe("capability policy sanity", () => {
  it("the AI tutor still requires parent verification", () => {
    // If someone lowers this to 0, anonymous devices silently get the tutor.
    expect(CAPABILITY_POLICIES["ai.tutor.full"].minRung).toBeGreaterThanOrEqual(2);
  });

  it("every rung-3 capability stays at rung 3", () => {
    for (const key of ["byok.openai", "incognito.enabled", "health.profile"] as const) {
      expect(CAPABILITY_POLICIES[key].minRung, key).toBe(3);
    }
  });
});
