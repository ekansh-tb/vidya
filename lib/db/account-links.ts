import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { getSql } from "./client";

export function hashAccountLinkToken(token: string): string {
  return createHash("sha256").update(`vidya-account-link-v1:${token}`).digest("hex");
}

/** Persistent learner classification takes precedence over legacy authority. */
export async function accountAuthority(userId: string): Promise<"parent" | "learner" | "revoked" | null> {
  const rows = await getSql()`
    select case
      when exists (select 1 from learner_account_subjects where clerk_user_id = ${userId} and revoked_at is not null) then 'revoked'
      when exists (select 1 from learner_account_subjects where clerk_user_id = ${userId}) then 'learner'
      when exists (select 1 from parents where id = ${userId}) then 'parent'
      else null end as authority
  `;
  return rows[0]?.authority ?? null;
}

/** userId must come from Clerk auth(), never from a request body. */
export async function requestAccountLink(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const rows = await getSql()`select vidya_request_account_link(${userId}, ${hashAccountLinkToken(token)}) as expires_at`;
  if (!rows[0]?.expires_at) return null;
  return { token, expiresAt: new Date(rows[0].expires_at).toISOString() };
}

/** Inspection grants no access and reveals only the candidate account id. */
export async function inspectAccountLink(parentId: string, learnerId: string, token: string) {
  const rows = await getSql()`
    select r.clerk_user_id, r.expires_at from learner_account_link_requests r
    where r.token_hash = ${hashAccountLinkToken(token)}
      and r.used_at is null and r.expires_at > clock_timestamp()
      and r.clerk_user_id <> ${parentId}
      and not exists (select 1 from parents where id = r.clerk_user_id)
      and exists (select 1 from learners where id = ${learnerId}::uuid and parent_id = ${parentId} and clerk_user_id is null)
      and not exists (select 1 from learner_account_subjects where clerk_user_id = ${parentId})
  `;
  return rows.length ? { clerkUserId: String(rows[0].clerk_user_id), expiresAt: new Date(rows[0].expires_at).toISOString() } : null;
}

/** Read-only status. Reading this never classifies an account. */
export async function learnerAccountLinkStatus(userId: string) {
  const rows = await getSql()`
    select s.clerk_user_id as classified, s.revoked_at,
      exists(select 1 from parents where id = ${userId}) as is_parent,
      l.name as learner_name, l.id as learner_id, p.display_name as guardian_name,
      r.expires_at, r.used_at, r.expires_at > clock_timestamp() as pending_valid
    from (select ${userId}::text as subject) a
    left join learner_account_subjects s on s.clerk_user_id = a.subject
    left join learners l on l.clerk_user_id = a.subject and l.parent_id is distinct from a.subject
    left join parents p on p.id = l.parent_id
    left join learner_account_link_requests r on r.clerk_user_id = a.subject
  `;
  const row = rows[0];
  if (!row) throw new Error("Account status unavailable");
  if (row.learner_id) return { status: "linked" as const, learnerName: String(row.learner_name), guardianName: row.guardian_name ? String(row.guardian_name) : null };
  if (!row.classified) return { status: row.is_parent ? "parent" as const : "unclassified" as const };
  if (row.expires_at && !row.used_at) return { status: row.pending_valid ? "pending" as const : "expired" as const, expiresAt: new Date(row.expires_at).toISOString() };
  return { status: row.revoked_at ? "revoked" as const : "unlinked" as const };
}

export async function parentAccountLinkStatus(parentId: string, learnerId: string) {
  const rows = await getSql()`select clerk_user_id from learners where id = ${learnerId}::uuid and parent_id = ${parentId}`;
  return rows.length ? { clerkUserId: rows[0].clerk_user_id ? String(rows[0].clerk_user_id) : null } : null;
}

/** The SQL function rechecks ownership and consumes the request atomically. */
export async function approveAccountLink(parentId: string, learnerId: string, token: string, expectedClerkUserId: string) {
  const rows = await getSql()`select vidya_approve_account_link(${parentId}, ${learnerId}::uuid, ${hashAccountLinkToken(token)}, ${expectedClerkUserId}) as ok`;
  return rows[0]?.ok === true;
}

export async function revokeAccountLink(parentId: string, learnerId: string) {
  const rows = await getSql()`select vidya_revoke_account_link(${parentId}, ${learnerId}::uuid) as ok`;
  return rows[0]?.ok === true;
}
