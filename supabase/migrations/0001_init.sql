-- Vidya Quest — initial Clerk-native schema
-- ==========================================
-- Auth flows through Clerk; this DB only stores app data and reads the
-- Clerk user ID from a JWT template named "supabase" (configure in the
-- Clerk dashboard before running this migration).
--
-- All RLS policies read auth.jwt() ->> 'sub' (the Clerk user ID).
-- The historical Supabase Auth trigger (handle_new_parent on auth.users)
-- is removed; parent / learner rows are upserted by a Clerk webhook
-- handler on the Next.js side instead.
--
-- See docs/AUTH_ARCHITECTURE.md for the full design (verification ladder,
-- dynamic guardrails, parent-invisible config).

-- ─── 1. Parents ──────────────────────────────────────────────────────────
create table public.parents (
  id            text primary key,             -- Clerk user ID
  display_name  text,
  email         text,
  pin_hash      text,                         -- optional local PIN hash, NOT the PIN
  created_at    timestamptz not null default now()
);
comment on table public.parents is
  'One row per Clerk user with role=parent. id is the Clerk user_id ("sub" claim).';

-- ─── 2. Learners (kids) ──────────────────────────────────────────────────
create table public.learners (
  id                      text primary key,   -- slug, e.g. 'advika', 'nevaan', 'bvb-cl-7'
  parent_id               text not null references public.parents(id) on delete cascade,
  clerk_user_id           text unique,        -- null until the kid signs in via Clerk
  name                    text not null,
  grade                   int  not null check (grade between 1 and 12),
  board                   text not null check (board in ('cambridge-primary','cambridge-igcse','icse','cbse')),
  school                  text,
  city                    text,
  theme_id                text check (theme_id in ('playful','vivid','terminal')),
  picked_subjects         text[],
  subjects_locked         boolean not null default false,
  verification_level      int not null default 0 check (verification_level between 0 and 3),
  claim_code              text,
  claim_code_expires_at   timestamptz,
  created_at              timestamptz not null default now()
);
create index learners_parent_id_idx on public.learners (parent_id);
create index learners_clerk_user_id_idx on public.learners (clerk_user_id);
comment on table public.learners is
  'One row per kid. parent_id is the Clerk user_id of the owning parent. clerk_user_id is set when the kid signs in.';

-- ─── 3. Learner state (the GameState JSON blob) ──────────────────────────
create table public.learner_states (
  learner_id  text primary key references public.learners(id) on delete cascade,
  state       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ─── 4. Parent network fingerprints (rung-1 auto-verification) ───────────
create table public.parent_network_fingerprints (
  parent_id    text not null references public.parents(id) on delete cascade,
  fingerprint  text not null,                -- one-way hash, see docs/AUTH_ARCHITECTURE.md
  last_seen    timestamptz not null default now(),
  primary key (parent_id, fingerprint)
);
create index pnf_fingerprint_idx on public.parent_network_fingerprints (fingerprint);
comment on table public.parent_network_fingerprints is
  'Opaque one-way fingerprints of recent parent sessions. Used to auto-upgrade a learner to rung 1 when their session fingerprint matches.';

-- ─── 5. Parent-child link audit ──────────────────────────────────────────
create table public.parent_child_links_audit (
  id           uuid primary key default gen_random_uuid(),
  parent_id    text references public.parents(id) on delete set null,
  learner_id   text references public.learners(id) on delete set null,
  event        text not null check (event in ('created','linked','promoted','demoted','strict_approved','revoked')),
  by_user      text,                          -- Clerk user_id of the actor (parent / ops)
  metadata     jsonb,                         -- free-form context per event
  created_at   timestamptz not null default now()
);
comment on table public.parent_child_links_audit is
  'Append-only audit log for every change to a parent-kid link or verification level. Service-role read only.';

-- ─── 6. Capability policies (dynamic guardrails) ─────────────────────────
create table public.capability_policies (
  key           text primary key,             -- e.g. 'ai.tutor.full', 'byok.openai'
  min_rung      int not null default 3 check (min_rung between 0 and 3),
  ai_safety_pin text,                         -- e.g. 'claude-sonnet-4.6+'; null means any
  cohort        text not null default 'global',
  rate_limit    jsonb,                        -- e.g. {"perDay": 20, "burst": 5}
  notes         text,
  updated_at    timestamptz not null default now(),
  updated_by    text
);
comment on table public.capability_policies is
  'Source of truth for capability -> rung mapping. Resolver reads this per session. Updates are versioned in capability_policy_audit.';

create table public.capability_policy_audit (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,
  previous    jsonb,
  next        jsonb,
  changed_by  text,
  changed_at  timestamptz not null default now()
);

-- ─── 7. RLS ──────────────────────────────────────────────────────────────
alter table public.parents enable row level security;
alter table public.learners enable row level security;
alter table public.learner_states enable row level security;
alter table public.parent_network_fingerprints enable row level security;
alter table public.parent_child_links_audit enable row level security;
alter table public.capability_policies enable row level security;
alter table public.capability_policy_audit enable row level security;

-- Helper: extract Clerk sub claim from JWT.
create or replace function public.clerk_sub() returns text
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    auth.jwt() ->> 'sub'
  );
