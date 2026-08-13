// Seed policies for the verification-ladder capability resolver.
//
// Today: in-memory map, read by useCapability(key). Tomorrow this
// table moves to durable storage (capability_policies) so we can
// change rungs without a deploy — see docs/AUTH_ARCHITECTURE.md and
// the [[dynamic-guardrails]] memory.
//
// The kid never sees a denied capability as a "locked" UI. The
// surface is simply absent — see [[parent-invisible-config]].

import type { CapabilityKey, CapabilityPolicy } from "@/lib/auth/types";

const NOW = "2026-05-22T00:00:00Z";

const policy = (
  key: CapabilityKey,
  minRung: 0 | 1 | 2 | 3,
  notes: string,
  rateLimit?: { perDay?: number; burst?: number },
): CapabilityPolicy => ({
  key, minRung, cohort: "global", notes, rateLimit, updatedAt: NOW,
});

export const CAPABILITY_POLICIES: Record<CapabilityKey, CapabilityPolicy> = {
  // AI tutor — Miss Vidya
  "ai.tutor.limited":    policy("ai.tutor.limited", 1, "Rate-limited tutor (same-network rung).", { perDay: 20, burst: 5 }),
  // `perDay` here is now ENFORCED, per learner, in the database — see
  // bumpCapabilityUsage. It was previously declared and read by nothing.
  //
  // 60 is deliberately generous: a child working through a hard evening asks a
  // lot of follow-ups, and a tutor that stops mid-topic teaches them the tool
  // is unreliable. It is a ceiling on runaway use, not a study budget, and it
  // is one number to change. What it is NOT is a spend cap — that belongs on
  // the provider account, because it has to hold even when identity does not.
  "ai.tutor.full":       policy("ai.tutor.full",    2, "Full Miss Vidya tutor — parent-verified.", { perDay: 60, burst: 8 }),

  // Sharing
  "share.crossNetwork":  policy("share.crossNetwork", 1, "Share streaks / app link across networks."),

  // BYOK AI provider keys
  "byok.openai":         policy("byok.openai",     3, "Bring your own OpenAI key. Strict-verified only."),
  "byok.anthropic":      policy("byok.anthropic",  3, "Anthropic BYOK. Strict only."),
  "byok.google":         policy("byok.google",     3, "Gemini BYOK. Strict only."),
  "byok.grok":           policy("byok.grok",       3, "Grok BYOK. Strict only."),
  "byok.openrouter":     policy("byok.openrouter", 3, "OpenRouter BYOK. Strict only."),

  // Sensitive
  "incognito.enabled":   policy("incognito.enabled", 3, "Sessions invisible to the kid; only the parent sees them."),
  "health.profile":      policy("health.profile",   3, "Medical advisories + therapy track. Strict only."),

  // Notifications
  "exam.alertsToParent": policy("exam.alertsToParent", 2, "Push exam-day alerts to the parent dashboard."),
};
