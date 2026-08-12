// Request guards for the public AI routes.
//
// WHY THIS EXISTS
// ---------------
// `/api/tutor` and `/api/assembly` forward requests to a paid model on the
// project's credentials. The kid app is deliberately anonymous — there is no
// kid sign-in — so we CANNOT require a session without breaking the product.
// That leaves these routes reachable by anyone who knows the URL.
//
// The client-side `useCapability("ai.tutor.full")` gate is a UX affordance,
// not a security boundary: calling the endpoint directly bypasses it entirely.
//
// WHAT THIS DOES
//   1. Same-origin enforcement — real CSRF protection, and a speed bump for
//      direct callers. Be precise about which: a BROWSER cannot forge Origin,
//      so a malicious page cannot make a victim's browser act on their session
//      here. A non-browser caller sets both Origin and Host itself and sails
//      straight through, so this is not authentication and never was. What
//      actually bounds direct abuse is the body caps and the model spend cap.
//   2. Body validation + hard caps — bounds how much text one call can push
//      into the model, so a single request cannot be an expensive one.
//   3. Best-effort rate limiting per client.
//
// WHAT THIS DOES NOT DO — read before trusting it
//   The rate limiter is IN-MEMORY and therefore PER-INSTANCE. Vercel's Fluid
//   Compute reuses instances, so it does meaningfully throttle a single
//   attacker, but it is not authoritative: concurrent instances each keep
//   their own counters and all counters reset on deploy. It raises the cost of
//   abuse; it does not make it impossible.
//
//   For a real limit, back it with a shared store (Upstash Redis via the Vercel
//   Marketplace) and put Vercel BotID / Vercel Firewall in front. Until then,
//   keep a spend cap on the model provider account — that is the actual
//   backstop. See the `vidya-ai-endpoints-unprotected` project memory.

import { z } from "zod";

// ---------------------------------------------------------------- caps

export const LIMITS = {
  /** Max messages accepted in one tutor turn (the whole visible history). */
  maxMessages: 40,
  /** Max characters in any single message. */
  maxCharsPerMessage: 4_000,
  /** Max characters across the whole conversation sent in one request. */
  maxCharsTotal: 24_000,
  /** Max characters for a free-text field threaded into the system prompt. */
  maxPromptFieldChars: 600,
} as const;

// ---------------------------------------------------------------- schemas

/** One part of a UIMessage. Permissive about `type` — the AI SDK adds new
 *  part kinds over time — but hard-capped on text length. */
const uiPartSchema = z
  .object({
    type: z.string().max(64),
    text: z.string().max(LIMITS.maxCharsPerMessage).optional(),
  })
  .loose();

const uiMessageSchema = z
  .object({
    id: z.string().max(128).optional(),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(uiPartSchema).max(64).optional(),
    content: z.string().max(LIMITS.maxCharsPerMessage).optional(),
  })
  .loose();

const boardSchema = z.enum([
  "cambridge-primary",
  "cambridge-lower-secondary",
  "cambridge-igcse",
  "icse",
  "cbse",
]);

/** Free-text fields are clamped rather than rejected — a learner typing a long
 *  care note should not get a hard error, their prompt just gets trimmed. */
const promptField = z.string().max(LIMITS.maxPromptFieldChars).optional();

export const tutorRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(LIMITS.maxMessages),
  subject: z.string().max(64).optional(),
  topic: z.string().max(200).optional(),
  name: z.string().max(80).optional(),
  grade: z.number().int().min(1).max(13).optional(),
  board: boardSchema.optional(),
  school: z.string().max(160).optional(),
  interests: z.array(z.string().max(40)).max(20).optional(),
  careNote: promptField,
  aiTone: z.enum(["gentle", "friendly", "direct"]).optional(),
});

export const assemblyRequestSchema = z.object({
  name: z.string().max(80).optional(),
  streak: z.number().int().min(0).max(100_000).optional(),
  level: z.number().int().min(0).max(1_000).optional(),
  grade: z.number().int().min(1).max(13).optional(),
  board: boardSchema.optional(),
  school: z.string().max(160).optional(),
});

export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type AssemblyRequest = z.infer<typeof assemblyRequestSchema>;

/** Total characters a request would push at the model. */
export function totalChars(messages: TutorRequest["messages"]): number {
  let n = 0;
  for (const m of messages) {
    if (typeof m.content === "string") n += m.content.length;
    for (const p of m.parts ?? []) {
      if (typeof p.text === "string") n += p.text.length;
    }
  }
  return n;
}

// ---------------------------------------------------------------- origin

/**
 * Same-origin check. In production we require the request to declare an origin
 * matching the deployment host. Requests with no Origin AND no Referer are
 * rejected in production — browsers always send one for a cross-origin fetch,
 * so the empty case is a non-browser caller. Suppressing both fails CLOSED.
 *
 * The comparison is Origin-vs-Host, which is the correct shape for CSRF: a
 * page cannot set either header on a cross-site request, so it cannot make a
 * victim's browser act on their Clerk session. It is NOT a defence against a
 * direct caller, who supplies both headers and matches trivially. Do not add
 * an endpoint whose only guard is this one and call it protected.
 *
 * Skipped entirely in development so `curl` and tests keep working.
 */
export function isSameOrigin(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const host = req.headers.get("host");
  if (!host) return false;

  const candidate = req.headers.get("origin") ?? req.headers.get("referer");
  if (!candidate) return false;

  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- rate limit

type Bucket = { count: number; resetAt: number };

/** Per-instance counters. See the caveat at the top of this file. */
const buckets = new Map<string, Bucket>();
/** Hard ceiling on tracked clients so a spray of unique IPs cannot grow this
 *  map without bound. Oldest-resetting entries are evicted first. */
const MAX_TRACKED = 5_000;

function evictIfNeeded(now: number) {
  if (buckets.size < MAX_TRACKED) return;
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
  if (buckets.size < MAX_TRACKED) return;
  // Still full: drop the entries closest to resetting.
  const sorted = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
  for (let i = 0; i < Math.ceil(sorted.length * 0.2); i++) buckets.delete(sorted[i][0]);
}

/** Best-effort client key. `x-forwarded-for` is set by Vercel's proxy; its
 *  first entry is the real client. Spoofable in principle, which is another
 *  reason this is best-effort. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : req.headers.get("x-real-ip") ?? "unknown";
  return ip || "unknown";
}

export type RateVerdict = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window limiter.
 *
 * Defaults mirror the `ai.tutor.limited` capability policy (20/day, burst 5) in
 * spirit but operate on a short window, because an in-memory counter cannot
 * honour a daily budget across deploys. When a shared store lands, move the
 * budget here and read it from CAPABILITY_POLICIES instead of hardcoding.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateVerdict {
  const now = Date.now();
  evictIfNeeded(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const ok = existing.count <= limit;
  return {
    ok,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: ok ? 0 : Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

/** Standard headers so the client can back off politely. */
export function rateHeaders(v: RateVerdict, limit: number): Record<string, string> {
  const h: Record<string, string> = {
    "x-ratelimit-limit": String(limit),
    "x-ratelimit-remaining": String(v.remaining),
    "x-ratelimit-reset": String(Math.ceil(v.resetAt / 1000)),
  };
  if (!v.ok) h["retry-after"] = String(v.retryAfterSeconds);
  return h;
}

/** Test seam — lets unit tests start from a clean limiter. */
export function __resetRateLimiter() {
  buckets.clear();
}
