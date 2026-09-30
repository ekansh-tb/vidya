// Validation and same-origin guards for API routes.
// Shared fixed-window request limits use PostgreSQL atomically across workers.
// Missing or failed storage denies requests; callers must return a safe 503
// when verdict.unavailable is true. There is no in-memory fallback.
// Proxy IP keys still require a trusted ingress. This is not authentication.

import { z } from "zod";
import { consumeRequestLimit, type RequestLimitOptions, type RequestLimitVerdict } from "@/lib/db/request-limits";

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

/** The tutor client sends text only. SDK assistant stream bookkeeping is
 * accepted for round trips, then discarded before model conversion. */
const uiTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(LIMITS.maxCharsPerMessage),
  state: z.enum(["streaming", "done"]).optional(),
  providerMetadata: z.unknown().optional(),
}).strict().transform(({ type, text }) => ({ type, text }));
const uiPartSchema = z.union([
  uiTextPartSchema,
  z.object({ type: z.literal("step-start") }).strict(),
]);

const uiMessageSchema = z.object({
  id: z.string().max(128).optional(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(uiPartSchema).min(1).max(64).optional(),
  content: z.string().max(LIMITS.maxCharsPerMessage).optional(),
  metadata: z.unknown().optional(),
}).strict().refine((message) => (
  (message.parts !== undefined) !== (message.content !== undefined)
  && (message.role === "assistant" || message.parts?.every((part) => part.type === "text") !== false)
), { message: "Expected a text conversation message" }).transform(({ id, role, parts, content }) => ({
  ...(id === undefined ? {} : { id }),
  role,
  parts: parts
    ? parts.filter((part): part is { type: "text"; text: string } => part.type === "text")
    : [{ type: "text" as const, text: content! }],
}));

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
export function totalChars(messages: ReadonlyArray<{
  role: string;
  content?: string;
  parts?: ReadonlyArray<{ type: string; text?: string }>;
}>): number {
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

/** Best-effort client key. `x-forwarded-for` is set by Vercel's proxy; its
 *  first entry is the real client. Spoofable in principle, which is another
 *  reason this is best-effort. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : req.headers.get("x-real-ip") ?? "unknown";
  return ip || "unknown";
}

export type RateVerdict = RequestLimitVerdict;

/**
 * Shared-store failures are distinguishable from quota exhaustion, never thrown.
 * Every caller must await this and handle unavailable with a private no-store
 * 503 + Retry-After before checking ok (quota exhaustion remains 429).
 *
 * Release wiring owned by the identity worker:
 * - lib/auth/account-link-http.ts: make accountLinkRateLimit async, await this,
 *   distinguish unavailable (503) from exhausted (429), preserve rate headers.
 * - Await that helper in account/parent-enrollment, account/learner-link and
 *   parent/learners/[id]/account-link routes and update their rate-limit mocks.
 * - __resetRateLimiter is a compatibility no-op; tests must mock shared storage.
 * No identity-owned files are modified by this implementation.
 */
export async function rateLimit(key: string, options: RequestLimitOptions): Promise<RateVerdict> {
  try {
    return await consumeRequestLimit(key, options);
  } catch {
    // Do not log errors: driver diagnostics can contain private connection data.
    return { ok: false, unavailable: true, remaining: 0, resetAt: Date.now() + 5000, retryAfterSeconds: 5 };
  }
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

/** Compatibility seam for existing callers' tests. Shared counters have no local reset. */
export function __resetRateLimiter() {}
