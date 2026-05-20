import type { GameState, LearnerProfile, LearnerId } from "./types";

const V1_KEY = "vidya-quest:state:v1";
const V2_KEY = "vidya-quest:profiles:v2";

export type ProfilesV2 = {
  version: 2;
  currentLearnerId: LearnerId;
  learners: Record<LearnerId, LearnerProfile>;
};

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
  loadProfiles(): ProfilesV2 | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(V2_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ProfilesV2;
    } catch {
      return null;
    }
  },
  saveProfiles(p: ProfilesV2): boolean {
    if (typeof window === "undefined") return false;
    try {
      window.localStorage.setItem(V2_KEY, JSON.stringify(p));
      return true;
    } catch {
      return false;
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
    this.saveProfiles(next);
    return next;
  },
};
