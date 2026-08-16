"use client";

import { useId } from "react";
import { ArrowRight, BookOpenCheck, Compass, Sparkles } from "lucide-react";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import type { NextQuestRecommendation } from "@/lib/adaptive/recommendation";

export function NextBestQuestCard({
  recommendation,
  onStart,
  compact = false,
}: {
  recommendation: NextQuestRecommendation;
  onStart?: () => void;
  compact?: boolean;
}) {
  const headingId = useId();
  const descriptionId = useId();
  const subject = recommendation.kind === "topic"
    ? SUBJECT_MAP[recommendation.subjectId]
    : undefined;

  if (recommendation.kind === "unavailable") {
    return (
      <section
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className={`rounded-3xl border border-white/10 bg-white/[0.04] text-left ${compact ? "p-4" : "p-5"}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Compass className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/45">
              Next best quest
            </div>
            <h2 id={headingId} className="font-display text-lg font-bold text-white mt-0.5">
              Personal quiz suggestions are not ready yet
            </h2>
            <p id={descriptionId} className="text-xs leading-relaxed text-white/60 mt-1">
              Quizzes for this curriculum and grade are still being prepared and have not been verified yet. You can still choose any available class, book, or activity.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isReview = recommendation.kind === "due-review";
  const title = isReview
    ? `${recommendation.dueCount} review ${recommendation.dueCount === 1 ? "question is" : "questions are"} ready`
    : recommendation.topicTitle;
  const description = isReview
    ? "A quick revisit can help the answer stick."
    : recommendation.source === "weakest-attempted"
      ? "This topic has the most room to grow from the quizzes you have tried."
      : recommendation.source === "unseen"
        ? "No topic quiz result is recorded here yet, so this is ready to explore."
        : "A quick practice round can keep this skill fresh.";
  const actionLabel = isReview ? "Open review" : "Start quest";
  const accessibleActionLabel = isReview
    ? `Review ${recommendation.dueCount} ready ${recommendation.dueCount === 1 ? "question" : "questions"}`
    : `Start ${recommendation.topicTitle} quest`;

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      className={`rounded-3xl relative overflow-hidden text-left ${compact ? "p-4" : "p-5"}`}
      style={{
        background: subject
          ? `linear-gradient(135deg, ${subject.soft} 0%, rgba(167, 139, 250, 0.12) 100%)`
          : "linear-gradient(135deg, rgba(244, 114, 182, 0.16) 0%, rgba(167, 139, 250, 0.12) 100%)",
        border: `1px solid ${subject?.accent || "rgba(244, 114, 182, 0.38)"}`,
        boxShadow: subject ? `0 0 26px ${subject.glow}` : "0 0 26px rgba(244, 114, 182, 0.14)",
      }}
    >
      <div className="relative flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: subject?.soft || "rgba(244, 114, 182, 0.16)" }}
          aria-hidden="true"
        >
          {isReview ? (
            <BookOpenCheck className="w-6 h-6 text-rose-300" />
          ) : (
            <span className="text-2xl">{recommendation.topicIcon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold">
            <span className="inline-flex items-center gap-1 text-fuchsia-200">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> Next best quest
            </span>
            {subject && (
              <span className={subject.isDeva ? "font-deva" : ""} style={{ color: subject.accent }}>
                · {subject.name}
              </span>
            )}
          </div>
          <h2
            id={headingId}
            className={`font-display text-xl font-bold text-white mt-1 ${subject?.isDeva ? "font-deva" : ""}`}
          >
            {title}
          </h2>
          <p id={descriptionId} className="text-xs leading-relaxed text-white/70 mt-1">
            {description} This is a suggestion, and you can choose another activity anytime.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        aria-label={accessibleActionLabel}
        className="relative mt-4 w-full min-h-11 rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 font-bold text-sm text-white bg-white/10 border border-white/15 hover:bg-white/15 active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b18]"
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </section>
  );
}
