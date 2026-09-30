import "server-only";
import { createHash } from "node:crypto";
import { getSql } from "./client";

export type RequestLimitOptions = { limit: number; windowMs: number };
export type RequestLimitVerdict = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  unavailable?: true;
};

/** Atomic across workers, using the database clock, with no process-local state. */
export async function consumeRequestLimit(key: string, { limit, windowMs }: RequestLimitOptions): Promise<RequestLimitVerdict> {
  if (!key || key.length > 4096 || !Number.isSafeInteger(limit) || limit < 1 || limit > 1_000_000
    || !Number.isSafeInteger(windowMs) || windowMs < 1 || windowMs > 86_400_000) {
    throw new Error("Invalid request limit configuration");
  }
  // Include policy in the key so two deployment versions cannot reinterpret a counter.
  const digest = createHash("sha256").update(JSON.stringify([key, limit, windowMs])).digest("hex");
  const sql = getSql();
  const rows = await sql`
    with expired as (
      select key_hash from request_limits
      where expires_at <= statement_timestamp() and key_hash <> ${digest}
      order by expires_at limit 100 for update skip locked
    ), cleaned as (
      delete from request_limits r using expired e
      where r.key_hash = e.key_hash and r.expires_at <= statement_timestamp()
      returning r.key_hash
    ), consumed as (
      insert into request_limits (key_hash, hits, expires_at)
      values (${digest}, 1, statement_timestamp() + ${windowMs} * interval '1 millisecond')
      on conflict (key_hash) do update set
        hits = case when request_limits.expires_at <= statement_timestamp() then 1
          else least(request_limits.hits + 1, ${limit + 1}) end,
        expires_at = case when request_limits.expires_at <= statement_timestamp()
          then statement_timestamp() + ${windowMs} * interval '1 millisecond'
          else request_limits.expires_at end
      returning hits, expires_at
    )
    select hits, extract(epoch from expires_at) * 1000 as reset_at,
      greatest(1, ceil(extract(epoch from (expires_at - statement_timestamp())))) as retry_after
    from consumed
  `;
  const row = rows[0];
  const hits = Number(row?.hits);
  const resetAt = Number(row?.reset_at);
  const retry = Number(row?.retry_after);
  if (!Number.isInteger(hits) || hits < 1 || !Number.isFinite(resetAt) || !Number.isFinite(retry)) {
    throw new Error("Invalid request limit result");
  }
  const ok = hits <= limit;
  return { ok, remaining: Math.max(0, limit - hits), resetAt, retryAfterSeconds: ok ? 0 : retry };
}
