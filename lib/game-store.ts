"use client";

import { create } from "zustand";
import type { GameState, LearnerProfile, LearnerId, Board } from "./types";
import { storage, type ProfilesV2 } from "./storage";
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

// Fresh-install default: an empty profile that immediately routes through
// onboarding. No hardcoded name, no seeded XP, no inferred school.
function defaultPrimaryLearner(): LearnerProfile {
  return {
    id: "learner-primary",
    name: "",
    grade: 5,
    board: "cambridge-primary",
    subjectsLocked: false,
    createdAt: new Date().toISOString(),
    state: { ...DEFAULT_STATE, dailyQuest: { date: todayKey(), completed: false } },
  };
}

type Store = {
  profiles: ProfilesV2;
  hydrated: boolean;

  // Active learner — derived from profiles + currentLearnerId
  state: GameState;
  learner: LearnerProfile;

  // Mutations on active learner's state
  set: (updater: (s: GameState) => GameState) => void;
  reset: () => void;
  hydrate: () => void;

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

export const useGameStore = create<Store>((set, get) => ({
  profiles: initialProfiles,
  hydrated: false,
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
    storage.saveProfiles(profiles);
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
    storage.saveProfiles(nextProfiles);
    set({ profiles: nextProfiles, state: nextState, learner: nextLearner });
  },

  reset: () => {
    const cur = get();
    const learnerId = cur.profiles.currentLearnerId;
    const fresh: GameState = { ...DEFAULT_STATE, dailyQuest: { date: todayKey(), completed: false } };
    const learner = { ...cur.profiles.learners[learnerId], state: fresh, subjectsLocked: false, pickedSubjects: undefined };
    const profiles = { ...cur.profiles, learners: { ...cur.profiles.learners, [learnerId]: learner } };
    storage.saveProfiles(profiles);
    set({ profiles, state: fresh, learner });
  },

  switchLearner: (id) => {
    const cur = get();
    if (!cur.profiles.learners[id]) return;
    const profiles = { ...cur.profiles, currentLearnerId: id };
    storage.saveProfiles(profiles);
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
    storage.saveProfiles(profiles);
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
    storage.saveProfiles(profiles);
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
