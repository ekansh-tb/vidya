"use client";

// Audio engine: procedural background music + sound effects using Tone.js.
// All audio requires a user gesture to start (browser autoplay policy).
//
// Tone is imported dynamically so it never lands in the server bundle and
// only loads once a learner actually triggers sound.

import type * as ToneT from "tone";
import { readPersistedAudioSettings } from "./audio-bootstrap";

type ToneModule = typeof import("tone");

let started = false;
let initPromise: Promise<void> | null = null;
let gestureArmed = false;

// `settings.sound` was written by the Settings toggle and read by nobody: every
// sfx.* function played regardless, so muting sound effects did nothing. This
// flag is that setting, and every sfx.* function below now consults it.
let sfxEnabled = true;
/** True once the UI has pushed a value, so init stops second-guessing it. */
let sfxEnabledExplicit = false;

// Last volumes asked for, remembered even when the buses do not exist yet.
// page.tsx pushes the learner's saved volumes on hydrate, which is *before*
// the first gesture creates the buses; without this the request landed on a
// null bus and init silently fell back to the built-in defaults.
let requestedMusicVol: number | null = null;
let requestedSfxVol: number | null = null;
let synth: ToneT.PolySynth | null = null;
let bell: ToneT.MetalSynth | null = null;
let kick: ToneT.MembraneSynth | null = null;
let noiseSnap: ToneT.NoiseSynth | null = null;
let masterVolume: ToneT.Volume | null = null;
let musicVolume: ToneT.Volume | null = null;
let sfxVolume: ToneT.Volume | null = null;
let pattern: ToneT.Loop | null = null;
let bassSeq: ToneT.Loop | null = null;
let melodySeq: ToneT.Sequence<string> | null = null;
let isMusicPlaying = false;

async function ensureTone(): Promise<ToneModule | null> {
  if (typeof window === "undefined") return null;
  return import("tone");
}

/**
 * Boots the audio engine. Safe to call any number of times and from several
 * places at once: concurrent callers share one in-flight promise, so a gesture
 * and a music toggle landing together cannot build two sets of buses.
 */
export function initAudio(opts: { musicVol?: number; sfxVol?: number } = {}): Promise<void> {
  if (started) return Promise.resolve();
  initPromise ??= doInit(opts).catch((err) => {
    // Let a later gesture retry rather than wedging audio off for the session.
    initPromise = null;
    throw err;
  });
  return initPromise;
}

async function doInit(opts: { musicVol?: number; sfxVol?: number }) {
  const Tone = await ensureTone();
  if (!Tone) return;
  await Tone.start();
  started = true;

  // Adopt the learner's saved preferences. Init can now happen on a bare
  // gesture with no caller to pass them in, so the engine reads them itself.
  const saved = readPersistedAudioSettings();
  if (!sfxEnabledExplicit && typeof saved?.sound === "boolean") sfxEnabled = saved.sound;

  const musicVol = opts.musicVol ?? requestedMusicVol ?? saved?.musicVolume ?? -16;
  const sfxVol = opts.sfxVol ?? requestedSfxVol ?? saved?.sfxVolume ?? -8;

  // Volume buses
  masterVolume = new Tone.Volume(-6).toDestination();
  musicVolume = new Tone.Volume(musicVol).connect(masterVolume);
  sfxVolume = new Tone.Volume(sfxVol).connect(masterVolume);

  // Background music: soft polysynth pad with bell arpeggio over a gentle bass.
  const reverb = new Tone.Reverb({ decay: 5, wet: 0.5 }).connect(musicVolume);
  const delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.3, wet: 0.25 }).connect(reverb);

  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine8" },
    envelope: { attack: 0.6, decay: 0.4, sustain: 0.7, release: 1.6 },
  }).connect(reverb);
  pad.volume.value = -10;

  const bassSynth = new Tone.MonoSynth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0.4, release: 0.8 },
    filter: { Q: 1, type: "lowpass", rolloff: -24 },
    filterEnvelope: { attack: 0.05, decay: 0.3, sustain: 0.4, baseFrequency: 200, octaves: 2.5 },
  }).connect(musicVolume);
  bassSynth.volume.value = -16;

  const bellSynth = new Tone.PluckSynth({
    attackNoise: 0.4, dampening: 6000, resonance: 0.9,
  }).connect(delay);
  bellSynth.volume.value = -14;

  Tone.getTransport().bpm.value = 78;

  // Pentatonic C minor (calm, oriental feel)
  const padChords = [
    ["C3", "Eb3", "G3", "Bb3"],
    ["Ab2", "C3", "Eb3", "G3"],
    ["F2", "Ab2", "C3", "Eb3"],
    ["G2", "Bb2", "D3", "F3"],
  ];
  let chordIndex = 0;
  pattern = new Tone.Loop((time) => {
    pad.triggerAttackRelease(padChords[chordIndex], "1m", time);
    chordIndex = (chordIndex + 1) % padChords.length;
  }, "1m");

  const bassNotes = ["C2", "Ab1", "F2", "G2"];
  let bassIdx = 0;
  bassSeq = new Tone.Loop((time) => {
    bassSynth.triggerAttackRelease(bassNotes[bassIdx], "2n", time);
    bassIdx = (bassIdx + 1) % bassNotes.length;
  }, "1m");

  // Sparse bell arpeggio
  const bellNotes = ["C5", "Eb5", "G5", "C6", "Bb5", "G5", "Eb5", "C5"];
  melodySeq = new Tone.Sequence((time, note: string) => {
    if (Math.random() > 0.4) bellSynth.triggerAttackRelease(note, "16n", time);
  }, bellNotes, "4n");

  // SFX instruments
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.3 },
  }).connect(sfxVolume);

  bell = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.4, release: 0.3 },
    harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 0.5,
  }).connect(sfxVolume);
  bell.volume.value = -22;

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 4,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
  }).connect(sfxVolume);
  kick.volume.value = -12;

  noiseSnap = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
  }).connect(sfxVolume);
  noiseSnap.volume.value = -22;
}

