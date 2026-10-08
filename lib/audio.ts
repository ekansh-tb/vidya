"use client";

import type * as ToneT from "tone";
import { readPersistedAudioSettings, type AudioSettings } from "./audio-bootstrap";
import { pitchFrequency, validPitch } from "./music-instruments";

export type StudioInstrument = "keyboard" | "marimba" | "synth" | "percussion" | "harp" | "flute";
export type StudioHandle = { play: (note: number, at?: number) => void; stop: () => void; dispose: () => void };
type Disposable = { dispose: () => unknown };
let started = false;
let intentAuthorized = false;
let initPromise: Promise<void> | null = null;
let muted = false;
let sfxEnabled = true;
let requestedMusicVol = -24;
let requestedSfxVol = -18;
let musicWanted = false;
let studioCount = 0;
let narrating = false;
let master: ToneT.Volume | null = null;
let musicBus: ToneT.Volume | null = null;
let effectsBus: ToneT.Volume | null = null;
let ambientClock: ToneT.Clock | null = null;
let effectSynth: ToneT.PolySynth | null = null;
const resources: Disposable[] = [];
const studios = new Set<StudioHandle>();
const listeners = new Set<() => void>();
let removeVisibility: (() => void) | null = null;

const clampDb = (db: number) => Number.isFinite(db) ? Math.min(0, Math.max(-60, db)) : -24;
function hidden() { return typeof document !== "undefined" && document.hidden; }
function own<T extends Disposable>(node: T): T { resources.push(node); return node; }
function notify() { listeners.forEach((fn) => fn()); }
export function subscribeAudio(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function isAudioStarted() { return started; }
export function isAudioAuthorized() { return intentAuthorized; }
/** A remembered preference is not a gesture. Call only from labelled sound actions. */
export function authorizeAudioFromGesture() { intentAuthorized = true; }
export function isAudioMuted() { return muted; }
export function isSfxEnabled() { return sfxEnabled; }
function applyAmbience() {
  if (musicBus) { musicBus.volume.value = narrating ? requestedMusicVol - 12 : requestedMusicVol; musicBus.mute = muted || studioCount > 0 || hidden(); }
  if (started && musicWanted && !muted && !studioCount && !hidden()) ambientClock?.start();
  else ambientClock?.stop();
}
export function syncAudioSettings(settings: AudioSettings) {
  muted = settings.audioMuted ?? false;
  sfxEnabled = settings.sound;
  requestedMusicVol = clampDb(settings.musicVolume);
  requestedSfxVol = clampDb(settings.sfxVolume);
  musicWanted = settings.music;
  if (master) master.mute = muted || hidden();
  if (effectsBus) effectsBus.volume.value = requestedSfxVol;
  applyAmbience();
  notify();
}

/** Only call from an intentional sound-enabling action, never from hydration. */
export async function enableAudioFromGesture() {
  if (typeof window === "undefined") return;
  authorizeAudioFromGesture();
  const Tone = await import("tone");
  await Tone.start();
  if (!started) {
    initPromise ??= buildAudio(Tone).catch((error) => { initPromise = null; throw error; });
    await initPromise;
  }
  applyAmbience();
  notify();
}
export function initAudio(opts: { musicVol?: number; sfxVol?: number } = {}) {
  if (opts.musicVol !== undefined) requestedMusicVol = clampDb(opts.musicVol);
  if (opts.sfxVol !== undefined) requestedSfxVol = clampDb(opts.sfxVol);
  return enableAudioFromGesture();
}
async function buildAudio(Tone: typeof import("tone")) {
  const saved = readPersistedAudioSettings();
  if (saved) syncAudioSettings(saved);
  master = own(new Tone.Volume(-8).toDestination());
  master.mute = muted || hidden();
  musicBus = own(new Tone.Volume(requestedMusicVol).connect(master));
  effectsBus = own(new Tone.Volume(requestedSfxVol).connect(master));
  const reverb = own(new Tone.Reverb({ decay: 2, wet: 0.25 }).connect(musicBus));
  const pad = own(new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" }, envelope: { attack: 0.8, decay: 0.4, sustain: 0.3, release: 1.8 },
  }).connect(reverb));
  pad.volume.value = -10;
  const chords = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["D3", "F3", "A3"], ["G3", "B3", "D4"]];
  let chord = 0;
  // A private clock avoids changing BPM or stopping another room's Transport.
  ambientClock = own(new Tone.Clock((time) => {
    if (!muted && !studioCount && !hidden()) pad.triggerAttackRelease(chords[chord++ % chords.length], 3, time);
  }, 0.2));
  effectSynth = own(new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.12, sustain: 0, release: 0.15 },
  }).connect(effectsBus));
  started = true;
  if (typeof document !== "undefined") {
    const onVisibility = () => {
      if (master) master.mute = muted || hidden();
      if (hidden()) studios.forEach((handle) => handle.stop());
      applyAmbience();
    };
    document.addEventListener("visibilitychange", onVisibility);
    removeVisibility = () => document.removeEventListener("visibilitychange", onVisibility);
  }
}
export async function startMusic() { musicWanted = true; applyAmbience(); }
export async function stopMusic() { musicWanted = false; applyAmbience(); }
export function setMusicVolume(db: number) { requestedMusicVol = clampDb(db); applyAmbience(); }
export function setSfxVolume(db: number) { requestedSfxVol = clampDb(db); if (effectsBus) effectsBus.volume.value = requestedSfxVol; }
export function setSfxEnabled(on: boolean) { sfxEnabled = on; }
export function setMasterMuted(on: boolean) { muted = on; if (master) master.mute = on || hidden(); if (on) studios.forEach((handle) => handle.stop()); applyAmbience(); notify(); }
export function setStudioActive(on: boolean) { studioCount = Math.max(0, studioCount + (on ? 1 : -1)); applyAmbience(); }
export function setNarrationActive(on: boolean) { narrating = on; applyAmbience(); }
// Compatibility export: arbitrary taps no longer silently authorize sound.
export function armAudioOnFirstGesture() {}

