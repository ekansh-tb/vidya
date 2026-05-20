# Auth & Verification Architecture

Last updated: 2026-05-21

## Stack

- **Clerk** — sign-in/sign-up UI, parent-approval UX, JWT issuance, role
  management ("parent" vs "learner").
- **Supabase Postgres** — durable app data (`parents`, `learners`,
  `learner_states`, `parent_child_links`, capability flags). RLS policies
  read the Clerk user ID from the JWT (`auth.jwt() -> 'sub'`) and enforce
  strict per-learner isolation.
- **Next.js App Router middleware** — gates `/parent/**` to parent role,
  `/student/**` (formerly `/`) to learner role, redirects anonymous users
  to `/sign-in`.

Clerk handles WHO; Supabase handles WHAT.

## Path topology

```
/                        → marketing landing + onboarding story
/sign-in                 → Clerk SignIn component
/sign-up                 → role chooser → Clerk SignUp
/student/**              → kid app (current home view + all kid surfaces)
/parent/**               → parent dashboard, BYOK config, care layer
/auth/callback           → Clerk → Supabase JWT exchange (no UI)
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

See [`memory/verification-ladder.md`](../../.claude/projects/-Users-ekanshjain-Downloads-vidya-quest/memory/verification-ladder.md)
for the canonical version. Quick reference (DEFAULTS — actual gates are
policy-driven, see "Dynamic guardrails" below):

| Rung | Name | Default unlocks (additive) | Trigger |
|------|------|----------------------------|---------|
| 0 | unverified | Local learning loop, classroom AI peers, friend streaks, music, library, wellness, review notebook | Default on signup |
| 1 | network_verified | Limited rate-limited AI tutor, share-app-to-friend link | IP+ASN fingerprint matches a parent device's recent fingerprint |
| 2 | parent_verified | Full AI tutor, parent dashboard write access, exam alerts | Parent claims kid OR kid types parent-issued code AND parent confirms in their dashboard |
| 3 | strict_verified | BYOK AI providers, incognito mode for that kid, medical advisories, health profile | Manual team review (govt ID + selfie OR Stripe Identity) — operations TBD |

**Critical UI rule:** the kid never sees rung gates explicitly. Locked
features are absent, not greyed out. See
[`memory/parent-invisible-config.md`](../../.claude/projects/-Users-ekanshjain-Downloads-vidya-quest/memory/parent-invisible-config.md).

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

See [`memory/dynamic-guardrails.md`](../../.claude/projects/-Users-ekanshjain-Downloads-vidya-quest/memory/dynamic-guardrails.md).

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

## Data model

See `supabase/migrations/0001_init.sql` for canonical SQL. Summary:

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

Required:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    # pk_test_... or pk_live_...
CLERK_SECRET_KEY                     # sk_test_... or sk_live_...
NEXT_PUBLIC_SUPABASE_URL             # already set
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY # already set (replaces ANON_KEY)
SUPABASE_SECRET_KEY                  # service-role for server-side writes
```

After Clerk install, configure a JWT template in the Clerk dashboard named
"supabase" that signs with the Supabase JWT secret. Supabase RLS reads the
template's `sub` claim.

## Migration plan

1. **Install Clerk packages** (`@clerk/nextjs`)
2. **Wire ClerkProvider** in `app/layout.tsx`
3. **Replace `/sign-in` page** with Clerk `<SignIn />` component
4. **Add `/sign-up` page** with role chooser → Clerk `<SignUp />`
5. **Move kid app from `/` to `/student/**`** — keep `/` as marketing+onboarding story
6. **Update middleware** — role-gate paths
7. **Run Supabase migration** with the schema above
8. **Configure Clerk JWT template** "supabase" in the Clerk dashboard
9. **Replace Supabase Auth client** with Clerk-backed Supabase client (passes Clerk JWT to Supabase)
10. **Add localStorage → Supabase sync** for existing kid profiles to migrate cleanly

Steps 1–9 are bounded engineering. Step 10 is the trickiest because we need
to preserve in-progress learners on the existing localStorage path. Plan: on
first sign-in, prompt to claim an existing local profile or start fresh.
