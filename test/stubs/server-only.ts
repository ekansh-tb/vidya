// No-op stand-in for the `server-only` package under Vitest.
//
// The real package throws when imported outside a React Server Component. That
// guard is valuable in the Next build — it makes importing lib/db/** from a
// client component a build error — but under Vitest there is no RSC graph, so
// it would fail every test that touches a server module for no real reason.
export {};
