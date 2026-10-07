import "server-only";
import { getSql } from "./client";
import { SUPPORT_SNAPSHOT } from "@/lib/admin/sponsorship-seed";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
import type { LearningPlacement } from "@/lib/learning/placement";
import { placementSchema } from "@/lib/learning/placement";
import type { LearningActivity } from "@/lib/learning/activity";
import type { ContentRevision, ReviewRecord } from "@/lib/admin/contracts";
import { reviewSchema, supportSchema } from "@/lib/admin/contracts";
import type { z } from "zod";
function revision(row: Record<string, unknown>): ContentRevision {
  return { id: String(row.content_id), revision: Number(row.revision), status: row.status as ContentRevision["status"], payload: row.payload as LearningActivity, reviewedBy: row.reviewed_by as string | null, reviewedAt: row.reviewed_at ? String(row.reviewed_at) : null, reviewRecord: row.review_record as ReviewRecord | null, createdAt: String(row.created_at), publishedAt: row.published_at ? String(row.published_at) : null };
}
export async function listContent() {
  const sql = getSql();
  return (await sql`select content_id,revision,status,payload,review_record,reviewed_by,reviewed_at,published_at,created_at from admin_content_revisions order by content_id,revision desc limit 2000`).map(revision);
}
/** Unrelated owner drafts do not establish that the existing catalog was imported. */
export async function contentInitialized(): Promise<boolean> {
  const rows = await getSql()`select exists(select 1 from admin_audit where event='content_seeded') as ready`;
  return rows[0]?.ready === true;
}
/** Exact historical revision stays readable when archived, for a saved activity. */
export async function publishedActivity(id: string, version?: number): Promise<LearningActivity | null> {
  const sql = getSql();
  const rows = version
    ? await sql`select payload from admin_content_revisions where content_id=${id} and revision=${version} and published_at is not null and status in ('published','archived')`
    : await sql`select payload from admin_content_revisions where content_id=${id} and status='published'`;
  return rows[0]?.payload ?? null;
}
export async function seedContent(actor: string) {
  const sql = getSql();
  // Existing editorial claims and limitations remain verbatim. Import is not expert validation.
  const rows = await sql`with seeded as (
    insert into admin_content_revisions(content_id,revision,status,payload,review_record,reviewed_by,reviewed_at,published_at,created_by)
    select p->>'id',(p->>'revision')::integer,'published',p,
      jsonb_build_object('checks',jsonb_build_array('factual','developmental','language','accessibility','rights'),'limitations',p->'review'->>'limits'),
      'existing:source-grounded-editorial',now(),now(),${actor}
    from jsonb_array_elements(${JSON.stringify(ACTIVITY_CATALOG)}::jsonb) p
    where not exists(select 1 from admin_content_revisions existing where existing.content_id=p->>'id')
    on conflict do nothing returning content_id
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'content_seeded',content_id from seeded returning id),
  initialized as (insert into admin_audit(actor,event,resource_id) select ${actor},'content_seeded','authored-catalog-import' from (select count(*) from logged) required returning id)
  select (select count(*)::integer from seeded) as imported from initialized`;
  return Number(rows[0]?.imported ?? 0);
}
export async function createDraft(actor: string, payload: LearningActivity) {
  const sql = getSql();
  const rows = await sql`with created as (
    insert into admin_content_revisions(content_id,revision,status,payload,created_by)
    select ${payload.id},coalesce(max(revision),0)+1,'draft',
      ${JSON.stringify(payload)}::jsonb || jsonb_build_object('revision',coalesce(max(revision),0)+1),${actor}
    from admin_content_revisions where content_id=${payload.id}
    on conflict do nothing returning *
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'draft_created',content_id||'@'||revision from created returning id)
  select created.* from created cross join (select count(*) from logged) required`;
  return rows[0] ? revision(rows[0]) : null;
}
export async function reviewContent(actor: string, id: string, version: number, record: ReviewRecord) {
  reviewSchema.parse(record);
  const sql = getSql();
  const rows = await sql`with reviewed as (
    update admin_content_revisions set status='review',payload=jsonb_set(jsonb_set(payload,'{review,limits}',to_jsonb(${record.limitations}::text)),'{review,date}',to_jsonb(to_char(current_date,'YYYY-MM-DD'))),review_record=${JSON.stringify(record)}::jsonb,reviewed_by=${actor},reviewed_at=now()
    where content_id=${id} and revision=${version} and status in ('draft','review') and published_at is null returning content_id,revision
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'content_reviewed',content_id||'@'||revision from reviewed returning id)
  select count(*)::integer as changed from logged`;
  return Number(rows[0]?.changed ?? 0) > 0;
}
export async function publishContent(actor: string, id: string, version: number) {
  const sql = getSql();
  const rows = await sql`with eligible as materialized (
    select content_id,revision from admin_content_revisions where content_id=${id} and revision=${version} and status='review' and published_at is null
      and reviewed_by is not null and reviewed_at is not null and jsonb_array_length(review_record->'checks')=5
      and review_record->'checks' @> '["factual","developmental","language","accessibility","rights"]'::jsonb
      and char_length(review_record->>'limitations')>=20 for update
  ), archived as (
    update admin_content_revisions set status='archived' where content_id=${id} and status='published' and exists(select 1 from eligible) returning content_id
  ), published as (
    update admin_content_revisions set status='published',published_at=now()
    where (content_id,revision) in (select content_id,revision from eligible) and (select count(*) from archived)>=0 returning content_id,revision
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'content_published',content_id||'@'||revision from published returning id)
  select count(*)::integer as changed from logged`;
  return Number(rows[0]?.changed ?? 0) > 0;
}
export async function archiveContent(actor: string, id: string, version: number) {
  const sql = getSql();
  const rows = await sql`with archived as (
    update admin_content_revisions set status='archived' where content_id=${id} and revision=${version} and status='published' returning content_id,revision
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'content_archived',content_id||'@'||revision from archived returning id)
  select count(*)::integer as changed from logged`;
  return Number(rows[0]?.changed ?? 0) > 0;
}
export async function operationalOverview() {
  const sql = getSql();
  const rows = await sql`select
    (select count(*)::integer from parents) as families,
    (select count(*)::integer from learners) as learners,
    (select count(*)::integer from learner_devices where revoked_at is null) as devices,
    (select count(*)::integer from admin_content_revisions where status='published') as published,
    (select count(*)::integer from admin_content_revisions where status='draft') as drafts,
    (select count(*)::integer from admin_support_receipts where status='approved') as approved_support`;
  return rows[0];
}
export async function listAdminLearners() {
  const sql = getSql();
  // Deliberately excludes state blobs, private reflections, AI transcripts and care notes.
  return sql`select l.id,l.parent_id,l.name,l.grade,l.board,l.learning_placement as placement,l.created_at,
    (select count(*)::integer from learner_devices d where d.learner_id=l.id and d.revoked_at is null) as active_devices
    from learners l order by l.created_at desc limit 200`;
}
export async function revokeAdminDevice(actor: string, parentId: string, learnerId: string, deviceId: string) {
  const sql = getSql();
  const rows = await sql`with revoked as (
    update learner_devices d set revoked_at=now() from learners l
    where d.id=${deviceId}::uuid and d.learner_id=l.id and l.id=${learnerId}::uuid and l.parent_id=${parentId} and d.revoked_at is null returning d.id
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'device_revoked',id::text from revoked returning id)
  select count(*)::integer as changed from logged`;
  return Number(rows[0]?.changed ?? 0) > 0;
}
export async function adminDevices(parentId: string, learnerId: string) {
  const sql = getSql();
  return sql`select d.id,d.label,d.revoked_at from learner_devices d join learners l on l.id=d.learner_id where l.id=${learnerId}::uuid and l.parent_id=${parentId} order by d.created_at desc limit 20`;
}
export async function listSupport() { const sql = getSql(); return sql`select id,organization,channel,status,contribution,evidence,occurred_on,next_action,expiry,amount,currency from admin_support_receipts order by occurred_on desc,created_at desc limit 200`; }
export async function addSupport(actor: string, data: z.infer<typeof supportSchema>) {
  supportSchema.parse(data); const sql = getSql();
  return sql`with added as (
    insert into admin_support_receipts(organization,channel,status,contribution,evidence,occurred_on,next_action,expiry,amount,currency,created_by)
    values(${data.organization},${data.channel},${data.status},${data.contribution},${data.evidence},${data.occurredOn}::date,${data.nextAction},${data.expiry}::date,${data.amount},${data.currency},${actor}) on conflict do nothing returning id
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'support_receipt_added',id::text from added returning id)
  select added.id from added cross join (select count(*) from logged) required`;
}
export async function listAudit() { const sql = getSql(); return sql`select id,actor,event,resource_id,created_at from admin_audit order by created_at desc limit 100`; }

