#!/usr/bin/env node
// Applies db/migrations/*.sql in filename order, exactly once each.
//
// Deliberately dependency-light: a tracking table plus a transaction per file.
// An ORM's migration tooling would be more than this schema needs, and the
// SQL is the thing we actually want to read in review.
//
// Usage:
//   node --env-file=.env.local scripts/migrate.mjs
//   DATABASE_URL=... node scripts/migrate.mjs
//   node scripts/migrate.mjs --dry-run
//
// Note: drizzle-kit/tsx-style tools do NOT auto-load .env.local — neither does
// plain node without --env-file. Pass it explicitly or export DATABASE_URL.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const HERE = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(HERE, "..", "db", "migrations");
const DRY_RUN = process.argv.includes("--dry-run");

// Prefer the unpooled URL: DDL over a transaction pooler is a good way to get
// mysterious failures.
const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!url) {
  console.error(
    "No database URL. Set DATABASE_URL (or DATABASE_URL_UNPOOLED), e.g.\n" +
      "  vercel env pull .env.local && node --env-file=.env.local scripts/migrate.mjs",
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });

async function main() {
  await client.connect();

  await client.query(`
    create table if not exists _migrations (
      name       text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const applied = new Set(
    (await client.query("select name from _migrations")).rows.map((r) => r.name),
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  let ran = 0;
  for (const name of files) {
    if (applied.has(name)) {
      console.log(`  skip  ${name} (already applied)`);
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, name), "utf8");
    if (DRY_RUN) {
      console.log(`  would apply  ${name} (${sql.split("\n").length} lines)`);
      ran++;
      continue;
    }
    process.stdout.write(`  apply ${name} ... `);
    try {
      // One transaction per migration: a failure leaves nothing half-applied.
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into _migrations (name) values ($1)", [name]);
      await client.query("commit");
      console.log("ok");
      ran++;
    } catch (e) {
      await client.query("rollback").catch(() => {});
      console.log("FAILED");
      console.error(`\n${name} failed and was rolled back:\n${e.message}\n`);
      process.exitCode = 1;
      return;
    }
  }

  console.log(ran === 0 ? "\nAlready up to date." : `\n${DRY_RUN ? "Would apply" : "Applied"} ${ran} migration(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => client.end().catch(() => {}));
