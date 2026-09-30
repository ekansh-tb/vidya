import test from "node:test";
import assert from "node:assert/strict";
import { migrationConfig, runMigrations, safeFailure, LOCK_KEY } from "../../scripts/migration-runner.mjs";

const files = [
  { name: "002.sql", sql: "FAKE SECOND MIGRATION" },
  { name: "001.sql", sql: "FAKE FIRST MIGRATION" },
];
const database = () => ({ exists: false, names: [], effects: [], owner: null, waiters: [], waits: 0 });

// No pg import, sockets, environment loading, or real SQL execution in this suite.
class FakeClient {
  constructor(db = database(), fail = () => {}) {
    this.db = db;
    this.fail = fail;
    this.calls = [];
    this.parameters = [];
    this.pending = null;
  }
  async connect() { this.calls.push("connect"); this.fail("connect"); }
  release() {
    if (this.db.owner !== this) return;
    this.db.owner = null;
    this.db.waiters.shift()?.();
  }
  async end() {
    this.calls.push("end");
    this.release();
    this.fail("end");
  }
  async query(sql, values) {
    this.calls.push(sql);
    this.parameters.push({ sql, values });
    this.fail(sql);
    if (sql.includes("pg_advisory_unlock")) {
      this.release();
    } else if (sql.includes("pg_advisory_lock")) {
      assert.deepEqual(values, LOCK_KEY);
      if (this.db.owner) {
        this.db.waits++;
        await new Promise((resolve) => this.db.waiters.push(resolve));
      }
      this.db.owner = this;
    } else if (sql.startsWith("begin")) {
      this.readOnly = sql.includes("read only");
      this.pending = { names: [], effects: [] };
    } else if (sql === "commit") {
      this.db.names.push(...this.pending.names);
      this.db.effects.push(...this.pending.effects);
      this.pending = null;
    } else if (sql === "rollback") {
      this.pending = null;
    } else if (sql.includes("create table")) {
      assert.equal(this.readOnly ?? false, false);
      assert.equal(this.db.owner, this);
      this.db.exists = true;
    } else if (sql.includes("to_regclass")) {
      return { rows: [{ relation: this.db.exists ? "_migrations" : null }] };
    } else if (sql === "select name from _migrations") {
      assert.equal(this.db.exists, true);
      return { rows: this.db.names.map((name) => ({ name })) };
    } else if (sql.startsWith("insert into")) {
      assert.equal(this.readOnly, false);
      this.pending.names.push(values[0]);
    } else if (sql.startsWith("FAKE")) {
      assert.equal(this.readOnly, false);
      this.pending.effects.push(sql);
    } else {
      assert.match(sql, /set_config|reset lock_timeout/);
    }
    return { rows: [] };
  }
}

for (const initialized of [false, true]) {
  test(`dry run is read-only with initialized=${initialized}`, async () => {
    const db = database();
    db.exists = initialized;
    if (initialized) db.names.push("001.sql");
    const before = { exists: db.exists, names: [...db.names], effects: [...db.effects] };
    const client = new FakeClient(db);
    const logs = [];
    const result = await runMigrations({ client, files, dryRun: true, log: (line) => logs.push(line) });
    assert.equal(result.count, initialized ? 1 : 2);
    assert.deepEqual({ exists: db.exists, names: db.names, effects: db.effects }, before);
    assert.equal(client.calls[1], "begin isolation level repeatable read read only");
    assert.ok(client.calls.every((sql) => !/create|insert|advisory|FAKE/.test(sql)));
    assert.equal(client.calls.includes("select name from _migrations"), initialized);
    assert.match(logs.join("\n"), /would apply "002.sql"/);
    assert.deepEqual(client.calls.slice(-2), ["commit", "end"]);
  });
}

test("real runs serialize before initialization/history and skip committed files", async () => {
  const db = database();
  const first = new FakeClient(db);
  const second = new FakeClient(db);
  await Promise.all([
    runMigrations({ client: first, files }),
    runMigrations({ client: second, files }),
  ]);
  assert.deepEqual(db.names, ["001.sql", "002.sql"]);
  assert.deepEqual(db.effects, [files[1].sql, files[0].sql]);
  assert.equal(db.owner, null);
  assert.equal(db.waits, 1);
  for (const client of [first, second]) {
    assert.ok(client.calls.findIndex((s) => s.includes("pg_advisory_lock")) <
      client.calls.findIndex((s) => s.includes("create table")));
    assert.equal(client.calls.at(-1), "end");
  }
  const migrationStart = first.calls.indexOf("begin");
  assert.deepEqual(first.calls.slice(migrationStart, migrationStart + 4),
    ["begin", files[1].sql, "insert into _migrations (name) values ($1)", "commit"]);
});

test("failed second migration rolls back its SQL and tracking, preserving the first", async () => {
  const client = new FakeClient(database(), (sql) => {
    if (sql === files[0].sql) throw Object.assign(new Error("password=secret SQL private"), { code: "23505" });
  });
  await assert.rejects(runMigrations({ client, files }), (error) => {
    assert.match(safeFailure(error), /migration 2 transaction.*SQLSTATE 23505/);
    assert.doesNotMatch(safeFailure(error), /secret|private|password/);
    return true;
  });
  assert.deepEqual(client.db.names, ["001.sql"]);
  assert.deepEqual(client.db.effects, [files[1].sql]);
  assert.equal(client.calls.at(-3), "rollback");
  assert.match(client.calls.at(-2), /pg_advisory_unlock/);
  assert.equal(client.calls.at(-1), "end");
  assert.equal(client.db.owner, null);
});

