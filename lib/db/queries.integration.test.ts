/**
 * Integration tests against a real Postgres.
 *
 * SKIPPED unless DATABASE_URL is set, so CI stays green without a database and
 * nobody is forced to provision one to run the unit suite. Run locally with:
 *
 *   vercel env pull .env.local && npx vitest run --mode development \
 *     lib/db/queries.integration.test.ts
 *   (or: DATABASE_URL=... npx vitest run lib/db/queries.integration.test.ts)
 *
 * These exercise the properties that unit tests cannot: that isolation is
 * genuinely enforced by the SQL, that a claim code is really single-use, and
 * that the revision check actually rejects a stale write. Every row created
 * here is namespaced and deleted in afterAll.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getSql, dbConfigured } from "./client";
import {
  upsertParent, createLearner, listLearnersForParent, getLearnerForParent,
  getLearnerForClerkUser, issueClaimCode, redeemClaimCode,
  pushLearnerState, getLearnerState,
} from "./queries";
import type { GameState } from "../types";

const hasDb = dbConfigured();
const d = hasDb ? describe : describe.skip;

// Namespaced so a failed run cannot collide with a later one.
const RUN = `itest-${Date.now()}`;
const PARENT_A = `${RUN}-parent-a`;
const PARENT_B = `${RUN}-parent-b`;
const KID_CLERK = `${RUN}-kid-clerk`;

const state = (xp: number): GameState => ({ xp } as unknown as GameState);

d("db integration", () => {
  let learnerA = "";
  let learnerB = "";

  beforeAll(async () => {
    await upsertParent({ id: PARENT_A, email: "a@example.test", displayName: "A" });
    await upsertParent({ id: PARENT_B, email: "b@example.test", displayName: "B" });
    learnerA = (await createLearner({
      parentId: PARENT_A, name: "Kid A", grade: 6, board: "cambridge-lower-secondary", localId: `${RUN}-a`,
    })).id;
    learnerB = (await createLearner({
      parentId: PARENT_B, name: "Kid B", grade: 9, board: "cambridge-igcse", localId: `${RUN}-b`,
    })).id;
  });

  afterAll(async () => {
    if (!hasDb) return;
    const sql = getSql();
    // learners/states/codes cascade from parents.
    await sql`delete from parents where id in (${PARENT_A}, ${PARENT_B})`;
    await sql`delete from link_audit where actor like ${RUN + "%"} or parent_id in (${PARENT_A}, ${PARENT_B})`;
  });

  describe("strict per-learner isolation", () => {
    it("a parent sees only their own learners", async () => {
      const a = await listLearnersForParent(PARENT_A);
      const b = await listLearnersForParent(PARENT_B);
      expect(a.map((l) => l.id)).toContain(learnerA);
      expect(a.map((l) => l.id)).not.toContain(learnerB);
      expect(b.map((l) => l.id)).not.toContain(learnerA);
    });

    it("knowing another family's learner id gets you nothing", async () => {
      // The whole reason there is no getLearnerById(id).
      const stolen = await getLearnerForParent(PARENT_A, learnerB);
      expect(stolen, "parent A must not read parent B's child by id").toBeNull();
    });

    it("a parent cannot mint a claim code for someone else's child", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerB);
      expect(issued).toBeNull();
    });
  });

  describe("claim codes", () => {
    it("issues a code the owning parent can create", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerA);
      expect(issued?.code).toMatch(/^[A-Z2-9]{6}$/);
      // Deliberately excludes O/0/I/1 — a child types this.
      expect(issued!.code).not.toMatch(/[O0I1]/);
    });

    it("links the learner and promotes to rung 2 exactly once", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const first = await redeemClaimCode(issued!.code, KID_CLERK);
      expect(first.ok).toBe(true);
      if (first.ok) {
        expect(first.learner.clerkUserId).toBe(KID_CLERK);
        expect(first.learner.verificationLevel).toBe(2);
      }

      // Single use: the same code must not work twice.
      const second = await redeemClaimCode(issued!.code, `${RUN}-other-kid`);
      expect(second.ok).toBe(false);
      if (!second.ok) expect(second.reason).toBe("used");
    });

    it("rejects an unknown code", async () => {
      const out = await redeemClaimCode("ZZZZZZ", KID_CLERK);
      expect(out.ok).toBe(false);
      if (!out.ok) expect(out.reason).toBe("invalid");
    });

    it("issuing a new code invalidates the previous unused one", async () => {
      const first = await issueClaimCode(PARENT_B, learnerB);
      const second = await issueClaimCode(PARENT_B, learnerB);
      expect(first!.code).not.toBe(second!.code);
      const stale = await redeemClaimCode(first!.code, `${RUN}-kid-b`);
      expect(stale.ok, "an abandoned code must not stay usable").toBe(false);
    });

    it("a linked learner is reachable by their own Clerk id", async () => {
      const me = await getLearnerForClerkUser(KID_CLERK);
      expect(me?.id).toBe(learnerA);
    });
  });

  describe("state sync concurrency", () => {
    it("accepts a first push and starts at revision 1", async () => {
      const r = await pushLearnerState({ learnerId: learnerA, state: state(10), expectedRevision: 0 });
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.revision).toBe(1);
    });

    it("accepts a push at the current revision", async () => {
      const r = await pushLearnerState({ learnerId: learnerA, state: state(20), expectedRevision: 1 });
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.revision).toBe(2);
    });

    it("REJECTS a stale push and hands back the server copy", async () => {
      // The property that stops two devices erasing each other.
      const r = await pushLearnerState({ learnerId: learnerA, state: state(999), expectedRevision: 1 });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.reason).toBe("conflict");
        expect(r.serverRevision).toBe(2);
        expect((r.serverState as unknown as { xp: number }).xp).toBe(20);
      }
      const latest = await getLearnerState(learnerA);
      expect(latest?.state, "a rejected push must not have been written").toMatchObject({ xp: 20 });
    });
  });
});

// Keeps the file from reporting "no tests" when it is skipped wholesale.
(hasDb ? describe.skip : describe)("db integration (skipped)", () => {
  it("requires DATABASE_URL — see the note at the top of this file", () => {
    expect(hasDb).toBe(false);
  });
});
