import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { clerkConfigured } from "@/lib/auth/clerk-config";
import { roleFromMetadata } from "@/lib/auth/session";
import { requireRecentAccountReverification } from "@/lib/auth/reverification";
import { PARENT_ACKNOWLEDGEMENT_VERSION } from "@/lib/auth/parent-enrollment-contract";
import { accountLinkBody, accountLinkGuard, accountLinkRateLimit, accountLinkResponse as reply } from "@/lib/auth/account-link-http";
import { enrollParent } from "@/lib/db/parent-enrollment";

export const runtime = "nodejs";
const schema = z.object({
  adultGuardianAttestation: z.literal(true),
  acknowledgementVersion: z.literal(PARENT_ACKNOWLEDGEMENT_VERSION),
}).strict();

export async function POST(req: Request) {
  const guard = accountLinkGuard(req);
  if (guard) return guard;
  if (!clerkConfigured) return reply({ error: "Authentication unavailable" }, 503);
  try {
    const { userId, sessionId } = await auth();
    if (!userId || !sessionId) return reply({ error: "Sign in to continue" }, 401);
    const limited = await accountLinkRateLimit(userId);
    if (limited) return limited;
    try { schema.parse(await accountLinkBody(req)); }
    catch { return reply({ error: "Confirm the current adult parent or guardian acknowledgement", code: "acknowledgement_required" }, 400); }

    const user = await currentUser();
    if (!user || user.id !== userId) return reply({ error: "Sign in to continue" }, 401);
    // Metadata can deny access, but can never establish authority.
    if (roleFromMetadata(user.publicMetadata) === "learner") {
      return reply({ error: "A learner account cannot enroll as a parent. Use a separate adult account.", code: "learner_account" }, 409);
    }
    const email = user.primaryEmailAddress;
    if (!email?.id || !email.emailAddress || email.verification?.status !== "verified") {
      return reply({ error: "Verify your primary email in account settings, then try again", code: "verified_email_required" }, 403);
    }
    const challenge = await requireRecentAccountReverification();
    if (challenge) return challenge;
    // Classification is rechecked inside the same transaction as enrollment.
    // A preflight read here cannot protect against a concurrent learner request.
    const ok = await enrollParent({ userId, sessionId, email: email.emailAddress, emailId: email.id, displayName: user.firstName });
    return ok
      ? reply({ ok: true, acknowledgementVersion: PARENT_ACKNOWLEDGEMENT_VERSION })
      : reply({ error: "A learner account cannot enroll as a parent. Use a separate adult account.", code: "learner_account" }, 409);
  } catch { return reply({ error: "Could not complete parent enrollment. Please try again." }, 503); }
}
