-- One parent-approved guidance document per learner. Each edit, draft or
-- withdrawal appends a version. The latest version alone determines status.
-- No history is copied into learner state, analytics or shared training data.
create table if not exists parent_guidance_versions (
  learner_id uuid not null,
  parent_id text not null,
  version integer not null check (version > 0),
  status text not null check (status in ('draft', 'approved', 'withdrawn')),
  content text not null check (
    (status = 'withdrawn' and content = '') or
    (status in ('draft', 'approved') and content = btrim(content)
      and char_length(content) between 1 and 2000)
  ),
  created_at timestamptz not null default now(),
  primary key (learner_id, version),
  foreign key (learner_id, parent_id)
    references learners(id, parent_id) on delete cascade
);

create or replace function protect_parent_guidance_history()
returns trigger language plpgsql as $$
begin
  -- Account/learner erasure may cascade. Ordinary history edits cannot.
  if TG_OP = 'DELETE' and pg_trigger_depth() > 1 then return OLD; end if;
  raise exception 'Parent guidance history is immutable';
end;
$$;
drop trigger if exists parent_guidance_immutable on parent_guidance_versions;
create trigger parent_guidance_immutable before update or delete
  on parent_guidance_versions for each row
  execute function protect_parent_guidance_history();
