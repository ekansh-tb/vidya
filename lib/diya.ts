// Diya — the learning companion. Pure logic; the visual is in components/effects/diya.tsx.

import type { GameState } from "./types";
import { xpToLevel } from "./economy";
import { currentPeriod } from "./school-day";

export type DiyaMood = "sleepy" | "happy" | "excited" | "shy" | "study" | "celebrate" | "miss-you";

export function diyaMood(state: GameState, now: Date = new Date()): DiyaMood {
  const hour = now.getHours();
  if (hour < 6 || hour >= 22) return "sleepy";
  if (state.streak === 0) return "miss-you";
  if (state.streak >= 7) return "excited";
  const period = currentPeriod(now);
  if (period.kind === "subject") return "study";
  if (period.kind === "assembly") return "shy";
  return "happy";
}

export function diyaLevel(state: GameState): number {
  // Diya's level is tied to learner's level. Diya unlocks new glows every 3 levels.
  const { level } = xpToLevel(state.xp);
  return Math.max(1, Math.floor((level - 1) / 3) + 1);
}

const NUDGES: Record<DiyaMood, string[]> = {
  sleepy: [
    "Sleepy yawn… see you in the morning ✨",
    "I'll keep a light on. Sweet dreams.",
    "Rest now — adventures wait at sunrise.",
  ],
  "miss-you": [
    "Yay, you're back! I missed our streak.",
    "Let's light up today. One quick quest?",
    "Even one question is a great start. 🪔",
  ],
  happy: [
    "Hi friend! What shall we explore today?",
    "Pick a classroom — I'll walk in with you.",
    "Field Trip? Math? Match? You choose.",
  ],
  excited: [
    "A 7-day streak, look at you go! 🔥",
    "You're glowing brighter than me today!",
    "We're on a roll. Let's keep going.",
  ],
  shy: [
    "Assembly time… let's listen together.",
    "Hush, the principal is speaking.",
    "Thought for the day, coming up.",
  ],
  study: [
    "Class time — I'll cheer you on.",
    "Take your time. I'm here.",
    "Tricky one? Tap me — I have a hint.",
  ],
  celebrate: [
    "WOW! That deserves a happy dance.",
    "You did it! Spinning with joy 🪔",
    "Tell your friends — this was big.",
  ],
};

export function diyaSay(state: GameState, now: Date = new Date()): string {
  const mood = diyaMood(state, now);
  const lines = NUDGES[mood];
  // Stable-ish line: pick based on today + xp so it changes with progress, not every render.
  const key = (state.xp || 0) + (now.getDate() || 1);
  return lines[key % lines.length];
}
