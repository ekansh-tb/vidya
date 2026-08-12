-- Vidya — device links, and the end of "the child needs a Clerk account".
--
-- WHY THIS MIGRATION EXISTS
-- ------------------------
-- 0001 assumed a redeemed claim code would write the *child's own Clerk id*
-- onto `learners.clerk_user_id`. In practice that ending never existed and
-- could not exist:
--
--   * The kid app has no sign-in affordance anywhere, by design — see the
--     project rule that /api/tutor and /api/assembly stay public because kids
--     have no login. So the child had no session to link.
--   * On the real family setup (one iPad, one browser) the only signed-in
--     account is the PARENT's. A parent who typed the code to "test it" wrote
--     their own Clerk id onto the learner row, after which resolveIdentity
--     classified them as a learner and requireParent() returned null forever.
--     There was no unlink control anywhere.
--   * `learners.clerk_user_id` is UNIQUE, so a second child redeeming from the
--     same browser hit a constraint violation and got a 500.
--
-- The fix inverts the credential. The claim code is already a secret an adult
-- handed over deliberately; redeeming it now mints a *device token* instead of
-- consuming a session. A device proves itself; nobody has to be logged in.
--
-- `learners.clerk_user_id` is deliberately LEFT IN PLACE. It is still the right
-- column for the day an older learner genuinely has their own sign-in, and
-- dropping it would strand rows that already have it set. It is simply no
-- longer written by the redeem path.

-- -------------------------------------------------------- learner_devices

create table if not exists learner_devices (
  id            uuid primary key default gen_random_uuid(),
  learner_id    uuid not null references learners(id) on delete cascade,
  -- SHA-256 of the token, hex. The raw token is returned exactly once, at
  -- redeem time, and is never recoverable from here — a database leak must not
  -- hand over working credentials for a child's account.
  token_hash    text not null unique,
  -- "iPad", "Android tablet" — so a parent revoking a device knows which one.
  label         text,
  -- Which claim code minted this, for the audit trail.
  claim_code    text,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz,
  -- Set by a parent revoking the device. Kept rather than deleted so the audit
  -- trail can still explain why a device stopped syncing.
  revoked_at    timestamptz
);

create index if not exists learner_devices_learner_id_idx
  on learner_devices (learner_id);
-- Every request from a linked device is a lookup by hash, so this is the hot
-- path. The unique constraint above already indexes it; named here for intent.
create index if not exists learner_devices_active_idx
  on learner_devices (learner_id) where revoked_at is null;
