"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Wind, Heart, Droplet, Pause, Play, Activity as ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

type Phase = "inhale" | "hold" | "exhale" | "rest";

// Historical IDs remain compatible. These are optional visual cues, not medical advice.
const PATTERNS: Record<string, { name: string; phases: { phase: Phase; secs: number }[]; cycles: number; desc: string }> = {
  box: { name: "A gentle pause", desc: "Let your breath feel comfortable. You can ignore the timing or stop whenever you like.", cycles: 3, phases: [{phase:"inhale",secs:3},{phase:"exhale",secs:3}] },
  "4-7-8": { name: "Notice and rest", desc: "Notice one thing around you, then relax at your own pace. No breath holding needed.", cycles: 3, phases: [{phase:"rest",secs:5}] },
  belly: { name: "Soft waves", desc: "Follow a soft wave if it feels comfortable. Breathing normally is welcome too.", cycles: 3, phases: [{phase:"inhale",secs:3},{phase:"exhale",secs:4}] },
};

const PHASE_COPY: Record<Phase, string> = {
  inhale: "Breathe in",
  hold:   "Hold",
  exhale: "Breathe out",
  rest:   "Rest",
};

export function WellnessView({
  state, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const osReduce = useReducedMotion();
  const reduce = osReduce || state.settings.motion === false;
  // Two halves of one room: wind DOWN (breathe) and wake UP (move).
  const [mode, setMode] = useState<"breathe" | "move">("breathe");
  const [patternId, setPatternId] = useState<keyof typeof PATTERNS>("box");
  const pattern = PATTERNS[patternId];
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [tick, setTick] = useState(0); // seconds into current phase
  const [done, setDone] = useState(false);

  const phase = pattern.phases[phaseIdx];
  const totalCycles = pattern.cycles;

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        if (next >= phase.secs) {
          // advance phase
          setPhaseIdx((p) => {
            const nextPhase = p + 1;
            if (nextPhase >= pattern.phases.length) {
              setCycle((c) => {
                const nc = c + 1;
                if (nc >= totalCycles) {
                  setRunning(false);
                  setDone(true);
                  return 0;
                }
                return nc;
              });
              return 0;
            }
            return nextPhase;
          });
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, phase.secs, pattern.phases.length, totalCycles]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setRunning(false); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  const toggle = () => {
    sfx.click();
    if (done) {
      // restart
      setDone(false);
      setPhaseIdx(0);
      setCycle(0);
      setTick(0);
    }
    setRunning((r) => !r);
  };

  const switchPattern = (id: keyof typeof PATTERNS) => {
    sfx.click();
    setPatternId(id);
    setRunning(false);
    setPhaseIdx(0);
    setCycle(0);
    setTick(0);
    setDone(false);
  };

  const scaleVal =
    phase.phase === "inhale" ? 1 + (tick / phase.secs) * 0.5
    : phase.phase === "exhale" ? 1.5 - (tick / phase.secs) * 0.5
    : phase.phase === "hold" ? 1.5
    : 1;

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        {/* Wind down, or wake up. Both belong in the same room. */}
        <div className="flex gap-2 mb-5 p-1 rounded-2xl glass" role="tablist" aria-label="Wellness mode">
          {([
            { id: "breathe" as const, label: "Breathe", icon: Wind },
            { id: "move" as const, label: "Move", icon: ActivityIcon },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={mode === id}
              onClick={() => { sfx.click(); setMode(id); }}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all inline-flex items-center justify-center gap-1.5 ${
                mode === id
                  ? "bg-emerald-500/25 text-[var(--success)] ring-1 ring-emerald-400/40"
                  : "text-[var(--text-muted)] active:scale-95"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {mode === "move" ? <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><h2 className="font-display text-xl font-bold">A little time away from the screen</h2><p className="mt-3 text-[var(--text-muted)]">Choose a comfortable break with a grown-up. You can rest, change position, or enjoy your own familiar play. Skip anything that feels uncomfortable.</p><p className="mt-3 text-sm text-[var(--text-muted)]">The previous guided exercise collection is being reviewed for suitability. Your saved history stays here, and breaks never need a score.</p></section> : (
        <>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#34D399" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
              <Wind className="w-7 h-7 text-[var(--success)]" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--success)]">Wellness Break</div>
              <div className="font-display text-2xl font-bold text-[var(--text)]">{pattern.name}</div>
              <div className="text-sm text-[var(--text-muted)]">{pattern.desc}</div>
            </div>
          </div>
        </motion.div>

        {/* Pattern picker */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {(Object.keys(PATTERNS) as Array<keyof typeof PATTERNS>).map((id) => (
            <button
              key={id}
              onClick={() => switchPattern(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                patternId === id ? "bg-emerald-500/25 text-[var(--success)] ring-1 ring-emerald-400/40" : "glass text-[var(--text-muted)]"
              }`}
            >
              {PATTERNS[id].name}
            </button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={reduce ? {} : { opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                background: "radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={reduce ? {} : { scale: scaleVal }}
              transition={{ duration: 1, ease: "linear" }}
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(52,211,153,0.55) 0%, rgba(34,211,238,0.3) 60%, transparent 100%)",
                boxShadow: "0 0 60px rgba(52,211,153,0.5)",
              }}
            >
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-1">
                  {PHASE_COPY[phase.phase]}
                </div>
                <div className="font-display text-6xl font-bold text-[var(--text)] tabular-nums">
                  {phase.secs - tick}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-sm text-[var(--text-muted)]">
              Cycle <span className="font-bold text-[var(--text)]">{Math.min(cycle + 1, totalCycles)}</span> of {totalCycles}
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={toggle}>
          <span className="inline-flex items-center gap-2">
            {done ? "Try again" : running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5 fill-current" /> {phaseIdx === 0 && tick === 0 && cycle === 0 ? "Begin" : "Resume"}</>}
          </span>
        </Button>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 glass-card p-4 text-center border border-emerald-400/30"
          >
            <div className="text-[var(--success)] font-display font-bold text-lg">Beautifully done.</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">You took a pause. Rest never needs a score.</div>
          </motion.div>
        )}

        {/* Tips */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Tip icon={<Wind className="w-4 h-4 text-[var(--success)]" />} label="Stretch your arms above your head" />
          <Tip icon={<Droplet className="w-4 h-4 text-[var(--accent)]" />} label="Sip some water" />
          <Tip icon={<Heart className="w-4 h-4 text-[var(--error)]" />} label="Smile — even just a little" />
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-[11px] text-[var(--text-muted)] leading-tight">{label}</div>
    </div>
  );
}
