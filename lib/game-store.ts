"use client";

import { create } from "zustand";
import type { GameState, LearnerProfile, LearnerId, Board } from "./types";
import { storage, type ProfilesV2, type SaveFailure } from "./storage";
import { todayKey, daysBetween } from "./utils";

export const DEFAULT_STATE: GameState = {
  name: "",
  avatarId: "peacock",
  customAvatar: null,
  xp: 0,
  coins: 50,
  streak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  progress: {},
  badges: [],
  inventory: { hint: 1, fiftyFifty: 1, freeze: 0, doubleXp: 0 },
  stats: {
    totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0,
    dailyQuestsCompleted: 0, fastestQuiz: null,
  },
  doubleXpActive: false,
  dailyQuest: { date: null, completed: false },
  comeback: { wasWrong: false, sinceWrongCorrect: 0 },
  seenQuestions: {},
  friendStreak: null,
  lastQuestCorrect: null,
  passportStamps: [],
  notebook: {},
  lastAssemblyDate: null,
  assemblyStreak: 0,
  readBooks: [],
  savedMelody: null,
  savedCompositions: [],
  classRoster: [],
  classNotes: [],
  buddyId: null,
  missedQuestions: [],
  dailyReflections: [],
  settings: {
    sound: true, music: false, voice: true,
    musicVolume: -16, sfxVolume: -8, voiceVolume: 0.9,
  },
  onboarded: false,
};

function applyDailyRollovers(s: GameState): GameState {
  const today = todayKey();
  if (s.lastPlayedDate && s.lastPlayedDate !== today) {
    const diff = daysBetween(s.lastPlayedDate, today);
    if (diff > 1) {
      if (s.inventory.freeze > 0 && diff === 2) {
        s.inventory.freeze -= 1;
      } else {
        s.streak = 0;
      }
    }
  }
  if (!s.dailyQuest || s.dailyQuest.date !== today) {
    s.dailyQuest = { date: today, completed: false };
  }
  return s;
}

// Legacy v1 → v2 migration. Preserves the user's actual typed name if any;
// does NOT impose any default name. New installs land on an empty profile
// and are forced through onboarding.
function makeLearnerFromLegacy(legacy: GameState): LearnerProfile {
  const merged: GameState = {
    ...DEFAULT_STATE,
    ...legacy,
    settings: { ...DEFAULT_STATE.settings, ...(legacy.settings || {}) },
    inventory: { ...DEFAULT_STATE.inventory, ...(legacy.inventory || {}) },
    stats: { ...DEFAULT_STATE.stats, ...(legacy.stats || {}) },
    seenQuestions: legacy.seenQuestions || {},
  };
  return {
    id: "learner-primary",
    name: merged.name?.trim() || "",
    grade: 5,
    board: "cambridge-primary",
    pickedSubjects: undefined,
    subjectsLocked: false,
    createdAt: new Date().toISOString(),
    state: applyDailyRollovers(merged),
  };
}

/**
 * Not a real grade. A fresh install has no idea what class the learner is in,
 * and onboarding asks before anything reads this — `state.onboarded` is false,
 * so app/page.tsx routes into the class step first. The sentinel exists so a
 * placeholder can never be mistaken for a genuine Grade 5 learner, which is
 * exactly what the old hardcoded `grade: 5` did.
 */
export const UNSET_GRADE = 0;

// Fresh-install default: an empty profile that immediately routes through
// onboarding. No hardcoded name, no assumed grade, no seeded XP, no school.
function defaultPrimaryLearner(): LearnerProfile {
  return {
    id: "learner-primary",
    name: "",
    grade: UNSET_GRADE,
    // Placeholder only — onboarding overwrites it with the chosen board before
    // the app renders anything that reads it.
    board: "cambridge-primary",
    subjectsLocked: false,
    createdAt: new Date().toISOString(),
    state: { ...DEFAULT_STATE, dailyQuest: { date: todayKey(), completed: false } },
  };
}

type Store = {
  profiles: ProfilesV2;
  hydrated: boolean;
  /** Set when a write to localStorage failed. Non-null means progress is NOT
   *  being saved and the learner must be told — see [[vidya-persistence-model]]. */
  saveError: SaveFailure | null;

  // Active learner — derived from profiles + currentLearnerId
  state: GameState;
  learner: LearnerProfile;

  // Mutations on active learner's state
  set: (updater: (s: GameState) => GameState) => void;
  reset: () => void;
  hydrate: () => void;

  /** Replace the whole archive — used by backup restore. */
  restoreProfiles: (profiles: ProfilesV2) => void;
  dismissSaveError: () => void;

  // Multi-learner management
  switchLearner: (id: LearnerId) => void;
  upsertLearner: (l: LearnerProfile) => void;
  updateLearnerMeta: (id: LearnerId, patch: Partial<Omit<LearnerProfile, "state" | "id">>) => void;
};

