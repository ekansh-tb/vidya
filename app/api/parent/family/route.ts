import {z} from 'zod';
import {currentUser} from '@clerk/nextjs/server';
import {requireParent} from '@/lib/auth/session';
import {requireRecentParentReverification} from '@/lib/auth/reverification';
import {dbConfigured} from '@/lib/db/client';
import {isSameOrigin,rateLimit} from '@/lib/api/guard';
import {readBoundedJson} from '@/lib/api/bounded-json';
import {inviteGuardian,acceptGuardian,removeGuardian,cancelGuardianInvite,guardianAccess} from '@/lib/db/guardians';
export const runtime='nodejs';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'cache-control':'private, no-store'}});
const schema=z.discriminatedUnion('action',[
 z.object({action:z.literal('invite'),learnerId:z.uuid(),email:z.email().max(254)}).strict(),
 z.object({action:z.literal('accept'),code:z.string().regex(/^[A-Za-z0-9_-]{43}$/),confirmAccess:z.literal(true)}).strict(),
 z.object({action:z.literal('remove'),learnerId:z.uuid(),parentId:z.string().min(1).max(128)}).strict(),
 z.object({action:z.literal('cancel'),id:z.uuid()}).strict(),
]);
export async function GET(req:Request){
 if(!isSameOrigin(req))return json({error:'Forbidden'},403);
 if(!dbConfigured())return json({error:'Storage unavailable'},503);
 const parent=await requireParent();if(!parent)return json({error:'Unauthorized'},401);
 const learnerId=z.uuid().safeParse(new URL(req.url).searchParams.get('learnerId'));if(!learnerId.success)return json({error:'Not found'},404);
 try{const access=await guardianAccess(parent.userId,learnerId.data);return access?json(access):json({error:'Not found'},404);}catch{return json({error:'Family access could not be loaded. Try again.'},503);}
}
export async function POST(req:Request){
 if(!isSameOrigin(req))return json({error:'Forbidden'},403);
 if(!dbConfigured())return json({error:'Storage unavailable'},503);
 const parent=await requireParent();if(!parent)return json({error:'Unauthorized'},401);
 const limit=await rateLimit(`family-access:${parent.userId}`,{limit:20,windowMs:600_000});if(limit.unavailable)return json({error:'Please try again later.'},503);if(!limit.ok)return json({error:'Too many attempts. Please try later.'},429);
 const body=await readBoundedJson(req,2048);if(!body.ok)return json({error:'Invalid request'},body.reason==='too_large'?413:400);
 const input=schema.safeParse(body.value);if(!input.success)return json({error:'Check the email or invitation code.'},400);
 const recent=await requireRecentParentReverification();if(recent)return recent;
 try{
  const action=input.data;
  if(action.action==='invite'){const invite=await inviteGuardian(parent.userId,action.learnerId,action.email);return invite?json(invite,201):json({error:'Cannot create this invitation. Check existing family access.'},409);}
  if(action.action==='accept'){
   const user=await currentUser();const email=user?.primaryEmailAddress;
   if(user?.id!==parent.userId||email?.verification?.status!=='verified')return json({error:'Verify your primary email before accepting.'},403);
   const learnerId=await acceptGuardian(parent.userId,email.emailAddress,action.code);return learnerId?json({learnerId}):json({error:'The invitation is expired, already used, or for a different verified email.'},409);
  }
  const ok=action.action==='remove'?await removeGuardian(parent.userId,action.learnerId,action.parentId):await cancelGuardianInvite(parent.userId,action.id);
  return ok?json({ok:true}):json({error:'Access changed or this action is unavailable. Refresh and try again.'},404);
 }catch{return json({error:'Family access could not be saved. Please try again.'},503);}
}
