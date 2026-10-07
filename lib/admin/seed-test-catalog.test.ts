import { describe, it, expect } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { seedContent, contentInitialized } from "@/lib/db/admin";
const requested = process.env.VIDYA_SEED_TEST_CATALOG === "1";
const isolated = requested && integrationDatabaseConfigured();
describe.skipIf(!isolated)("explicit test catalog initialization", { timeout:60000 }, () => {
  it("imports the authored source idempotently and records explicit initialization", async () => {
    const first = await seedContent("test:authored-catalog-setup"); expect(first).toBeGreaterThanOrEqual(0); expect(await contentInitialized()).toBe(true);
    expect(await seedContent("test:authored-catalog-setup")).toBe(0); expect(await contentInitialized()).toBe(true);
  });
});
