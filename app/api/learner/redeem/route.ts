import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/auth/clerk-config";
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

const schema = z.object({ code: z.string().trim().min(4).max(12) });

/**
 * A signed-in child redeems the code their parent showed them.
 *
 * This links their Clerk account to the learner row and promotes them to
 * verification rung 2 — the only path to it. Replaces the old client-side rule
 * where any 4-digit PIN in localStorage granted rung 2 to whoever typed it.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!clerkConfigured) return Response.json({ error: "Sign-in unavailable" }, { status: 503 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`redeem:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json(
      { error: "Too many tries. Wait a few minutes and ask a grown-up for a fresh code." },
      { status: 429, headers: rateHeaders(verdict, RATE.limit) },
    );
  }

  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Sign in first" }, { status: 401 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const result = await redeemClaimCode(parsed.data.code, userId);
    if (!result.ok) {
      // Kid-readable, and deliberately identical shape for every failure so
      // the response cannot be used to probe which codes exist.
      const message =
        result.reason === "expired"
          ? "That code has expired. Ask for a new one."
          : result.reason === "used"
            ? "That code has already been used."
            : result.reason === "already_linked"
              ? "That code belongs to a different account."
              : "That code doesn't look right. Check it and try again.";
      return Response.json({ error: message, reason: result.reason }, {
        status: 400, headers: rateHeaders(verdict, RATE.limit),
      });
    }
    return Response.json({ learner: result.learner });
  } catch (e) {
    console.error("[api/learner/redeem] failed:", e);
    return Response.json({ error: "Could not link this account right now." }, { status: 500 });
  }
}
