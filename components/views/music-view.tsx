"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, Music as MusicIcon, Play, Square, Plus, Keyboard, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Composition, GameState, LearnerProfile } from "@/lib/types";
import { createStudioInstrument, setStudioActive, subscribeAudio, isAudioMuted, type StudioHandle, type StudioInstrument, sfx } from "@/lib/audio";
import { SoundControl } from "@/components/audio/sound-control";
import { compositionPlayback, safeLayers, safeNotes, validInstrument, INSTRUMENTS, GRID_STEPS, type MusicLayer } from "@/lib/music-composition";
import { searchSongs, type Song } from "@/lib/content/songs";

const NOTES = [
  { id: 0, west: "C", sargam: "सा", key: "a", num: "1" },
  { id: 1, west: "D", sargam: "रे", key: "s", num: "2" },
  { id: 2, west: "E", sargam: "ग", key: "d", num: "3" },
  { id: 3, west: "F", sargam: "म", key: "f", num: "4" },
  { id: 4, west: "G", sargam: "प", key: "g", num: "5" },
  { id: 5, west: "A", sargam: "ध", key: "h", num: "6" },
  { id: 6, west: "B", sargam: "नि", key: "j", num: "7" },
  { id: 7, west: "C′", sargam: "सां", key: "k", num: "8" },
].map((note) => ({ ...note, hue: "var(--accent)" }));
const instrumentLabel: Record<StudioInstrument, string> = { keyboard: "Keyboard", percussion: "Percussion", marimba: "Marimba", synth: "Synthesizer" };
const DRUMS = ["Low drum", "High drum", "Shaker"];

