"use client";

import { useState } from "react";
import { CloudUpload, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import type { LearnerProfile } from "@/lib/types";

/**
 * Claims a device-local learner profile into the signed-in parent's account.
 *
 * This is the missing first half of the linking flow. Profiles are created on
 * the child's device and have no owner; a parent could not issue a claim code
 * because there was no server row to issue it against. This creates that row,
 * writes `remoteId` back onto the local profile, and from there the code
 * flow — and eventually state sync — has something to point at.
 *
 * Note what this deliberately does NOT do: it does not upload the child's
 * GameState. Claiming establishes ownership only. Progress moves separately,
 * through the sync endpoint, so a parent pressing a button in a dashboard is
 * not silently exporting their child's reflections to a server.
 */
export function ClaimAccountPanel({
  learner,
  onClaimed,
}: {
  learner: LearnerProfile;
  onClaimed: (remoteId: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimed = Boolean(learner.remoteId);

  const claim = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/parent/learners", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: learner.name || "Learner",
          grade: learner.grade,
          board: learner.board,
          school: learner.school,
          city: learner.city,
          localId: learner.id,
          pickedSubjects: learner.pickedSubjects,
          subjectsLocked: learner.subjectsLocked,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (res.status === 503) { setError("The database isn't attached to this deployment yet."); return; }
      if (!res.ok || !data?.learner?.id) {
        setError(data?.error || "Could not add this learner to your account.");
        return;
      }
      onClaimed(data.learner.id);
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };

  if (claimed) {
    return (
      <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4 mb-4">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          In your account
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {learner.name || "This learner"} belongs to your account. You can now create a
          code below to link their device.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-1">
        <CloudUpload className="w-3.5 h-3.5" />
        Not in your account yet
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed mb-3">
        {learner.name || "This learner"} exists only in this browser. Adding them to your
        account is what lets you issue a link code and, later, keep their progress safe
        across devices. Their work stays on this device until you choose to sync it.
      </p>
      <button
        onClick={() => void claim()}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-neutral-100 hover:bg-white/15 active:scale-95 disabled:opacity-60"
      >
        {busy ? "Adding…" : <><Check className="w-3.5 h-3.5" /> Add to my account</>}
      </button>
      {error && (
        <div role="alert" className="mt-2 flex items-start gap-1.5 text-[11px] text-rose-300">
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
