// Export / import of the whole learner archive.
//
// WHY THIS EXISTS
// ---------------
// Every learner's progress lives in a single localStorage key. Clearing site
// data, switching browsers, switching devices, or a browser evicting storage
// under pressure loses all of it, permanently, with no warning. Until a server
// database exists, a file the family controls is the only real backup.
//
// This is deliberately a *file*, not a cloud sync: it needs no account, works
// offline, and keeps child data on the family's own device unless they choose
// to move it — which is the privacy posture the project already commits to.

import { z } from "zod";
import type { LearnerProfile } from "./types";
import type { ProfilesV2 } from "./storage";
import { dayKeyOf } from "./utils";

export const BACKUP_FORMAT = "vidya.backup" as const;
export const BACKUP_VERSION = 1 as const;

export type BackupFile = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  /** Informational only — never trusted on import. */
  learnerCount: number;
  profiles: ProfilesV2;
};

// Validation is structural, not exhaustive. GameState grows constantly, and a
// backup taken by a newer build must still restore into an older one rather
// than being rejected wholesale — so unknown keys pass through untouched.
const gameStateSchema = z.object({}).loose();

const learnerSchema = z
  .object({
    id: z.string().min(1).max(128),
    name: z.string().max(120),
    grade: z.number().int().min(1).max(13),
    board: z.string().min(1).max(64),
    createdAt: z.string().max(64),
    state: gameStateSchema,
  })
  .loose();

const profilesSchema = z.object({
  version: z.literal(2),
  currentLearnerId: z.string().min(1).max(128),
  learners: z.record(z.string().min(1).max(128), learnerSchema),
});

const backupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.number().int().min(1).max(BACKUP_VERSION),
  exportedAt: z.string().max(64).optional(),
  learnerCount: z.number().int().min(0).optional(),
  profiles: profilesSchema,
});

/**
 * Strips credentials before anything leaves the device.
 *
 * A backup is meant to be emailed to yourself, dropped in cloud storage, or
 * handed to another device — so it must not be a credential dump.
 *
 * Two secrets live on a LearnerProfile:
 *   - `parentPin`. Exporting it verbatim meant any sibling who could open the
 *     export (see the PIN room) walked away with every other learner's parent
 *     PIN in plaintext.
 *   - `deviceToken`. This one is a real credential: it authenticates sync and
 *     opens the AI tutor, with no session behind it. A backup that carried it
 *     would silently link every device the file ever reached, and a parent
 *     revoking from the dashboard would have no idea how many there were.
 *
 * `verifiedLevel` goes with the token, because it is only ever a mirror of a
 * server column and a device holding no token cannot prove anything to that
 * server. Carrying it alone would mean a backup file — a JSON file a child can
 * open and edit — granted rung 2 and the AI tutor on any device it landed on,
 * which is the self-promotion hole the claim-code rebuild existed to close.
 *
 * Restore therefore carries none of the three. The parent re-sets the PIN, and
 * issues a fresh claim code for the new device — which is exactly the point at
 * which an adult should be deciding whether that device gets access.
 */
function withoutCredentials(profiles: ProfilesV2): ProfilesV2 {
  const learners: ProfilesV2["learners"] = {};
  for (const [id, learner] of Object.entries(profiles.learners)) {
    const {
      parentPin: _omitPin,
      deviceToken: _omitToken,
      verifiedLevel: _omitRung,
      ...safe
    } = learner;
    learners[id] = safe as LearnerProfile;
  }
  return { ...profiles, learners };
}

export function buildBackup(profiles: ProfilesV2): BackupFile {
  const safe = withoutCredentials(profiles);
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    learnerCount: Object.keys(safe.learners).length,
    profiles: safe,
  };
}

export function serializeBackup(profiles: ProfilesV2): string {
  return JSON.stringify(buildBackup(profiles), null, 2);
}

/** `vidya-backup-2026-08-11-3-learners.json` */
export function backupFilename(profiles: ProfilesV2, now = new Date()): string {
  const n = Object.keys(profiles.learners).length;
  // Local date — the filename should read as the day the parent made it.
  const date = dayKeyOf(now);
  return `vidya-backup-${date}-${n}-learner${n === 1 ? "" : "s"}.json`;
}

export type ImportOutcome =
  | { ok: true; profiles: ProfilesV2; learnerCount: number }
  | { ok: false; error: string };

/**
 * Parses and validates a backup file's text.
 *
 * Errors are phrased for a parent staring at a file picker, not a developer —
 * this is the screen someone reaches on a bad day, having just lost a device.
 */
export function parseBackup(text: string): ImportOutcome {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON. Pick the .json file Vidya exported." };
  }

  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success) {
    const looksLikeRawProfiles = profilesSchema.safeParse(raw);
    if (looksLikeRawProfiles.success) {
      // Tolerate a hand-extracted localStorage blob — it is the same data,
      // just without the envelope, and refusing it would be unhelpful.
      const profiles = looksLikeRawProfiles.data as ProfilesV2;
      return { ok: true, profiles, learnerCount: Object.keys(profiles.learners).length };
    }
    return {
      ok: false,
      error: "That doesn't look like a Vidya backup. Check you picked the right file.",
    };
  }

  const profiles = parsed.data.profiles as ProfilesV2;
  const ids = Object.keys(profiles.learners);
  if (ids.length === 0) {
    return { ok: false, error: "That backup has no learners in it." };
  }

  // A pointer at a missing learner would strand the app on an empty profile.
  if (!profiles.learners[profiles.currentLearnerId]) {
    profiles.currentLearnerId = ids[0]!;
  }

  return { ok: true, profiles, learnerCount: ids.length };
}

/**
 * Merges an imported archive into what is already on this device.
 *
 * Import must never silently destroy a learner who exists here but not in the
 * file — that is exactly how a restore turns one loss into two. Colliding ids
 * are resolved by `onConflict`:
 *   - "keep-local"    → the device wins; imported copy is dropped.
 *   - "prefer-import" → the file wins for that learner.
 * Non-colliding learners from both sides are always kept.
 */
export function mergeProfiles(
  local: ProfilesV2,
  imported: ProfilesV2,
  onConflict: "keep-local" | "prefer-import" = "prefer-import",
): { profiles: ProfilesV2; added: string[]; replaced: string[]; kept: string[] } {
  const added: string[] = [];
  const replaced: string[] = [];
  const kept: string[] = [];
  const learners: Record<string, LearnerProfile> = { ...local.learners };

  for (const [id, incoming] of Object.entries(imported.learners)) {
    if (!learners[id]) {
      learners[id] = incoming as LearnerProfile;
      added.push(id);
    } else if (onConflict === "prefer-import") {
      learners[id] = incoming as LearnerProfile;
      replaced.push(id);
    } else {
      kept.push(id);
    }
  }

  const currentLearnerId = learners[imported.currentLearnerId]
    ? imported.currentLearnerId
    : local.currentLearnerId in learners
      ? local.currentLearnerId
      : Object.keys(learners)[0]!;

  return { profiles: { version: 2, currentLearnerId, learners }, added, replaced, kept };
}
