import { z } from "zod";

export const LEARNER_ACCOUNT_DISCLOSURE = "Linking lets the parent or guardian who approves your account see your synced learning progress and safety reports, manage your AI tutor and teaching guidance, and link or revoke devices. Reflections marked private have their text excluded from parent reports. This is not a promise that everything on a shared device is private. Linking this sign-in account is separate from linking a device.";
export const LEARNER_ACCOUNT_ACKNOWLEDGEMENT = "I want to use this sign-in as a learner account and ask my parent or guardian to link it. I understand that unlinking does not turn it into a parent account.";
export const pairingTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
export const pairingRequestSchema = z.object({ accountId: z.string(), token: pairingTokenSchema, expiresAt: z.iso.datetime({ offset: true }) });
export const reviewedAccountSchema = z.object({ clerkUserId: z.string().min(1), expiresAt: z.iso.datetime({ offset: true }) });
export const learnerLinkStatusSchema = z.discriminatedUnion("status", [
  z.object({ accountId: z.string(), status: z.enum(["unclassified", "parent", "unlinked", "revoked"]) }),
  z.object({ accountId: z.string(), status: z.enum(["pending", "expired"]), expiresAt: z.iso.datetime({ offset: true }) }),
  z.object({ accountId: z.string(), status: z.literal("linked"), learnerName: z.string(), guardianName: z.string().nullable() }),
]);
export type LearnerLinkStatus = z.infer<typeof learnerLinkStatusSchema>;
export type ReviewedAccount = z.infer<typeof reviewedAccountSchema> & { token: string };

/** An inspection is invalidated by editing the token or passing its expiry. */
export function canApproveAccount(review: ReviewedAccount | null, token: string, confirmed: boolean, now: number): boolean {
  return Boolean(review && confirmed && pairingTokenSchema.safeParse(token).success && review.token === token && Date.parse(review.expiresAt) > now);
}

/** Fixed path, credentials in JSON only. Never accept a caller-supplied URL. */
export async function parentLinkCommand(learnerId: string, input:
  | { action: "inspect"; token: string }
  | { action: "approve"; token: string; expectedClerkUserId: string }
  | { action: "revoke" }, fetcher: typeof fetch = fetch) {
  if (!z.uuid().safeParse(learnerId).success) throw new Error("Invalid learner");
  const revoke = input.action === "revoke";
  const response = await fetcher(`/api/parent/learners/${encodeURIComponent(learnerId)}/account-link`, {
    method: revoke ? "DELETE" : "POST", cache: "no-store",
    headers: { "content-type": "application/json" },
    ...(revoke ? {} : { body: JSON.stringify(input) }),
  });
  const data = await response.json();
  // Preserve Clerk's challenge object for useReverification.
  return { ...data, httpStatus: response.status };
}
