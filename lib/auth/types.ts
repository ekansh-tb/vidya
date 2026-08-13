// Auth + verification + capability types.
//
// Forward declarations for the future durable-DB layer. Today the kid app
// runs on localStorage + Clerk for parent auth — there is no server DB
// yet. These types describe the shape we'll persist when a DB lands;
// they are deliberately kept out of lib/types.ts (which holds the
// LearnerProfile shape used by the offline-first kid app).
//
// See docs/AUTH_ARCHITECTURE.md for the architecture this maps to.

/** Numeric rung on the 4-tier verification ladder. */
export type VerificationLevel = 0 | 1 | 2 | 3;

export const VERIFICATION_LEVEL_LABEL: Record<VerificationLevel, string> = {
  0: "unverified",
  1: "network_verified",
  2: "parent_verified",
  3: "strict_verified",
};

/** Clerk role stored in publicMetadata.role. */
export type ClerkRole = "parent" | "learner";

/**
 * Capability keys. Every kid-facing feature that needs a gate is a key
 * registered here. The actual gate lives in `capability_policies` (DB),
 * not in code — see [[dynamic-guardrails]].
 *
 * Naming convention: `<area>.<feature>[.<variant>]` in dot-case.
 */
export type CapabilityKey =
  // AI tutor
  | "ai.tutor.limited"
  | "ai.tutor.full"
  // Sharing / streaks
  | "share.crossNetwork"
  // Bring-your-own-key AI providers
  | "byok.openai"
  | "byok.anthropic"
  | "byok.google"
  | "byok.grok"
  | "byok.openrouter"
  // Sensitive
  | "incognito.enabled"
  | "health.profile"
  // Notifications
  | "exam.alertsToParent";

/** Per-capability resolution returned by the resolver. */
export type CapabilityResolution = {
  /** True iff this learner can use the capability right now. */
  allowed: boolean;
  /** Why allowed/denied — never shown to a kid directly; for parent UI / logs. */
  reason:
    | "ok"
    | "below_min_rung"
    | "ai_safety_pin_mismatch"
    | "cohort_mismatch"
    | "rate_limited"
    | "feature_disabled";
  /** When the resolution should be re-evaluated. */
  expiresAt?: string;
  /** Optional rate-limit budget for the current window. */
  rateBudget?: { remaining: number; resetAt: string };
};

/**
 * Policy row shape for the planned `capability_policies` table (see the
 * "Data model" section of docs/AUTH_ARCHITECTURE.md — the SQL migration
 * that once held this was removed with Supabase on 2026-05-21).
 *
 * Today these rows are a static in-memory map in lib/capabilities/policies.ts.
 * `rateLimit.perDay` IS now enforced, per learner, in Postgres — see
 * bumpCapabilityUsage and /api/tutor. `rateLimit.burst` is approximated by the
 * in-memory IP limiter in lib/api/guard.ts rather than read from here.
 *
 * `aiSafetyPin` and `cohort` are declared here but NOT yet
 * evaluated by the resolver — see [[dynamic-guardrails]].
 */
export type CapabilityPolicy = {
  key: CapabilityKey;
  minRung: VerificationLevel;
  aiSafetyPin?: string;
  cohort: string;
  rateLimit?: { perDay?: number; burst?: number };
  notes?: string;
  updatedAt: string;
};

/**
 * What we store about a parent's recent network presence. The fingerprint
 * is one-way; raw IPs and UA strings never persist.
 *
 *   fingerprint = sha256(ipClassC + asn + uaFamily)
 */
export type ParentNetworkFingerprint = {
  parentId: string;       // Clerk user_id
  fingerprint: string;
  lastSeen: string;
};
