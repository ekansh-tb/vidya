"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { GameState } from "@/lib/types";
import { diyaLevel, diyaMood, diyaSay } from "@/lib/diya";

const FLAME_HUE: Record<number, string> = {
  1: "#FBBF24",  // amber
  2: "#F59E0B",
  3: "#F472B6",
  4: "#A78BFA",
  5: "#22D3EE",
  6: "#34D399",
};

export function DiyaCompanion({
  state,
  size = "md",
  showNudge = true,
}: {
  state: GameState;
  size?: "sm" | "md" | "lg";
  showNudge?: boolean;
}) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const [tapped, setTapped] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const level = diyaLevel(state);
  const mood = diyaMood(state, now);
  const nudge = useMemo(() => diyaSay(state, now), [state, now]);
  const flame = FLAME_HUE[Math.min(level, 6)] || FLAME_HUE[1];

  const sizes = {
    sm: { wrap: "w-20 h-24", lamp: "w-14 h-8", flame: 24, glow: 18 },
    md: { wrap: "w-28 h-32", lamp: "w-20 h-10", flame: 36, glow: 26 },
    lg: { wrap: "w-40 h-44", lamp: "w-28 h-14", flame: 56, glow: 38 },
  }[size];

  const sleep = mood === "sleepy";
  const excite = mood === "excited" || mood === "celebrate";

  const handleTap = () => {
    setTapped(nudge);
    setTimeout(() => setTapped(null), 3200);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        onClick={handleTap}
        className={`${sizes.wrap} relative flex items-end justify-center active:scale-95 transition-transform`}
        aria-label="Diya, your learning companion"
      >
        {/* Glow halo */}
        {!reduce && !sleep && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{
              opacity: [0.45, 0.75, 0.45],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              top: 0,
              width: sizes.glow * 2.4,
              height: sizes.glow * 2.4,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${flame}80 0%, ${flame}30 40%, transparent 70%)`,
              filter: "blur(6px)",
            }}
          />
        )}

        {/* Flame */}
        <motion.div
          className="absolute"
          style={{
            top: 2,
            left: "50%",
            x: "-50%",
            width: sizes.flame * 0.6,
            height: sizes.flame,
          }}
          animate={
            reduce
              ? {}
              : sleep
              ? { rotate: [-2, 2, -2] }
              : excite
              ? { rotate: [-6, 6, -4, 6, -6], scale: [1, 1.12, 1] }
              : { rotate: [-3, 3, -3], scaleY: [1, 1.05, 1] }
          }
          transition={
            reduce
              ? {}
              : { duration: sleep ? 4.5 : excite ? 0.6 : 1.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg viewBox="0 0 20 32" width="100%" height="100%">
            <defs>
              <radialGradient id={`flame-grad-${level}`} cx="50%" cy="60%" r="60%">
                <stop offset="0%" stopColor="#FFFAEB" />
                <stop offset="40%" stopColor={flame} />
                <stop offset="100%" stopColor={flame} stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M10 2 C 13 8, 16 12, 16 19 C 16 25, 13 30, 10 30 C 7 30, 4 25, 4 19 C 4 12, 7 8, 10 2 Z"
              fill={`url(#flame-grad-${level})`}
            />
            <path
              d="M10 14 C 11.5 17, 12.5 19, 12.5 22 C 12.5 25, 11.5 27, 10 27 C 8.5 27, 7.5 25, 7.5 22 C 7.5 19, 8.5 17, 10 14 Z"
              fill="#FEF3C7"
              opacity={sleep ? 0.4 : 0.9}
            />
          </svg>
        </motion.div>

        {/* Lamp body */}
        <div
          className={`${sizes.lamp} relative rounded-b-full rounded-t-md`}
          style={{
            background: "linear-gradient(180deg, #B45309 0%, #7C2D12 100%)",
            boxShadow: `0 6px 18px ${flame}55, inset 0 -3px 6px rgba(0,0,0,0.3)`,
            marginBottom: 2,
          }}
        >
          {/* Lip */}
          <div className="absolute -top-1 inset-x-2 h-1.5 rounded-full" style={{ background: "#92400E" }} />
          {/* Eyes */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={reduce ? {} : sleep ? { scaleY: [1, 0.1, 1] } : { scaleY: [1, 0.2, 1] }}
              transition={{ duration: sleep ? 6 : 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.2] }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={reduce ? {} : sleep ? { scaleY: [1, 0.1, 1] } : { scaleY: [1, 0.2, 1] }}
              transition={{ duration: sleep ? 6 : 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.2] }}
            />
          </div>
          {/* Tier ring */}
          {level > 1 && (
            <div
              className="absolute -bottom-1 inset-x-1 h-1 rounded-full"
              style={{ background: flame, boxShadow: `0 0 8px ${flame}` }}
            />
          )}
        </div>
      </button>

      {showNudge && (
        <AnimatePresence>
          {tapped && (
            <motion.div
              key={tapped}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 translate-y-[-100%] max-w-[180px] text-center rounded-2xl glass-strong px-3 py-1.5 text-xs font-semibold text-white shadow-xl"
              style={{ boxShadow: `0 8px 24px ${flame}40, 0 0 0 1px ${flame}40` }}
            >
              {tapped}
              <div
                className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
