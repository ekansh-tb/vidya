"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Music as MusicIcon, Play, Trash2, Square, Plus, Keyboard, Disc3, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Composition, GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

// Western + Hindustani sargam, mapped to keyboard keys.
const NOTES = [
  { id: 0, west: "C",  sargam: "सा",  freq: 261.63, hue: "#EF4444", key: "a", num: "1" },
  { id: 1, west: "D",  sargam: "रे",  freq: 293.66, hue: "#F97316", key: "s", num: "2" },
  { id: 2, west: "E",  sargam: "ग",   freq: 329.63, hue: "#FBBF24", key: "d", num: "3" },
  { id: 3, west: "F",  sargam: "म",   freq: 349.23, hue: "#84CC16", key: "f", num: "4" },
  { id: 4, west: "G",  sargam: "प",   freq: 392.00, hue: "#22D3EE", key: "g", num: "5" },
  { id: 5, west: "A",  sargam: "ध",   freq: 440.00, hue: "#A78BFA", key: "h", num: "6" },
  { id: 6, west: "B",  sargam: "नि",  freq: 493.88, hue: "#F472B6", key: "j", num: "7" },
  { id: 7, west: "C'", sargam: "सां", freq: 523.25, hue: "#FB7185", key: "k", num: "8" },
];

type SynthHandle = { play: (freq: number) => void; setVolume: (db: number) => void };

