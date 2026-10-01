/**
 * Explicit opt-in ONLY, against a coordinated isolated database with 0009
 * already installed. Requires VIDYA_REQUIRE_TEST_DB=1 and a checked dedicated
 * DATABASE_URL. Never applies migrations. Errors are sanitized by the connector.
 * Each test rolls back its fixtures. Run files serially because identity
 * functions deliberately share a transaction advisory lock.
 */
import { randomBytes, randomUUID } from "node:crypto";
import { accountLinkTestDatabaseConfigured, connectAccountTestDatabase, type AccountTestClient } from "./account-link-test-database";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PARENT_ACKNOWLEDGEMENT_TEXT, PARENT_ACKNOWLEDGEMENT_VERSION } from "../auth/parent-enrollment-contract";

const enabled = accountLinkTestDatabaseConfigured();
describe.skipIf(!enabled)("account linking isolated Postgres contract", { timeout: 30000 }, () => {
  let db: AccountTestClient;
  let connected = false;
  let parent: string;
  let other: string;
  let child: string;
  let learner: string;
  let digest: string;
  let rotatedDigest: string;
  async function request(subject = child, hash = digest) {
    return (await db!.query("select vidya_request_account_link($1, $2) as result", [subject, hash])).rows[0].result;
  }
  async function approve(owner = parent, subject = child, hash = digest) {
    return (await db!.query("select vidya_approve_account_link($1, $2::uuid, $3, $4) as result", [owner, learner, hash, subject])).rows[0].result;
  }
  async function revoke(owner = parent) {
    return (await db!.query("select vidya_revoke_account_link($1, $2::uuid) as result", [owner, learner])).rows[0].result;
  }
  async function enroll(subject = child) {
    return (await db!.query("select vidya_enroll_parent($1, $2, $3, $4, $5, $6, $7) as result", [subject, "adult@example.test", "Adult", "email-id", "session-id", PARENT_ACKNOWLEDGEMENT_VERSION, PARENT_ACKNOWLEDGEMENT_TEXT])).rows[0].result;
  }
  beforeEach(async () => {
    digest = randomBytes(32).toString("hex");
    rotatedDigest = randomBytes(32).toString("hex");
    connected = false;
    db = await connectAccountTestDatabase();
    connected = true;
    await db.query("begin");
    await db.query("set local statement_timeout = '5s'");
    const run = randomUUID();
    parent = `${run}-parent`; other = `${run}-other`; child = `${run}-child`;
    await db.query("insert into parents(id) values ($1), ($2)", [parent, other]);
    learner = (await db.query("insert into learners(parent_id, name, grade, board) values ($1, 'Fixture', 6, 'cbse') returning id", [parent])).rows[0].id;
  }, 60000);
  afterEach(async () => {
    if (connected) {
      try { await db.query("rollback"); } finally { await db.end(); }
    }
  }, 60000);
  it("refuses parent accounts, including the learner's owner", async () => {
    expect(await request(parent)).toBeNull();
    expect(await request(other)).toBeNull();
    expect(await approve(parent, parent)).toBe(false);
  });
  it("checks ownership, reviewed identity, single use and audit", async () => {
    expect(await request()).not.toBeNull();
    expect(await approve(other)).toBe(false);
    expect(await approve(parent, "different-account")).toBe(false);
    expect(await approve()).toBe(true);
    expect(await approve()).toBe(false);
    const row = (await db.query("select clerk_user_id, verification_level from learners where id = $1", [learner])).rows[0];
    expect(row).toEqual({ clerk_user_id: child, verification_level: 0 });
    expect((await db.query("select event from link_audit where learner_id = $1", [learner])).rows).toEqual([{ event: "account_linked" }]);
  });
  it("rejects expired and rotated tokens", async () => {
    await request();
    await db.query("update learner_account_link_requests set expires_at = now() - interval '1 minute' where clerk_user_id = $1", [child]);
    expect(await approve()).toBe(false);
    await request(child, rotatedDigest);
    expect(await approve()).toBe(false);
    expect(await approve(parent, child, rotatedDigest)).toBe(true);
  });
  it("revocation cannot promote the account and invalidates old requests", async () => {
    await request(); await approve();
    expect(await revoke(other)).toBe(false);
    expect(await revoke()).toBe(true);
    expect(await revoke()).toBe(true);
    expect(await approve()).toBe(false);
    expect((await db.query("select clerk_user_id from learners where id = $1", [learner])).rows[0].clerk_user_id).toBeNull();
    expect((await db.query("select revoked_at from learner_account_subjects where clerk_user_id = $1", [child])).rows[0].revoked_at).not.toBeNull();
    await db.query("delete from learners where id = $1", [learner]);
    expect((await db.query("select clerk_user_id from learner_account_subjects where clerk_user_id = $1", [child])).rowCount).toBe(1);
  });
  it("requires fresh approval to relink after revocation", async () => {
    await request(); await approve(); await revoke();
    await request(child, rotatedDigest);
    expect(await approve()).toBe(false);
    expect(await approve(parent, child, rotatedDigest)).toBe(true);
  });
  it("does not overwrite an existing learner account", async () => {
    await request(); await approve();
    const second = `${child}-second`;
    await request(second, rotatedDigest);
    expect(await approve(parent, second, rotatedDigest)).toBe(false);
    expect(await request()).toBeNull();
  });
  it("records existing-parent acknowledgements idempotently without changing ownership", async () => {
    expect(await enroll(parent)).toBe(true);
    expect(await enroll(parent)).toBe(true);
    expect((await db.query("select version, acknowledgement_text from parent_enrollment_acknowledgements where parent_id = $1", [parent])).rows)
      .toEqual([{ version: PARENT_ACKNOWLEDGEMENT_VERSION, acknowledgement_text: PARENT_ACKNOWLEDGEMENT_TEXT }]);
    expect((await db.query("select parent_id from learners where id = $1", [learner])).rows[0].parent_id).toBe(parent);
    expect((await db.query("select event from link_audit where parent_id = $1 and event = 'parent_self_attested'", [parent])).rowCount).toBe(1);
  });
  it("rejects pending, linked and revoked learner enrollment", async () => {
    await request(); expect(await enroll()).toBe(false);
    await approve(); expect(await enroll()).toBe(false);
    await revoke(); expect(await enroll()).toBe(false);
    expect((await db.query("select id from parents where id = $1", [child])).rowCount).toBe(0);
    expect((await db.query("select parent_id from parent_enrollment_acknowledgements where parent_id = $1", [child])).rowCount).toBe(0);
  });
});
