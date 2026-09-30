"use client";

// Miss Vidya — the in-app teacher. Uses the browser's SpeechSynthesis API.
// Picks an Indian English voice when available, otherwise a UK/US English voice.

import { readPersistedAudioSettings } from "./audio-bootstrap";
import { selectSpeechVoice } from "./speech-voices";

let voiceCache: SpeechSynthesisVoice[] | null = null;
let currentLine: string | null = null;
const listeners = new Set<(line: string | null) => void>();

function notify(line: string | null) {
  currentLine = line;
  listeners.forEach((fn) => fn(line));
}

export function onSpeechLine(fn: (line: string | null) => void) {
  listeners.add(fn);
  fn(currentLine);
  return () => listeners.delete(fn);
}

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  if (voiceCache && voiceCache.length) return voiceCache;
  voiceCache = window.speechSynthesis.getVoices();
  return voiceCache;
}

const DEFAULT_VOICE_VOLUME = 0.9;

// `settings.voiceVolume` was written by the slider and read by nobody: speak()
// hardcoded 0.9 and every caller took the default, so the slider was purely
// decorative. It now lives here as a module-level default, which keeps all the
// existing call sites (`vidya.correct()` and friends) working untouched.
let voiceVolume: number | null = null;

/** Mirrors `settings.voiceVolume`. 0–1, clamped. */
export function setVoiceVolume(v: number) {
  voiceVolume = Math.min(1, Math.max(0, v));
}

function currentVoiceVolume(): number {
  // Resolved lazily on first speech: the first line can be spoken before the
  // Settings screen has ever mounted, so fall back to the saved preference
  // rather than to full volume.
  if (voiceVolume === null) {
    const saved = readPersistedAudioSettings();
    voiceVolume = typeof saved?.voiceVolume === "number"
      ? Math.min(1, Math.max(0, saved.voiceVolume))
      : DEFAULT_VOICE_VOLUME;
  }
  return voiceVolume;
}

export function speak(text: string, opts: { lang?: string; rate?: number; pitch?: number; volume?: number; onEnd?: () => void } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const saved = readPersistedAudioSettings();
  if (saved?.voice === false) return;
  const { lang = "en", rate = 0.98, pitch = 1, volume = saved?.voiceVolume ?? currentVoiceVolume(), onEnd } = opts;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = selectSpeechVoice(getVoices(), lang, saved?.voiceURI);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  utterance.onstart = () => notify(text);
  utterance.onend = () => { notify(null); onEnd?.(); };
  utterance.onerror = () => { notify(null); onEnd?.(); };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  notify(null);
}

// Voice lines — Miss Vidya's personality
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export const vidya = {
  greet: (name: string) => speak(pick([
    `Hi ${name}. I'm Vidya, your learning guide. What would you like to explore?`,
    `Welcome, ${name}. Let's learn something together, at your pace.`,
  ])),
  correct: () => speak(pick([
    "Brilliant!",
    "Absolutely correct!",
    "You got it, superstar!",
    "Spot on!",
    "Excellent thinking!",
    "Flawless!",
  ])),
  wrong: () => speak(pick([
    "Not quite, but good try!",
    "Close one! Let's understand this.",
    "Let's try another way. Take your time.",
    "Good attempt! Read the hint.",
  ])),
  combo: (n: number) => speak(`${n} in a row. Your practice is paying off!`),
  levelUp: (level: number) => speak(`Level ${level} unlocked! Outstanding work!`),
  badge: (name: string) => speak(`New badge earned. ${name}. Beautifully done!`),
  perfect: () => speak(pick([
    "You answered every question correctly. Well done!",
    "A perfect score! Phenomenal!",
    "Hundred percent! You absolutely smashed it!",
  ])),
  streak: (n: number) => speak(`${n} day streak. You are unstoppable!`),
  daily: () => speak("Daily quest complete! Bonus rewards loaded."),
  subjectIntro: (name: string) => speak(`Let's dive into ${name}!`),
  encourage: () => speak(pick([
    "Take your time. Think it through.",
    "You've got this!",
    "Read it once more, then choose.",
  ])),
  goodbye: () => speak(pick([
    "See you next time!",
    "Great session today!",
    "Ace stuff! Come back soon.",
  ])),
};

// Preload voices (some browsers load them async)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voiceCache = window.speechSynthesis.getVoices();
  };
}
