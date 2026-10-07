-- New settings default on. Preserve every saved explicit off setting.
-- No existing row update, subscription backfill, permission grant or dispatch.
alter table parent_invitation_preferences alter column enabled set default true;
