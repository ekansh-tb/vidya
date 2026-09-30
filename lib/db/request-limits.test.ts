import { beforeEach, describe, expect, it, vi } from "vitest";
const sql = vi.hoisted(() => vi.fn());
vi.mock("./client", () => ({ getSql: () => sql }));
import { consumeRequestLimit } from "./request-limits";
const options = { limit: 3, windowMs: 60000 };
beforeEach(() => { sql.mockReset(); sql.mockResolvedValue([{ hits: 1, reset_at: "90000", retry_after: "60" }]); });
describe("atomic request counter", () => {
  it("uses one atomic statement, a database clock, capped counts and bounded nonblocking cleanup", async () => {
    expect(await consumeRequestLimit("parent:private", options)).toEqual({ ok: true, remaining: 2, resetAt: 90000, retryAfterSeconds: 0 });
    expect(sql).toHaveBeenCalledTimes(1);
    const [parts, ...values] = sql.mock.calls[0];
    const statement = parts.join("?");
    expect(statement).toContain("on conflict (key_hash) do update");
    expect(statement).toContain("statement_timestamp()");
    expect(statement).toContain("limit 100 for update skip locked");
    expect(statement).toContain("least(request_limits.hits + 1");
    expect(JSON.stringify(values)).not.toContain("private");
    expect(values[0]).toMatch(/^[a-f0-9]{64}$/);
  });
  it("returns the final allowed slot then denies with nonnegative remaining and database retry time", async () => {
    sql.mockResolvedValueOnce([{ hits: 3, reset_at: 90000, retry_after: 42 }]);
    expect(await consumeRequestLimit("a", options)).toMatchObject({ ok: true, remaining: 0, retryAfterSeconds: 0 });
    sql.mockResolvedValueOnce([{ hits: 4, reset_at: 90000, retry_after: 42 }]);
    expect(await consumeRequestLimit("a", options)).toMatchObject({ ok: false, remaining: 0, retryAfterSeconds: 42 });
  });
  it("separates caller keys and policies", async () => {
    await consumeRequestLimit("a", options);
    await consumeRequestLimit("b", options);
    await consumeRequestLimit("a", { ...options, limit: 4 });
    expect(new Set(sql.mock.calls.map((call) => call[1])).size).toBe(3);
  });
  it("rejects invalid configuration and malformed database results", async () => {
    await expect(consumeRequestLimit("a", { limit: 0, windowMs: 60000 })).rejects.toThrow();
    await expect(consumeRequestLimit("a", { limit: 1, windowMs: Infinity })).rejects.toThrow();
    expect(sql).not.toHaveBeenCalled();
    sql.mockResolvedValue([]);
    await expect(consumeRequestLimit("a", options)).rejects.toThrow();
  });
});
