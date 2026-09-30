-- Shared request counters. Keys are SHA-256 digests, never raw IPs/account ids.
-- Expired rows are reclaimed in bounded batches by the consume statement.
create table if not exists request_limits (
  key_hash text primary key check (key_hash ~ '^[0-9a-f]{64}$'),
  hits integer not null check (hits > 0),
  expires_at timestamptz not null
);
create index if not exists request_limits_expiry_idx on request_limits (expires_at);
