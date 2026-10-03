"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, KeyRound, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { placementFor, samePlacement } from "@/lib/learning/placement";
import { useGameStore } from "@/lib/game-store";
import { deviceLabel } from "@/lib/sync/client";
import { sfx } from "@/lib/audio";
import type { LearnerProfile } from "@/lib/types";

/**
 * Links this device's learner to a real account.
 *
 * This is what replaces the PIN as the route to verification rung 2 (and
 * therefore the AI tutor). A parent issues a single-use code from their
 * signed-in dashboard; the child types it here. The code is minted against the
 * parent's session, so a child cannot award rung 2 to themselves — which the
 * old 4-digit PIN let them do in two taps.
 *
 * The child is NOT asked to sign in, and this screen used to dead-end because
 * of it: the server required a session, the kid app has none, and the only
 * advice on offer was "ask a grown-up to help" with nothing to point them at.
 * Redeeming now returns a device token instead — the code is the credential.
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
  const hi = learner.learningLanguage === "hi";
  const early = learner.placement?.kind === "early-years";
  const updateLearnerMeta = useGameStore((s) => s.updateLearnerMeta);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState(learner.verifiedLevel != null && learner.verifiedLevel >= 2);

  const submit = async () => {
    if (busy) return;
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setError(hi ? "बड़े से मिला पूरा कोड लिखो।" : "Type the whole code from your grown-up.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: trimmed, deviceLabel: deviceLabel() }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 503) {
        setError(hi ? "अभी खाते से जोड़ना उपलब्ध नहीं है। बिना जोड़े भी सीख सकते हो।" : "Linking isn't switched on yet. You can keep learning without it.");
        return;
      }
      if (!res.ok || !data?.learner) {
        setError(hi ? "कोड नहीं जुड़ा। बड़े के साथ कोड जाँचो और फिर कोशिश करो।" : data?.error || "That didn't work. Check the code and try again.");
        return;
      }

      if (!samePlacement(placementFor(learner), placementFor(data.learner))) {
        setError(hi ? "यह कोड दूसरे सीखने के स्तर का है। बड़े से प्रोफ़ाइल जाँचने को कहो।" : "This code is for a different learning level. Ask your grown-up to check the profile before linking.");
        return;
      }

      // Mirror the server's decision onto the local profile. `verifiedLevel` is
      // the ONLY thing that raises the rung now — see computeRung. The token is
      // handed back exactly once, so if this write is lost the parent has to
      // issue a fresh code; that is the correct failure mode for a credential.
      updateLearnerMeta(learner.id, {
        verifiedLevel: data.learner.verificationLevel ?? 2,
        remoteId: data.learner.id,
        deviceToken: data.deviceToken,
      });
      sfx.badge();
      setLinked(true);
    } catch {
      setError(hi ? "विद्या से जुड़ नहीं पाए। इंटरनेट जाँचो और फिर कोशिश करो।" : "Couldn't reach Vidya. Check the internet and try again.");
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
            <ChevronLeft className="w-5 h-5" /> {hi ? "वापस" : "Home"}
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
                {hi ? "यह डिवाइस जुड़ गया है" : "This device is linked"}
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {hi ? "इंटरनेट मिलने पर विद्या प्रगति खाते में सहेज सकती है। स्क्रीन पर सहेजने की स्थिति देखें। तुम्हारे बड़े उपलब्ध सुविधाएँ तय करते हैं।" : "With an internet connection, Vidya can synchronize progress to your account. Check the save status before clearing this browser. Your grown-up controls available features."}
              </p>
              <Button onClick={() => { sfx.click(); onBack(); }}>{hi ? "मेरी गतिविधियाँ" : early ? "Back to my activities" : "Back to school"}</Button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: "var(--accent)" }}>
                  {hi ? "खाते से जोड़ो" : "Connect your account"}
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {hi ? "कोड मिला?" : "Got a code?"}
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {hi ? "बड़े Parent Portal में कोड बना सकते हैं। यहाँ लिखकर इस डिवाइस की प्रगति खाते से जोड़ो। शुरुआती स्तर पर साथी की बातें पहले से लिखी होती हैं; AI ट्यूटर नहीं खुलता।" : "A grown-up can create a code in the Parent Portal. Enter it here to connect progress on this device with your account. Preschool guidance stays scripted; linking does not by itself unlock AI tutoring."}
              </p>

              <div className="glass-card p-5">
                <label htmlFor="claim-code" className="block text-xs font-semibold mb-2"
                       style={{ color: "var(--text-muted)" }}>
                  {hi ? "तुम्हारा कोड" : "Your code"}
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
                  {busy ? (hi ? "जाँच रहे हैं…" : "Checking…") : <><Check className="w-4 h-4 inline -mt-0.5" /> {hi ? "यह डिवाइस जोड़ो" : "Link this device"}</>}
                </Button>
              </div>

              <p className="text-xs mt-4 leading-relaxed" style={{ color: "var(--text-faint)" }}>
                {hi ? "कोड नहीं है? बिना खाते जोड़े भी अपनी उपलब्ध गतिविधियाँ कर सकते हो।" : "No code? You can still use your available learning activities without linking."}
              </p>
            </>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}
