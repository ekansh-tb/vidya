"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { onSpeechLine } from "@/lib/speech";
import { useCapability } from "@/lib/capabilities/use-capability";

/**
 * Floating "Miss Vidya is saying…" bubble.
 *
 * Gated on the same `ai.tutor.full` capability as the rest of Miss Vidya
 * (her room, the Ask-Miss-Vidya CTAs). When AI tutor is disallowed for
 * the current learner, this bubble simply never appears — no copy
 * about being locked, per [[parent-invisible-config]].
 *
 * Note: ambient sfx (correct-answer chimes, coin) still play; those
 * are app feedback, not the AI tutor.
 */
export function VoiceBubble() {
  const [line, setLine] = useState<string | null>(null);
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;

  useEffect(() => {
    if (!aiTutorAllowed) {
      setLine(null);
      return;
    }
    const unsubscribe = onSpeechLine(setLine);
    return () => {
      unsubscribe();
    };
  }, [aiTutorAllowed]);

  return (
    <AnimatePresence>
      {line && aiTutorAllowed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md px-4"
        >
          <div className="glass-strong rounded-3xl px-5 py-3 flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl gradient-cosmic flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Miss Vidya</div>
              <div className="text-sm font-medium text-white/90 leading-snug">{line}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
