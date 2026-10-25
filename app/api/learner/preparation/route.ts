import {requireLearnerFrom} from '@/lib/auth/session';
import {dbConfigured} from '@/lib/db/client';
import {preparationSetsForLearner} from '@/lib/db/preparation-sets';
import {isSameOrigin} from '@/lib/api/guard';
export const runtime='nodejs';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store',Vary:'Cookie, x-vidya-device'}});
export async function GET(req:Request){
 if(!isSameOrigin(req))return reply({error:'Forbidden'},403);
 if(!dbConfigured())return reply({error:'Link your learner to receive family preparation sets.'},503);
 try{const identity=await requireLearnerFrom(req);if(!identity)return reply({error:'Please reconnect this learner to receive family sets.'},401);return reply({sets:await preparationSetsForLearner(identity.learner)});}
 catch{return reply({error:'Family sets could not be loaded. Saved papers and public starters still work.'},503);}
}
