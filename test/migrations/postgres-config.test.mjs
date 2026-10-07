import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { postgresHarnessConfig, assertHarnessIdentity } from "./postgres-config.mjs";

const valid = "postgres://vidya_test_runner:private-secret@localhost:5432/vidya_integration";
const envFor = (url) => ({ VIDYA_RUN_MIGRATION_INTEGRATION: "1", VIDYA_TEST_DATABASE_URL: url });

test("test discovery cannot activate the PostgreSQL harness through inherited environment alone", () => {
  const script = fileURLToPath(new URL("./postgres-harness.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [script], {
    env: envFor("not-a-url-private-secret"), encoding: "utf8",
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /^SKIP PostgreSQL harness:/);
  assert.equal(result.stderr, "");
});

test("PostgreSQL harness requires opt-in and never adopts application URLs", () => {
  assert.throws(() => postgresHarnessConfig({ VIDYA_TEST_DATABASE_URL: valid }), /opt in/);
  assert.throws(() => postgresHarnessConfig({
    VIDYA_RUN_MIGRATION_INTEGRATION: "1", DATABASE_URL: valid, DATABASE_URL_UNPOOLED: valid,
  }), /required/);
  const config = postgresHarnessConfig(envFor(valid));
  assert.equal(config.connectionString, valid);
  assert.equal(config.connectionTimeoutMillis, 5000);
  assert.match(config.options, /statement_timeout=5000/);
});

test("PostgreSQL harness fails closed on identity, poolers, URL overrides and malformed URLs", () => {
  for (const url of [
    "private-secret-not-a-url",
    "postgres://vidya_test_runner:private-secret@[broken/vidya_integration",
    valid.replace("vidya_test_runner", "postgres"),
    valid.replace("/vidya_integration", "/production"),
    valid.replace("localhost", "host-pooler"),
    valid.replace("postgres:", "https:"),
    valid + "?user=postgres",
    valid + "?database=production",
    valid + "?options=-c%20role%3Dpostgres",
    valid + "?host=production",
    valid + "?sslmode=require&sslmode=disable",
    valid + "#private-secret",
  ]) {
    assert.throws(() => postgresHarnessConfig(envFor(url)), (error) => {
      assert.doesNotMatch(error.message, /private-secret|\[broken|input:/);
      return true;
    });
  }
});

test("PostgreSQL harness checks database, effective role and session role after connection", () => {
  const identity = { database: "vidya_integration", role: "vidya_test_runner", session_role: "vidya_test_runner" };
  assert.doesNotThrow(() => assertHarnessIdentity(identity));
  for (const key of Object.keys(identity)) {
    assert.throws(() => assertHarnessIdentity({ ...identity, [key]: "wrong" }), /mismatch/);
  }
  assert.throws(() => assertHarnessIdentity(undefined), /mismatch/);
});

// Additional local pair must remain exact; crossed pair identities fail closed.
test("accepts only the explicitly added local database/role pair", () => {
  const local = "postgres://vidya_test_runner_local:private-secret@localhost/vidya_integration_local";
  assert.ok(postgresHarnessConfig({VIDYA_RUN_MIGRATION_INTEGRATION:"1",VIDYA_TEST_DATABASE_URL:local}));
  assert.throws(() => postgresHarnessConfig({VIDYA_RUN_MIGRATION_INTEGRATION:"1",VIDYA_TEST_DATABASE_URL:local.replace("/vidya_integration_local","/vidya_integration")}));
  assert.throws(() => assertHarnessIdentity({database:"vidya_integration_local",role:"vidya_test_runner",session_role:"vidya_test_runner"}));
});
