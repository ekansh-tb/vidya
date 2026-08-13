-- Vidya — make the declared rate limits real.
--
-- `CapabilityPolicy.rateLimit` has carried `{ perDay, burst }` since the
-- capability map shipped, and lib/auth/types.ts says so plainly: "declared here
-- but NOT yet enforced". Nothing read it. /api/tutor used a hardcoded window
-- whose own comment admitted it only "mirrors the ai.tutor.limited capability
-- policy in spirit".
--
-- The in-memory limiter in lib/api/guard.ts cannot close that gap and never
-- could. It is keyed on a spoofable client IP, it is per-instance so concurrent
-- Vercel functions each keep their own counters, and every counter resets on
-- deploy — so a *daily* budget expressed there is fiction. A day is longer than
-- the process.
--
-- This table is the durable half. It is keyed on `learner_id`, which only
-- became possible once a device could prove which learner it is (0002): before
-- device tokens there was no per-child identity on a tutor request to count
-- against. The IP limiter stays where it is and keeps doing the thing it is
-- actually good at — absorbing bursts from one client in one short window.
--
-- WHAT THIS IS AND IS NOT
--   It is a per-child daily ceiling on an expensive external call, and a
--   parent-legible number ("how much AI did my kid use today").
--   It is NOT the spend backstop. A provider-side cap remains the only thing
--   that bounds total cost if something goes wrong upstream of identity —
--   see the vidya-ai-endpoints-unprotected note.

create table if not exists capability_usage (
  learner_id  uuid not null references learners(id) on delete cascade,
  -- CapabilityKey, e.g. 'ai.tutor.full'. Text rather than an enum because the
  -- key union is client-owned and gains entries as capabilities ship.
  capability  text not null,
  -- Server-local date. Deliberately date-grained, not a rolling window: a
  -- child should get their allowance back at a moment they can predict
  -- ("tomorrow"), not at an invisible anniversary of their first question.
  day         date not null,
  count       int  not null default 0,
  primary key (learner_id, capability, day)
);

-- For pruning old rows; nothing reads history yet, but this table grows one
-- row per learner per capability per active day and should not be unbounded.
create index if not exists capability_usage_day_idx on capability_usage (day);
