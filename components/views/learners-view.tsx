"use client";

import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, Plus, Check, ArrowRightCircle } from "lucide-react";
import type { LearnerProfile, LearnerId } from "@/lib/types";
import { sfx } from "@/lib/audio";

const AVATAR_EMOJI: Record<string, string> = {
  peacock: "🦚",
  tiger: "🐯",
  owl: "🦉",
  elephant: "🐘",
  fox: "🦊",
  lion: "🦁",
};

export function LearnersView({
  learners,
  currentId,
  onSwitch,
  onBack,
  onAdd,
}: {
  learners: LearnerProfile[];
  currentId: LearnerId;
  onSwitch: (id: LearnerId) => void;
  onBack: () => void;
  onAdd: () => void;
}) {
  const hasAny = learners.length > 0;
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
              <GraduationCap className="w-7 h-7 text-violet-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-violet-300">Learners</div>
              <div className="font-display text-2xl font-bold text-white">Who&apos;s studying?</div>
              <div className="text-sm text-white/60">{learners.length} profile{learners.length === 1 ? "" : "s"}</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {/*
            Strict isolation: the switcher shows only identifying info
            (name, avatar, grade, board, school). NEVER XP / streak /
            level / mastery — those are private to the active learner.
            See [[strict-isolation]] memory.
          */}
          {learners.map((l, i) => {
            const emoji = AVATAR_EMOJI[l.state.avatarId || "peacock"] || "🦚";
            const isActive = l.id === currentId;
            const board =
              l.board === "cambridge-igcse" ? "Cambridge IGCSE" :
              l.board === "cambridge-primary" ? "Cambridge Primary" :
              l.board === "icse" ? "ICSE" :
              l.board === "cbse" ? "CBSE" :
              "Custom";
            return (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { sfx.click(); onSwitch(l.id); }}
                className={`w-full glass-card p-4 flex items-center gap-4 text-left active:scale-[0.99] transition relative ${
                  isActive ? "ring-2 ring-violet-400/60" : ""
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: isActive ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.06)" }}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-lg text-white truncate">{l.name}</div>
                  <div className="text-xs text-white/55 truncate">
                    Grade {l.grade} · {board}
                  </div>
                  {l.school ? (
                    <div className="text-[10px] text-white/40 mt-0.5 truncate" title={l.school}>{l.school}</div>
                  ) : null}
                </div>
                {isActive ? (
                  <div className="rounded-full bg-violet-500/30 ring-1 ring-violet-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-100 flex items-center gap-1">
                    <Check className="w-3 h-3" /> active
                  </div>
                ) : (
                  <ArrowRightCircle className="w-6 h-6 text-white/40" />
                )}
              </motion.button>
            );
          })}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => { sfx.click(); onAdd(); }}
            className="w-full p-4 flex items-center gap-4 text-left active:scale-[0.99] transition relative overflow-hidden"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--surface) 100%)",
              border: "1px dashed var(--border-strong)",
            }}
          >
            <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-soft)" }}>
              <Plus className="w-7 h-7" style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>
                {hasAny ? "Add another learner" : "Add a learner"}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Type the learner's name. Pick a school template to fill in the curriculum.
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
