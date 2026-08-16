# Auth & Verification Architecture

Last updated: 2026-08-16 (audited against the codebase)

> **Status note:** Vidya uses Clerk for parent identity and Neon Postgres for
> linked learners, revocable device tokens, learner-state sync, capability
> usage and safety signals. Anonymous learner profiles remain local-first in
> localStorage until a parent explicitly links them.
>
> **Read this before trusting the design below.** Sections marked
> *(spec)* describe a target that is not built. Parent ownership, device-token
> identity, revoked-device denial, parent capability switches and per-learner
> daily tutor usage are enforced on the server. Rungs 1 and 3, dynamic policy
> rows, cohorts and safety pins remain unbuilt. See "Implementation status".

## Stack: partially shipped target

- **Clerk** *(shipped)* - parent sign-in/sign-up UI, sessions and JWT
  issuance. The shipped app does not create learner Clerk accounts or write
  role metadata.
- **Neon Postgres** *(shipped)* - stores linked learners, devices, state,
  capability usage and safety signals. Ownership is checked in scoped SQL
  queries rather than Postgres RLS.
- **Next.js App Router middleware** *(shipped)* — gates `/parent/**` to
  signed-in users, bounces signed-in users away from `/sign-in`. Role
  gating against `/student/**` is wired in the design but the
  `/student/**` route group is not yet created.

Clerk handles parent identity. The learner device proves a parent-approved
link with a revocable token. The browser remains the offline-first source of
truth and synchronizes linked learner state to Postgres.

## Path topology

```
/                        → marketing landing + onboarding story   (spec)
/sign-in                 → Clerk SignIn component                 (shipped)
/sign-up                 → role chooser → Clerk SignUp            (shipped, no role chooser)
/student/**              → kid app (home view + all kid surfaces) (spec — kid app is at `/`)
/parent/**               → parent dashboard, learner links, care (shipped)
/auth/callback           → Clerk → DB JWT exchange (no UI)        (dropped with Supabase)
```

Same domain, path isolation. Cookies are scoped by Clerk. Preview deploys
work unchanged.

## Identities and roles

The shipped identity model has two distinct credentials:

- **Parent** - a Clerk user who manages linked learner profiles, devices,
  capability switches and parent-only reports.
- **Learner device** - an anonymous local profile that can redeem a
  parent-issued code for a revocable device token. The learner does not sign
  up for Clerk.

The schema retains `learners.clerk_user_id` for a future older learner with a
genuine account, but no current UI creates that account. Clerk role metadata is
not written or checked today.

## The 4-rung verification ladder

