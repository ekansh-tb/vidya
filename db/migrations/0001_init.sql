-- Vidya — initial schema.
--
-- Until now every learner's progress lived in one localStorage key with no
-- server copy, and "parent access" was a 4-digit PIN stored on the device
-- next to the data it guarded. This schema is the durable, ownership-aware
-- replacement: parents own learners, learners own their state, and nothing
-- is readable without proving which parent or learner you are.
--
-- Design rules baked in here:
--   * STRICT PER-LEARNER ISOLATION. There is no table where one learner's
--     progress is reachable from another learner's row without going through
--     a parent who owns both. Every read path in lib/db/queries.ts is scoped
--     by an ownership check, never by id alone.
--   * The kid's GameState stays a single JSONB blob. It is a fast-moving
--     client-owned shape; normalising it would couple every gameplay tweak to
--     a migration. We version and revision it instead.
--   * Identity comes from Clerk. We store Clerk user ids, never passwords.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- parents

create table if not exists parents (
  id            text primary key,          -- Clerk user id (user_...)
  email         text,
  display_name  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------- learners

create table if not exists learners (
  id                  uuid primary key default gen_random_uuid(),
  -- The owning parent. Null only for a learner who signed up alone and has
  -- not been claimed yet (Door B in docs/AUTH_ARCHITECTURE.md).
  parent_id           text references parents(id) on delete cascade,
  -- Set once the kid has their own sign-in. Null for a device-local learner.
  clerk_user_id       text unique,
  name                text not null,
  grade               int  not null check (grade between 1 and 13),
  board               text not null,
  school              text,
  city                text,
  -- 0 unverified · 1 network · 2 parent-verified · 3 strict.
  -- Authoritative here, unlike the old client-side computeRung().
  verification_level  smallint not null default 0
                      check (verification_level between 0 and 3),
  picked_subjects     jsonb,
  subjects_locked     boolean not null default false,
  -- Client-side profile id (e.g. "learner-primary"), kept so a device can
  -- reconcile its local profiles with server rows after sign-in.
  local_id            text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists learners_parent_id_idx on learners (parent_id);
create index if not exists learners_clerk_user_id_idx on learners (clerk_user_id);
-- A parent's own device ids must not collide, but two different families may
-- both legitimately have a "learner-primary".
create unique index if not exists learners_parent_local_id_idx
  on learners (parent_id, local_id) where local_id is not null;

-- ---------------------------------------------------------- learner_states

create table if not exists learner_states (
  learner_id  uuid primary key references learners(id) on delete cascade,
  -- The GameState blob, shape owned by lib/types.ts.
  state       jsonb  not null,
  -- Monotonic counter for last-write-wins with conflict detection. A client
  -- that pushes a stale revision is told to pull first rather than silently
  -- clobbering another device.
  revision    bigint not null default 1,
  -- Which device wrote last — for "this was updated on the tablet" messaging.
  device_label text,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------- claim_codes

-- Short-lived code a parent shows their kid to link the kid's sign-in to a
-- learner row. Single use, expiring: a leaked code is only briefly useful.
create table if not exists claim_codes (
  code        text primary key,
  learner_id  uuid not null references learners(id) on delete cascade,
  created_by  text references parents(id) on delete cascade,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  used_by     text,
  created_at  timestamptz not null default now()
);

create index if not exists claim_codes_learner_id_idx on claim_codes (learner_id);
create index if not exists claim_codes_expires_at_idx on claim_codes (expires_at);

-- ------------------------------------------------------------- link_audit

-- Append-only record of who linked, promoted or unlinked whom. Anything that
-- changes who can see a child's data is worth being able to reconstruct.
create table if not exists link_audit (
  id          uuid primary key default gen_random_uuid(),
  parent_id   text,
  learner_id  uuid,
  event       text not null,   -- created | linked | unlinked | promoted | demoted | state_reset
  detail      jsonb,
  actor       text,            -- Clerk user id that performed it
  created_at  timestamptz not null default now()
);

create index if not exists link_audit_learner_id_idx on link_audit (learner_id, created_at desc);

-- ------------------------------------------------------------- updated_at

create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists parents_touch on parents;
create trigger parents_touch before update on parents
  for each row execute function touch_updated_at();

drop trigger if exists learners_touch on learners;
create trigger learners_touch before update on learners
  for each row execute function touch_updated_at();

drop trigger if exists learner_states_touch on learner_states;
create trigger learner_states_touch before update on learner_states
  for each row execute function touch_updated_at();
