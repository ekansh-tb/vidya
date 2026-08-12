"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw, ShieldCheck, Timer, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelebrationBurst } from "@/components/effects/celebrate";
import {
  ACTIVITIES, MOVE_KIND_LABEL, activityMinutesLabel, activitySeconds,
  type Activity,
} from "@/lib/content/activities";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

/**
 * Move Break — the "get off the chair" half of the Wellness room.
 *
 * Three screens, in order, and the order is the point:
 *   pick → BRIEF → run
 * The brief is not skippable furniture. It is where the child reads what they
 * need and what keeps them safe, and it is the only route to the timer. An
 * activity whose `safety` line is missing cannot compile, so this screen can
 * never come up empty.
 *
 * The reward is deliberately small and only fires on a FINISHED activity —
 * quitting halfway pays nothing. See components/effects/celebrate.tsx for why
 * celebrations here have to be earned.
 */

type Screen = "pick" | "brief" | "run";

const XP_PER_BREAK = 15;
const COINS_PER_BREAK = 4;

export function MovePanel({
  state, setState,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
}) {
  const [screen, setScreen] = useState<Screen>("pick");
  const [activity, setActivity] = useState<Activity | null>(null);

  const open = (a: Activity) => { sfx.click(); setActivity(a); setScreen("brief"); };

  if (screen === "run" && activity) {
    return (
      <MoveRunner
        activity={activity}
        setState={setState}
        onExit={() => { setScreen("pick"); setActivity(null); }}
      />
    );
  }

  if (screen === "brief" && activity) {
    return (
      <MoveBrief
        activity={activity}
        onBack={() => { sfx.click(); setScreen("pick"); setActivity(null); }}
        onStart={() => { sfx.click(); setScreen("run"); }}
      />
    );
  }

  return <MovePicker state={state} onPick={open} />;
}

// ------------------------------------------------------------------ picker

