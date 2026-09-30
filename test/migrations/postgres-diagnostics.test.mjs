import test from "node:test";
import assert from "node:assert/strict";
import { sanitized } from "./postgres-diagnostics.mjs";
import { runMigrations } from "../../scripts/migration-runner.mjs";

test("assertion diagnostics preserve the stage but redact assertion actual and expected values", () => {
  let failure;
  try { assert.equal("private-actual", "private-expected"); }
  catch (error) { failure = error; }
  const safe = sanitized(failure, "observing contention (0/2 runners blocked)");
  assert.match(safe.message, /observing contention \(0\/2 runners blocked\): assertion failed/);
  assert.doesNotMatch(safe.message, /private-actual|private-expected/);
  assert.equal(sanitized(safe, "outer case"), safe);
});

test("SQLSTATE survives diagnostics while driver details and URLs do not", () => {
  const error = Object.assign(new Error("postgres://user:private-password@host/db"), {
    code: "55P03", detail: "private SQL detail", query: "private SQL",
  });
  const safe = sanitized(error, "lock acquisition");
  assert.match(safe.message, /lock acquisition: operation failed \(SQLSTATE 55P03\)/);
  assert.equal(safe.code, "55P03");
  assert.doesNotMatch(JSON.stringify(safe) + safe.message, /private|postgres:\/\//);
});

test("runner failures preserve their trusted stage and SQLSTATE through harness wrapping", async () => {
  const client = {
    connect: async () => { throw Object.assign(new Error("private-password"), { code: "08006" }); },
    end: async () => {},
  };
  await assert.rejects(runMigrations({ client, files: [] }), (error) => {
    const safe = sanitized(error, "concurrent runner settlement");
    assert.match(safe.message, /concurrent runner settlement/);
    assert.match(safe.message, /Migration failed during connection/);
    assert.match(safe.message, /08006/);
    assert.doesNotMatch(safe.message, /private-password/);
    return true;
  });
});
