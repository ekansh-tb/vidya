import type { GameState, LearnerProfile, LearnerId } from "./types";

const V1_KEY = "vidya-quest:state:v1";
const V2_KEY = "vidya-quest:profiles:v2";
/** Previous good write. Recovery path when the primary key is unreadable. */
const V2_BACKUP_KEY = "vidya-quest:profiles:v2:backup";

export type ProfilesV2 = {
  version: 2;
  currentLearnerId: LearnerId;
  learners: Record<LearnerId, LearnerProfile>;
};

/** Why a write failed, so callers can say something true to the user. */
export type SaveFailure = "quota" | "unavailable" | "unknown";

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: SaveFailure };

/**
 * localStorage throws for several distinct reasons and the distinction matters
 * to the user: a full quota is fixable by them, Safari private mode is not.
 */
function classifyError(e: unknown): SaveFailure {
  if (typeof DOMException !== "undefined" && e instanceof DOMException) {
    // 22 / 1014 are the historical quota codes across browsers.
    if (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    ) {
      return "quota";
    }
    if (e.name === "SecurityError") return "unavailable";
  }
  return "unknown";
}

export const storage = {
  // ---- Generic single-state (legacy) ----
  load<T>(): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(V1_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  save<T>(value: T): boolean {
    if (typeof window === "undefined") return false;
    try {
      window.localStorage.setItem(V1_KEY, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  clear(): boolean {
    if (typeof window === "undefined") return false;
    try {
      window.localStorage.removeItem(V1_KEY);
      return true;
    } catch {
      return false;
    }
  },

  // ---- Profiles v2 ----

  /**
   * Reads the archive, falling back to the rolling backup if the primary key
   * is missing or corrupt. A truncated write (tab killed mid-save, quota hit
   * partway) previously meant total loss; now it costs at most one save.
   */
  loadProfiles(): ProfilesV2 | null {
    if (typeof window === "undefined") return null;
    const readKey = (key: string): ProfilesV2 | null => {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ProfilesV2;
        // Structural sanity check — a half-written blob can still parse.
        if (!parsed || typeof parsed !== "object" || !parsed.learners) return null;
        if (Object.keys(parsed.learners).length === 0) return null;
        return parsed;
      } catch {
        return null;
      }
    };

    const primary = readKey(V2_KEY);
    if (primary) return primary;

    const backup = readKey(V2_BACKUP_KEY);
    if (backup) {
      console.warn("[storage] primary profile key unreadable; recovered from backup");
      return backup;
    }
    return null;
  },

  /**
   * Writes the archive, keeping the previous good value in a backup key first.
   *
   * Returns a typed result rather than a bare boolean. Callers MUST surface a
   * failure: a silently dropped write means the learner keeps playing while
   * nothing is being saved, and loses the session on reload.
   */
  saveProfilesResult(p: ProfilesV2): SaveResult {
    if (typeof window === "undefined") return { ok: false, reason: "unavailable" };
    let serialized: string;
    try {
      serialized = JSON.stringify(p);
    } catch {
      return { ok: false, reason: "unknown" };
    }

    try {
      // Promote the current value to backup before overwriting it, so a failed
      // or partial write never leaves us with nothing readable.
      const previous = window.localStorage.getItem(V2_KEY);
      if (previous) {
        try {
          window.localStorage.setItem(V2_BACKUP_KEY, previous);
        } catch {
          // A full quota can block the backup write. Losing the backup is
          // survivable; losing the primary write is not, so keep going.
        }
      }
      window.localStorage.setItem(V2_KEY, serialized);
      return { ok: true };
    } catch (e) {
      const reason = classifyError(e);
      console.error(`[storage] failed to save profiles (${reason}):`, e);
      return { ok: false, reason };
    }
  },

  /** Back-compat boolean wrapper. Prefer saveProfilesResult. */
  saveProfiles(p: ProfilesV2): boolean {
    return this.saveProfilesResult(p).ok;
  },

  /** Approximate bytes used by the archive — for the parent-facing warning. */
  profilesByteSize(): number {
    if (typeof window === "undefined") return 0;
    try {
      return (window.localStorage.getItem(V2_KEY) || "").length;
    } catch {
      return 0;
    }
  },

  /**
   * Migrate legacy v1 single-state → v2 profiles. The legacy state is
   * wrapped as the primary learner; any name the user actually typed is
   * preserved. Fresh installs land on an empty primary profile (no
   * default name) so onboarding always runs.
   */
  migrateIfNeeded(
    wrapLegacy: (state: GameState) => LearnerProfile,
    freshPrimary: () => LearnerProfile,
  ): ProfilesV2 {
    if (typeof window === "undefined") {
      const fresh = freshPrimary();
      return { version: 2, currentLearnerId: fresh.id, learners: { [fresh.id]: fresh } };
    }
    const v2 = this.loadProfiles();
    if (v2) return v2;
    // No v2 yet — try v1
    const legacy = this.load<GameState>();
    const primary = legacy ? wrapLegacy(legacy) : freshPrimary();
    const next: ProfilesV2 = {
      version: 2,
      currentLearnerId: primary.id,
      learners: { [primary.id]: primary },
    };
    this.saveProfilesResult(next);
    return next;
  },
};
