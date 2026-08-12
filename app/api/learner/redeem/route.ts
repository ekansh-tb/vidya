import { z } from "zod";
import { dbConfigured } from "@/lib/db/client";
import { buildDeviceCookie } from "@/lib/auth/session";
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
 * What stands in for a session: the code is a 6-character single-use secret
 * from a 32-symbol alphabet (~1.07 billion combinations) that an adult chose
 * to hand over and that expires in two hours, the request must be same-origin,
 * and 10 tries per 10 minutes makes guessing one impractical. Success mints a
 * revocable per-device token, not an identity.
 *
 * The honest cost of this design: the code is a BEARER credential. Anyone who
 * reads it can redeem it, which is why the TTL is short and the parent-facing
 * copy says to treat it like a door key.
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
      // These messages DO distinguish "expired" from "used" from "unknown",
      // and an older comment here claimed the opposite. Telling a child to ask
      // for a fresh code instead of retyping the same one is worth the small
      // leak: the only thing an attacker learns is that a code they already
      // cannot use once existed. Both states are terminal — neither can be
      // redeemed — so nothing is gained by distinguishing them.
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

    // ONLY these fields. The learner row also carries `parentId` — the
    // parent's Clerk user id — and `disabledCapabilities`, the private list of
    // features that parent switched off. Returning the whole row handed both
    // to an unauthenticated caller who typed a code, and put them in the
    // child's localStorage where any curious kid can read them in devtools.
    // The config leak breaks the parent-invisible-config rule outright: the
    // child is never to be told a grown-up turned something off.
    //
    // The client needs the id (to store as remoteId) and the rung. Nothing else.
    return Response.json(
      {
        learner: {
          id: result.learner.id,
          verificationLevel: result.learner.verificationLevel,
          name: result.learner.name,
        },
        // Returned exactly once. The server keeps only its hash, so if the
        // client loses it the parent must issue a fresh code — the correct
        // failure mode for a credential.
        deviceToken: result.deviceToken,
      },
      {
        headers: {
          // A SECOND copy of the token, httpOnly so script cannot reach it.
          // The localStorage copy is what the app sends day to day; this one
          // exists solely so a child cannot escape their parent's switch-off
          // by deleting their own credential. It only ever removes
          // capabilities — see disabledForLinkedDevices.
          "set-cookie": buildDeviceCookie(req.headers.get("cookie"), result.deviceToken),
        },
      },
    );
  } catch (e) {
    console.error("[api/learner/redeem] failed:", e);
    return Response.json({ error: "Could not link this account right now." }, { status: 500 });
  }
}
