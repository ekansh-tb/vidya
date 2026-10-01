/** Dedicated guarded database only. No migrations, Clerk or real accounts. */
import { randomBytes, randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { accountLinkTestDatabaseConfigured, connectAccountTestDatabase, type AccountTestClient } from "./account-link-test-database";

const enabled = accountLinkTestDatabaseConfigured();
describe.skipIf(!enabled)("independent connection account-link races", { timeout: 30000 }, () => {
  let first: AccountTestClient | undefined;
  let second: AccountTestClient | undefined;
  let pending: Promise<unknown> | undefined;
  let parent: string;
  let other: string;
  let child: string;
  let learner: string;
  let sibling: string;
  let oldHash: string;
  let newHash: string;

  const approve = (db: AccountTestClient, id = learner, hash = oldHash) => db.query("select vidya_approve_account_link($1,$2::uuid,$3,$4) as result", [parent, id, hash, child]);
  const revoke = (db: AccountTestClient) => db.query("select vidya_revoke_account_link($1,$2::uuid) as result", [parent, learner]);
  const rotate = (db: AccountTestClient) => db.query("select vidya_request_account_link($1,$2) as result", [child, newHash]);

  beforeEach(async () => {
    first = undefined; second = undefined; pending = undefined;
    parent = "";
    oldHash = randomBytes(32).toString("hex");
    newHash = randomBytes(32).toString("hex");
    first = await connectAccountTestDatabase();
    second = await connectAccountTestDatabase();
    const run = `link-race-${randomUUID()}`;
    parent = `${run}-parent`; other = `${run}-other`; child = `${run}-child`;
    await first.query("insert into parents(id) values ($1),($2)", [parent, other]);
    const rows = await first.query("insert into learners(parent_id,name,grade,board) values ($1,'Race fixture',5,'cbse'),($1,'Sibling fixture',6,'cbse') returning id", [parent]);
    [learner, sibling] = rows.rows.map((row) => row.id);
    await first.query("select vidya_request_account_link($1,$2)", [child, oldHash]);
  }, 60000);

  afterEach(async () => {
    if (!first) return;
    try {
      await first.query("rollback");
      await pending;
      if (second) await second.query("rollback");
      if (parent) {
        await first.query("delete from learner_account_link_requests where clerk_user_id = $1", [child]);
        await first.query("delete from learner_account_subjects where clerk_user_id = $1", [child]);
        await first.query("delete from parents where id in ($1,$2)", [parent, other]);
        await first.query("delete from link_audit where parent_id in ($1,$2)", [parent, other]);
      }
    } finally { await Promise.all([first.end(), second?.end()]); }
  }, 60000);

  async function race(winning: (db: AccountTestClient) => ReturnType<AccountTestClient["query"]>, losing: (db: AccountTestClient) => ReturnType<AccountTestClient["query"]>) {
    await first!.query("begin"); await second!.query("begin");
    await first!.query("set local statement_timeout = '7s'");
    await second!.query("set local statement_timeout = '7s'");
    const pid = (await second!.query("select pg_backend_pid() as pid")).rows[0].pid;
    const won = await winning(first!);
    const blocked = losing(second!);
    pending = blocked.catch(() => undefined);
    const deadline = Date.now() + 4000;
    let waiting = false;
    while (Date.now() < deadline) {
      waiting = (await first!.query("select exists(select 1 from pg_locks where pid = $1 and not granted) as waiting", [pid])).rows[0].waiting;
      if (waiting) break;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    expect(waiting).toBe(true);
    await first!.query("commit");
    const lost = await blocked;
    await second!.query("commit");
    return [won.rows[0]?.result, lost.rows[0]?.result];
  }

  it("double approval across siblings yields one binding and one audit", async () => {
    expect(await race((db) => approve(db), (db) => approve(db, sibling))).toEqual([true, false]);
    expect((await first!.query("select id from learners where clerk_user_id = $1", [child])).rows).toEqual([{ id: learner }]);
    expect((await first!.query("select event from link_audit where parent_id = $1", [parent])).rows).toEqual([{ event: "account_linked" }]);
  });

  it("token rotation before approval invalidates the old request", async () => {
    const [expiry, approved] = await race(rotate, (db) => approve(db));
    expect(expiry).toBeTruthy(); expect(approved).toBe(false);
    expect((await approve(first!, learner, newHash)).rows[0].result).toBe(true);
  });

  it("approval before rotation consumes the request and prevents replacement", async () => {
    expect(await race((db) => approve(db), rotate)).toEqual([true, null]);
    expect((await first!.query("select used_at from learner_account_link_requests where clerk_user_id=$1", [child])).rows[0].used_at).not.toBeNull();
  });

  it("revocation following concurrent approval leaves no account access", async () => {
    expect(await race((db) => approve(db), revoke)).toEqual([true, true]);
    expect((await first!.query("select clerk_user_id from learners where id=$1", [learner])).rows[0].clerk_user_id).toBeNull();
    expect((await first!.query("select revoked_at from learner_account_subjects where clerk_user_id=$1", [child])).rows[0].revoked_at).not.toBeNull();
    expect((await first!.query("select count(*)::int as count from link_audit where parent_id=$1", [parent])).rows[0].count).toBe(2);
  });

  it("revocation before a replayed approval cannot resurrect access", async () => {
    await approve(first!);
    expect(await race(revoke, (db) => approve(db))).toEqual([true, false]);
    expect((await first!.query("select clerk_user_id from learners where id=$1", [learner])).rows[0].clerk_user_id).toBeNull();
  });

  it.each(["approve", "revoke"])("current ownership defeats a queued %s by the former owner", async (action) => {
    if (action === "revoke") await approve(first!);
    const [, permitted] = await race(
      (db) => db.query("update learners set parent_id=$1 where id=$2 returning true as result", [other, learner]),
      (db) => action === "approve" ? approve(db) : revoke(db),
    );
    expect(permitted).toBe(false);
    const row = (await first!.query("select parent_id,clerk_user_id from learners where id=$1", [learner])).rows[0];
    expect(row).toEqual({ parent_id: other, clerk_user_id: action === "revoke" ? child : null });
  });

  it("ownership deletion defeats a queued approval without an orphan audit", async () => {
    const [, approved] = await race(
      (db) => db.query("delete from learners where id=$1 returning true as result", [learner]),
      (db) => approve(db),
    );
    expect(approved).toBe(false);
    expect((await first!.query("select count(*)::int as count from link_audit where parent_id=$1", [parent])).rows[0].count).toBe(0);
  });
});
