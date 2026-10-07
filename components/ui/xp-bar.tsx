"use client";

import { motion } from "framer-motion";

export function XPBar({ level, xpInLevel, xpNeeded }: { level: number; xpInLevel: number; xpNeeded: number }) {
  const pct = Math.min(100, (xpInLevel / xpNeeded) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 blur-md opacity-60" />
            <div className="relative w-10 h-10 rounded-2xl gradient-cosmic flex items-center justify-center text-[var(--text)] font-bold text-lg font-display shadow-lg">
              {level}
            </div>
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Level {level}</span>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">{xpInLevel} / {xpNeeded} XP</span>
      </div>
      <div className="h-3 bg-[var(--surface-strong)] rounded-full overflow-hidden relative border border-[var(--border)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full gradient-cosmic rounded-full relative"
        >
          <div className="absolute inset-0 shimmer-bg" />
        </motion.div>
      </div>
    </div>
  );
}
