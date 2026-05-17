"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVATARS } from "@/lib/content/avatars";
import { initAudio, startMusic, sfx } from "@/lib/audio";
import { vidya } from "@/lib/speech";

export function OnboardingView({
  defaultName, onComplete,
}: {
  defaultName: string;
  onComplete: (data: { name: string; avatarId: string }) => Promise<void> | void;
}) {
  const [name, setName] = useState(defaultName);
  const [step, setStep] = useState(0);
  const [avatarId, setAvatarId] = useState("peacock");

  const handleStart = async () => {
    // Audio needs a user gesture to start
    await initAudio();
    sfx.coin();
    await onComplete({ name: name.trim(), avatarId });
    setTimeout(() => {
      startMusic();
      vidya.greet(name.trim().split(" ")[0]);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
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
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-gradient-cosmic leading-[1]">
                Vidya Quest
              </h1>
              <p className="text-white/70 text-lg mb-2 font-medium">An adventure into learning</p>
              <p className="text-white/50 text-sm mb-10 max-w-md mx-auto">
                Cambridge Stage 5 · Hindi · Marathi · GK. Stack XP, unlock badges, level up daily.
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
                Hey <span className="text-gradient-sunset">{name.split(" ")[0]}</span>!
              </h2>
              <p className="text-center text-white/60 mb-10">Pick your learning buddy</p>
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
                <Button size="lg" onClick={handleStart}>
                  <Sparkles className="inline w-5 h-5 -mt-0.5 mr-1" /> Start my Quest
                </Button>
              </div>
              <p className="text-center text-white/40 text-xs mt-6">
                Music and voice will turn on when you start. Toggle anytime in settings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
