import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured } from "./clerk-config";
import { dbConfigured } from "../db/client";
import {
  upsertParent,
  getLearnerForClerkUser,
  getLearnerForDeviceToken,
  clearSelfLink,
  type LearnerRow,
  type VerificationLevel,
} from "../db/queries";

/**
 * Server-side identity resolution.
 *
 * This is the file that makes verification mean something. Previously the
 * learner's "rung" was computed in the browser from `learner.parentPin` — a
 * 4-digit string the child could set themselves, in a room the app *invited*
 * them to open. Rung 2 unlocked the full AI tutor, so a kid self-promoted in
 * two taps and no server ever knew.
 *
 * Here the rung comes from the database, keyed to a Clerk session. A client
 * cannot assert it.
 */

export type Role = "parent" | "learner";

export type ParentIdentity = {
  kind: "parent";
  userId: string;
  email: string | null;
};

export type LearnerIdentity = {
  kind: "learner";
  userId: string;
  learner: LearnerRow;
  verificationLevel: VerificationLevel;
};

export type AnonymousIdentity = {
  kind: "anonymous";
  /** Why we could not identify anyone — useful for honest UI copy. */
  reason: "no_session" | "auth_disabled" | "db_disabled" | "unlinked";
};

export type Identity = ParentIdentity | LearnerIdentity | AnonymousIdentity;

/** Reads the Clerk role claim. Absent means the account predates roles. */
export function roleFromMetadata(meta: unknown): Role | null {
  if (!meta || typeof meta !== "object") return null;
  const r = (meta as { role?: unknown }).role;
  return r === "parent" || r === "learner" ? r : null;
}

/**
 * Resolves who is making this request.
 *
 * Degrades deliberately rather than throwing: the kid app is designed to run
 * anonymously and offline, so "no identity" is a normal state, not an error.
 * Callers decide what an anonymous caller may do.
 */
export async function resolveIdentity(): Promise<Identity> {
  if (!clerkConfigured) return { kind: "anonymous", reason: "auth_disabled" };

  const { userId } = await auth();
  if (!userId) return { kind: "anonymous", reason: "no_session" };

  if (!dbConfigured()) return { kind: "anonymous", reason: "db_disabled" };

  const user = await currentUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  // An explicitly-flagged learner, or any account already linked to a learner
  // row. The row is the stronger signal, so check it first.
  const linked = await getLearnerForClerkUser(userId);
  if (linked) {
    // ...with one exception, which is a repair rather than a rule.
    //
    // The old redeem path wrote the caller's Clerk id onto the learner row. On
    // a family's shared browser the only signed-in account is the parent's, so
    // a parent who redeemed a code became their own child as far as this
    // function was concerned: requireParent() returned null, every
    // /api/parent/* route answered 401, and there was no unlink control to
    // reach because reaching one required being a parent. A row cannot be
    // owned and inhabited by the same account, so treat that as the corruption
    // it is, undo it, and carry on as the parent.
    if (linked.parentId && linked.parentId === userId) {
      await clearSelfLink(userId);
    } else {
      return {
        kind: "learner",
        userId,
        learner: linked,
        verificationLevel: linked.verificationLevel,
      };
    }
  }
  if (role === "learner") {
    // Signed in as a kid but no learner row yet — they still need to redeem a
    // claim code. Not a parent, and not entitled to a learner's capabilities.
    return { kind: "anonymous", reason: "unlinked" };
  }

  // Everyone else is treated as a parent. Accounts created before roles
  // existed land here, which matches the pre-existing behaviour of /parent.
  await upsertParent({
    id: userId,
    email,
    displayName: user?.firstName ?? null,
  });
  return { kind: "parent", userId, email };
}

/** Convenience for routes that require a parent. */
export async function requireParent(): Promise<ParentIdentity | null> {
  const id = await resolveIdentity();
  return id.kind === "parent" ? id : null;
}

/** Convenience for routes that require a signed-in, linked learner. */
export async function requireLearner(): Promise<LearnerIdentity | null> {
  const id = await resolveIdentity();
  return id.kind === "learner" ? id : null;
}

/**
 * Header a linked device presents instead of a session.
 *
 * `sendBeacon` cannot set headers, and the sync flush on tab-hide is a beacon,
 * so POST bodies may carry the same token under `deviceToken`. Both are read
 * below; neither is ever logged.
 */
export const DEVICE_TOKEN_HEADER = "x-vidya-device";

/**
 * The learner making this request — by device token first, session second.
 *
 * Device tokens exist because the child has no login and is never going to get
 * one. The token is minted when an adult's claim code is redeemed, so it
 * carries exactly the authority the adult already granted, and a parent can
 * revoke it from the dashboard. See redeemClaimCode.
 *
 * The Clerk path is kept for a learner who genuinely does have their own
 * sign-in — an older kid on their own laptop — which the schema always allowed.
 */
export async function requireLearnerFrom(
  req: Request,
  bodyToken?: string | null,
): Promise<LearnerIdentity | null> {
  const token = req.headers.get(DEVICE_TOKEN_HEADER)?.trim() || bodyToken?.trim() || "";
  if (token && dbConfigured()) {
    const learner = await getLearnerForDeviceToken(token);
    if (learner) {
      return {
        kind: "learner",
        // A device is not a person. There is no Clerk user behind this, and
        // callers must not treat the id as one.
        userId: `device:${learner.id}`,
        learner,
        verificationLevel: learner.verificationLevel,
      };
    }
  }
  return requireLearner();
}

/**
 * The effective verification rung for the caller.
 *
 * Anonymous device-local play is rung 0 — the full local learning loop, no AI
 * tutor. Only a learner linked to a parent via a claim code reaches rung 2.
 */
export function rungFor(identity: Identity): VerificationLevel {
  if (identity.kind === "learner") return identity.verificationLevel;
  // A parent's own session is not a learner session; capabilities scoped to a
  // learner do not apply to it.
  return 0;
}
