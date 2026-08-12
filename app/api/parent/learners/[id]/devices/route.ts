import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { listDevicesForParent, revokeDeviceForParent } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

const RATE = { limit: 60, windowMs: 10 * 60 * 1000 };

/**
 * The devices a learner is linked on, and the parent's control to cut one off.
 *
 * This is the unlink path that did not exist. Redeeming a claim code used to be
 * irreversible: nothing in the app or the database could undo a link, so a
 * mis-typed code on the wrong child's profile was permanent. A parent who can
 * grant access has to be able to withdraw it.
 *
 * Ownership is enforced inside both queries, scoped by parent_id, and a miss
 * answers 404 rather than 403 — we never confirm another family's learner id.
 * No token or hash is ever returned here: revoking a device does not require
 * seeing its credential, so the response carries only a label and timestamps.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const devices = await listDevicesForParent(parent.userId, id);
    if (!devices) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ devices });
  } catch (e) {
    console.error("[api/parent/learners/:id/devices] list failed:", e);
    return Response.json({ error: "Could not read devices" }, { status: 500 });
  }
}

const revokeSchema = z.object({
  /** A device id, or "all" to unlink everything for this learner. */
  deviceId: z.union([z.literal("all"), z.uuid()]),
});

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`devices:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const parsed = revokeSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  const { id } = await ctx.params;
  try {
    const result = await revokeDeviceForParent(parent.userId, id, parsed.data.deviceId);
    if (!result) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, revoked: result.revoked });
  } catch (e) {
    console.error("[api/parent/learners/:id/devices] revoke failed:", e);
    return Response.json({ error: "Could not unlink" }, { status: 500 });
  }
}