export async function startMusic() {
  if (!started) await initAudio();
  if (isMusicPlaying) return;
  const Tone = await ensureTone();
  if (!Tone) return;
  pattern?.start(0);
  bassSeq?.start("1m");
  melodySeq?.start("2m");
  Tone.getTransport().start();
  isMusicPlaying = true;
}

export async function stopMusic() {
  const Tone = await ensureTone();
  if (!Tone) return;
  pattern?.stop();
  bassSeq?.stop();
  melodySeq?.stop();
  Tone.getTransport().stop();
  isMusicPlaying = false;
}

export function setMusicVolume(db: number) {
  requestedMusicVol = db;
  if (musicVolume) musicVolume.volume.value = db;
}
export function setSfxVolume(db: number) {
  requestedSfxVol = db;
  if (sfxVolume) sfxVolume.volume.value = db;
}

/** Mirrors `settings.sound`. Silences every sfx.* without tearing down audio. */
export function setSfxEnabled(on: boolean) {
  sfxEnabled = on;
  sfxEnabledExplicit = true;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

/** Both gates every sound effect answers to: the engine is up, and SFX are on. */
function sfxReady() {
  return started && sfxEnabled;
}

/**
 * Starts the audio engine on the learner's first genuine gesture.
 *
 * initAudio() used to run only at the end of onboarding or from startMusic().
 * Background music defaults to off, so on every load after the first session
 * nothing ever called it: `started` stayed false and every sound effect was a
 * silent no-op for the whole session. The gesture requirement is real (browser
 * autoplay policy) — so we satisfy it with the first tap or key instead of
 * with a screen the learner only ever sees once.
 *
 * Deliberately does NOT start background music: that still needs its own
 * explicit toggle.
 */
export function armAudioOnFirstGesture() {
  if (typeof window === "undefined" || gestureArmed || started) return;
  gestureArmed = true;

  const events = ["pointerdown", "keydown", "touchstart"] as const;
  const onGesture = () => {
    for (const e of events) window.removeEventListener(e, onGesture);
    initAudio().catch(() => {
      // Re-arm so a later tap can retry. Without this the one-shot listener is
      // already gone and a single transient failure would mute the session.
      gestureArmed = false;
      armAudioOnFirstGesture();
    });
  };
  for (const e of events) {
    window.addEventListener(e, onGesture, { once: true, passive: true });
  }
}

// Arm on import. lib/audio.ts is pulled in by the app shell, so this runs once
// per client load; the window guard keeps it inert during SSR.
armAudioOnFirstGesture();

// === SFX ===
export const sfx = {
  click: () => {
    if (!sfxReady() || !synth) return;
    synth.triggerAttackRelease("E5", "32n");
  },
  correct: async () => {
    if (!sfxReady() || !synth) return;
    const Tone = await ensureTone();
    if (!Tone || !synth) return;
    // Previously read `(window as any).Tone?.now?.() ?? 0`. Tone is loaded as
    // a dynamic ES module and never attached to window, so that always fell
    // through to 0 and collapsed the arpeggio into a single instant chord.
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.08);
    synth.triggerAttackRelease("G5", "4n", now + 0.16);
  },
  wrong: () => {
    if (!sfxReady() || !synth) return;
    synth.triggerAttackRelease("E4", "8n");
    setTimeout(() => synth?.triggerAttackRelease("Bb3", "4n"), 90);
  },
  coin: () => {
    if (!sfxReady() || !bell) return;
    bell.triggerAttackRelease("C6", "32n");
    setTimeout(() => bell?.triggerAttackRelease("E6", "16n"), 50);
  },
  levelUp: async () => {
    if (!sfxReady() || !synth) return;
    const Tone = await ensureTone();
    if (!Tone || !synth) return;
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
    synth.triggerAttackRelease("C6", "4n", now + 0.3);
  },
  badge: async () => {
    if (!sfxReady() || !bell) return;
    const Tone = await ensureTone();
    if (!Tone || !bell) return;
    const now = Tone.now();
    bell.triggerAttackRelease("E5", "8n", now);
    bell.triggerAttackRelease("G5", "8n", now + 0.12);
    bell.triggerAttackRelease("C6", "4n", now + 0.24);
  },
  drumroll: () => {
    if (!sfxReady() || !kick) return;
    kick.triggerAttackRelease("C2", "8n");
  },
  whoosh: () => {
    if (!sfxReady() || !noiseSnap) return;
    noiseSnap.triggerAttackRelease("8n");
  },
  sixSeven: async () => {
    if (!sfxReady() || !synth || !bell) return;
    const Tone = await ensureTone();
    if (!Tone || !synth || !bell) return;
    const now = Tone.now();
    synth.triggerAttackRelease("G4", "16n", now);
    synth.triggerAttackRelease("B4", "16n", now + 0.09);
    bell.triggerAttackRelease("D5", "8n", now + 0.22);
    bell.triggerAttackRelease("G5", "4n", now + 0.36);
  },
};

export function isAudioStarted() {
  return started;
}
