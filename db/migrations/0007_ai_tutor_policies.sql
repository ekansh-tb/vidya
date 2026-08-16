-- Parent-owned AI tutor profiles and learner assignments.
--
-- A provider connection is only credential storage. It cannot be used by a
-- learner until a parent creates a tutor profile and explicitly enables an
-- assignment for one learner. Daily turns and output tokens can only be lower
-- than or equal to the current global tutor ceilings.

create unique index if not exists ai_provider_connections_id_parent_unique
  on ai_provider_connections (id, parent_id);

create unique index if not exists learners_id_parent_unique
  on learners (id, parent_id);

create table if not exists ai_tutor_profiles (
  id             uuid primary key,
  parent_id      text not null references parents(id) on delete cascade,
  connection_id  uuid not null,
  name           text not null
                 check (name = btrim(name) and char_length(name) between 1 and 80),
  model_id       text not null
                 check (
                   model_id ~ '^[A-Za-z0-9][A-Za-z0-9._:/-]{0,159}$'
                   and model_id !~ '://'
                 ),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (id, parent_id),
  foreign key (connection_id, parent_id)
    references ai_provider_connections(id, parent_id) on delete cascade
);

create unique index if not exists ai_tutor_profiles_parent_name_unique
  on ai_tutor_profiles (parent_id, lower(name));

create index if not exists ai_tutor_profiles_parent_created_idx
  on ai_tutor_profiles (parent_id, created_at desc);

drop trigger if exists ai_tutor_profiles_touch on ai_tutor_profiles;
create trigger ai_tutor_profiles_touch
  before update on ai_tutor_profiles
  for each row execute function touch_updated_at();

create table if not exists learner_ai_assignments (
  learner_id        uuid primary key,
  parent_id         text not null references parents(id) on delete cascade,
  tutor_profile_id  uuid not null,
  enabled           boolean not null default false,
  daily_turn_limit  int not null default 60
                    check (daily_turn_limit between 1 and 60),
  max_output_tokens int not null default 900
                    check (max_output_tokens between 128 and 900),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  foreign key (learner_id, parent_id)
    references learners(id, parent_id) on delete cascade,
  foreign key (tutor_profile_id, parent_id)
    references ai_tutor_profiles(id, parent_id) on delete cascade
);

create index if not exists learner_ai_assignments_parent_idx
  on learner_ai_assignments (parent_id, updated_at desc);

create index if not exists learner_ai_assignments_profile_idx
  on learner_ai_assignments (tutor_profile_id);

drop trigger if exists learner_ai_assignments_touch on learner_ai_assignments;
create trigger learner_ai_assignments_touch
  before update on learner_ai_assignments
  for each row execute function touch_updated_at();

create table if not exists ai_tutor_policy_audit (
  id                uuid primary key default gen_random_uuid(),
  parent_id         text not null references parents(id) on delete cascade,
  tutor_profile_id  uuid,
  learner_id        uuid,
  event             text not null
                    check (event in (
                      'profile_created', 'profile_deleted',
                      'assignment_set', 'assignment_removed'
                    )),
  actor             text not null,
  detail            jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists ai_tutor_policy_audit_parent_idx
  on ai_tutor_policy_audit (parent_id, created_at desc);

create index if not exists ai_tutor_policy_audit_learner_idx
  on ai_tutor_policy_audit (learner_id, created_at desc);
