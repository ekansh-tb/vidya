"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Volume2 } from "lucide-react";
import type { StudioInstrument } from "@/lib/audio";
import { pianoKeys, pitchLabel } from "@/lib/music-instruments";
import styles from "./instrument-player.module.css";

export const instrumentLabels: Record<StudioInstrument, string> = {
  keyboard: "Mini Piano", percussion: "Drum pads", marimba: "Marimba", synth: "Synthesizer", harp: "Mini Harp", flute: "Flute tones",
};
const hindiLabels: Record<StudioInstrument, string> = {
  keyboard: "छोटा पियानो", percussion: "ताल पैड", marimba: "मरिम्बा", synth: "सिंथेसाइज़र", harp: "छोटी वीणा", flute: "बाँसुरी के स्वर",
};
export const drumLabels = ["Low drum", "High drum", "Shaker"];

export function InstrumentPlayer({ instrument, activeNote, expectedNote, disabled, simple, language, calm, volume, onVolume, onPlay }: {
  instrument: StudioInstrument; activeNote: number | null; expectedNote?: number;
  disabled: boolean; simple: boolean; language: "en" | "hi"; calm: boolean;
  volume: number; onVolume: (value: number) => void; onPlay: (id: number) => void;
}) {
  const [octave, setOctave] = useState(4);
  const [wide, setWide] = useState(false);
  const hi = language === "hi";
  const keys = useMemo(() => pianoKeys(octave, wide && !simple ? 2 : 1, simple && expectedNote === undefined), [octave, wide, simple, expectedNote]);
  const white = useMemo(() => keys.filter(key => !key.sharp), [keys]);
  const playable = useMemo(() => instrument === "percussion" ? [0, 1, 2] : (instrument === "keyboard" || instrument === "synth" ? keys : white).map(key => key.id), [instrument, keys, white]);
  // Song practice uses the legacy C4 octave. Always reveal its next key.
  useEffect(() => { if (expectedNote !== undefined) setOctave(4); }, [expectedNote]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (disabled || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
      if (target?.tagName === "BUTTON" && !target.closest("[data-instrument-keys]")) return;
      const key = instrument === "percussion" ? ["a", "s", "d"].indexOf(event.key.toLowerCase()) : keys.find(key => key.shortcut === event.key.toLowerCase())?.id;
      if (key !== undefined && playable.includes(key)) { event.preventDefault(); onPlay(key); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [disabled, instrument, keys, playable, onPlay]);
  const press = (id: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => { if (event.button === 0 && !disabled) onPlay(id); },
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => { if (event.detail === 0 && !disabled) onPlay(id); },
  });
  const selected = (id: number) => activeNote === id;
  return <section className={styles.player} data-calm={calm} aria-label={hi ? hindiLabels[instrument] : instrumentLabels[instrument]}>
    <div className={styles.toolbar}>
      <h2>{hi ? hindiLabels[instrument] : instrumentLabels[instrument]}</h2>
      {!simple && instrument !== "percussion" && <div className={styles.range}>
        <button type="button" aria-label={hi ? "निचला सप्तक" : "Lower octave"} disabled={octave <= 3 || disabled || expectedNote !== undefined} onClick={() => setOctave(octave - 1)}><Minus size={18}/></button>
        <span className="tabular-nums">{keys[0]?.label} to {keys.at(-1)?.label}</span>
        <button type="button" aria-label={hi ? "ऊँचा सप्तक" : "Higher octave"} disabled={octave >= (wide ? 4 : 5) || disabled || expectedNote !== undefined} onClick={() => setOctave(octave + 1)}><Plus size={18}/></button>
      </div>}
    </div>
    <label className={styles.volume}><Volume2 size={18} aria-hidden="true"/><span>{hi ? "आवाज़" : "Volume"}</span><input aria-label={hi ? "वाद्य की आवाज़" : "Instrument volume"} type="range" min={-60} max={0} value={volume} onChange={event => onVolume(Number(event.target.value))}/></label>
    <div data-instrument-keys className={styles.surface}>
      {instrument === "keyboard" ? <div className={styles.pianoScroll}><div className={styles.piano} style={{ minWidth: white.length * 44 }}>
        {white.map(key => <button type="button" key={key.id} disabled={disabled} {...press(key.id)} aria-label={`${key.label}${expectedNote === key.id ? hi ? ", अगला स्वर" : ", next note" : ""}`} data-active={selected(key.id)} data-next={expectedNote === key.id} className={styles.whiteKey}><span>{key.label}</span><kbd>{key.shortcut?.toUpperCase()}</kbd></button>)}
        {keys.filter(key => key.sharp).map(key => {
          const before = white.filter(note => note.midi < key.midi).length;
          return <button type="button" key={key.id} disabled={disabled} {...press(key.id)} aria-label={key.label} data-active={selected(key.id)} className={styles.blackKey} style={{ left: `${before / white.length * 100}%` }}><kbd>{key.shortcut?.toUpperCase()}</kbd><span>{key.label}</span></button>;
        })}
      </div></div> : instrument === "percussion" ? <div className={styles.drums}>
        {drumLabels.map((label, id) => <button key={label} type="button" disabled={disabled} {...press(id)} data-active={selected(id)} className={styles.drum}><span className={styles.drumSkin} aria-hidden="true">{id === 2 ? "•••" : ""}</span><strong>{hi ? ["नीची ताल", "ऊँची ताल", "झुनझुना"][id] : label}</strong><kbd>{["A", "S", "D"][id]}</kbd></button>)}
      </div> : <div className={`${styles.notes} ${styles[instrument]}`}>
        {(instrument === "synth" ? keys : white).map((key, index) => <button type="button" key={key.id} disabled={disabled} {...press(key.id)} aria-label={key.label} data-active={selected(key.id)} data-next={expectedNote === key.id} className={styles.note} style={{ "--note-order": index, "--note-count": white.length } as React.CSSProperties}>
          <span className={styles.noteArt} aria-hidden="true"/>
          <strong>{key.label}</strong><kbd>{key.shortcut?.toUpperCase()}</kbd>
        </button>)}
      </div>}
    </div>
    <div className={styles.footer}>
      <span role="status" aria-live="off">{activeNote === null ? hi ? "बजाने के लिए छुओ" : "Touch to play" : instrument === "percussion" ? drumLabels[activeNote % 3] : pitchLabel(activeNote)}</span>
      {!simple && instrument === "keyboard" && <button type="button" disabled={disabled} aria-pressed={wide} onClick={() => { setWide(!wide); setOctave(Math.min(octave, 4)); }}>{hi ? wide ? "कम कुंजियाँ" : "और कुंजियाँ" : wide ? "Fewer keys" : "More keys"}</button>}
    </div>
    <p className={styles.hint}>{simple ? hi ? "एक कुंजी छुओ। रुको और सुनो।" : "Touch a key. Pause and listen." : hi ? "कुंजी छूने से ध्वनि शुरू होगी। पियानो पर और कुंजियाँ देखने के लिए किनारे की ओर स्क्रॉल करो।" : "Touch a key to start sound. Scroll across the piano for more keys, or use the keyboard letters."}</p>
  </section>;
}
