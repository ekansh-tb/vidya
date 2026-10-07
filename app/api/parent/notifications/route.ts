import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { isSameOrigin, rateLimit } from "@/lib/api/guard";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { invitationPreferences,saveInvitationPreferences,parentSubscriptions,saveParentSubscription,removeParentSubscription } from "@/lib/db/notifications";
import { preferenceSchema,subscriptionSchema } from "@/lib/notifications/contracts";
import { pushConfiguration } from "@/lib/notifications/server";
export const runtime="nodejs";
async function body(req:Request,max:number) { const result=await readBoundedJson(req,max);return result.ok?result.value:null; }
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{"cache-control":"private, no-store","vary":"Cookie","x-content-type-options":"nosniff"}});
async function authorize(req:Request,mutation=false) {
 if(!isSameOrigin(req)) return response({error:"Forbidden"},403);
 if(!dbConfigured()) return response({error:"Storage unavailable"},503);
 const parent=await requireParent(); if(!parent) return response({error:"Sign in as a parent"},401);
 if(mutation) { const limit=await rateLimit(`parent-invitations:${parent.userId}`,{limit:30,windowMs:600000}); if(limit.unavailable) return response({error:"Please try later"},503); if(!limit.ok) return response({error:"Please try later"},429); }
 return parent;
}
export async function GET(req:Request) { try { const parent=await authorize(req); if(parent instanceof Response)return parent; const config=pushConfiguration();return response({preferences:await invitationPreferences(parent.userId),subscriptions:await parentSubscriptions(parent.userId),pushAvailable:Boolean(config),publicKey:config?.publicKey ?? null}); } catch{return response({error:"Invitations unavailable"},503);} }
export async function PUT(req:Request) { try {const parent=await authorize(req,true);if(parent instanceof Response)return parent;const parsed=preferenceSchema.safeParse(await body(req,4096));if(!parsed.success)return response({error:"Check the day, time and timezone"},400);await saveInvitationPreferences(parent.userId,parsed.data);return response({preferences:parsed.data});}catch{return response({error:"Could not save invitation preferences"},503);} }
export async function POST(req:Request) { try {const parent=await authorize(req,true);if(parent instanceof Response)return parent;if(!pushConfiguration())return response({error:"Browser invitations are not configured yet"},503);if(!(await invitationPreferences(parent.userId)).enabled)return response({error:"Enable weekly invitations first"},409);const parsed=subscriptionSchema.safeParse(await body(req,4096));if(!parsed.success)return response({error:"This browser push service is not supported"},400);const id=await saveParentSubscription(parent.userId,parsed.data);return id?response({id},201):response({error:"This browser belongs to another account or the five-device limit is reached"},409);}catch{return response({error:"Could not enable browser invitations"},503);} }
export async function DELETE(req:Request) { try {const parent=await authorize(req,true);if(parent instanceof Response)return parent;const parsed=z.object({id:z.string().uuid()}).strict().safeParse(await body(req,1024));if(!parsed.success)return response({error:"Invalid browser invitation"},400);await removeParentSubscription(parent.userId,parsed.data.id);return response({removed:true});}catch{return response({error:"Could not disable browser invitations"},503);} }
