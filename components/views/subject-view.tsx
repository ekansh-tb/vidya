"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Crown, Shuffle, NotebookPen, MessageCircle, BookOpen, Sparkles } from "lucide-react";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import { usePack } from "@/lib/content/packs/use-pack";
import type { GameState, LearnerProfile, ViewName, SubjectId } from "@/lib/types";
import { sfx } from "@/lib/audio";
import { vidya } from "@/lib/speech";
import { useEffect } from "react";
import { useCapability } from "@/lib/capabilities/use-capability";
import { useGameStore } from "@/lib/game-store";

export function SubjectView({
  subjectId, state, learner, onNavigate, onBack, voiceEnabled,
}: {
  subjectId: SubjectId;
  state: GameState;
  learner: LearnerProfile;
  onNavigate: (v: ViewName, params?: Record<string, unknown>) => void;
  onBack: () => void;
  voiceEnabled: boolean;
}) {
  const subject = SUBJECT_MAP[subjectId];
  const quizTopics = QUESTIONS[subjectId] || {};
  const hasQuiz = Object.keys(quizTopics).length > 0;
  // `hasExamPack` is synchronous so the layout never flashes an empty state;
  // `pack` arrives from its own chunk. See lib/content/packs/pack-index.ts.
  const { exists: hasExamPack, pack } = usePack(subjectId, learner.grade);
  const Icon = subject.icon;
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;
  const setGameState = useGameStore((s) => s.set);

  useEffect(() => {
    // Mark this subject as the most-recently-visited so the home "Pick up
    // where you left off" card knows where to point.
    setGameState((s) => ({ ...s, lastSubjectId: subjectId, lastSubjectAt: new Date().toISOString() }));
  }, [subjectId, setGameState]);

  useEffect(() => {
    if (voiceEnabled) {
      setTimeout(() => vidya.subjectIntro(subject.name), 200);
    }
  }, [subjectId, voiceEnabled, subject.name]);

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-lg)] p-6 mb-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #0f1729 0%, #0a1020 100%)",
            border: `1px solid ${subject.accent}33`,
            boxShadow: `0 12px 40px ${subject.glow}`,
          }}
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04) 0%, transparent 50%)",
            }}
          />
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: subject.accent }} />
          <div className="relative flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                boxShadow: `0 0 24px ${subject.glow}`,
              }}
            >
              <Icon className="w-8 h-8" style={{ color: subject.accent }} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: subject.accent }}>
                Classroom
              </div>
              <div className={`font-display text-3xl font-bold text-white leading-tight ${subject.isDeva ? "font-deva" : ""}`}>
                {subject.name}
              </div>
              <div className={`text-white/60 text-sm ${subject.isDeva ? "font-deva" : ""}`}>{subject.tagline}</div>
            </div>
          </div>

          {/* Action row: Exam Prep is primary if pack exists */}
          <div className="relative mt-4 grid grid-cols-2 gap-2">
            {hasExamPack ? (
              <button
                onClick={() => { sfx.click(); onNavigate("exam-prep", { subjectId }); }}
                className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-bold active:scale-95"
                style={{ background: subject.accent, color: "#0a0e14", boxShadow: `0 0 16px ${subject.glow}` }}
              >
                <Sparkles className="w-4 h-4" />
                Exam Prep
              </button>
            ) : aiTutorAllowed ? (
              <button
                onClick={() => { sfx.click(); onNavigate("tutor", { subjectId }); }}
                className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
                style={{ background: subject.soft, color: subject.accent }}
              >
                <MessageCircle className="w-4 h-4" />
                Ask Miss Vidya
              </button>
            ) : (
              <button
                onClick={() => { sfx.click(); onNavigate("notebook", { subjectId }); }}
                className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
                style={{ background: subject.soft, color: subject.accent }}
              >
                <NotebookPen className="w-4 h-4" />
                Take notes
              </button>
            )}
            <button
              onClick={() => { sfx.click(); onNavigate("notebook", { subjectId }); }}
              className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-white/85 glass active:scale-95"
            >
              <NotebookPen className="w-4 h-4" />
              Notebook
            </button>
          </div>
          {hasExamPack && aiTutorAllowed && (
            <div className="relative mt-2">
              <button
                onClick={() => { sfx.click(); onNavigate("tutor", { subjectId }); }}
                className="w-full rounded-[var(--radius-md)] px-3 py-2 flex items-center justify-center gap-2 text-xs font-semibold active:scale-95"
                style={{ background: subject.soft, color: subject.accent }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ask Miss Vidya about {subject.name}
              </button>
            </div>
          )}
        </motion.div>

        {/* Today's lessons — quiz topics OR syllabus topics from the exam pack */}
        {hasQuiz ? (
          <>
            <h3 className="font-display text-xl font-bold text-white mb-3 mt-5">Today&apos;s lessons</h3>
            <div className="space-y-3">
              {Object.entries(quizTopics).map(([topicId, topic], i) => {
                const progress = state.progress?.[subjectId]?.[topicId];
                const mastery = progress?.mastery || 0;
                const isMastered = mastery >= 90;
                return (
                  <motion.div
                    key={topicId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="w-full glass-card p-4 flex items-center gap-4 text-left"
                  >
                    <button
                      onClick={() => { sfx.click(); onNavigate("quiz", { subjectId, topicId }); }}
                      className="flex items-center gap-4 flex-1 min-w-0 text-left active:scale-[0.99] transition"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: subject.soft, boxShadow: `0 0 16px ${subject.glow}` }}
                      >
                        {topic.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-display font-bold text-lg text-white truncate ${subject.isDeva ? "font-deva" : ""}`}>
                          {topic.title}
                        </div>
                        <div className="text-xs text-white/50">
                          {topic.items.length} questions · {progress?.attempts || 0} attempts
                        </div>
                        <div className="mt-1.5 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${mastery}%`, background: subject.accent, boxShadow: `0 0 6px ${subject.glow}` }}
                          />
                        </div>
                      </div>
                    </button>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {isMastered ? (
                        <Crown className="w-6 h-6" style={{ color: subject.accent }} fill={subject.accent} />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      )}
                      <button
                        onClick={() => { sfx.click(); onNavigate("match", { subjectId, topicId }); }}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold active:scale-95 transition"
                        style={{ background: subject.soft, color: subject.accent }}
                        aria-label={`Match game for ${topic.title}`}
                      >
                        <Shuffle className="w-3 h-3" /> Match
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : hasExamPack ? (
          <>
            <div className="flex items-center justify-between mb-3 mt-5">
              <h3 className="font-display text-xl font-bold text-white">Today&apos;s lessons</h3>
              {pack && (
                <span className="text-xs font-medium text-white/50 bg-white/[0.06] px-2 py-0.5 rounded-full">{pack.topics.length} chapters</span>
              )}
            </div>
            {!pack ? (
              // Chapter list lives in a lazily-loaded chunk. Placeholder rows keep
              // the layout stable instead of collapsing then jumping.
              <div className="space-y-3" aria-busy="true" aria-label="Loading chapters">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-2xl flex-shrink-0" style={{ background: subject.soft }} />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3.5 rounded bg-white/10 w-2/3" />
                      <div className="h-2.5 rounded bg-white/[0.07] w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="space-y-3">
              {pack.topics.map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { sfx.click(); onNavigate("exam-prep", { subjectId }); }}
                  className="w-full glass-card p-4 flex items-center gap-4 text-left active:scale-[0.99] transition"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
                    style={{ background: subject.soft, color: subject.accent, boxShadow: `0 0 16px ${subject.glow}` }}
                  >
                    {t.num ?? "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-display font-bold text-base text-white leading-tight ${subject.isDeva ? "font-deva" : ""}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-white/55 mt-0.5 line-clamp-2">{t.blurb}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold mt-1.5" style={{ color: subject.accent }}>
                      {t.syllabus.length} learning points
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
            )}

            {pack && (
              <div className="mt-5 glass-card p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: subject.accent }} />
                <div className="text-xs text-white/70 leading-relaxed">
                  Quizzes for {subject.name} aren&apos;t in the bank yet — the chapter list is sourced from{" "}
                  <span className="font-semibold text-white/90">{pack.context}</span>. Tap any chapter to open Exam Prep, or
                  ask Miss Vidya for a question on it.
                </div>
              </div>
            )}
          </>
        ) : (
          // No quiz + no pack — kind empty state
          <div className="mt-5 glass-card p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: subject.accent }} />
            <div className="font-display text-lg font-bold text-white mb-1">
              Lessons coming soon
            </div>
            <div className="text-sm text-white/60 mb-4">
              We&apos;re still writing topic-level content for this classroom. In the meantime, you can chat with Miss Vidya
              or jot notes.
            </div>
            <div className={`grid ${aiTutorAllowed ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
              {aiTutorAllowed && (
                <button
                  onClick={() => { sfx.click(); onNavigate("tutor", { subjectId }); }}
                  className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
                  style={{ background: subject.soft, color: subject.accent }}
                >
                  <MessageCircle className="w-4 h-4" /> Ask Miss Vidya
                </button>
              )}
              <button
                onClick={() => { sfx.click(); onNavigate("notebook", { subjectId }); }}
                className="rounded-[var(--radius-md)] px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-white/85 glass active:scale-95"
              >
                <NotebookPen className="w-4 h-4" /> Open Notebook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
