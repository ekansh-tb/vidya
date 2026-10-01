import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ connect: vi.fn(), query: vi.fn(), end: vi.fn(), on: vi.fn(), constructor: vi.fn() }));
vi.mock("pg", () => ({ Client: class {
  constructor(options: unknown) { m.constructor(options); }
  connect = m.connect; query = m.query; end = m.end; on = m.on;
} }));
import { accountLinkTestDatabaseConfigured, connectAccountTestDatabase } from "./account-link-test-database";
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "1");
  vi.stubEnv("DATABASE_URL", "postgresql://vidya_test_runner:unused@localhost/vidya_integration");
  m.connect.mockResolvedValue(undefined); m.end.mockResolvedValue(undefined);
  m.query.mockResolvedValue({ rows: [{ database: "vidya_integration", role: "vidya_test_runner", login: "vidya_test_runner" }] });
});
afterEach(() => vi.unstubAllEnvs());
describe("account integration database safety", () => {
  it("requires explicit opt-in even with the old test URL variable", async () => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "");
    vi.stubEnv("VIDYA_ACCOUNT_LINK_TEST_DATABASE_URL", "postgresql://owner:secret@host/production");
    expect(accountLinkTestDatabaseConfigured()).toBe(false);
    await expect(connectAccountTestDatabase()).rejects.toThrow("not explicitly enabled");
    expect(m.constructor).not.toHaveBeenCalled();
  });
  it.each(["not-a-url-secret", "postgresql://owner:secret@host/vidya_integration", "postgresql://vidya_test_runner:secret@host/production", "https://vidya_test_runner:secret@host/vidya_integration"])("rejects unsafe URLs without logging them", async (url) => {
    vi.stubEnv("DATABASE_URL", url);
    await expect(connectAccountTestDatabase()).rejects.toThrow("dedicated database/role");
    expect(m.constructor).not.toHaveBeenCalled();
  });
  it.each([
    { database: "production", role: "vidya_test_runner", login: "vidya_test_runner" },
    { database: "vidya_integration", role: "owner", login: "owner" },
    { database: "vidya_integration", role: "vidya_test_runner", login: "owner" },
  ])("checks actual database, current role and session login before returning a writer", async (identity) => {
    m.query.mockResolvedValue({ rows: [identity] });
    await expect(connectAccountTestDatabase()).rejects.toThrow("Could not verify");
    expect(m.query).toHaveBeenCalledTimes(1);
    expect(m.end).toHaveBeenCalled();
  });
  it("sanitizes connection and query errors", async () => {
    m.connect.mockRejectedValueOnce(new Error("secret connection url"));
    await expect(connectAccountTestDatabase()).rejects.toThrow(/^Could not verify the isolated/);
    const db = await connectAccountTestDatabase();
    m.query.mockRejectedValueOnce(new Error("secret query details"));
    await expect(db.query("select 1")).rejects.toThrow(/^Isolated account test database query failed;/);
  });
  it("sanitizes constructor failures before a connection exists", async () => {
    m.constructor.mockImplementationOnce(() => { throw new Error("secret constructor input"); });
    await expect(connectAccountTestDatabase()).rejects.toThrow(/^Could not verify the isolated/);
    expect(m.connect).not.toHaveBeenCalled();
  });
  it.each(["23505", "40P01", "secret-url", "23505\nsecret", 23505, undefined])("exposes only a validated SQLSTATE (%s)", async (code) => {
    const db = await connectAccountTestDatabase();
    m.query.mockRejectedValueOnce(Object.assign(new Error("secret-message"), {
      code, detail: "secret-detail", query: "secret-query", url: "secret-url",
    }));
    const failure = await db.query("select 1").catch((error: Error) => error);
    expect(failure).toBeInstanceOf(Error);
    const message = (failure as Error).message;
    expect(message).not.toContain("secret");
    expect(message).toBe("Isolated account test database query failed; raw database diagnostics suppressed." +
      (code === "23505" || code === "40P01" ? ` SQLSTATE ${code}.` : ""));
    expect((failure as Error).cause).toBeUndefined();
  });
  it("bounds connection, queries and idle transactions", async () => {
    await connectAccountTestDatabase();
    expect(m.constructor).toHaveBeenCalledWith(expect.objectContaining({
      connectionTimeoutMillis: 15000, statement_timeout: 7000,
      query_timeout: 10000, idle_in_transaction_session_timeout: 10000,
    }));
  });
  it("returns a writer only after both URL and connected identity pass", async () => {
    const db = await connectAccountTestDatabase();
    await db.query("select 1");
    expect(m.query.mock.calls[0][0]).toContain("current_database()");
    expect(m.query.mock.calls[1][0]).toBe("select 1");
  });
});
