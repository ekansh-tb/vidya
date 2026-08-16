-- Parent-owned AI provider connections.
--
-- Provider credentials are encrypted by the application before insertion.
-- This table never stores a plaintext key. The parent id is present on every
-- row so every read and mutation can prove ownership in one SQL statement.

create table if not exists ai_provider_connections (
  id                      uuid primary key,
  parent_id               text not null references parents(id) on delete cascade,
  provider                text not null
                          check (provider in ('openrouter', 'openai', 'anthropic', 'google', 'xai')),
  label                   text not null
                          check (label = btrim(label) and char_length(label) between 1 and 80),
  source                  text not null
                          check (source in ('api_key', 'oauth'))
                          check (source <> 'oauth' or provider = 'openrouter'),
  status                  text not null
                          check (status in ('active', 'needs_attention')),
  credential_ciphertext   text not null check (char_length(credential_ciphertext) > 0),
  credential_iv           text not null check (char_length(credential_iv) > 0),
  credential_tag          text not null check (char_length(credential_tag) > 0),
  credential_key_version  text not null
                          check (credential_key_version ~ '^[A-Za-z0-9._-]{1,32}$'),
  credential_fingerprint  text not null
                          check (credential_fingerprint ~ '^[a-f0-9]{64}$'),
  credential_hint         text not null check (char_length(credential_hint) = 4),
  provider_account_id     text,
  last_validated_at       timestamptz not null default now(),
  last_used_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create unique index if not exists ai_provider_connections_parent_label_unique
  on ai_provider_connections (parent_id, lower(label));

create unique index if not exists ai_provider_connections_parent_key_unique
  on ai_provider_connections (parent_id, provider, credential_fingerprint);

create index if not exists ai_provider_connections_parent_created_idx
  on ai_provider_connections (parent_id, created_at desc);

drop trigger if exists ai_provider_connections_touch on ai_provider_connections;
create trigger ai_provider_connections_touch
  before update on ai_provider_connections
  for each row execute function touch_updated_at();

-- This audit intentionally stores no credential fields or provider responses.
-- The connection id is not a foreign key so deletion remains reconstructable.
create table if not exists ai_connection_audit (
  id             uuid primary key default gen_random_uuid(),
  parent_id      text not null references parents(id) on delete cascade,
  connection_id  uuid not null,
  provider       text not null,
  event          text not null
                 check (event in ('created', 'status_changed', 'deleted')),
  actor           text not null,
  detail          jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists ai_connection_audit_parent_idx
  on ai_connection_audit (parent_id, created_at desc);

create index if not exists ai_connection_audit_connection_idx
  on ai_connection_audit (connection_id, created_at desc);
