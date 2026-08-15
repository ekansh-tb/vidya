-- Vidya — give a child in distress somewhere to go, and give their parent a
-- way to find out.
--
-- WHAT WAS MISSING
--   Nothing in this codebase handled a child disclosing self-harm or abuse to
--   Miss Vidya. The entire posture was one line of system prompt asking the
--   model to "redirect gently to learning". A 10-year-old typing the most
--   important sentence they have ever typed got a pivot back to fractions.
--
-- WHAT THIS TABLE IS FOR
--   One row per high-confidence disclosure, so the parent dashboard can show
--   "this happened, on this day, in these words" instead of the parent finding
--   out some other way, later. See lib/safety/crisis.ts for what counts.
--
-- WHY THE CHILD'S WORDS ARE STORED
--   Deliberate, and the most debatable line in this migration. A parent cannot
--   act on a category alone — "self_harm, Tuesday" tells them to panic without
--   telling them anything. The excerpt is capped at 400 characters, it is only
--   ever written for the two ESCALATING categories (never for the `despair`
--   tier, which stays private to the child), and it inherits the learner's
--   delete cascade. If this trade is wrong for you, stop passing `excerpt` in
--   recordSafetySignal — the column is nullable precisely so that is a one-line
--   change and not a migration.
--
-- WHAT THIS IS NOT
--   Not a notification. The parent has to open the dashboard to see it, because
--   there is no email or push infrastructure in this project yet. That is the
--   next thing to fix here, and until it is fixed this table is a record rather
--   than an alarm.

create table if not exists safety_signals (
  id          uuid primary key default gen_random_uuid(),
  learner_id  uuid not null references learners(id) on delete cascade,
  -- CrisisCategory, minus `despair`: 'self_harm' | 'harm_from_others'. Text
  -- rather than an enum so the pattern list can gain tiers without a migration.
  category    text not null,
  -- Which pattern in lib/safety/crisis.ts fired. Kept so the list can be tuned
  -- against what real children actually type rather than against guesses.
  cue         text not null,
  -- What the child wrote, capped and whitespace-flattened. Nullable on purpose.
  excerpt     text,
  -- Where it was said: 'tutor' today; 'reflection' and 'notebook' next.
  surface     text not null,
  created_at  timestamptz not null default now(),
  -- Set when a parent has seen it. Unacknowledged rows are what the dashboard
  -- leads with; acknowledged ones move into history rather than disappearing,
  -- because a pattern over months is the thing worth seeing.
  seen_at     timestamptz
);

-- The dashboard reads "newest first for this learner", and nothing else.
create index if not exists safety_signals_learner_idx
  on safety_signals (learner_id, created_at desc);

-- Partial index for the unread badge, which is the hot read on every page load.
create index if not exists safety_signals_unseen_idx
  on safety_signals (learner_id) where seen_at is null;
