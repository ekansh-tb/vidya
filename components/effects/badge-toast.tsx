"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BADGE_MAP, TIER_STYLES } from "@/lib/content/badges";
import type { Badge } from "@/lib/types";
import { sfx } from "@/lib/audio";

/**
 * Announces a badge the moment it is earned, wherever the child happens to be.
 *
 * WHY THIS EXISTS
 * ---------------
 * Badges were only ever visible on the results screen. Everything awarded
 * anywhere else landed in silence: `comeback` fires mid-quiz, the Move Break
 * badges fire in the Wellness room, and a child could earn three badges and be
 * told about none of them until they wandered into their profile. An
 * unannounced reward is not a reward.
 *
 * WHY IT IS A TOAST AND NOT A BURST
 * ---------------------------------
 * These fire while the child is doing something else — mid-question, mid-plank.
 * CelebrationBurst owns the screen for 700ms, which is right when a quest ENDS
 * and wrong when one is still running. So this arrives at the edge, says its
 * piece, and leaves without taking the tap target under the child's thumb.
 *
 * WHAT IT MUST NEVER DO
 * ---------------------
 * Announce a badge the child already had. On mount, and on every learner
 * switch, the current badge set is taken as the silent baseline — otherwise
 * opening the app would replay a year of achievements, and switching to a
 * sibling would announce THEIR badges on this child's screen.
 */

const HOLD_MS = 2800;

export function BadgeToast({
  badges, learnerId,
}: {
  badges: string[];
  /** Resets the baseline. Without it, switching learners replays the other
   *  child's badges — a strict-isolation violation as well as a bug. */
  learnerId: string;
}) {
  const reduce = useReducedMotion();
  const seen = useRef<Set<string> | null>(null);
  const [queue, setQueue] = useState<Badge[]>([]);
  const [current, setCurrent] = useState<Badge | null>(null);

  // Declared FIRST on purpose: on mount and on every learner switch this runs
  // before the diff below, so the diff starts from a seeded baseline and has
  // nothing to announce.
  useEffect(() => {
    seen.current = new Set(badges);
    setQueue([]);
    setCurrent(null);
    // `badges` is deliberately not a dependency — this is a reset, not a diff.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learnerId]);

  useEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(badges);
      return;
    }
    const fresh = badges.filter((id) => !seen.current!.has(id));
    if (fresh.length === 0) return;
    for (const id of fresh) seen.current.add(id);
    const earned = fresh.map((id) => BADGE_MAP[id]).filter(Boolean);
    if (earned.length > 0) setQueue((q) => [...q, ...earned]);
  }, [badges]);

  // One at a time — two badges at once would overlap and read as neither.
  useEffect(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setCurrent(next);
    sfx.badge();
  }, [queue, current]);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), HOLD_MS);
    return () => clearTimeout(t);
  }, [current]);

  const tier = current ? TIER_STYLES[current.tier] : null;

  return (
    <>
      {/* The announcement a screen reader gets. The visual is decorative. */}
      <div className="sr-only" role="status" aria-live="polite">
        {current ? `Badge earned: ${current.name}. ${current.desc}.` : ""}
      </div>

      <AnimatePresence>
        {current && tier && (
          <motion.div
            key={current.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -28, scale: 0.9 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 26 }}
            // Below the safe-area top, above everything, and never under a thumb.
            className="fixed left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
            style={{ top: "max(1rem, env(safe-area-inset-top))" }}
            aria-hidden
          >
            <div
              className={`glass-card flex items-center gap-3 pl-3 pr-4 py-2.5 ring-1 ${tier.ring} shadow-2xl ${tier.glow}`}
            >
              <motion.div
                initial={reduce ? {} : { scale: 0.4, rotate: -20 }}
                animate={reduce ? {} : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 14, delay: 0.08 }}
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-2xl shrink-0`}
              >
                {current.icon}
              </motion.div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                  Badge earned
                </div>
                <div className="font-display font-bold text-white leading-tight truncate">
                  {current.name}
                </div>
                <div className="text-xs text-white/60 truncate">{current.desc}</div>
              </div>
            </div>

            {/* A single sweep of light across the card. One pass, then gone. */}
            {!reduce && (
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 0.9, delay: 0.18, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
