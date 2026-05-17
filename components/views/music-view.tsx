"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Music, Play, Trash2, Save, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

// Western + Hindustani sargam, mapped together.
// C major scale + the bandish notes Sa Re Ga Ma Pa Dha Ni Sa'
const NOTES = [
  { id: 0, west: "C",  sargam: "सा",  freq: 261.63, hue: "#EF4444" },
  { id: 1, west: "D",  sargam: "रे",  freq: 293.66, hue: "#F97316" },
  { id: 2, west: "E",  sargam: "ग",   freq: 329.63, hue: "#FBBF24" },
  { id: 3, west: "F",  sargam: "म",   freq: 349.23, hue: "#84CC16" },
  { id: 4, west: "G",  sargam: "प",   freq: 392.00, hue: "#22D3EE" },
  { id: 5, west: "A",  sargam: "ध",   freq: 440.00, hue: "#A78BFA" },
  { id: 6, west: "B",  sargam: "नि",  freq: 493.88, hue: "#F472B6" },
  { id: 7, west: "C'", sargam: "सां", freq: 523.25, hue: "#FB7185" },
];

type SynthHandle = {
  play: (freq: number) => void;
};

export function MusicView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [melody, setMelody] = useState<number[]>(state.savedMelody || []);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const synthRef = useRef<SynthHandle | null>(null);
  const recStartRef = useRef<number>(0);
  const playTimersRef = useRef<number[]>([]);

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
      };
    })();
    return () => { cancel = true; };
  }, []);

  const playNote = (id: number) => {
    const note = NOTES[id];
    if (!note) return;
    synthRef.current?.play(note.freq);
    setActiveNote(id);
    window.setTimeout(() => setActiveNote((n) => (n === id ? null : n)), 220);
    if (recording) {
      setMelody((prev) => [...prev, id]);
    }
  };

  const startRecording = () => {
    sfx.click();
    setMelody([]);
    setRecording(true);
    recStartRef.current = Date.now();
  };

  const stopRecording = () => {
    sfx.click();
    setRecording(false);
  };

  const playMelody = () => {
    if (!melody.length || playing) return;
    sfx.click();
    setPlaying(true);
    playTimersRef.current.forEach((t) => window.clearTimeout(t));
    playTimersRef.current = [];
    melody.forEach((id, i) => {
      const t = window.setTimeout(() => {
        playNote(id);
        if (i === melody.length - 1) {
          window.setTimeout(() => setPlaying(false), 350);
        }
      }, i * 320);
      playTimersRef.current.push(t);
    });
  };

  const stopPlayback = () => {
    playTimersRef.current.forEach((t) => window.clearTimeout(t));
    playTimersRef.current = [];
    setPlaying(false);
  };

  const saveMelody = () => {
    sfx.coin();
    setState((p) => ({ ...p, savedMelody: melody, xp: p.xp + 10 }));
  };

  const clearMelody = () => {
    sfx.click();
    setMelody([]);
    setState((p) => ({ ...p, savedMelody: null }));
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#A78BFA" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
              <Music className="w-7 h-7 text-violet-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-violet-300">Music Room</div>
              <div className="font-display text-2xl font-bold text-white">Sargam & Solfege</div>
              <div className="text-sm text-white/60">Tap notes · record · play back</div>
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
                transition={{ duration: 0.25 }}
                onClick={() => playNote(n.id)}
                className="relative rounded-2xl py-6 px-1 flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(180deg, ${n.hue} 0%, ${n.hue}80 100%)`
                    : `${n.hue}1A`,
                  border: `1px solid ${n.hue}40`,
                  boxShadow: isActive ? `0 0 24px ${n.hue}aa` : "none",
                }}
              >
                <div className="font-display text-2xl font-bold font-deva text-white">{n.sargam}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/60">{n.west}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Melody strip */}
        <div className="glass-card p-4 mb-4 min-h-[80px]">
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
            Your melody · {melody.length} note{melody.length === 1 ? "" : "s"}
          </div>
          <AnimatePresence>
            {melody.length === 0 ? (
              <div className="text-sm text-white/40 italic">
                {recording ? "Recording — tap any note." : "Hit Record to start a melody."}
              </div>
            ) : (
              <motion.div
                className="flex flex-wrap gap-1.5"
                initial={false}
              >
                {melody.map((id, i) => {
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
              </motion.div>
            )}
          </AnimatePresence>
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
            <Button onClick={playMelody} disabled={!melody.length} className="w-full" variant="secondary">
              <span className="inline-flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Play</span>
            </Button>
          ) : (
            <Button onClick={stopPlayback} className="w-full" variant="secondary">
              <span className="inline-flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> Stop</span>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={saveMelody} disabled={!melody.length} className="w-full" variant="success">
            <span className="inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save (+10 XP)</span>
          </Button>
          <Button onClick={clearMelody} disabled={!melody.length} className="w-full" variant="ghost">
            <span className="inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Clear</span>
          </Button>
        </div>

        <div className="mt-5 glass-card p-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Try these</div>
          <div className="space-y-2 text-xs text-white/70">
            <div><span className="font-bold font-deva">सा रे ग म प</span> — ascending scale</div>
            <div><span className="font-bold font-deva">सा ग प सां</span> — the major chord arpeggio</div>
            <div><span className="font-bold font-deva">सा रे ग रे सा</span> — a simple little phrase</div>
          </div>
        </div>
      </div>
    </div>
  );
}
