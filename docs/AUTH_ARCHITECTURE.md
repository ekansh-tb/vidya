# Auth & Verification Architecture

Last updated: 2026-08-10 (audited against the codebase)

> **Status note:** As of 2026-05-21 Vidya is **Clerk-only**. Supabase
> was removed before the migration was ever applied. The schema and
> RLS design below are a forward-looking spec for when a durable DB
> becomes necessary (cross-device sync, rung-3 features, multi-family
> analytics). Today, kid GameState lives in localStorage; parent
> identity lives in Clerk publicMetadata.
>
> **Read this before trusting the design below.** Sections marked
> *(spec)* describe a target that is not built. What is actually
> enforced today is only: `middleware.ts` requiring a Clerk session on
> `/parent(.*)`. Everything else — rungs, capability policies, rate
> limits — is client-side and advisory. See "Implementation status"
> at the end.

## Stack (target — partially shipped)

- **Clerk** *(shipped)* — sign-in/sign-up UI, parent-approval UX, JWT
  issuance, role management ("parent" vs "learner").
- **Durable DB layer** *(deferred)* — schema below is the planned shape
  when we re-introduce a server DB. Likely Supabase Postgres again
  with Clerk JWT integration, but the choice is open.
- **Next.js App Router middleware** *(shipped)* — gates `/parent/**` to
  signed-in users, bounces signed-in users away from `/sign-in`. Role
  gating against `/student/**` is wired in the design but the
  `/student/**` route group is not yet created.

Clerk handles WHO. Until a DB exists, small WHAT-state lives in Clerk
publicMetadata (verification rung, family slug); larger state lives in
the kid device's localStorage.

## Path topology

```
/                        → marketing landing + onboarding story   (spec)
/sign-in                 → Clerk SignIn component                 (shipped)
/sign-up                 → role chooser → Clerk SignUp            (shipped, no role chooser)
/student/**              → kid app (home view + all kid surfaces) (spec — kid app is at `/`)
/parent/**               → parent dashboard, BYOK config, care    (shipped)
/auth/callback           → Clerk → DB JWT exchange (no UI)        (dropped with Supabase)
```

Same domain, path isolation. Cookies are scoped by Clerk. Preview deploys
work unchanged.

## Roles

A Clerk user has exactly one role on signup:

- **`parent`** — manages one or more `learner` profiles, configures AI
  invisible to the kid, holds BYOK keys, sees opinion-only analytics.
- **`learner`** — the kid. Logs in via parent-issued code at first, can
  promote to self-managed at age 13+ (TBD).

Role is stored in Clerk publicMetadata so it ships in every JWT.

## The 4-rung verification ladder

