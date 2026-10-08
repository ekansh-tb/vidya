import { z } from "zod";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { rateHeaders, rateLimit } from "@/lib/api/guard";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { dbConfigured } from "@/lib/db/client";
import { getLearnerForParent } from "@/lib/db/queries";
import { appendParentGuidance, guidanceWriteSchema, guidanceHistoryOptionsSchema, listParentGuidance } from "@/lib/db/parent-guidance";

export const runtime = "nodejs";
const RATE = { limit: 30, windowMs: 10 * 60 * 1000 };
const READ_RATE = { limit: 60, windowMs: 10 * 60 * 1000 };
type Context = { params: Promise<{ id: string }> };
function json(body: unknown, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { ...headers, "cache-control": "private, no-store" } });
}
function isSameOrigin(req: Request): boolean {
  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!source) return false;
  try { return new URL(source).origin === new URL(req.url).origin; } catch { return false; }
}
async function resolve(req: Request, ctx: Context, limitRead = false) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);
  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);
  if (limitRead) {
    // One authenticated-parent bucket across learners and history pages.
    // Separate from writes so browsing cannot consume the withdrawal quota.
    try {
      const verdict = await rateLimit(`parent-guidance-read:${parent.userId}`, READ_RATE);
      if (verdict.unavailable) return json({ error: "Service temporarily unavailable" }, 503, rateHeaders(verdict, READ_RATE.limit));
      if (!verdict.ok) return json({ error: "Too many requests" }, 429, rateHeaders(verdict, READ_RATE.limit));
    } catch {
      return json({ error: "Service temporarily unavailable" }, 503, { "retry-after": "5" });
    }
  }
  const id = z.uuid().safeParse((await ctx.params).id);
  if (!id.success) return json({ error: "Not found" }, 404);
  const learner = await getLearnerForParent(parent.userId, id.data);
  if (!learner) return json({ error: "Not found" }, 404);
  return { parentId: parent.userId, learnerId: learner.id };
}
export async function GET(req: Request, ctx: Context) {
  try {
    const owner = await resolve(req, ctx, true);
    if (owner instanceof Response) return owner;
    const params = new URL(req.url).searchParams;
    if ([...params.keys()].some((key) => !["cursor", "limit"].includes(key)) ||
        params.getAll("cursor").length > 1 || params.getAll("limit").length > 1 ||
        (params.has("limit") && !/^[1-9]\d?$/.test(params.get("limit")!))) {
      return json({ error: "Invalid history pagination" }, 400);
    }
    const options = guidanceHistoryOptionsSchema.safeParse({
      cursor: params.get("cursor") ?? undefined,
      limit: params.has("limit") ? Number(params.get("limit")) : undefined,
    });
    if (!options.success) return json({ error: "Invalid history pagination" }, 400);
    return json(await listParentGuidance(owner.parentId, owner.learnerId, options.data));
  } catch {
    return json({ error: "Could not load guidance" }, 500);
  }
}
/** PUT always creates a new version, including withdrawal. No destructive DELETE. */
export async function PUT(req: Request, ctx: Context) {
  try {
    const owner = await resolve(req, ctx);
    if (owner instanceof Response) return owner;
    const verdict = await rateLimit(`parent-guidance:${owner.parentId}`, RATE);
    if (verdict.unavailable) {
      return Response.json({ error: "Service temporarily unavailable" }, {
        status: 503, headers: { "cache-control": "private, no-store", "retry-after": String(verdict.retryAfterSeconds) },
      });
    }
    if (!verdict.ok) return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
    const reverify = await requireRecentParentReverification();
    if (reverify) {
      reverify.headers.set("cache-control", "private, no-store");
      return reverify;
    }
    const body = await readBoundedJson(req, 16 * 1024);
    if (!body.ok) return json({ error: "Bad request" }, body.reason === "too_large" ? 413 : 400);
    const input = guidanceWriteSchema.safeParse(body.value);
    if (!input.success) return json({ error: "Bad request" }, 400);
    const saved = await appendParentGuidance(owner.parentId, owner.learnerId, input.data);
    if (!saved) return json({ error: "Guidance changed. Reload before saving." }, 409);
    return json({ saved: true });
  } catch {
    return json({ error: "Could not save guidance" }, 500);
  }
}