const initialProfiles: ProfilesV2 = {
  version: 2,
  currentLearnerId: "learner-primary",
  learners: { "learner-primary": defaultPrimaryLearner() },
};

/**
 * Persist and report. Every mutation routes through this so a failed write is
 * recorded rather than swallowed — the old code ignored `saveProfiles()`'s
 * boolean at all six call sites, so a full or read-only localStorage let the
 * learner keep playing while nothing was saved.
 */
function persist(profiles: ProfilesV2): SaveFailure | null {
  const result = storage.saveProfilesResult(profiles);
  return result.ok ? null : result.reason;
}

export const useGameStore = create<Store>((set, get) => ({
  profiles: initialProfiles,
  hydrated: false,
  saveError: null,
  state: initialProfiles.learners["learner-primary"].state,
  learner: initialProfiles.learners["learner-primary"],

  hydrate: () => {
    if (typeof window === "undefined") return;
    const profiles = storage.migrateIfNeeded(makeLearnerFromLegacy, defaultPrimaryLearner);

    // Roll over daily quest / streak for ALL learners
    for (const id of Object.keys(profiles.learners)) {
      profiles.learners[id].state = applyDailyRollovers(profiles.learners[id].state);
    }

    const current = profiles.learners[profiles.currentLearnerId] || Object.values(profiles.learners)[0];
    if (current) profiles.currentLearnerId = current.id;
    set({ saveError: persist(profiles) });
    set({
      profiles,
      hydrated: true,
      state: current.state,
      learner: current,
    });
  },

  set: (updater) => {
    const cur = get();
    const nextState = updater(cur.state);
    const learnerId = cur.profiles.currentLearnerId;
    const nextLearner: LearnerProfile = { ...cur.profiles.learners[learnerId], state: nextState };
    const nextProfiles: ProfilesV2 = {
      ...cur.profiles,
      learners: { ...cur.profiles.learners, [learnerId]: nextLearner },
    };
    set({ saveError: persist(nextProfiles) });
    set({ profiles: nextProfiles, state: nextState, learner: nextLearner });
  },

  reset: () => {
    const cur = get();
    const learnerId = cur.profiles.currentLearnerId;
    const fresh: GameState = { ...DEFAULT_STATE, dailyQuest: { date: todayKey(), completed: false } };
    const learner = { ...cur.profiles.learners[learnerId], state: fresh, subjectsLocked: false, pickedSubjects: undefined };
    const profiles = { ...cur.profiles, learners: { ...cur.profiles.learners, [learnerId]: learner } };
    set({ saveError: persist(profiles) });
    set({ profiles, state: fresh, learner });
  },

  restoreProfiles: (profiles) => {
    const current =
      profiles.learners[profiles.currentLearnerId] || Object.values(profiles.learners)[0];
    if (!current) return;
    const next: ProfilesV2 = { ...profiles, currentLearnerId: current.id };
    set({
      profiles: next,
      state: current.state,
      learner: current,
      saveError: persist(next),
    });
  },

  dismissSaveError: () => set({ saveError: null }),

  switchLearner: (id) => {
    const cur = get();
    if (!cur.profiles.learners[id]) return;
    const profiles = { ...cur.profiles, currentLearnerId: id };
    set({ saveError: persist(profiles) });
    set({
      profiles,
      state: cur.profiles.learners[id].state,
      learner: cur.profiles.learners[id],
    });
  },

  upsertLearner: (l) => {
    const cur = get();
    const profiles: ProfilesV2 = {
      ...cur.profiles,
      learners: { ...cur.profiles.learners, [l.id]: l },
    };
    set({ saveError: persist(profiles) });
    set({ profiles });
  },

  updateLearnerMeta: (id, patch) => {
    const cur = get();
    const existing = cur.profiles.learners[id];
    if (!existing) return;
    const next: LearnerProfile = { ...existing, ...patch };
    const profiles: ProfilesV2 = {
      ...cur.profiles,
      learners: { ...cur.profiles.learners, [id]: next },
    };
    set({ saveError: persist(profiles) });
    const isActive = cur.profiles.currentLearnerId === id;
    set({
      profiles,
      ...(isActive ? { learner: next } : {}),
    });
  },

}));

export function boardOfGrade(board: Board): "primary" | "igcse" {
  return board === "cambridge-primary" ? "primary" : "igcse";
}
