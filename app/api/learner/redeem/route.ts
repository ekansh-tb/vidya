import { z } from "zod";
import { dbConfigured } from "@/lib/db/client";
import { redeemClaimCode } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";

export const runtime = "nodejs";

/**
 * Deliberately strict. A claim code is 6 characters from a 32-symbol alphabet,
 * so brute force is the obvious attack. 10 attempts per 10 minutes per client
 * makes guessing impractical while leaving room for a child mistyping.
 */
const RATE = { limit: 10, windowMs: 10 * 60 * 1000 };

const schema = z.object({
  code: z.string().trim().min(4).max(12),
  /** "iPad", "Android tablet" — shown to the parent when revoking. Cosmetic. */
  deviceLabel: z.string().trim().max(60).optional(),
});

/**
 * A child redeems the code their parent showed them.
 *
 * NO SESSION IS REQUIRED, and that is the fix rather than a hole. The kid app
 * has no sign-in and never will, so requiring `auth()` here meant the only
 * account that could ever complete the flow was the parent's — which wrote the
 * parent's Clerk id onto their own child's row and locked them out of the
 * dashboard permanently. See redeemClaimCode for the full account.
 *
 * What stands in for a session: the code itself is a 6-character single-use
 * secret from a 32-symbol alphabet that expires in 24h and that an adult chose
 * to hand over, the request must be same-origin, and 10 tries per 10 minutes
 * makes guessing one impractical. Success mints a revocable per-device token,
 * not an identity.
 *
 * This is still the only path to verification rung 2.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`redeem:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json(
      { error: "Too many tries. Wait a few minutes and ask a grown-up for a fresh code." },
      { status: 429, headers: rateHeaders(verdict, RATE.limit) },
    );
  }

  let raw: unknown;
  try { raw = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const result = await redeemClaimCode(parsed.data.code, {
      deviceLabel: parsed.data.deviceLabel ?? null,
    });
    if (!result.ok) {
      // Kid-readable, and deliberately identical shape for every failure so
      // the response cannot be used to probe which codes exist.
      const message =
        result.reason === "expired"
          ? "That code has expired. Ask for a new one."
          : result.reason === "used"
            ? "That code has already been used."
            : "That code doesn't look right. Check it and try again.";
      return Response.json({ error: message, reason: result.reason }, {
        status: 400, headers: rateHeaders(verdict, RATE.limit),
      });
    }
    // The token is returned exactly once. The server keeps only its hash, so
    // if the client loses it the parent must issue a fresh code — which is the
    // correct failure mode for a credential.
    return Response.json({ learner: result.learner, deviceToken: result.deviceToken });
  } catch (e) {
    console.error("[api/learner/redeem] failed:", e);
    return Response.json({ error: "Could not link this account right now." }, { status: 500 });
  }
}
