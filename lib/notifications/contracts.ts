import { z } from "zod";
export const preferenceSchema = z.object({ enabled: z.boolean(), weekday: z.number().int().min(0).max(6), time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/), timezone: z.string().min(1).max(80).refine(value => { try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; } }) }).strict();
export type InvitationPreferences = z.infer<typeof preferenceSchema>;
export const DEFAULT_INVITATION_PREFERENCES: InvitationPreferences = { enabled: true, weekday: 0, time: "10:00", timezone: "Asia/Kolkata" };
const exactHosts = new Set(["fcm.googleapis.com", "updates.push.services.mozilla.com", "updates-push.services.mozaws.net"]);
export function allowedPushEndpoint(value: string): boolean {
  try { const url = new URL(value); const host = url.hostname.toLowerCase(); return url.protocol === "https:" && !url.username && !url.password && !url.hash && !url.search && (!url.port || url.port === "443") && url.pathname.length > 1 && (exactHosts.has(host) || /^(?:[a-z0-9-]+\.)+push\.apple\.com$/.test(host) || /^(?:[a-z0-9-]+\.)+notify\.windows\.com$/.test(host)); } catch { return false; }
}
export const subscriptionSchema = z.object({ endpoint: z.string().max(2048).refine(allowedPushEndpoint), keys: z.object({ p256dh: z.string().regex(/^[A-Za-z0-9_-]{87}$/), auth: z.string().regex(/^[A-Za-z0-9_-]{22}$/) }).strict() }).strict();
export type InvitationSubscription = z.infer<typeof subscriptionSchema>;
/** Calendar-day key in the chosen timezone. Daily cron allows a bounded two-day catch-up. */
export function invitationDueKey(preferences: InvitationPreferences, now: Date): string | null {
  if (!preferences.enabled) return null;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: preferences.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const value = (key: string) => parts.find(part => part.type === key)!.value;
  const localDate = new Date(`${value("year")}-${value("month")}-${value("day")}T00:00:00Z`);
  let delta = (localDate.getUTCDay() - preferences.weekday + 7) % 7;
  const localTime = `${value("hour")}:${value("minute")}`;
  if (delta === 0 && localTime < preferences.time) delta = 7;
  // Up to two local dates accommodates the daily job's execution window and DST.
  if (delta > 1 && !(delta === 2 && localTime < preferences.time)) return null;
  localDate.setUTCDate(localDate.getUTCDate() - delta);
  return localDate.toISOString().slice(0, 10);
}
export const INVITATION_PAYLOAD = { type: "family-invitation", title: "A little time together", body: "Choose a story, make something, or explore together. Your weekly Vidya invitation is optional.", url: "/parent", tag: "vidya-family-invitation" } as const;
