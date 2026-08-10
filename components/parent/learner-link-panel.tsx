"use client";

import { useState } from "react";
import { KeyRound, Copy, Check, AlertTriangle, Link2 } from "lucide-react";
import type { LearnerProfile } from "@/lib/types";
import { copyText } from "@/lib/clipboard";

type Issued = { code: string; expiresAt: string };

/**
 * Issues the claim code a parent shows their child.
 *
 * This is the adult half of the flow that replaces the PIN. The code is minted
 * server-side against the parent's Clerk session and against a learner row
 * they own, so it is the first point in the app's history where "a specific
 * adult vouched for this child" is a fact rather than a four-digit string
 * stored on the child's own device.
 *
 * Requires the learner to exist on the server. A device-local profile that has
 * never been pushed has no row to link to, and we say so plainly rather than
 * failing with a 404.
 */
export function LearnerLinkPanel({ learner }: { learner: LearnerProfile }) {
  const [issued, setIssued] = useState<Issued | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const remoteId = learner.remoteId;
  const alreadyLinked = (learner.verifiedLevel ?? 0) >= 2;

  const issue = async () => {
    if (!remoteId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/claim-code`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (res.status === 503) { setError("Account linking isn't switched on for this deployment yet."); return; }
      if (!res.ok || !data?.code) { setError(data?.error || "Could not create a code."); return; }
      setIssued({ code: data.code, expiresAt: data.expiresAt });
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!issued) return;
    const ok = await copyText(issued.code);
    if (ok) {
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      // Say so. The code is on screen and selectable, so there is a real
      // answer to give rather than leaving a dead button.
      setCopyFailed(true);
    }
  };

  return (
    <div className="glass-card p-5 mb-5">
      <div className="flex items-center gap-1.5 mb-2">
        <Link2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Link {learner.name || "this learner"}&apos;s device
        </span>
      </div>

      {alreadyLinked ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          This learner is linked to an account. Their progress is saved to the server and the
          AI tutor is available to them.
        </p>
      ) : !remoteId ? (
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          This profile only exists in this browser, so there is nothing to link to yet. Once
          learner accounts are switched on for your family, you&apos;ll be able to create a code
          here and unlock the AI tutor for them.
        </p>
      ) : (
        <>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Create a code and show it to {learner.name || "your child"}. They type it into Vidya on
            their own device. It works once, expires in a day, and is the only way to open the
            AI tutor for them.
          </p>

          {issued ? (
            <div>
              <div
                className="rounded-[var(--radius-md)] px-4 py-4 text-center mb-3"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--border-strong)" }}
              >
                <div
                  className="font-mono text-3xl font-bold tracking-[0.35em] select-all cursor-text"
                  style={{ color: "var(--accent)", userSelect: "all", WebkitUserSelect: "all" }}
                  // select-all lets a parent long-press the code and copy it by
                  // hand on any device where the clipboard API is blocked.
                >
                  {issued.code}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-xs font-semibold active:scale-95"
                  style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                  Expires {new Date(issued.expiresAt).toLocaleString()}
                </span>
              </div>
              {copyFailed && (
                <div role="status" className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  This browser wouldn&apos;t let Vidya use the clipboard. Press and hold the
                  code above to copy it, or just read it out.
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => void issue()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold active:scale-95 disabled:opacity-60"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              <KeyRound className="w-4 h-4" />
              {busy ? "Creating…" : "Create a code"}
            </button>
          )}

          {error && (
            <div role="alert" className="mt-3 flex items-start gap-2 text-xs" style={{ color: "var(--error)" }}>
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
