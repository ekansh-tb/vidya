"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Lock, Flame, TrendingUp, Brain, Trophy, Upload, Trash2, Heart, Check } from "lucide-react";
import { Mascot } from "@/components/ui/mascot";
import { XPBar } from "@/components/ui/xp-bar";
import { AVATARS } from "@/lib/content/avatars";
import { BADGES, TIER_STYLES } from "@/lib/content/badges";
import { xpToLevel } from "@/lib/economy";
import type { GameState, LearnerProfile } from "@/lib/types";
import { sfx } from "@/lib/audio";
import { resizeImageFile } from "@/lib/utils";
import { useGameStore } from "@/lib/game-store";

const INTEREST_CHIPS: { id: string; emoji: string; label: string }[] = [
  { id: "drawing",  emoji: "🎨", label: "Drawing" },
  { id: "sports",   emoji: "⚽", label: "Sports" },
  { id: "music",    emoji: "🎵", label: "Music" },
  { id: "animals",  emoji: "🐶", label: "Animals" },
  { id: "coding",   emoji: "💻", label: "Coding" },
  { id: "stories",  emoji: "📚", label: "Stories" },
  { id: "dance",    emoji: "💃", label: "Dance" },
  { id: "cooking",  emoji: "🍳", label: "Cooking" },
  { id: "space",    emoji: "🪐", label: "Space" },
  { id: "movies",   emoji: "🎬", label: "Movies" },
];

const TONE_OPTIONS: { id: "gentle" | "friendly" | "direct"; emoji: string; label: string; blurb: string }[] = [
  { id: "gentle",   emoji: "🌸", label: "Gentle",   blurb: "Soft and patient. Lots of encouragement." },
  { id: "friendly", emoji: "🎈", label: "Friendly", blurb: "Warm and playful. The default." },
  { id: "direct",   emoji: "🎯", label: "Direct",   blurb: "Tight and to-the-point. No fluff." },
];

