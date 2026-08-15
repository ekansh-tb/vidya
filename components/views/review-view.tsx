"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, BookOpen, Check, X } from "lucide-react";
import type { GameState, LearnerProfile, MissedQuestion, SubjectId } from "@/lib/types";
import { sortForReview, dueCount, isDue, recordCorrect } from "@/lib/spaced-repetition";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { missedQuestionsForLearner, questionsForLearner } from "@/lib/content/questions/availability";
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
  learner, state, setState, onBack,
}: {
  learner: Pick<LearnerProfile, "board" | "grade">;
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  // Due first, oldest miss first — see lib/spaced-repetition. Sorting here
  // rather than in the store keeps the notebook's stored order meaningful
  // (most-recent-first) while what the learner sees is what needs them.
  const learnerMisses = missedQuestionsForLearner(learner, state.missedQuestions);
  const questionStatsAvailable = Object.keys(questionsForLearner(learner)).length > 0;
  const all = sortForReview(learnerMisses);
  const readyCount = dueCount(learnerMisses);
  const [filterSubject, setFilterSubject] = useState<SubjectId | "all">("all");
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // Subjects present in the miss log (for the filter chip strip)
  const subjectsPresent = useMemo(() => {
    const set = new Set<SubjectId>();
    all.forEach((m) => { if (m.subjectId) set.add(m.subjectId); });
    return Array.from(set);
  }, [all]);

  const filtered = filterSubject === "all"
    ? all
    : all.filter((m) => m.subjectId === filterSubject);

  /**
   * "Got it" — the learner's own claim that they know this one.
   *
   * It used to delete the card. It now promotes it exactly as a correct quiz
   * answer would, so the claim is taken seriously but still has to survive the
   * schedule. A card the learner has genuinely learned will sail through the
   * remaining reviews in a few seconds each; one they were optimistic about
   * comes back, which is the whole point of a notebook.
   *
   * The XP is unchanged and still paid every time, because closing the loop on
   * a miss is the behaviour worth encouraging whether or not it retires the
   * card. Promotion only counts when the card is actually due, so tapping this
   * repeatedly cannot rush a card out.
   */
  const markMastered = (id: string) => {
    sfx.coin();
    setState((p) => {
      const next: MissedQuestion[] = [];
      for (const m of p.missedQuestions || []) {
        if (m.id !== id) { next.push(m); continue; }
        const outcome = recordCorrect(m);
        if (outcome.kind === "scheduled") next.push(outcome.card);
      }
      return { ...p, missedQuestions: next, xp: p.xp + 2 };
    });
    if (revealedId === id) setRevealedId(null);
  };

  return (
    <ReducedMotionProvider>
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
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
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
                    isDeva={subj.isDeva}
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
                  ? questionStatsAvailable
                    ? "Take a quiz. Any question you miss will land here for later review."
                    : "Review cards will appear when lessons for your grade are ready."
                  : "Try a different subject filter above, or take more quizzes."}
              </div>
            </div>
          ) : (
            // AnimatePresence used to wrap this <div>, which never unmounts — it
            // only watches its DIRECT children, so MissCard's exit animation
            // never ran and mastered cards vanished instantly. It has to wrap the
            // cards themselves.
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {filtered.map((m) => (
                  <MissCard
                    key={m.id}
                    miss={m}
                    revealed={revealedId === m.id}
                    onToggle={() => { sfx.click(); setRevealedId(revealedId === m.id ? null : m.id); }}
                    onMaster={() => markMastered(m.id)}
                    reduced={!!reduced}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {all.length > 0 && (
            <p className="text-[10px] mt-6 leading-relaxed text-center" style={{ color: "var(--text-faint)" }}>
              {readyCount === 0
                ? "Nothing needs you right now — these come back on their own, spread out over the next few weeks."
                : "Questions come back a few times, spread further apart each time you get them right."}
              <br />
              A card leaves the notebook once you&apos;ve got it right on five different days.
            </p>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}

function FilterChip({ active, label, accent, isDeva, onClick }: {
  active: boolean;
  label: string;
  accent?: string;
  /** Hindi / Marathi / Sanskrit subject names need the Devanagari face. */
  isDeva?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      // The active filter reads only as a colour change.
      aria-pressed={active}
      className={`text-[11px] font-bold uppercase tracking-widest rounded-[var(--radius-pill)] px-3 min-h-11 whitespace-nowrap transition active:scale-95 ${isDeva ? "font-deva" : ""}`}
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

function MissCard({ miss, revealed, onToggle, onMaster, reduced }: {
  miss: MissedQuestion;
  revealed: boolean;
  onToggle: () => void;
  onMaster: () => void;
  reduced: boolean;
}) {
  const subj = miss.subjectId ? SUBJECT_MAP[miss.subjectId] : undefined;
  // A card the learner has already got right is still in the notebook, resting
  // until its next review. Saying so plainly prevents the obvious confusion —
  // "I answered this, why is it still here?" — without showing them a box
  // number or a schedule, which is bookkeeping they did not ask for.
  const resting = !isDue(miss);
  return (
    <motion.div
      // `layout` reflows every sibling card when one is removed or expanded —
      // exactly the large-area motion to drop under reduced motion.
      layout={!reduced}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
      className="glass-card p-4"
      style={resting ? { opacity: 0.62 } : undefined}
    >
      {resting && (
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--success)" }}>
          Got it · back again later
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {subj && (
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${subj.isDeva ? "font-deva" : ""}`} style={{ color: subj.accent }}>
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
        {/* Icon-only: `title` is not a dependable accessible name, and never
            surfaces on touch. 44px keeps it tappable. */}
        <button
          onClick={onMaster}
          title="Mark as mastered"
          aria-label="Mark as mastered"
          className="flex-shrink-0 w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center active:scale-95"
          style={{ background: "rgba(16, 185, 129, 0.18)", color: "var(--success)" }}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      {!revealed ? (
        <button
          onClick={onToggle}
          aria-expanded={false}
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Reveal answer ↓
        </button>
      ) : (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
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
            aria-expanded
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
