"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SixSevenOverlay({ score, onDone }: { score: number; onDone: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key="six-seven"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onAnimationComplete={() => {
        const ms = reduce ? 900 : 1600;
        setTimeout(onDone, ms);
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(34,211,238,0.22) 0%, rgba(2,6,23,0.85) 60%, rgba(2,6,23,0.96) 100%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      aria-live="polite"
      aria-label={`Score ${score}`}
    >
      <motion.div
        initial={reduce ? { scale: 1, opacity: 0 } : { scale: 0.4, rotate: -8, opacity: 0 }}
        animate={reduce ? { scale: 1, opacity: 1 } : { scale: 1, rotate: 0, opacity: 1 }}
        transition={
          reduce
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 320, damping: 14, mass: 0.9 }
        }
        className="font-display font-black text-white leading-none drop-shadow-[0_8px_30px_rgba(34,211,238,0.45)]"
        style={{ fontSize: "clamp(96px, 22vw, 220px)", letterSpacing: "-0.04em" }}
      >
        <span>6 7</span>
        <motion.span
          initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -25 }}
          animate={reduce ? { opacity: 1 } : { scale: 1, rotate: 12 }}
          transition={
            reduce
              ? { duration: 0.2, delay: 0.1 }
              : { type: "spring", stiffness: 380, damping: 10, delay: 0.18 }
          }
          className="inline-block text-amber-300 ml-2"
          style={{ textShadow: "0 0 22px rgba(251,191,36,0.65)" }}
        >
          !
        </motion.span>
      </motion.div>

      {!reduce && (
        <div className="mt-6 flex items-end gap-10" aria-hidden="true">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: [30, -18, 14, -18, 0], opacity: 1 }}
            transition={{ delay: 0.15, duration: 1.0, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" }}
            className="text-7xl"
            style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5))" }}
          >
            🫴
          </motion.div>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: [-30, 18, -14, 18, 0], opacity: 1 }}
            transition={{ delay: 0.15, duration: 1.0, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" }}
            className="text-7xl"
            style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5))" }}
          >
            🫴
          </motion.div>
        </div>
      )}

      {reduce && (
        <div className="mt-6 text-5xl" aria-hidden="true">
          🫴 🫴
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80"
      >
        Score: {score}
      </motion.div>
    </motion.div>
  );
}
