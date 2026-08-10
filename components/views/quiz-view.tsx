"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lightbulb, ScanLine, Zap, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP, SUBJECTS } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import type { GameState, SubjectId, QuizResult, WrongAnswer } from "@/lib/types";
import { shuffle, todayKey } from "@/lib/utils";
import { sfx } from "@/lib/audio";
import { vidya } from "@/lib/speech";
import { xpToLevel } from "@/lib/economy";
import { BADGES } from "@/lib/content/badges";
import { SixSevenOverlay } from "@/components/effects/six-seven-overlay";
import { BookPanel } from "@/components/effects/book-panel";

type EnrichedQuestion = {
  q: string;
  a: string;
  opts: string[];
  ex: string;
  subjectId: SubjectId;
  topicId: string;
  topicTitle: string;
};

const QUIZ_SIZE = 7;

function pickWithSeenPreference<T extends { q: string }>(items: T[], seen: string[], count: number): T[] {
  const unseen = items.filter((it) => !seen.includes(it.q));
  const alreadySeen = items.filter((it) => seen.includes(it.q));
  const ordered = [...shuffle(unseen), ...shuffle(alreadySeen)];
  return ordered.slice(0, Math.min(count, items.length));
}

function buildDailyQuiz(seen: Record<string, Record<string, string[]>>): EnrichedQuestion[] {
  const items: EnrichedQuestion[] = [];
  SUBJECTS.forEach((s) => {
    const topics = Object.entries(QUESTIONS[s.id] || {});
    if (!topics.length) return;
    const [topicId, topic] = topics[Math.floor(Math.random() * topics.length)];
    const seenForTopic = seen[s.id]?.[topicId] || [];
    const [q] = pickWithSeenPreference(topic.items, seenForTopic, 1);
    if (q) items.push({ ...q, subjectId: s.id, topicId, topicTitle: topic.title });
  });
  return items;
}

function buildTopicQuiz(
  subjectId: SubjectId,
  topicId: string,
  seen: Record<string, Record<string, string[]>>,
): EnrichedQuestion[] {
  const topic = QUESTIONS[subjectId]?.[topicId];
  if (!topic) return [];
  const seenForTopic = seen[subjectId]?.[topicId] || [];
  return pickWithSeenPreference(topic.items, seenForTopic, QUIZ_SIZE).map((q) => ({
    ...q,
    subjectId,
    topicId,
    topicTitle: topic.title,
  }));
}

