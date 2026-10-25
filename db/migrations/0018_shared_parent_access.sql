-- Explicit learner-scoped co-parent access. Authentication and parent enrollment
-- remain independent. Possession of a child's name never establishes access.
create table learner_guardians (
 learner_id uuid not null references learners(id) on delete cascade,
 parent_id text not null references parents(id) on delete cascade,
 invited_by text not null references parents(id) on delete cascade,
 created_at timestamptz not null default now(),
 revoked_at timestamptz,
 primary key(learner_id,parent_id)
);
create index learner_guardians_parent on learner_guardians(parent_id) where revoked_at is null;
create table guardian_invitations (
 id uuid primary key default gen_random_uuid(),
 learner_id uuid not null references learners(id) on delete cascade,
 created_by text not null references parents(id) on delete cascade,
 recipient_email text not null check(recipient_email=lower(btrim(recipient_email)) and char_length(recipient_email) between 3 and 254),
 token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
 expires_at timestamptz not null default now()+interval '48 hours',
 accepted_by text references parents(id) on delete set null,
 accepted_at timestamptz,
 revoked_at timestamptz,
 created_at timestamptz not null default now()
);
create index guardian_invitations_learner on guardian_invitations(learner_id,created_at desc);

create function vidya_can_manage_learner(p_parent text,p_learner uuid) returns boolean
language sql stable as $$
 select exists(select 1 from learners l where l.id=p_learner and
  (l.parent_id=p_parent or exists(select 1 from learner_guardians g
    where g.learner_id=l.id and g.parent_id=p_parent and g.invited_by=l.parent_id and g.revoked_at is null)))
$$;

create function vidya_invite_guardian(p_parent text,p_learner uuid,p_email text,p_hash text) returns uuid
language plpgsql as $$
declare result uuid;
begin
 perform pg_advisory_xact_lock(9009,1);
 -- Only the original parent manages adult membership. Both parents manage the child.
 perform 1 from learners where id=p_learner and parent_id=p_parent for update;
 if not found or exists(select 1 from learner_guardians where learner_id=p_learner and invited_by=p_parent and revoked_at is null)
  or exists(select 1 from parents where id=p_parent and lower(email)=p_email) then return null; end if;
 update guardian_invitations set revoked_at=clock_timestamp() where learner_id=p_learner and accepted_at is null and revoked_at is null;
 insert into guardian_invitations(learner_id,created_by,recipient_email,token_hash)
 values(p_learner,p_parent,p_email,p_hash) returning id into result;
 insert into link_audit(parent_id,learner_id,event,actor) values(p_parent,p_learner,'guardian_invited',p_parent);
 return result;
end $$;

create function vidya_accept_guardian(p_parent text,p_verified_email text,p_hash text) returns uuid
language plpgsql as $$
declare invitation guardian_invitations%rowtype; owner_id text;
begin
 perform pg_advisory_xact_lock(9009,1);
 if not exists(select 1 from parents where id=p_parent)
  or exists(select 1 from learner_account_subjects where clerk_user_id=p_parent)
  or exists(select 1 from learners where clerk_user_id=p_parent) then return null; end if;
 select * into invitation from guardian_invitations where token_hash=p_hash
  and recipient_email=lower(btrim(p_verified_email)) and expires_at>clock_timestamp()
  and revoked_at is null and accepted_at is null for update;
 if not found then return null; end if;
 select parent_id into owner_id from learners where id=invitation.learner_id for update;
 if owner_id is distinct from invitation.created_by or owner_id=p_parent
  or exists(select 1 from learner_guardians where learner_id=invitation.learner_id and invited_by=owner_id and revoked_at is null)
  then return null; end if;
 insert into learner_guardians(learner_id,parent_id,invited_by)
 values(invitation.learner_id,p_parent,owner_id)
 on conflict(learner_id,parent_id) do update set revoked_at=null,invited_by=excluded.invited_by,created_at=clock_timestamp();
 update guardian_invitations set accepted_by=p_parent,accepted_at=clock_timestamp() where id=invitation.id;
 insert into link_audit(parent_id,learner_id,event,actor) values(owner_id,invitation.learner_id,'guardian_joined',p_parent);
 return invitation.learner_id;
end $$;

create function vidya_remove_guardian(p_actor text,p_learner uuid,p_guardian text) returns boolean
language plpgsql as $$
declare owner_id text;
begin
 perform pg_advisory_xact_lock(9009,1);
 select parent_id into owner_id from learners where id=p_learner for update;
 if owner_id is null or p_guardian=owner_id or (p_actor<>owner_id and p_actor<>p_guardian) then return false; end if;
 update learner_guardians set revoked_at=clock_timestamp() where learner_id=p_learner and parent_id=p_guardian and invited_by=owner_id and revoked_at is null;
 if not found then return false; end if;
 update guardian_invitations set revoked_at=clock_timestamp() where learner_id=p_learner and revoked_at is null;
 update learner_devices d set revoked_at=clock_timestamp() where d.learner_id=p_learner and d.revoked_at is null and exists(select 1 from claim_codes c where c.code=d.claim_code and c.created_by=p_guardian);
 delete from claim_codes where learner_id=p_learner and created_by=p_guardian and used_at is null;
 insert into link_audit(parent_id,learner_id,event,actor) values(owner_id,p_learner,'guardian_removed',p_actor);
 return true;
