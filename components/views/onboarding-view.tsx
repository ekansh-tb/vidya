"use client";

import { useEffect, useReducer, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVATARS } from "@/lib/content/avatars";
import { initAudio, startMusic, sfx } from "@/lib/audio";
import { vidya } from "@/lib/speech";
import { CosmicBg } from "@/components/effects/cosmic-bg";

/**
 * Cinematic onboarding.
 *
 * Four-act story before the form:
 *
 *   I.   Wonder         — a single human looks up at the stars.
 *   II.  Departure      — that human becomes a starship.
 *   III. Voyage         — past sun, past worlds, past every question.
 *   IV.  Arrival        — at a special planet. Vidya. The peacock greets you.
 *
 * Auto-advances. "Skip" available at any time. Honours prefers-reduced-motion
 * (renders Act IV only). Tone is not aimed only at small kids — the language
 * is reflective so the same intro works for parents on first run.
 *
 * After the story, the existing name + avatar form runs unchanged.
 */
type Phase = "story" | "form";

const ACT_MS = 4200;
const STORY_ACTS = 4;

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
  onComplete: (data: { name: string; avatarId: string; interests: string[] }) => Promise<void> | void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "form" : "story");
  const [act, advance] = useReducer((n: number) => n + 1, 0);

  const [name, setName] = useState(defaultName);
  const [step, setStep] = useState(0);
  const [avatarId, setAvatarId] = useState("peacock");
  const [interests, setInterests] = useState<string[]>([]);
  const toggleInterest = (id: string) => {
    sfx.click();
    setInterests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // Auto-advance story acts. After the last one, drop into the form.
  useEffect(() => {
    if (phase !== "story") return;
    const t = setTimeout(() => {
      if (act < STORY_ACTS - 1) advance();
      else setPhase("form");
    }, ACT_MS);
    return () => clearTimeout(t);
  }, [phase, act]);

  const handleStart = async () => {
    await initAudio();
    sfx.coin();
    await onComplete({ name: name.trim(), avatarId, interests });
    setTimeout(() => {
      startMusic();
      vidya.greet(name.trim().split(" ")[0]);
    }, 300);
  };

  // ── STORY MODE ─────────────────────────────────────────────────────────
  if (phase === "story") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <CosmicBg mode="parent" intensity={0.85} />
        <button
          onClick={() => { sfx.click(); setPhase("form"); }}
          className="absolute top-5 right-5 z-20 text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5 px-3 py-2 rounded-full active:scale-95 transition"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Skip intro <SkipForward className="w-3 h-3" />
        </button>

        {/* Progress dots */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {Array.from({ length: STORY_ACTS }).map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === act ? 22 : 6,
                background: i <= act ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {act === 0 && <ActWonder key="act0" />}
          {act === 1 && <ActDeparture key="act1" />}
          {act === 2 && <ActVoyage key="act2" />}
          {act === 3 && <ActArrival key="act3" />}
        </AnimatePresence>
      </div>
    );
  }

  // ── FORM MODE (existing UX, polished) ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <CosmicBg mode="parent" intensity={0.8} />
      <div className="max-w-xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-6"
              >
                🦚
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-3 text-gradient-cosmic leading-[1]">
                Vidya
              </h1>
              <p className="text-white/70 text-lg mb-2 font-medium italic">Future stars on a gyan journey</p>
              <p className="text-white/50 text-sm mb-10 max-w-md mx-auto">
                A school built for one kid at a time. Set a profile, then walk in.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full max-w-sm mx-auto block px-5 py-4 rounded-2xl glass text-lg font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-400 mb-6"
              />
              <Button size="lg" onClick={() => name.trim() && setStep(1)} disabled={!name.trim()}>
                Continue <ChevronRight className="inline w-5 h-5 -mt-0.5" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="font-display text-5xl font-bold text-center mb-2 text-white">
                Hey <span className="text-gradient-sunset">{name.split(" ")[0]}</span>
              </h2>
              <p className="text-center text-white/60 mb-10 italic">Pick your learning buddy</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10">
                {AVATARS.map((a) => (
                  <motion.button
                    key={a.id}
                    onClick={() => { setAvatarId(a.id); }}
                    whileTap={{ scale: 0.92 }}
                    className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-all ${
                      avatarId === a.id
                        ? "glass-strong ring-2 ring-fuchsia-400 scale-[1.04] shadow-2xl shadow-fuchsia-500/30"
                        : "glass hover:bg-white/10"
                    }`}
                  >
                    <span className="text-5xl mb-1">{a.emoji}</span>
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">{a.name}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  <ChevronLeft className="inline w-5 h-5 -mt-0.5" /> Back
                </Button>
                <Button size="lg" onClick={() => setStep(2)}>
                  Next <ChevronRight className="inline w-5 h-5 -mt-0.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="font-display text-4xl font-bold text-center mb-2 text-white">
                What do you love?
              </h2>
              <p className="text-center text-white/60 mb-2 italic">
                Pick a few. Or none — you can always tell me later.
              </p>
              <p className="text-center text-white/35 text-[11px] mb-8">
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
                          : "glass hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl">{i.emoji}</span>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${active ? "text-white" : "text-white/55"}`}>
                        {i.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ChevronLeft className="inline w-5 h-5 -mt-0.5" /> Back
                </Button>
                <Button size="lg" onClick={handleStart}>
                  <Sparkles className="inline w-5 h-5 -mt-0.5 mr-1" /> Walk into Vidya
                </Button>
              </div>
              <p className="text-center text-white/40 text-xs mt-6">
                Music stays off by default. Toggle it on anytime in settings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// ACTS
// =============================================================================

const enterTitle = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};
const enterSub = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};
const exitFade = { exit: { opacity: 0, transition: { duration: 0.5 } } };

// ─── ACT I — Wonder ──────────────────────────────────────────────────────
function ActWonder() {
  return (
    <motion.div
      {...exitFade}
      className="relative w-full max-w-2xl text-center px-4 z-10"
    >
      {/* Extra constellation around the headline — slow twinkle */}
      <div className="absolute inset-0 pointer-events-none">
        {[ [10, 12], [80, 18], [22, 70], [70, 78], [50, 8], [88, 60], [12, 50] ].map(([x, y], i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${x}%`, top: `${y}%`, width: 3, height: 3, background: "white" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1, 0.6] }}
            transition={{ duration: 3.6, delay: 0.1 * i, repeat: Infinity, repeatType: "mirror" }}
          />
        ))}
      </div>

      {/* Tiny silhouette looking up — far below the type */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.0, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-5xl"
        style={{ filter: "drop-shadow(0 0 14px rgba(167,139,250,0.45))" }}
      >
        🧍
      </motion.div>

      <motion.h1
        {...enterTitle}
        className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4"
        style={{ color: "rgba(255,255,255,0.96)", letterSpacing: "-0.01em" }}
      >
        Long before us,
        <br />
        <span style={{ fontStyle: "italic", color: "rgba(244,114,182,0.92)" }}>humans looked up.</span>
      </motion.h1>
      <motion.p
        {...enterSub}
        className="text-base md:text-lg max-w-md mx-auto"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        And the stars asked: <em>what else is out there?</em>
      </motion.p>
    </motion.div>
  );
}

// ─── ACT II — Departure ──────────────────────────────────────────────────
function ActDeparture() {
  return (
    <motion.div {...exitFade} className="relative w-full max-w-2xl text-center px-4 z-10">
      {/* The figure compresses (anticipation) then launches off-frame */}
      <motion.div
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 0.6, 1.3, 0.3],
          y: [0, 18, -60, -340],
          rotate: [0, 0, -8, -25],
        }}
        transition={{ duration: 3.4, times: [0, 0.35, 0.6, 1], ease: "easeIn", delay: 0.4 }}
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-5xl"
        style={{ filter: "drop-shadow(0 0 14px rgba(244,114,182,0.55))" }}
      >
        🚀
      </motion.div>

      {/* Comet trail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.0, delay: 1.2 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-8"
        style={{
          width: 2,
          height: 200,
          background: "linear-gradient(180deg, transparent 0%, rgba(244,114,182,0.55) 60%, rgba(251,191,36,0.7) 100%)",
          filter: "blur(1px)",
        }}
      />

      <motion.h1
        {...enterTitle}
        className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4"
        style={{ color: "rgba(255,255,255,0.96)", letterSpacing: "-0.01em" }}
      >
        Then one day
        <br />
        <span style={{ fontStyle: "italic", color: "rgba(251,191,36,0.92)" }}>we left the ground.</span>
      </motion.h1>
      <motion.p
        {...enterSub}
        className="text-base md:text-lg max-w-md mx-auto"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Curiosity built the ship. The ship became us.
      </motion.p>
    </motion.div>
  );
}

// ─── ACT III — Voyage ────────────────────────────────────────────────────
function ActVoyage() {
  // Planets drifting past — sun, teal, magenta (mirroring the existing bg motifs)
  const planets = [
    { left: "8%",  top: "20%", size: 96,  color: "#FBBF24", label: "Sun",  delay: 0.2 },
    { left: "85%", top: "55%", size: 70,  color: "#22D3EE", label: "Water", delay: 0.6 },
    { left: "12%", top: "75%", size: 110, color: "#A78BFA", label: "Words", delay: 1.0 },
    { left: "78%", top: "20%", size: 60,  color: "#F472B6", label: "Wonder", delay: 1.4 },
  ];

  return (
    <motion.div {...exitFade} className="relative w-full h-full text-center z-10">
      {planets.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.left, top: p.top }}
          initial={{ x: 60, opacity: 0, scale: 0.7 }}
          animate={{ x: -40, opacity: 1, scale: 1 }}
          exit={{ x: -120, opacity: 0 }}
          transition={{ delay: p.delay, duration: 3.6, ease: "easeOut" }}
        >
          <div
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle at 30% 30%, ${p.color} 0%, ${p.color}55 70%, transparent 100%)`,
              boxShadow: `0 0 70px ${p.color}55`,
            }}
          />
          <div
            className="text-[10px] uppercase tracking-widest font-bold mt-1.5"
            style={{ color: `${p.color}cc` }}
          >
            {p.label}
          </div>
        </motion.div>
      ))}

      {/* Tiny rocket arcing across the screen */}
      <motion.div
        initial={{ left: "-10%", top: "85%", rotate: -25 }}
        animate={{ left: "110%", top: "20%", rotate: -25 }}
        transition={{ duration: 4.0, ease: "easeInOut", delay: 0.2 }}
        className="absolute text-3xl"
        style={{ filter: "drop-shadow(0 0 14px rgba(251,191,36,0.7))" }}
      >
        🚀
      </motion.div>

      <motion.h1
        {...enterTitle}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl md:text-5xl font-bold leading-[1.1] max-w-xl"
        style={{ color: "rgba(255,255,255,0.96)", letterSpacing: "-0.01em" }}
      >
        Past every world.
        <br />
        <span style={{ fontStyle: "italic", color: "rgba(34,211,238,0.92)" }}>
          Past every question.
        </span>
      </motion.h1>
    </motion.div>
  );
}

