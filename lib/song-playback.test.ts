import { describe, expect, it } from "vitest";
import { SONGS } from "./content/songs";
import { songPlayback } from "./song-playback";
import { compositionPlayback } from "./music-composition";

describe("spaced listening playback", () => {
  it("keeps every tune's notes and leaves audible space between notes and phrases", () => {
    for (const song of SONGS) {
      expect(song.phraseLengths.reduce((sum, n) => sum + n, 0)).toBe(song.notes.length);
      const plan = songPlayback(song, "flute", 80);
      expect(plan.events.map(e => e.note)).toEqual(song.notes);
      plan.events.slice(1).forEach((event, i) => {
        const previous = plan.events[i];
        expect(event.delayMs - previous.delayMs - previous.durationMs - 50).toBeGreaterThanOrEqual(120);
      });
      let end = 0;
      for (const length of song.phraseLengths.slice(0, -1)) {
        end += length;
        const last = plan.events[end - 1], next = plan.events[end];
        expect(next.delayMs - last.delayMs - last.durationMs - 50).toBeGreaterThan(400);
      }
    }
  });
  it("plays only the chosen phrase starting at zero and bounds the pace", () => {
    const song = SONGS[0], plan = songPlayback(song, "keyboard", 80, 1);
    expect(plan.events.map(e => e.note)).toEqual(song.notes.slice(7, 14));
    expect(plan.events[0].delayMs).toBe(0);
    expect(songPlayback(song, "keyboard", NaN)).toEqual(songPlayback(song, "keyboard", 80));
    expect(songPlayback(song, "keyboard", 10000)).toEqual(songPlayback(song, "keyboard", 120));
  });
  it("separates every instrument's saved playback while retaining note onset times", () => {
    for (const instrument of ["keyboard", "flute", "marimba", "synth", "harp", "percussion"] as const) {
      const plan = compositionPlayback({ notes: [0, 1, 2], tempoMs: 600, instrument });
      expect(plan.events.map(e => e.delayMs)).toEqual([0, 600, 1200]);
      expect(plan.events.every(e => e.durationMs + 50 + 120 <= 600)).toBe(true);
    }
  });
});
