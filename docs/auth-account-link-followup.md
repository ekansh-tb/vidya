# Parent enrollment and learner account linking

This describes the implemented identity foundation and its rollout contract.
It supersedes older auth assumptions that every signup becomes a parent or
learners never sign in. Device claims remain separate and must never bind a
parent's own Clerk account to a learner.

## Release status

Account storage shipped in PR71 (`a6eaf52`), and migration 0009 was safely
applied to production. PR77 also shipped the 0010 guidance storage foundation. Production has migrations 0001 through 0011.
The resolver changes, account/enrollment endpoints and parent/learner UI
described below are implemented but pending release. Storage deployment alone
does not enable or establish acceptance of these application flows.

The live deployment still uses Clerk development keys. Identification of the
intended Clerk production instance is pending user input. The authenticated
family-isolation, revocation and re-verification loop has not been browser
accepted. Live Clerk acceptance remains outstanding.

The auth-only release excludes guidance endpoints, tutor guidance lookup and the
guidance panel. References to that separate feature below describe its planned
integration contract, not functionality included in the account-linking release.

## Authority and enrollment

Clerk authenticates accounts, not adulthood or guardian authority. Existing
`parents` records retain authority. Unknown signed-in accounts stay unlinked;
client role fields or metadata cannot grant access to any existing family.
Learner classification persists in `learner_account_subjects`, including after
revocation or learner deletion. Classified learners cannot enroll as parents.
Active bindings use unique `learners.clerk_user_id`. Legacy self-link repair
cannot create parent authority.

New parents enroll at `/parent/enroll` with an authenticated Clerk `currentUser`
matching the session, verified primary email, strict recent re-verification,
and explicit adult parent/guardian attestation. Parent creation, acknowledgement
and audit commit atomically. Enrollment attaches no existing learner or family.
Repeats are idempotent; legacy parents remain usable without retroactively
claiming they acknowledged the declaration.

The canonical text is in `lib/auth/parent-enrollment-contract.ts`.
`parent-guardian-v1` records exact text, account/session/email references,
verified email, database timestamp and re-verification preset. A text change
requires a new version. Only the current version and literal `true` are accepted;
identity and evidence come from the server.

Self-attestation is not proof of age, verified guardianship or comprehensive
legal consent. Retention, withdrawal and separate processing/AI consent remain
policy decisions. The `/mission` narrative is separate from the acknowledgement:
parents guide AI, children learn and question, and future adult roles require an
explicit step rather than inherited authority.

## Entry points and family isolation

- `/parent` requires server-established parent authority before rendering the
  dashboard. Unlinked accounts reach enrollment; known learners receive a
  separate-adult-account explanation.
- The exact `parents.vidyagyan.study/` root redirects to `/parent` after Clerk
  runs, discarding query parameters. Other hosts and paths are unchanged.
  Without Clerk configuration, root stays reachable so the parent fallback
  cannot loop. This does not bypass authentication or authority checks.
- `/learner/account` is optional. Guest learning remains available. Signing in
  or reading status does not classify an account; requesting a link requires
  explicit learner opt-in.
- The dashboard uses only the authenticated server-owned roster from
  `/api/parent/roster`. Remote-only learners appear; other-family and device-local
  profiles never merge or provide fallback data. Failed loads hide roster data
  and offer retry. Account changes clear panel state. Account-link and guidance
  panels mount only for server-owned learner IDs.

AI, device, safety, capability and validated report/export controls remain.
Unavailable reports do not fall back to local progress. Local family-note and
syllabus fields have no scoped persistence contract and are not migrated by this
feature. The separate in-app PIN parent room and offline/downloaded data remain
outside this protection. Revocation affects subsequent authorization, not
requests already in flight, Clerk sessions or previously downloaded data.

## HTTP contract

This is the contract for the pending application release, not a claim that
these endpoints are available in production.

Mutations require an exact matching `Origin`, storage and a Clerk session.
JSON bodies reject unknown fields and are limited to 2048 bytes. Responses are
private/no-store. The shared async limiter allows 20 mutations per account per
ten minutes, returns 429 on exhaustion and fails closed with 503 and retry
headers when unavailable. It depends on migration 0011. Proxies must preserve
the public request origin.

| Endpoint | Request and result |
| --- | --- |
| POST `/api/account/parent-enrollment` | `{ adultGuardianAttestation: true, acknowledgementVersion: "parent-guardian-v1" }` returns `{ ok: true, acknowledgementVersion }`. Requires verified email and recent re-verification. |
| GET `/api/account/learner-link` | Returns authenticated `accountId` and status: unclassified, parent, unlinked, revoked, pending, expired or linked. Pending/expired includes `expiresAt`; linked includes learner and guardian display names. Never classifies. |
| POST `/api/account/learner-link` | `{ learnerAccountAcknowledgement: true }` returns 201 `{ accountId, token, expiresAt }`. Persistently classifies the caller as a learner. Parents and already-linked accounts receive 409. Creates no Clerk user or learner access. |
| GET `/api/parent/learners/:id/account-link` | Returns `{ parentId, clerkUserId }` for an owned learner, with null `clerkUserId` when unbound. |
| POST `/api/parent/learners/:id/account-link` | Inspect: `{ action: "inspect", token }` returns `{ clerkUserId, expiresAt }`. Approve: `{ action: "approve", token, expectedClerkUserId }` returns `{ ok: true }`. Both require current ownership and strict recent re-verification. |
| DELETE `/api/parent/learners/:id/account-link` | Revokes the binding with current ownership and recent re-verification. Returns `{ ok: true }`, including for an already-unbound owned learner. |