test("tracking insertion failure rolls back the migration SQL too", async () => {
  const client = new FakeClient(database(), (sql) => {
    if (sql.startsWith("insert into")) throw new Error("tracking failed");
  });
  await assert.rejects(runMigrations({ client, files }));
  assert.deepEqual(client.db.names, []);
  assert.deepEqual(client.db.effects, []);
  assert.equal(client.db.owner, null);
});

test("lock timeout fails before DDL and always closes the session", async () => {
  const client = new FakeClient(database(), (sql) => {
    if (sql.includes("pg_advisory_lock")) throw Object.assign(new Error("secret"), { code: "55P03" });
  });
  await assert.rejects(runMigrations({ client, files, lockTimeoutMs: 10 }), (error) => {
    assert.match(safeFailure(error), /advisory lock acquisition.*55P03/);
    return true;
  });
  assert.equal(client.db.exists, false);
  assert.deepEqual(client.parameters.find(({ sql }) => sql.includes("set_config")).values, ["10ms"]);
  assert.equal(client.calls.at(-1), "end");
  assert.ok(!client.calls.some((s) => /create|insert|unlock/.test(s)));
});

for (const failAt of ["connect", "create table", "to_regclass", "reset lock_timeout", "commit", "pg_advisory_unlock", "end"]) {
  test(`safe failure and connection cleanup at ${failAt}`, async () => {
    const client = new FakeClient(database(), (sql) => {
      if (sql.includes(failAt)) throw new Error("postgres://user:secret@private/db SELECT sensitive");
    });
    await assert.rejects(runMigrations({ client, files }), (error) => {
      assert.doesNotMatch(safeFailure(error), /secret|private|sensitive|postgres:\/\//);
      return true;
    });
    assert.equal(client.calls.at(-1), "end");
    assert.equal(client.db.owner, null);
  });
}

test("rollback failure cannot prevent unlock and session closure", async () => {
  const client = new FakeClient(database(), (sql) => {
    if (sql.startsWith("FAKE") || sql === "rollback") throw new Error("secret");
  });
  await assert.rejects(runMigrations({ client, files }));
  assert.equal(client.calls.at(-3), "rollback");
  assert.match(client.calls.at(-2), /pg_advisory_unlock/);
  assert.equal(client.calls.at(-1), "end");
});

test("configuration requires explicit direct endpoint for writes and validates timeout", () => {
  const url = "postgres://user:secret@localhost/test";
  assert.throws(() => migrationConfig({ DATABASE_URL: url }));
  assert.equal(migrationConfig({ DATABASE_URL: url }, ["--dry-run"]).url, url);
  assert.equal(migrationConfig({ DATABASE_URL_UNPOOLED: url }).lockTimeoutMs, 30000);
  assert.equal(migrationConfig({ POSTGRES_URL_NON_POOLING: url }).url, url);
  assert.throws(() => migrationConfig({ DATABASE_URL_UNPOOLED: "postgres://host-pooler/db" }));
  assert.equal(migrationConfig({ DATABASE_URL: "postgres://host-pooler/db" }, ["--dry-run"]).dryRun, true);
  assert.throws(() => migrationConfig({ DATABASE_URL_UNPOOLED: url }, ["--typo"]));
  for (const value of ["0", "-1", "300001", "1.5", "NaN", "10ms", ""]) {
    assert.throws(() => migrationConfig({ DATABASE_URL_UNPOOLED: url, MIGRATION_LOCK_TIMEOUT_MS: value }));
  }
  assert.doesNotMatch(safeFailure(new Error(url)), /secret|localhost/);
});

for (const dryRun of [false, true]) {
  test(`preflights the entire pending bundle before SQL or tracking DDL (dryRun=${dryRun})`, async () => {
    const client = new FakeClient();
    const wrapped = { name: "003.sql", sql: "BEGIN; create table escaped (id integer); COMMIT;" };
    await assert.rejects(runMigrations({ client, files: [...files, wrapped], dryRun }),
      (error) => /pending migration 3 SQL preflight.*transaction control/.test(safeFailure(error)));
    assert.equal(client.db.exists, false);
    assert.deepEqual(client.db.effects, []);
    assert.ok(!client.calls.some((sql) => /create table|FAKE|insert into/.test(sql)));
    assert.equal(client.db.owner, null);
  });
}

test("already-applied wrapped historical files remain skipped without weakening pending validation", async () => {
  const db = database();
  db.exists = true;
  db.names.push("000.sql");
  const client = new FakeClient(db);
  const history = { name: "000.sql", sql: "BEGIN; select 1; COMMIT;" };
  await runMigrations({ client, files: [history, ...files] });
  assert.deepEqual(db.names, ["000.sql", "001.sql", "002.sql"]);
  assert.ok(!client.calls.includes(history.sql));
});
