"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Check, Copy, FileDown } from "lucide-react";
import { CosmicBg } from "@/components/effects/cosmic-bg";
import { OpinionCard } from "@/components/parent/opinion-card";
import { copyText } from "@/lib/clipboard";
import { dayKeyOf } from "@/lib/utils";
import { ClaimAccountPanel } from "@/components/parent/claim-account-panel";
import { LearnerLinkPanel } from "@/components/parent/learner-link-panel";
import { DevicePanel } from "@/components/parent/device-panel";
import { UsagePanel } from "@/components/parent/usage-panel";
import { SyllabusPanel } from "@/components/parent/syllabus-panel";
import { SafetyPanel } from "@/components/parent/safety-panel";
import { AiConnectionsPanel } from "@/components/parent/ai-connections-panel";
import { AiTutorControlsPanel } from "@/components/parent/ai-tutor-controls-panel";
import { useGameStore } from "@/lib/game-store";
import { subjectsForLearner } from "@/lib/content/subjects";
import { missedQuestionsForLearner, questionsForLearner } from "@/lib/content/questions/availability";
import type { LearnerProfile } from "@/lib/types";
import {
  chooseParentReportState,
  parseParentReportResponse,
  type ParentReportDecision,
  type ParentReportLoadState,
} from "@/lib/parent-report";
import {
  RecentReflections,
  WellnessSignals,
  CapabilityMap,
  FamilyNoteComposer,
  CareNoteComposer,
  type SubjectLearningStat,
} from "@/components/views/parent-view";

/**
 * Parent Clerk dashboard.
 *
 * Linked-profile contract: the learner roster comes from this browser. When a
 * profile has a remote id, reporting fields prefer its validated server sync,
 * while an explicit local fallback keeps the dashboard useful offline.
 *
 * The dashboard mirrors the in-kid-app parent room (parent-view.tsx) but
 * with no PIN gate (Clerk auth IS the gate), a learner picker, and a
 * desktop-friendly layout.
 */
