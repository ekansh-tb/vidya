import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Lazy Neon client.
 *
 * Initialisation is deferred because Next evaluates top-level module code at
 * build time, and `neon()` throws when DATABASE_URL is absent — which would
 * break `next build` in CI, where the build is deliberately key-free.
 *
 * Deliberately a plain function, NOT a Proxy wrapper. Proxy-based lazy clients
 * break libraries that introspect the object (checking method existence,
 * iterating properties) and fail in ways that surface as a hang with no error.
 *
 * `server-only` is imported at the top so importing this from a client
 * component is a build error rather than a leaked connection string.
 */
let cached: ReturnType<typeof neon> | null = null;

/* eslint-disable @typescript-eslint/no-explicit-any -- the driver's tagged
   template returns a union covering several result modes. We only ever use
   the default (array-of-rows) mode, so we narrow it once here rather than
   casting at every call site in queries.ts. */
export type Row = Record<string, any>;
export type SqlTag = (strings: TemplateStringsArray, ...values: any[]) => Promise<Row[]>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

export function getSql(): SqlTag {
  if (!cached) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) {
      // Callers should check dbConfigured() and degrade. The app must keep
      // working on localStorage alone when no database is attached.
      throw new Error(
        "DATABASE_URL is not set. Check dbConfigured() before calling getSql().",
      );
    }
    cached = neon(url);
  }
  return cached as unknown as SqlTag;
}

/** Test seam — drops the memoised client so a test can swap the URL. */
export function __resetSqlClient() {
  cached = null;
}
