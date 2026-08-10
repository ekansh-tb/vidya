"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, Mic, Sparkles, Check, Calendar, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiyaCompanion } from "@/components/effects/diya";
import { Mascot } from "@/components/ui/mascot";
import { xpToLevel } from "@/lib/economy";
import { todayKey, daysBetween } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/audio";
import type { GameState } from "@/lib/types";

type Briefing = {
  greeting: string;
  thought: string;
  attribution: string;
  plan: string[];
  closing: string;
  source: "ai" | "local";
};

/** Structural check before we trust a response. `plan` matters most — the
 *  render maps over it, so a missing array is a crash rather than a blank. */
function isBriefing(v: unknown): v is Briefing {
  if (!v || typeof v !== "object") return false;
  const b = v as Partial<Briefing>;
  return (
    typeof b.greeting === "string" &&
    typeof b.thought === "string" &&
    typeof b.closing === "string" &&
    Array.isArray(b.plan)
  );
}

/**
 * Client-side fallback assembly.
 *
 * The route has its own offline fallback, but it cannot help when the request
 * never reaches it (offline, blocked, 403 from the origin check). The school
 * should always open, so we mirror it here rather than showing a dead room.
 */
function localBriefing(name?: string): Briefing {
  const learner = name?.split(" ")[0] || "scholar";
  const thoughts = [
    { line: "Dream is not what you see in sleep — it is the thing that does not let you sleep.", by: "A.P.J. Abdul Kalam" },
    { line: "Live as if you were to die tomorrow. Learn as if you were to live forever.", by: "Mahatma Gandhi" },
    { line: "You can't cross the sea merely by standing and staring at the water.", by: "Rabindranath Tagore" },
    { line: "Go, get education. Be self-reliant, be industrious.", by: "Savitribai Phule" },
  ];
  // Stable per-day pick so the thought doesn't change on every re-render.
  const today = todayKey();
  const seed = [...today].reduce((s, c) => s + c.charCodeAt(0), 0);
  const t = thoughts[seed % thoughts.length]!;
  return {
    greeting: `Good morning, ${learner}. The Vidya assembly begins.`,
    thought: t.line,
    attribution: t.by,
    plan: [
      "Pick one subject to warm up",
      "Try today's quest",
      "Read something in the Library",
      "Take a wellness break",
    ],
    closing: "Let's make today a good one. Diya is waiting in the lobby.",
    source: "local",
  };
}

