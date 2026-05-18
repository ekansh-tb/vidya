-- Vidya Quest — initial schema
-- Establishes the parent ↔ learners ↔ state relationship and the RLS
-- policies that enforce the strict per-learner isolation rule.
--
-- Conventions:
--   * One row per parent in `parents`, keyed by auth.users.id.
--   * One row per kid in `learners`, FK → parents.id.
--   * One row per kid in `learner_states` holding the JSONB GameState blob.
--   * Future sensitive tables (health, ai_keys, exam_schedules) ship in
--     dedicated migrations once their UI is built; they will follow the
--     same RLS pattern enforced here.

-- ─── 1. Parents ───────────────────────────────────────────────────
create table public.parents (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now(),
  -- A hash of the 4-6 digit Parent PIN. NEVER store the PIN itself.
  pin_hash    text
);

comment on table public.parents is
  'One row per parent account. Mirrors auth.users 1:1.';

-- Auto-create a parents row when a user signs up via auth.users.
create or replace function public.handle_new_parent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.parents (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_parent();

-- ─── 2. Learners (kids) ───────────────────────────────────────────
create table public.learners (
  id              text primary key,         -- slug, e.g. 'advika', 'bvb-cl-7'
  parent_id       uuid not null references public.parents(id) on delete cascade,
  name            text not null,
  grade           int  not null check (grade between 1 and 12),
  board           text not null check (board in ('cambridge-primary','cambridge-igcse','icse','cbse')),
  school          text,
  city            text,
  theme_id        text check (theme_id in ('playful','vivid','terminal')),
  picked_subjects text[],                   -- nullable list of SubjectId strings
  subjects_locked boolean not null default false,
  created_at      timestamptz not null default now()
);

create index learners_parent_id_idx on public.learners (parent_id);

comment on table public.learners is
  'One row per kid. parent_id must match auth.uid() for any access.';

-- ─── 3. Learner state (the GameState JSON blob) ────────────────────
create table public.learner_states (
  learner_id  text primary key references public.learners(id) on delete cascade,
  state       jsonb not null,
  updated_at  timestamptz not null default now()
);

comment on table public.learner_states is
  'GameState blob — XP, badges, progress, classRoster, etc. One per learner.';

-- ─── 4. Row-Level Security ─────────────────────────────────────────
alter table public.parents enable row level security;
alter table public.learners enable row level security;
alter table public.learner_states enable row level security;

-- Parents can read/update their own row only.
create policy parents_self_read on public.parents
  for select using (id = auth.uid());
create policy parents_self_update on public.parents
  for update using (id = auth.uid());

-- Learners — full CRUD scoped to parent_id = auth.uid().
create policy learners_owner_read on public.learners
  for select using (parent_id = auth.uid());
create policy learners_owner_insert on public.learners
  for insert with check (parent_id = auth.uid());
create policy learners_owner_update on public.learners
  for update using (parent_id = auth.uid());
create policy learners_owner_delete on public.learners
  for delete using (parent_id = auth.uid());

-- Learner states — gated through the learner's parent_id.
create policy learner_states_owner_read on public.learner_states
  for select using (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and l.parent_id = auth.uid()
    )
  );
create policy learner_states_owner_insert on public.learner_states
  for insert with check (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and l.parent_id = auth.uid()
    )
  );
create policy learner_states_owner_update on public.learner_states
  for update using (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and l.parent_id = auth.uid()
    )
  );
create policy learner_states_owner_delete on public.learner_states
  for delete using (
    exists (
      select 1 from public.learners l
      where l.id = learner_states.learner_id
        and l.parent_id = auth.uid()
    )
  );

-- ─── 5. updated_at autotouch ───────────────────────────────────────
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
