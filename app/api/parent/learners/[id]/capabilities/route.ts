import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { setDisabledCapabilities } from "@/lib/db/queries";
import { CAPABILITY_POLICIES } from "@/lib/capabilities/policies";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

const RATE = { limit: 60, windowMs: 10 * 60 * 1000 };

const schema = z.object({
  /** The FULL list of switched-off keys, not a delta — see setDisabledCapabilities. */
  disabled: z.array(z.string().max(64)).max(64),
});

/**
 * Persists the parent's per-learner capability switches.
 *
 * Until this route existed the toggles on the capability map wrote only to
 * localStorage, so turning Miss Vidya off for one child removed a button from
 * their lobby while `/api/tutor` stayed exactly as reachable. The parent was
 * shown a control that looked like a boundary and was not one.
 *
 * Unknown keys are dropped rather than rejected: the client's capability union
 * moves ahead of the server on deploys, and failing the whole write because
 * one key is newer would silently strand a parent's decision on the other
 * keys. What was dropped is reported back so the caller is not lied to.
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`caps:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  const known = new Set(Object.keys(CAPABILITY_POLICIES));
  const accepted = [...new Set(parsed.data.disabled.filter((k) => known.has(k)))];
  const dropped = parsed.data.disabled.filter((k) => !known.has(k));

  const { id } = await ctx.params;
  try {
    const updated = await setDisabledCapabilities(parent.userId, id, accepted);
    // Null means "not yours" — 404 so we never confirm another family's id.
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ disabled: updated.disabledCapabilities ?? [], dropped });
  } catch (e) {
    console.error("[api/parent/learners/:id/capabilities] failed:", e);
    return Response.json({ error: "Could not save that" }, { status: 500 });
  }
}
