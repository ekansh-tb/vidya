"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, Target, ArrowRight, Trophy, Gem, BarChart3, Settings, Check, Users,
  MessageCircle, Globe, BookOpen, Clock, Mic, NotebookPen, Music, Wind,
  Cpu, GraduationCap, Repeat, Heart,
} from "lucide-react";
import { useGameStore } from "@/lib/game-store";
import { Mascot } from "@/components/ui/mascot";
import { XPBar } from "@/components/ui/xp-bar";
import { StreakFlame, StatPill, ProgressRing } from "@/components/ui/indicators";
import { DiyaCompanion } from "@/components/effects/diya";
import { subjectsForLearner } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import { hasPack } from "@/lib/content/packs/pack-index";
import { useCapability } from "@/lib/capabilities/use-capability";
import { xpToLevel } from "@/lib/economy";
import { todayKey } from "@/lib/utils";
import { currentPeriod, nextPeriod, periodProgress } from "@/lib/school-day";
import type { GameState, LearnerProfile, ViewName } from "@/lib/types";
import { sfx } from "@/lib/audio";

/** Whole days from local midnight today to an ISO `YYYY-MM-DD` exam date. */
function daysUntil(isoDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.round((new Date(isoDate + "T00:00:00").getTime() - today.getTime()) / dayMs);
}

/** "Exam today" / "Exam tomorrow" / "Exam in 5 days" — one phrasing, every banner. */
function examCountdownLabel(daysAway: number): string {
  if (daysAway === 0) return "Exam today";
  if (daysAway === 1) return "Exam tomorrow";
  return `Exam in ${daysAway} days`;
}

