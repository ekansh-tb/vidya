import { describe, expect, it } from "vitest";
import { compositionPlayback, safeLayers, safeNotes } from "./music-composition";

describe("music composition compatibility", () => {
  it("plays an older composition with its own saved millisecond timing", () => {
    expect(compositionPlayback({ notes: [0, 4, 2], tempoMs: 600 })).toEqual({
      events: [{ instrument: "keyboard", note: 0, delayMs: 0 }, { instrument: "keyboard", note: 4, delayMs: 600 }, { instrument: "keyboard", note: 2, delayMs: 1200 }], durationMs: 1800,
    });
  });
  it("plays simultaneous rhythm layers and melody at the stored tempo", () => {
    const result = compositionPlayback({ notes: [0, 2], tempoMs: 320, bpm: 60, instrument: "marimba", layers: [{ instrument: "percussion", steps: [0, -1, 2] }] });
    expect(result.events).toEqual([{ instrument: "marimba", note: 0, delayMs: 0 }, { instrument: "percussion", note: 0, delayMs: 0, step: 0 }, { instrument: "marimba", note: 2, delayMs: 500 }, { instrument: "percussion", note: 2, delayMs: 1000, step: 2 }]);
    expect(result.durationMs).toBe(8000);
  });
  it("normalizes corrupt or oversized archived drafts before rendering", () => {
    expect(safeNotes([0, 8, -1, "2", 1.2, 7])).toEqual([0, 7]);
    const layers = safeLayers([{ instrument: "percussion", steps: [0, 7, 2] }, { instrument: "bad", steps: [1] }]);
    expect(layers[0].steps.slice(0, 4)).toEqual([0, -1, 2, -1]);
    expect(layers[1].instrument).toBe("keyboard");
    expect(layers[1].steps).toHaveLength(16);
    expect(safeNotes(Array(300).fill(0))).toHaveLength(256);
  });
});
