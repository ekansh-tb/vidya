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
 *
 * TIMEOUTS ARE GENEROUS ON PURPOSE. Neon scales its compute to zero when idle,
 * so the first query of a run pays a cold start that blows straight through
 * vitest's 10s hook default and fails the whole file before a single
 * assertion. That is an infrastructure nap, not a bug in the query — so the
 * limits below are set past it rather than being tuned to a warm database.
 */

/** Past a Neon cold start, not tuned to a warm connection. */
const DB_TIMEOUT_MS = 60_000;

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getSql, dbConfigured } from "./client";
import {
  upsertParent, createLearner, listLearnersForParent, getLearnerForParent,
  getLearnerForClerkUser, issueClaimCode, redeemClaimCode,
  pushLearnerState, getLearnerState,
  getLearnerForDeviceToken, listDevicesForParent, revokeDeviceForParent,
  clearSelfLink, hashDeviceToken, setDisabledCapabilities, resolveDeviceToken,
  disabledCapabilitiesForTokens, bumpCapabilityUsage, capabilityUsedToday, usageForParent,
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

d("db integration", { timeout: DB_TIMEOUT_MS }, () => {
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
  }, DB_TIMEOUT_MS);

  afterAll(async () => {
    if (!hasDb) return;
    const sql = getSql();

    // `link_audit` FIRST, and by learner_id.
    //
    // It has no FK, so nothing cascades into it, and the old cleanup matched
    // on `actor` or `parent_id` — which a redeem row has NEITHER of.
    // `redeemClaimCode` audits with `{ parentId: null, actor: null }` because
    // the redeemer is a device, not a person. So every run of this file left
    // permanent "linked · via claim_code" rows in the real database, with
    // plausible device labels, indistinguishable from a family's actual links.
    // Test residue in a production audit trail is worse than no audit trail:
    // the whole point of the table is reconstructing who got access to a
    // child's data.
    //
    // Deleting by learner_id catches those, and it has to happen before the
    // parents go, because that is what deletes the learners.
    await sql`delete from link_audit where learner_id in (${learnerA}, ${learnerB})`;
    await sql`delete from link_audit where actor like ${RUN + "%"} or parent_id in (${PARENT_A}, ${PARENT_B})`;
    // learners/states/codes/devices cascade from parents.
    await sql`delete from parents where id in (${PARENT_A}, ${PARENT_B})`;
  }, DB_TIMEOUT_MS);

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

    it("promotes to rung 2 and mints a device token, exactly once", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const first = await redeemClaimCode(issued!.code, { deviceLabel: "iPad" });
      expect(first.ok).toBe(true);
      if (first.ok) {
        expect(first.learner.verificationLevel).toBe(2);
        expect(first.deviceToken.length).toBeGreaterThan(30);
        // The credential is a device, not a person. Redeeming must never write
        // an identity onto the row — that is what locked parents out.
        expect(first.learner.clerkUserId).toBeNull();
      }

      // Single use: the same code must not work twice.
      const second = await redeemClaimCode(issued!.code);
      expect(second.ok).toBe(false);
      if (!second.ok) expect(second.reason).toBe("used");
    });

    it("rejects an unknown code", async () => {
      const out = await redeemClaimCode("ZZZZZZ");
      expect(out.ok).toBe(false);
      if (!out.ok) expect(out.reason).toBe("invalid");
    });

    it("issuing a new code invalidates the previous unused one", async () => {
      const first = await issueClaimCode(PARENT_B, learnerB);
      const second = await issueClaimCode(PARENT_B, learnerB);
      expect(first!.code).not.toBe(second!.code);
      const stale = await redeemClaimCode(first!.code);
      expect(stale.ok, "an abandoned code must not stay usable").toBe(false);
    });

    it("two learners can be linked from one browser", async () => {
      // The old path wrote a single Clerk id onto learners.clerk_user_id, which
      // is UNIQUE, so the second child's redeem died on a constraint violation
      // and answered 500. Device tokens are per-row, so both siblings link.
      const a = await issueClaimCode(PARENT_A, learnerA);
      const b = await issueClaimCode(PARENT_B, learnerB);
      const ra = await redeemClaimCode(a!.code, { deviceLabel: "shared iPad" });
      const rb = await redeemClaimCode(b!.code, { deviceLabel: "shared iPad" });
      expect(ra.ok).toBe(true);
      expect(rb.ok).toBe(true);
      if (ra.ok && rb.ok) expect(ra.deviceToken).not.toBe(rb.deviceToken);
    });
  });

  describe("device tokens", () => {
    it("a token resolves to its own learner and nobody else's", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code, { deviceLabel: "iPhone" });
      expect(r.ok).toBe(true);
      if (!r.ok) return;

      const resolved = await getLearnerForDeviceToken(r.deviceToken);
      expect(resolved?.id).toBe(learnerA);

      // A near-miss must not resolve. Only the exact secret works.
      const wrong = await getLearnerForDeviceToken(`${r.deviceToken}x`);
      expect(wrong).toBeNull();
    });

    it("stores only a hash, never the token", async () => {
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code);
      if (!r.ok) throw new Error("redeem failed");

      const sql = getSql();
      const rows = await sql`
        select token_hash from learner_devices where learner_id = ${learnerA}
      `;
      const hashes = rows.map((x) => x.token_hash);
      expect(hashes).toContain(hashDeviceToken(r.deviceToken));
      expect(hashes, "a db leak must not hand over working credentials")
        .not.toContain(r.deviceToken);
    });

    it("a revoked device stops resolving, and the last one drops the rung", async () => {
      const issued = await issueClaimCode(PARENT_B, learnerB);
      const r = await redeemClaimCode(issued!.code, { deviceLabel: "Android tablet" });
      if (!r.ok) throw new Error("redeem failed");
      expect(await getLearnerForDeviceToken(r.deviceToken)).not.toBeNull();

      const revoked = await revokeDeviceForParent(PARENT_B, learnerB, "all");
      expect(revoked!.revoked).toBeGreaterThan(0);

      expect(await getLearnerForDeviceToken(r.deviceToken)).toBeNull();
      // Otherwise "revoked" would leave the AI tutor open on a cut-off device.
      const after = await getLearnerForParent(PARENT_B, learnerB);
      expect(after!.verificationLevel).toBe(0);
    });

    it("tells a revoked token apart from an unknown one", async () => {
      // Collapsing the two is what made the parent's Unlink button a no-op
      // against the AI tutor: a revoked device looked identical to one that
      // had never linked, and observe mode forgives those.
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code, { deviceLabel: "old tablet" });
      if (!r.ok) throw new Error("redeem failed");

      expect((await resolveDeviceToken(r.deviceToken)).kind).toBe("active");
      await revokeDeviceForParent(PARENT_A, learnerA, "all");
      expect((await resolveDeviceToken(r.deviceToken)).kind).toBe("revoked");

      // A token that never existed is still just unknown.
      expect((await resolveDeviceToken("x".repeat(43))).kind).toBe("unknown");
    });

    it("reads switch-offs by token without disturbing last_seen_at", async () => {
      // This runs on every tutor turn against every token in the browser's
      // cookie. If it wrote last_seen_at, one child using the tutor would bump
      // their sibling's "last synced" and the parent's device list would
      // report a device as active that nobody had touched.
      await setDisabledCapabilities(PARENT_A, learnerA, ["ai.tutor.full"]);
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code, { deviceLabel: "iPad" });
      if (!r.ok) throw new Error("redeem failed");

      const sql = getSql();
      const before = await sql`
        select last_seen_at from learner_devices where token_hash = ${hashDeviceToken(r.deviceToken)}
      `;
      expect(await disabledCapabilitiesForTokens([r.deviceToken])).toEqual(["ai.tutor.full"]);
      const after = await sql`
        select last_seen_at from learner_devices where token_hash = ${hashDeviceToken(r.deviceToken)}
      `;
      expect(after[0].last_seen_at).toEqual(before[0].last_seen_at);

      // A revoked device stops contributing denials along with everything else.
      await revokeDeviceForParent(PARENT_A, learnerA, "all");
      expect(await disabledCapabilitiesForTokens([r.deviceToken])).toEqual([]);
    });

    it("a parent cannot list or revoke another family's devices", async () => {
      expect(await listDevicesForParent(PARENT_A, learnerB)).toBeNull();
      expect(await revokeDeviceForParent(PARENT_A, learnerB, "all")).toBeNull();
    });
  });

  describe("what a redeemed code hands back", () => {
    it("the row carries things the child must never receive", async () => {
      // Guards the trimming in app/api/learner/redeem/route.ts. The route used
      // to return this whole row to an unauthenticated caller, which meant a
      // typed code bought you the parent's Clerk user id and the private list
      // of features that parent had switched off — the latter breaking the
      // rule that a child is never told a grown-up disabled something.
      //
      // If this assertion ever fails because the fields moved, check the route
      // still lists its response fields explicitly rather than spreading.
      await setDisabledCapabilities(PARENT_A, learnerA, ["ai.tutor.full"]);
      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code);
      if (!r.ok) throw new Error("redeem failed");

      expect(r.learner.parentId, "still on the row — the route must not forward it").toBe(PARENT_A);
      expect(r.learner.disabledCapabilities).toEqual(["ai.tutor.full"]);
    });

    it("codes expire well inside the old 24-hour window", async () => {
      const issued = await issueClaimCode(PARENT_B, learnerB);
      const minutes = (new Date(issued!.expiresAt).getTime() - Date.now()) / 60_000;
      // The code is a bearer credential now: whoever reads it can redeem it.
      expect(minutes).toBeGreaterThan(60);
      expect(minutes, "a day-long window on a read-aloud secret").toBeLessThanOrEqual(125);
    });
  });

  describe("parent capability switches", () => {
    it("persists, and reaches the learner a device token resolves to", async () => {
      // The whole point of migration 0003: the switch has to be readable on
      // the request path, not just in the parent's browser.
      const saved = await setDisabledCapabilities(PARENT_A, learnerA, ["ai.tutor.full"]);
      expect(saved?.disabledCapabilities).toEqual(["ai.tutor.full"]);

      const issued = await issueClaimCode(PARENT_A, learnerA);
      const r = await redeemClaimCode(issued!.code, { deviceLabel: "iPad" });
      if (!r.ok) throw new Error("redeem failed");
      const viaDevice = await getLearnerForDeviceToken(r.deviceToken);
      expect(viaDevice?.disabledCapabilities).toEqual(["ai.tutor.full"]);
    });

    it("replaces the list rather than merging it", async () => {
      await setDisabledCapabilities(PARENT_A, learnerA, ["ai.tutor.full", "share.crossNetwork"]);
      const after = await setDisabledCapabilities(PARENT_A, learnerA, ["share.crossNetwork"]);
      expect(after?.disabledCapabilities).toEqual(["share.crossNetwork"]);
    });

    it("distinguishes never-configured from nothing-turned-off", async () => {
      const fresh = await getLearnerForParent(PARENT_B, learnerB);
      expect(fresh?.disabledCapabilities, "untouched must be null").toBeNull();
      const emptied = await setDisabledCapabilities(PARENT_B, learnerB, []);
      expect(emptied?.disabledCapabilities, "looked and chose nothing must be []").toEqual([]);
    });

    it("a parent cannot set switches on another family's child", async () => {
      expect(await setDisabledCapabilities(PARENT_A, learnerB, ["ai.tutor.full"])).toBeNull();
      const untouched = await getLearnerForParent(PARENT_B, learnerB);
      expect(untouched?.disabledCapabilities).toEqual([]);
    });
  });

  describe("daily capability allowance", () => {
    const KEY = "test.capability";

    it("counts up to the limit and then refuses", async () => {
      for (let i = 1; i <= 3; i++) {
        const v = await bumpCapabilityUsage(learnerA, KEY, 3);
        expect(v.allowed, `call ${i} of 3`).toBe(true);
        expect(v.used).toBe(i);
      }
      const over = await bumpCapabilityUsage(learnerA, KEY, 3);
      expect(over.allowed).toBe(false);
      expect(over.used).toBe(3);
    });

    it("a refused call does not spend anything", async () => {
      // Otherwise a child hammering a denied endpoint inflates their own
      // counter, and the number a parent reads stops meaning "uses".
      const before = await capabilityUsedToday(learnerA, KEY);
      await bumpCapabilityUsage(learnerA, KEY, 3);
      await bumpCapabilityUsage(learnerA, KEY, 3);
      expect(await capabilityUsedToday(learnerA, KEY)).toBe(before);
    });

    it("is scoped per learner — one child cannot spend another's", async () => {
      const mine = await capabilityUsedToday(learnerA, KEY);
      expect(await capabilityUsedToday(learnerB, KEY)).toBe(0);
      const v = await bumpCapabilityUsage(learnerB, KEY, 3);
      expect(v.used).toBe(1);
      expect(await capabilityUsedToday(learnerA, KEY)).toBe(mine);
    });

    it("is scoped per capability", async () => {
      const other = await bumpCapabilityUsage(learnerA, "test.other", 3);
      expect(other.allowed, "a different key has its own allowance").toBe(true);
      expect(other.used).toBe(1);
    });

    it("raising the limit lets a capped learner continue", async () => {
      // The limit is read per call, so changing the policy takes effect at once
      // rather than after a day.
      const v = await bumpCapabilityUsage(learnerA, KEY, 5);
      expect(v.allowed).toBe(true);
      expect(v.used).toBe(4);
    });

    it("a zero allowance refuses without recording a use", async () => {
      const v = await bumpCapabilityUsage(learnerB, "test.zero", 0);
      expect(v.allowed).toBe(false);
      expect(await capabilityUsedToday(learnerB, "test.zero")).toBe(0);
    });

    it("a parent reads only their own child's usage", async () => {
      await bumpCapabilityUsage(learnerA, "test.read", 5);
      const mine = await usageForParent(PARENT_A, learnerA);
      expect(mine!.some((r) => r.capability === "test.read")).toBe(true);
      // Guessing another family's learner id gets nothing, not a 403's worth
      // of confirmation that the id exists.
      expect(await usageForParent(PARENT_A, learnerB)).toBeNull();
    });

    it("concurrent calls at the boundary cannot both slip through", async () => {
      // The increment and the comparison are one statement precisely so this
      // cannot over-grant under load.
      const K = "test.race";
      const results = await Promise.all(
        Array.from({ length: 8 }, () => bumpCapabilityUsage(learnerA, K, 4)),
      );
      expect(results.filter((r) => r.allowed)).toHaveLength(4);
      expect(await capabilityUsedToday(learnerA, K)).toBe(4);
    });
  });

  describe("self-link repair", () => {
    it("clears a parent's own Clerk id off a learner they own", async () => {
      // Reproduces the lockout: the old redeem path wrote the caller's Clerk id
      // onto the row, and on a family's shared browser that caller was the
      // parent. resolveIdentity then classified them as a learner and
      // requireParent() returned null forever, with no unlink control anywhere.
      const sql = getSql();
      await sql`update learners set clerk_user_id = ${PARENT_A} where id = ${learnerA}`;
      expect((await getLearnerForClerkUser(PARENT_A))?.id).toBe(learnerA);

      expect(await clearSelfLink(PARENT_A)).toBe(true);
      expect(await getLearnerForClerkUser(PARENT_A)).toBeNull();
    });

    it("leaves a genuine learner sign-in alone", async () => {
      const sql = getSql();
      await sql`update learners set clerk_user_id = ${KID_CLERK} where id = ${learnerA}`;
      // Not the owning parent, so not the corruption — must survive.
      expect(await clearSelfLink(KID_CLERK)).toBe(false);
      expect((await getLearnerForClerkUser(KID_CLERK))?.id).toBe(learnerA);
      await sql`update learners set clerk_user_id = null where id = ${learnerA}`;
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
