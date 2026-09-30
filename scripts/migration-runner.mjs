import { assertMigrationSql, MigrationSqlError } from "./migration-sql.mjs";

// Fixed application-wide key. All runners must use the same direct database.
export const LOCK_KEY = [1447642185, 1];

class MigrationFailure extends Error {
  constructor(stage, cause) {
    super(`Migration failed during ${stage}. Verify database state before retrying.`);
    this.sqlState = /^[0-9A-Z]{5}$/.test(cause?.code ?? "") ? cause.code : undefined;
  }
}

export function safeFailure(error) {
  // Never include driver messages, stacks, SQL, URLs, or database detail fields.
  return error instanceof MigrationFailure
    ? `${error.message}${error.sqlState ? ` SQLSTATE ${error.sqlState}.` : ""}`
    : "Migration setup failed. Check configuration and migration file access.";
}

export function migrationConfig(env, args = []) {
  if (args.some((arg) => arg !== "--dry-run")) throw new MigrationFailure("argument validation");
  const dryRun = args.includes("--dry-run");
  const url = env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING ||
    (dryRun && (env.DATABASE_URL || env.POSTGRES_URL));
  if (!url) throw new MigrationFailure("configuration (set DATABASE_URL_UNPOOLED or POSTGRES_URL_NON_POOLING)");
  // Named variables declare a direct endpoint. Reject known pooler endpoints too.
  const parsed = new URL(url);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) ||
      (!dryRun && /pooler|pgbouncer/i.test(parsed.hostname))) {
    throw new MigrationFailure("configuration (a direct PostgreSQL endpoint is required)");
  }
  const rawTimeout = env.MIGRATION_LOCK_TIMEOUT_MS ?? "30000";
  const lockTimeoutMs = Number(rawTimeout);
  if (!/^\d+$/.test(rawTimeout) || !Number.isSafeInteger(lockTimeoutMs) ||
      lockTimeoutMs < 1 || lockTimeoutMs > 300000) {
    throw new MigrationFailure("configuration (MIGRATION_LOCK_TIMEOUT_MS must be 1..300000)");
  }
  return { url, dryRun, lockTimeoutMs };
}

export async function runMigrations({ client, files, dryRun = false, lockTimeoutMs = 30000, log = () => {} }) {
  let stage = "connection";
  let locked = false;
  let inTransaction = false;
  let failure;
  let count = 0;
  try {
    if (!Number.isInteger(lockTimeoutMs) || lockTimeoutMs < 1 || lockTimeoutMs > 300000) {
      stage = "lock timeout validation";
      throw new Error();
    }
    await client.connect();
    if (dryRun) {
      stage = "read-only inspection";
      await client.query("begin isolation level repeatable read read only");
      inTransaction = true;
    } else {
      stage = "advisory lock acquisition";
      await client.query("select set_config('lock_timeout', $1, false)", [`${lockTimeoutMs}ms`]);
      await client.query("select pg_advisory_lock($1::integer, $2::integer)", LOCK_KEY);
      locked = true;
      await client.query("reset lock_timeout");
    }
    stage = "migration history inspection";
    const exists = (await client.query("select to_regclass('_migrations') as relation")).rows[0].relation;
    const applied = new Set(exists
      ? (await client.query("select name from _migrations")).rows.map((row) => row.name)
      : []);
    const ordered = [...files].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    // Validate the entire pending bundle before even creating the tracking table.
    // Historical applied files are never rerun or rewritten.
    for (const [index, file] of ordered.filter(({ name }) => !applied.has(name)).entries()) {
      stage = `pending migration ${index + 1} SQL preflight`;
      try { assertMigrationSql(file.sql); }
      catch (error) {
        if (error instanceof MigrationSqlError) stage += ` (${error.message})`;
        throw error;
      }
    }
    if (!dryRun) {
      stage = "tracking table initialization";
      await client.query(`create table if not exists _migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      )`);
    }
    for (const { name, sql } of ordered) {
      if (applied.has(name)) {
        log(`  skip ${JSON.stringify(name)} (already applied)`);
        continue;
      }
      if (dryRun) {
        log(`  would apply ${JSON.stringify(name)} (${sql.split("\n").length} lines)`);
      } else {
        // Report only an ordinal on failure, never SQL or driver text.
        stage = `migration ${count + 1} transaction`;
        await client.query("begin");
        inTransaction = true;
        await client.query(sql);
        await client.query("insert into _migrations (name) values ($1)", [name]);
        await client.query("commit");
        inTransaction = false;
        log(`  applied ${JSON.stringify(name)}`);
      }
      applied.add(name);
      count++;
    }
    if (inTransaction) {
      await client.query("commit");
      inTransaction = false;
    }
    log(count === 0 ? "Already up to date." : `${dryRun ? "Would apply" : "Applied"} ${count} migration(s).`);
  } catch (error) {
    failure = new MigrationFailure(stage, error);
  } finally {
    if (inTransaction) {
      try { await client.query("rollback"); }
      catch (error) { failure ??= new MigrationFailure("rollback", error); }
    }
    if (locked) {
      try { await client.query("select pg_advisory_unlock($1::integer, $2::integer)", LOCK_KEY); }
      catch (error) { failure ??= new MigrationFailure("advisory lock release", error); }
    }
    // Closing the direct session releases locks if explicit unlock failed.
    try { await client.end(); }
    catch (error) { failure ??= new MigrationFailure("connection cleanup", error); }
  }
  if (failure) throw failure;
  return { count, dryRun };
}