export async function createStudioInstrument(kind: StudioInstrument): Promise<StudioHandle> {
  await enableAudioFromGesture();
  const Tone = await import("tone");
  if (!effectsBus) throw new Error("Sound is unavailable. Try enabling sound again.");
  const nodes: Disposable[] = [];
  const pitched = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: kind === "synth" || kind === "harp" ? "triangle" : "sine" },
    envelope: kind === "marimba" ? { attack: 0.001, decay: 0.3, sustain: 0, release: 0.15 }
      : kind === "harp" ? { attack: 0.002, decay: 0.5, sustain: 0, release: 0.4 }
      : kind === "flute" ? { attack: 0.08, decay: 0.08, sustain: 0.55, release: 0.18 }
      : { attack: 0.015, decay: 0.2, sustain: 0.15, release: 0.3 },
  }).connect(effectsBus);
  nodes.push(pitched);
  const drum = kind === "percussion" ? new Tone.MembraneSynth({ volume: -8 }).connect(effectsBus) : null;
  const shaker = kind === "percussion" ? new Tone.NoiseSynth({ volume: -20, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 } }).connect(effectsBus) : null;
  if (drum) nodes.push(drum);
  if (shaker) nodes.push(shaker);
  let disposed = false;
  const handle: StudioHandle = {
    play(note, at) {
      if (disposed || muted || hidden() || !validPitch(note) || (kind === "percussion" && note > 2)) return;
      const time = at ?? Tone.now() + 0.01;
      if (drum && note < 2) drum.triggerAttackRelease(note === 0 ? "C2" : "G2", 0.12, time);
      else if (shaker) shaker.triggerAttackRelease(0.05, time);
      else pitched.triggerAttackRelease(pitchFrequency(note)!, kind === "flute" ? 0.45 : 0.2, time);
    },
    stop() { pitched.releaseAll(); drum?.triggerRelease(); },
    dispose() { if (disposed) return; disposed = true; handle.stop(); nodes.forEach((node) => node.dispose()); studios.delete(handle); },
  };
  studios.add(handle);
  return handle;
}
export function disposeAudio() {
  studios.forEach((handle) => handle.dispose());
  ambientClock?.stop();
  resources.splice(0).reverse().forEach((node) => node.dispose());
  removeVisibility?.(); removeVisibility = null;
  master = musicBus = effectsBus = null; ambientClock = null; effectSynth = null;
  started = false; intentAuthorized = false; initPromise = null; studioCount = 0; narrating = false;
  notify();
}
function effect(notes: string[]) {
  if (!started || !sfxEnabled || muted || hidden() || !effectSynth) return;
  notes.forEach((note) => effectSynth?.triggerAttackRelease(note, 0.12));
}
export const sfx = {
  click: () => effect(["E5"]), correct: () => effect(["C5", "E5", "G5"]),
  wrong: () => effect(["E4"]), coin: () => effect(["C6"]), levelUp: () => effect(["C5", "E5", "G5", "C6"]),
  badge: () => effect(["E5", "G5"]), drumroll: () => effect(["C3"]), whoosh: () => effect(["G4"]), sixSeven: () => effect(["G4", "B4", "D5"]),
};