// ─── ACT IV — Arrival ────────────────────────────────────────────────────
function ActArrival() {
  return (
    <motion.div {...exitFade} className="relative w-full max-w-2xl text-center px-4 z-10">
      {/* The special planet — golden, glowing */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-6 rounded-full"
        style={{
          width: 160,
          height: 160,
          background: "radial-gradient(circle at 35% 30%, #FCD34D 0%, #F59E0B 45%, #7C2D12 90%, transparent 100%)",
          boxShadow: "0 0 120px rgba(251, 191, 36, 0.55), inset -20px -30px 60px rgba(0,0,0,0.4)",
        }}
      />

      {/* Peacock emerging — gentle scale + float */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 1.0, ease: "easeOut" }}
        className="text-7xl -mt-32 mb-2"
        style={{ filter: "drop-shadow(0 0 30px rgba(167,139,250,0.55))" }}
      >
        🦚
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-6xl md:text-8xl font-bold leading-[1] mb-2 text-gradient-cosmic"
        style={{ letterSpacing: "-0.02em" }}
      >
        Vidya
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8 }}
        className="text-base md:text-lg max-w-md mx-auto italic"
        style={{ color: "rgba(255,255,255,0.62)" }}
      >
        Future stars on a gyan journey.
      </motion.p>
    </motion.div>
  );
}
