import { dbConfigured } from "@/lib/db/client";
import { cronAuthorized,pushConfiguration,dispatchInvitations } from "@/lib/notifications/server";
export const runtime="nodejs";
export const maxDuration=60;
export async function GET(req:Request) {
 const headers={"cache-control":"private, no-store"};
 if(!cronAuthorized(req))return Response.json({error:"Unauthorized"},{status:401,headers});
 if(!dbConfigured()||!pushConfiguration())return Response.json({enabled:false},{headers});
 try{return Response.json({enabled:true,...await dispatchInvitations()},{headers});}catch{return Response.json({error:"Delivery temporarily unavailable"},{status:503,headers});}
}
