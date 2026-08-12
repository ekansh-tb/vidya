// The parent's switch-off has to be a boundary, not a hidden button.
//
// `disabledCapabilities` shipped on the client LearnerProfile long before it
// existed server-side. The client hook applied it, so a parent turning Miss
// Vidya off for one child saw the room vanish from that child's lobby — while
// /api/tutor stayed exactly as reachable to anything that could POST to it.
// A control that looks like a boundary and isn't one is worse than no control,
// because the parent stops looking. Migration 0003 added the column; these
// tests are what keep the check wired to it.

import { describe, it, expect } from "vitest";
import { resolveCapabilityServer } from "./server";
import { CAPABILITY_POLICIES } from "./policies";
import type { Identity } from "../auth/session";
import type { LearnerRow } from "../db/queries";

function learnerRow(patch: Partial<LearnerRow> = {}): LearnerRow {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    parentId: "user_parent",
    clerkUserId: null,
    name: "Test",
    grade: 6,
    board: "cambridge-lower-secondary",
    school: null,
    city: null,
    verificationLevel: 2,
    pickedSubjects: null,
    subjectsLocked: false,
    disabledCapabilities: null,
    localId: null,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...patch,
  };
}

function asLearner(patch: Partial<LearnerRow> = {}): Identity {
  const learner = learnerRow(patch);
  return {
    kind: "learner",
    userId: `device:${learner.id}`,
    learner,
    verificationLevel: learner.verificationLevel,
  };
}

const TUTOR = "ai.tutor.full";

describe("resolveCapabilityServer", () => {
  it("allows a linked learner at the required rung", async () => {
    const r = await resolveCapabilityServer(TUTOR, asLearner());
    expect(r.allowed).toBe(true);
    expect(r.reason).toBe("ok");
  });

  it("DENIES when the parent switched it off — even at the right rung", async () => {
    const r = await resolveCapabilityServer(TUTOR, asLearner({
      disabledCapabilities: [TUTOR],
    }));
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("feature_disabled");
  });

  it("the switch-off is checked before the rung, so promoting cannot undo it", async () => {
    // An adult looked at this child and said no. Reaching a higher rung later
    // is the less specific fact and must not quietly override the decision.
    const r = await resolveCapabilityServer(TUTOR, asLearner({
      verificationLevel: 3,
      disabledCapabilities: [TUTOR],
    }));
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("feature_disabled");
  });

  it("switching off one capability does not switch off its neighbours", async () => {
    const r = await resolveCapabilityServer(TUTOR, asLearner({
      disabledCapabilities: ["share.crossNetwork"],
    }));
    expect(r.allowed).toBe(true);
  });

  it("an empty list is not the same as a disabled capability", async () => {
    // Null means "never configured", [] means "looked and turned nothing off".
    expect((await resolveCapabilityServer(TUTOR, asLearner({ disabledCapabilities: [] }))).allowed).toBe(true);
    expect((await resolveCapabilityServer(TUTOR, asLearner({ disabledCapabilities: null }))).allowed).toBe(true);
  });

  it("an unlinked learner is below the rung", async () => {
    const r = await resolveCapabilityServer(TUTOR, asLearner({ verificationLevel: 0 }));
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("below_min_rung");
  });

  it("a parent's own session is not a learner session", async () => {
    // Capabilities are scoped to a learner; a parent browsing is rung 0 here.
    const r = await resolveCapabilityServer(TUTOR, {
      kind: "parent", userId: "user_parent", email: null,
    });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("below_min_rung");
  });

  it("a REVOKED device is denied as a decision, not as anonymity", async () => {
    // The difference matters: /api/tutor waves `below_min_rung` through in
    // observe mode, so folding revocation into ordinary anonymity meant the
    // parent's Unlink button did nothing to the tutor — while the dashboard
    // told them it "closes the AI tutor there".
    const r = await resolveCapabilityServer(TUTOR, { kind: "anonymous", reason: "revoked" });
    expect(r.allowed).toBe(false);
    expect(r.reason, "must not be below_min_rung, which observe mode forgives")
      .toBe("feature_disabled");
  });

  it("revocation closes even rung-0 capabilities", async () => {
    const openKey = (Object.keys(CAPABILITY_POLICIES) as (keyof typeof CAPABILITY_POLICIES)[])
      .find((k) => CAPABILITY_POLICIES[k].minRung === 0);
    if (!openKey) return;
    const r = await resolveCapabilityServer(openKey, { kind: "anonymous", reason: "revoked" });
    expect(r.allowed, "a cut-off device is cut off, not demoted to guest").toBe(false);
  });

  it("an unlinked device is NOT treated as revoked", async () => {
    // The observe-mode grace exists for exactly this case and must survive.
    const r = await resolveCapabilityServer(TUTOR, { kind: "anonymous", reason: "unlinked" });
    expect(r.reason).toBe("below_min_rung");
  });

  it("an anonymous device gets rung-0 capabilities only", async () => {
    const anon: Identity = { kind: "anonymous", reason: "no_session" };
    expect((await resolveCapabilityServer(TUTOR, anon)).allowed).toBe(false);

    // ...but rung-0 capabilities must still work, or the offline-first kid app
    // stops working the moment it can't identify anyone.
    const openKey = (Object.keys(CAPABILITY_POLICIES) as (keyof typeof CAPABILITY_POLICIES)[])
      .find((k) => CAPABILITY_POLICIES[k].minRung === 0);
    if (openKey) {
      expect((await resolveCapabilityServer(openKey, anon)).allowed).toBe(true);
    }
  });

  it("an unknown capability is denied, not defaulted open", async () => {
    const r = await resolveCapabilityServer(
      "not.a.real.capability" as unknown as typeof TUTOR,
      asLearner(),
    );
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("feature_disabled");
  });
});
