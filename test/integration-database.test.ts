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
    "postgresql://vidya_test_runner_local:unused@localhost/vidya_integration",
    "postgresql://vidya_test_runner:unused@localhost/vidya_integration_local",
    "postgresql://vidya_test_runner_local:unused@localhost/vidya_integration_local?options=-c%20role%3Downer",
    "postgresql://vidya_test_runner_local:unused@ep-example-pooler/vidya_integration_local",
  ])("fails closed for an unsafe required database", (url) => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "1");
    vi.stubEnv("DATABASE_URL", url);
    expect(() => integrationDatabaseConfigured()).toThrow();
  });
  it.each(["postgresql://vidya_test_runner:unused@localhost/vidya_integration", "postgresql://vidya_test_runner_local:unused@localhost/vidya_integration_local"])("accepts an exact dedicated database/role pair", (url) => {
    vi.stubEnv("VIDYA_REQUIRE_TEST_DB", "1");
    vi.stubEnv("DATABASE_URL", url);
    expect(integrationDatabaseConfigured()).toBe(true);
  });
});
