import { describe, expect, it } from "vitest";
import { encodePitch, musicIdea, pianoKeys, pitchFrequency, pitchLabel, pitchMidi, validPitch } from "./music-instruments";
import { compositionPlayback, safeLayers, safeNotes } from "./music-composition";
import type { LearnerProfile } from "./types";

describe("visual instruments", () => {
  it("retains the original eight pitches and labels", () => {
    expect(Array.from({ length: 8 }, (_, i) => pitchLabel(i))).toEqual(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]);
    expect(pitchFrequency(5)).toBe(440);
    expect(pitchFrequency(7)! / pitchFrequency(0)!).toBeCloseTo(2);
  });
  it("round trips all chromatic pitches in the supported range", () => {
    for (let midi = 48; midi <= 84; midi++) {
      expect(pitchMidi(encodePitch(midi))).toBe(midi);
      expect(validPitch(encodePitch(midi))).toBe(true);
    }
    for (const corrupt of [8, -1, 147, 185, NaN, 150.5, "0"]) expect(validPitch(corrupt)).toBe(false);
  });
  it("places sharp keys only between their correct neighbours", () => {
    const keys = pianoKeys(4);
    expect(keys.filter(k => k.sharp).map(k => k.label)).toEqual(["C♯4", "D♯4", "F♯4", "G♯4", "A♯4"]);
    expect(keys.filter(k => !k.sharp)).toHaveLength(8);
    expect(pianoKeys(4, 1, true).map(k => k.label)).toEqual(["C4", "D4", "E4", "F4", "G4"]);
    expect(pianoKeys(5, 2).at(-1)?.label).toBe("C6");
  });
  it("saves and replays chromatic melodies and layers without dropping black keys", () => {
    const sharp = encodePitch(61), lower = encodePitch(48);
    expect(safeNotes([0, sharp, lower])).toEqual([0, sharp, lower]);
    const result = compositionPlayback({ notes: [sharp, lower], tempoMs: 300, instrument: "harp" });
    expect(result.events.map(e => e.note)).toEqual([sharp, lower]);
    expect(result.events.every(e => e.instrument === "harp")).toBe(true);
    expect(safeLayers([{ instrument: "flute", steps: [sharp] }])[0].steps[0]).toBe(sharp);
    expect(safeLayers([{ instrument: "percussion", steps: [sharp] }])[0].steps[0]).toBe(-1);
    expect(compositionPlayback({ notes: [sharp, 7], tempoMs: 300, instrument: "percussion" }).events.map(e => e.note)).toEqual([2, 1]);
  });
  it("has a distinct prompt for every exact placement without assuming age or grade", () => {
    const titles = new Set<string>();
    for (const grade of Array.from({ length: 13 }, (_, i) => i + 1)) {
      const learner = { board: "cbse", grade } as LearnerProfile;
      titles.add(musicIdea(learner)!.title);
      expect(musicIdea({ ...learner, learningLanguage: "hi" })!.title).not.toBe(musicIdea(learner)!.title);
    }
    for (const level of ["nursery", "lkg", "ukg"] as const) titles.add(musicIdea({ board: null, grade: null, placement: { version: 1, kind: "early-years", level } } as LearnerProfile)!.title);
    expect(titles.size).toBe(16);
    expect(musicIdea()).toBeUndefined();
    expect(musicIdea({ grade: null, board: null } as LearnerProfile)).toBeUndefined();
  });
});
