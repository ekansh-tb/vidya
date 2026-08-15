"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert, Loader2, AlertTriangle, Check } from "lucide-react";
import type { LearnerProfile } from "@/lib/types";
import { HELPLINES } from "@/lib/safety/crisis";

type Signal = {
  id: string;
  category: string;
  cue: string;
  excerpt: string | null;
  surface: string;
  createdAt: string;
  seenAt: string | null;
};

/**
 * What the category means, in a parent's words. Describes what was *said* and
 * stops there — no severity wording, no likelihood, no advice about what it
 * indicates. The sentence itself is shown underneath; the parent is better
 * placed to read it than any label written months in advance by us.
 */
const CATEGORY: Record<string, string> = {
  self_harm: "Said something about hurting themselves, dying, or not wanting to be alive",
  harm_from_others: "Said someone is hurting them, or that they do not feel safe",
};

const SURFACE: Record<string, string> = {
  tutor: "while talking to Miss Vidya",
  reflection: "in their daily reflection",
  notebook: "in their notebook",
};

function when(iso: string): string {
  const d = new Date(iso);
  const today = new Date().toISOString().slice(0, 10);
  const day = iso.slice(0, 10);
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (day === today) return `Today, ${time}`;
  return `${d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}, ${time}`;
}

/**
 * Something the child said that a parent needs to know about.
 *
 * WHY THIS IS NOT AN OpinionCard
 * ------------------------------
 * Every analytics surface in this dashboard is required to open with a data
 * window, state an observed figure, offer a "this might mean…" and end with an
 * escalation footer, because those cards *infer* something about a child from
 * their behaviour, and an inference dressed as a finding is how a parent ends up
 * acting on a guess.
 *
 * This card does the opposite of inferring, and so the house rule is deliberately
 * departed from here. "On Tuesday at 9:14pm your child typed these words" is a
 * quotation with a timestamp. Wrapping it in "this might mean your child is
 * struggling" would add nothing a parent cannot see, would sound like a clinical
 * read we are in no position to make, and — worst of the three — would put our
 * interpretation between a parent and the only thing that matters here, which is
 * their child's own sentence.
 *
 * So: what was said, when, where, verbatim. Then who to call. Nothing about how
 * serious it is, no trend, no count over time, no comparison. A parent reading
 * their own child's words does not need our opinion of them.
 *
 * The panel renders nothing at all when there is nothing to show — it never sits
 * on the dashboard as an empty "no concerns detected" reassurance, because this
 * detector is a floor and not a safety net (see lib/safety/crisis.ts), and a
 * green tick would be a promise it cannot keep.
 */
export function SafetyPanel({ learner }: { learner: LearnerProfile }) {
  const remoteId = learner.remoteId;
  const [signals, setSignals] = useState<Signal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acking, setAcking] = useState(false);

  const load = useCallback(async () => {
    if (!remoteId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/safety`);
      // 404 and 503 are silent: a learner with no server row, or a deployment
      // with no database, has nothing to report and this panel should simply
      // not appear rather than announce its own absence.
      if (res.status === 404 || res.status === 503) { setSignals([]); return; }
      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (!res.ok) { setError("Could not check this. Please reload."); return; }
      const data = await res.json();
      setSignals(Array.isArray(data?.signals) ? data.signals : []);
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [remoteId]);

  useEffect(() => { void load(); }, [load]);

  const acknowledge = useCallback(async () => {
    if (!remoteId) return;
    setAcking(true);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/safety`, { method: "PATCH" });
      if (!res.ok) { setError("Could not save that. Please try again."); return; }
      await load();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setAcking(false);
    }
  }, [remoteId, load]);

  if (!remoteId) return null;
  // Nothing to show, still checking, or unreachable — stay off the page entirely.
  if (signals === null || signals.length === 0) {
    return error ? (
      <div role="alert" className="mb-5 flex items-start gap-2 text-xs text-red-400">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    ) : null;
  }

  const unseen = signals.filter((s) => !s.seenAt);
  const earlier = signals.filter((s) => s.seenAt);
  const name = learner.name || "Your child";

  return (
    <div className="rounded-lg border border-red-500/40 bg-red-950/20 px-5 py-4 mb-5">
      <div className="flex items-center gap-1.5 mb-1">
        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-red-400">
          Please read
        </span>
      </div>
      <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
        {name} typed something while using Vidya that we think you should see. It is shown
        below in their own words, with nothing added. Miss Vidya replied with the helpline
        numbers and did not tell {name.split(" ")[0]} that you were shown this.
      </p>

      <ul className="space-y-3">
        {[...unseen, ...earlier].map((s) => (
          <li
            key={s.id}
            className="rounded-md border px-3 py-2.5"
            style={{
              borderColor: s.seenAt ? "rgba(255,255,255,0.08)" : "rgba(248,113,113,0.35)",
              background: s.seenAt ? "rgba(255,255,255,0.02)" : "rgba(248,113,113,0.06)",
            }}
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="text-xs font-semibold text-neutral-200">
                {when(s.createdAt)}
              </span>
              <span className="text-[10px] text-neutral-500 flex-shrink-0">
                {SURFACE[s.surface] ?? s.surface}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-2">
              {CATEGORY[s.category] ?? s.category}
            </p>
            {s.excerpt && (
              <blockquote className="text-sm text-neutral-100 border-l-2 border-red-400/50 pl-3 leading-relaxed">
                {s.excerpt}
              </blockquote>
            )}
          </li>
        ))}
      </ul>

      {/* Who to call. The same numbers Miss Vidya gave the child, so a parent and
          child are never holding two different answers. */}
      <div className="mt-4 pt-3 border-t border-red-500/20">
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          <span className="font-semibold text-neutral-300">If you want to talk to someone:</span>{" "}
          Childline India <span className="tabular-nums font-semibold text-neutral-200">{HELPLINES.childline}</span>,
          free, 24 hours, in many languages · Tele-MANAS{" "}
          <span className="tabular-nums font-semibold text-neutral-200">{HELPLINES.teleManas}</span>,
          government mental-health helpline · emergencies{" "}
          <span className="tabular-nums font-semibold text-neutral-200">{HELPLINES.emergency}</span>.
        </p>
        <p className="text-[11px] text-neutral-500 leading-relaxed mt-2">
          Vidya spots this with a simple word-pattern check, not a trained model. It will miss
          things a child says differently, and it can be wrong — so an empty stretch here is not
          evidence that everything is fine, and one of these is not a diagnosis.
        </p>
      </div>

      {unseen.length > 0 && (
        <button
          onClick={() => void acknowledge()}
          disabled={acking}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-neutral-600 disabled:opacity-50"
        >
          {acking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          I&apos;ve read {unseen.length === 1 ? "this" : `these ${unseen.length}`}
        </button>
      )}
      {/* Acknowledging is not deleting, and the parent is told so — the history
          is the point. Two of these in a week reads very differently from two in
          six months, and only someone who can see both can tell. */}
      {unseen.length > 0 && (
        <p className="text-[10px] text-neutral-600 mt-2">
          Marking these read keeps them here, further down. Nothing is deleted.
        </p>
      )}

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…
        </div>
      )}
      {error && (
        <div role="alert" className="mt-3 flex items-start gap-2 text-xs text-red-400">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
