import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getSql } from "./client";
import { creationCardSnapshotSchema, frameSVG, readCreationProject, type CreationProject } from "../creation/project";
import type { CircleCard, CircleSummary } from "../circles/contract";
const hash = (code: string) => createHash("sha256").update(`vidya-circle-v1:${code}`).digest("hex");

export async function createCircleInvite(parentId: string, learnerId: string, alias: string): Promise<string | null> {
  const code = randomBytes(24).toString("base64url");
  const rows = await getSql()`select vidya_create_circle(${parentId},${learnerId}::uuid,${alias},${hash(code)}) as id`;
  return rows[0]?.id ? code : null;
}
export async function acceptCircleInvite(parentId: string, learnerId: string, alias: string, code: string): Promise<boolean> {
  const rows = await getSql()`select vidya_accept_circle(${hash(code)},${parentId},${learnerId}::uuid,${alias}) as id`;
  return Boolean(rows[0]?.id);
}
export async function circlesForLearner(learnerId: string): Promise<CircleSummary[]> {
  const rows = await getSql()`select id,status,expires_at,
    case when source_learner=${learnerId} then source_alias else target_alias end as alias,
    case when source_learner=${learnerId} then target_alias else source_alias end as friend_alias
    from private_circles where (source_learner=${learnerId} or target_learner=${learnerId}) and (status<>'pending' or expires_at>now()) order by created_at desc limit 20`;
  return rows.map((row) => ({ id: row.id, status: row.status, alias: row.alias, friendAlias: row.friend_alias ?? null, expiresAt: new Date(row.expires_at).toISOString() }));
}
export async function parentOwnsCircleLearner(parentId: string, learnerId: string): Promise<boolean> {
  const rows = await getSql()`select id from learners where id=${learnerId} and parent_id=${parentId}`; return rows.length > 0;
}
export async function closeCircleForLearner(learnerId: string, circleId: string, status: "left" | "blocked"): Promise<boolean> {
  const rows = await getSql()`update private_circles set status=${status},closed_at=now() where id=${circleId} and status in ('pending','active') and (source_learner=${learnerId} or target_learner=${learnerId}) returning id`; return rows.length > 0;
}
export async function closeCircleForParent(parentId: string, circleId: string, status: "left" | "blocked"): Promise<boolean> {
  const rows = await getSql()`update private_circles c set status=${status},closed_at=now() where c.id=${circleId} and c.status in ('pending','active') and exists(select 1 from learners l where l.parent_id=${parentId} and l.id in (c.source_learner,c.target_learner)) returning c.id`; return rows.length > 0;
}
export async function requestCircleCard(learnerId: string, circleId: string, projectId: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`select state->'creativeStudio'->'projects' as projects from learner_states where learner_id=${learnerId}`;
  const candidate = Array.isArray(rows[0]?.projects) ? rows[0].projects.find((project: CreationProject | null) => project && typeof project === "object" && project.id === projectId) : undefined;
  const project = readCreationProject(candidate);
  if (!project || !project.title.trim() || Buffer.byteLength(JSON.stringify(project)) > 100_000) return false;
  const snapshot = { title: project.title, frame: project.frames[0] };
  const inserted = await sql`select vidya_request_circle_card(${learnerId}::uuid,${circleId}::uuid,${project.id},${project.updatedAt}::timestamptz,${JSON.stringify(snapshot)}::jsonb) as id`;
  return Boolean(inserted[0]?.id);
}
export async function reviewCircleCard(parentId: string, cardId: string, approved: boolean): Promise<boolean> {
  const rows = await getSql()`update private_circle_cards card set status=${approved ? "approved" : "declined"},reviewed_by=${parentId},reviewed_at=now()
    where card.id=${cardId} and card.status='pending' and exists(select 1 from learners l where l.id=card.learner_id and l.parent_id=${parentId})
    and exists(select 1 from private_circles c where c.id=card.circle_id and c.status='active') returning card.id`;
  return rows.length > 0;
}
export async function cardsForLearner(learnerId: string, parentReview = false): Promise<CircleCard[]> {
  const rows = await getSql()`select card.id,card.circle_id,card.snapshot,card.status,card.learner_id,
    case when card.learner_id=c.source_learner then c.source_alias else c.target_alias end as alias,
    coalesce((select jsonb_agg(r) from (select reaction,count(*)::int as count from private_circle_reactions where card_id=card.id group by reaction) r),'[]'::jsonb) as reactions
    from private_circle_cards card join private_circles c on c.id=card.circle_id where c.status='active'
    and (c.source_learner=${learnerId} or c.target_learner=${learnerId})
    and (card.status='approved' or (card.learner_id=${learnerId} and (${parentReview} or card.status='pending')))
    order by card.created_at desc limit 50`;
  return rows.flatMap((row) => {
    const result = creationCardSnapshotSchema.safeParse(row.snapshot); if (!result.success) return []; const snapshot = result.data;
    return [{ id: row.id, circleId: row.circle_id, alias: row.alias, title: snapshot.title, svg: frameSVG(snapshot.frame), status: row.status, own: row.learner_id === learnerId, reactions: row.reactions }];
  });
}
export async function reactToCircleCard(learnerId: string, cardId: string, reaction: string): Promise<boolean> {
  const rows = await getSql()`insert into private_circle_reactions(card_id,learner_id,reaction)
    select card.id,${learnerId},${reaction} from private_circle_cards card join private_circles c on c.id=card.circle_id
    where card.id=${cardId} and card.status='approved' and c.status='active' and (c.source_learner=${learnerId} or c.target_learner=${learnerId})
    on conflict(card_id,learner_id) do update set reaction=excluded.reaction returning card_id`; return rows.length > 0;
}
export async function reportCircle(learnerId: string, circleId: string, reason: string): Promise<boolean> {
  const rows = await getSql()`with closed as (update private_circles set status='blocked',closed_at=now() where id=${circleId} and status='active' and (source_learner=${learnerId} or target_learner=${learnerId}) returning id)
    insert into private_circle_reports(circle_id,learner_id,reason) select id,${learnerId},${reason} from closed returning id`; return rows.length > 0;
}

export async function unshareCircleCard(learnerId: string, cardId: string): Promise<boolean> {
  const rows = await getSql()`delete from private_circle_cards where id=${cardId} and learner_id=${learnerId} returning id`; return rows.length > 0;
}
