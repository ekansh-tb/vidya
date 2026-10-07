import { allowedIntegrationPair, allowedIntegrationUrl } from "../../scripts/integration-database-contract.mjs";
// Never fall back to application URLs or let URL parameters override identity.
export function postgresHarnessConfig(env) {
  if (env.VIDYA_RUN_MIGRATION_INTEGRATION !== "1") {
    throw new Error("Set VIDYA_RUN_MIGRATION_INTEGRATION=1 to opt in.");
  }
  let url;
  try { url = new URL(env.VIDYA_TEST_DATABASE_URL); }
  catch { throw new Error("A valid VIDYA_TEST_DATABASE_URL is required."); }
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      !allowedIntegrationUrl(url) ||
      !url.hostname || /pooler|pgbouncer/i.test(url.hostname) || url.hash ||
      [...url.searchParams.keys()].some((key) => key !== "sslmode") ||
      url.searchParams.getAll("sslmode").length > 1 ||
      (url.searchParams.has("sslmode") &&
       !["disable", "require", "verify-ca", "verify-full"].includes(url.searchParams.get("sslmode")))) {
    throw new Error("Refusing endpoint: require direct vidya_integration database and vidya_test_runner role.");
  }
  return {
    connectionString: url.href,
    connectionTimeoutMillis: 5000,
    query_timeout: 7000,
    options: "-c statement_timeout=5000 -c lock_timeout=1000 -c idle_in_transaction_session_timeout=10000 -c idle_session_timeout=15000",
  };
}

export function assertHarnessIdentity(row) {
  if (!allowedIntegrationPair(row?.database, row?.role) || row?.session_role !== row?.role) {
    throw new Error("Refusing connected database or role mismatch.");
  }
}
