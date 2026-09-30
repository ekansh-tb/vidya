/**
 * Opt-in through the existing isolated database guard. Migration 0011 must
 * already exist. No migration or production access is performed by this test.
 * Register this file in the integration runner before release.
 */
import { randomUUID, createHash } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { consumeRequestLimit } from "./request-limits";
import { getSql } from "./client";
const enabled = integrationDatabaseConfigured();
const prefix = `request-limits-test-${randomUUID()}`;
const keys: string[] = [];
function key(suffix: string, limit: number, windowMs: number) {
  const value = `${prefix}:${suffix}`;
  keys.push(createHash("sha256").update(JSON.stringify([value, limit, windowMs])).digest("hex"));
  return value;
}
describe.skipIf(!enabled)("shared database request limits", { timeout: 60000 }, () => {
  afterAll(async () => {
    const sql = getSql();
    for (const hash of keys) await sql`delete from request_limits where key_hash = ${hash}`;
  }, 60000);
  it("admits exactly the limit across concurrent consumers and isolates keys", async () => {
    const options = { limit: 5, windowMs: 60000 };
    const first = key("concurrent", 5, 60000);
    const results = await Promise.all(Array.from({ length: 20 }, () => consumeRequestLimit(first, options)));
    expect(results.filter((result) => result.ok)).toHaveLength(5);
    expect(results.every((result) => result.remaining >= 0)).toBe(true);
    expect(new Set(results.map((result) => result.resetAt)).size).toBe(1);
    expect((await consumeRequestLimit(key("independent", 5, 60000), options)).ok).toBe(true);
  });
  it("reopens an expired database-clock window without relying on worker clocks", async () => {
    const options = { limit: 1, windowMs: 60000 };
    const name = key("expiry", 1, 60000);
    expect((await consumeRequestLimit(name, options)).ok).toBe(true);
    expect((await consumeRequestLimit(name, options)).ok).toBe(false);
    const sql = getSql();
    const hash = keys[keys.length - 1];
    await sql`update request_limits set expires_at = statement_timestamp() - interval '1 second' where key_hash = ${hash}`;
    const next = await consumeRequestLimit(name, options);
    expect(next).toMatchObject({ ok: true, remaining: 0, retryAfterSeconds: 0 });
    expect((await consumeRequestLimit(name, options)).ok).toBe(false);
  });
  it("cleans at most 100 expired rows and never removes live counters", async () => {
    const sql = getSql();
    // This suite runs in a dedicated isolated database. Other suites should
    // not populate request_limits concurrently when checking exact cleanup.
    const expired: string[] = [];
    for (let i = 0; i < 105; i++) {
      key(`expired-${i}`, 1, 60000);
      expired.push(keys[keys.length - 1]);
    }
    await sql`insert into request_limits (key_hash, hits, expires_at)
      select value, 1, statement_timestamp() - interval '1 day'
      from jsonb_array_elements_text(${JSON.stringify(expired)}::jsonb)`;
    const live = key("cleanup-live", 1, 60000);
    await consumeRequestLimit(live, { limit: 1, windowMs: 60000 });
    const rows = await sql`select count(*)::int as count from request_limits where key_hash in
      (select value from jsonb_array_elements_text(${JSON.stringify(expired)}::jsonb))`;
    expect(Number(rows[0].count)).toBeGreaterThanOrEqual(5);
    expect(Number(rows[0].count)).toBeLessThan(105);
    expect((await consumeRequestLimit(live, { limit: 1, windowMs: 60000 })).ok).toBe(false);
  });
});
