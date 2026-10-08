"use client";

import { useId, useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVATARS } from "@/lib/content/avatars";
import { BOARDS, gradesForBoard } from "@/lib/content/boards";
import { cambridgeStageForGrade } from "@/lib/content/subjects";
import { vidya } from "@/lib/speech";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import type { Board } from "@/lib/types";

/** Legacy school enrollment remains available without the superseded cinematic intro. */
const INTERESTS: { id: string; emoji: string; label: string }[] = [
  { id: "drawing",     emoji: "🎨", label: "Drawing" },
  { id: "sports",      emoji: "⚽", label: "Sports" },
  { id: "music",       emoji: "🎵", label: "Music" },
  { id: "animals",     emoji: "🐶", label: "Animals" },
  { id: "coding",      emoji: "💻", label: "Coding" },
  { id: "stories",     emoji: "📚", label: "Stories" },
  { id: "dance",       emoji: "💃", label: "Dance" },
  { id: "cooking",     emoji: "🍳", label: "Cooking" },
  { id: "space",       emoji: "🪐", label: "Space" },
  { id: "movies",      emoji: "🎬", label: "Movies" },
];

export function OnboardingView({
  defaultName, onComplete,
}: {
  defaultName: string;
  onComplete: (data: {
    name: string; avatarId: string; interests: string[];
    board: Board; grade: number;
  }) => Promise<void> | void;
}) {
  const nameId = useId();
  const osReduced = useReducedMotion();
  const motionEnabled = useGameStore(store => store.state.settings.motion !== false);
  const reduced = Boolean(osReduced || !motionEnabled);
  const [name, setName] = useState(defaultName);
  const [step, setStep] = useState(0);
  // Both start null on purpose: nothing is assumed, the learner chooses.
  const [board, setBoard] = useState<Board | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [avatarId, setAvatarId] = useState("peacock");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const toggleInterest = (id: string) => {
    setInterests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // Changing board drops the grade — a grade only means something inside a
  // board's own range, so we never carry one across.
  const chooseBoard = (id: Board) => {
    if (id === board) return;
    setBoard(id);
    setGrade(null);
  };

  const classChosen = board !== null && grade !== null;
  // Cambridge Lower Secondary Grade 6 is Stage 7 — worth saying out loud so a
  // parent can check the choice against the school's own wording.
  const cambridgeStage = board && grade != null ? cambridgeStageForGrade(board, grade) : undefined;
  const stageHint =
    cambridgeStage != null && cambridgeStage !== grade
      ? `Grade ${grade} here is Cambridge Stage ${cambridgeStage}.`
      : null;

  const handleStart = async () => {
    // Belt and braces: the button is disabled until both are chosen, so a
    // learner can never reach the app on an assumed board or grade.
    if (!board || grade == null || saving || !name.trim() || name.trim().length > 80) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Enrollment must finish even when audio is blocked or cannot load.
      await onComplete({ name: name.trim(), avatarId, interests, board, grade });
      setTimeout(() => {
        try { vidya.greet(name.trim().split(" ")[0]); } catch { /* Optional greeting. */ }
      }, 300);
    } catch {
      setSaveError("We could not finish setting up. Your choices are still here. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReducedMotionProvider><div className="min-h-screen flex items-center justify-center p-6 relative bg-[var(--bg-base)] text-[var(--text)]">
      <div className="max-w-xl w-full relative z-10">
        {/* Form navigation must not wait for animation completion callbacks. */}
        <div key={step}>
          {step === 0 && (
            <div
              key="step0"
              className="text-center"
            >
              <motion.div
                className="text-8xl mb-6"
              >
                🦚
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-3 text-gradient-cosmic leading-[1]">
                Vidya
              </h1>
              <p className="text-[var(--text-muted)] text-lg mb-2 font-medium italic">A place to learn, make and explore</p>
              <p className="text-[var(--text-muted)] text-sm mb-10 max-w-md mx-auto">
                A school built for one kid at a time. Set a profile, then walk in.
              </p>
              <label htmlFor={nameId} className="block text-[var(--text-muted)] text-sm mb-2">Your name</label>
              <input
                id={nameId}
                maxLength={80}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full max-w-sm mx-auto block px-5 py-4 rounded-2xl glass text-lg font-semibold text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-fuchsia-400 mb-6"
              />
              <Button size="lg" onClick={() => name.trim() && setStep(1)} disabled={!name.trim()}>
                Continue <ChevronRight className="inline w-5 h-5 -mt-0.5" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div
              key="step1"
            >
              <h2 className="font-display text-4xl font-bold text-center mb-2 text-[var(--text)]">
                Which class are you in?
              </h2>
              <p className="text-center text-[var(--text-muted)] mb-2 italic">
                Pick your board, then the grade you&apos;re in right now.
              </p>
              <p className="text-center text-[var(--text-muted)] text-[11px] mb-8">
                This decides your subjects and how Miss Vidya talks to you, so it has to be yours, not a guess.
              </p>

              <div role="group" aria-label="Board" className="mb-7">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2 px-1">Board</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BOARDS.map((b) => {
                    const active = board === b.id;
                    return (
                      <motion.button
                        key={b.id}
                        type="button"
                        onClick={() => chooseBoard(b.id)}
                        aria-pressed={active}
                        whileTap={reduced ? undefined : { scale: 0.97 }}
                        className={`min-h-[56px] rounded-2xl p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 ${
                          active
                            ? "glass-strong ring-2 ring-fuchsia-400 shadow-2xl shadow-fuchsia-500/30"
                            : "glass hover:bg-[var(--surface-strong)]"
                        }`}
                      >
                        <div className={`font-display font-bold text-sm ${active ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>{b.label}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{b.description}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div role="group" aria-label="Grade" className="mb-9">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2 px-1">Grade</div>
                {board ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {gradesForBoard(board).map((g) => {
                        const active = grade === g;
                        return (
                          <motion.button
                            key={g}
                            type="button"
                            onClick={() => setGrade(g)}
                            aria-pressed={active}
                            aria-label={`Grade ${g}`}
                            whileTap={reduced ? undefined : { scale: 0.92 }}
                            className={`w-12 h-12 rounded-2xl font-display font-bold text-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 ${
                              active
                                ? "glass-strong ring-2 ring-fuchsia-400 text-[var(--text)] shadow-2xl shadow-fuchsia-500/30"
                                : "glass hover:bg-[var(--surface-strong)] text-[var(--text-muted)]"
                            }`}
                          >
                            {g}
                          </motion.button>
                        );
                      })}
                    </div>
                    {stageHint && (
                      <p className="text-[var(--text-muted)] text-[11px] mt-3 px-1">{stageHint}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[var(--text-muted)] text-[11px] px-1">
                    Pick a board first, then we&apos;ll show the grades it covers.
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  <ChevronLeft className="inline w-5 h-5 -mt-0.5" /> Back
                </Button>
                <Button size="lg" onClick={() => setStep(2)} disabled={!classChosen}>
                  Next <ChevronRight className="inline w-5 h-5 -mt-0.5" />
                </Button>
              </div>
              {!classChosen && (
                <p className="text-center text-[var(--text-muted)] text-xs mt-5">
                  Choose a board and a grade to keep going.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div
              key="step2"
            >
              <h2 className="font-display text-5xl font-bold text-center mb-2 text-[var(--text)]">
                Hey <span className="text-gradient-sunset">{name.split(" ")[0]}</span>
              </h2>
              <p className="text-center text-[var(--text-muted)] mb-10 italic">Choose a profile avatar</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10">
                {AVATARS.map((a) => (
                  <motion.button
                    key={a.id}
                    onClick={() => { setAvatarId(a.id); }}
                    whileTap={{ scale: 0.92 }}
                    className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-all ${
                      avatarId === a.id
                        ? "glass-strong ring-2 ring-fuchsia-400 scale-[1.04] shadow-2xl shadow-fuchsia-500/30"
                        : "glass hover:bg-[var(--surface-strong)]"
                    }`}
                  >
                    <span className="text-5xl mb-1">{a.emoji}</span>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{a.name}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ChevronLeft className="inline w-5 h-5 -mt-0.5" /> Back
                </Button>
                <Button size="lg" onClick={() => setStep(3)}>
                  Next <ChevronRight className="inline w-5 h-5 -mt-0.5" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              key="step3"
            >
              <h2 className="font-display text-4xl font-bold text-center mb-2 text-[var(--text)]">
                What do you love?
              </h2>
              <p className="text-center text-[var(--text-muted)] mb-2 italic">
                Pick a few. Or none. You can always tell me later.
              </p>
              <p className="text-center text-[var(--text-muted)] text-[11px] mb-8">
                Vidya uses these to make examples about worlds you actually care about.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-10 max-w-xl mx-auto">
                {INTERESTS.map((i) => {
                  const active = interests.includes(i.id);
                  return (
                    <motion.button
                      key={i.id}
                      onClick={() => toggleInterest(i.id)}
                      whileTap={{ scale: 0.92 }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                        active
                          ? "glass-strong ring-2 ring-fuchsia-400 scale-[1.04] shadow-2xl shadow-fuchsia-500/30"
                          : "glass hover:bg-[var(--surface-strong)]"
                      }`}
                    >
                      <span className="text-3xl">{i.emoji}</span>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${active ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                        {i.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ChevronLeft className="inline w-5 h-5 -mt-0.5" /> Back
                </Button>
                <Button size="lg" onClick={handleStart} disabled={!classChosen || saving}>
                  <Sparkles className="inline w-5 h-5 -mt-0.5 mr-1" /> {saving ? "Setting up…" : "Start exploring"}
                </Button>
              </div>
              {saveError && <p role="alert" className="text-center text-[var(--error)] text-sm mt-4">{saveError}</p>}
              <p className="text-center text-[var(--text-muted)] text-xs mt-6">
                Music stays off by default. Toggle it on anytime in settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div></ReducedMotionProvider>
  );
}
