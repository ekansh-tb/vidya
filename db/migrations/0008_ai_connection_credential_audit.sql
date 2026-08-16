-- Record direct provider credential replacement without storing credential data.

alter table ai_connection_audit
  drop constraint if exists ai_connection_audit_event_check;

alter table ai_connection_audit
  add constraint ai_connection_audit_event_check
  check (event in ('created', 'status_changed', 'credential_replaced', 'deleted'));
