import { afterEach, describe, expect, it, vi } from "vitest";
import { integrationDatabaseConfigured } from "./integration-database";

afterEach(() => vi.unstubAllEnvs());

describe("integration database boundary", () => {
  it("does not adopt an ambient application database", () => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "");
    vi.stubEnv("DATABASE_URL", "postgresql://owner:unused@localhost/neondb");
    expect(integrationDatabaseConfigured()).toBe(false);
  });
  it.each([
    "",
    "postgresql://owner:unused@localhost/vidya_integration",
    "postgresql://vidya_test_runner:unused@localhost/neondb",
  ])("fails closed for an unsafe required database", (url) => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "1");
    vi.stubEnv("DATABASE_URL", url);
    expect(() => integrationDatabaseConfigured()).toThrow();
  });
  it("accepts only the dedicated database and role", () => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "1");
    vi.stubEnv("DATABASE_URL", "postgresql://vidya_test_runner:unused@localhost/vidya_integration");
    expect(integrationDatabaseConfigured()).toBe(true);
  });
});