Status reads use the shared origin/referer guard and require authentication and
storage, but not mutation limits or re-verification. Errors include 400 for
invalid input, 401 for missing identity, 403 for origin/email failures or Clerk
re-verification challenges, 404 for unavailable/foreign/expired/replayed pairings,
409 for classification conflicts, 429 for limits and 503 for unavailable
operations. Foreign learner existence is not disclosed.

Tokens contain 256 random bits, expire after ten minutes and are stored only
as domain-separated SHA-256 hashes. Rotation invalidates the previous token.
Tokens travel only in JSON bodies and stay in component memory, never URLs,
logs or localStorage. Hiding a code clears its display, not server validity.

Parents inspect the distinct account reference and deliberately confirm before
approval. Editing the token invalidates inspection. Approval rechecks expected
subject, expiry and current ownership; token possession alone grants no
authority. Approval does not change guardian ownership, verification level,
capabilities, tutor assignment or learner state. Revocation preserves learner
classification and separate device credentials. Relinking requires a fresh
request and approval.

Learners see disclosure about synced progress, safety reports, teaching guidance
and device management. Private reflection text is excluded from parent reports;
this does not promise privacy for everything on a shared device.

## Database guarantees

Migration 0009 adds persistent learner subjects, one outstanding request per
subject, acknowledgements and four `SECURITY INVOKER` functions. Existing genuine
learner bindings are backfilled; historical self-links are excluded. The runner
owns the SQL/tracking transaction, so 0009 has no outer transaction wrappers.

All identity mutations share a transaction advisory lock. Approval and
revocation also lock the owned learner row. Approval rechecks token expiry/use,
reviewed subject, absence of parent authority and absence of another binding.
The unique Clerk ID index is the final uniqueness constraint. Binding, token
consumption and audit commit or roll back together. Audits contain account
references, never tokens or hashes.

Enrollment and learner classification use the same lock: whichever commits
first prevents conflicting classification. SQL receives trusted server evidence;
it does not authenticate Clerk or independently verify email. PUBLIC execute
is revoked. If the application role differs from the migration owner, grant
only required table/function rights. This is not RLS or browser database access.
Direct writers must preserve these invariants and never bypass enrollment with
legacy parent upserts.

## Validation and rollout

Focused identity/UI/route and middleware unit tests and scoped lint have passed.
Component rendering and API mocks do not establish live Clerk/browser acceptance.

All three identity suites are registered in `scripts/test-integration.mjs`:

- `lib/db/account-links.integration.test.ts`
- `lib/db/parent-enrollment.integration.test.ts`
- `lib/db/account-links.races.integration.test.ts`

The 18 database cases cover sequential identity/enrollment behavior,
classification races, double approval, rotation and revocation in both orders,
and ownership transfer/deletion conflicts. Fixtures use random per-test hashes.
Require passing serialized CI evidence for the release revision. Run files
with `--no-file-parallelism` because production identity
functions intentionally share an advisory lock. Independent connections within
each race test remain concurrent.

Integration tests require explicit `VIDYA_REQUIRE_TEST_DB=1` and a dedicated
`vidya_integration` database with `vidya_test_runner` role. The guard checks both
URL and actual database/current/session identities before fixtures. Errors
suppress raw diagnostics; only a validated five-character SQLSTATE may be shown.
Connection, statement, query and idle-transaction timeouts bound failures.
Cleanup releases locks and closes connections in finally blocks. Sequential
fixtures roll back; race fixtures commit to exercise visibility and are deleted.
Tests never migrate.

Migration 0009 is applied in production. Read-only preflight found zero self-links, zero cross-parent
overlaps and zero duplicate linked subjects, without emitting identities.

Release requirements:

1. Require a passing serialized integration run against the dedicated migrated
   test database. Confirm application-role privileges and legacy parent records.
2. Preserve migration-before-code ordering: 0009 is already applied, while
   dependent application code remains pending. Do not enable
   requests while older instances auto-promote unlinked sessions to parents.
   **Never roll back to the old resolver after pairing is enabled.** Persistent
   learner classifications are security data.
3. Release enrollment, authority gates and linking UI together so new parents
   retain an explicit enrollment path.
4. Obtain user identification of the intended Clerk production instance and
   replace development keys with its approved live configuration. Validate
   distinct sessions, verified email, re-verification, inspect/approve/revoke,
   expiry, account switching and parent-domain redirects with approved live
   configuration. Authenticated family isolation, revocation and re-verification
   must pass browser acceptance. **Live Clerk acceptance remains outstanding.

The auth-only release excludes guidance endpoints, tutor guidance lookup and the
guidance panel. References to that separate feature below describe its planned
integration contract, not functionality included in the account-linking release.**
5. Review consent, retention and withdrawal policy separately from the versioned
   self-attestation. AI guidance and learner edits must never confer guardian
   authority.