The canonical version lives in the `verification-ladder` project memory.
Quick reference (DEFAULTS — actual gates are policy-driven, see "Dynamic
guardrails" below):

| Rung | Name | Default unlocks (additive) | Trigger |
|------|------|----------------------------|---------|
| 0 | unverified | Local learning loop, classroom AI peers, friend streaks, music, library, wellness, review notebook | Default on signup |
| 1 | network_verified | Limited rate-limited AI tutor, share-app-to-friend link | IP+ASN fingerprint matches a parent device's recent fingerprint |
| 2 | parent_verified | Full AI tutor, parent dashboard write access, exam alerts | Parent claims kid OR kid types parent-issued code AND parent confirms in their dashboard |
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

## Same-network detection (rung 1)

On every learner session start, server logs an opaque fingerprint:

```
sha256(ip_class_c + asn + user_agent_family)
```

If the fingerprint matches any row in `parent_network_fingerprints` (a
parent's recent session within 14 days), upgrade the learner's row
`verification_level` to `network_verified`. Soft-fails — losing the match
doesn't downgrade an already-higher rung.

We don't store raw IPs in the DB. The fingerprint is one-way and rotated
per parent session.

## Parent verification flow (rung 2)

Two doors into rung 2 — both end at parent confirming.

**Door A — Parent claims kid:**
1. Parent signs up via `/sign-up`, picks role=parent
2. From `/parent`, parent clicks "Add a learner"
3. Parent enters the kid's name + age + board + school
4. Backend creates a `learners` row with `parent_id = clerk_user_id`
5. Backend issues a 6-digit `claim_code` (24h TTL)
6. Parent shows the code to the kid on their device
7. Kid signs up via `/sign-up`, picks role=learner, enters code
8. Backend links kid Clerk ID to learner row, sets `verification_level = parent_verified`

**Door B — Kid signs up first:**
1. Kid hits `/sign-up`, picks role=learner
2. Kid enters their name + parent's email
3. Backend creates a stub `learners` row with `parent_id = null`, `verification_level = unverified`
4. Backend emails parent: "Your kid started Vidya. Verify to unlock AI features."
5. Parent clicks link → signs up / in via Clerk
6. Parent reviews kid profile → approves → `verification_level = parent_verified`

Door A is the default. Door B is the fallback for kids who signed up alone.

## Strict verification (rung 3)

Out of scope for v1. The mechanism (Stripe Identity vs manual review) is TBD.
The schema reserves the rung so we can ship the features it gates (BYOK,
incognito, medical) immediately when ops capacity exists.

For v1: any feature requiring rung 3 is hidden in the UI until rung is set
manually in the DB by ops.

## Data model *(spec — no database exists)*

There is no migration file; `supabase/migrations/0001_init.sql` was deleted
along with the rest of the Supabase scaffolding on 2026-05-21. The shape
below is the design to build against if a server DB is reintroduced.
`lib/auth/types.ts` mirrors the `capability_policies` row in TypeScript.

```
parents (
  id              text primary key,     -- Clerk user ID
  display_name    text,
  email           text,
  created_at      timestamptz default now()
)

learners (
  id                    uuid primary key default gen_random_uuid(),
  parent_id             text references parents(id) on delete cascade,
  clerk_user_id         text unique,    -- null until kid signs up
  name                  text not null,
  grade                 int not null,
  board                 text not null,
  school                text,
  city                  text,
  verification_level    int default 0,  -- 0..3
  claim_code            text,
  claim_code_expires_at timestamptz,
  created_at            timestamptz default now()
)

learner_states (
  learner_id   uuid primary key references learners(id) on delete cascade,
  state        jsonb not null,         -- the existing GameState shape
  updated_at   timestamptz default now()
)

parent_network_fingerprints (
  parent_id    text references parents(id) on delete cascade,
  fingerprint  text not null,
  last_seen    timestamptz default now(),
  primary key (parent_id, fingerprint)
)

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

RLS policies:
- A parent reads only their own row in `parents` AND only learners where
  `parent_id = auth.jwt() ->> 'sub'`.
- A learner reads only their own row in `learners` (matched by `clerk_user_id`)
  and their own `learner_states`.
- No one reads `parent_child_links_audit` except service-role queries.

## Environment variables

Required today (see `.env.local.example`):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    # pk_test_... or pk_live_...
CLERK_SECRET_KEY                     # sk_test_... or sk_live_...
ANTHROPIC_API_KEY                    # or AI_GATEWAY_API_KEY / VERCEL_OIDC_TOKEN
```

No Supabase variables are used. If a server DB returns, its credentials plus
a Clerk JWT template (so RLS can read the `sub` claim) get added here.

## Implementation status

Audited against the codebase on 2026-08-10.

| # | Step | Status |
|---|------|--------|
| 1 | Install `@clerk/nextjs` | ✅ done |
| 2 | Wire `ClerkProvider` in `app/layout.tsx` | ✅ done |
| 3 | `/sign-in` page with Clerk `<SignIn />` | ✅ done |
| 4 | `/sign-up` page | ✅ done — **no role chooser**; every signup is implicitly a parent |
| 5 | Move kid app to `/student/**`, `/` becomes marketing | ❌ not done — `/` is still the kid app; there is no marketing landing |
| 6 | Role-gate paths in middleware | ⚠️ partial — `/parent(.*)` requires *a* session; role is never checked because no role is ever written to `publicMetadata` |
| 7–9 | Server DB + JWT template + DB client | ❌ dropped with Supabase |
| 10 | localStorage → server sync | ❌ blocked on 7–9 |

Known gaps beyond the table:

- **Rungs 1 and 3 are unreachable.** `computeRung()` in
  `lib/capabilities/use-capability.ts` returns only 0 or 2.
- **Rung 2 is a local PIN, not authentication.** Any 4-digit
  `learner.parentPin` in localStorage promotes the learner to rung 2 and
  unlocks `ai.tutor.full`. No Clerk session is consulted. The model above
  says rung 2 means a specific authenticated adult is responsible for this
  kid; the code does not implement that.
- **`ai.tutor.limited` is dead.** All five call sites check
  `ai.tutor.full`, so the rung-1 rate-limited tier is never resolved.
- **The API routes enforce nothing.** `/api/tutor` and `/api/assembly`
  are public: no `auth()` call, no rate limit, no request-body validation.
  `middleware.ts` matches `/(api|trpc)(.*)`, but `clerkMiddleware` only
  *initialises* auth on a matched route — it does not require a session.
  The capability hook is a UX affordance, not a security boundary.

When a server DB returns, step 10 is the tricky one: in-progress learners
live only in localStorage. Plan is to prompt on first sign-in to claim an
existing local profile or start fresh.
