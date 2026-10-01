/** Explicit isolated database only. Requires draft 0009; never migrates. */
import { randomBytes, randomUUID } from "node:crypto";
import { accountLinkTestDatabaseConfigured, connectAccountTestDatabase, type AccountTestClient } from "./account-link-test-database";
import { describe, expect, it } from "vitest";
import { PARENT_ACKNOWLEDGEMENT_TEXT, PARENT_ACKNOWLEDGEMENT_VERSION } from "../auth/parent-enrollment-contract";

const enabled = accountLinkTestDatabaseConfigured();
describe.skipIf(!enabled)("parent versus learner classification race", () => {
  it.each(["parent", "learner"])("serializes when %s classification wins", async (winner) => {
    const first = await connectAccountTestDatabase();
    let second: AccountTestClient | undefined;
    const subject = `enrollment-race-${randomUUID()}`;
    const digest = randomBytes(32).toString("hex");
    let pending: Promise<unknown> | undefined;
    try {
      second = await connectAccountTestDatabase();
      await first.query("begin"); await second.query("begin");
      await first.query("set local statement_timeout = '5s'");
      await second.query("set local statement_timeout = '5s'");
      const pid = (await second.query("select pg_backend_pid() as pid")).rows[0].pid;
      const enroll = (client: AccountTestClient) => client.query("select vidya_enroll_parent($1,$2,$3,$4,$5,$6,$7) as result", [subject, "adult@example.test", "Adult", "email-id", "session-id", PARENT_ACKNOWLEDGEMENT_VERSION, PARENT_ACKNOWLEDGEMENT_TEXT]);
      const request = (client: AccountTestClient) => client.query("select vidya_request_account_link($1,$2) as result", [subject, digest]);
      const won = await (winner === "parent" ? enroll(first) : request(first));
      expect(won.rows[0].result).toBeTruthy();
      const losingQuery = winner === "parent" ? request(second) : enroll(second);
      // Attach a rejection handler immediately; assertions below still await
      // the original promise and fail if SQL errors rather than rejecting safely.
      pending = losingQuery.catch(() => undefined);
      const deadline = Date.now() + 3000;
      let waiting = false;
      while (Date.now() < deadline) {
        waiting = (await first.query("select exists(select 1 from pg_locks where pid = $1 and locktype = 'advisory' and not granted) as waiting", [pid])).rows[0].waiting;
        if (waiting) break;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      expect(waiting).toBe(true);
      await first.query("commit");
      const lost = await losingQuery;
      expect(lost.rows[0].result).toBe(winner === "parent" ? null : false);
      await second.query("commit");
      const counts = (await first.query(`select
        (select count(*)::int from parents where id = $1) as parents,
        (select count(*)::int from learner_account_subjects where clerk_user_id = $1) as learners,
        (select count(*)::int from parent_enrollment_acknowledgements where parent_id = $1) as acknowledgements`, [subject])).rows[0];
      expect(counts).toEqual(winner === "parent"
        ? { parents: 1, learners: 0, acknowledgements: 1 }
        : { parents: 0, learners: 1, acknowledgements: 0 });
    } finally {
      try {
        // Release the first lock before waiting on the second connection.
        await first.query("rollback");
        await pending;
        await second?.query("rollback").catch(() => undefined);
        await first.query("delete from learner_account_link_requests where clerk_user_id = $1", [subject]);
        await first.query("delete from learner_account_subjects where clerk_user_id = $1", [subject]);
        await first.query("delete from parents where id = $1", [subject]);
        await first.query("delete from link_audit where parent_id = $1", [subject]);
      } finally { await Promise.all([first.end(), second?.end()]); }
    }
  }, 60000);
});
