import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { isSameOrigin, clientKey, rateHeaders, rateLimit } from "@/lib/api/guard";
import { dbConfigured } from "@/lib/db/client";
import { deleteAiConnectionForParent } from "@/lib/db/ai-connections";

export const runtime = "nodejs";

const DELETE_RATE = { limit: 20, windowMs: 10 * 60 * 1000 };
const paramsSchema = z.object({ id: z.uuid() });
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-connection-delete:${parent.userId}:${clientKey(req)}`,
    DELETE_RATE,
  );
  if (!verdict.ok) {
    return json(
      { error: "Too many requests" },
      429,
      rateHeaders(verdict, DELETE_RATE.limit),
    );
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const parsed = paramsSchema.safeParse(await ctx.params);
  if (!parsed.success) return json({ error: "Not found" }, 404);

  try {
    const deleted = await deleteAiConnectionForParent(
      parent.userId,
      parsed.data.id,
      parent.userId,
    );
    if (!deleted) return json({ error: "Not found" }, 404);
    return json({ deleted: true }, 200);
  } catch {
    console.error("[api/parent/ai-connections/:id] delete failed");
    return json({ error: "Could not delete AI connection" }, 500);
  }
}