The canonical version lives in the `verification-ladder` project memory.
Quick reference (DEFAULTS — actual gates are policy-driven, see "Dynamic
guardrails" below):

| Rung | Name | Default unlocks (additive) | Trigger |
|------|------|----------------------------|---------|
| 0 | unverified | Local learning loop, classroom AI peers, friend streaks, music, library, wellness, review notebook | Default local profile |
| 1 | network_verified | Limited rate-limited AI tutor, share-app-to-friend link | IP+ASN fingerprint matches a parent device's recent fingerprint |
| 2 | parent_verified | Full AI tutor, parent dashboard write access, exam alerts | Parent creates the learner and code, then the learner device redeems it |
| 3 | strict_verified | BYOK AI providers, incognito mode for that kid, medical advisories, health profile | Manual team review (govt ID + selfie OR Stripe Identity) — operations TBD |

**Critical UI rule:** the kid never sees rung gates explicitly. Locked
features are absent, not greyed out. See the `parent-invisible-config`
project memory.

## Dynamic guardrails (policy resolution)

Capability → rung mappings are **not hardcoded**. They live in a
`capability_policies` table and are evaluated per session via a
`useCapability(key)` hook (server) / capability resolver (client).
A capability key (`ai.tutor.full`, `byok.openai`, `incognito.enabled`,
`share.crossNetwork`, …) resolves to a `{ allowed, reason, expiresAt }`
shape.

Inputs to the resolver:
1. Current policy row for the key (`min_rung`, `ai_safety_pin`, `cohort`).
2. Learner's `verification_level`.
3. Learner-seeded jitter (rate limits, challenge difficulty) keyed by
   `learner.id` so the same kid is consistent but the cohort is wide.
4. Active AI-safety model version. A capability is denied if the current
   model is older than the policy's `ai_safety_pin`.

This means we can:
- Open `ai.tutor.full` to rung-1 kids in safer cohorts without a deploy.
- Tighten a capability for all kids the moment a safety regression is
  observed.
- A/B test a new feature against a subset of cohorts before global rollout.

See the `dynamic-guardrails` project memory.

*(spec)* — none of the four resolver inputs above are live. The shipped
resolver (`lib/capabilities/use-capability.ts`) reads a static map and a
locally-computed rung, and applies the parent's `disabledCapabilities`
override. No cohorts, no jitter, no safety pin, no rate limits.

## Same-network detection (rung 1) — NOT BUILT, and the spec below is unsound here

The original design was: on every learner session start, log an opaque
fingerprint `sha256(ip_class_c + asn + user_agent_family)`; if it matches a
parent's fingerprint from the last 14 days, auto-promote the learner row to
`network_verified`. No raw IPs stored, one-way, rotated per parent session.

**Do not implement that as written.** The privacy handling is careful, but the
signal does not survive contact with this deployment.

The learners are in Pune, on Indian consumer ISPs and mobile carriers, where
CGNAT is the norm rather than the exception. A single carrier-NAT `/24` fronts
thousands of unrelated subscribers. The fingerprint's three inputs collapse in
exactly that setting: `ip_class_c` is the shared NAT range, `asn` is the
carrier every one of those households is on, and `user_agent_family` is
"Mobile Safari" for a large share of them. So the fingerprint would match
across strangers, at scale, and — because the design *auto-promotes and writes
`verification_level`* — it would hand a persistent rung to other people's
children and bill their AI use to this project.

That is not a tuning problem. A rung is a claim about who vouched for a child;
one that fires for a stranger on the same carrier means nothing, and a rung
that means nothing is worse than an absent one, because the parent dashboard
reports it as a verification.

**If rung 1 is wanted, the signal to use is "a parent is signed in on THIS
browser"** — a Clerk session cookie on the same device the child is using. It
is stronger than same-network (an identified adult deliberately signed in
here, rather than merely sharing an ISP), it needs no fingerprinting and no new
table, and it matches the one-iPad family setup the rest of this architecture
is built around. It has not been built either; it is written down here so the
next person does not reach for the IP version.

Until then rungs 0, 2 and 3 are the ladder, and `ai.tutor.limited` is
unreachable — see the gaps section.

## Parent verification flow (rung 2) *(rewritten 2026-08-13)*

**The kid never signs in.** That is the load-bearing fact, and the earlier
version of this section got it wrong — see "What the old Door A got wrong"
below, because the mistake is instructive and easy to reintroduce.

1. Parent signs up via `/sign-up` and signs in at `/parent`
2. Parent clicks "Add this learner to my account" → a `learners` row with
   `parent_id = <parent's Clerk id>`
3. Parent clicks "Create a code" to create a 6-character single-use
   `claim_code` with a 120-minute TTL from a 32-symbol alphabet with
   `O/0/I/1` removed
4. Parent reads the code to the kid
5. Kid types it into Vidya on their own device. **No session is required.**
   The server checks same-origin, rate-limits to 10 tries per 10 minutes,
   validates the code, sets `verification_level = 2`, and mints a **device
   token** — 32 random bytes, returned once, stored as a SHA-256 hash in
   `learner_devices`
6. The device presents that token as `x-vidya-device` on every sync request
   (or in the POST body for the tab-hide `sendBeacon`, which cannot set
   headers). The parent can revoke any device from the dashboard; when the
   last one goes, the learner drops back to rung 0

### What the old Door A got wrong

Step 7 used to read "kid signs up via `/sign-up`, picks role=learner", and
step 8 wrote the kid's Clerk id onto `learners.clerk_user_id`. Three things
were wrong with it, and none were visible from the spec alone:

- **The kid app has no sign-in affordance and is not getting one.** Clerk
  components exist only under `/parent` and the two auth pages. `/api/tutor`
  and `/api/assembly` are deliberately public for the same reason.
- **On the real family setup — one iPad, one browser — the only signed-in
  account is the parent's.** So the only person who *could* complete the flow
  was the parent, and doing so wrote their own Clerk id onto their child's
  row. `resolveIdentity` then classified them as a learner, `requireParent()`
  returned null forever, and every `/api/parent/*` route answered 401. There
  was no unlink control in the app or the database.
- **`learners.clerk_user_id` is UNIQUE**, so a second sibling redeeming from
  the same browser hit a constraint violation and got a 500.

`resolveIdentity` now repairs the first case on sight: a Clerk id that appears
as both `parent_id` and `clerk_user_id` on one row is corruption, not a role,
so it is cleared and the caller continues as the parent. `clerk_user_id`
itself is kept — it is still the right column for an older learner who
genuinely does have their own sign-in — it is simply no longer written by
redeem.

**Door B — kid signs up first:** dropped. It was premised on the kid having an
account.

## Strict verification (rung 3)

Out of scope for v1. The mechanism (Stripe Identity vs manual review) is TBD.
The schema reserves the rung so we can ship the features it gates (BYOK,
incognito, medical) immediately when ops capacity exists.

For v1: any feature requiring rung 3 is hidden in the UI until rung is set
manually in the DB by ops.

## Data model

**The migrations are the spec.** `db/migrations/*.sql` is applied against a
live Neon Postgres and carries the reasoning inline; this section used to
duplicate the shape in prose and drifted from it, which is how a doc ends up
describing a flow nobody can perform.

- `0001_init.sql` — `parents`, `learners`, `learner_states`, `claim_codes`,
  `link_audit`
- `0002_learner_devices.sql` — `learner_devices`, the per-device credential
  that replaced "the kid signs in"
- `0003_disabled_capabilities.sql` — `learners.disabled_capabilities`, which
  is what makes the parent's per-learner switches binding on the server
  instead of just hiding a room in the kid's lobby
- `0004_capability_usage.sql` — `capability_usage`, the per-learner daily
  counter that makes `CapabilityPolicy.rateLimit.perDay` a real limit rather
  than a declared one
- `0005_safety_signals.sql` - `safety_signals`, the persistent record for
  reportable tutor safety events and parent acknowledgement

Two things the migrations cannot say for you, so they are said here:

- `claim_code` / `claim_code_expires_at` were never columns on `learners`.
  Codes live in their own table so issuing a new one can invalidate the old.
- `parent_network_fingerprints` (rung 1) does not exist. Rung 1 is unbuilt;
  only rungs 0 and 2 are reachable in code.

`lib/auth/types.ts` mirrors the `capability_policies` row in TypeScript. That
table is also still unbuilt — the capability map is static in the client.

```
-- Superseded. Kept only to show what the old spec claimed, since the
-- redeem flow above was written against it.
learners (
  ...
  clerk_user_id         text unique,    -- "null until kid signs up" — the kid
                                        -- never signs up; see the flow above
  claim_code            text,           -- never existed; see claim_codes
  claim_code_expires_at timestamptz     -- never existed
)

-- Unbuilt below this line. `link_audit` shipped in 0001 under that name and
-- with a different shape; the capability tables were never created.
parent_child_links_audit (
  id           uuid primary key default gen_random_uuid(),
  parent_id    text references parents(id),
  learner_id   uuid references learners(id),
  event        text,                   -- 'created' | 'linked' | 'promoted' | 'demoted' | 'strict_approved'
  by_user      text,
  created_at   timestamptz default now()
)

capability_policies (
  key           text primary key,      -- e.g. 'ai.tutor.full'
  min_rung      int not null default 3,
  ai_safety_pin text,                  -- e.g. 'claude-sonnet-4.6+' — capability denied if active model is older
  cohort        text default 'global', -- 'global' | 'beta' | 'school:bvb-nagpur' | …
  rate_limit    jsonb,                 -- e.g. {"perDay": 20, "burst": 5} — null means resolver default
  updated_at    timestamptz default now(),
  updated_by    text
)

capability_policy_audit (
  id            uuid primary key default gen_random_uuid(),
  key           text not null,
  previous      jsonb,
  next          jsonb,
  changed_by    text,
  changed_at    timestamptz default now()
)
```

**Isolation is enforced in the queries, not by RLS.** There is no Postgres
row-level security here — the app connects as one role. Instead every function
in `lib/db/queries.ts` scopes its SQL by ownership, and the file's header
states the rule: there is deliberately no `getLearnerById(id)`, because that
is exactly how one family ends up reading another family's child by guessing a
UUID. A miss answers 404, never 403, so the response never confirms that
another family's learner id exists.

What that works out to:
- A parent reaches a learner only via `parent_id = <their Clerk id>` in the
  where-clause.
- A device reaches a learner only via the SHA-256 of the token it presents,
  and only while `revoked_at is null`.
- A learner with their own sign-in reaches their row via `clerk_user_id` —
  still supported, not used by the redeem path.

## Environment variables

Required today (see `.env.local.example`):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    # pk_test_... or pk_live_...
CLERK_SECRET_KEY                     # sk_test_... or sk_live_...
ANTHROPIC_API_KEY                    # or AI_GATEWAY_API_KEY / VERCEL_OIDC_TOKEN
DATABASE_URL                         # or POSTGRES_URL for Neon
```

No Supabase variables or Clerk JWT template are used. Server routes own the
database connection and enforce parent or device ownership in scoped queries.

## Implementation status

Audited against the codebase on 2026-08-16.

| # | Step | Status |
|---|------|--------|
| 1 | Install `@clerk/nextjs` | ✅ done |
| 2 | Wire `ClerkProvider` in `app/layout.tsx` | ✅ done |
| 3 | `/sign-in` page with Clerk `<SignIn />` | ✅ done |
| 4 | `/sign-up` page | ✅ done — **no role chooser**; every signup is implicitly a parent |
| 5 | Move kid app to `/student/**`, `/` becomes marketing | ❌ not done — `/` is still the kid app; there is no marketing landing |
| 6 | Role-gate paths in middleware | ⚠️ partial — `/parent(.*)` requires *a* session; role is never checked because no role is ever written to `publicMetadata` |
| 7–9 | Server DB + DB client | ✅ done — Neon Postgres, `db/migrations/`, `lib/db/queries.ts`. No JWT template; ownership is checked in SQL |
| 10 | localStorage → server sync | ✅ done — `lib/sync/`, gated on a linked device |

Known gaps, re-checked 2026-08-16:

- **Rungs 1 and 3 are unreachable.** `computeRung()` in
  `lib/capabilities/use-capability.ts` returns only 0 or 2. Rung 3 needs an ops
  process. Rung 1 is a deliberate non-build, not an oversight — the
  network-fingerprint design is unsound on Indian CGNAT; see the section above
  for why, and for the signal to use instead.
- **`ai.tutor.limited` is dead**, and stays dead while rung 1 does. The tutor
  route resolves and bills only `ai.tutor.full`. Making rung 1 reachable would
  not activate the limited tier by itself; the route would also need explicit
  limited-tier resolution and billing.
- **`/api/tutor` requires parent control for normal turns.** The route resolves
  the linked learner from the request's device token, requires the full tutor
  capability, loads that learner's enabled parent assignment, decrypts the
  selected provider credential only on the server, and enforces the parent's
  daily-turn and output-token limits. The deterministic crisis reply remains
  available before every identity, policy, budget, and provider gate.
- **The capability hook is still a UX affordance, not a boundary.** It reads
  `verifiedLevel` out of localStorage, which a child can edit. The boundary is
  the server: the device token, and the rung column behind it.

Fixed since this table was written: the PIN no longer grants anything
(`computeRung` ignores `parentPin` entirely — the label on the dashboard that
claimed otherwise was corrected on 2026-08-13); `/api/tutor` and
`/api/assembly` now validate origin and body and rate-limit best-effort; and
step 10's "claim an existing local profile" prompt shipped as the
Add-to-my-account button on `/parent`.