end $$;

create function vidya_cancel_guardian_invite(p_actor text,p_invite uuid) returns boolean
language plpgsql as $$
begin
 perform pg_advisory_xact_lock(9009,1);
 update guardian_invitations i set revoked_at=clock_timestamp()
 where i.id=p_invite and i.created_by=p_actor and i.accepted_at is null and i.revoked_at is null
 and exists(select 1 from learners l where l.id=i.learner_id and l.parent_id=p_actor);
 return found;
end $$;

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
  perform 1 from learners where id = learner and vidya_can_manage_learner(guardian,id)
    and clerk_user_id is null for update;
  if not found then return false; end if;
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
    where id = learner and vidya_can_manage_learner(guardian,id) for update;
  if not found then return false; end if;
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

-- Serialize learner capacity checks. Do not rely on an unlocked COUNT.
create or replace function vidya_create_circle(p_parent text,p_learner uuid,p_alias text,p_hash text) returns uuid as $$
declare answer uuid;
begin
 perform id from learners where id=p_learner and vidya_can_manage_learner(p_parent,id) for update;
 if not found then return null; end if;
 if (select count(*) from private_circles where (source_learner=p_learner or target_learner=p_learner)
   and (status='active' or (status='pending' and expires_at>now())))>=5 then return null; end if;
 insert into private_circles(source_learner,source_alias,invite_hash) values(p_learner,p_alias,p_hash) returning id into answer;
 return answer;
end;
$$ language plpgsql;

create or replace function vidya_accept_circle(p_hash text,p_parent text,p_learner uuid,p_alias text) returns uuid as $$
declare c private_circles%rowtype; source_parent text; answer uuid;
begin
 -- First discover the pair, then lock learner rows in one deterministic order.
 -- Invite rows are locked only afterwards, avoiding reversed pair deadlocks.
 select * into c from private_circles where invite_hash=p_hash and status='pending' and expires_at>now();
 if not found then return null; end if;
 perform id from learners where id in(c.source_learner,p_learner) order by id for update;
 select * into c from private_circles where invite_hash=p_hash and status='pending' and expires_at>now() for update;
 if not found then return null; end if;
 select parent_id into source_parent from learners where id=c.source_learner;
 if source_parent is null or vidya_can_manage_learner(p_parent,c.source_learner) or not exists(select 1 from learners where id=p_learner and vidya_can_manage_learner(p_parent,id)) then return null; end if;
 if (select count(*) from private_circles where (source_learner=p_learner or target_learner=p_learner)
   and (status='active' or (status='pending' and expires_at>now())))>=5 then return null; end if;
 -- Accepting replaces this source's pending slot instead of adding a slot.
 if (select count(*) from private_circles where (source_learner=c.source_learner or target_learner=c.source_learner)
   and (status='active' or (status='pending' and expires_at>now())))>5 then return null; end if;
 update private_circles set target_learner=p_learner,target_alias=p_alias,target_approved_at=now(),status='active' where id=c.id returning id into answer;
 return answer;
exception when unique_violation then return null;
end;
$$ language plpgsql;


-- Serialize code issuance with adult revocation so a pending co-parent request
-- cannot mint a new child credential after its membership has been withdrawn.
create function vidya_issue_guardian_device_code(p_parent text,p_learner uuid,p_code text,p_ttl int)
returns table(code text,expires_at timestamptz) language plpgsql as $$
begin
 perform pg_advisory_xact_lock(9009,1);
 if not vidya_can_manage_learner(p_parent,p_learner) or p_ttl<1 or p_ttl>120 then return; end if;
 delete from claim_codes c where c.learner_id=p_learner and c.used_at is null;
 return query insert into claim_codes(code,learner_id,created_by,expires_at)
  values(p_code,p_learner,p_parent,clock_timestamp()+make_interval(mins=>p_ttl))
  on conflict do nothing returning claim_codes.code,claim_codes.expires_at;
end $$;

create function vidya_revoke_guardian_device(p_parent text,p_learner uuid,p_device text) returns int
language plpgsql as $$
declare result int;
begin
 perform pg_advisory_xact_lock(9009,1);
 if not vidya_can_manage_learner(p_parent,p_learner) then return -1; end if;
 update learner_devices set revoked_at=clock_timestamp() where learner_id=p_learner and revoked_at is null and (p_device='all' or id::text=p_device);
 get diagnostics result=row_count;
 if not exists(select 1 from learner_devices where learner_id=p_learner and revoked_at is null) then
  update learners set verification_level=0 where id=p_learner;
 end if;
 insert into link_audit(parent_id,learner_id,event,actor,detail) values(p_parent,p_learner,'unlinked',p_parent,jsonb_build_object('devices',result,'scope',p_device));
 return result;
end $$;

