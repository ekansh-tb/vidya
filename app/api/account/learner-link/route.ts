import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { clerkConfigured } from "@/lib/auth/clerk-config";
import { accountLinkBody, accountLinkGuard, accountLinkRateLimit, accountLinkResponse as reply } from "@/lib/auth/account-link-http";
import { requestAccountLink, learnerAccountLinkStatus } from "@/lib/db/account-links";
import { isSameOrigin } from "@/lib/api/guard";
import { dbConfigured } from "@/lib/db/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isSameOrigin(req)) return reply({ error: "Forbidden" }, 403);
  if (!clerkConfigured || !dbConfigured()) return reply({ error: "Account status unavailable" }, 503);
  try {
    const { userId } = await auth();
    if (!userId) return reply({ error: "Unauthorized" }, 401);
    return reply({ accountId: userId, ...await learnerAccountLinkStatus(userId) });
  } catch { return reply({ error: "Account status unavailable" }, 503); }
}

/** Requests pairing only. No learner data or authority is granted here. */
export async function POST(req: Request) {
  const guard = accountLinkGuard(req);
  if (guard) return guard;
  if (!clerkConfigured) return reply({ error: "Authentication unavailable" }, 503);
  const { userId } = await auth();
  if (!userId) return reply({ error: "Unauthorized" }, 401);
  const limited = await accountLinkRateLimit(userId);
  if (limited) return limited;
  try {
    z.object({ learnerAccountAcknowledgement: z.literal(true) }).strict().parse(await accountLinkBody(req));
  } catch { return reply({ error: "Bad request" }, 400); }
  try {
    const request = await requestAccountLink(userId);
    return request ? reply({ accountId: userId, ...request }, 201) : reply({ error: "Account cannot request a learner link" }, 409);
  } catch { return reply({ error: "Could not request link" }, 503); }
}
