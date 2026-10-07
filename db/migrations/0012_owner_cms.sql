-- Owner-only content operations. No progress, care notes or private reflections here.
create table if not exists admin_content_revisions (
  content_id text not null check (content_id ~ '^[a-z0-9-]{1,100}$'),
  revision integer not null check (revision > 0),
  status text not null check (status in ('draft','review','published','archived')),
  payload jsonb not null,
  review_record jsonb,
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_by text not null,
  created_at timestamptz not null default now(),
  primary key (content_id, revision),
  check (coalesce(payload->>'id' = content_id and (payload->>'revision')::integer = revision,false)),
  check (status not in ('review','published') or (reviewed_by is not null and reviewed_at is not null and review_record is not null)),
  check (status <> 'published' or published_at is not null),
  check (status not in ('review','published') or coalesce((
    jsonb_typeof(review_record->'checks') = 'array' and jsonb_array_length(review_record->'checks') = 5
    and review_record->'checks' @> '["factual","developmental","language","accessibility","rights"]'::jsonb
    and char_length(review_record->>'limitations') >= 20
  ),false))
);
create unique index if not exists admin_content_one_live on admin_content_revisions(content_id) where status='published';
create or replace function protect_content_revision() returns trigger as $$
begin
  if tg_op = 'DELETE' and old.published_at is not null then
    raise exception 'Published revisions are retained';
  end if;
  if tg_op = 'UPDATE' and old.published_at is not null and
    (new.payload is distinct from old.payload or new.review_record is distinct from old.review_record or
     new.reviewed_by is distinct from old.reviewed_by or new.reviewed_at is distinct from old.reviewed_at or
     new.published_at is distinct from old.published_at or new.content_id is distinct from old.content_id or
     new.revision is distinct from old.revision or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at or new.status not in ('published','archived')) then
    raise exception 'Published revision content is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$ language plpgsql;
drop trigger if exists admin_content_immutable on admin_content_revisions;
create trigger admin_content_immutable before update or delete on admin_content_revisions for each row execute function protect_content_revision();
create table if not exists admin_audit (
  id uuid primary key default gen_random_uuid(), actor text not null,
  event text not null, resource_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_created on admin_audit(created_at desc);
create table if not exists admin_support_receipts (
  id uuid primary key default gen_random_uuid(), organization text not null,
  channel text not null check(channel in ('email','form','conversation')),
  status text not null check(status in ('prepared','sent','submitted','reply-received','approved','declined')),
  contribution text not null, evidence text not null, occurred_on date not null,
  next_action text not null default '', expiry date,
  amount numeric check(amount >= 0), currency text check(currency in ('INR','USD')),
  created_by text not null, created_at timestamptz not null default now()
);

create unique index if not exists admin_support_receipt_dedup on admin_support_receipts(organization, md5(evidence));