export function MusicView({ state, setState, onBack, learner }: { learner?: LearnerProfile; state: GameState; setState: (updater: (s: GameState) => GameState) => void; onBack: () => void }) {
  const [instrument, setInstrument] = useState<StudioInstrument>(() => validInstrument(state.musicDraft?.instrument));
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [draft, setDraft] = useState<number[]>(() => safeNotes(state.musicDraft?.notes));
  const [layers, setLayers] = useState<MusicLayer[]>(() => safeLayers(state.musicDraft?.layers));
  const [bpm, setBpm] = useState(state.musicDraft?.bpm ?? 90);
  const [legacyTempo, setLegacyTempo] = useState<number | null>(state.musicDraft && !state.musicDraft.bpm ? state.musicDraft.tempoMs : null);
  const [pitch, setPitch] = useState(0);
  const [name, setName] = useState(state.musicDraft?.name ?? "");
  const [status, setStatus] = useState("");
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [practice, setPractice] = useState<{ song: Song; index: number; correct: number; wrong: number } | null>(null);
  const handles = useRef(new Map<StudioInstrument, StudioHandle>());
  const pending = useRef(new Map<StudioInstrument, Promise<StudioHandle>>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const alive = useRef(true);
  const playbackId = useRef(0);
  const compositions = state.savedCompositions || [];
  function stopPlayback() {
    playbackId.current++;
    timers.current.forEach(clearTimeout); timers.current = [];
    handles.current.forEach((handle) => handle.stop());
    setPlaying(false); setActiveNote(null); setActiveStep(null);
  }
  useEffect(() => {
    alive.current = true;
    const ownedHandles = handles.current;
    setStudioActive(true);
    const stopIfNeeded = () => { if (document.hidden || isAudioMuted()) { stopPlayback(); setRecording(false); } };
    document.addEventListener("visibilitychange", stopIfNeeded);
    const unsubscribe = subscribeAudio(stopIfNeeded);
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout); timers.current = [];
      ownedHandles.forEach((handle) => handle.dispose()); ownedHandles.clear();
      setStudioActive(false); unsubscribe(); document.removeEventListener("visibilitychange", stopIfNeeded);
    };
    // The lifecycle owns only this studio's instruments and timers.
  }, []);
  async function getHandle(kind: StudioInstrument) {
    const existing = handles.current.get(kind);
    if (existing) return existing;
    let promise = pending.current.get(kind);
    if (!promise) { promise = createStudioInstrument(kind); pending.current.set(kind, promise); }
    try {
      const handle = await promise;
      if (!alive.current) { handle.dispose(); throw new Error("Studio closed"); }
      handles.current.set(kind, handle); return handle;
    } finally { pending.current.delete(kind); }
  }
  async function playNote(id: number) {
    if (playing || isAudioMuted()) { if (isAudioMuted()) setStatus("Sound is muted. Use Unmute sound to hear your instruments."); return; }
    try {
      const handle = await getHandle(instrument);
      if (!alive.current) return;
      handle.play(id); setActiveNote(id);
      timers.current.push(setTimeout(() => setActiveNote(null), 180));
      if (recording) setDraft((notes) => notes.length < 256 ? [...notes, id] : notes);
      if (practice && instrument !== "percussion") {
        if (id === practice.song.notes[practice.index]) {
          if (practice.index + 1 === practice.song.notes.length) { setStatus("You played the whole melody. Try changing its rhythm or instrument."); setPractice(null); }
          else setPractice({ ...practice, index: practice.index + 1, correct: practice.correct + 1 });
        } else setPractice({ ...practice, wrong: practice.wrong + 1 });
      }
    } catch { if (alive.current) setStatus("Sound could not start. Use Enable sound and try again."); }
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement;
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || element?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(element?.tagName)) return;
      const note = NOTES.find((n) => n.key === event.key.toLowerCase() || n.num === event.key);
      if (note && (instrument !== "percussion" || note.id < 3)) { event.preventDefault(); void playNote(note.id); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument, recording, playing, practice]);
  async function playComposition(composition: Pick<Composition, "notes" | "tempoMs" | "layers" | "instrument" | "bpm">) {
    stopPlayback();
    if (isAudioMuted()) { setStatus("Unmute sound before playing your composition."); return; }
    const plan = compositionPlayback(composition);
    if (!plan.events.length) return;
    const token = playbackId.current;
    setPlaying(true); setRecording(false);
    try {
      await Promise.all([...new Set(plan.events.map((event) => event.instrument))].map(getHandle));
      if (!alive.current || token !== playbackId.current) return;
      plan.events.forEach((event) => timers.current.push(setTimeout(() => {
        if (token !== playbackId.current) return;
        handles.current.get(event.instrument)?.play(event.note);
        setActiveNote(event.note); setActiveStep(event.step ?? null);
      }, event.delayMs)));
      timers.current.push(setTimeout(() => { if (token === playbackId.current) { setPlaying(false); setActiveNote(null); setActiveStep(null); } }, plan.durationMs));
    } catch { if (alive.current && token === playbackId.current) { setPlaying(false); setStatus("Playback could not start. Try enabling sound again."); } }
  }
  const draftComposition = { notes: draft, tempoMs: legacyTempo ?? 60000 / bpm / 2, bpm: legacyTempo === null ? bpm : undefined, instrument, layers };
  const fingerprint = JSON.stringify({ ...draftComposition, name });
  const savedFingerprint = useRef(fingerprint);
  useEffect(() => {
    if (fingerprint === savedFingerprint.current) return;
    savedFingerprint.current = fingerprint;
    const snapshot = { ...JSON.parse(fingerprint), updatedAt: new Date().toISOString() };
    setState((previous) => ({ ...previous, musicDraft: snapshot }));
  }, [fingerprint, setState]);
  const hasDraft = draft.length > 0 || layers.some((layer) => layer.steps.some((note) => note >= 0));
  function saveDraft() {
    if (!hasDraft || !name.trim()) return;
    const composition: Composition = { id: `cmp-${crypto.randomUUID()}`, name: name.trim().slice(0, 80), ...draftComposition, version: 2, createdAt: new Date().toISOString() };
    setState((previous) => ({ ...previous, savedCompositions: [composition, ...(previous.savedCompositions || [])] }));
    setStatus(`Saved ${composition.name}.`); setName("");
  }
  function loadComposition(composition: Composition) {
    stopPlayback(); setRecording(false); setDraft(safeNotes(composition.notes)); setLayers(safeLayers(composition.layers));
    setInstrument(validInstrument(composition.instrument)); setBpm(composition.bpm ?? 90); setLegacyTempo(composition.bpm ? null : composition.tempoMs); setName(composition.name); setStatus("Loaded into your draft. The original saved composition is unchanged.");
  }
  const simple = learner?.placement?.kind === "early-years";
  return <ReducedMotionProvider><div className="min-h-screen pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-6" style={{ color: "var(--text)" }}>
    <div className="flex flex-wrap justify-between gap-3 items-center mb-5"><button onClick={() => { stopPlayback(); onBack(); }} className="inline-flex items-center gap-1 min-h-11"><ChevronLeft size={20} /> Back to learning</button><SoundControl settings={state.settings} onChange={(update) => setState((previous) => ({ ...previous, settings: { ...previous.settings, ...update } }))} /></div>
    <section className="glass-card p-5 mb-5"><div className="flex items-center gap-3"><MusicIcon size={32} style={{ color: "var(--accent)" }} /><div><h1 className="font-display text-2xl font-bold">Make a little music</h1><p className="text-sm" style={{ color: "var(--text-muted)" }}>Try a sound, find a rhythm, and make it your own.</p></div></div></section>
    <fieldset className="mb-4"><legend className="font-bold text-sm mb-2">Choose an instrument</legend><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{INSTRUMENTS.map((kind) => <button key={kind} type="button" aria-pressed={instrument === kind} disabled={playing || recording} onClick={() => { setInstrument(kind); setPractice(null); }} className="rounded-xl p-3 min-h-12 font-bold text-sm" style={{ border: `2px solid ${instrument === kind ? "var(--accent)" : "var(--border)"}`, background: instrument === kind ? "var(--accent-soft)" : "var(--surface)", color: "var(--text)" }}>{instrumentLabel[kind]}</button>)}</div></fieldset>
    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Tap a key, or use {instrument === "percussion" ? "A, S, D" : "A, S, D, F, G, H, J, K"}. Playing a key starts sound.</p>
    <div className={`grid ${instrument === "percussion" ? "grid-cols-3" : "grid-cols-4 sm:grid-cols-8"} gap-2 mb-5`}>{NOTES.slice(0, instrument === "percussion" ? 3 : 8).map((note) => <button key={note.id} type="button" onClick={() => void playNote(note.id)} disabled={playing} aria-label={instrument === "percussion" ? DRUMS[note.id] : `${note.west}, ${note.sargam}`} className="rounded-xl min-h-24 p-3 flex flex-col gap-1 items-center justify-center" style={{ border: `2px solid ${activeNote === note.id || practice?.song.notes[practice.index] === note.id ? "var(--accent)" : "var(--border-strong)"}`, background: activeNote === note.id ? "var(--accent-soft)" : "var(--surface)", color: "var(--text)" }}><span className="font-display text-xl font-bold">{instrument === "percussion" ? DRUMS[note.id] : note.west}</span>{instrument !== "percussion" && <span className="font-deva text-sm">{note.sargam}</span>}<span className="text-xs" style={{ color: "var(--text-muted)" }}>{note.key.toUpperCase()}</span></button>)}</div>
    {practice && <section className="glass-card p-4 mb-4"><strong>{practice.song.title}</strong><p className="text-sm">Note {practice.index + 1} of {practice.song.notes.length}. Follow the outlined key, at your own pace.</p><button className="min-h-11 font-bold text-sm" onClick={() => setPractice(null)}>Finish practice</button></section>}
    <section className="glass-card p-4 mb-4"><h2 className="font-display text-lg font-bold mb-2">Your melody</h2><p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{recording ? "Recording the keys you choose, without using your microphone." : "Record a short phrase. Add a beat below when you are ready."}</p><div className="flex gap-2 flex-wrap"><Button disabled={playing} onClick={() => { setRecording(!recording); if (!recording) setDraft([]); }}>{recording ? <><Square size={16} /> Stop recording</> : "Record keys"}</Button><Button variant="ghost" disabled={!draft.length || playing} onClick={() => setDraft([])}>Clear melody</Button></div><p className="text-sm mt-3 break-words">{draft.length ? draft.map((id) => instrument === "percussion" ? DRUMS[id % 3] : NOTES[id].west).join(" · ") : "Your chosen notes will appear here."}</p></section>
    {!simple && <section className="glass-card p-4 mb-4"><div className="flex justify-between gap-3 flex-wrap"><h2 className="font-display text-lg font-bold">Build a rhythm</h2><Button variant="secondary" disabled={layers.length >= 4 || playing} onClick={() => setLayers([...layers, { instrument, steps: Array(GRID_STEPS).fill(-1) }])}><Plus size={16} /> Add {instrumentLabel[instrument]} layer</Button></div><p className="text-sm mt-2 mb-3" style={{ color: "var(--text-muted)" }}>Each square is half a beat. Tap to place a sound, tap again to remove it.</p><label className="block text-sm mb-3">Sound for new squares <select value={pitch} onChange={(event) => setPitch(Number(event.target.value))} className="rounded-lg min-h-11 ml-2 px-3" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>{NOTES.slice(0, instrument === "percussion" ? 3 : 8).map((note) => <option value={note.id} key={note.id}>{instrument === "percussion" ? DRUMS[note.id % 3] : note.west}</option>)}</select></label>
      {layers.map((layer, index) => <div key={index} className="mt-3"><div className="flex justify-between items-center"><span className="font-bold text-sm">{instrumentLabel[layer.instrument]} layer {index + 1}</span><button type="button" className="min-h-11 text-sm" disabled={playing} onClick={() => setLayers(layers.filter((_, i) => i !== index))}>Remove layer {index + 1}</button></div><div className="grid grid-cols-4 sm:grid-cols-8 gap-2">{layer.steps.map((note, step) => <button type="button" key={step} disabled={playing} aria-pressed={note >= 0} aria-label={`${instrumentLabel[layer.instrument]} layer ${index + 1}, step ${step + 1}, ${note < 0 ? "rest" : layer.instrument === "percussion" ? DRUMS[note] : NOTES[note].west}`} onClick={() => setLayers(layers.map((item, i) => i === index ? { ...item, steps: item.steps.map((old, s) => s === step ? old < 0 ? layer.instrument === "percussion" ? pitch % 3 : pitch : -1 : old) } : item))} className="rounded-lg min-h-11 text-xs font-bold" style={{ border: `2px solid ${activeStep === step ? "var(--accent)" : "var(--border)"}`, background: note >= 0 ? "var(--accent-soft)" : "var(--surface)", color: "var(--text)" }}>{step + 1}{note >= 0 ? ` · ${layer.instrument === "percussion" ? DRUMS[note] : NOTES[note].west}` : ""}</button>)}</div></div>)}
    </section>}
    <section className="glass-card p-4 mb-4"><label className="block text-sm font-bold">Tempo: {legacyTempo === null ? `${bpm} beats per minute` : `original timing, ${legacyTempo} milliseconds per note`}<input aria-label="Tempo in beats per minute" type="range" min={40} max={160} step={5} value={bpm} disabled={playing} onChange={(event) => { setBpm(Number(event.target.value)); setLegacyTempo(null); }} className="block w-full min-h-11" /></label><div className="flex gap-2 flex-wrap mb-3"><Button disabled={!hasDraft} onClick={() => playing ? stopPlayback() : void playComposition(draftComposition)}>{playing ? <><Square size={16} /> Stop playback</> : <><Play size={16} /> Play your draft</>}</Button></div><label className="block text-sm">Composition name<input maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="A rainy afternoon" className="block w-full mt-2 mb-3 rounded-lg px-3 min-h-11" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} /></label><Button disabled={!hasDraft || !name.trim() || playing} onClick={saveDraft}>Save composition</Button></section>
    <p role="status" className="text-sm min-h-6 mb-3">{status}</p>
    <section><h2 className="font-display text-lg font-bold mb-3">Your saved music</h2>{!compositions.length && <p className="text-sm" style={{ color: "var(--text-muted)" }}>Save a melody or rhythm to play it next time.</p>}<div className="space-y-3">{compositions.map((composition) => <div key={composition.id} className="glass-card p-4"><h3 className="font-bold break-words">{composition.name}</h3><p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{safeNotes(composition.notes).length} notes · {safeLayers(composition.layers).length} rhythm layers</p><div className="flex gap-2 mt-2 flex-wrap"><Button disabled={playing} onClick={() => void playComposition(composition)} aria-label={`Play ${composition.name}`}>Play</Button><Button variant="secondary" onClick={() => loadComposition(composition)}>Edit a copy</Button><Button variant="ghost" onClick={() => { if (window.confirm(`Delete ${composition.name}?`)) setState((previous) => ({ ...previous, savedCompositions: previous.savedCompositions.filter((item) => item.id !== composition.id) })); }}>Delete</Button></div></div>)}</div></section>
    {instrument !== "percussion" && <SongLearner onPlay={(notes) => void playComposition({ notes, tempoMs: 60000 / bpm / 2, instrument, bpm })} onLoad={(song) => { setDraft(song.notes); setLayers([]); setName(song.title); setLegacyTempo(null); }} onPractice={(song) => setPractice({ song, index: 0, correct: 0, wrong: 0 })} isPlaying={playing} practicingSongId={practice?.song.id ?? null} />}
  </div></ReducedMotionProvider>;
}