export async function seedSupport(actor: string) {
  const sql = getSql();
  const rows = await sql`with imported as (
    insert into admin_support_receipts(organization,channel,status,contribution,evidence,occurred_on,next_action,created_by)
    select p->>'organization',p->>'channel',p->>'status',p->>'contribution',p->>'evidence',(p->>'occurredOn')::date,p->>'nextAction',${actor}
    from jsonb_array_elements(${JSON.stringify(SUPPORT_SNAPSHOT)}::jsonb) p on conflict do nothing returning id
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'support_snapshot_imported',id::text from imported returning id)
  select count(*)::integer as imported from logged`;
  return Number(rows[0]?.imported ?? 0);
}

export async function correctAdminPlacement(actor: string, parentId: string, learnerId: string, placement: LearningPlacement) {
  placementSchema.parse(placement);
  const sql = getSql();
  const grade = placement.kind === "school" ? placement.grade : null;
  const board = placement.kind === "school" ? placement.board : null;
  const rows = await sql`with corrected as (
    update learners set learning_placement=${JSON.stringify(placement)}::jsonb,grade=${grade},board=${board}
    where id=${learnerId}::uuid and parent_id=${parentId} returning id
  ), logged as (insert into admin_audit(actor,event,resource_id) select ${actor},'placement_corrected',id::text from corrected returning id)
  select count(*)::integer as changed from logged`;
  return Number(rows[0]?.changed ?? 0) > 0;
}
