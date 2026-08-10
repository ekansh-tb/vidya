import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured } from "./clerk-config";
import { dbConfigured } from "../db/client";
import {
  upsertParent,
  getLearnerForClerkUser,
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
    return {
      kind: "learner",
      userId,
      learner: linked,
      verificationLevel: linked.verificationLevel,
    };
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
