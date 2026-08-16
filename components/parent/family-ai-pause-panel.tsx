"use client";

import { useCallback, useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import { Loader2, PauseCircle, ShieldAlert } from "lucide-react";
import { apiErrorMessage } from "@/lib/ai/connection-summary";
import { parsePausedAiAssignments } from "@/lib/ai/tutor-profile-summary";

type Notice = { kind: "success" | "error" | "neutral"; text: string };

async function responseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export function FamilyAiPausePanel({ onPaused }: { onPaused?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const pauseRequest = useCallback(async (): Promise<unknown> => {
    const response = await fetch("/api/parent/ai-tutors/pause-all", { method: "POST" });
    return responseJson(response);
  }, []);
  const pauseWithReverification = useReverification(pauseRequest);

  const pauseAll = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const payload = await pauseWithReverification();
      const paused = parsePausedAiAssignments(payload);
      if (paused === null) {
        setNotice({
          kind: "error",
          text: apiErrorMessage(payload, "Could not pause learner AI access."),
        });
        return;
      }
      setConfirming(false);
      onPaused?.();
      setNotice(paused === 0
        ? { kind: "neutral", text: "All saved learner AI assignments were already paused." }
        : {
            kind: "success",
            text: `Paused AI tutor access for ${paused} learner${paused === 1 ? "" : "s"}.`,
          });
    } catch (error) {
      if (isReverificationCancelledError(error)) {
        setNotice({ kind: "neutral", text: "Verification was cancelled. Nothing changed." });
      } else {
        setNotice({ kind: "error", text: "Could not pause learner AI access." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="family-ai-pause-heading"
      className="rounded-xl border border-red-900/60 bg-red-950/15 px-5 py-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-red-300">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em]">Family safety control</span>
          </div>
          <h2 id="family-ai-pause-heading" className="font-display text-xl font-bold text-white">
            Pause every learner AI tutor
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            One verified action pauses every enabled learner assignment. Tutor profiles, provider connections, and learner limits stay saved so you can re-enable learners individually later.
          </p>
        </div>
        {!confirming && (
          <button
            type="button"
            onClick={() => {
              setConfirming(true);
              setNotice(null);
            }}
            disabled={busy}
            className="inline-flex min-h-11 flex-shrink-0 items-center justify-center gap-2 rounded-md border border-red-800 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
          >
            <PauseCircle className="h-4 w-4" aria-hidden="true" />
            Pause all learner AI
          </button>
        )}
      </div>

      {confirming && (
        <div className="mt-4 rounded-md border border-red-800/70 bg-red-950/35 p-4">
          <p className="text-sm font-semibold text-red-100">
            Pause AI tutor access for every learner in this parent account?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-red-200/80">
            Any reply already being generated may finish. The next tutor request will be blocked until you re-enable that learner.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void pauseAll()}
              disabled={busy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {busy ? "Pausing learner AI" : "Yes, pause all"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:opacity-50"
            >
              Keep current access
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div
          role={notice.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            notice.kind === "error"
              ? "border-red-800 bg-red-950/40 text-red-200"
              : notice.kind === "success"
                ? "border-emerald-900/70 bg-emerald-950/30 text-emerald-200"
                : "border-neutral-700 bg-neutral-950/60 text-neutral-300"
          }`}
        >
          {notice.text}
        </div>
      )}
    </section>
  );
}
