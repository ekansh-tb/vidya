import { AlertTriangle, Heart, Stethoscope, GraduationCap, Info } from "lucide-react";

/**
 * OpinionCard — the locked shape for every analytics finding shown to a parent.
 *
 * Rule (see [[analytics-opinion-only]] memory): we NEVER claim. We always:
 *
 *   1. Show the DATA WINDOW (what we looked at) — verifiable
 *   2. Show the OBSERVED % (quantitative observation, no opinion yet)
 *   3. Offer a "this might mean…" framing (soft opinion)
 *   4. Add an ESCALATION footer when topic is medical or emotional —
 *      route the parent to a human (teacher / paediatrician / counsellor).
 *
 * Every analytics surface in /parent/** MUST use this component. Composing
 * a bespoke "AI says X about your kid" card outside this primitive bypasses
 * the consent + opinion contract and is a bug.
 *
 * It rendered in exactly one place for a while, because WellnessSignals in
 * parent-view.tsx grew its own inline SignalRow — same window/observation/
 * opinion data, but no "Opinion · not a claim" header and no escalation
 * footer, so five findings about a child's rhythm and wellbeing read as
 * verdicts with nowhere to take them. That is the failure mode this component
 * exists to prevent, and it happened anyway, which is why the text colours
 * below are theme tokens now: the duplicate existed partly because this one
 * was hard-coded to the dashboard's palette and looked wrong in the kid app's
 * parent room. A primitive nobody can reuse gets reimplemented.
 */
export type OpinionTone = "neutral" | "warm" | "concern" | "medical" | "academic";

export function OpinionCard({
  window: dataWindow,
  observation,
  opinion,
  escalation,
  tone = "neutral",
  evidenceHref,
}: {
  /** The data window — e.g. "Last 7 days" or "Across 12 quizzes". REQUIRED. */
  window: string;
  /** The observed % / count / fact — quantitative, no judgement. REQUIRED. */
  observation: string;
  /** Soft interpretation. MUST begin with "This might mean" or similar — never assert. REQUIRED. */
  opinion: string;
  /** When topic is medical/emotional, route to a human. Renders the escalation footer. */
  escalation?: {
    label: string;          // e.g. "Worth a chat with the class teacher"
    to: "teacher" | "doctor" | "counsellor" | "self";
  };
  tone?: OpinionTone;
  /** Optional link to drill into the underlying data — proof, not advice. */
  evidenceHref?: string;
}) {
  const palette = TONE[tone];

  return (
    <article className={`rounded-lg border ${palette.border} ${palette.bg} px-5 py-4`}>
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Info className={`w-3.5 h-3.5 ${palette.accent}`} />
          <span className={`text-[10px] uppercase tracking-widest font-bold ${palette.accent}`}>
            Opinion · not a claim
          </span>
        </div>
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{dataWindow}</span>
      </header>

      <p className="text-[13px] leading-relaxed">
        <span className="font-medium" style={{ color: "var(--text)" }}>{observation}</span>
      </p>

      <p className="text-[13px] mt-1.5 leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
        {opinion}
      </p>

      {(escalation || evidenceHref) && (
        <footer
          className="mt-3 pt-3 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {escalation ? (
            <div className="flex items-center gap-2">
              <EscalationIcon to={escalation.to} className={`w-3.5 h-3.5 ${palette.accent}`} />
              <span className={`text-[11px] font-semibold ${palette.accent}`}>{escalation.label}</span>
            </div>
          ) : <span />}

          {evidenceHref && (
            <a
              href={evidenceHref}
              className="text-[10px] uppercase tracking-widest font-bold transition hover:opacity-100 opacity-70"
              style={{ color: "var(--text-muted)" }}
            >
              See the data →
            </a>
          )}
        </footer>
      )}
    </article>
  );
}

function EscalationIcon({ to, className }: { to: NonNullable<Parameters<typeof OpinionCard>[0]["escalation"]>["to"]; className: string }) {
  if (to === "teacher")    return <GraduationCap className={className} />;
  if (to === "doctor")     return <Stethoscope   className={className} />;
  if (to === "counsellor") return <Heart         className={className} />;
  return <AlertTriangle className={className} />;
}

const TONE: Record<OpinionTone, { border: string; bg: string; accent: string }> = {
  neutral:  { border: "border-neutral-800",                bg: "bg-neutral-900/40",          accent: "text-neutral-400" },
  warm:     { border: "border-amber-900/40",               bg: "bg-amber-950/20",            accent: "text-amber-300" },
  concern:  { border: "border-rose-900/40",                bg: "bg-rose-950/20",             accent: "text-rose-300" },
  medical:  { border: "border-emerald-900/40",             bg: "bg-emerald-950/20",          accent: "text-emerald-300" },
  academic: { border: "border-violet-900/40",              bg: "bg-violet-950/20",           accent: "text-violet-300" },
};