export function AssemblyView({
  state, setState, onBack, voiceEnabled, grade, board, school,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  voiceEnabled: boolean;
  grade?: number;
  board?: string;
  /** The learner's own school. Sent so the AI principal never names a school
   *  this learner does not attend. */
  school?: string;
}) {
  const today = todayKey();
  const alreadyAttended = state.lastAssemblyDate === today;
  const { level } = xpToLevel(state.xp);

  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"intro" | "thought" | "plan" | "closing">("intro");
  const [attended, setAttended] = useState(alreadyAttended);

  useEffect(() => {
    let cancel = false;
    setLoading(true);

    // The route can legitimately answer non-200 — 403 when the same-origin
    // check rejects (some webviews strip Origin AND Referer), 429 when rate
    // limited. Previously the error JSON was assigned straight to `briefing`,
    // so `briefing.plan.map(...)` threw and, with no error boundary in the
    // tree, whitescreened the whole app. Validate before trusting it, and
    // fall back to a local assembly so the school always opens.
    (async () => {
      try {
        const res = await fetch("/api/assembly", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: state.name, streak: state.streak, level, grade, board, school }),
        });
        if (!res.ok) throw new Error(`assembly ${res.status}`);
        const data: unknown = await res.json();
        if (!isBriefing(data)) throw new Error("assembly payload malformed");
        if (cancel) return;
        setBriefing(data);
      } catch {
        if (cancel) return;
        setBriefing(localBriefing(state.name));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (briefing && voiceEnabled && stage === "intro") {
      speak(briefing.greeting);
    }
  }, [briefing, voiceEnabled, stage]);

  const next = () => {
    sfx.click();
    if (stage === "intro") {
      setStage("thought");
      if (voiceEnabled && briefing) speak(briefing.thought);
    } else if (stage === "thought") {
      setStage("plan");
    } else if (stage === "plan") {
      setStage("closing");
      if (voiceEnabled && briefing) speak(briefing.closing);
    } else {
      attend();
    }
  };

  const attend = () => {
    if (attended) {
      onBack();
      return;
    }
    sfx.coin();
    setState((p) => {
      const wasYesterday = p.lastAssemblyDate
        ? daysBetween(p.lastAssemblyDate, today) === 1
        : false;
      const newAssemblyStreak = wasYesterday
        ? (p.assemblyStreak || 0) + 1
        : p.lastAssemblyDate === today
        ? p.assemblyStreak || 0
        : 1;
      return {
        ...p,
        lastAssemblyDate: today,
        assemblyStreak: newAssemblyStreak,
        xp: p.xp + 15,
        coins: p.coins + 5,
      };
    });
    setAttended(true);
  };

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-6">
          <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
            <ChevronLeft className="w-5 h-5" /> Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 mb-5 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(244, 114, 182, 0.18) 0%, rgba(167, 139, 250, 0.18) 50%, rgba(34, 211, 238, 0.18) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <motion.div
              className="absolute inset-0 aurora-bg opacity-15"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 14, repeat: Infinity }}
            />
            <div className="relative">
              <Mic className="w-7 h-7 mx-auto text-fuchsia-300 mb-2" />
              <div className="text-[10px] uppercase tracking-widest font-bold text-fuchsia-300">Morning Assembly</div>
              <div className="font-display text-3xl font-bold text-white mt-1">
                {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
              </div>
              <div className="text-sm text-white/60 mt-0.5">
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="mt-4 inline-flex items-center gap-3 glass rounded-2xl px-4 py-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-sm font-semibold">
                  <Calendar className="w-4 h-4" /> {state.assemblyStreak || 0} day streak
                </div>
              </div>
            </div>
          </motion.div>

          {loading && (
            <div className="glass-card p-10 text-center">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white/70">
                Gathering everyone…
              </motion.div>
            </div>
          )}

          {briefing && !loading && (
            <>
              {stage === "intro" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 mb-4 flex items-center gap-4"
                >
                  <Mascot avatarId="owl" size="md" />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-fuchsia-300 mb-1">
                      Principal Vidya
                    </div>
                    <div className="text-lg font-display font-bold text-white leading-snug">
                      {briefing.greeting}
                    </div>
                  </div>
                </motion.div>
              )}

              {stage === "thought" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 mb-4 relative"
                >
                  <Quote className="absolute top-4 left-4 w-8 h-8 text-fuchsia-400/30" />
                  <div className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-3 text-center">
                    Thought for the day
                  </div>
                  <div className="font-display text-xl text-white leading-relaxed text-center px-4 italic">
                    &ldquo;{briefing.thought}&rdquo;
                  </div>
                  <div className="text-sm text-white/60 text-center mt-3">
                    — {briefing.attribution}
                  </div>
                </motion.div>
              )}

              {stage === "plan" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 mb-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <div className="text-[10px] uppercase tracking-widest font-bold text-cyan-300">
                      Today at Vidya
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {briefing.plan.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 text-sm text-white/85"
                      >
                        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-cyan-500/15 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                          {i + 1}
                        </div>
                        <span>{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {stage === "closing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 mb-4 flex items-center gap-4"
                >
                  <DiyaCompanion state={state} size="md" showNudge={false} />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-300 mb-1">
                      Off you go
                    </div>
                    <div className="text-base text-white font-semibold leading-snug">{briefing.closing}</div>
                  </div>
                </motion.div>
              )}

              <Button size="lg" className="w-full" onClick={next}>
                {stage === "intro"
                  ? "Continue"
                  : stage === "thought"
                  ? "Today's plan"
                  : stage === "plan"
                  ? "Almost done"
                  : attended
                  ? "Back to lobby"
                  : "Mark attended · +15 XP"}
                {!attended && stage === "closing" && <Check className="w-5 h-5 ml-2 inline" />}
              </Button>

              <div className="text-center mt-3 text-[10px] text-white/30">
                {briefing.source === "ai" ? "Generated by Principal Vidya AI" : "Today's classic thought"}
              </div>
            </>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}
