-- Additive, separate from progress. No invented commitments or available hours.
create table if not exists learner_learning_plans (
  learner_id uuid primary key references learners(id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  plan jsonb not null check (plan->>'version' = '1'),
  updated_at timestamptz not null default now()
);
