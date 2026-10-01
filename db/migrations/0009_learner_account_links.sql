-- Separate signed-in account pairing from device claim codes.
-- Apply only after coordinated isolated Postgres validation and rollout review.
-- The migration runner owns the SQL and tracking transaction.

-- Classification survives revocation and learner deletion. No cascading FK.
create table learner_account_subjects (
  clerk_user_id text primary key,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Do not classify historical self-link corruption as a child account.
insert into learner_account_subjects (clerk_user_id)
select clerk_user_id from learners
where clerk_user_id is not null and clerk_user_id is distinct from parent_id;

create table learner_account_link_requests (
  clerk_user_id text primary key references learner_account_subjects(clerk_user_id),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- All account mutation functions serialize on one transaction advisory lock.
-- Low-volume account changes favor simple serialization over lock ordering.
-- Functions are SECURITY INVOKER. The application DB role is the trust boundary.
create function vidya_request_account_link(subject text, digest text)
returns timestamptz language plpgsql as $$
declare expiry timestamptz;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if subject is null or length(subject) = 0
    or exists (select 1 from parents where id = subject)
    or exists (select 1 from learners where clerk_user_id = subject)
  then return null; end if;
  insert into learner_account_subjects (clerk_user_id) values (subject)
    on conflict do nothing;
  expiry := clock_timestamp() + interval '10 minutes';
  insert into learner_account_link_requests (clerk_user_id, token_hash, expires_at)
    values (subject, digest, expiry)
    on conflict (clerk_user_id) do update set token_hash = excluded.token_hash,
      expires_at = excluded.expires_at, used_at = null, created_at = clock_timestamp();
  return expiry;
end;
$$;

create function vidya_approve_account_link(guardian text, learner uuid, digest text, expected_subject text)
returns boolean language plpgsql as $$
declare candidate text;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if not exists (select 1 from parents where id = guardian)
    or exists (select 1 from learner_account_subjects where clerk_user_id = guardian)
    or exists (select 1 from learners where clerk_user_id = guardian and parent_id is distinct from guardian)
  then return false; end if;
  -- Lock the ownership row, including against concurrent deletion/transfer.
  perform 1 from learners where id = learner and parent_id = guardian
    and clerk_user_id is null for update;
  if not found then return false; end if;
  select clerk_user_id into candidate from learner_account_link_requests
    where token_hash = digest and used_at is null and expires_at > clock_timestamp()
    and clerk_user_id = expected_subject for update;
  if candidate is null or candidate = guardian
    or exists (select 1 from parents where id = candidate)
    or exists (select 1 from learners where clerk_user_id = candidate)
  then return false; end if;
  update learners set clerk_user_id = candidate where id = learner and parent_id = guardian;
  update learner_account_link_requests set used_at = clock_timestamp() where clerk_user_id = candidate;
  update learner_account_subjects set revoked_at = null where clerk_user_id = candidate;
  insert into link_audit (parent_id, learner_id, event, actor, detail)
    values (guardian, learner, 'account_linked', guardian, jsonb_build_object('clerkUserId', candidate));
  return true;
end;
$$;

create function vidya_revoke_account_link(guardian text, learner uuid)
returns boolean language plpgsql as $$
declare candidate text;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if not exists (select 1 from parents where id = guardian)
    or exists (select 1 from learner_account_subjects where clerk_user_id = guardian)
    or exists (select 1 from learners where clerk_user_id = guardian and parent_id is distinct from guardian)
  then return false; end if;
  select clerk_user_id into candidate from learners
    where id = learner and parent_id = guardian for update;
  if not found then return false; end if;
  if candidate is null then return true; end if;
  -- Never reinterpret a legacy self-linked parent's identity as a child.
  if candidate = guardian then return false; end if;
  insert into learner_account_subjects (clerk_user_id, revoked_at)
    values (candidate, clock_timestamp()) on conflict (clerk_user_id)
    do update set revoked_at = excluded.revoked_at;
  update learners set clerk_user_id = null where id = learner and parent_id = guardian;
  update learner_account_link_requests set used_at = clock_timestamp() where clerk_user_id = candidate;
  insert into link_audit (parent_id, learner_id, event, actor, detail)
    values (guardian, learner, 'account_unlinked', guardian, jsonb_build_object('clerkUserId', candidate));
  return true;
end;
$$;

revoke all on function vidya_request_account_link(text, text) from public;
revoke all on function vidya_approve_account_link(text, uuid, text, text) from public;
revoke all on function vidya_revoke_account_link(text, uuid) from public;

-- The parents row is the parent authority/classification. Acknowledgements
-- describe self-attestation only, never external age or guardianship proof.
create table parent_enrollment_acknowledgements (
  parent_id text not null references parents(id) on delete cascade,
  version text not null,
  acknowledgement_text text not null,
  verified_email text not null,
  clerk_email_id text not null,
  clerk_session_id text not null,
  reverification_preset text not null default 'strict' check (reverification_preset = 'strict'),
  acknowledged_at timestamptz not null default clock_timestamp(),
  primary key (parent_id, version)
);

create function vidya_enroll_parent(subject text, email text, display_name text,
  email_id text, session_id text, ack_version text, ack_text text)
returns boolean language plpgsql as $$
declare inserted_ack integer;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if nullif(subject, '') is null or nullif(email, '') is null
    or nullif(email_id, '') is null or nullif(session_id, '') is null
    or nullif(ack_version, '') is null or nullif(ack_text, '') is null
    or exists (select 1 from learner_account_subjects where clerk_user_id = subject)
    or exists (select 1 from learners where clerk_user_id = subject and parent_id is distinct from subject)
  then return false; end if;

  -- Idempotency preserves legacy parents and their existing family ownership.
  -- No learner, device, claim code or state row is created or reassigned.
  insert into parents(id, email, display_name) values (subject, email, display_name)
    on conflict (id) do nothing;
  insert into parent_enrollment_acknowledgements
    (parent_id, version, acknowledgement_text, verified_email, clerk_email_id, clerk_session_id)
    values (subject, ack_version, ack_text, email, email_id, session_id)
    on conflict (parent_id, version) do nothing;
  get diagnostics inserted_ack = row_count;
  if inserted_ack > 0 then
    insert into link_audit(parent_id, event, actor, detail)
      values (subject, 'parent_self_attested', subject,
        jsonb_build_object('acknowledgementVersion', ack_version));
  end if;
  return true;
end;
$$;
revoke all on function vidya_enroll_parent(text, text, text, text, text, text, text) from public;
