import type { Composition } from "./types";
import type { StudioInstrument } from "./audio";
import { validPitch } from "./music-instruments";

export type MusicLayer = { instrument: StudioInstrument; steps: number[] };
export type MusicEvent = { instrument: StudioInstrument; note: number; delayMs: number; step?: number };
export const INSTRUMENTS: StudioInstrument[] = ["keyboard", "percussion", "marimba", "synth", "harp", "flute"];
export const GRID_STEPS = 16;
export function validInstrument(value: unknown): StudioInstrument { return INSTRUMENTS.includes(value as StudioInstrument) ? value as StudioInstrument : "keyboard"; }
export function safeNotes(notes: unknown): number[] { return Array.isArray(notes) ? notes.filter(validPitch).slice(0, 256) : []; }
export function safeLayers(layers: unknown): MusicLayer[] {
  if (!Array.isArray(layers)) return [];
  return layers.slice(0, 4).map((layer) => ({
    instrument: validInstrument(layer?.instrument),
    steps: Array.from({ length: GRID_STEPS }, (_, i) => validPitch(layer?.steps?.[i]) && (layer.instrument !== "percussion" || layer.steps[i] <= 2) ? layer.steps[i] : -1),
  }));
}
export function compositionPlayback(composition: Pick<Composition, "notes" | "tempoMs" | "layers" | "instrument" | "bpm">): { events: MusicEvent[]; durationMs: number } {
  const bpm = Number.isFinite(composition.bpm) ? Math.min(160, Math.max(40, composition.bpm!)) : null;
  // Original recordings retain their saved millisecond timing.
  const interval = bpm ? 60000 / bpm / 2 : Number.isFinite(composition.tempoMs) ? Math.min(1500, Math.max(100, composition.tempoMs)) : 320;
  const instrument = validInstrument(composition.instrument);
  const events: MusicEvent[] = safeNotes(composition.notes).map((note, i) => ({ instrument, note: instrument === "percussion" ? note % 3 : note, delayMs: i * interval }));
  const layers = safeLayers(composition.layers);
  layers.forEach((layer) => layer.steps.forEach((note, step) => { if (note >= 0) events.push({ instrument: layer.instrument, note, delayMs: step * interval, step }); }));
  return { events: events.sort((a, b) => a.delayMs - b.delayMs), durationMs: Math.max(layers.length ? GRID_STEPS * interval : 0, ...events.map((event) => event.delayMs + interval), 0) };
}