// Keyboard letter per note id, kept in sync with the NOTES array above.
const KEY_LETTERS = ["A", "S", "D", "F", "G", "H", "J", "K"];

function SongLearner({
  onPlay,
  onLoad,
  onPractice,
  isPlaying,
  practicingSongId,
}: {
  onPlay: (notes: number[]) => void;
  onLoad: (song: Song) => void;
  onPractice: (song: Song) => void;
  isPlaying: boolean;
  practicingSongId: string | null;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => searchSongs(query), [query]);
  const selected = results.find((s) => s.id === selectedId) ?? null;
  const visible = expanded ? results : results.slice(0, 4);

  return (
    <div className="mt-2 glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Learn a song
        </div>
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
          · search a tune, see the keys
        </span>
      </div>

      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedId(null); }}
          placeholder="Try 'twinkle', 'jingle', 'ode'…"
          aria-label="Search tunes"
          className="w-full pl-9 pr-3 py-2.5 rounded-[var(--radius-md)] text-sm outline-none transition"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {results.length === 0 ? (
        <div className="text-center py-4 text-sm" style={{ color: "var(--text-muted)" }}>
          No traditional songs match &quot;{query}&quot;. We only carry public-domain tunes (no copyrighted music).
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {visible.map((song) => {
              const isSel = song.id === selectedId;
              return (
                <button
                  key={song.id}
                  onClick={() => { sfx.click(); setSelectedId(isSel ? null : song.id); }}
                  className="w-full text-left px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-3 transition active:scale-[0.99]"
                  style={{
                    background: isSel ? "var(--accent-soft)" : "var(--surface)",
                    border: `1px solid ${isSel ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm truncate" style={{ color: "var(--text)" }}>{song.title}</div>
                    <div className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>
                      {song.tradition} · {song.notes.length} notes · {song.difficulty}
                    </div>
                  </div>
                  <span
                    className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: isSel ? "var(--accent)" : "var(--surface-strong)",
                      color: isSel ? "var(--text-on-accent)" : "var(--text-muted)",
                    }}
                  >
                    {isSel ? "open" : "show"}
                  </span>
                </button>
              );
            })}
          </div>

          {results.length > 4 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-[10px] uppercase tracking-widest font-bold"
              style={{ color: "var(--accent)" }}
            >
              {expanded ? "Show fewer ↑" : `Show ${results.length - 4} more ↓`}
            </button>
          )}

          {selected && (
            <SelectedSong
              song={selected}
              onPlay={() => onPlay(selected.notes)}
              onLoad={() => onLoad(selected)}
              onPractice={() => onPractice(selected)}
              isPlaying={isPlaying}
              isPracticing={practicingSongId === selected.id}
            />
          )}
        </>
      )}
    </div>
  );
}

function SelectedSong({
  song, onPlay, onLoad, onPractice, isPlaying, isPracticing,
}: {
  song: Song;
  onPlay: () => void;
  onLoad: () => void;
  onPractice: () => void;
  isPlaying: boolean;
  isPracticing: boolean;
}) {
  return (
    <motion.div
      key={song.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-[var(--radius-md)] p-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="font-display font-bold text-base" style={{ color: "var(--text)" }}>{song.title}</div>
        <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>{song.notes.length} keys</div>
      </div>

      {song.sargamHint && (
        <div className="text-xs mb-2 font-deva" style={{ color: "var(--accent)" }}>{song.sargamHint}</div>
      )}

      <div className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: "var(--text-faint)" }}>
        Press these keys
      </div>

      {/* Note chip strip with both sargam + keyboard letter */}
      <div className="flex flex-wrap gap-1 mb-3">
        {song.notes.map((id, i) => {
          const n = NOTES[id];
          return (
            <div
              key={i}
              className="rounded px-1.5 py-1 flex flex-col items-center gap-0 leading-none"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--border)" }}
            >
              <span className="font-deva text-[11px] font-bold" style={{ color: n.hue }}>{n.sargam}</span>
              <span className="text-[8px] font-mono font-bold uppercase" style={{ color: n.hue, opacity: 0.7 }}>
                {KEY_LETTERS[id]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onPlay}
          disabled={isPlaying || isPracticing}
          variant="primary"
          className="w-full"
        >
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Play className="w-3.5 h-3.5 fill-current" /> Play
          </span>
        </Button>
        <Button
          onClick={onPractice}
          disabled={isPlaying || isPracticing}
          variant="success"
          className="w-full"
        >
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Keyboard className="w-3.5 h-3.5" /> {isPracticing ? "Active" : "Practice"}
          </span>
        </Button>
        <Button onClick={onLoad} variant="ghost" className="w-full">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Draft
          </span>
        </Button>
      </div>
      <div className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--text-faint)" }}>
        <strong style={{ color: "var(--text-muted)" }}>Practice mode</strong> outlines the next key. Press it to advance, at your own pace.
      </div>

      <div className="text-[9px] mt-2 leading-relaxed" style={{ color: "var(--text-faint)" }}>
        Source: {song.source}
      </div>
    </motion.div>
  );
}
