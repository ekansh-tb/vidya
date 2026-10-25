-- Private, parent-authored rehearsal material. Published public content is separate.
create table learner_preparation_sets (
 learner_id uuid not null references learners(id) on delete cascade,
 id uuid not null,
 revision integer not null default 1 check(revision>0),
 payload jsonb not null check(payload->>'version'='1' and payload->>'id'=id::text),
 updated_by text references parents(id) on delete set null,
 updated_at timestamptz not null default now(),
 primary key(learner_id,id)
);
create function vidya_save_preparation_set(p_parent text,p_learner uuid,p_payload jsonb,p_expected integer) returns integer
language plpgsql as $$
declare l learners%rowtype; result integer;
begin
 -- Same ordering as guardian removal: a waiting edit cannot retain revoked access.
 perform pg_advisory_xact_lock(9009,1);
 select * into l from learners where id=p_learner for update;
 if not found or not vidya_can_manage_learner(p_parent,p_learner) then return null; end if;
 if (p_payload->'placement') is distinct from coalesce(l.learning_placement,jsonb_build_object('version',1,'kind','school','board',l.board,'grade',l.grade)) then return null; end if;
 if not exists(select 1 from learner_preparation_sets where learner_id=p_learner and id=(p_payload->>'id')::uuid)
 and (select count(*) from learner_preparation_sets where learner_id=p_learner)>=20 then return null; end if;
 insert into learner_preparation_sets(learner_id,id,payload,updated_by)
 select p_learner,(p_payload->>'id')::uuid,p_payload,p_parent where p_expected=0
 on conflict(learner_id,id) do nothing returning revision into result;
 if result is not null then return result; end if;
 update learner_preparation_sets set payload=p_payload,revision=revision+1,updated_by=p_parent,updated_at=now()
 where learner_id=p_learner and id=(p_payload->>'id')::uuid and revision=p_expected returning revision into result;
 return result;
end $$;
