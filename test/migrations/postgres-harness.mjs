// Explicit opt-in executable, deliberately not named *.test.mjs.
// Run serially against the dedicated integration database, never production.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { runMigrations, safeFailure, LOCK_KEY } from "../../scripts/migration-runner.mjs";
import { postgresHarnessConfig, assertHarnessIdentity } from "./postgres-config.mjs";
import { sanitized } from "./postgres-diagnostics.mjs";

async function close(client) {
  // Explicit deadline even if the socket has stopped responding.
  let timer;
  try {
    await Promise.race([
      client.end(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          // Last-resort disposal of this harness-owned pg socket.
          client.connection?.stream?.destroy();
          reject(new Error("Connection cleanup exceeded 5 seconds."));
        }, 5000);
      }),
    ]);
  } finally { clearTimeout(timer); }
}

async function verifiedClient(config) {
  const client = new pg.Client(config);
  client.on("error", () => {}); // Do not let idle errors print connection details.
  try {
    await client.connect();
    const { rows } = await client.query(
      "select current_database() as database, current_user as role, session_user as session_role, pg_backend_pid() as backend_pid");
    assertHarnessIdentity(rows[0]);
    client.harnessBackendPid = rows[0].backend_pid;
    return client;
  } catch (error) {
    await close(client).catch(() => {});
    throw sanitized(error, "connection and identity verification");
  }
}

async function withSchema(config, label, body) {
  const schema = `vidya_migration_${randomUUID().replaceAll("-", "")}`;
  assert.match(schema, /^vidya_migration_[a-f0-9]{32}$/);
  const quoted = `"${schema}"`;
  const sessions = new Set();
  let ownedOid;
  let schemaCreationAttempted = false;
  let failure;
  let admin;
  let stage = "schema setup";
  try {
    admin = await verifiedClient(config);
    sessions.add(admin);
    schemaCreationAttempted = true;
    await admin.query(`create schema ${quoted} authorization vidya_test_runner`);
    const ownership = await admin.query(
      "select oid from pg_namespace where nspname = $1 and nspowner = current_user::regrole", [schema]);
    ownedOid = ownership.rows[0]?.oid;
    assert.ok(ownedOid, "Owned schema must be recorded before running fixtures.");
    await admin.query("select set_config('search_path', $1, false)", [quoted]);

    async function runnerClient() {
      const client = await verifiedClient(config);
      sessions.add(client);
      await client.query("select set_config('search_path', $1, false)", [quoted]);
      if (client.processID !== client.harnessBackendPid) {
        console.log("INFO protocol process ID differs from PostgreSQL backend PID; using verified backend PID.");
      }
      return {
        pid: client.harnessBackendPid,
        // runMigrations owns the lifecycle; the verified session is already open.
        connect: async () => {},
        query: async (...args) => {
          try { return await client.query(...args); }
          catch (error) { throw sanitized(error); }
        },
        end: async () => { await close(client); sessions.delete(client); },
      };
    }
    stage = "case execution";
    await body({ admin, runnerClient, schema, setStage: (value) => { stage = value; } });
  } catch (error) {
    failure = sanitized(error, stage);
  } finally {
    const closed = await Promise.allSettled([...sessions].map(close));
    if (closed.some((result) => result.status === "rejected")) {
      failure ??= new Error("Harness session cleanup failed.");
    }
    // Fresh verified connection, bounded DROP, and only this test's exact schema.
    if (schemaCreationAttempted) {
      let cleanup;
      try {
        cleanup = await verifiedClient(config);
        await cleanup.query("set statement_timeout = '3000ms'");
        await cleanup.query("set lock_timeout = '1000ms'");
        const ownership = await cleanup.query(
          "select oid, nspowner = current_user::regrole as owned from pg_namespace where nspname = $1", [schema]);
        if (ownership.rowCount) {
          assert.equal(ownership.rows[0].owned, true, "Schema owner changed; refusing cleanup.");
          if (ownedOid) assert.equal(ownership.rows[0].oid, ownedOid, "Schema identity changed; refusing cleanup.");
          await cleanup.query(`drop schema ${quoted} cascade`);
        }
        const remaining = await cleanup.query("select 1 from pg_namespace where nspname = $1", [schema]);
        assert.equal(remaining.rowCount, 0);
      } catch {
        failure = new Error(`Cleanup failed for owned schema ${schema}; manual inspection required.`);
      } finally {
        if (cleanup) await close(cleanup).catch(() => { failure ??= new Error("Cleanup session closure failed."); });
      }
    }
  }
  if (failure) throw new Error(`${label}: ${failure.message}`);
  console.log(`PASS ${label} (owned schema removed)`);
}

const fixture = [{ name: "001.sql", sql: "create table probe (id integer primary key); insert into probe values (1)" }];

