import "server-only";

import { CAPABILITY_POLICIES } from "./policies";
import type { CapabilityKey, CapabilityResolution } from "../auth/types";
import {
  resolveIdentity, identityFromRequest, disabledForLinkedDevices, rungFor, type Identity,
} from "../auth/session";

/**
 * Server-side capability resolution.
 *
 * The client hook (`use-capability.ts`) decides what to *render*. This decides
 * what the server will *do*. They are not the same job, and conflating them is
 * how `/api/tutor` ended up reachable by anyone who could type a URL: the only
 * gate was a React hook, trivially bypassed by calling the endpoint directly.
 *
 * Rules:
 *   - The rung comes from the database, via a device token or a Clerk session.
 *     A request cannot assert it, and no PIN is involved.
 *   - A parent's explicit `disabledCapabilities` override wins over the rung,
 *     so parent-invisible config is a boundary here and not just a hidden
 *     button in the kid's lobby.
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

  // A revoked device is an adult's explicit decision too, and it must not be
  // treated as ordinary anonymity — otherwise a parent's Unlink button gets
  // softened by the same observe-mode grace that exists for families who have
  // simply not linked yet. See resolveDeviceToken.
  if (identity.kind === "anonymous" && identity.reason === "revoked") {
    return { allowed: false, reason: "feature_disabled", identity };
  }

  // The parent's switch-off is checked BEFORE the rung, because it is the more
  // specific decision: an adult looked at this child and said no. Raising the
  // rung later must not quietly undo that.
  //
  // This used to be a comment explaining that the column did not exist and the
  // override lived only on the client — which meant a parent turning Miss
  // Vidya off removed a button while /api/tutor stayed just as reachable.
  // Migration 0003 added the column; this is what makes the toggle real.
  if (identity.kind === "learner" && identity.learner.disabledCapabilities?.includes(key)) {
    return { allowed: false, reason: "feature_disabled", identity };
  }

  const rung = rungFor(identity);
  if (rung < policy.minRung) {
    return { allowed: false, reason: "below_min_rung", identity };
  }

  return { allowed: true, reason: "ok", identity };
}

/**
 * The same decision, for a route that has a Request in hand.
 *
 * USE THIS ONE FROM THE KID-FACING ROUTES. `resolveIdentity()` alone reads a
 * Clerk session, and the child does not have one — they hold a device token
 * (see redeemClaimCode). So resolving without the request would classify every
 * linked learner as anonymous, put them at rung 0, and mean that turning on
 * ENFORCE_TUTOR_RUNG switched the tutor off for exactly the families who had
 * done the linking properly.
 */
export async function resolveCapabilityForRequest(
  key: CapabilityKey,
  req: Request,
): Promise<CapabilityResolution & { identity: Identity }> {
  const identity = await identityFromRequest(req);
  const decision = await resolveCapabilityServer(key, identity);
  if (!decision.allowed) return decision;

  // Second pass, deny-only. The identity above rests on a header the client
  // chooses to send, and the client is exactly who the parent's switch-off is
  // aimed at — so a child could delete their own token and resolve as
  // anonymous, skipping the check against them. The httpOnly cookie set at
  // redeem time cannot be deleted from script, so it still names the devices
  // linked in this browser. It may only take capabilities away; see
  // disabledForLinkedDevices for why granting from it would be worse than the
  // hole it closes.
  if ((await disabledForLinkedDevices(req)).has(key)) {
    return { allowed: false, reason: "feature_disabled", identity };
  }
  return decision;
}

/**
 * Boolean helper for routes.
 *
 * NOTE ON THE CURRENT TRANSITION: the kid app is still allowed to run fully
 * anonymously, and a learner who has not linked is at rung 0. Enforcing
 * `ai.tutor.full` strictly before a family has linked would switch the tutor
 * off for them. Routes therefore call this with `enforce` explicitly, so the
 * switch from "observe" to "enforce" is a visible, deliberate change rather
 * than something buried in a helper.
 */
export async function capabilityAllowed(key: CapabilityKey): Promise<boolean> {
  const r = await resolveCapabilityServer(key);
  return r.allowed;
}
