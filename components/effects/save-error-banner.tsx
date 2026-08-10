"use client";

import { AlertTriangle, X } from "lucide-react";
import { useGameStore } from "@/lib/game-store";

/**
 * Shown when a write to localStorage has failed.
 *
 * Previously `saveProfiles()`'s boolean was ignored at every call site, so a
 * full or read-only localStorage meant the learner kept answering questions
 * while nothing was being written — and lost the whole session on reload with
 * no indication anything was wrong. A visible warning is worth an interrupted
 * screen; silent loss is not.
 *
 * Deliberately not dismissible-forever: dismissing clears the current error,
 * but the next failed write raises it again.
 */
export function SaveErrorBanner() {
  const saveError = useGameStore((s) => s.saveError);
  const dismiss = useGameStore((s) => s.dismissSaveError);

  if (!saveError) return null;

  const message =
    saveError === "quota"
      ? "This browser's storage is full, so progress isn't being saved. Ask a grown-up to open the Parent room and download a backup, then clear some space."
      : saveError === "unavailable"
        ? "This browser is blocking storage — private browsing usually does this. Progress won't be saved until you open Vidya in a normal window."
        : "Progress isn't being saved right now. Ask a grown-up to open the Parent room and download a backup.";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none"
    >
      <div
        className="mx-auto max-w-2xl rounded-[var(--radius-md)] p-3 flex items-start gap-2.5 pointer-events-auto shadow-lg"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--error)",
          backdropFilter: "blur(12px)",
        }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--error)" }} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold mb-0.5" style={{ color: "var(--error)" }}>
            Progress isn&apos;t saving
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {message}
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 p-1 rounded active:scale-90"
          style={{ color: "var(--text-faint)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
