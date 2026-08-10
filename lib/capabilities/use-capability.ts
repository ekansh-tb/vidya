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
 * The active learner's verification rung.
 *
 * THIS USED TO READ THE PIN, AND THAT WAS THE BUG:
 *
 *     if (learner.parentPin && /^\d{4}$/.test(learner.parentPin)) return 2;
 *
 * The parent room opens in "set a PIN" mode on a fresh profile — it *invites*
 * whoever is holding the device to choose one. So a child tapped Parent, typed
 * any four digits twice, and promoted themselves to rung 2, which unlocks the
 * full AI tutor. No adult, no network, no server ever involved. A local secret
 * stored next to the data it guards is not authentication.
 *
 * The rung now comes from the server: a learner reaches rung 2 only by
 * redeeming a claim code their parent issued from an authenticated session
 * (see lib/db/queries.ts `redeemClaimCode`). `verifiedLevel` is written onto
 * the profile when the device links, and is the client's read-only mirror of
 * `learners.verification_level`.
 *
 * The PIN still exists, and is still worth having — it keeps a younger sibling
 * out of the analytics screen. It is a speed bump on a local UI, which is all
 * it ever honestly was.
 *
 * Rungs 1 and 3 remain unreachable: rung 1 needs the network-fingerprint
 * table, rung 3 needs manual ops review.
 */
export function computeRung(learner: LearnerProfile): VerificationLevel {
  const level = learner.verifiedLevel;
  if (level === 1 || level === 2 || level === 3) return level;
  return 0;
}

/** Convenience guard for callers that just want a boolean. */
export function useCapabilityAllowed(key: CapabilityKey): boolean {
  return useCapability(key).allowed;
}
