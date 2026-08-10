"use client";

// Audio engine: procedural background music + sound effects using Tone.js.
// All audio requires a user gesture to start (browser autoplay policy).
//
// Tone is imported dynamically so it never lands in the server bundle and
// only loads once a learner actually triggers sound.

import type * as ToneT from "tone";

type ToneModule = typeof import("tone");

let started = false;
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

export async function initAudio(opts: { musicVol?: number; sfxVol?: number } = {}) {
  if (started) return;
  const Tone = await ensureTone();
  if (!Tone) return;
  await Tone.start();
  started = true;

  // Volume buses
  masterVolume = new Tone.Volume(-6).toDestination();
  musicVolume = new Tone.Volume(opts.musicVol ?? -16).connect(masterVolume);
  sfxVolume = new Tone.Volume(opts.sfxVol ?? -8).connect(masterVolume);

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
  if (musicVolume) musicVolume.volume.value = db;
}
export function setSfxVolume(db: number) {
  if (sfxVolume) sfxVolume.volume.value = db;
}

// === SFX ===
export const sfx = {
  click: () => {
    if (!started || !synth) return;
    synth.triggerAttackRelease("E5", "32n");
  },
  correct: async () => {
    if (!started || !synth) return;
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
    if (!started || !synth) return;
    synth.triggerAttackRelease("E4", "8n");
    setTimeout(() => synth?.triggerAttackRelease("Bb3", "4n"), 90);
  },
  coin: () => {
    if (!started || !bell) return;
    bell.triggerAttackRelease("C6", "32n");
    setTimeout(() => bell?.triggerAttackRelease("E6", "16n"), 50);
  },
  levelUp: async () => {
    if (!started || !synth) return;
    const Tone = await ensureTone();
    if (!Tone || !synth) return;
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
    synth.triggerAttackRelease("C6", "4n", now + 0.3);
  },
  badge: async () => {
    if (!started || !bell) return;
    const Tone = await ensureTone();
    if (!Tone || !bell) return;
    const now = Tone.now();
    bell.triggerAttackRelease("E5", "8n", now);
    bell.triggerAttackRelease("G5", "8n", now + 0.12);
    bell.triggerAttackRelease("C6", "4n", now + 0.24);
  },
  drumroll: () => {
    if (!started || !kick) return;
    kick.triggerAttackRelease("C2", "8n");
  },
  whoosh: () => {
    if (!started || !noiseSnap) return;
    noiseSnap.triggerAttackRelease("8n");
  },
  sixSeven: async () => {
    if (!started || !synth || !bell) return;
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