export function ParentDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { profiles, hydrated, hydrate, updateLearnerMeta } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiConnectionsRevision, setAiConnectionsRevision] = useState(0);
  const [remoteReportCache, setRemoteReportCache] = useState<{
    parentId: string | null;
    reports: Record<string, ParentReportLoadState | { status: "denied" }>;
  }>({ parentId: null, reports: {} });

  useEffect(() => { hydrate(); }, [hydrate]);

  const activeParentId = isSignedIn ? user?.id ?? null : null;
  const localLearners = useMemo(() => Object.values(profiles.learners), [profiles.learners]);
  const activeReports = useMemo(
    () => remoteReportCache.parentId === activeParentId ? remoteReportCache.reports : {},
    [activeParentId, remoteReportCache],
  );
  // A linked local profile is not parent-visible until the ownership-scoped
  // endpoint confirms it for this Clerk account. This prevents an account
  // switch on a shared browser from briefly revealing another parent's child.
  const learners = useMemo(() => localLearners.filter((learner) => {
    if (!learner.remoteId) return true;
    const report = activeReports[learner.remoteId];
    return report?.status !== "loading" && report?.status !== "denied" && Boolean(report);
  }), [activeReports, localLearners]);
  const selected = useMemo(
    () => learners.find((learner) => learner.id === selectedId) || learners[0] || null,
    [learners, selectedId],
  );
  const linkedRemoteIdsKey = useMemo(
    () => [...new Set(localLearners.map((learner) => learner.remoteId).filter((id): id is string => Boolean(id)))]
      .sort()
      .join(","),
    [localLearners],
  );

  useEffect(() => {
    if (!isLoaded || !hydrated) return;
    if (!activeParentId) {
      setRemoteReportCache({ parentId: null, reports: {} });
      return;
    }
    if (!linkedRemoteIdsKey) {
      setRemoteReportCache({ parentId: activeParentId, reports: {} });
      return;
    }

    const controller = new AbortController();
    const capturedParentId = activeParentId;
    const remoteIds = linkedRemoteIdsKey.split(",");
    setRemoteReportCache({
      parentId: capturedParentId,
      reports: Object.fromEntries(remoteIds.map((id) => [id, { status: "loading" }])),
    });

    remoteIds.forEach((remoteId) => {
      void (async () => {
        try {
          const response = await fetch(`/api/parent/learners/${encodeURIComponent(remoteId)}/state`, {
            signal: controller.signal,
            cache: "no-store",
          });
          const raw: unknown = await response.json().catch(() => null);
          const parsed = response.ok ? parseParentReportResponse(raw) : null;
          if (controller.signal.aborted) return;

          let next: ParentReportLoadState | { status: "denied" } = { status: "unavailable" };
          if (parsed?.status === "ready") {
            next = {
              status: "ready",
              state: parsed.state,
              revision: parsed.revision,
              updatedAt: parsed.updatedAt,
            };
          } else if (parsed?.status === "absent") {
            next = { status: "absent" };
          } else if ([401, 403, 404].includes(response.status)) {
            next = { status: "denied" };
          }

          setRemoteReportCache((current) => current.parentId === capturedParentId
            ? { ...current, reports: { ...current.reports, [remoteId]: next } }
            : current);
        } catch {
          if (controller.signal.aborted) return;
          setRemoteReportCache((current) => current.parentId === capturedParentId
            ? {
                ...current,
                reports: {
                  ...current.reports,
                  [remoteId]: { status: "unavailable" },
                },
              }
            : current);
        }
      })();
    });

    return () => controller.abort();
  }, [activeParentId, hydrated, isLoaded, linkedRemoteIdsKey]);

  const selectedReport = useMemo(() => {
    if (!selected) return null;
    const remote = selected.remoteId
      ? activeReports[selected.remoteId]
      : { status: "unlinked" as const };
    if (!remote || remote.status === "denied") return null;
    return chooseParentReportState(selected.state, remote);
  }, [activeReports, selected]);

  const pendingLinkedLearners = localLearners.filter((learner) =>
    learner.remoteId && (!activeReports[learner.remoteId] || activeReports[learner.remoteId].status === "loading"),
  ).length;
  const deniedLinkedLearners = localLearners.filter((learner) =>
    learner.remoteId && activeReports[learner.remoteId]?.status === "denied",
  ).length;

  const displayName =
    user?.firstName?.trim() ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Parent";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  // Loading guard
  if (!isLoaded || !hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center text-neutral-400">
        <CosmicBg mode="parent" intensity={0.6} />
        <div className="text-sm">Loading…</div>
      </main>
    );
  }

  if (!isSignedIn) {
    // Defence in depth — middleware should already gate this, but if for any
    // reason the user isn't signed in, point them home rather than crash.
    return (
      <main className="min-h-screen flex items-center justify-center text-neutral-400">
        <CosmicBg mode="parent" intensity={0.6} />
        <div className="text-sm">
          <Link href="/sign-in?next=/parent" className="text-violet-400 hover:text-violet-300 underline">
            Sign in to continue →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-neutral-100 relative">
      <CosmicBg mode="parent" intensity={0.6} />
      <header className="border-b border-neutral-900 relative bg-neutral-950/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">Vidya · Parent</div>
            <h1 className="font-display text-2xl font-bold mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-widest font-bold px-3 py-2 rounded-md border border-neutral-800 hover:border-neutral-700 active:scale-95 transition"
            >
              Kid app →
            </Link>
            <SignOutButton>
              <button
                type="submit"
                className="text-[11px] uppercase tracking-widest font-bold px-3 py-2 rounded-md border border-neutral-800 hover:border-neutral-700 active:scale-95 transition"
              >
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Identity strip */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1">Signed in as</div>
            <div className="text-base font-semibold">{displayName}</div>
            {email && <div className="text-xs text-neutral-500 mt-0.5">{email}</div>}
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {learners.length} learner{learners.length === 1 ? "" : "s"} on this device
          </div>
        </div>

        <AiConnectionsPanel
          key={`ai-connections-${activeParentId}`}
          onConnectionsChanged={() => setAiConnectionsRevision((revision) => revision + 1)}
        />
        <AiTutorControlsPanel
          key={`ai-tutors-${activeParentId}`}
          refreshToken={aiConnectionsRevision}
        />

        {/* Empty state — no learners yet */}
        {learners.length === 0 && pendingLinkedLearners > 0 && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-6 py-8 text-center" role="status" aria-live="polite">
            <h2 className="font-display text-xl font-bold mb-2">Checking linked learners</h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Confirming which synced learner profiles belong to this signed-in parent account.
            </p>
          </div>
        )}

        {learners.length === 0 && pendingLinkedLearners === 0 && deniedLinkedLearners > 0 && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-6 py-8 text-center">
            <h2 className="font-display text-xl font-bold mb-2">No linked learners for this account</h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              The learner profiles linked on this browser belong to a different parent account.
            </p>
          </div>
        )}

        {learners.length === 0 && pendingLinkedLearners === 0 && deniedLinkedLearners === 0 && (
          <div className="rounded-lg border border-violet-900/50 bg-violet-950/20 px-6 py-8 text-center">
            <h2 className="font-display text-xl font-bold mb-2">No learner profiles yet on this browser</h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
              The kid creates their profile from the lobby — name, avatar, what they love.
              Once they do, this dashboard fills up with their signals automatically.
            </p>
            <Link
              href="/"
              className="inline-block rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-4 py-2 transition"
            >
              Open the kid app →
            </Link>
          </div>
        )}

        {/* Learner picker (only show if multiple) */}
        {learners.length > 1 && selected && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 flex-shrink-0">
              Viewing
            </span>
            {learners.map((l) => {
              const active = l.id === selected.id;
              return (
                <button
                  key={l.id}
                  // Local to this dashboard ONLY. This used to also call
                  // switchLearner(), which rewrites the shared
                  // `currentLearnerId` — so a parent glancing at one child's
                  // numbers silently moved the kid app into that child's
                  // profile, and the next kid to open Vidya landed inside their
                  // sibling's account. Reading must never rewrite whose app it
                  // is.
                  onClick={() => setSelectedId(l.id)}
                  className="rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition"
                  style={{
                    background: active ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: active ? "rgb(196, 181, 253)" : "rgba(255,255,255,0.65)",
                  }}
                >
                  {l.name || "Unnamed"} · Gr {l.grade}
                </button>
              );
            })}
          </div>
        )}

        {selected && (
          <>
            {/* Above everything, including the setup panels, and it renders
                nothing when there is nothing to say. If a child has disclosed
                self-harm or that someone is hurting them, that cannot sit below
                a syllabus form — a parent must not have to scroll to find it. */}
            <SafetyPanel key={`safety-${selected.id}`} learner={selected} />

            {/* Ownership first, then the code. Without a server row there is
                nothing for a claim code to point at, which is why the link
                panel used to say "nothing to link to" for every learner. */}
            <ClaimAccountPanel
              key={`claim-${selected.id}`}
              learner={selected}
              onClaimed={(remoteId) => updateLearnerMeta(selected.id, { remoteId })}
            />
            <LearnerLinkPanel key={`link-${selected.id}`} learner={selected} />

            {/* Revoking lives behind Clerk only — the in-kid-app parent room is
                PIN-guarded, which is a speed bump, not an authorisation. */}
            <DevicePanel key={`devices-${selected.id}`} learner={selected} />

            {/* A count, not analytics — see the note in the component on why
                this one deliberately has no "this might mean". */}
            <UsagePanel key={`usage-${selected.id}`} learner={selected} />
            <SyllabusPanel
              key={`syllabus-${selected.id}`}
              learner={selected}
              onSave={(patch) => updateLearnerMeta(selected.id, patch)}
            />
            <SelectedLearnerView
              key={selected.id}
              learner={selectedReport ? { ...selected, state: selectedReport.state } : selected}
              reportSource={selectedReport ?? chooseParentReportState(selected.state, { status: "unlinked" })}
              onUpdateLearner={(patch) => updateLearnerMeta(selected.id, patch)}
            />
          </>
        )}

        <footer className="text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-900 pt-6 mt-8">
          VIDYA is built so that AI and humans can take care of each other.
          You teach the AI how to teach your kid; the AI helps your kid
          flourish; we both observe quietly. Nothing here is ever a claim —
          only an opinion you can verify, override, or discard.
        </footer>
      </section>
    </main>
  );
}

