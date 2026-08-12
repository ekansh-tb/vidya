-- Vidya — the parent's capability switches become real.
--
-- `disabledCapabilities` has existed on the client LearnerProfile since the
-- capability map shipped, and `lib/capabilities/server.ts` carried a comment
-- saying so: the override "currently lives only on the client and has no
-- column in `learners`, so the server cannot see it. The client hook still
-- applies it, which means a parent's switch-off hides the surface but does not
-- yet harden the endpoint."
--
-- That is the gap this closes. A parent who turns Miss Vidya off for one child
-- was getting a toggle that removed a button — while `/api/tutor` stayed just
-- as reachable to anything that could POST to it. A control that looks like a
-- boundary and is not one is worse than no control, because the parent stops
-- looking.
--
-- jsonb rather than text[]: the keys are a client-owned union in
-- lib/auth/types.ts that gains entries as capabilities ship, and every other
-- client-shaped list on this table (picked_subjects) is already jsonb. Null
-- means "never configured", which is not the same as an empty array meaning
-- "the parent looked and turned nothing off".

alter table learners
  add column if not exists disabled_capabilities jsonb;
