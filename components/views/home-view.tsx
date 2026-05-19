"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, Target, ArrowRight, Trophy, Gem, BarChart3, Settings, Check, Users,
  MessageCircle, Globe, BookOpen, Clock, Mic, NotebookPen, Music, Wind,
  Cpu, GraduationCap, Repeat,
} from "lucide-react";
import { Mascot } from "@/components/ui/mascot";
import { XPBar } from "@/components/ui/xp-bar";
import { StreakFlame, StatPill, ProgressRing } from "@/components/ui/indicators";
import { DiyaCompanion } from "@/components/effects/diya";
import { subjectsForLearner } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import { packFor } from "@/lib/content/packs";
import { xpToLevel } from "@/lib/economy";
import { todayKey } from "@/lib/utils";
import { currentPeriod, nextPeriod, periodProgress } from "@/lib/school-day";
import type { GameState, LearnerProfile, ViewName } from "@/lib/types";
import { sfx } from "@/lib/audio";

export function HomeView({
  state, learner, onNavigate,
}: {
  state: GameState;
  learner: LearnerProfile;
  onNavigate: (v: ViewName, params?: Record<string, unknown>) => void;
}) {
  const { level, xpInLevel, xpNeeded } = xpToLevel(state.xp);
  const todayQuestDone = state.dailyQuest?.completed && state.dailyQuest?.date === todayKey();
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
    () => visibleSubjects.filter((s) => !!packFor(s.id, learner.grade)),
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
              <StreakFlame streak={state.streak} large />
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

        {/* IGCSE Computer Science Exam Prep — top of fold for Nevaan */}
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
                  <span className="text-[10px] uppercase tracking-widest font-bold text-violet-300">IGCSE 0478 · Exam Tomorrow</span>
                </div>
                <div className="font-display text-xl font-bold text-white leading-tight">
                  Computer Science — Final Prep
                </div>
                <div className="text-xs text-white/70 mt-0.5">
                  Syllabus · flashcards · 25 questions · pseudocode · cheat sheet
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-violet-200 flex-shrink-0" />
            </div>
          </motion.button>
        )}

        {/* Daily Quest */}
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
      </div>

      {/* Hallway: experiences */}
      <div className="px-5">
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

        <div className="grid grid-cols-4 gap-2 mb-3">
          <RoomTile
            icon={<Mic className="w-5 h-5 text-fuchsia-300" />}
            label="Assembly"
            accent="rgba(244, 114, 182, 0.15)"
            onClick={() => { sfx.click(); onNavigate("assembly"); }}
            badge={state.lastAssemblyDate === todayKey() ? undefined : "Today"}
          />
          <RoomTile
            icon={<MessageCircle className="w-5 h-5 text-violet-300" />}
            label="Miss Vidya"
            accent="rgba(167, 139, 250, 0.15)"
            onClick={() => { sfx.click(); onNavigate("tutor"); }}
            badge="AI"
          />
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
        </div>
        <div className="grid grid-cols-4 gap-2 mb-5">
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
            label="Friends"
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
