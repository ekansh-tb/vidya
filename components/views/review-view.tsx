"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, BookOpen, Check, X, Filter } from "lucide-react";
import type { GameState, MissedQuestion, SubjectId } from "@/lib/types";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { sfx } from "@/lib/audio";

/**
 * Wrong-Answer Notebook.
 *
 * Every question the learner got wrong (via quiz-view) is logged here.
 * Capped at 50 most-recent. When the learner answers the same question
 * correctly later, it auto-removes (mastered).
 *
 * This view lets them:
 *  - Browse misses, filtered by subject
 *  - Read the correct answer + explanation
 *  - Mark a card "Got it" to manually clear it (frees the slot)
 *
 * Strictly per-learner — these never cross profiles.
 */
export function ReviewView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const all = state.missedQuestions || [];
  const [filterSubject, setFilterSubject] = useState<SubjectId | "all">("all");
  const [revealedId, setRevealedId] = useState<string | null>(null);

  // Subjects present in the miss log (for the filter chip strip)
  const subjectsPresent = useMemo(() => {
    const set = new Set<SubjectId>();
    all.forEach((m) => { if (m.subjectId) set.add(m.subjectId); });
    return Array.from(set);
  }, [all]);

  const filtered = filterSubject === "all"
    ? all
    : all.filter((m) => m.subjectId === filterSubject);

  const markMastered = (id: string) => {
    sfx.coin();
    setState((p) => ({
      ...p,
      missedQuestions: (p.missedQuestions || []).filter((m) => m.id !== id),
      // Small XP bump for closing the loop on a miss
      xp: p.xp + 2,
    }));
    if (revealedId === id) setRevealedId(null);
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button
          onClick={() => { sfx.click(); onBack(); }}
          className="flex items-center gap-1 font-medium mb-4 active:scale-95"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-5 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "var(--accent)" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <BookOpen className="w-7 h-7" style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
                Wrong-Answer Notebook
              </div>
              <div className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>
                Review your misses
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {all.length} card{all.length === 1 ? "" : "s"} ·
                {" "}answer it right in a quiz and it disappears automatically
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject filter */}
        {subjectsPresent.length > 1 && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            <FilterChip
              active={filterSubject === "all"}
              label={`All · ${all.length}`}
              onClick={() => setFilterSubject("all")}
            />
            {subjectsPresent.map((sid) => {
              const subj = SUBJECT_MAP[sid];
              if (!subj) return null;
              const count = all.filter((m) => m.subjectId === sid).length;
              return (
                <FilterChip
                  key={sid}
                  active={filterSubject === sid}
                  label={`${subj.name} · ${count}`}
                  accent={subj.accent}
                  onClick={() => setFilterSubject(sid)}
                />
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="glass-card p-8 text-center" style={{ color: "var(--text-muted)" }}>
            <Check className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--success)" }} />
            <div className="font-display text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
              {all.length === 0 ? "Nothing to review yet" : "All clear in this filter"}
            </div>
            <div className="text-xs">
              {all.length === 0
                ? "Take a quiz — any question you miss will land here for later review."
                : "Try a different subject filter above, or take more quizzes."}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {filtered.map((m) => (
                <MissCard
                  key={m.id}
                  miss={m}
                  revealed={revealedId === m.id}
                  onToggle={() => { sfx.click(); setRevealedId(revealedId === m.id ? null : m.id); }}
                  onMaster={() => markMastered(m.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {all.length > 0 && (
          <p className="text-[10px] mt-6 leading-relaxed text-center" style={{ color: "var(--text-faint)" }}>
            Notebook stores up to 50 most-recent misses on this device.
            <br />
            Mark <em>Got it</em> to clear a card · or answer it right in a quiz to clear it automatically.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, label, accent, onClick }: {
  active: boolean;
  label: string;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-bold uppercase tracking-widest rounded-[var(--radius-pill)] px-3 py-1.5 whitespace-nowrap transition active:scale-95"
      style={{
        background: active ? (accent ? `${accent}25` : "var(--accent-soft)") : "var(--surface)",
        border: `1px solid ${active ? (accent || "var(--accent)") : "var(--border)"}`,
        color: active ? (accent || "var(--accent)") : "var(--text-muted)",
      }}
    >
      {label}
    </button>
  );
}

function MissCard({ miss, revealed, onToggle, onMaster }: {
  miss: MissedQuestion;
  revealed: boolean;
  onToggle: () => void;
  onMaster: () => void;
}) {
  const subj = miss.subjectId ? SUBJECT_MAP[miss.subjectId] : undefined;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {subj && (
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: subj.accent }}>
              {subj.name}{miss.topicId ? ` · ${miss.topicId}` : ""}
            </div>
          )}
          <div
            className={`text-sm font-medium ${miss.isDeva ? "font-deva" : ""}`}
            style={{ color: "var(--text)" }}
          >
            {miss.q}
          </div>
        </div>
        <button
          onClick={onMaster}
          title="Mark as mastered"
          className="flex-shrink-0 w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center active:scale-95"
          style={{ background: "rgba(16, 185, 129, 0.18)", color: "var(--success)" }}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      {!revealed ? (
        <button
          onClick={onToggle}
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Reveal answer ↓
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-[var(--radius-md)] p-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-baseline gap-2 mb-1.5">
            <X className="w-3 h-3" style={{ color: "var(--error)" }} />
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--error)" }}>
              You said
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{miss.given || "(no answer)"}</div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <Check className="w-3 h-3" style={{ color: "var(--success)" }} />
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--success)" }}>
              Correct
            </div>
            <div className={`text-xs font-semibold ${miss.isDeva ? "font-deva" : ""}`} style={{ color: "var(--text)" }}>
              {miss.correct}
            </div>
          </div>
          {miss.ex && (
            <p className="text-xs italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {miss.ex}
            </p>
          )}
          <button
            onClick={onToggle}
            className="mt-2 text-[10px] uppercase tracking-widest font-bold"
            style={{ color: "var(--text-faint)" }}
          >
            Hide ↑
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
