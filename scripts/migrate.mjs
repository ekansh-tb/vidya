#!/usr/bin/env node
// Usage: node --env-file=.env.local scripts/migrate.mjs [--dry-run]
// Real runs require DATABASE_URL_UNPOOLED or POSTGRES_URL_NON_POOLING.
// MIGRATION_LOCK_TIMEOUT_MS defaults to 30000, range 1..300000.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { migrationConfig, runMigrations, safeFailure } from "./migration-runner.mjs";

const directory = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");

try {
  const config = migrationConfig(process.env, process.argv.slice(2));
  const files = readdirSync(directory).filter((name) => name.endsWith(".sql")).sort()
    .map((name) => ({ name, sql: readFileSync(join(directory, name), "utf8") }));
  const client = new pg.Client({
    connectionString: config.url,
    connectionTimeoutMillis: 10000,
  });
  client.on("error", () => {
    console.error("Migration connection failed; verify database state before retrying.");
    process.exitCode = 1;
  });
  await runMigrations({ client, files, ...config, log: console.log });
} catch (error) {
  console.error(safeFailure(error));
  process.exitCode = 1;
}
