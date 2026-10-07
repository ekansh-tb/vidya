import { allowedIntegrationUrl } from "../scripts/integration-database-contract.mjs";
/** Integration tests must never adopt a developer's production DATABASE_URL. */
export function integrationDatabaseConfigured(): boolean {
  if (process.env.VIDYA_REQUIRE_TEST_DB !== "1") return false;
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("Integration tests require the isolated test database.");
  const url = new URL(raw);
  if (!allowedIntegrationUrl(url)) {
    throw new Error("Refusing integration tests outside the dedicated database and role.");
  }
  return true;
}
