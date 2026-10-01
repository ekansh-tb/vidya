import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { accountLinkBody, accountLinkGuard, accountLinkRateLimit, accountLinkResponse as reply } from "@/lib/auth/account-link-http";
import { approveAccountLink, inspectAccountLink, revokeAccountLink, parentAccountLinkStatus } from "@/lib/db/account-links";
import { isSameOrigin } from "@/lib/api/guard";
import { dbConfigured } from "@/lib/db/client";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const token = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("inspect"), token }).strict(),
  z.object({ action: z.literal("approve"), token, expectedClerkUserId: z.string().min(1).max(256) }).strict(),
]);

export async function GET(req: Request, ctx: Context) {
  if (!isSameOrigin(req)) return reply({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return reply({ error: "Storage unavailable" }, 503);
  try {
    const parent = await requireParent();
    if (!parent) return reply({ error: "Unauthorized" }, 401);
    const id = z.uuid().safeParse((await ctx.params).id);
    if (!id.success) return reply({ error: "Not found" }, 404);
    const status = await parentAccountLinkStatus(parent.userId, id.data);
    return status ? reply({ parentId: parent.userId, ...status }) : reply({ error: "Not found" }, 404);
  } catch { return reply({ error: "Account link status unavailable" }, 503); }
}

async function authorize(req: Request) {
  const guard = accountLinkGuard(req);
  if (guard) return guard;
  const parent = await requireParent();
  if (!parent) return reply({ error: "Unauthorized" }, 401);
  const challenge = await requireRecentParentReverification();
  if (challenge) return challenge;
  return await accountLinkRateLimit(parent.userId) ?? parent;
}

export async function POST(req: Request, ctx: Context) {
  const parent = await authorize(req);
  if (parent instanceof Response) return parent;
  const id = z.uuid().safeParse((await ctx.params).id);
  if (!id.success) return reply({ error: "Bad request" }, 400);
  let body: z.infer<typeof schema>;
  try { body = schema.parse(await accountLinkBody(req)); }
  catch { return reply({ error: "Bad request" }, 400); }
  try {
    if (body.action === "inspect") {
      const candidate = await inspectAccountLink(parent.userId, id.data, body.token);
      return candidate ? reply(candidate) : reply({ error: "Not found" }, 404);
    }
    const ok = await approveAccountLink(parent.userId, id.data, body.token, body.expectedClerkUserId);
    return ok ? reply({ ok: true }) : reply({ error: "Not found" }, 404);
  } catch { return reply({ error: "Could not link account" }, 503); }
}

export async function DELETE(req: Request, ctx: Context) {
  const parent = await authorize(req);
  if (parent instanceof Response) return parent;
  const id = z.uuid().safeParse((await ctx.params).id);
  if (!id.success) return reply({ error: "Bad request" }, 400);
  try {
    const ok = await revokeAccountLink(parent.userId, id.data);
    return ok ? reply({ ok: true }) : reply({ error: "Not found" }, 404);
  } catch { return reply({ error: "Could not revoke account" }, 503); }
}