export function QuizView({
  subjectId, topicId, isDaily, state, setState, onFinish, onClose, voiceEnabled,
}: {
  subjectId?: SubjectId;
  topicId?: string;
  isDaily: boolean;
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onFinish: (result: QuizResult) => void;
  onClose?: () => void;
  voiceEnabled: boolean;
}) {
  const questions = useMemo(() => {
    if (isDaily) return buildDailyQuiz(state.seenQuestions || {});
    if (subjectId && topicId) return buildTopicQuiz(subjectId, topicId, state.seenQuestions || {});
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDaily, subjectId, topicId]);

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [hintUsed, setHintUsed] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [startTime] = useState(() => Date.now());
  const [combo, setCombo] = useState(0);
  const [sixSeven, setSixSeven] = useState<number | null>(null);
  const [sixSevenShown, setSixSevenShown] = useState<Set<number>>(() => new Set());
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [bookOpen, setBookOpen] = useState(false);

  const currentQ = questions[qIdx];
  const currentSubject = currentQ ? SUBJECT_MAP[currentQ.subjectId] : null;
  const isDeva = currentSubject?.isDeva;

  useEffect(() => {
    if (currentQ) {
      setShuffledOpts(shuffle(currentQ.opts));
      setSelected(null);
      setRevealed(false);
      setHintUsed(false);
      setFiftyUsed(false);
      setEliminated([]);
    }
  }, [qIdx, currentQ]);

  const handleAnswer = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const isCorrect = option === currentQ.a;

    if (isCorrect) {
      sfx.correct();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const nextCorrect = score.correct + 1;
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));

      if ((nextCorrect === 6 || nextCorrect === 7) && !sixSevenShown.has(nextCorrect)) {
        setSixSeven(nextCorrect);
        setSixSevenShown((prev) => new Set(prev).add(nextCorrect));
        sfx.sixSeven?.();
      }

      if (voiceEnabled && Math.random() > 0.55) {
        if (newCombo >= 3 && newCombo % 3 === 0) {
          vidya.combo(newCombo);
        } else {
          vidya.correct();
        }
      }

      setState((prev) => {
        const wasWrong = prev.comeback?.wasWrong || false;
        const newSince = wasWrong ? (prev.comeback?.sinceWrongCorrect || 0) + 1 : 0;
        const badges = [...prev.badges];
        if (wasWrong && newSince >= 5 && !badges.includes("comeback")) {
          badges.push("comeback");
        }
        // If this same question was previously in the miss log, mastered now — remove it.
        const missedQuestions = (prev.missedQuestions || []).filter((m) => m.q !== currentQ.q);
        return {
          ...prev,
          comeback: { wasWrong: newSince < 5 ? wasWrong : false, sinceWrongCorrect: newSince < 5 ? newSince : 0 },
          badges,
          missedQuestions,
        };
      });
    } else {
      sfx.wrong();
      setCombo(0);
      setScore((s) => ({ correct: s.correct, total: s.total + 1 }));
      if (voiceEnabled && Math.random() > 0.4) vidya.wrong();
      const missed = { q: currentQ.q, given: option, correct: currentQ.a, ex: currentQ.ex, isDeva: !!isDeva };
      setWrongAnswers((prev) => [...prev, missed]);
      setState((prev) => {
        // Persistent miss log (capped at 50 most-recent per learner)
        const entry: import("@/lib/types").MissedQuestion = {
          id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          q: missed.q,
          given: missed.given,
          correct: missed.correct,
          ex: missed.ex,
          isDeva: missed.isDeva,
          subjectId,
          topicId,
          missedAt: new Date().toISOString(),
        };
        const existing = prev.missedQuestions || [];
        // Dedup by exact question text — most-recent given/timestamp wins
        const filtered = existing.filter((m) => m.q !== entry.q);
        const next = [entry, ...filtered].slice(0, 50);
        return {
          ...prev,
          comeback: { wasWrong: true, sinceWrongCorrect: 0 },
          missedQuestions: next,
        };
      });
    }
  };

  const useHint = () => {
    if (hintUsed || revealed || state.inventory.hint < 1) return;
    setHintUsed(true);
    setState((prev) => ({ ...prev, inventory: { ...prev.inventory, hint: prev.inventory.hint - 1 } }));
    sfx.click();
  };

  const useFifty = () => {
    if (fiftyUsed || revealed || state.inventory.fiftyFifty < 1) return;
    const wrongs = shuffledOpts.filter((o) => o !== currentQ.a);
    const toRemove = shuffle(wrongs).slice(0, 2);
    setEliminated(toRemove);
    setFiftyUsed(true);
    setState((prev) => ({ ...prev, inventory: { ...prev.inventory, fiftyFifty: prev.inventory.fiftyFifty - 1 } }));
    sfx.click();
  };

  const finishQuiz = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const baseXp = score.correct * 10 + (accuracy === 100 ? 50 : 0) + (isDaily ? 50 : 0);
    const xpEarned = state.doubleXpActive ? baseXp * 2 : baseXp;
    const coinsEarned = score.correct * 5 + (isDaily ? 25 : 0);

    let leveledUp = false;
    let newLevel = 1;
    let oldLevel = 1;
    let newBadges: string[] = [];
    let finishedStreak = 0;

    setState((prev) => {
      const today = todayKey();
      const newStreak = prev.lastPlayedDate === today ? prev.streak : (prev.lastPlayedDate ? prev.streak + 1 : 1);
      finishedStreak = newStreak;
      const longestStreak = Math.max(prev.longestStreak || 0, newStreak);

      const newProgress = { ...prev.progress };
      if (!isDaily && subjectId && topicId) {
        if (!newProgress[subjectId]) newProgress[subjectId] = {};
        const existing = newProgress[subjectId][topicId] || { attempts: 0, correct: 0, mastery: 0 };
        const newMastery = Math.round(existing.mastery * 0.4 + accuracy * 0.6);
        newProgress[subjectId][topicId] = {
          attempts: existing.attempts + 1,
          correct: existing.correct + score.correct,
          mastery: Math.max(existing.mastery, newMastery),
        };
      }

      const badges = [...prev.badges];
      const stats = {
        totalAnswered: prev.stats.totalAnswered + score.total,
        totalCorrect: prev.stats.totalCorrect + score.correct,
        quizzesCompleted: prev.stats.quizzesCompleted + 1,
        dailyQuestsCompleted: prev.stats.dailyQuestsCompleted + (isDaily ? 1 : 0),
        fastestQuiz: prev.stats.fastestQuiz === null ? elapsed : Math.min(prev.stats.fastestQuiz, elapsed),
      };

      const checkAdd = (id: string) => { if (!badges.includes(id)) badges.push(id); };

      if (stats.quizzesCompleted >= 1) checkAdd("first-steps");
      if (accuracy === 100) checkAdd("perfect-score");
      if (newStreak >= 7) checkAdd("streak-7");
      if (newStreak >= 30) checkAdd("streak-30");
      if (stats.totalAnswered >= 50) checkAdd("questions-50");
      if (stats.totalAnswered >= 250) checkAdd("questions-250");
      if (stats.totalAnswered >= 500) checkAdd("questions-500");
      if (elapsed < 60 && stats.quizzesCompleted > 0) checkAdd("speed-demon");
      if (stats.dailyQuestsCompleted >= 7) checkAdd("daily-hero");

      const subjectBadgeMap: Record<string, string> = {
        maths: "maths-master", science: "science-star", english: "wordsmith",
        hindi: "bhasha-premi", marathi: "marathi-mitra", gk: "world-explorer",
      };
      Object.entries(subjectBadgeMap).forEach(([sId, bId]) => {
        const topicsForS = Object.keys(QUESTIONS[sId as SubjectId] || {});
        const allMastered = topicsForS.length > 0 && topicsForS.every((t) => (newProgress[sId]?.[t]?.mastery || 0) >= 90);
        if (allMastered) checkAdd(bId);
      });

      const newXp = prev.xp + xpEarned;
      newLevel = xpToLevel(newXp).level;
      oldLevel = xpToLevel(prev.xp).level;
      if (newLevel >= 10) checkAdd("level-10");
      if (newLevel >= 25) checkAdd("level-25");

      newBadges = badges.filter((b) => !prev.badges.includes(b));
      leveledUp = newLevel > oldLevel;

      let dailyQuest = prev.dailyQuest;
      if (isDaily) dailyQuest = { date: today, completed: true };

      const seenQuestions = { ...(prev.seenQuestions || {}) };
      questions.forEach((q) => {
        const sId = q.subjectId;
        const tId = q.topicId;
        const pool = QUESTIONS[sId]?.[tId]?.items || [];
        if (!seenQuestions[sId]) seenQuestions[sId] = { ...(prev.seenQuestions?.[sId] || {}) };
        const prevSeen = seenQuestions[sId][tId] || [];
        let nextSeen = prevSeen.includes(q.q) ? prevSeen : [...prevSeen, q.q];
        if (pool.length > 0 && pool.every((p) => nextSeen.includes(p.q))) {
          nextSeen = [];
        }
        seenQuestions[sId][tId] = nextSeen;
      });

      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinsEarned,
        streak: newStreak,
        longestStreak,
        lastPlayedDate: today,
        progress: newProgress,
        badges,
        stats,
        doubleXpActive: false,
        dailyQuest,
        seenQuestions,
        lastQuestCorrect: score.correct,
      };
    });

    setTimeout(() => {
      if (voiceEnabled) {
        if (leveledUp) vidya.levelUp(newLevel);
        else if (accuracy === 100) vidya.perfect();
        else if (newBadges.length > 0) {
          const b = BADGES.find((x) => x.id === newBadges[0]);
          if (b) vidya.badge(b.name);
        } else if (isDaily) vidya.daily();
      }
      if (leveledUp) sfx.levelUp();
      else if (newBadges.length > 0) sfx.badge();

      onFinish({
        accuracy, xpEarned, coinsEarned, elapsed,
        newBadges, leveledUp, newLevel, oldLevel,
        score, subjectId, topicId,
        wrong: wrongAnswers,
        streak: finishedStreak,
        isDaily,
      });
    }, 100);
  };

  const nextQuestion = () => {
    if (qIdx + 1 < questions.length) setQIdx(qIdx + 1);
    else finishQuiz();
  };

  if (!questions.length || !currentQ) return null;

  const isCorrectAnswer = revealed && selected === currentQ.a;

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <AnimatePresence>
        {sixSeven !== null && (
          <SixSevenOverlay score={sixSeven} onDone={() => setSixSeven(null)} />
        )}
      </AnimatePresence>
      {currentQ && (
        <BookPanel
          open={bookOpen}
          subjectId={currentQ.subjectId}
          topicId={currentQ.topicId}
          onClose={() => setBookOpen(false)}
        />
      )}
      <div className="px-5 pt-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { sfx.click(); onClose?.(); }} className="text-white/50 active:scale-95">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full"
                style={{ background: currentSubject?.accent || "#22D3EE", boxShadow: `0 0 8px ${currentSubject?.glow || "#22D3EE99"}` }}
              />
            </div>
          </div>
          <div className="text-xs font-mono text-white/50">
            {qIdx + 1}/{questions.length}
          </div>
          {currentQ && (
            <button
              onClick={() => { sfx.click(); setBookOpen(true); }}
              className="ml-3 w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 active:scale-95"
              style={currentSubject ? { color: currentSubject.accent, background: currentSubject.soft } : undefined}
              aria-label="Open book"
              title="Skim the book"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
        </div>

        {isDaily && currentSubject && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: currentSubject.soft }}>
              <currentSubject.icon className="w-4 h-4" style={{ color: currentSubject.accent }} />
            </div>
            <div className="text-sm font-semibold" style={{ color: currentSubject.accent }}>{currentSubject.name}</div>
            <div className="text-xs text-white/40">·</div>
            <div className={`text-xs text-white/60 ${currentSubject.isDeva ? "font-deva" : ""}`}>{currentQ.topicTitle}</div>
          </div>
        )}

        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className="flex items-center justify-center gap-1.5 mb-3"
            >
              <Zap className="w-4 h-4 text-amber-300" fill="#FBBF24" />
              <span className="text-sm font-bold text-gradient-sunset">{combo}× Combo</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={qIdx}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card p-6 mb-4"
        >
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Question</div>
          <h2 className={`font-display text-2xl font-bold text-white leading-snug ${isDeva ? "font-deva" : ""}`}>
            {currentQ.q}
          </h2>
          {hintUsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30"
            >
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <div className={`text-sm text-amber-100 ${isDeva ? "font-deva" : ""}`}>
                  Hint: {currentQ.ex.split(".")[0]}.
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-2.5">
          {shuffledOpts.map((opt, i) => {
            const isElim = eliminated.includes(opt);
            const isSelected = selected === opt;
            const isAnswer = opt === currentQ.a;
            let style = "glass border-white/10 text-white hover:bg-white/[0.09]";
            if (revealed) {
              if (isAnswer) style = "bg-emerald-500/15 border-emerald-400/60 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30";
              else if (isSelected) style = "bg-rose-500/15 border-rose-400/60 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-500/30";
              else style = "glass border-white/5 text-white/40";
            } else if (isElim) {
              style = "bg-white/[0.02] border-white/5 text-white/20 line-through cursor-not-allowed";
            }
            return (
              <motion.button
                key={opt + i}
                whileTap={{ scale: revealed ? 1 : 0.98 }}
                onClick={() => !isElim && handleAnswer(opt)}
                disabled={revealed || isElim}
                className={`w-full p-4 rounded-2xl border text-left font-semibold transition-all flex items-center gap-3 ${style} ${isDeva ? "font-deva" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  revealed && isAnswer ? "bg-emerald-500 text-white"
                  : revealed && isSelected ? "bg-rose-500 text-white"
                  : "bg-white/[0.08] text-white/70"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">{opt}</div>
                {revealed && isAnswer && <Check className="w-5 h-5 text-emerald-400" />}
                {revealed && isSelected && !isAnswer && <X className="w-5 h-5 text-rose-400" />}
              </motion.button>
            );
          })}
        </div>

        {!revealed && (
          <div className="mt-5 flex gap-2 justify-center">
            <button
              onClick={useHint}
              disabled={hintUsed || state.inventory.hint < 1}
              className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-sm font-semibold text-amber-300 disabled:opacity-30 active:scale-95"
            >
              <Lightbulb className="w-4 h-4" /> Hint · {state.inventory.hint}
            </button>
            <button
              onClick={useFifty}
              disabled={fiftyUsed || state.inventory.fiftyFifty < 1}
              className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-sm font-semibold text-violet-300 disabled:opacity-30 active:scale-95"
            >
              <ScanLine className="w-4 h-4" /> 50:50 · {state.inventory.fiftyFifty}
            </button>
          </div>
        )}

        {revealed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <div className={`rounded-3xl p-4 mb-3 ${isCorrectAnswer ? "bg-emerald-500/15 border border-emerald-400/30" : "bg-rose-500/15 border border-rose-400/30"}`}>
              <div className={`flex items-center gap-2 mb-1.5 font-bold ${isCorrectAnswer ? "text-emerald-300" : "text-rose-300"}`}>
                {isCorrectAnswer ? <><Check className="w-5 h-5" /> Correct!</> : <><X className="w-5 h-5" /> Not quite</>}
              </div>
              <div className={`text-sm text-white/80 ${isDeva ? "font-deva" : ""}`}>{currentQ.ex}</div>
            </div>
            <Button size="lg" className="w-full" onClick={nextQuestion}>
              {qIdx + 1 < questions.length ? "Next Question" : "Finish Quiz"} <ArrowRight className="inline w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
