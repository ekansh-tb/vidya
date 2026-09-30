# Migration safety checks

The ordinary fake-client and configuration suite needs no secrets and makes no
database connections:

```sh
node --test test/migrations/*.test.mjs
```

The real PostgreSQL harness is deliberately named `postgres-harness.mjs`, outside
that test glob. It is a standalone, sequential executable with an explicit opt-in
environment variable and command argument. Default Node test discovery skips the
harness without that argument, even if the environment variable is inherited.
It uses only `VIDYA_TEST_DATABASE_URL`, never the application's database variables.
The URL must identify database `vidya_integration` and role `vidya_test_runner`
on a direct PostgreSQL endpoint. The harness checks database, effective role, and
session role again after every connection, before DDL. URL query parameters other
than a single supported `sslmode` are rejected to prevent identity overrides.

Suggested CI step for main to apply after provisioning the dedicated test database
and role (the role needs CREATE on that database):

```yaml
- name: Verify PostgreSQL migration safety
  timeout-minutes: 3
  env:
    VIDYA_RUN_MIGRATION_INTEGRATION: "1"
    VIDYA_TEST_DATABASE_URL: ${{ secrets.VIDYA_TEST_DATABASE_URL }}
  run: node test/migrations/postgres-harness.mjs --run-postgres-integration
```

Do not run this step concurrently with other migration jobs against the same test
database: it intentionally exercises the runner's shared advisory-lock key.
The connection must lead to the isolated integration database, never production.
For a local run, inject the same two environment variables privately, then use the
same command. PostgreSQL 14+ is required for `idle_session_timeout`.

Each case creates a random `vidya_migration_<uuid>` schema and sets an exclusive
search path to it. Fixtures are embedded synthetic SQL; no repository migration
SQL is executed. Cases verify:

- Empty-schema dry run leaves zero tables, including no tracking table.
- Both concurrent runners wait on the lock, then apply and track the fixture once.
  Waiters are identified with SQL `pg_backend_pid()`, since a direct endpoint's
  protocol process ID can differ from the PID exposed in `pg_locks`.
- A 150 ms lock timeout returns SQLSTATE 55P03 before any migration DDL.
- Failed SQL rolls back data, DDL, and tracking for that file, retains the earlier
  committed file, releases the session lock, and permits retry.
- A bundled migration containing actual top-level BEGIN/COMMIT is rejected before
  any file runs, leaving zero tables and releasing the lock.
- A real tracking constraint failure rolls back already-successful fixture SQL,
  including a PLpgSQL function body, together with the tracking insert.

## Migration file contract

The runner preflights every pending file before tracking-table DDL or file SQL,
including during dry runs. It rejects top-level transaction control, including
BEGIN/COMMIT, END/ABORT aliases, SAVEPOINT, and PREPARE TRANSACTION. The runner owns
the transaction containing both file SQL and its tracking row. It does not strip
or rewrite migration SQL.

The lexical scanner treats comments (including nested block comments), quoted
identifiers, strings, and dollar-quoted function bodies as opaque. PLpgSQL
BEGIN/END inside those bodies are preserved. Unterminated quotes/comments fail
closed. Plain strings containing backslashes are rejected because interpretation
depends on session settings; use explicit PostgreSQL E strings instead.
Use quoted function bodies, rather than unquoted SQL BEGIN ATOMIC bodies.

Already-applied files remain skipped. The inspected historical files 0001 through
0008 pass preflight unchanged, so this guard does not block them on a fresh
database. Draft 0009 initially contained outer BEGIN/COMMIT; those wrappers were
removed during this review while retaining the PLpgSQL blocks. The final
static audit passed every current file, 0001 through 0011. This establishes
preflight compatibility, not successful execution of those full migrations.

Cleanup closes all test sessions, then uses a fresh verified connection to check
the exact generated schema's owner and recorded OID before dropping only that
schema with CASCADE. If creation had an ambiguous outcome before recording its
OID, cleanup checks the exact generated name and owner. Connection and socket
closure deadlines are 5 seconds; cleanup DROP has a 3 second statement timeout
and 1 second lock timeout. Failure is nonzero, with the generated schema name
reported if manual cleanup is required. A hard process kill can bypass cleanup.

Driver errors are sanitized; failures retain harness stages, assertion context,
and SQLSTATE without including assertion values, SQL, or connection details.
Successful cases print confirmation only after schema cleanup succeeds.
