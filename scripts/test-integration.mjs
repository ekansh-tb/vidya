import { spawnSync } from "node:child_process";

const raw = process.env.VIDYA_TEST_DATABASE_URL;
if (!raw) throw new Error("VIDYA_TEST_DATABASE_URL is required. Use the dedicated test database.");
let url;
try {
  url = new URL(raw);
} catch {
  // Node's Invalid URL error includes the raw input, which may contain secrets.
  console.error("Invalid VIDYA_TEST_DATABASE_URL. Use a valid dedicated test database URL.");
  process.exit(1);
}
if (url.pathname !== "/vidya_integration" || url.username !== "vidya_test_runner") {
  throw new Error("Refusing integration tests outside the dedicated database and role.");
}
const env = {
  ...process.env,
  DATABASE_URL: raw,
  DATABASE_URL_UNPOOLED: raw,
  POSTGRES_URL: raw,
  POSTGRES_URL_NON_POOLING: raw,
  VIDYA_REQUIRE_TEST_DB: "1",
};
for (const args of [
  ["scripts/migrate.mjs"],
  ["node_modules/vitest/vitest.mjs", "run", "lib/db/queries.integration.test.ts", "lib/db/ai-connections.integration.test.ts", "lib/db/ai-tutor-policies.integration.test.ts"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
