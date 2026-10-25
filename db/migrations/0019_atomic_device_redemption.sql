-- Redemption shares the membership lock too. Removal either follows a completed
-- redemption and revokes its device, or precedes it and invalidates the issuer.
create function vidya_redeem_guardian_device(p_code text,p_hash text,p_label text)
returns table(result text,learner jsonb) language plpgsql as $$
declare invitation claim_codes%rowtype; saved learners%rowtype;
begin
 perform pg_advisory_xact_lock(9009,1);
 select * into invitation from claim_codes c where c.code=p_code for update;
 if not found then return query select 'invalid'::text,null::jsonb; return; end if;
 if invitation.used_at is not null then return query select 'used'::text,null::jsonb; return; end if;
 if invitation.expires_at<=clock_timestamp() then return query select 'expired'::text,null::jsonb; return; end if;
 if not vidya_can_manage_learner(invitation.created_by,invitation.learner_id) then return query select 'invalid'::text,null::jsonb; return; end if;
 update learners set verification_level=greatest(verification_level,2) where id=invitation.learner_id returning * into saved;
 if not found then return query select 'invalid'::text,null::jsonb; return; end if;
 insert into learner_devices(learner_id,token_hash,label,claim_code) values(saved.id,p_hash,p_label,invitation.code);
 update claim_codes set used_at=clock_timestamp(),used_by='device' where code=invitation.code;
 insert into link_audit(parent_id,learner_id,event,actor,detail) values(null,saved.id,'linked',null,jsonb_build_object('via','claim_code','device',p_label));
 return query select 'ok'::text,to_jsonb(saved);
end $$;

-- Recheck membership after row-lock waits and ownership transfers.
create or replace function vidya_approve_account_link(guardian text, learner uuid, digest text, expected_subject text)
returns boolean language plpgsql as $$
declare candidate text;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if not exists (select 1 from parents where id = guardian)
    or exists (select 1 from learner_account_subjects where clerk_user_id = guardian)
    or exists (select 1 from learners where clerk_user_id = guardian and parent_id is distinct from guardian)
  then return false; end if;
  -- Lock the ownership row, including against concurrent deletion/transfer.
  perform 1 from learners where id = learner and clerk_user_id is null for update;
  if not found or not vidya_can_manage_learner(guardian,learner) then return false; end if;
  select clerk_user_id into candidate from learner_account_link_requests
    where token_hash = digest and used_at is null and expires_at > clock_timestamp()
    and clerk_user_id = expected_subject for update;
  if candidate is null or candidate = guardian
    or exists (select 1 from parents where id = candidate)
    or exists (select 1 from learners where clerk_user_id = candidate)
  then return false; end if;
  update learners set clerk_user_id = candidate where id = learner and vidya_can_manage_learner(guardian,id);
  update learner_account_link_requests set used_at = clock_timestamp() where clerk_user_id = candidate;
  update learner_account_subjects set revoked_at = null where clerk_user_id = candidate;
  insert into link_audit (parent_id, learner_id, event, actor, detail)
    values (guardian, learner, 'account_linked', guardian, jsonb_build_object('clerkUserId', candidate));
  return true;
end;
$$;

create or replace function vidya_revoke_account_link(guardian text, learner uuid)
returns boolean language plpgsql as $$
declare candidate text;
begin
  perform pg_advisory_xact_lock(9009, 1);
  if not exists (select 1 from parents where id = guardian)
    or exists (select 1 from learner_account_subjects where clerk_user_id = guardian)
    or exists (select 1 from learners where clerk_user_id = guardian and parent_id is distinct from guardian)
  then return false; end if;
  select clerk_user_id into candidate from learners
    where id = learner for update;
  if not found or not vidya_can_manage_learner(guardian,learner) then return false; end if;
  if candidate is null then return true; end if;
  -- Never reinterpret a legacy self-linked parent's identity as a child.
  if candidate = guardian then return false; end if;
  insert into learner_account_subjects (clerk_user_id, revoked_at)
    values (candidate, clock_timestamp()) on conflict (clerk_user_id)
    do update set revoked_at = excluded.revoked_at;
  update learners set clerk_user_id = null where id = learner and vidya_can_manage_learner(guardian,id);
  update learner_account_link_requests set used_at = clock_timestamp() where clerk_user_id = candidate;
  insert into link_audit (parent_id, learner_id, event, actor, detail)
    values (guardian, learner, 'account_unlinked', guardian, jsonb_build_object('clerkUserId', candidate));
  return true;
end;
$$;