$$;

-- Parents — self read/update.
create policy parents_self_read   on public.parents for select using (id = public.clerk_sub());
create policy parents_self_update on public.parents for update using (id = public.clerk_sub());

-- Learners — parent owns via parent_id; the learner themselves reads via clerk_user_id.
create policy learners_parent_all on public.learners
  for all using (parent_id = public.clerk_sub())
  with check (parent_id = public.clerk_sub());
create policy learners_self_read  on public.learners
  for select using (clerk_user_id = public.clerk_sub());

-- Learner state — gated through the learner's parent_id OR the learner's own clerk_user_id.
create policy learner_states_owner on public.learner_states
  for all using (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and (l.parent_id = public.clerk_sub() or l.clerk_user_id = public.clerk_sub())
    )
  ) with check (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and (l.parent_id = public.clerk_sub() or l.clerk_user_id = public.clerk_sub())
    )
  );

-- Network fingerprints — only the owning parent reads/writes their own; service-role does cross-parent matching server-side.
create policy pnf_owner on public.parent_network_fingerprints
  for all using (parent_id = public.clerk_sub())
  with check (parent_id = public.clerk_sub());

-- Audit + policy tables: no end-user reads. Service-role-only.
-- (No row-level grant policies means all reads denied for anon/authenticated.)

-- ─── 8. updated_at autotouch ─────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger learner_states_touch
  before update on public.learner_states
  for each row execute function public.touch_updated_at();

create trigger capability_policies_touch
  before update on public.capability_policies
  for each row execute function public.touch_updated_at();

-- ─── 9. Capability policy seed (v1 defaults — change in the dashboard, not here) ──
insert into public.capability_policies (key, min_rung, ai_safety_pin, cohort, notes) values
  ('ai.tutor.limited',      1, null, 'global', 'Rate-limited tutor for rung 1 (same-network).'),
  ('ai.tutor.full',         2, null, 'global', 'Full tutor with parent-configured tone, gated at rung 2.'),
  ('share.crossNetwork',    1, null, 'global', 'Share streaks / app link across IPs once network-verified.'),
  ('byok.openai',           3, null, 'global', 'Bring your own OpenAI key. Strict-verified only.'),
  ('byok.anthropic',        3, null, 'global', 'Anthropic BYOK. Strict only.'),
  ('byok.google',           3, null, 'global', 'Gemini BYOK. Strict only.'),
  ('byok.grok',             3, null, 'global', 'Grok BYOK. Strict only.'),
  ('byok.openrouter',       3, null, 'global', 'OpenRouter BYOK. Strict only.'),
  ('incognito.enabled',     3, null, 'global', 'Incognito sessions invisible to the kid; only parent sees the log.'),
  ('health.profile',        3, null, 'global', 'Medical advisories + therapy track upload. Strict only.'),
  ('exam.alertsToParent',   2, null, 'global', 'Exam-day push notifications to the parent dashboard.')
on conflict (key) do nothing;
