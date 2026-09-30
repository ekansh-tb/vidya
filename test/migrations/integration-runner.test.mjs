import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../../scripts/test-integration.mjs", import.meta.url));

test("integration runner rejects malformed URLs without exposing input or spawning database work", () => {
  for (const raw of [
    "postgres://vidya_test_runner:private-password@[invalid/vidya_integration",
    "private-password-invalid-url",
  ]) {
    // Deliberately do not inherit the developer's environment or any database URL.
    const result = spawnSync(process.execPath, [script], {
      env: { VIDYA_TEST_DATABASE_URL: raw },
      encoding: "utf8",
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr,
      "Invalid VIDYA_TEST_DATABASE_URL. Use a valid dedicated test database URL.\n");
    assert.doesNotMatch(result.stderr, /private-password|input:|ERR_INVALID_URL|node:internal/);
  }
});
