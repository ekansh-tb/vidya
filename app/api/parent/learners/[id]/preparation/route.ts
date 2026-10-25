import {z} from 'zod';
import {requireParent} from '@/lib/auth/session';
import {dbConfigured} from '@/lib/db/client';
import {getLearnerForParent} from '@/lib/db/queries';
import {preparationSetsForParent,savePreparationSet} from '@/lib/db/preparation-sets';
import {preparationSaveSchema} from '@/lib/preparation/contracts';
import {readBoundedJson} from '@/lib/api/bounded-json';
import {isSameOrigin,rateLimit} from '@/lib/api/guard';
export const runtime='nodejs';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store',Vary:'Cookie'}});
async function owned(context:{params:Promise<{id:string}>}){const parent=await requireParent();if(!parent)return false;const {id}=await context.params;if(!z.string().uuid().safeParse(id).success)return null;const learner=await getLearnerForParent(parent.userId,id);return learner?{parent,learner}:null;}
export async function GET(_req:Request,context:{params:Promise<{id:string}>}){
 if(!dbConfigured())return reply({error:'Preparation storage is unavailable.'},503);
 try{const identity=await owned(context);if(identity===false)return reply({error:'Please sign in as a parent.'},401);if(!identity)return reply({error:'Learner not found.'},404);return reply({sets:await preparationSetsForParent(identity.parent.userId,identity.learner.id)});}
 catch{return reply({error:'Could not load preparation sets. Please try again.'},503);}
}
export async function PUT(req:Request,context:{params:Promise<{id:string}>}){
 if(!isSameOrigin(req))return reply({error:'Forbidden'},403);
 if(!dbConfigured())return reply({error:'Preparation storage is unavailable.'},503);
 try{
  const identity=await owned(context);if(identity===false)return reply({error:'Please sign in as a parent.'},401);if(!identity)return reply({error:'Learner not found.'},404);
  const rate=await rateLimit(`preparation-sets:${identity.learner.id}`,{limit:30,windowMs:600000});if(!rate.ok)return reply({error:'Please try saving later.'},rate.unavailable?503:429);
  const body=await readBoundedJson(req,128000);if(!body.ok)return reply({error:'This set is too large or could not be read.'},body.reason==='too_large'?413:400);
  const parsed=preparationSaveSchema.safeParse(body.value);if(!parsed.success)return reply({error:'Check the questions, answer guides and permission to use this material.'},400);
  const revision=await savePreparationSet(identity.parent.userId,identity.learner.id,parsed.data.set,parsed.data.expectedRevision);
  if(revision===false)return reply({error:'The set, family access or placement changed, or the 20-set limit was reached. Reload saved sets before trying again; keep your edits.'},409);
  return reply({set:parsed.data.set,revision});
 }catch{return reply({error:'Could not save. Keep your edits and try again.'},503);}
}
