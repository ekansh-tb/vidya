import "server-only";
import { createECDH, timingSafeEqual } from "node:crypto";
import webpush from "web-push";
import { deliveryCandidates, claimInvitation, invitationStillEnabled, finishInvitation } from "../db/notifications";
import { INVITATION_PAYLOAD, invitationDueKey, preferenceSchema, subscriptionSchema, type InvitationSubscription } from "./contracts";
export function pushConfiguration() {
 const publicKey=process.env.VIDYA_VAPID_PUBLIC_KEY ?? "",privateKey=process.env.VIDYA_VAPID_PRIVATE_KEY ?? "",subject=process.env.VIDYA_VAPID_SUBJECT ?? "";
 if(process.env.VIDYA_WEB_PUSH_ENABLED!=="true" || !/^[A-Za-z0-9_-]{87}$/.test(publicKey) || !/^[A-Za-z0-9_-]{43}$/.test(privateKey)) return null;
 try { const url=new URL(subject); if(!["mailto:","https:"].includes(url.protocol) || !url.pathname || url.hostname==='localhost' || url.username || url.password) return null; } catch { return null; }
 try { const key=createECDH("prime256v1");key.setPrivateKey(Buffer.from(privateKey,"base64url"));if(key.getPublicKey().toString("base64url")!==publicKey)return null; } catch {return null;}
 return {publicKey,privateKey,subject};
}
export function cronAuthorized(request: Request): boolean {
 const secret=process.env.CRON_SECRET ?? "";
 if(secret.length<32) return false;
 const actual=Buffer.from(request.headers.get("authorization") ?? ""),expected=Buffer.from(`Bearer ${secret}`);
 return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export async function sendInvitation(subscription: InvitationSubscription): Promise<void> {
 const config=pushConfiguration();
 if(!config || !subscriptionSchema.safeParse(subscription).success) throw new Error("Transport unavailable");
 // web-push uses HTTPS directly and does not follow redirects. Only reviewed provider hosts pass validation.
 await webpush.sendNotification(subscription,JSON.stringify(INVITATION_PAYLOAD),{vapidDetails:config,TTL:60*60*24,urgency:"low",topic:"vidya-family-weekly",timeout:5000});
}
export async function dispatchInvitations(now=new Date(),transport=sendInvitation) {
 const counts={sent:0,failed:0,expired:0,cancelled:0};
 const stopAt=Date.now()+45000;
 for(const candidate of await deliveryCandidates()) {
  if(Date.now()>stopAt)break;
  if(!preferenceSchema.safeParse(candidate.preferences).success || !subscriptionSchema.safeParse(candidate.subscription).success) continue;
  const date=invitationDueKey(candidate.preferences,now);
  if(!date || !await claimInvitation(candidate,date)) continue;
  let status: keyof typeof counts="cancelled";
  if(await invitationStillEnabled(candidate.id,candidate.parentId)) {
   try { await transport(candidate.subscription); status="sent"; }
   catch(error) { const code=(error as {statusCode?:number})?.statusCode; status=code===404||code===410 ? "expired" : "failed"; }
  }
  await finishInvitation(candidate.id,date,status); counts[status]++;
 }
 return counts;
}
