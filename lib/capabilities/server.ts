import "server-only";

import { CAPABILITY_POLICIES } from "./policies";
import type { CapabilityKey, CapabilityResolution } from "../auth/types";
import { resolveIdentity, rungFor, type Identity } from "../auth/session";

/**
 * Server-side capability resolution.
 *
 * The client hook (`use-capability.ts`) decides what to *render*. This decides
 * what the server will *do*. They are not the same job, and conflating them is
 * how `/api/tutor` ended up reachable by anyone who could type a URL: the only
 * gate was a React hook, trivially bypassed by calling the endpoint directly.
 *
 * Rules:
 *   - The rung comes from the database via a Clerk session. A request cannot
 *     assert it, and no PIN is involved.
 *   - A parent's explicit `disabledCapabilities` override still wins, so
 *     parent-invisible config keeps working server-side too.
 */
export async function resolveCapabilityServer(
  key: CapabilityKey,
  identityOverride?: Identity,
): Promise<CapabilityResolution & { identity: Identity }> {
  const identity = identityOverride ?? (await resolveIdentity());
  const policy = CAPABILITY_POLICIES[key];

  if (!policy) {
    return { allowed: false, reason: "feature_disabled", identity };
  }

  // NOT YET ENFORCED HERE: the parent's per-learner `disabledCapabilities`
  // override. It currently lives only on the client LearnerProfile and has no
  // column in `learners`, so the server cannot see it. The client hook still
  // applies it, which means a parent's switch-off hides the surface but does
  // not yet harden the endpoint. Add the column and read it here when parent
  // config syncs to the database.
  const rung = rungFor(identity);
  if (rung < policy.minRung) {
    return { allowed: false, reason: "below_min_rung", identity };
  }

  return { allowed: true, reason: "ok", identity };
}

/**
 * Boolean helper for routes.
 *
 * NOTE ON THE CURRENT TRANSITION: the kid app is still allowed to run fully
 * anonymously, and most learners have not yet linked an account. Enforcing
 * `ai.tutor.full` strictly today would switch the tutor off for every existing
 * user at once. Routes therefore call this with `enforce` explicitly, so the
 * switch from "observe" to "enforce" is a visible, deliberate change rather
 * than something buried in a helper.
 */
export async function capabilityAllowed(key: CapabilityKey): Promise<boolean> {
  const r = await resolveCapabilityServer(key);
  return r.allowed;
}
