import "server-only";
import { createHash } from "node:crypto";
import { getSql } from "./client";
import { DEFAULT_INVITATION_PREFERENCES, type InvitationPreferences, type InvitationSubscription } from "../notifications/contracts";
export async function invitationPreferences(parentId: string): Promise<InvitationPreferences> {
 const rows = await getSql()`select enabled, weekday, preferred_time as time, timezone from parent_invitation_preferences where parent_id=${parentId}`;
 return rows[0] ? rows[0] as InvitationPreferences : { ...DEFAULT_INVITATION_PREFERENCES };
}
export async function saveInvitationPreferences(parentId: string, prefs: InvitationPreferences) {
 await getSql()`select vidya_save_invitation_preferences(${parentId},${prefs.enabled},${prefs.weekday}::smallint,${prefs.time},${prefs.timezone})`;
}
export async function parentSubscriptions(parentId: string): Promise<{ id: string }[]> { return await getSql()`select id from parent_push_subscriptions where parent_id=${parentId} and revoked_at is null order by created_at limit 5` as { id: string }[]; }
export async function saveParentSubscription(parentId: string, subscription: InvitationSubscription): Promise<string | null> {
 const hash=createHash("sha256").update(subscription.endpoint).digest("hex");
 // Database function serializes parent preference/device edits and refuses cross-family transfer.
 const rows=await getSql()`select vidya_save_push_subscription(${parentId},${hash},${JSON.stringify(subscription)}::jsonb) as id`;
 return rows[0]?.id ?? null;
}
export async function removeParentSubscription(parentId: string, id: string) { await getSql()`update parent_push_subscriptions set revoked_at=now() where parent_id=${parentId} and id=${id}::uuid`; }
export type DeliveryCandidate = { id: string; parentId: string; subscription: InvitationSubscription; preferences: InvitationPreferences };
export async function deliveryCandidates(): Promise<DeliveryCandidate[]> {
 const rows=await getSql()`select s.id,s.parent_id,s.subscription,p.enabled,p.weekday,p.preferred_time,p.timezone from parent_push_subscriptions s join parent_invitation_preferences p on p.parent_id=s.parent_id where p.enabled and s.revoked_at is null and not exists(select 1 from parent_invitation_deliveries d where d.subscription_id=s.id and d.created_at>now()-interval '3 days') order by s.created_at limit 100`;
 return rows.map(row=>({id:row.id,parentId:row.parent_id,subscription:row.subscription,preferences:{enabled:row.enabled,weekday:row.weekday,time:row.preferred_time,timezone:row.timezone}}));
}
export async function claimInvitation(candidate: DeliveryCandidate, date: string): Promise<boolean> {
 const rows=await getSql()`insert into parent_invitation_deliveries(subscription_id,parent_id,invitation_date,status)
 select s.id,s.parent_id,${date}::date,'claimed' from parent_push_subscriptions s join parent_invitation_preferences p on p.parent_id=s.parent_id where s.id=${candidate.id}::uuid and s.parent_id=${candidate.parentId} and s.revoked_at is null and p.enabled and p.weekday=${candidate.preferences.weekday} and p.preferred_time=${candidate.preferences.time} and p.timezone=${candidate.preferences.timezone}
 on conflict(subscription_id,invitation_date) do nothing returning subscription_id`;
 return rows.length===1;
}
export async function invitationStillEnabled(id: string,parentId: string): Promise<boolean> {
 const rows=await getSql()`select s.id from parent_push_subscriptions s join parent_invitation_preferences p on p.parent_id=s.parent_id where s.id=${id}::uuid and s.parent_id=${parentId} and s.revoked_at is null and p.enabled`;
 return rows.length===1;
}
export async function finishInvitation(id: string,date: string,status: "sent"|"failed"|"expired"|"cancelled") {
 await getSql()`update parent_invitation_deliveries set status=${status},finished_at=now() where subscription_id=${id}::uuid and invitation_date=${date}::date and status='claimed'`;
 if(status==='expired') await getSql()`update parent_push_subscriptions set revoked_at=now() where id=${id}::uuid`;
}
