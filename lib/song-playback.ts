import type { Song } from "./content/songs";
import type { StudioInstrument } from "./audio";
import { noteDurationMs, type MusicPlayback } from "./music-composition";

/** An intentionally spaced listening arrangement, with a breath between phrases. */
export function songPlayback(song: Song, instrument: StudioInstrument, bpm = 80, phrase?: number): MusicPlayback {
  const beat = 60000 / (Number.isFinite(bpm) ? Math.max(40, Math.min(120, bpm)) : 80);
  let offset = 0, cursor = 0;
  const events: MusicPlayback["events"] = [];
  song.phraseLengths.forEach((length, index) => {
    const notes = song.notes.slice(offset, offset + length); offset += length;
    if (phrase !== undefined && index !== phrase) return;
    notes.forEach((note, noteIndex) => {
      const interval = beat * (noteIndex === notes.length - 1 ? 2 : 1);
      events.push({ instrument, note, delayMs: cursor, durationMs: noteDurationMs(interval) });
      cursor += interval;
    });
    cursor += beat / 2;
  });
  return { events, durationMs: cursor };
}
