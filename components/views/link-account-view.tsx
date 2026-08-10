"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, KeyRound, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/game-store";
import { sfx } from "@/lib/audio";
import type { LearnerProfile } from "@/lib/types";

/**
 * Links this device's learner to a real account.
 *
 * This is what replaces the PIN as the route to verification rung 2 (and
 * therefore the AI tutor). A parent issues a single-use code from their
 * signed-in dashboard; the child types it here. The promotion happens on the
 * server against the parent's session, so a child cannot award it to
 * themselves — which the old 4-digit PIN let them do in two taps.
 *
 * Deliberately kid-legible: no jargon, no mention of "rungs" or "capabilities",
 * and every failure says what to do next.
 */
export function LinkAccountView({
  learner, onBack,
}: {
  learner: LearnerProfile;
  onBack: () => void;
}) {
  const updateLearnerMeta = useGameStore((s) => s.updateLearnerMeta);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState(learner.verifiedLevel != null && learner.verifiedLevel >= 2);

  const submit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setError("Type the whole code from your grown-up.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setError("You need to sign in first. Ask a grown-up to help.");
        return;
      }
      if (res.status === 503) {
        setError("Linking isn't switched on yet. You can keep learning without it.");
        return;
      }
      if (!res.ok || !data?.learner) {
        setError(data?.error || "That didn't work. Check the code and try again.");
        return;
      }

      // Mirror the server's decision onto the local profile. `verifiedLevel` is
      // the ONLY thing that raises the rung now — see computeRung.
      updateLearnerMeta(learner.id, {
        verifiedLevel: data.learner.verificationLevel ?? 2,
        remoteId: data.learner.id,
      });
      sfx.badge();
      setLinked(true);
    } catch {
      setError("Couldn't reach Vidya. Check the internet and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-6">
          <button
            onClick={() => { sfx.click(); onBack(); }}
            className="flex items-center gap-1 font-medium mb-4 active:scale-95"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft className="w-5 h-5" /> Home
          </button>

          {linked ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                   style={{ background: "var(--accent-soft)" }}>
                <ShieldCheck className="w-7 h-7" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
                This device is linked
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Your progress is saved to your account now, so it&apos;s safe even if this
                browser is cleared — and Miss Vidya is open.
              </p>
              <Button onClick={() => { sfx.click(); onBack(); }}>Back to school</Button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: "var(--accent)" }}>
                  Connect your account
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                Got a code?
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A grown-up can make a code for you in the Parent room. Typing it here saves
                your progress to your account, so it&apos;s safe if this browser gets cleared —
                and it opens Miss Vidya, your AI tutor.
              </p>

              <div className="glass-card p-5">
                <label htmlFor="claim-code" className="block text-xs font-semibold mb-2"
                       style={{ color: "var(--text-muted)" }}>
                  Your code
                </label>
                <input
                  id="claim-code"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") void submit(); }}
                  placeholder="ABC123"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={12}
                  aria-describedby={error ? "claim-code-error" : undefined}
                  aria-invalid={error ? true : undefined}
                  className="w-full rounded-[var(--radius-md)] px-4 py-3 text-2xl font-bold tracking-[0.3em] text-center outline-none"
                  style={{
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                />

                {error && (
                  <div id="claim-code-error" role="alert"
                       className="mt-3 flex items-start gap-2 text-xs"
                       style={{ color: "var(--error)" }}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button className="mt-4 w-full" onClick={() => void submit()} disabled={busy}>
                  {busy ? "Checking…" : <><Check className="w-4 h-4 inline -mt-0.5" /> Link this device</>}
                </Button>
              </div>

              <p className="text-xs mt-4 leading-relaxed" style={{ color: "var(--text-faint)" }}>
                No code? That&apos;s fine — everything else in Vidya works without one.
              </p>
            </>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}
