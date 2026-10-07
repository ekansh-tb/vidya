-- Parent-authorized private pairs. No directory, messages, uploads or profile names.
create table if not exists private_circles (
 id uuid primary key default gen_random_uuid(),
 source_learner uuid not null references learners(id) on delete cascade,
 target_learner uuid references learners(id) on delete cascade,
 source_alias text not null check(source_alias in ('Curious Crane','Bright Maple','Gentle Dolphin','Clever Comet','Brave Sparrow','Thoughtful Turtle')),
 target_alias text check(target_alias in ('Curious Crane','Bright Maple','Gentle Dolphin','Clever Comet','Brave Sparrow','Thoughtful Turtle')),
 invite_hash text not null unique check(length(invite_hash)=64),
 status text not null default 'pending' check(status in ('pending','active','left','blocked')),
 source_approved_at timestamptz not null default now(), target_approved_at timestamptz,
 expires_at timestamptz not null default now()+interval '5 days', created_at timestamptz not null default now(),
 closed_at timestamptz,
 check(target_learner is null or target_learner <> source_learner),
 check(status <> 'active' or (target_learner is not null and target_alias is not null and target_approved_at is not null))
);
create unique index if not exists private_circle_active_pair on private_circles(least(source_learner,target_learner),greatest(source_learner,target_learner)) where status='active';
create index if not exists private_circle_source on private_circles(source_learner);
create index if not exists private_circle_target on private_circles(target_learner);
create table if not exists private_circle_cards (
 id uuid primary key default gen_random_uuid(), circle_id uuid not null references private_circles(id) on delete cascade,
 learner_id uuid not null references learners(id) on delete cascade,
 project_id text not null, project_revision timestamptz not null,
 snapshot jsonb not null, status text not null default 'pending' check(status in ('pending','approved','declined')),
 reviewed_by text references parents(id) on delete set null, reviewed_at timestamptz, created_at timestamptz not null default now(),
 unique(circle_id,learner_id,project_id,project_revision),
 check(status='pending' or reviewed_at is not null)
);
create table if not exists private_circle_reactions (
 card_id uuid not null references private_circle_cards(id) on delete cascade,
 learner_id uuid not null references learners(id) on delete cascade,
 reaction text not null check(reaction in ('interesting','creative','good-effort')),
 primary key(card_id,learner_id)
);
create table if not exists private_circle_reports (
 id uuid primary key default gen_random_uuid(), circle_id uuid not null references private_circles(id) on delete cascade,
 learner_id uuid not null references learners(id) on delete cascade,
 reason text not null check(reason in ('unwanted-contact','unsafe-content','pressure','other-concern')),
 created_at timestamptz not null default now()
);
-- Claim and second-family approval are one locked operation. Codes grant no child authority.
create or replace function vidya_accept_circle(p_hash text,p_parent text,p_learner uuid,p_alias text) returns uuid as $$
declare c private_circles%rowtype; source_parent text; answer uuid;
begin
 select * into c from private_circles where invite_hash=p_hash and status='pending' and expires_at>now() for update;
 if not found then return null; end if;
 select parent_id into source_parent from learners where id=c.source_learner;
 if source_parent=p_parent or not exists(select 1 from learners where id=p_learner and parent_id=p_parent) then return null; end if;
 if (select count(*) from private_circles where status='active' and (source_learner=p_learner or target_learner=p_learner))>=5 then return null; end if;
 update private_circles set target_learner=p_learner,target_alias=p_alias,target_approved_at=now(),status='active' where id=c.id returning id into answer;
 return answer;
exception when unique_violation then return null;
end;
$$ language plpgsql;
