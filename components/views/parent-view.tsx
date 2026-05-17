"use client";

import { useState } from "react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";

export function ParentView({
  state, onBack, onReset,
}: {
  state: GameState;
  onBack: () => void;
  onReset: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const accuracy = state.stats.totalAnswered > 0 ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100) : 0;

  const subjectStats = SUBJECTS.map((s) => {
    const topics = Object.keys(QUESTIONS[s.id] || {});
    let attempts = 0, correct = 0, masterySum = 0;
    topics.forEach((t) => {
      const p = state.progress?.[s.id]?.[t];
      if (p) { attempts += p.attempts || 0; correct += p.correct || 0; masterySum += p.mastery || 0; }
    });
    return { ...s, attempts, correct, mastery: topics.length ? Math.round(masterySum / topics.length) : 0 };
  });

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <h2 className="font-display text-3xl font-bold text-white mb-1">Parent View</h2>
        <p className="text-white/50 text-sm mb-5">Progress overview for {state.name}</p>

        <div className="glass-card p-5 mb-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Questions", value: state.stats.totalAnswered, color: "text-white" },
              { label: "Accuracy", value: `${accuracy}%`, color: "text-emerald-300" },
              { label: "Quizzes Done", value: state.stats.quizzesCompleted, color: "text-white" },
              { label: "Daily Quests", value: state.stats.dailyQuestsCompleted, color: "text-violet-300" },
              { label: "Current Streak", value: `${state.streak} days`, color: "text-orange-300" },
              { label: "Longest Streak", value: `${state.longestStreak || 0} days`, color: "text-white" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</div>
                <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-white mb-3">Subject mastery</h3>
        <div className="space-y-2 mb-6">
          {subjectStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.soft }}>
                    <Icon className="w-5 h-5" style={{ color: s.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-white ${s.isDeva ? "font-deva" : ""}`}>{s.name}</div>
                    <div className="text-xs text-white/50">{s.attempts} attempts · {s.correct} correct</div>
                  </div>
                  <div className="font-bold text-white font-display text-lg">{s.mastery}%</div>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.mastery}%`, background: s.accent, boxShadow: `0 0 6px ${s.glow}` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-4 border border-rose-400/30">
          <div className="font-bold text-rose-300 mb-2 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset Progress
          </div>
          <div className="text-xs text-white/60 mb-3">This clears all XP, badges, and progress. Cannot be undone.</div>
          {!confirm ? (
            <Button variant="danger" size="sm" onClick={() => setConfirm(true)}>Reset all data</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={onReset}>Yes, reset everything</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
