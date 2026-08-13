"use client";

import { useCallback, useEffect, useState } from "react";
import { Gauge, Loader2, AlertTriangle } from "lucide-react";
import type { LearnerProfile } from "@/lib/types";

type UsageDay = { day: string; capability: string; count: number };

const LABEL: Record<string, string> = {
  "ai.tutor.full": "Miss Vidya",
  "ai.tutor.limited": "Miss Vidya (limited)",
};

/**
 * How much of each metered capability this learner used, day by day.
 *
 * WHY THIS IS NOT AN OpinionCard
 * ------------------------------
 * Every *analytics* surface here has to open with a data window, an
 * observation and a "this might mean", because those cards infer something
 * about a child from their behaviour and inference has to be marked as such.
 *
 * This one infers nothing. "14 questions to Miss Vidya today" is a count, and
 * dressing a count in "this might mean…" would be worse than plain, not
 * better: it would invite the parent to read a judgement into a number that
 * carries none. The honest move is to show the figure and stop.
 *
 * Specifically absent, and deliberately: no average, no trend arrow, no
 * comparison to other children, no "heavy user" banding. The moment this
 * compares, it stops being a fact about one child and becomes a verdict.
 */
export function UsagePanel({ learner }: { learner: LearnerProfile }) {
  const remoteId = learner.remoteId;
  const [rows, setRows] = useState<UsageDay[] | null>(null);
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!remoteId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/usage`);
      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (res.status === 503) { setError("Not switched on for this deployment yet."); return; }
      if (res.status === 404) { setRows([]); return; }
      if (!res.ok) { setError("Could not read usage."); return; }
      const data = await res.json();
      setRows(Array.isArray(data?.usage) ? data.usage : []);
      setLimits(data?.limits ?? {});
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [remoteId]);

  useEffect(() => { void load(); }, [load]);

  if (!remoteId) return null;

  const today = new Date().toISOString().slice(0, 10);
  const byDay = new Map<string, UsageDay[]>();
  for (const r of rows ?? []) {
    const list = byDay.get(r.day) ?? [];
    list.push(r);
    byDay.set(r.day, list);
  }
  const days = [...byDay.keys()].sort().reverse();

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4 mb-5">
      <div className="flex items-center gap-1.5 mb-1">
        <Gauge className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-violet-400">
          AI use · last 7 days
        </span>
      </div>
      <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
        Counted per day, and capped — once the cap is reached Miss Vidya says she&apos;ll be
        ready again tomorrow, and {learner.name || "your child"} is never told a limit exists.
        A count, not a verdict: there is nothing here to read into.
      </p>

      {loading && rows === null ? (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…
        </div>
      ) : days.length === 0 ? (
        <p className="text-xs text-neutral-500">
          No AI use recorded yet. This fills in once they start asking Miss Vidya things.
        </p>
      ) : (
        <ul className="space-y-2">
          {days.map((day) => (
            <li key={day} className="flex items-start justify-between gap-3">
              <span className="text-xs text-neutral-400 pt-0.5 w-24 flex-shrink-0">
                {day === today ? "Today" : new Date(day).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              </span>
              <div className="flex-1 min-w-0 space-y-1.5">
                {byDay.get(day)!.map((r) => {
                  const cap = limits[r.capability];
                  const pct = cap ? Math.min(100, Math.round((r.count / cap) * 100)) : null;
                  return (
                    <div key={r.capability}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs text-neutral-300 truncate">
                          {LABEL[r.capability] ?? r.capability}
                        </span>
                        <span className="text-xs font-semibold text-neutral-200 flex-shrink-0 tabular-nums">
                          {r.count}{cap ? ` / ${cap}` : ""}
                        </span>
                      </div>
                      {pct !== null && (
                        <div className="h-1 rounded-full bg-neutral-800 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500/70"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
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
