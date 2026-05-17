"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Wind, Heart, Droplet, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const PATTERNS: Record<string, { name: string; phases: { phase: Phase; secs: number }[]; cycles: number; desc: string }> = {
  box: {
    name: "Box breathing",
    desc: "4 in · 4 hold · 4 out · 4 hold — astronauts use this to stay calm",
    cycles: 4,
    phases: [
      { phase: "inhale", secs: 4 },
      { phase: "hold",   secs: 4 },
      { phase: "exhale", secs: 4 },
      { phase: "rest",   secs: 4 },
    ],
  },
  "4-7-8": {
    name: "4-7-8 breath",
    desc: "Breathe in 4 · hold 7 · breathe out 8. A calm-down trick for big feelings.",
    cycles: 3,
    phases: [
      { phase: "inhale", secs: 4 },
      { phase: "hold",   secs: 7 },
      { phase: "exhale", secs: 8 },
    ],
  },
  belly: {
    name: "Belly breathing",
    desc: "Soft 5 in · 5 out. Place your hand on your tummy and feel it rise.",
    cycles: 5,
    phases: [
      { phase: "inhale", secs: 5 },
      { phase: "exhale", secs: 5 },
    ],
  },
};

const PHASE_COPY: Record<Phase, string> = {
  inhale: "Breathe in",
  hold:   "Hold",
  exhale: "Breathe out",
  rest:   "Rest",
};

export function WellnessView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const reduce = useReducedMotion();
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
    if (done) {
      sfx.coin();
      setState((p) => ({ ...p, xp: p.xp + 12, coins: p.coins + 3 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

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
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#34D399" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
              <Wind className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-300">Wellness Break</div>
              <div className="font-display text-2xl font-bold text-white">{pattern.name}</div>
              <div className="text-sm text-white/60">{pattern.desc}</div>
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
                patternId === id ? "bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400/40" : "glass text-white/60"
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
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/70 mb-1">
                  {PHASE_COPY[phase.phase]}
                </div>
                <div className="font-display text-6xl font-bold text-white tabular-nums">
                  {phase.secs - tick}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-sm text-white/70">
              Cycle <span className="font-bold text-white">{Math.min(cycle + 1, totalCycles)}</span> of {totalCycles}
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
            <div className="text-emerald-300 font-display font-bold text-lg">Beautifully done.</div>
            <div className="text-sm text-white/70 mt-1">+12 XP · +3 coins for taking care of yourself.</div>
          </motion.div>
        )}

        {/* Tips */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Tip icon={<Wind className="w-4 h-4 text-emerald-300" />} label="Stretch your arms above your head" />
          <Tip icon={<Droplet className="w-4 h-4 text-cyan-300" />} label="Sip some water" />
          <Tip icon={<Heart className="w-4 h-4 text-rose-300" />} label="Smile — even just a little" />
        </div>
      </div>
    </div>
  );
}

function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-[11px] text-white/70 leading-tight">{label}</div>
    </div>
  );
}