function MovePicker({ state, onPick }: { state: GameState; onPick: (a: Activity) => void }) {
  const done = new Set(state.completedActivities || []);
  const total = state.moveBreaks || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-display text-xl font-bold text-white">Pick your move</div>
          <div className="text-sm text-white/60">Two to four minutes. Guided the whole way.</div>
        </div>
        {total > 0 && (
          <div className="text-right shrink-0 pl-3">
            <div className="font-display text-2xl font-bold text-white tabular-nums">{total}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/50">done</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIVITIES.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.24), type: "spring", stiffness: 260, damping: 24 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(a)}
            className="glass-card p-4 text-left relative overflow-hidden group"
            style={{ borderColor: `${a.accent}33` }}
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-25 transition-opacity group-hover:opacity-40"
              style={{ background: a.accent }}
            />
            <div className="relative flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${a.accent}22` }}
                aria-hidden
              >
                {a.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold"
                    style={{ color: a.accent }}
                  >
                    {MOVE_KIND_LABEL[a.kind]}
                  </span>
                  {done.has(a.id) && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-300">
                      <Check className="w-3 h-3" /> done
                    </span>
                  )}
                </div>
                <div className="font-display font-bold text-white leading-tight">{a.name}</div>
                <div className="text-xs text-white/60 mt-0.5">{a.tagline}</div>
                <div className="text-[11px] text-white/45 mt-1.5 inline-flex items-center gap-1">
                  <Timer className="w-3 h-3" /> {activityMinutesLabel(a)} · {a.steps.length} steps
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------- brief

function MoveBrief({
  activity, onBack, onStart,
}: {
  activity: Activity;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" /> All moves
      </button>

      <div className="glass-card p-5 relative overflow-hidden mb-4">
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: activity.accent }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${activity.accent}22` }}
            aria-hidden
          >
            {activity.emoji}
          </div>
          <div>
            <div
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ color: activity.accent }}
            >
              {MOVE_KIND_LABEL[activity.kind]} · {activityMinutesLabel(activity)}
            </div>
            <div className="font-display text-2xl font-bold text-white leading-tight">{activity.name}</div>
            <div className="text-sm text-white/60">{activity.tagline}</div>
          </div>
        </div>
      </div>

      {/* The safety brief is the whole reason this screen exists. */}
      <div className="glass-card p-4 mb-3 border border-amber-400/25">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300">
            Before you start
          </span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{activity.safety}</p>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1">
          You need
        </div>
        <p className="text-sm text-white/80">{activity.needs}</p>
      </div>

      <div className="glass-card p-4 mb-5">
        <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-2">
          The plan
        </div>
        <ol className="space-y-1.5">
          {activity.steps.map((s, i) => (
            <li key={s.label} className="flex items-baseline gap-2 text-sm">
              <span className="text-white/35 tabular-nums text-xs w-4 shrink-0">{i + 1}</span>
              <span className="text-white/85 font-medium">{s.label}</span>
              <span className="text-white/40 text-xs ml-auto tabular-nums shrink-0">{s.secs}s</span>
            </li>
          ))}
        </ol>
      </div>

      <Button size="lg" className="w-full" onClick={onStart}>
        <span className="inline-flex items-center gap-2">
          <Play className="w-5 h-5 fill-current" /> I&apos;m ready
        </span>
      </Button>
    </motion.div>
  );
}

// ------------------------------------------------------------------ runner

function MoveRunner({
  activity, setState, onExit,
}: {
  activity: Activity;
  setState: (updater: (s: GameState) => GameState) => void;
  onExit: () => void;
}) {
  const reduce = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(false);
  /** Only used to pick the burst size — BadgeToast does the announcing. */
  const [earnedCount, setEarnedCount] = useState(0);
  /** Rewards are paid exactly once, even if React runs the effect twice. */
  const paid = useRef(false);

  const step = activity.steps[stepIdx];
  const totalSecs = activitySeconds(activity);
  const elapsed = activity.steps.slice(0, stepIdx).reduce((n, s) => n + s.secs, 0) + tick;

  const finish = useCallback(() => {
    if (paid.current) return;
    paid.current = true;
    setDone(true);
    setRunning(false);
    setBurst(true);
    if (activity.kind === "gymnastics" || activity.kind === "balance") sfx.badge(); else sfx.correct();

    setState((prev) => {
      const badges = [...prev.badges];
      const seen = new Set(prev.completedActivities || []);
      const breaks = (prev.moveBreaks || 0) + 1;
      const fresh: string[] = [];

      const award = (id: string) => {
        if (!badges.includes(id)) { badges.push(id); fresh.push(id); }
      };
      award("first-move");
      if (activity.kind === "gymnastics") award("tumbler");
      if (activity.kind === "balance") award("steady");
      if (breaks >= 10) award("move-10");

      seen.add(activity.id);
      setEarnedCount(fresh.length);

      return {
        ...prev,
        xp: prev.xp + XP_PER_BREAK,
        coins: prev.coins + COINS_PER_BREAK,
        badges,
        completedActivities: [...seen],
        moveBreaks: breaks,
      };
    });
  }, [activity.id, activity.kind, setState]);

  useEffect(() => {
    if (!running || done) return;
    const id = window.setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        if (next < step.secs) return next;
        // Step over — advance, or finish the whole activity.
        setStepIdx((i) => {
          if (i + 1 >= activity.steps.length) { finish(); return i; }
          sfx.click();
          return i + 1;
        });
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, done, step.secs, activity.steps.length, finish]);

  const restart = () => {
    sfx.click();
    paid.current = false;
    setStepIdx(0); setTick(0); setDone(false); setRunning(true); setEarnedCount(0);
  };

  const pct = Math.min(100, (elapsed / totalSecs) * 100);
  const remaining = step.secs - tick;

  return (
    <div>
      <CelebrationBurst
        show={burst}
        variant={earnedCount > 0 ? "badge" : "correct"}
        label={`${activity.name} complete`}
        onDone={() => setBurst(false)}
      />

      <button
        onClick={() => { sfx.click(); onExit(); }}
        className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" /> {done ? "All moves" : "Stop"}
      </button>

      {/* Progress through the whole activity */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: activity.accent }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
        />
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="glass-card p-6 text-center border border-emerald-400/30"
        >
          <div className="text-5xl mb-2" aria-hidden>{activity.emoji}</div>
          <div className="font-display text-2xl font-bold text-white">Move Break done.</div>
          <div className="text-sm text-white/70 mt-1">
            +{XP_PER_BREAK} XP · +{COINS_PER_BREAK} coins. Your brain works better now — that is not a slogan, it is blood flow.
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={restart}>
              <span className="inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Again</span>
            </Button>
            <Button onClick={() => { sfx.click(); onExit(); }}>Done</Button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1">
              Step {stepIdx + 1} of {activity.steps.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={stepIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: reduce ? 0 : 0.28 }}
              >
                <div className="font-display text-3xl font-bold text-white">{step.label}</div>
                <div className="text-sm text-white/70 mt-2 max-w-sm mx-auto leading-relaxed">
                  {step.cue}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The clock. Ring drains as the step runs. */}
          <div className="flex justify-center mb-6">
            <div className="relative w-52 h-52 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={reduce || !running ? {} : { opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{ background: `radial-gradient(circle, ${activity.accent}44 0%, transparent 70%)` }}
              />
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={activity.accent} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  animate={{ strokeDashoffset: 2 * Math.PI * 45 * (tick / step.secs) }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: "linear" }}
                />
              </svg>
              <div className="text-center">
                <div className="font-display text-6xl font-bold text-white tabular-nums">{remaining}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/50">seconds</div>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => { sfx.click(); setRunning((r) => !r); }}>
            <span className="inline-flex items-center gap-2">
              {running
                ? <><Pause className="w-5 h-5" /> Pause</>
                : <><Play className="w-5 h-5 fill-current" /> Resume</>}
            </span>
          </Button>

          <p className="text-center text-xs text-white/40 mt-3">
            Stop any time. Nothing here is a test.
          </p>
        </>
      )}
    </div>
  );
}
