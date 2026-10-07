/** Exact pair allowlist. Never accept crossed database/role pairs or ambient application identities. */
export const INTEGRATION_PAIRS = Object.freeze([
  Object.freeze({ database: "vidya_integration", role: "vidya_test_runner" }),
  Object.freeze({ database: "vidya_integration_local", role: "vidya_test_runner_local" }),
]);
/** @param {string} database @param {string} role */
export function allowedIntegrationPair(database, role) {
  return INTEGRATION_PAIRS.some(pair => pair.database === database && pair.role === role);
}
/** @param {URL} url */
export function allowedIntegrationUrl(url) {
  return ["postgres:", "postgresql:"].includes(url.protocol) && allowedIntegrationPair(url.pathname.slice(1), url.username)
    && !url.hash && !/pooler|pgbouncer/i.test(url.hostname)
    && [...url.searchParams.keys()].every(key => key === "sslmode")
    && url.searchParams.getAll("sslmode").length <= 1
    && (!url.searchParams.has("sslmode") || ["disable","require","verify-ca","verify-full"].includes(url.searchParams.get("sslmode")));
}
