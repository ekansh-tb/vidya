"use client";

import { useMemo } from "react";
import { useGameStore } from "@/lib/game-store";
import type { CapabilityKey, CapabilityResolution, VerificationLevel } from "@/lib/auth/types";
import type { LearnerProfile } from "@/lib/types";
import { CAPABILITY_POLICIES } from "./policies";

/**
 * Resolves a capability for the current active learner.
 *
 * Inputs:
 *   1. The capability's policy (CAPABILITY_POLICIES — today an in-memory
 *      map, tomorrow a server-served row).
 *   2. The learner's verification rung, computed locally from the
 *      LearnerProfile shape (see computeRung below).
 *
 * Output: { allowed, reason }. Callers MUST treat denied capabilities
 * as absent surfaces (no "locked" badges, no "ask your parent" copy)
 * per [[parent-invisible-config]].
 *
 * The hook is reactive — when learner.parentPin or anything else
 * affecting rung changes, the resolution recomputes automatically
 * because zustand notifies subscribers.
 */
export function useCapability(key: CapabilityKey): CapabilityResolution {
  const learner = useGameStore((s) => s.learner);

  return useMemo<CapabilityResolution>(() => {
    const pol = CAPABILITY_POLICIES[key];
    if (!pol) return { allowed: false, reason: "feature_disabled" };

    // Parent override beats everything: if a capability is in the
    // disabledCapabilities list, it is denied regardless of rung. This is
    // the "parents control AI without de-PINing" path from the vision.
    if (learner.disabledCapabilities?.includes(key)) {
      return { allowed: false, reason: "feature_disabled" };
    }

    const rung = computeRung(learner);
    if (rung < pol.minRung) {
      return { allowed: false, reason: "below_min_rung" };
    }

    return { allowed: true, reason: "ok" };
  }, [key, learner]);
}

/**
 * Compute the active learner's verification rung from local state.
 *
 *   Rung 2 — `parentPin` set on the learner profile (parent has been
 *            present enough to lock the parent room).
 *   Rung 1 — same-network auto-verify. NOT IMPLEMENTED yet; will land
 *            with the durable DB so we can store one-way fingerprints
 *            of parent sessions.
 *   Rung 0 — default. A brand-new learner profile.
 *   Rung 3 — strict-verified. NOT IMPLEMENTED; manual ops review.
 *
 * Promotion is monotonic in v1: setting a PIN promotes to rung 2;
 * un-PINing demotes to rung 0 (rung 1 needs the fingerprint table).
 */
export function computeRung(learner: LearnerProfile): VerificationLevel {
  if (learner.parentPin && /^\d{4}$/.test(learner.parentPin)) return 2;
  return 0;
}

/** Convenience guard for callers that just want a boolean. */
export function useCapabilityAllowed(key: CapabilityKey): boolean {
  return useCapability(key).allowed;
}
