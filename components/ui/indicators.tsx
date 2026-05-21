"use client";

import { Flame, Shield } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StreakFlame({ streak, large = false, shields = 0 }: { streak: number; large?: boolean; shields?: number }) {
  if (streak === 0) {
    return (
      <div className="flex items-center gap-1.5 text-white/40">
        <Flame className={large ? "w-6 h-6" : "w-5 h-5"} />
        <span className="font-bold font-mono">0</span>
        {shields > 0 && <ShieldBadge count={shields} dim />}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame className={`${large ? "w-7 h-7" : "w-5 h-5"} text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.7)]`} fill="#FBBF24" />
      </motion.div>
      <span className={`font-bold font-display ${large ? "text-xl" : "text-base"} text-orange-300`}>{streak}</span>
      {shields > 0 && <ShieldBadge count={shields} />}
    </div>
  );
}

function ShieldBadge({ count, dim = false }: { count: number; dim?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
      style={{
        background: dim ? "rgba(255,255,255,0.05)" : "rgba(34, 211, 238, 0.18)",
        color: dim ? "rgba(255,255,255,0.45)" : "#67e8f9",
      }}
      title={`${count} streak shield${count === 1 ? "" : "s"} — protects your streak if you miss a day`}
    >
      <Shield className="w-2.5 h-2.5" fill="currentColor" />
      <span>{count}</span>
    </span>
  );
}

export function StatPill({
  icon: Icon, value, label, accent = "#22D3EE",
}: { icon: LucideIcon; value: string | number; label?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 glass rounded-full pl-1.5 pr-3 py-1.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: accent + "33", boxShadow: `0 0 12px ${accent}55` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="leading-tight">
        <div className="font-bold text-white text-sm">{value}</div>
        {label && <div className="text-[9px] uppercase tracking-widest text-white/40">{label}</div>}
      </div>
    </div>
  );
}

export function ProgressRing({
  percent, size = 56, stroke = 5, color = "#22D3EE",
}: { percent: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s ease-out", filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}
