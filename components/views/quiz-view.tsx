"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { X, Check, Lightbulb, ScanLine, Zap, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { questionsForLearner, type LearnerQuestionBanks } from "@/lib/content/questions/availability";
import type { GameState, LearnerProfile, Subject, SubjectId, QuizResult, WrongAnswer, MissedQuestion } from "@/lib/types";
import { recordCorrect, recordWrong, newCard, capNotebook } from "@/lib/spaced-repetition";
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

/**
 * Builds the Daily Quest from the LEARNER'S OWN subjects.
 *
 * This used to iterate the global SUBJECTS array — every id across all five
 * boards. Since the question bank only holds the six Cambridge Primary
 * Stage 5 subjects, a Grade 10 IGCSE learner tapping Daily Quest was asked
 * place-value questions and given Hindi/Marathi items for subjects they do
 * not take. Cambridge Primary was the only board where the journey was right.
 *
 * Returns an empty array when the learner has no subject with a question bank;
 * callers must hide the entry point rather than opening an empty quiz.
 */
function buildDailyQuiz(
  seen: Record<string, Record<string, string[]>>,
  learnerSubjects: Subject[],
  questionBanks: LearnerQuestionBanks,
): EnrichedQuestion[] {
  const items: EnrichedQuestion[] = [];
  learnerSubjects.forEach((s) => {
    const topics = Object.entries(questionBanks[s.id] || {});
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
  questionBanks: LearnerQuestionBanks,
): EnrichedQuestion[] {
  const topic = questionBanks[subjectId]?.[topicId];
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
  subjectId, topicId, isDaily, learner, learnerSubjects, state, setState, onFinish, onClose, voiceEnabled,
}: {
  subjectId?: SubjectId;
  topicId?: string;
  isDaily: boolean;
  learner: Pick<LearnerProfile, "board" | "grade">;
  /** The learner's own subjects — the Daily Quest pool is drawn from these. */
  learnerSubjects: Subject[];
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onFinish: (result: QuizResult) => void;
  onClose?: () => void;
  voiceEnabled: boolean;
}) {
  const questionBanks = questionsForLearner(learner);
  const questions = useMemo(() => {
    if (isDaily) return buildDailyQuiz(state.seenQuestions || {}, learnerSubjects, questionBanks);
    if (subjectId && topicId) return buildTopicQuiz(subjectId, topicId, state.seenQuestions || {}, questionBanks);
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDaily, subjectId, topicId, learnerSubjects, questionBanks]);

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
  const reduced = useReducedMotion();

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
        // A previously-missed question answered right: PROMOTED, not deleted.
        //
        // This used to be `.filter(m => m.q !== currentQ.q)` — one correct
        // answer and the card was gone. That is the weakest evidence of
        // learning there is: the explanation was on screen moments ago and the
        // question is word-for-word the one they just read. The card now moves
        // up a Leitner box and comes back on a longer interval, leaving the
        // notebook only after surviving all of them. See lib/spaced-repetition.
        const missedQuestions: MissedQuestion[] = [];
        for (const m of prev.missedQuestions || []) {
          if (m.q !== currentQ.q) { missedQuestions.push(m); continue; }
          const outcome = recordCorrect(m);
          if (outcome.kind === "scheduled") missedQuestions.push(outcome.card);
          // "retired" — it earned its way out.
        }
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
        const existing = prev.missedQuestions || [];
        const prior = existing.find((m) => m.q === missed.q);

        // A card already in the notebook that is missed AGAIN is a lapse:
        // straight back to box 0, due immediately, and its review history is
        // kept so the schedule reflects what actually happened rather than
        // restarting as though this were the first time.
        const entry: MissedQuestion = prior
          ? recordWrong({ ...prior, given: missed.given, missedAt: new Date().toISOString() })
          : newCard({
              id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
              q: missed.q,
              given: missed.given,
              correct: missed.correct,
              ex: missed.ex,
              isDeva: missed.isDeva,
              subjectId,
              topicId,
              missedAt: new Date().toISOString(),
            });

        const filtered = existing.filter((m) => m.q !== entry.q);
        // Cap by how well-learned a card is, not by age — see capNotebook.
        const next = capNotebook([entry, ...filtered], 50);
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
        const topicsForS = Object.keys(questionBanks[sId as SubjectId] || {});
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
        const pool = questionBanks[sId]?.[tId]?.items || [];
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

  // Returning null left the kid on the cosmic background with no header, no
  // close button and no way out but a reload. Reachable when a topic's items
  // are empty, when a subject/topic pair goes stale, and — now that the daily
  // pool is scoped to the learner — whenever they have no subject with a
  // question bank yet. Always give them a door.
  if (!questions.length || !currentQ) {
    return (
      <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-5 pt-6">
        <button
          onClick={() => { sfx.click(); onClose?.(); }}
          className="flex items-center gap-1 font-medium mb-6 active:scale-95 self-start"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-5 h-5" /> Close
        </button>
        <div className="glass-card p-8 text-center">
          <div className="text-5xl mb-3 opacity-70">🌱</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
            Nothing to quiz here yet
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {isDaily
              ? "We're still writing quests for your subjects. Try a Classroom, the Library or a Field Trip in the meantime."
              : "This topic doesn't have questions yet. Try another one, or ask Miss Vidya about it."}
          </p>
          <Button onClick={() => { sfx.click(); onClose?.(); }}>Back</Button>
        </div>
      </div>
    );
  }

  const isCorrectAnswer = revealed && selected === currentQ.a;

  return (
    <ReducedMotionProvider>
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
            {/* Icon-only, and the padding is what lifts a 24px glyph to a 44px
                target for small fingers. */}
            <button
              onClick={() => { sfx.click(); onClose?.(); }}
              className="text-white/50 active:scale-95 w-11 h-11 -ml-2.5 flex items-center justify-center"
              aria-label="Close quiz"
            >
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
                className="ml-3 w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 active:scale-95"
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
              {/* Hindi/Marathi/Sanskrit subject names are Devanagari; the topic
                  title beside this already switches font, this did not. */}
              <div className={`text-sm font-semibold ${currentSubject.isDeva ? "font-deva" : ""}`} style={{ color: currentSubject.accent }}>{currentSubject.name}</div>
              <div className="text-xs text-white/40">·</div>
              <div className={`text-xs text-white/60 ${currentSubject.isDeva ? "font-deva" : ""}`}>{currentQ.topicTitle}</div>
            </div>
          )}

          <AnimatePresence>
            {combo >= 2 && (
              <motion.div
                key={combo}
                initial={reduced ? { opacity: 0 } : { scale: 0, y: 10 }}
                // A streak that looks identical at 2x and at 8x is not a streak.
                // Growth is capped so it never crowds the question above it.
                animate={{ scale: reduced ? 1 : Math.min(1 + (combo - 2) * 0.06, 1.3), y: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { scale: 0 }}
                transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 500, damping: 15 }}
                className="flex items-center justify-center gap-1.5 mb-3"
              >
                <motion.span
                  animate={reduced || combo < 5 ? {} : { rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <Zap className="w-4 h-4 text-amber-300" fill="#FBBF24" />
                </motion.span>
                <span className="text-sm font-bold text-gradient-sunset">{combo}× Combo</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={qIdx}
            // The question card is most of the screen; zooming and sliding it on
            // every question is the sort of large-area motion reduced motion is for.
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card p-6 mb-4"
          >
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Question</div>
            <h2 className={`font-display text-2xl font-bold text-white leading-snug ${isDeva ? "font-deva" : ""}`}>
              {currentQ.q}
            </h2>
            {hintUsed && (
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
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
                  // qIdx in the key so the options re-enter on every question
                  // rather than silently swapping their text.
                  key={`${qIdx}-${opt}-${i}`}
                  whileTap={reduced ? undefined : { scale: revealed ? 1 : 0.98 }}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  // Three states in one prop: entering, confirmed right (a small
                  // pop), and confirmed wrong (a short shake). The shake is the
                  // only one that moves horizontally, so the two verdicts never
                  // read as the same beat.
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : revealed && isAnswer
                        ? { opacity: 1, y: 0, scale: [1, 1.045, 1] }
                        : revealed && isSelected
                          ? { opacity: 1, y: 0, x: [0, -9, 8, -6, 4, 0] }
                          : { opacity: 1, y: 0 }
                  }
                  transition={
                    reduced
                      ? { duration: 0.15 }
                      : revealed
                        ? { duration: 0.42, ease: "easeOut" }
                        // Options land one after another so the eye reads them
                        // in order instead of meeting four at once.
                        : { delay: 0.06 + i * 0.05, type: "spring", stiffness: 380, damping: 26 }
                  }
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

          {/* Right vs wrong is carried by colour, a ring and an icon, none of
              which reach a screen reader. This region is always mounted so the
              verdict is announced the moment it is filled in. */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {revealed ? `${isCorrectAnswer ? "Correct." : "Not quite."} ${currentQ.ex}` : ""}
          </div>

          {!revealed && (
            <div className="mt-5 flex gap-2 justify-center">
              {/* min-h-11 keeps the lifelines at a 44px target for small fingers. */}
              <button
                onClick={useHint}
                disabled={hintUsed || state.inventory.hint < 1}
                className="flex items-center gap-1.5 glass rounded-full px-4 min-h-11 text-sm font-semibold text-amber-300 disabled:opacity-30 active:scale-95"
              >
                <Lightbulb className="w-4 h-4" /> Hint · {state.inventory.hint}
              </button>
              <button
                onClick={useFifty}
                disabled={fiftyUsed || state.inventory.fiftyFifty < 1}
                className="flex items-center gap-1.5 glass rounded-full px-4 min-h-11 text-sm font-semibold text-violet-300 disabled:opacity-30 active:scale-95"
              >
                <ScanLine className="w-4 h-4" /> 50:50 · {state.inventory.fiftyFifty}
              </button>
            </div>
          )}

          {revealed && (
            <motion.div initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
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
    </ReducedMotionProvider>
  );
}
