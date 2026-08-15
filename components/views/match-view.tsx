"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { X, RefreshCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { questionsForLearner } from "@/lib/content/questions/availability";
import type { GameState, LearnerProfile, SubjectId, QuizResult } from "@/lib/types";
import { shuffle, todayKey } from "@/lib/utils";
import { sfx } from "@/lib/audio";
import { xpToLevel } from "@/lib/economy";

const PAIR_COUNT = 4;

type Card = {
  id: string;
  pairId: number;
  text: string;
  side: "q" | "a";
};

export function MatchView({
  subjectId, topicId, learner, state, setState, onFinish, onClose,
}: {
  subjectId: SubjectId;
  topicId: string;
  learner: Pick<LearnerProfile, "board" | "grade">;
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onFinish: (result: QuizResult) => void;
  onClose: () => void;
}) {
  const subject = SUBJECT_MAP[subjectId];
  const topic = questionsForLearner(learner)[subjectId]?.[topicId];
  const isDeva = subject?.isDeva;

  const cards = useMemo<Card[]>(() => {
    if (!topic) return [];
    const items = shuffle(topic.items).slice(0, PAIR_COUNT);
    const result: Card[] = [];
    items.forEach((it, i) => {
      result.push({ id: `${i}-q`, pairId: i, text: it.q, side: "q" });
      result.push({ id: `${i}-a`, pairId: i, text: it.a, side: "a" });
    });
    return shuffle(result);
  }, [topic]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(t);
  }, [startTime]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    setResolving(true);
    const [a, b] = flipped.map((id) => cards.find((c) => c.id === id)!);
    if (a.pairId === b.pairId) {
      sfx.correct();
      const t = setTimeout(() => {
        setMatched((prev) => new Set(prev).add(a.pairId));
        setFlipped([]);
        setResolving(false);
      }, 350);
      return () => clearTimeout(t);
    } else {
      sfx.wrong();
      setMistakes((m) => m + 1);
      const t = setTimeout(() => {
        setFlipped([]);
        setResolving(false);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [flipped, cards]);

  const totalPairs = Math.min(PAIR_COUNT, topic?.items.length || 0);
  const isComplete = matched.size === totalPairs && totalPairs > 0;

  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => {
      finishMatch();
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const handleFlip = (id: string) => {
    if (resolving || flipped.length >= 2) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || matched.has(card.pairId)) return;
    sfx.click();
    setFlipped((prev) => [...prev, id]);
  };

  // The "All matched!" panel and its button mount the instant isComplete flips
  // true — 600ms BEFORE the auto-finish timer fires. Tapping the button in that
  // window ran finishMatch twice, double-counting xp, coins and every stat.
  // The button sits exactly where the kid's thumb already is, so this was easy
  // to hit by accident.
  const finishedRef = useRef(false);

  const finishMatch = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const secs = Math.round((Date.now() - startTime) / 1000);
    const total = totalPairs;
    const correct = total;
    const accuracy = total > 0 ? Math.round((total / (total + mistakes)) * 100) : 0;
    const speedBonus = secs <= 30 ? 25 : secs <= 60 ? 10 : 0;
    const baseXp = correct * 10 - mistakes * 2 + speedBonus;
    const xpEarned = Math.max(0, state.doubleXpActive ? baseXp * 2 : baseXp);
    const coinsEarned = Math.max(0, correct * 5 - mistakes);

    let newLevel = 1;
    let oldLevel = 1;
    let leveledUp = false;
    let finishedStreak = 0;
    const newBadges: string[] = [];

    setState((prev) => {
      const today = todayKey();
      const newStreak = prev.lastPlayedDate === today ? prev.streak : (prev.lastPlayedDate ? prev.streak + 1 : 1);
      finishedStreak = newStreak;
      const longestStreak = Math.max(prev.longestStreak || 0, newStreak);
      const newXp = prev.xp + xpEarned;
      newLevel = xpToLevel(newXp).level;
      oldLevel = xpToLevel(prev.xp).level;
      leveledUp = newLevel > oldLevel;
      const stats = {
        ...prev.stats,
        totalAnswered: prev.stats.totalAnswered + total + mistakes,
        totalCorrect: prev.stats.totalCorrect + total,
        quizzesCompleted: prev.stats.quizzesCompleted + 1,
      };
      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinsEarned,
        streak: newStreak,
        longestStreak,
        lastPlayedDate: today,
        stats,
        doubleXpActive: false,
        lastQuestCorrect: total,
      };
    });

    setTimeout(() => {
      onFinish({
        accuracy,
        xpEarned,
        coinsEarned,
        elapsed: secs,
        newBadges,
        leveledUp,
        newLevel,
        oldLevel,
        score: { correct, total: total + mistakes },
        subjectId,
        topicId,
        wrong: [],
        streak: finishedStreak,
        isDaily: false,
      });
    }, 50);
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-5 pt-6">
        <button
          onClick={() => { sfx.click(); onClose(); }}
          className="flex items-center gap-1 font-medium mb-6 active:scale-95 self-start text-white/60"
        >
          <X className="w-5 h-5" /> Close
        </button>
        <div className="glass-card p-8 text-center">
          <div className="text-5xl mb-3 opacity-70">🌱</div>
          <h2 className="font-display text-xl font-bold text-white mb-2">
            Match Quest is coming soon
          </h2>
          <p className="text-sm text-white/60 mb-6">
            This topic does not have a Match Quest for your curriculum yet. Try another classroom activity in the meantime.
          </p>
          <Button onClick={() => { sfx.click(); onClose(); }}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { sfx.click(); onClose(); }} className="text-white/50 active:scale-95">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-xs font-mono text-white/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {elapsed}s
              </div>
              <div className="text-white/20">·</div>
              <div className="flex items-center gap-1.5">
                <RefreshCcw className="w-3.5 h-3.5 text-rose-300" /> {mistakes}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: subject?.soft }}>
              <subject.icon className="w-4 h-4" style={{ color: subject?.accent }} />
            </div>
            <div className={`text-sm font-semibold ${isDeva ? "font-deva" : ""}`} style={{ color: subject?.accent }}>
              Match Quest
            </div>
            <div className="text-xs text-white/40">·</div>
            <div className={`text-xs text-white/60 ${isDeva ? "font-deva" : ""}`}>{topic.title}</div>
          </div>

          <div className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-3 text-center">
            {matched.size} of {totalPairs} pairs found
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.has(card.pairId);
              const isMatched = matched.has(card.pairId);
              return (
                <button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  disabled={isMatched}
                  className="relative aspect-[4/3] [perspective:1000px] focus:outline-none"
                  aria-label={isFlipped ? card.text : "Hidden card"}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 [transform-style:preserve-3d]"
                  >
                    <div
                      className="absolute inset-0 rounded-2xl glass-strong flex items-center justify-center [backface-visibility:hidden]"
                      style={{ boxShadow: `0 0 20px ${subject?.glow || "rgba(34,211,238,0.3)"}` }}
                    >
                      <div className="text-4xl">{topic.icon}</div>
                    </div>
                    <div
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center p-3 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border transition-all ${
                        isMatched
                          ? "bg-emerald-500/20 border-emerald-400/60 shadow-lg shadow-emerald-500/30"
                          : "glass border-white/15"
                      }`}
                    >
                      <span className={`text-sm font-semibold leading-snug text-white ${isDeva ? "font-deva" : ""}`}>
                        {card.text}
                      </span>
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <div className="font-display text-2xl font-bold text-emerald-300">All matched!</div>
                <Button size="lg" className="w-full mt-3" onClick={finishMatch}>
                  See Results
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ReducedMotionProvider>
  );
}