function SelectedLearnerView({
  learner, reportSource, onUpdateLearner,
}: {
  learner: ReturnType<typeof useGameStore.getState>["profiles"]["learners"][string];
  reportSource: ParentReportDecision;
  onUpdateLearner: (patch: Parameters<ReturnType<typeof useGameStore.getState>["updateLearnerMeta"]>[1]) => void;
}) {
  const state = learner.state;
  const questionBanks = questionsForLearner(learner);
  const questionStatsAvailable = Object.keys(questionBanks).length > 0;
  const learnerMisses = missedQuestionsForLearner(learner, state.missedQuestions);
  const accuracy = questionStatsAvailable && state.stats.totalAnswered > 0
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
    : null;

  const learnerSubjects = subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade);
  const subjectStats = useMemo(
    () => learnerSubjects.map((s) => {
      const topics = Object.keys(questionBanks[s.id] || {});
      let attempts = 0, correct = 0, masterySum = 0;
      topics.forEach((t) => {
        const p = state.progress?.[s.id]?.[t];
        if (p) { attempts += p.attempts || 0; correct += p.correct || 0; masterySum += p.mastery || 0; }
      });
      return { ...s, attempts, correct, mastery: topics.length ? Math.round(masterySum / topics.length) : null };
    }),
    [learnerSubjects, questionBanks, state.progress],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3">
        <ReportSourceNotice source={reportSource} />
      </div>

      {/* Top-of-fold opinion + identity */}
      <div className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
        <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Profile</div>
        <div className="font-display text-3xl font-bold mt-1">{learner.name || "Unnamed learner"}</div>
        <div className="text-xs text-neutral-500 mt-0.5">
          Grade {learner.grade} · {boardLabel(learner.board)}
          {learner.school ? ` · ${learner.school}` : ""}
          {learner.city ? ` · ${learner.city}` : ""}
        </div>
        {learner.interests && learner.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 self-center mr-1">
              loves
            </span>
            {learner.interests.map((i) => (
              <span
                key={i}
                className="text-[11px] rounded-full px-2 py-0.5"
                style={{ background: "rgba(167,139,250,0.12)", color: "rgba(196,181,253,0.95)" }}
              >
                {i}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Setup status — what the parent has and hasn't configured */}
      <div className="md:col-span-3">
        <SetupStatus learner={learner} />
      </div>

      {/* Two-column body: communications + insights */}
      <div className="md:col-span-2 space-y-4">
        <FamilyNoteComposer
          name={learner.name || "your learner"}
          note={learner.familyNote}
          onChange={(next) => onUpdateLearner({ familyNote: next })}
        />
        <CareNoteComposer
          name={learner.name || "your learner"}
          note={learner.careNote}
          onChange={(next) => onUpdateLearner({ careNote: next })}
        />
        <RecentReflections state={state} name={learner.name || "your learner"} />
        <WellnessSignals
          state={state}
          subjectStats={subjectStats}
          missedQuestions={learnerMisses}
          questionStatsAvailable={questionStatsAvailable}
        />
        <ReportExport learner={learner} subjectStats={subjectStats} reportSource={reportSource} />
      </div>

      <div className="space-y-4">
        <CapabilityMap learner={learner} onUpdateLearner={onUpdateLearner} />

        {/* Headline snapshot card */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3">Snapshot</div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Accuracy" value={!questionStatsAvailable ? "Unavailable" : accuracy == null ? "Not yet" : `${accuracy}%`} />
            <StatTile label="Quizzes" value={questionStatsAvailable ? String(state.stats.quizzesCompleted) : "Unavailable"} />
            <StatTile label="Streak" value={`${state.streak}d`} />
            <StatTile label="Longest" value={`${state.longestStreak || 0}d`} />
          </div>
        </div>

        {/* Weekly recap — last 7 days of activity */}
        <WeeklyRecap learner={learner} />

        {/* Sample OpinionCard — preserved as a "this is what richer findings will look like" */}
        <OpinionCard
          tone="warm"
          window={questionStatsAvailable ? "Over the whole profile" : `Grade ${learner.grade} curriculum availability`}
          observation={questionStatsAvailable
            ? `${state.stats.totalAnswered} questions answered, ${state.dailyReflections?.length ?? 0} reflections logged.`
            : "No grade-matched quiz bank is available yet, so Vidya is not showing quiz totals."}
          opinion={
            !questionStatsAvailable
              ? "This means the curriculum content is still being prepared. It does not say anything about the learner's progress."
              : state.stats.totalAnswered === 0
              ? "This might mean it's still day one. Give it a week before reading anything into the numbers."
              : "This might mean the kid is in a healthy rhythm. Notice it out loud when you can — kids feel seen when adults reference their work specifically."
          }
        />
      </div>
    </div>
  );
}

function ReportSourceNotice({ source }: { source: ParentReportDecision }) {
  if (source.source === "remote") {
    const updated = source.updatedAt
      ? new Date(source.updatedAt).toLocaleString()
      : "the latest sync";
    return (
      <div
        className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-300">
          Synced progress
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Reporting uses the learner&apos;s validated server sync from {updated}.
        </p>
      </div>
    );
  }

  const isFallback = source.fallbackReason !== "unlinked";
  const detail = source.fallbackReason === "loading"
    ? "Showing progress stored on this device while synced progress loads."
    : source.fallbackReason === "absent"
      ? "No synced progress has been saved yet. Showing progress stored on this device."
      : source.fallbackReason === "unavailable"
        ? "Synced progress is unavailable right now. Showing progress stored on this device."
        : "This profile is not linked. Reporting uses progress stored on this device.";

  return (
    <div
      className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="text-[10px] uppercase tracking-widest font-bold text-amber-300">
        {isFallback ? "Local fallback" : "Local report"}
      </div>
      <p className="mt-1 text-xs text-neutral-400">{detail}</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Markdown report export — for sharing with teachers / paediatricians / self.
// Parent owns the data; we just shape it into a useful document.
// -----------------------------------------------------------------------------

function ReportExport({
  learner, subjectStats, reportSource,
}: {
  learner: LearnerProfile;
  subjectStats: SubjectLearningStat[];
  reportSource: ParentReportDecision;
}) {
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  const report = useMemo(
    () => buildMarkdownReport(learner, subjectStats, reportSource),
    [learner, reportSource, subjectStats],
  );

  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async () => {
    // copyText falls back to execCommand for webviews that block the async
    // Clipboard API, and reports honestly when both routes fail — the old
    // code swallowed the error, so the button just did nothing.
    const ok = await copyText(report);
    if (ok) {
      setCopyFailed(false);
      setCopiedAt(Date.now());
      setTimeout(() => setCopiedAt(null), 2200);
    } else {
      setCopyFailed(true);
    }
  };

  const download = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (learner.name || "learner").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `vidya-${safeName}-${dayKeyOf(new Date())}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Share report</div>
          <div className="text-sm text-neutral-300 mt-0.5">
            One markdown document. Share with a teacher, a paediatrician, or just save it for yourself.
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={copy}
          className="rounded-md px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition"
          style={{
            background: copiedAt ? "rgba(52, 211, 153, 0.2)" : "rgba(167,139,250,0.18)",
            color: copiedAt ? "#86efac" : "#c4b5fd",
            border: `1px solid ${copiedAt ? "rgba(52, 211, 153, 0.4)" : "rgba(167,139,250,0.35)"}`,
          }}
        >
          {copiedAt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedAt ? "Copied" : copyFailed ? "Couldn\u2019t copy \u2014 use Download" : "Copy to clipboard"}
        </button>
        <button
          onClick={download}
          className="rounded-md px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <FileDown className="w-3.5 h-3.5" /> Download .md
        </button>
      </div>
      <details className="mt-3">
        <summary className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 cursor-pointer hover:text-neutral-300">
          Preview
        </summary>
        <pre className="mt-2 text-[11px] text-neutral-400 whitespace-pre-wrap font-mono leading-relaxed bg-neutral-950/60 border border-neutral-800 rounded-md p-3 max-h-80 overflow-auto">
{report}
        </pre>
      </details>
    </div>
  );
}

function buildMarkdownReport(
  learner: LearnerProfile,
  subjectStats: SubjectLearningStat[],
  reportSource: ParentReportDecision,
): string {
  const state = learner.state;
  const questionStatsAvailable = Object.keys(questionsForLearner(learner)).length > 0;
  const accuracy = questionStatsAvailable && state.stats.totalAnswered > 0
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
    : null;
  // Local date: this is stamped on a report a parent reads in their own timezone.
  const today = dayKeyOf(new Date());

  const subjectLines = questionStatsAvailable
    ? subjectStats
        .filter((s) => s.mastery != null && s.attempts > 0)
        .sort((a, b) => (b.mastery ?? 0) - (a.mastery ?? 0))
        .map((s) => `- **${s.name}**: ${s.mastery}% mastery, ${s.attempts} attempts (${s.correct} correct)`)
        .join("\n") || "_No subject attempts yet._"
    : `_Grade ${learner.grade} lesson mastery is unavailable until grade-matched content is ready._`;

  // PRIVACY: reflections the kid marked "Just for me" must never appear here.
  // The kid is shown a lock and told their parent cannot read it; the on-screen
  // parent view honours that, but this report — the one feature built for
  // sharing onward with a teacher or doctor — used to quote every private body
  // verbatim. Filter first, then say how many were withheld so the parent is
  // not misled about completeness.
  const reflections = state.dailyReflections || [];
  const shareable = reflections.filter((r) => !r.private);
  const privateCount = reflections.length - shareable.length;
  const latestReflections =
    (shareable
      .slice()
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
      .slice(0, 5)
      .map((r) => `- _${r.date}_ — "${r.body}"`)
      .join("\n") || "_No reflections yet._") +
    (privateCount > 0
      ? `\n\n_${privateCount} reflection${privateCount === 1 ? "" : "s"} kept private by ${learner.name || "your learner"} and excluded from this report._`
      : "");

  const examLines = (learner.upcomingExams || [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => `- **${e.date}** — ${e.title}`)
    .join("\n") || "_None logged._";

  const missesCount = missedQuestionsForLearner(learner, state.missedQuestions).length;
  const sourceNote = reportSource.source === "remote"
    ? `Numbers use synced learner progress last updated ${new Date(reportSource.updatedAt!).toLocaleString()}.`
    : reportSource.fallbackReason === "loading"
      ? "Synced progress was still loading, so numbers use progress stored on this device."
      : reportSource.fallbackReason === "absent"
        ? "No synced progress was available, so numbers use progress stored on this device."
        : reportSource.fallbackReason === "unavailable"
          ? "Synced progress could not be reached, so numbers use progress stored on this device."
          : "This profile is not linked, so numbers use progress stored on this device.";

  return `# Vidya: ${learner.name || "Learner"} report

_Generated ${today}. ${sourceNote}_

## Profile
- **Grade**: ${learner.grade}
- **Board**: ${learner.board}
- **School**: ${learner.school || "—"}${learner.city ? ` (${learner.city})` : ""}
- **Interests**: ${(learner.interests || []).join(", ") || "—"}

## Snapshot
- **Accuracy**: ${!questionStatsAvailable ? "Unavailable for current curriculum" : accuracy == null ? "Not yet" : `${accuracy}%`}
- **Questions answered**: ${questionStatsAvailable ? state.stats.totalAnswered : "Unavailable for current curriculum"}
- **Quizzes completed**: ${questionStatsAvailable ? state.stats.quizzesCompleted : "Unavailable for current curriculum"}
- **Daily quests completed**: ${questionStatsAvailable ? state.stats.dailyQuestsCompleted : "Unavailable for current curriculum"}
- **Current streak**: ${state.streak} day${state.streak === 1 ? "" : "s"}
- **Longest streak**: ${state.longestStreak || 0} day${state.longestStreak === 1 ? "" : "s"}
- **Wrong-Answer Notebook**: ${questionStatsAvailable
  ? `${missesCount} question${missesCount === 1 ? "" : "s"} awaiting a second try`
  : "Unavailable for current curriculum"}

## Subject mastery
${subjectLines}

## Recent reflections (kid's own words)
${latestReflections}

## Upcoming exams
${examLines}

---

_All findings are observations, not verdicts. Read together with the kid, never at them. Vidya never claims — only opines._
`;
}

// -----------------------------------------------------------------------------
// Setup status — at-a-glance "what's configured for this kid" checklist.
// Read-only here; each row hints where to flip the bit.
// -----------------------------------------------------------------------------

function SetupStatus({ learner }: { learner: LearnerProfile }) {
  const items = [
    {
      label: "Name + grade + board",
      done: !!learner.name?.trim(),
      hint: "Set during onboarding on the kid app.",
    },
    {
      label: "Interests captured",
      done: !!learner.interests && learner.interests.length > 0,
      hint: learner.interests && learner.interests.length > 0
        ? `${learner.interests.length} picked`
        : "Kid can pick in their profile.",
    },
    {
      label: "AI tone preference",
      done: !!learner.aiTone,
      hint: learner.aiTone ? `set to ${learner.aiTone}` : "Kid picks in their profile.",
    },
    {
      // The old label claimed this PIN unlocked the AI tutor at rung 2. It
      // never did after the rebuild — computeRung ignores parentPin entirely
      // and reads verifiedLevel, which only a redeemed claim code sets. Saying
      // otherwise sent parents to set a PIN and wonder why nothing opened.
      label: "Parent PIN (guards the in-app parent room)",
      done: !!learner.parentPin,
      hint: learner.parentPin ? "set" : "Set from the in-kid-app Parent room.",
    },
    {
      label: "Device linked (this is what opens the AI tutor)",
      done: (learner.verifiedLevel ?? 0) >= 2,
      hint: (learner.verifiedLevel ?? 0) >= 2
        ? "linked"
        : "Create a code above and have them type it in.",
    },
    {
      label: "Care note (parent → AI)",
      done: !!learner.careNote?.trim(),
      hint: learner.careNote?.trim() ? "written" : "Write a paragraph above.",
    },
    {
      label: "Family note (parent → kid)",
      done: !!learner.familyNote,
      hint: learner.familyNote?.seenAt
        ? `seen ${prettyRelative(learner.familyNote.seenAt)}`
        : learner.familyNote
          ? "sent, not seen yet"
          : "Send one above.",
    },
    {
      label: "Upcoming exam logged",
      done: (learner.upcomingExams?.length ?? 0) > 0,
      hint: (learner.upcomingExams?.length ?? 0) > 0
        ? `${learner.upcomingExams!.length} on calendar`
        : "Add one from the in-kid-app Parent room.",
    },
  ];
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            Setup status
          </div>
          <div className="text-sm text-neutral-300 mt-0.5">
            {doneCount} of {items.length} configured
          </div>
        </div>
        <div
          className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold"
          style={{
            background: doneCount === items.length ? "rgba(52, 211, 153, 0.15)" : "rgba(167,139,250,0.15)",
            color: doneCount === items.length ? "#86efac" : "#c4b5fd",
          }}
        >
          {doneCount === items.length ? "Complete" : `${Math.round((doneCount / items.length) * 100)}%`}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-start gap-3 text-xs">
            <span
              className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
              style={{
                background: i.done ? "rgba(52, 211, 153, 0.25)" : "rgba(255,255,255,0.06)",
                color: i.done ? "#86efac" : "#71717a",
              }}
            >
              {i.done ? "✓" : "·"}
            </span>
            <div className="flex-1 min-w-0">
              <div className={i.done ? "text-neutral-200" : "text-neutral-400"}>{i.label}</div>
              <div className="text-[11px] text-neutral-600">{i.hint}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prettyRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

// -----------------------------------------------------------------------------
// Weekly recap — derived from state. No DB needed; everything is on-device.
// -----------------------------------------------------------------------------

function WeeklyRecap({ learner }: { learner: LearnerProfile }) {
  const state = learner.state;
  const questionStatsAvailable = Object.keys(questionsForLearner(learner)).length > 0;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const reflectionsWeek = (state.dailyReflections || []).filter((r) => new Date(r.savedAt).getTime() >= sevenDaysAgo);
  const missesWeek = missedQuestionsForLearner(learner, state.missedQuestions)
    .filter((m) => new Date(m.missedAt).getTime() >= sevenDaysAgo);
  const reflectionPrivateCount = reflectionsWeek.filter((r) => r.private).length;

  const hasAny = reflectionsWeek.length + missesWeek.length > 0 || state.streak > 0;

  if (!hasAny) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
        <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2">Last 7 days</div>
        <div className="text-sm italic text-neutral-500">
          Nothing yet this week. Vidya recap fills in once the kid uses any room.
        </div>
      </div>
    );
  }

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
    return {
      // dayKeyOf, not toISOString: `d` is LOCAL midnight, which in IST is
      // 18:30 UTC the previous day — so the UTC form labelled every column
      // with yesterday's date and none of them matched `reflectionDates`,
      // whose keys are written from the local todayKey().
      iso: dayKeyOf(d),
      label: d.toLocaleDateString(undefined, { weekday: "short" })[0],
    };
  });
  const reflectionDates = new Set(reflectionsWeek.map((r) => r.date));

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
      <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3">Last 7 days</div>

      {/* Day-of-week heatmap of reflections */}
      <div className="flex items-end gap-1 mb-3">
        {days.map((d) => {
          const done = reflectionDates.has(d.iso);
          return (
            <div key={d.iso} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full aspect-square rounded-sm transition-all"
                style={{
                  background: done ? "rgba(167,139,250,0.85)" : "rgba(255,255,255,0.05)",
                  boxShadow: done ? "0 0 6px rgba(167,139,250,0.5)" : "none",
                }}
                title={d.iso}
              />
              <div className="text-[8px] uppercase tracking-widest text-neutral-600">{d.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <RecapStat
          label="Reflections"
          value={reflectionsWeek.length}
          sub={reflectionPrivateCount > 0 ? `${reflectionPrivateCount} private` : undefined}
        />
        <RecapStat
          label="New misses"
          value={questionStatsAvailable ? missesWeek.length : "Unavailable"}
        />
        <RecapStat
          label="Current streak"
          value={state.streak}
          sub={`longest ${state.longestStreak || 0}`}
        />
      </div>
    </div>
  );
}

function RecapStat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-neutral-600 mt-0.5">{sub}</div>}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{label}</div>
      <div className="font-display text-2xl font-bold mt-0.5 tracking-tight">{value}</div>
    </div>
  );
}

function boardLabel(board: string): string {
  switch (board) {
    case "cambridge-primary": return "Cambridge Primary";
    case "cambridge-lower-secondary": return "Cambridge Lower Secondary";
    case "cambridge-igcse": return "Cambridge IGCSE";
    case "icse": return "ICSE / CISCE";
    case "cbse": return "CBSE / NCERT";
    default: return board;
  }
}