export function MusicView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [draft, setDraft] = useState<number[]>([]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRenameId, setShowRenameId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [tempoMs, setTempoMs] = useState(320);
  const synthRef = useRef<SynthHandle | null>(null);
  const playTimersRef = useRef<number[]>([]);
  const pressedRef = useRef<Set<string>>(new Set());

  const compositions = state.savedCompositions || [];

  // Tone.js synth
  useEffect(() => {
    let cancel = false;
    (async () => {
      const Tone = (await import("tone")) as typeof import("tone");
      await Tone.start();
      if (cancel) return;
      const synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.4, release: 0.5 },
      }).toDestination();
      synth.volume.value = -6;
      synthRef.current = {
        play: (freq: number) => synth.triggerAttackRelease(freq, "8n"),
        setVolume: (db: number) => { synth.volume.value = db; },
      };
    })();
    return () => {
      cancel = true;
      playTimersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // QWERTY keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore key events when typing in form fields (modal open)
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const k = e.key.toLowerCase();
      const note = NOTES.find((n) => n.key === k || n.num === k);
      if (note && !pressedRef.current.has(k)) {
        pressedRef.current.add(k);
        playNote(note.id);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      pressedRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  const playNote = (id: number) => {
    const note = NOTES[id];
    if (!note) return;
    synthRef.current?.play(note.freq);
    setActiveNote(id);
    window.setTimeout(() => setActiveNote((n) => (n === id ? null : n)), 220);
    if (recording) {
      setDraft((prev) => [...prev, id]);
    }
  };

  const startRecording = () => {
    sfx.click();
    setDraft([]);
    setRecording(true);
  };

  const stopRecording = () => {
    sfx.click();
    setRecording(false);
  };

  const playSequence = (notes: number[]) => {
    if (!notes.length || playing) return;
    sfx.click();
    setPlaying(true);
    playTimersRef.current.forEach((t) => window.clearTimeout(t));
    playTimersRef.current = [];
    notes.forEach((id, i) => {
      const t = window.setTimeout(() => {
        const note = NOTES[id];
        if (note) {
          synthRef.current?.play(note.freq);
          setActiveNote(id);
          window.setTimeout(() => setActiveNote((n) => (n === id ? null : n)), Math.min(220, tempoMs - 50));
        }
        if (i === notes.length - 1) window.setTimeout(() => setPlaying(false), tempoMs);
      }, i * tempoMs);
      playTimersRef.current.push(t);
    });
  };

  const stopPlayback = () => {
    playTimersRef.current.forEach((t) => window.clearTimeout(t));
    playTimersRef.current = [];
    setPlaying(false);
  };

  const openSaveModal = () => {
    if (!draft.length) return;
    sfx.click();
    setDraftName(suggestName());
    setShowSaveModal(true);
  };

  const suggestName = (): string => {
    const n = compositions.length + 1;
    return `Composition #${n}`;
  };

  const saveDraft = () => {
    if (!draft.length || !draftName.trim()) return;
    sfx.coin();
    const newComp: Composition = {
      id: `cmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: draftName.trim(),
      notes: draft,
      tempoMs,
      createdAt: new Date().toISOString(),
    };
    setState((p) => ({
      ...p,
      savedCompositions: [newComp, ...(p.savedCompositions || [])],
      xp: p.xp + 10,
    }));
    setDraft([]);
    setShowSaveModal(false);
  };

  const deleteComposition = (id: string) => {
    sfx.click();
    setState((p) => ({
      ...p,
      savedCompositions: (p.savedCompositions || []).filter((c) => c.id !== id),
    }));
  };

  const renameComposition = (id: string, name: string) => {
    sfx.click();
    setState((p) => ({
      ...p,
      savedCompositions: (p.savedCompositions || []).map((c) => c.id === id ? { ...c, name } : c),
    }));
    setShowRenameId(null);
  };

  const clearDraft = () => {
    sfx.click();
    setDraft([]);
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "var(--accent)" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <MusicIcon className="w-7 h-7" style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>Music Room</div>
              <div className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>Sargam & Solfège</div>
              <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Keyboard className="w-3.5 h-3.5" />
                Tap notes or use keyboard <span className="font-mono font-bold" style={{ color: "var(--text)" }}>A S D F G H J K</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Keyboard */}
        <div className="grid grid-cols-8 gap-1.5 mb-5">
          {NOTES.map((n) => {
            const isActive = activeNote === n.id;
            return (
              <motion.button
                key={n.id}
                whileTap={{ scale: 0.92 }}
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.22 }}
                onMouseDown={() => playNote(n.id)}
                onTouchStart={() => playNote(n.id)}
                className="relative rounded-[var(--radius-md)] py-6 px-1 flex flex-col items-center gap-1.5 transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(180deg, ${n.hue} 0%, ${n.hue}80 100%)`
                    : `${n.hue}1A`,
                  border: `1px solid ${n.hue}40`,
                  boxShadow: isActive ? `0 0 24px ${n.hue}aa` : "none",
                }}
              >
                <div className="font-display text-2xl font-bold font-deva text-white">{n.sargam}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/65">{n.west}</div>
                <div className="absolute bottom-1 right-1.5 text-[9px] font-mono font-bold text-white/40 uppercase">{n.key}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Draft melody strip */}
        <div className="glass-card p-4 mb-3 min-h-[80px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-faint)" }}>
              {recording ? <span style={{ color: "var(--error)" }}>● Recording</span> : "Draft"} · {draft.length} note{draft.length === 1 ? "" : "s"}
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>
              tempo {tempoMs}ms
            </div>
          </div>
          {draft.length === 0 ? (
            <div className="text-sm italic" style={{ color: "var(--text-faint)" }}>
              {recording ? "Tap any note or press A–K." : "Hit Record, then play notes."}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {draft.map((id, i) => {
                const n = NOTES[id];
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, y: -4 }}
                    animate={{ scale: 1, y: 0 }}
                    className="rounded-lg px-2 py-1 text-xs font-bold font-deva"
                    style={{ background: `${n.hue}30`, color: n.hue }}
                  >
                    {n.sargam}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tempo slider */}
        <div className="glass-card p-3 mb-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: "var(--text-faint)" }}>
            <span>Playback tempo</span>
            <span>{tempoMs <= 200 ? "fast" : tempoMs <= 360 ? "normal" : "slow"}</span>
          </div>
          <input
            type="range"
            min={120} max={600} step={20}
            value={tempoMs}
            onChange={(e) => setTempoMs(parseInt(e.target.value, 10))}
            className="w-full accent-[color:var(--accent)]"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {!recording ? (
            <Button onClick={startRecording} className="w-full" variant="primary">
              <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-300" /> Record</span>
            </Button>
          ) : (
            <Button onClick={stopRecording} className="w-full" variant="danger">
              <span className="inline-flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> Stop</span>
            </Button>
          )}
          {!playing ? (
            <Button onClick={() => playSequence(draft)} disabled={!draft.length} className="w-full" variant="secondary">
              <span className="inline-flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Preview</span>
            </Button>
          ) : (
            <Button onClick={stopPlayback} className="w-full" variant="secondary">
              <span className="inline-flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> Stop</span>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <Button onClick={openSaveModal} disabled={!draft.length} className="w-full" variant="success">
            <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Save composition</span>
          </Button>
          <Button onClick={clearDraft} disabled={!draft.length} className="w-full" variant="ghost">
            <span className="inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Clear draft</span>
          </Button>
        </div>

        {/* Saved compositions */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>Your compositions</h3>
          <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>{compositions.length}</span>
        </div>
        {compositions.length === 0 ? (
          <div className="glass-card p-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            <Disc3 className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent)" }} />
            No saved tunes yet. Record a melody, give it a name, and it&apos;ll live here forever.
          </div>
        ) : (
          <div className="space-y-2">
            {compositions.map((c) => (
              <CompositionRow
                key={c.id}
                composition={c}
                onPlay={() => playSequence(c.notes)}
                onLoad={() => { sfx.click(); setDraft(c.notes); setTempoMs(c.tempoMs); }}
                onDelete={() => deleteComposition(c.id)}
                onRename={(name) => renameComposition(c.id, name)}
                isPlaying={playing}
                rename={showRenameId === c.id}
                onStartRename={() => setShowRenameId(c.id)}
                onCancelRename={() => setShowRenameId(null)}
              />
            ))}
          </div>
        )}

        <div className="mt-6 glass-card p-4">
          <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--text-faint)" }}>Try these</div>
          <div className="space-y-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <div><span className="font-bold font-deva" style={{ color: "var(--accent)" }}>सा रे ग म प ध नि सां</span> — full ascending scale</div>
            <div><span className="font-bold font-deva" style={{ color: "var(--accent)" }}>सा ग प सां</span> — the major chord arpeggio</div>
            <div><span className="font-bold font-deva" style={{ color: "var(--accent)" }}>सा रे ग रे सा</span> — a simple little phrase</div>
            <div><span className="font-bold font-deva" style={{ color: "var(--accent)" }}>सा सा ग सा प म ग रे सा</span> — try this folk hook</div>
          </div>
        </div>
      </div>

      {/* Save modal */}
      <AnimatePresence>
        {showSaveModal && (
          <SaveModal
            initial={draftName}
            onCancel={() => setShowSaveModal(false)}
            onSave={(n) => { setDraftName(n); saveDraft(); }}
            noteCount={draft.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CompositionRow({
  composition, onPlay, onLoad, onDelete, onRename, isPlaying, rename, onStartRename, onCancelRename,
}: {
  composition: Composition;
  onPlay: () => void;
  onLoad: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  isPlaying: boolean;
  rename: boolean;
  onStartRename: () => void;
  onCancelRename: () => void;
}) {
  const [draftName, setDraftName] = useState(composition.name);
  useEffect(() => { setDraftName(composition.name); }, [composition.name]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-3 flex items-center gap-3"
    >
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 active:scale-95 disabled:opacity-50"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        aria-label="Play"
      >
        <Play className="w-5 h-5 fill-current" />
      </button>
      <div className="flex-1 min-w-0">
        {rename ? (
          <div className="flex gap-1.5">
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && draftName.trim()) onRename(draftName.trim());
                if (e.key === "Escape") onCancelRename();
              }}
              className="flex-1 bg-transparent outline-none px-2 py-1 rounded text-sm font-display font-bold"
              style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
            />
            <button
              onClick={() => draftName.trim() && onRename(draftName.trim())}
              className="text-xs font-bold rounded px-2"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >save</button>
          </div>
        ) : (
          <div className="font-display font-bold text-sm truncate" style={{ color: "var(--text)" }}>{composition.name}</div>
        )}
        <div className="flex items-center gap-2 text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>
          <span>{composition.notes.length} notes</span>
          <span>·</span>
          <span>{new Date(composition.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {composition.notes.slice(0, 16).map((id, i) => {
            const n = NOTES[id];
            return (
              <span
                key={i}
                className="rounded px-1 text-[9px] font-bold font-deva"
                style={{ background: `${n.hue}25`, color: n.hue }}
              >{n.sargam}</span>
            );
          })}
          {composition.notes.length > 16 && <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>+{composition.notes.length - 16}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={onLoad}
          className="text-[10px] font-bold uppercase tracking-wider rounded px-2 py-1"
          style={{ background: "var(--surface)", color: "var(--text-muted)" }}
          title="Load to draft"
        >
          Edit
        </button>
        <div className="flex gap-1">
          {!rename && (
            <button
              onClick={onStartRename}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "var(--surface)", color: "var(--text-muted)" }}
              aria-label="Rename"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm(`Delete "${composition.name}"?`)) onDelete();
            }}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: "rgba(244,63,94,0.12)", color: "var(--error)" }}
            aria-label="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SaveModal({
  initial, onCancel, onSave, noteCount,
}: {
  initial: string;
  onCancel: () => void;
  onSave: (name: string) => void;
  noteCount: number;
}) {
  const [name, setName] = useState(initial);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="fixed inset-x-0 bottom-0 z-[81] max-w-2xl mx-auto rounded-t-[var(--radius-lg)] glass-strong p-6 pb-8"
      >
        <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--border-strong)" }} />
        <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--accent)" }}>Save composition</div>
        <div className="font-display text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Name your tune</div>
        <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{noteCount} note{noteCount === 1 ? "" : "s"} · saved to your library forever.</div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onSave(name.trim());
            if (e.key === "Escape") onCancel();
          }}
          placeholder="Sunday morning raag…"
          className="w-full bg-transparent outline-none px-3 py-3 rounded-[var(--radius-md)] text-base font-display font-bold"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
        />
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" className="w-full" onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()}>
            Save · +10 XP
          </Button>
        </div>
      </motion.div>
    </>
  );
}
