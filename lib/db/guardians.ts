import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import {getSql} from './client';
export const guardianTokenHash=(token:string)=>createHash('sha256').update(`vidya-guardian-v1:${token}`).digest('hex');
export async function inviteGuardian(parentId:string,learnerId:string,email:string){
 const code=randomBytes(32).toString('base64url');
 const rows=await getSql()`select vidya_invite_guardian(${parentId},${learnerId}::uuid,${email.trim().toLowerCase()},${guardianTokenHash(code)}) as id`;
 return rows[0]?.id?{id:String(rows[0].id),code}:null;
}
export async function acceptGuardian(parentId:string,verifiedEmail:string,code:string){
 const rows=await getSql()`select vidya_accept_guardian(${parentId},${verifiedEmail.trim().toLowerCase()},${guardianTokenHash(code)}) as id`;
 return rows[0]?.id?String(rows[0].id):null;
}
export async function removeGuardian(actor:string,learnerId:string,parentId:string){
 const rows=await getSql()`select vidya_remove_guardian(${actor},${learnerId}::uuid,${parentId}) as ok`;return rows[0]?.ok===true;
}
export async function cancelGuardianInvite(parentId:string,id:string){
 const rows=await getSql()`select vidya_cancel_guardian_invite(${parentId},${id}::uuid) as ok`;return rows[0]?.ok===true;
}
export async function guardianAccess(parentId:string,learnerId:string){
 const sql=getSql();
 const learners=await sql`select parent_id from learners where id=${learnerId}::uuid and vidya_can_manage_learner(${parentId},id)`;
 if(!learners[0])return null;
 const owner=learners[0].parent_id===parentId;
 const members=await sql`select g.parent_id,p.display_name,g.created_at from learner_guardians g join parents p on p.id=g.parent_id where g.learner_id=${learnerId}::uuid and g.invited_by=${learners[0].parent_id} and g.revoked_at is null and vidya_can_manage_learner(${parentId},g.learner_id)`;
 const invitations=owner?await sql`select id,recipient_email,expires_at from guardian_invitations where learner_id=${learnerId}::uuid and created_by=${parentId} and accepted_at is null and revoked_at is null and expires_at>now() order by created_at desc`:[];
 return {owner,members:members.map(m=>({parentId:String(m.parent_id),name:m.display_name?String(m.display_name):'Co-parent',joinedAt:new Date(m.created_at).toISOString()})),invitations:invitations.map(i=>({id:String(i.id),email:String(i.recipient_email),expiresAt:new Date(i.expires_at).toISOString()}))};
}