async function main() {
  // Node's default test discovery can include every .mjs under test/. An explicit
  // command argument prevents even an inherited opt-in environment from running DDL.
  if (!process.argv.includes("--run-postgres-integration")) {
    console.log("SKIP PostgreSQL harness: pass --run-postgres-integration explicitly.");
    return;
  }
  const config = postgresHarnessConfig(process.env);
  await withSchema(config, "empty-schema dry run creates zero tables", async ({ admin, runnerClient, schema }) => {
    const result = await runMigrations({ client: await runnerClient(), files: fixture, dryRun: true });
    assert.equal(result.count, 1);
    const tables = await admin.query("select 1 from pg_tables where schemaname = $1", [schema]);
    assert.equal(tables.rowCount, 0);
  });
  await withSchema(config, "concurrent runners apply once", async ({ admin, runnerClient, setStage }) => {
    // Hold the common lock until both real runners demonstrably wait on it.
    await admin.query("select pg_advisory_lock($1::integer, $2::integer)", LOCK_KEY);
    setStage("connecting concurrent runners");
    const connected = await Promise.allSettled([runnerClient(), runnerClient()]);
    for (const result of connected) if (result.status === "rejected") throw result.reason;
    const clients = connected.map((result) => result.value);
    const running = Promise.allSettled(clients.map((client) =>
      runMigrations({ client, files: fixture, lockTimeoutMs: 4000 })));
    try {
      const deadline = Date.now() + 2500;
      let waiting = 0;
      while (Date.now() < deadline) {
        const result = await admin.query(
          "select count(*)::integer as count from pg_locks where locktype = 'advisory' and not granted and pid = any($1::integer[])",
          [clients.map((client) => client.pid)]);
        waiting = result.rows[0].count;
        if (waiting === 2) break;
        await delay(25);
      }
      setStage(`observing contention (${waiting}/2 runners blocked)`);
      assert.equal(waiting, 2, "Both runners must contend before release.");
    } finally {
      await admin.query("select pg_advisory_unlock($1::integer, $2::integer)", LOCK_KEY);
      await running;
    }
    const results = await running;
    setStage("concurrent runner settlement");
    for (const result of results) if (result.status === "rejected") throw result.reason;
    setStage("concurrent migration counts");
    assert.deepEqual(results.map((result) => result.value.count).sort(), [0, 1]);
    setStage("concurrent fixture and tracking counts");
    assert.equal((await admin.query("select * from probe")).rowCount, 1);
    assert.equal((await admin.query("select * from _migrations")).rowCount, 1);
  });
  await withSchema(config, "lock acquisition times out before DDL", async ({ admin, runnerClient, schema }) => {
    await admin.query("select pg_advisory_lock($1::integer, $2::integer)", LOCK_KEY);
    try {
      const client = await runnerClient();
      const start = Date.now();
      await assert.rejects(runMigrations({ client, files: fixture, lockTimeoutMs: 150 }),
        (error) => error.sqlState === "55P03");
      assert.ok(Date.now() - start < 4000, "Lock timeout must be bounded.");
      assert.equal((await admin.query("select 1 from pg_tables where schemaname = $1", [schema])).rowCount, 0);
    } finally {
      await admin.query("select pg_advisory_unlock($1::integer, $2::integer)", LOCK_KEY);
    }
  });
  await withSchema(config, "failed SQL rolls back and releases lock", async ({ admin, runnerClient }) => {
    await assert.rejects(runMigrations({
      client: await runnerClient(),
      files: [...fixture, { name: "002.sql", sql: "insert into probe values (2); create table rolled_back (id integer); select 1/0" }],
    }), (error) => error.sqlState === "22012");
    assert.deepEqual((await admin.query("select id from probe order by id")).rows, [{ id: 1 }]);
    assert.deepEqual((await admin.query("select name from _migrations")).rows, [{ name: "001.sql" }]);
    assert.equal((await admin.query("select to_regclass('rolled_back') as relation")).rows[0].relation, null);
    const lock = await admin.query("select pg_try_advisory_lock($1::integer, $2::integer) as acquired", LOCK_KEY);
    assert.equal(lock.rows[0].acquired, true);
    await admin.query("select pg_advisory_unlock($1::integer, $2::integer)", LOCK_KEY);
    // A new runner can retry the untracked migration after the failed session.
    const retried = await runMigrations({ client: await runnerClient(), files: [
      ...fixture, { name: "002.sql", sql: "insert into probe values (2)" },
    ] });
    assert.equal(retried.count, 1);
  });
  await withSchema(config, "wrapped SQL cannot commit ahead of tracking", async ({ admin, runnerClient, schema, setStage }) => {
    setStage("reject wrapped bundle before any migration SQL");
    const wrapped = { name: "002.sql", sql: "BEGIN; create table escaped (id integer); COMMIT;" };
    await assert.rejects(runMigrations({ client: await runnerClient(), files: [...fixture, wrapped] }),
      (error) => /SQL preflight.*transaction control/.test(safeFailure(error)));
    setStage("wrapped bundle leaves zero tables");
    assert.equal((await admin.query("select 1 from pg_tables where schemaname = $1", [schema])).rowCount, 0);
    setStage("preflight failure releases lock");
    const lock = await admin.query("select pg_try_advisory_lock($1::integer, $2::integer) as acquired", LOCK_KEY);
    assert.equal(lock.rows[0].acquired, true);
    await admin.query("select pg_advisory_unlock($1::integer, $2::integer)", LOCK_KEY);
  });
  await withSchema(config, "tracking failure rolls back successful SQL and PLpgSQL DDL", async ({ admin, runnerClient, setStage }) => {
    // Force tracking failure AFTER successful file SQL, using a real constraint.
    await admin.query("create table _migrations (name text primary key check (name <> '001.sql'))");
    const sql = `create table probe (id integer);
      insert into probe values (1);
      create function probe_function() returns integer language plpgsql as $body$
      begin return 1; end;
      $body$;`;
    setStage("tracking insert fails after successful migration statements");
    await assert.rejects(runMigrations({ client: await runnerClient(), files: [{ name: "001.sql", sql }] }),
      (error) => error.sqlState === "23514");
    setStage("data and function creation rolled back with tracking");
    assert.equal((await admin.query("select to_regclass('probe') as relation")).rows[0].relation, null);
    assert.equal((await admin.query("select to_regprocedure('probe_function()') as function")).rows[0].function, null);
    assert.equal((await admin.query("select name from _migrations")).rowCount, 0);
  });
}

main().catch((error) => {
  // All database/driver errors are sanitized before reaching this boundary.
  console.error(error.message);
  process.exitCode = 1;
});