export function HomeView({
  state, learner, onNavigate,
}: {
  state: GameState;
  learner: LearnerProfile;
  onNavigate: (v: ViewName, params?: Record<string, unknown>) => void;
}) {
  const { level, xpInLevel, xpNeeded } = xpToLevel(state.xp);
  const todayQuestDone = state.dailyQuest?.completed && state.dailyQuest?.date === todayKey();
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;
  const updateLearnerMeta = useGameStore((s) => s.updateLearnerMeta);
  const setGameState = useGameStore((s) => s.set);

  // Unacknowledged note from parent — sits at the very top until kid taps "Got it".
  const unseenNote = learner.familyNote && !learner.familyNote.seenAt ? learner.familyNote : null;
  const ackNote = () => {
    if (!learner.familyNote) return;
    sfx.coin();
    updateLearnerMeta(learner.id, {
      familyNote: { ...learner.familyNote, seenAt: new Date().toISOString() },
    });
  };
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const period = currentPeriod(now);
  const nextP = nextPeriod(now);
  const progress = periodProgress(now);

  const isIgcse = learner.board === "cambridge-igcse";
  const visibleSubjects = useMemo(
    () => subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade),
    [learner.board, learner.pickedSubjects, learner.grade],
  );

  // The Daily Quest pool is drawn from this learner's own subjects. Only the
  // six Cambridge Primary Stage 5 subjects have question banks today, so for
  // every other board the tile would open an empty quiz. Hide it rather than
  // offering a quest that cannot be built.
  const hasDailyQuest = useMemo(
    () => visibleSubjects.some((s) => Object.keys(QUESTIONS[s.id] || {}).length > 0),
    [visibleSubjects],
  );

  const subjectMastery = useMemo(() => {
    return visibleSubjects.map((s) => {
      const topics = Object.keys(QUESTIONS[s.id] || {});
      if (topics.length === 0) return { ...s, mastery: 0 };
      let total = 0;
      topics.forEach((t) => { total += state.progress?.[s.id]?.[t]?.mastery || 0; });
      return { ...s, mastery: Math.round(total / topics.length) };
    });
  }, [state.progress, visibleSubjects]);

  const takingCS = !!learner.pickedSubjects?.includes("igcse-cs");
  const packSubjects = useMemo(
    () => visibleSubjects.filter((s) => hasPack(s.id, learner.grade)),
    [visibleSubjects, learner.grade],
  );
  const firstPack = packSubjects[0];
  const isExamReady = packSubjects.length > 0 && !(isIgcse && takingCS); // CS banner already handles IGCSE-CS

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 6) return "Still dreaming?";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Goodnight soon";
  }, [now]);

  const recommendedSubject = period.subjectId
    ? subjectMastery.find((s) => s.id === period.subjectId)
    : null;

  // Every logged exam, still to come, nearest first — one date calculation for
  // both the countdown banner and the IGCSE Computer Science banner.
  const examsAhead = useMemo(() => {
    return (learner.upcomingExams || [])
      .map((e) => ({ ...e, daysAway: daysUntil(e.date) }))
      .filter((e) => e.daysAway >= 0)
      .sort((a, b) => a.daysAway - b.daysAway);
  }, [learner.upcomingExams]);

  // Nearest upcoming exam within 7 days — drives the countdown banner.
  const upcomingExam = useMemo(() => examsAhead.filter((e) => e.daysAway <= 7)[0], [examsAhead]);

  // The CS banner used to read "Exam Tomorrow" as static copy, asserting an
  // urgency that was permanently false. Say what the learner's own schedule says.
  const csExam = useMemo(() => examsAhead.find((e) => e.subjectId === "igcse-cs"), [examsAhead]);

  return (
    <div className="min-h-screen pb-28 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => { sfx.click(); onNavigate("profile"); }} className="flex items-center gap-3 active:scale-95 transition">
            <Mascot avatarId={state.avatarId} customAvatar={state.customAvatar} size="sm" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{greeting}</div>
              <div className="font-display text-xl font-bold text-white">{state.name.split(" ")[0] || "friend"}</div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <StatPill icon={Coins} value={state.coins} accent="#FBBF24" />
            <button onClick={() => { sfx.click(); onNavigate("profile"); }} className="glass rounded-full px-3 py-1.5 active:scale-95">
              <StreakFlame streak={state.streak} large shields={state.inventory?.freeze || 0} />
            </button>
            <button onClick={() => { sfx.click(); onNavigate("learners"); }} className="glass rounded-full w-10 h-10 flex items-center justify-center active:scale-95" aria-label="Switch learner">
              <Repeat className="w-4 h-4 text-white/70" />
            </button>
            <button onClick={() => { sfx.click(); onNavigate("settings"); }} className="glass rounded-full w-10 h-10 flex items-center justify-center active:scale-95">
              <Settings className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        <div className="glass-card p-4 mb-5">
          <XPBar level={level} xpInLevel={xpInLevel} xpNeeded={xpNeeded} />
        </div>

        {/* Pick up where you left off — shows the last subject the kid opened */}
        {state.lastSubjectId && (() => {
          const lastSub = visibleSubjects.find((s) => s.id === state.lastSubjectId);
          if (!lastSub) return null;
          const Icon = lastSub.icon;
          return (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { sfx.click(); onNavigate("subject", { subjectId: lastSub.id }); }}
              className="w-full p-3 mb-3 rounded-2xl flex items-center gap-3 text-left active:scale-[0.99]"
              style={{
                background: "linear-gradient(90deg, var(--surface) 0%, color-mix(in oklab, var(--accent) 12%, transparent) 100%)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                style={{ background: lastSub.soft, boxShadow: `0 0 16px ${lastSub.glow}` }}
              >
                <Icon className="w-5 h-5" style={{ color: lastSub.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-faint)" }}>
                  Pick up where you left off
                </div>
                <div className={`font-display font-bold text-base ${lastSub.isDeva ? "font-deva" : ""}`} style={{ color: "var(--text)" }}>
                  {lastSub.name}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: lastSub.accent }} />
            </motion.button>
          );
        })()}

        {/* Family note from parent — top-of-fold until acknowledged */}
        {unseenNote && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-5 mb-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(244,114,182,0.20) 0%, rgba(251,191,36,0.14) 100%)",
              border: "1.5px solid rgba(244,114,182,0.42)",
              boxShadow: "0 0 32px rgba(244,114,182,0.22)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Heart className="w-3.5 h-3.5" style={{ color: "#F472B6" }} />
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#F472B6" }}>
                A note for you
              </span>
            </div>
            <div className="text-base font-medium leading-relaxed mb-3 whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.95)" }}>
              {unseenNote.body}
            </div>
            <button
              onClick={ackNote}
              className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest active:scale-95"
              style={{ background: "rgba(244,114,182,0.28)", color: "rgba(255,255,255,0.95)" }}
            >
              <Check className="w-3 h-3 inline -mt-0.5 mr-1" /> Got it
            </button>
          </motion.div>
        )}

        {/* School Day banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 mb-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(34, 211, 238, 0.18) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-4">
            <DiyaCompanion state={state} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                  {period.id === "weekend" ? "Weekend" : "Now in school"}
                </span>
              </div>
              <div className="font-display text-2xl font-bold text-white leading-tight flex items-center gap-2">
                <span>{period.emoji}</span>
                <span className="truncate">{period.name}</span>
              </div>
              {period.cta && (
                <div className="text-sm text-white/70 mt-0.5">{period.cta}</div>
              )}
              {period.id !== "weekend" && (
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(progress * 100)}%` }}
                    transition={{ duration: 0.6 }}
                    style={{ background: "linear-gradient(90deg, #A78BFA, #22D3EE)" }}
                  />
                </div>
              )}
              {nextP && (
                <div className="mt-1.5 text-[11px] text-white/50">
                  Up next · {nextP.emoji} {nextP.name}
                </div>
              )}
            </div>
          </div>

          {recommendedSubject && (
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => { sfx.click(); onNavigate("subject", { subjectId: recommendedSubject.id }); }}
              className="mt-4 w-full rounded-2xl px-4 py-3 flex items-center justify-between text-left active:scale-[0.99] transition"
              style={{ background: recommendedSubject.soft, color: recommendedSubject.accent, boxShadow: `0 0 24px ${recommendedSubject.glow}` }}
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Walk into</div>
                <div className={`font-display text-lg font-bold ${recommendedSubject.isDeva ? "font-deva" : ""}`}>
                  {recommendedSubject.name} class
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Generic Exam Prep banner — surfaces when any exam pack is available for this learner. */}
        {isExamReady && firstPack && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { sfx.click(); onNavigate("exam-prep", { subjectId: firstPack.id }); }}
            className="w-full p-4 text-left mb-5 relative overflow-hidden"
            style={{
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--surface) 100%)",
              border: "1.5px solid var(--border-strong)",
              boxShadow: "0 0 30px var(--accent-glow)",
            }}
          >
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-soft)", boxShadow: "0 0 20px var(--accent-glow)" }}>
                <Cpu className="w-7 h-7" style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
                    {packSubjects.length} {packSubjects.length === 1 ? "subject" : "subjects"} ready · Exam prep
                  </span>
                </div>
                <div className="font-display text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                  Test session — start with {firstPack.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Syllabus · flashcards · practice · cheat sheet
                </div>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: "var(--accent)" }} />
            </div>
          </motion.button>
        )}

        {/* IGCSE Computer Science Exam Prep — top of fold for IGCSE-CS learners */}
        {isIgcse && takingCS && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { sfx.click(); onNavigate("exam-prep"); }}
            className="w-full rounded-3xl p-4 text-left mb-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.25) 0%, rgba(34,211,238,0.18) 100%)",
              border: "1.5px solid rgba(167,139,250,0.5)",
              boxShadow: "0 0 40px rgba(167,139,250,0.3)",
            }}
          >
            <motion.div
              className="absolute inset-0 aurora-bg opacity-15"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(167,139,250,0.25)", boxShadow: "0 0 20px rgba(167,139,250,0.4)" }}>
                <Cpu className="w-7 h-7 text-violet-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-300" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-violet-300">
                    IGCSE 0478 {csExam ? `· ${examCountdownLabel(csExam.daysAway)}` : "· Computer Science"}
                  </span>
                </div>
                <div className="font-display text-xl font-bold text-white leading-tight">
                  {/* "Final Prep" is only true when there's a paper coming. */}
                  Computer Science — {csExam ? "Final Prep" : "Exam prep"}
                </div>
                <div className="text-xs text-white/70 mt-0.5">
                  Syllabus · flashcards · 25 questions · pseudocode · cheat sheet
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-violet-200 flex-shrink-0" />
            </div>
          </motion.button>
        )}

        {/* Exam countdown — surfaces when the parent has logged an exam within 7 days */}
        {upcomingExam && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              sfx.click();
              if (upcomingExam.subjectId) onNavigate("exam-prep", { subjectId: upcomingExam.subjectId });
              else onNavigate("exam-prep");
            }}
            className="w-full p-4 text-left mb-5 relative overflow-hidden rounded-3xl"
            style={{
              background: upcomingExam.daysAway <= 1
                ? "linear-gradient(135deg, rgba(244,114,182,0.25) 0%, rgba(251,113,133,0.18) 100%)"
                : "linear-gradient(135deg, rgba(251,191,36,0.22) 0%, rgba(167,139,250,0.18) 100%)",
              border: `1.5px solid ${upcomingExam.daysAway <= 1 ? "rgba(244,114,182,0.45)" : "rgba(251,191,36,0.4)"}`,
              boxShadow: `0 0 32px ${upcomingExam.daysAway <= 1 ? "rgba(244,114,182,0.28)" : "rgba(251,191,36,0.2)"}`,
            }}
          >
            <div className="relative flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                style={{
                  background: upcomingExam.daysAway <= 1 ? "rgba(244,114,182,0.3)" : "rgba(251,191,36,0.25)",
                  color: upcomingExam.daysAway <= 1 ? "#F472B6" : "#FBBF24",
                }}
              >
                <div className="font-display text-xl font-bold leading-none">{upcomingExam.daysAway}</div>
                <div className="text-[9px] uppercase tracking-widest font-bold leading-none mt-0.5">
                  {upcomingExam.daysAway === 0 ? "today" : upcomingExam.daysAway === 1 ? "day" : "days"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: upcomingExam.daysAway <= 1 ? "#F472B6" : "#FBBF24" }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: upcomingExam.daysAway <= 1 ? "#F472B6" : "#FBBF24" }}>
                    {examCountdownLabel(upcomingExam.daysAway)}
                  </span>
                </div>
                <div className="font-display text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {upcomingExam.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Tap for syllabus · flashcards · practice
                </div>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: upcomingExam.daysAway <= 1 ? "#F472B6" : "#FBBF24" }} />
            </div>
          </motion.button>
        )}

        {/* Daily Quest — only when this learner's subjects actually have questions */}
        {hasDailyQuest && (
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => { sfx.click(); !todayQuestDone && onNavigate("daily"); }}
          disabled={todayQuestDone}
          className={`w-full rounded-3xl p-4 text-left relative overflow-hidden ${
            todayQuestDone ? "glass border-emerald-400/30" : "border-2 border-white/10"
          }`}
          style={
            !todayQuestDone
              ? { background: "linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(244, 114, 182, 0.18) 50%, rgba(251, 191, 36, 0.18) 100%)", boxShadow: "0 0 32px rgba(244, 114, 182, 0.22)" }
              : {}
          }
        >
          {!todayQuestDone && (
            <motion.div
              className="absolute inset-0 aurora-bg opacity-10"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          )}
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-white/80" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">Daily Quest</span>
              </div>
              <div className="font-display text-xl font-bold text-white">
                {todayQuestDone ? "Quest complete" : "Today's challenge"}
              </div>
              <div className="text-xs mt-0.5 text-white/70">
                {todayQuestDone ? "Come back tomorrow" : "6 questions · 50 XP + 25 coins"}
              </div>
            </div>
            <div className="text-white text-3xl">
              {todayQuestDone ? <Check className="w-8 h-8 text-emerald-400" /> : <ArrowRight className="w-8 h-8" />}
            </div>
          </div>
        </motion.button>
        )}
      </div>

      {/* Hallway: experiences */}
      <div className="px-5">
        {/* Daily reflection — kid-authored, end-of-day prompt */}
        <DailyReflectionCard state={state} />

        {/* Review-your-misses banner — only shown when the kid has unresolved misses */}
        {(state.missedQuestions?.length ?? 0) > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => { sfx.click(); onNavigate("review"); }}
            className="w-full glass-card p-3 mb-3 flex items-center gap-3 text-left active:scale-[0.99]"
            style={{ border: "1px solid rgba(244, 114, 182, 0.35)" }}
          >
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-base font-display font-bold"
              style={{ background: "rgba(244, 114, 182, 0.18)", color: "#F472B6" }}
            >
              {state.missedQuestions!.length}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>
                Review your misses
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {state.missedQuestions!.length === 1 ? "1 question" : `${state.missedQuestions!.length} questions`} from past quizzes, waiting for a second try
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F472B6" }}>
              Open →
            </span>
          </motion.button>
        )}

        {/* Single fluid grid — auto-balances to 4 wide × 2 rows whether AI is
            gated (7 tiles) or open (8 tiles). No layout holes either way. */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <RoomTile
            icon={<Mic className="w-5 h-5 text-fuchsia-300" />}
            label="Assembly"
            accent="rgba(244, 114, 182, 0.15)"
            onClick={() => { sfx.click(); onNavigate("assembly"); }}
            badge={state.lastAssemblyDate === todayKey() ? undefined : "Today"}
          />
          {aiTutorAllowed && (
            <RoomTile
              icon={<MessageCircle className="w-5 h-5 text-violet-300" />}
              label="Miss Vidya"
              accent="rgba(167, 139, 250, 0.15)"
              onClick={() => { sfx.click(); onNavigate("tutor"); }}
              badge="AI"
            />
          )}
          <RoomTile
            icon={<Globe className="w-5 h-5 text-cyan-300" />}
            label="Field Trip"
            accent="rgba(34, 211, 238, 0.15)"
            onClick={() => { sfx.click(); onNavigate("field-trip"); }}
          />
          <RoomTile
            icon={<BookOpen className="w-5 h-5 text-amber-300" />}
            label="Library"
            accent="rgba(251, 191, 36, 0.15)"
            onClick={() => { sfx.click(); onNavigate("library"); }}
          />
          <RoomTile
            icon={<NotebookPen className="w-5 h-5 text-rose-300" />}
            label="Notebook"
            accent="rgba(244, 114, 182, 0.12)"
            onClick={() => { sfx.click(); onNavigate("notebook"); }}
          />
          <RoomTile
            icon={<Music className="w-5 h-5 text-violet-300" />}
            label="Music"
            accent="rgba(167, 139, 250, 0.12)"
            onClick={() => { sfx.click(); onNavigate("music"); }}
          />
          <RoomTile
            icon={<Wind className="w-5 h-5 text-emerald-300" />}
            label="Wellness"
            accent="rgba(52, 211, 153, 0.12)"
            onClick={() => { sfx.click(); onNavigate("wellness"); }}
          />
          <RoomTile
            icon={<Users className="w-5 h-5 text-amber-300" />}
            label="Classroom"
            accent="rgba(251, 191, 36, 0.12)"
            onClick={() => { sfx.click(); onNavigate("friends"); }}
          />
        </div>

        {/* Classroom doors */}
        <h2 className="font-display text-2xl font-bold text-white mb-3 flex items-center gap-2">
          Classrooms
          <span className="text-xs font-body font-medium text-white/50 bg-white/[0.06] px-2 py-0.5 rounded-full">{visibleSubjects.length}</span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {subjectMastery.map((s, i) => {
            const Icon = s.icon;
            const isNow = period.subjectId === s.id;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { sfx.click(); onNavigate("subject", { subjectId: s.id }); }}
                className="glass-card p-4 text-left relative overflow-hidden group"
                style={isNow ? { boxShadow: `0 0 30px ${s.glow}, 0 0 0 1.5px ${s.accent}` } : {}}
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 group-hover:opacity-50 transition-opacity blur-2xl"
                  style={{ background: s.accent }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: s.soft, boxShadow: `0 0 20px ${s.glow}` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: s.accent }} />
                    </div>
                    <ProgressRing percent={s.mastery} size={42} stroke={4} color={s.accent} />
                  </div>
                  <div className={`font-display text-xl font-bold mb-0.5 text-white ${s.isDeva ? "font-deva" : ""}`}>
                    {s.name}
                  </div>
                  <div className={`text-xs text-white/50 ${s.id === "marathi" ? "font-deva" : ""}`}>{s.tagline}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                      {s.mastery}% mastered
                    </div>
                    {isNow && (
                      <div
                        className="text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5"
                        style={{ background: s.soft, color: s.accent }}
                      >
                        in session
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom strip */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <button onClick={() => { sfx.click(); onNavigate("profile"); }} className="glass rounded-2xl p-3 text-center active:scale-95">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-300" />
            <div className="text-xs font-semibold text-white/80">Badges</div>
          </button>
          <button onClick={() => { sfx.click(); onNavigate("shop"); }} className="glass rounded-2xl p-3 text-center active:scale-95">
            <Gem className="w-5 h-5 mx-auto mb-1 text-violet-300" />
            <div className="text-xs font-semibold text-white/80">Power-ups</div>
          </button>
          <button onClick={() => { sfx.click(); onNavigate("parent"); }} className="glass rounded-2xl p-3 text-center active:scale-95">
            <BarChart3 className="w-5 h-5 mx-auto mb-1 text-cyan-300" />
            <div className="text-xs font-semibold text-white/80">Parent</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomTile({
  icon, label, accent, onClick, badge,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative rounded-2xl glass p-3 flex flex-col items-center justify-center gap-1 text-center active:scale-95 transition"
      style={{ background: accent }}
    >
      {icon}
      <div className="text-xs font-semibold text-white/85 leading-tight">{label}</div>
      {badge && (
        <div className="absolute top-1 right-1 text-[9px] font-bold uppercase tracking-widest rounded-full px-1.5 py-0.5 bg-gradient-to-br from-fuchsia-500 to-amber-500 text-white shadow-sm">
          {badge}
        </div>
      )}
    </motion.button>
  );
}

/**
 * DailyReflectionCard — small kid-authored prompt.
 *
 * Shown only after 4 PM local time AND if today has no reflection saved.
 * The kid types 1-2 sentences ("What did you learn today?") and saves.
 * Stored under `state.dailyReflections` for parent visibility — labelled
 * explicitly so the kid knows the parent can read them. Transparency
 * over surveillance.
 */
function DailyReflectionCard({ state }: { state: GameState }) {
  const setGameState = useGameStore((s) => s.set);
  const [draft, setDraft] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [keepPrivate, setKeepPrivate] = useState(false);

  const dateKey = todayKey();
  const today = new Date();
  const hour = today.getHours();
  const todayDone = (state.dailyReflections || []).some((r) => r.date === dateKey);

  // Saving writes today's reflection into state, which flips `todayDone` true on
  // the very next render — so the "saved · +5 XP" confirmation below could never
  // appear and the card just vanished under the kid's finger. Hold the card open
  // while `justSaved` is set so the acknowledgement is actually seen.
  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1800);
    return () => clearTimeout(t);
  }, [justSaved]);

  // Only show after 4 PM local — natural reflection time, end of school day.
  // Once today's is saved the card retires until tomorrow.
  if (todayDone && !justSaved) return null;
  if (hour < 16) return null;

  const save = () => {
    const body = draft.trim();
    if (!body) return;
    sfx.coin();
    setGameState((s) => ({
      ...s,
      xp: s.xp + 5,
      dailyReflections: [
        ...(s.dailyReflections || []),
        { date: dateKey, body, savedAt: new Date().toISOString(), private: keepPrivate || undefined },
      ],
    }));
    setDraft("");
    setKeepPrivate(false);
    setJustSaved(true); // the effect above clears it, and cleans up on unmount
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-4 mb-3 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(167,139,250,0.16) 0%, rgba(52,211,153,0.12) 100%)",
        border: "1px solid rgba(167,139,250,0.3)",
      }}
    >
      {justSaved ? (
        <div className="flex items-center gap-2 py-2">
          <Check className="w-5 h-5 text-emerald-300" />
          <div>
            <div className="text-sm font-bold text-white">Reflection saved · +5 XP</div>
            <div className="text-[11px] text-white/60">See you tomorrow.</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <NotebookPen className="w-3.5 h-3.5 text-violet-300" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-violet-300">
              Today&apos;s reflection
            </span>
          </div>
          <div className="text-sm font-medium text-white/95 mb-2 leading-snug">
            What did you learn today?
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 200))}
            placeholder="One sentence is enough."
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-sm resize-none text-white/95 placeholder:text-white/30"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <div className="flex items-center justify-between mt-2 gap-2">
            <button
              type="button"
              onClick={() => { sfx.click(); setKeepPrivate((v) => !v); }}
              className="text-[10px] italic flex items-center gap-1.5 active:scale-95"
              style={{ color: keepPrivate ? "rgba(244,114,182,0.95)" : "rgba(255,255,255,0.45)" }}
            >
              <span className="text-sm leading-none">{keepPrivate ? "🔒" : "🔓"}</span>
              {keepPrivate ? "Just for me" : "Your parent can read this"} · {draft.length}/200
            </button>
            <button
              onClick={save}
              disabled={!draft.trim()}
              className="rounded-full px-4 min-h-[44px] text-xs font-bold uppercase tracking-widest active:scale-95 disabled:opacity-40"
              style={{ background: "rgba(167,139,250,0.3)", color: "white" }}
            >
              Save · +5 XP
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
