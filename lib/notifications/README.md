# Optional family invitations

Implemented as parent-owned opt-in preferences, reviewed browser push subscriptions and bounded operational delivery outcomes. No learner activity, name, reflection, free-text response or AI transcript is used. All defaults are off. The in-app invitation is optional and has no access/reward consequence.

Apply additive migration `0016_family_notifications.sql` before mounting Controls. Existing parents have no preference row and therefore remain opted out. No backfill or actual notification send is part of validation.

## Production configuration remains closed

Transport requires all of:
- `VIDYA_WEB_PUSH_ENABLED=true`
- `VIDYA_VAPID_PUBLIC_KEY` (base64url uncompressed P-256 public key)
- `VIDYA_VAPID_PRIVATE_KEY` (base64url P-256 private key)
- `VIDYA_VAPID_SUBJECT` (valid public HTTPS contact URL or mailto contact; no localhost)
- `CRON_SECRET` (at least32 characters, random; authenticated Bearer)

Generate VAPID keys with the installed official `web-push` library, store keys only in protected server configuration, and configure the public key consistently across production deployments. Never paste private keys into client code or a ticket. Rotation needs intentional resubscription; do not silently invalidate existing browser consent.

`vercel.json` schedules one daily production invocation at01:00UTC. Hobby cron runs within its hourly execution window. The preferred weekday/time/timezone is a scheduling preference, not an alarm. A local two-calendar-day catch-up window accommodates the daily schedule and DST. Offline devices, revoked permissions, failures, platform limits and a bounded dispatch budget can prevent delivery. No delivery or relationship benefit is guaranteed.

At most500 candidate subscriptions are considered per run and network work stops after45seconds (individual transport timeout5seconds). Operational capacity should be reviewed before opening larger usage; this feature does not require a paid Vercel upgrade. The same scheduled subscription/date is claimed once atomically. Reload, concurrent cron calls and retries do not send that event again. A crash after claiming can miss an invitation; avoiding duplicate/flooding reminders takes precedence over retrying ambiguous delivery. Delivery-provider acceptance is stored as `sent`, not proof the parent saw it. Errors are stored only as `failed`, `expired` or `cancelled`, without endpoint/provider body/payload logging.404/410 retire the subscription. Opt-out retires all this parent's subscriptions, including a later re-enable requiring an intentional browser action. A notification already in flight can still arrive.

Endpoints are HTTPS only with reviewed provider hosts: GoogleFCM, MozillaAutopush, ApplePush, WindowsNotifications. No IP, credentials, nondefault port, query, fragment, arbitrary domain or redirect following is supported. An unrecognized browser endpoint fails with an honest unsupported message; it never becomes an arbitrary server URL. Subscription encryption keys are private server data. A five-browser limit is enforced under database parent locks; subscriptions are never transferred between families.

## Browser integration

`WeeklyInvitations` goes in parentControls; `WeeklyFamilyInvitation` goes in Overview. Permission is requested only after the Enable button. Save preferences first. iOS/iPadOS16.4+ requires an installed HomeScreen webapp; browser/user permission capability is checked. Unsupported installation and unavailable transport have visible messages. Existing ParentInstallationGuide remains relevant.

Root integrates public `sw.js` handlers. Push notification uses fixed generic text (ignore untrusted dynamic payload):

```js
self.addEventListener('push',event=>event.waitUntil(self.registration.showNotification('A little time together',{
 body:'Choose a story, make something, or explore together. Your weekly Vidya invitation is optional.',
 tag:'vidya-family-invitation', data:{url:'/parent'}
})));
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const target=new URL('/parent',self.location.origin).href;
  const windows=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of windows){if(client.url===target){await client.focus();return;}}
  await clients.openWindow(target);
 })());
});
```

Worker must retain existing private-cache exclusions; parent/admin/auth and private APIs never enter caches. No notification permission auto-prompt, hidden messages or child payload is permitted.

## Evidence and references

- Vercel daily Hobby precision/usage: https://vercel.com/docs/cron-jobs/usage-and-pricing
- Cron bearer secret: https://vercel.com/docs/cron-jobs/manage-cron-jobs
- Official transport: https://github.com/web-push-libs/web-push
- Apple HomeScreen support/allowlist: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers
- Mozilla endpoints: https://mozilla-services.github.io/autopush-rs/http.html
- Microsoft service host suffix: https://learn.microsoft.com/en-us/windows/apps/develop/notifications/push-notifications/wns-overview

Synthetic mocked transport and isolated database tests validate boundaries; no real family received a notification. Browser/device real delivery is a separate acceptance step after deliberate configuration and synthetic opt-in.
