"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { Clock, Crown, Flame, BookOpen, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
import { NextBestQuestCard } from "@/components/learning/next-best-quest-card";
import { CelebrationBurst } from "@/components/effects/celebrate";
import { Confetti } from "@/components/effects/particles";
import { BADGES, TIER_STYLES } from "@/lib/content/badges";
import type { NextQuestRecommendation } from "@/lib/adaptive/recommendation";
import type { GameState, QuizResult } from "@/lib/types";
import { useState, useEffect } from "react";

export function ResultsView({
  result, state, recommendation, onDone, onStartRecommendation,
}: {
  result: QuizResult;
  state: GameState;
  recommendation?: NextQuestRecommendation;
  onDone: () => void;
  onStartRecommendation?: () => void;
}) {
  const [confetti, setConfetti] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const { accuracy, xpEarned, coinsEarned, elapsed, newBadges, leveledUp, newLevel, score, wrong, streak, isDaily } = result;

  useEffect(() => {
    if (accuracy >= 80 || leveledUp || newBadges.length > 0) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [accuracy, leveledUp, newBadges.length]);

  // A single earned moment with real anticipation, rather than ambient confetti.
  const celebrateVariant = newBadges.length > 0 ? "badge" : leveledUp ? "levelup" : "correct";
  const celebrateLabel = newBadges.length > 0 ? "New badge!" : leveledUp ? `Level ${newLevel}!` : undefined;

  const headline = accuracy === 100 ? "Flawless!" : accuracy >= 80 ? "Excellent!" : accuracy >= 60 ? "Nice work!" : "Keep going!";
  const subheadline = `${score.correct} out of ${score.total} correct`;

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 22 } },
  };

  return (
    <>
      <CelebrationBurst
        show={confetti}
        variant={celebrateVariant}
        label={celebrateLabel}
        onDone={() => setConfetti(false)}
      />
    <ReducedMotionProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <Confetti show={confetti} />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-md w-full text-center"
        >
          <motion.div variants={item}>
            <Mascot avatarId={state.avatarId} customAvatar={state.customAvatar} size="xl" mood={accuracy === 100 ? "celebrate" : "happy"} />
          </motion.div>
          <motion.div variants={item} className="mt-6">
            <h1 className="font-display text-6xl font-bold text-gradient-sunset">{headline}</h1>
            <div className="text-white/70 mt-1">{subheadline}</div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-5 mt-6">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-4xl font-display font-bold text-gradient-cosmic">{xpEarned}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">XP</div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-4xl font-display font-bold text-amber-300">{coinsEarned}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Coins</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-emerald-300">{accuracy}%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Accuracy</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {elapsed}s
              </div>
              <div className="text-white/20">·</div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white/80">{streak}</span> day streak
              </div>
            </div>
          </motion.div>

          {leveledUp && (
            <motion.div variants={item} className="mt-4 rounded-3xl p-4 text-white gradient-cosmic shadow-2xl shadow-fuchsia-500/40">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                <div className="font-display text-2xl font-bold">Level {newLevel} Unlocked!</div>
              </div>
            </motion.div>
          )}

          {newBadges.length > 0 && (
            <motion.div variants={item} className="mt-4 glass-card p-5">
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">New Badges</div>
              <div className="flex flex-wrap gap-3 justify-center">
                {newBadges.map((bId, i) => {
                  const b = BADGES.find((x) => x.id === bId);
                  if (!b) return null;
                  const tier = TIER_STYLES[b.tier];
                  return (
                    <motion.div
                      key={bId}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.gradient} ring-2 ${tier.ring} flex items-center justify-center text-3xl shadow-2xl ${tier.glow}`}>
                        {b.icon}
                      </div>
                      <div className={`text-xs font-bold text-white mt-1.5 ${(b.id === "bhasha-premi" || b.id === "marathi-mitra") ? "font-deva" : ""}`}>{b.name}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {wrong.length > 0 && (
            <motion.div variants={item} className="mt-4 glass-card p-4 text-left">
              {/* A disclosure whose open state was signalled only by the
                  chevron glyph. */}
              <button
                onClick={() => setShowWrong((s) => !s)}
                aria-expanded={showWrong}
                className="w-full flex items-center justify-between text-sm font-bold text-white/80 min-h-11"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-300" />
                  Review {wrong.length} missed
                </span>
                {showWrong ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
              </button>
              <AnimatePresence initial={false}>
                {showWrong && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      {wrong.map((w, i) => (
                        <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/5 p-3">
                          <div className={`text-sm font-semibold text-white mb-2 ${w.isDeva ? "font-deva" : ""}`}>{w.q}</div>
                          <div className={`flex items-start gap-2 text-xs text-rose-300 ${w.isDeva ? "font-deva" : ""}`}>
                            <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>You answered: <span className="font-semibold">{w.given}</span></span>
                          </div>
                          <div className={`flex items-start gap-2 text-xs text-emerald-300 mt-1 ${w.isDeva ? "font-deva" : ""}`}>
                            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>Correct: <span className="font-semibold">{w.correct}</span></span>
                          </div>
                          <div className={`mt-2 text-xs text-white/60 ${w.isDeva ? "font-deva" : ""}`}>{w.ex}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {recommendation && (
            <motion.div variants={item} className="mt-4">
              <NextBestQuestCard
                recommendation={recommendation}
                onStart={onStartRecommendation}
                compact
              />
            </motion.div>
          )}

          <motion.div variants={item} className="mt-6 space-y-2">
            <Button
              size="lg"
              variant={onStartRecommendation ? "secondary" : "primary"}
              className="w-full"
              onClick={onDone}
            >
              {isDaily ? "Back to Home" : "Back to Subject"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </ReducedMotionProvider>
    </>
  );
}
