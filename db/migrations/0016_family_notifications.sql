-- Opt-in parent invitations only. No child activity, text, or identity payloads.
create table if not exists parent_invitation_preferences (
 parent_id text primary key references parents(id) on delete cascade,
 enabled boolean not null default false,
 weekday smallint not null default 0 check (weekday between 0 and 6),
 preferred_time text not null default '10:00' check (preferred_time ~ '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
 timezone text not null default 'Asia/Kolkata',
 updated_at timestamptz not null default now()
);
create table if not exists parent_push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 parent_id text not null references parents(id) on delete cascade,
 endpoint_hash text not null unique,
 subscription jsonb not null,
 created_at timestamptz not null default now(),
 revoked_at timestamptz,
 unique (id, parent_id)
);
create index if not exists parent_push_active on parent_push_subscriptions(parent_id) where revoked_at is null;
create table if not exists parent_invitation_deliveries (
 subscription_id uuid not null,
 parent_id text not null,
 invitation_date date not null,
 status text not null check(status in ('claimed','sent','failed','expired','cancelled')),
 created_at timestamptz not null default now(),
 finished_at timestamptz,
 primary key(subscription_id, invitation_date),
 foreign key(subscription_id, parent_id) references parent_push_subscriptions(id,parent_id) on delete cascade
);
-- Bounded operational outcomes, no payloads, URLs or provider error bodies retained.

create or replace function vidya_save_invitation_preferences(p_parent text,p_enabled boolean,p_weekday smallint,p_time text,p_zone text) returns void language plpgsql as $$
begin
 perform id from parents where id=p_parent for update;
 if not found then raise exception 'parent unavailable'; end if;
 insert into parent_invitation_preferences(parent_id,enabled,weekday,preferred_time,timezone) values(p_parent,p_enabled,p_weekday,p_time,p_zone)
 on conflict(parent_id) do update set enabled=excluded.enabled,weekday=excluded.weekday,preferred_time=excluded.preferred_time,timezone=excluded.timezone,updated_at=now();
 if not p_enabled then update parent_push_subscriptions set revoked_at=now() where parent_id=p_parent and revoked_at is null; end if;
end $$;
create or replace function vidya_save_push_subscription(p_parent text,p_hash text,p_subscription jsonb) returns uuid language plpgsql as $$
declare result uuid; existing_parent text;
begin
 perform id from parents where id=p_parent for update;
 if not found then return null; end if;
 if not exists(select 1 from parent_invitation_preferences where parent_id=p_parent and enabled) then return null; end if;
 select parent_id into existing_parent from parent_push_subscriptions where endpoint_hash=p_hash;
 if existing_parent is not null and existing_parent<>p_parent then return null; end if;
 if (select count(*) from parent_push_subscriptions where parent_id=p_parent and revoked_at is null and endpoint_hash<>p_hash)>=5 then return null; end if;
 insert into parent_push_subscriptions(parent_id,endpoint_hash,subscription) values(p_parent,p_hash,p_subscription)
 on conflict(endpoint_hash) do update set subscription=excluded.subscription,revoked_at=null where parent_push_subscriptions.parent_id=excluded.parent_id returning id into result;
 return result;
end $$;