function AiTonePicker({
  current, onChange,
}: {
  current?: "gentle" | "friendly" | "direct";
  onChange: (next: "gentle" | "friendly" | "direct" | undefined) => void;
}) {
  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold text-cyan-300">
          How Miss Vidya talks to you
        </div>
        {current && (
          <button
            onClick={() => { sfx.click(); onChange(undefined); }}
            className="text-[10px] uppercase tracking-widest font-bold text-white/45 hover:text-white active:scale-95"
          >
            Reset
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TONE_OPTIONS.map((t) => {
          const active = current === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { sfx.click(); onChange(t.id); }}
              className="rounded-2xl p-3 text-center transition active:scale-95"
              style={{
                background: active ? "rgba(34,211,238,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className={`text-[10px] uppercase tracking-widest font-bold ${active ? "text-cyan-200" : "text-white/65"}`}>
                {t.label}
              </div>
              <div className="text-[9px] leading-tight mt-1" style={{ color: active ? "rgba(34,211,238,0.85)" : "rgba(255,255,255,0.4)" }}>
                {t.blurb}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isoDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ReflectionRhythm({ reflections }: { reflections: { date: string }[] }) {
  const days = 14;
  const setOfDates = new Set(reflections.map((r) => r.date));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const rhythm = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (days - 1 - i));
    const iso = isoDay(d);
    return { iso, done: setOfDates.has(iso), label: d.toLocaleDateString(undefined, { weekday: "short" }) };
  });
  const total = rhythm.filter((r) => r.done).length;

  if (reflections.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold text-violet-300">
          Reflection rhythm · last {days} days
        </div>
        <div className="text-[11px] font-semibold text-white/60">
          {total} of {days}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {rhythm.map((r) => {
          const isToday = r.iso === isoDay(today);
          return (
            <div key={r.iso} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full aspect-square rounded-md transition-all"
                style={{
                  background: r.done
                    ? "rgba(167,139,250,0.85)"
                    : isToday
                      ? "rgba(167,139,250,0.15)"
                      : "rgba(255,255,255,0.04)",
                  boxShadow: r.done ? "0 0 8px rgba(167,139,250,0.5)" : "none",
                  border: isToday && !r.done ? "1px dashed rgba(167,139,250,0.4)" : "none",
                }}
                title={r.iso}
              />
              <div className="text-[8px] uppercase tracking-widest text-white/30">
                {r.label[0]}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] italic text-white/40 mt-3 text-center">
        Each square is a day. Filled means you wrote a reflection.
      </p>
    </div>
  );
}

function describeBoard(board: LearnerProfile["board"]): string {
  if (board === "cambridge-primary") return "Cambridge Primary";
  if (board === "cambridge-igcse") return "Cambridge IGCSE";
  if (board === "icse") return "ICSE";
  if (board === "cbse") return "CBSE";
  return "";
}

export function ProfileView({
  state, learner, setState, onBack,
}: {
  state: GameState;
  learner: LearnerProfile;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [interestsEditing, setInterestsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateLearnerMeta = useGameStore((s) => s.updateLearnerMeta);

  const currentInterests = learner.interests || [];
  const toggleInterest = (id: string) => {
    sfx.click();
    const next = currentInterests.includes(id)
      ? currentInterests.filter((x) => x !== id)
      : [...currentInterests, id];
    updateLearnerMeta(learner.id, { interests: next });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setUploadError("Image too large — try one under 6MB.");
      return;
    }
    try {
      const dataUrl = await resizeImageFile(file, 256, 0.85);
      setState((p) => ({ ...p, customAvatar: dataUrl }));
      setUploadError(null);
      sfx.click();
      setPickerOpen(false);
    } catch {
      setUploadError("Couldn't read that image.");
    }
  };
  const { level, xpInLevel, xpNeeded } = xpToLevel(state.xp);
  const accuracy = state.stats.totalAnswered > 0 ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100) : 0;
  const earned = BADGES.filter((b) => state.badges.includes(b.id));
  const locked = BADGES.filter((b) => !state.badges.includes(b.id));

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <div className="glass-card p-6 text-center mb-5">
          <button onClick={() => { sfx.click(); setPickerOpen((v) => !v); }} className="inline-block active:scale-95 transition">
            <Mascot avatarId={state.avatarId} customAvatar={state.customAvatar} size="lg" />
          </button>
          <div className="font-display text-3xl font-bold mt-3 text-white">{learner.name || state.name}</div>
          <div className="text-white/50 text-sm mt-0.5">
            Grade {learner.grade} · {describeBoard(learner.board)}
            {learner.school ? ` · ${learner.school}` : ""}
          </div>
          <div className="mt-5">
            <XPBar level={level} xpInLevel={xpInLevel} xpNeeded={xpNeeded} />
          </div>
        </div>

        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 mb-5 overflow-hidden"
            >
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 text-center">Change buddy</div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {AVATARS.map((a) => (
                  <motion.button
                    key={a.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { sfx.click(); setState((p) => ({ ...p, avatarId: a.id, customAvatar: null })); setPickerOpen(false); }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                      !state.customAvatar && state.avatarId === a.id
                        ? "glass-strong ring-2 ring-fuchsia-400"
                        : "glass hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl">{a.emoji}</span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
                <button
                  onClick={() => { sfx.click(); fileInputRef.current?.click(); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition-all ${
                    state.customAvatar
                      ? "glass-strong ring-2 ring-cyan-300 text-white"
                      : "glass text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {state.customAvatar ? "Replace your photo" : "Upload your own"}
                </button>
                {state.customAvatar && (
                  <button
                    onClick={() => { sfx.click(); setState((p) => ({ ...p, customAvatar: null })); }}
                    className="rounded-2xl px-3 glass text-rose-300 hover:bg-rose-500/10"
                    aria-label="Remove custom icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {uploadError && (
                <div className="mt-2 text-xs text-rose-300 text-center">{uploadError}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interests — editable inline. Heart icon mirrors onboarding's
            "what do you love?" prompt. */}
        <div className="glass-card p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-fuchsia-300" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-fuchsia-300">
                What you love
              </span>
            </div>
            <button
              onClick={() => { sfx.click(); setInterestsEditing((v) => !v); }}
              className="text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white active:scale-95"
            >
              {interestsEditing ? "Done" : currentInterests.length > 0 ? "Edit" : "Pick some"}
            </button>
          </div>
          {!interestsEditing ? (
            currentInterests.length === 0 ? (
              <div className="text-xs italic text-white/40">
                Nothing picked yet. Tap edit to tell Miss Vidya what worlds you love — she'll use them in her examples.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {currentInterests.map((id) => {
                  const chip = INTEREST_CHIPS.find((c) => c.id === id);
                  if (!chip) return null;
                  return (
                    <div
                      key={id}
                      className="rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                      style={{ background: "rgba(244,114,182,0.15)", color: "rgba(244,114,182,0.95)" }}
                    >
                      <span className="text-sm leading-none">{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {INTEREST_CHIPS.map((c) => {
                const active = currentInterests.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleInterest(c.id)}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 transition active:scale-95"
                    style={{
                      background: active ? "rgba(244,114,182,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(244,114,182,0.5)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${active ? "text-white" : "text-white/55"}`}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { Icon: Flame, value: state.streak, label: "Day Streak", color: "text-orange-300" },
            { Icon: TrendingUp, value: `${accuracy}%`, label: "Accuracy", color: "text-emerald-300" },
            { Icon: Brain, value: state.stats.totalAnswered, label: "Questions", color: "text-violet-300" },
            { Icon: Trophy, value: earned.length, label: "Badges", color: "text-amber-300" },
          ].map(({ Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <Icon className={`w-5 h-5 ${color} mb-1.5`} />
              <div className="font-display text-3xl font-bold text-white">{value}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* How Miss Vidya talks to you — kid-chosen AI tone */}
        <AiTonePicker
          current={learner.aiTone}
          onChange={(next) => updateLearnerMeta(learner.id, { aiTone: next })}
        />

        {/* Reflection rhythm — last 14 days at a glance */}
        <ReflectionRhythm reflections={state.dailyReflections || []} />

        <h3 className="font-display text-xl font-bold text-white mb-3 flex items-center gap-2">
          Badges
          <span className="text-xs font-body font-medium text-white/50 bg-white/[0.06] px-2 py-0.5 rounded-full">
            {earned.length}/{BADGES.length}
          </span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {[...earned, ...locked].map((b) => {
            const isEarned = state.badges.includes(b.id);
            const tier = TIER_STYLES[b.tier];
            return (
              <div key={b.id} className={`glass-card p-3 text-center ${isEarned ? "" : "opacity-50"}`}>
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 ${
                  isEarned ? `bg-gradient-to-br ${tier.gradient} shadow-lg ${tier.glow}` : "bg-white/[0.04] grayscale"
                }`}>
                  {isEarned ? b.icon : <Lock className="w-5 h-5 text-white/30" />}
                </div>
                <div className={`text-xs font-bold leading-tight ${isEarned ? "text-white" : "text-white/40"} ${(b.id === "bhasha-premi" || b.id === "marathi-mitra") ? "font-deva" : ""}`}>
                  {b.name}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5 leading-tight">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
