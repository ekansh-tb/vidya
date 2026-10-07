-- Serialize learner capacity checks. Do not rely on an unlocked COUNT.
create or replace function vidya_create_circle(p_parent text,p_learner uuid,p_alias text,p_hash text) returns uuid as $$
declare answer uuid;
begin
 perform id from learners where id=p_learner and parent_id=p_parent for update;
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
 if source_parent is null or source_parent=p_parent or not exists(select 1 from learners where id=p_learner and parent_id=p_parent) then return null; end if;
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

-- A project has one card per circle. Arbitrary draft timestamps cannot create
-- duplicates. Keep the newest historical snapshot before adding uniqueness.
delete from private_circle_cards card using (
 select id,row_number() over(partition by circle_id,learner_id,project_id order by created_at desc,id desc) as position
 from private_circle_cards
) duplicates where card.id=duplicates.id and duplicates.position>1;
create unique index if not exists private_circle_one_project on private_circle_cards(circle_id,learner_id,project_id);

create or replace function vidya_request_circle_card(p_learner uuid,p_circle uuid,p_project text,p_revision timestamptz,p_snapshot jsonb) returns uuid as $$
declare c private_circles%rowtype; previous private_circle_cards%rowtype; answer uuid; pending_count int;
begin
 select * into c from private_circles where id=p_circle and status='active' and (source_learner=p_learner or target_learner=p_learner) for update;
 if not found then return null; end if;
 -- The route supplied a schema-reviewed snapshot from saved server state.
 -- Confirm that exact saved project's title/artwork still exists here too.
 if not exists(select 1 from learner_states s,
   lateral jsonb_array_elements(case when jsonb_typeof(s.state->'creativeStudio'->'projects')='array' then s.state->'creativeStudio'->'projects' else '[]'::jsonb end) project
   where s.learner_id=p_learner and project->>'id'=p_project
     and project->'title'=p_snapshot->'title' and project->'frames'->0=p_snapshot->'frame') then return null; end if;
 select * into previous from private_circle_cards where circle_id=p_circle and learner_id=p_learner and project_id=p_project;
 if found and previous.snapshot=p_snapshot then return previous.id; end if;
 select count(*) into pending_count from private_circle_cards where circle_id=p_circle and learner_id=p_learner and status='pending';
 if pending_count>=5 and (previous.id is null or previous.status<>'pending') then return null; end if;
 if previous.id is null and (select count(*) from private_circle_cards where circle_id=p_circle and learner_id=p_learner)>=20 then return null; end if;
 insert into private_circle_cards(circle_id,learner_id,project_id,project_revision,snapshot)
   values(p_circle,p_learner,p_project,p_revision,p_snapshot)
 on conflict(circle_id,learner_id,project_id) do update
   set project_revision=excluded.project_revision,snapshot=excluded.snapshot,status='pending',reviewed_by=null,reviewed_at=null,created_at=now()
 returning id into answer;
 -- Reactions refer to the approved snapshot and do not carry to revised art.
 delete from private_circle_reactions where card_id=answer;
 return answer;
end;
$$ language plpgsql;
