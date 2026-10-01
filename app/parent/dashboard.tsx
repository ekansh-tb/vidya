"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Check, Copy, FileDown } from "lucide-react";
import { CosmicBg } from "@/components/effects/cosmic-bg";
import { OpinionCard } from "@/components/parent/opinion-card";
import { CAPABILITY_POLICIES } from "@/lib/capabilities/policies";
import { copyText } from "@/lib/clipboard";
import { dayKeyOf } from "@/lib/utils";
import { LearnerLinkPanel } from "@/components/parent/learner-link-panel";
import { DevicePanel } from "@/components/parent/device-panel";
import { UsagePanel } from "@/components/parent/usage-panel";
import { SafetyPanel } from "@/components/parent/safety-panel";
import { AiConnectionsPanel } from "@/components/parent/ai-connections-panel";
import { AiTutorControlsPanel } from "@/components/parent/ai-tutor-controls-panel";
import { LearnerAiTutorAccessPanel } from "@/components/parent/learner-ai-tutor-access-panel";
import { FamilyAiPausePanel } from "@/components/parent/family-ai-pause-panel";
import { ParentAccountLinkPanel } from "./parent-account-link-panel";
import { loadOwnedRoster, loadOwnedReport, visibleRoster, type RosterSnapshot, type OwnedReport, type OwnedLearner, type RemoteParentReport } from "@/lib/parent/owned-roster";
import { subjectsForLearner } from "@/lib/content/subjects";
import { missedQuestionsForLearner, questionsForLearner } from "@/lib/content/questions/availability";
import type { LearnerProfile } from "@/lib/types";
import {
  RecentReflections,
  WellnessSignals,
  type SubjectLearningStat,
} from "@/components/views/parent-view";

/**
 * Parent Clerk dashboard.
 *
 * The server-owned family roster is the only source of learner identities.
 * No shared-device profiles, reports or credentials enter this dashboard.
 */
export function ParentDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <main className="p-8" role="status">Loading your parent account...</main>;
  if (!isSignedIn || !user) return <main className="p-8"><Link href="/sign-in?next=/parent">Sign in to continue</Link></main>;
  // Remount every stateful control when Clerk switches accounts.
  return <OwnedParentDashboard key={user.id} parentId={user.id} displayName={user.firstName || user.username || "Parent"} email={user.primaryEmailAddress?.emailAddress ?? ""} />;
}

function OwnedParentDashboard({ parentId, displayName, email }: { parentId: string; displayName: string; email: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiPolicyRevision, setAiPolicyRevision] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [roster, setRoster] = useState<RosterSnapshot>({ parentId, generation: -1, result: { status: "loading", learners: [] } });
  const learners = visibleRoster(roster, parentId, generation);
  const ready = roster.parentId === parentId && roster.generation === generation && roster.result.status === "ready";
  const selected = learners.find((learner) => learner.id === selectedId) ?? learners[0] ?? null;
  const activeParentId = parentId;

  useEffect(() => {
    const controller = new AbortController();
    void loadOwnedRoster(parentId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setRoster({ parentId, generation, result });
    });
    return () => controller.abort();
  }, [parentId, generation]);

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
            {learners.length} learner{learners.length === 1 ? "" : "s"} in your account
          </div>
        </div>

        <button type="button" onClick={() => setGeneration((value) => value + 1)} className="min-h-11 rounded border border-neutral-700 px-4 text-sm">Reload family roster</button>
        {!ready && <div role="status" className="rounded-lg border border-neutral-800 p-5">
          {roster.generation !== generation || roster.result.status === "loading"
            ? "Loading your family roster..."
            : roster.result.status === "denied"
              ? <span>Parent access is required. <Link href="/parent/enroll" className="underline">Return to parent entry</Link>.</span>
              : "Your family roster is unavailable. Reload to try again. No device-local profiles are shown."}
        </div>}
        {ready && <>
        <AiConnectionsPanel
          key={`ai-connections-${activeParentId}`}
          onConnectionsChanged={() => setAiPolicyRevision((revision) => revision + 1)}
        />
        <AiTutorControlsPanel
          key={`ai-tutors-${activeParentId}`}
          refreshToken={aiPolicyRevision}
          onProfilesChanged={() => setAiPolicyRevision((revision) => revision + 1)}
        />
        <FamilyAiPausePanel
          key={`family-ai-pause-${activeParentId}`}
          onPaused={() => setAiPolicyRevision((revision) => revision + 1)}
        />
        {learners.length === 0 && (
          <div className="rounded-lg border border-violet-900/50 bg-violet-950/20 px-6 py-8 text-center">
            <h2 className="font-display text-xl font-bold mb-2">No learners in your account yet</h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
              Create a learner below, then use their device-link code to connect their learning app. Profiles stored on this browser are not automatically added to your family.
            </p>
          </div>
        )}
        <CreateOwnedLearner onCreated={() => setGeneration((value) => value + 1)} />

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
                  // `currentLearnerId` - so a parent glancing at one child's
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

        {selected && <OwnedLearnerControls key={`${parentId}:${generation}:${selected.id}`} learner={selected} aiPolicyRevision={aiPolicyRevision} />}
        </>}

        <footer className="text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-900 pt-6 mt-8">
          VIDYA is built so that AI and humans can take care of each other.
          You teach the AI how to teach your kid; the AI helps your kid
          flourish; we both observe quietly. Nothing here is ever a claim -
          only an opinion you can verify, override, or discard.
        </footer>
      </section>
    </main>
  );
}

function OwnedLearnerControls({ learner, aiPolicyRevision }: { learner: OwnedLearner; aiPolicyRevision: number }) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ attempt: number; result: OwnedReport }>({ attempt: -1, result: { status: "loading" } });
  const result: OwnedReport = loaded.attempt === attempt ? loaded.result : { status: "loading" };
  useEffect(() => {
    const controller = new AbortController();
    void loadOwnedReport(learner.remoteId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setLoaded({ attempt, result });
    });
    return () => controller.abort();
  }, [learner.remoteId, attempt]);
  if (result.status === "denied") return <div role="alert">Access to this learner is unavailable. Reload the family roster to check current access.</div>;
  return <div className="space-y-6">
    <h2 className="font-display text-2xl font-bold">{learner.name} · Grade {learner.grade}</h2>
    <SafetyPanel learner={learner} />
    <LearnerAiTutorAccessPanel learner={learner} refreshToken={aiPolicyRevision} />
    <ParentAccountLinkPanel key={`account:${learner.remoteId}`} learnerId={learner.remoteId} />
    <LearnerLinkPanel learner={learner} />
    <DevicePanel learner={learner} />
    <UsagePanel learner={learner} />
    <OwnedCapabilityControls learner={learner} />
    <p className="text-sm text-neutral-400">Device-local family notes, syllabus uploads and profile preferences are not loaded or edited here.</p>
    <button type="button" onClick={() => setAttempt((value) => value + 1)} className="min-h-11 rounded border border-neutral-700 px-4 text-sm">Reload synced report</button>
    {result.status === "ready"
      ? <SelectedLearnerView learner={{ ...learner, state: result.report.state }} reportSource={result.report} />
      : <p role="status" className="rounded border border-neutral-800 p-4 text-sm">{result.status === "loading"
        ? "Loading synced progress..."
        : result.status === "absent"
          ? "No synced progress yet. Learner controls are available above."
          : "Synced progress is unavailable. Retry when connected. No local report is substituted."}</p>}
  </div>;
}

function OwnedCapabilityControls({ learner }: { learner: OwnedLearner }) {
  const [disabled, setDisabled] = useState(learner.disabledCapabilities ?? []);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function toggle(key: string) {
    setBusy(true); setNotice("");
    const next = disabled.includes(key) ? disabled.filter((value) => value !== key) : [...disabled, key];
    try {
      const response = await fetch(`/api/parent/learners/${learner.remoteId}/capabilities`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ disabled: next }),
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.disabled) || !data.disabled.every((value: unknown) => typeof value === "string")) throw new Error("Rejected");
      setDisabled(data.disabled); setNotice("Saved to this learner's account.");
    } catch { setNotice("Could not confirm the change. Reload the family roster before trying again."); }
    finally { setBusy(false); }
  }
  const labels: Record<string, string> = {
    "ai.tutor.limited": "Limited AI tutor", "ai.tutor.full": "Full AI tutor",
    "share.crossNetwork": "Sharing", "byok.openai": "OpenAI account", "byok.anthropic": "Anthropic account",
    "byok.google": "Google AI account", "byok.grok": "Grok account", "byok.openrouter": "OpenRouter account",
    "incognito.enabled": "Incognito mode", "health.profile": "Health profile", "exam.alertsToParent": "Exam-day alerts",
  };
  return <section className="rounded-lg border border-neutral-800 p-5">
    <h3 className="font-bold">Learner capabilities</h3>
    <p className="mt-1 text-sm text-neutral-400">Allowing a capability does not bypass its verification requirements.</p>
    <ul className="mt-3 space-y-2">{Object.entries(CAPABILITY_POLICIES).map(([key, policy]) => <li key={key} className="flex items-center justify-between gap-3 text-sm">
      <span>{labels[key] ?? key}{(learner.verifiedLevel ?? 0) < policy.minRung ? " (verification required)" : ""}</span>
      <button type="button" disabled={busy} aria-pressed={!disabled.includes(key)} onClick={() => void toggle(key)} className="min-h-11 rounded border border-neutral-700 px-3 disabled:opacity-50">{disabled.includes(key) ? "Off" : "Allowed"}</button>
    </li>)}</ul>
    <p role="status" className="mt-2 text-sm">{notice}</p>
  </section>;
}

function CreateOwnedLearner({ onCreated }: { onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <details className="rounded-lg border border-neutral-800 p-5">
    <summary className="cursor-pointer font-bold">Add a learner to your account</summary>
    <form className="mt-4 space-y-3" onSubmit={async (event) => {
      event.preventDefault();
      const fields = new FormData(event.currentTarget);
      setBusy(true); setError("");
      try {
        const response = await fetch("/api/parent/learners", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: fields.get("name"), grade: Number(fields.get("grade")), board: fields.get("board") }) });
        if (!response.ok) throw new Error("Rejected");
        // Reload the owned roster instead of trusting a create response as access.
        onCreated();
      } catch { setError("Could not confirm learner creation. Reload your family roster before trying again."); }
      finally { setBusy(false); }
    }}>
      <label className="block text-sm">Learner name<input name="name" required maxLength={80} disabled={busy} className="ml-3 rounded border border-neutral-700 bg-neutral-950 p-2" /></label>
      <label className="block text-sm">Grade<input name="grade" type="number" min={1} max={13} required disabled={busy} className="ml-3 w-20 rounded border border-neutral-700 bg-neutral-950 p-2" /></label>
      <label className="block text-sm">Board<select name="board" required defaultValue="" disabled={busy} className="ml-3 rounded border border-neutral-700 bg-neutral-950 p-2">
        <option value="" disabled>Select a board</option>
        {["cambridge-primary", "cambridge-lower-secondary", "cambridge-igcse", "icse", "cbse"].map((board) => <option key={board} value={board}>{boardLabel(board)}</option>)}
      </select></label>
      <button type="submit" disabled={busy} className="min-h-11 rounded bg-violet-600 px-4 disabled:opacity-50">{busy ? "Creating..." : "Create learner"}</button>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </form>
  </details>;
}

function SelectedLearnerView({
  learner, reportSource,
}: {
  learner: LearnerProfile;
  reportSource: RemoteParentReport;
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

      {/* Two-column body: communications + insights */}
      <div className="md:col-span-2 space-y-4">
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

        {/* Weekly recap - last 7 days of activity */}
        <WeeklyRecap learner={learner} />

        {/* Sample OpinionCard - preserved as a "this is what richer findings will look like" */}
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
              : "This might mean the kid is in a healthy rhythm. Notice it out loud when you can - kids feel seen when adults reference their work specifically."
          }
        />
      </div>
    </div>
  );
}

function ReportSourceNotice({ source }: { source: RemoteParentReport }) {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-3" role="status" aria-live="polite">
      <div className="text-xs font-bold text-emerald-300">Synced progress</div>
      <p className="mt-1 text-xs text-neutral-400">Reporting uses the learner&apos;s validated server sync from {source.updatedAt ? new Date(source.updatedAt).toLocaleString() : "the latest sync"}.</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Markdown report export - for sharing with teachers / paediatricians / self.
// Parent owns the data; we just shape it into a useful document.
// -----------------------------------------------------------------------------

function ReportExport({
  learner, subjectStats, reportSource,
}: {
  learner: LearnerProfile;
  subjectStats: SubjectLearningStat[];
  reportSource: RemoteParentReport;
}) {
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  const report = useMemo(
    () => buildMarkdownReport(learner, subjectStats, reportSource),
    [learner, reportSource, subjectStats],
  );

  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async () => {
    // copyText falls back to execCommand for webviews that block the async
    // Clipboard API, and reports honestly when both routes fail - the old
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
          {copiedAt ? "Copied" : copyFailed ? "Couldn\u2019t copy : use Download" : "Copy to clipboard"}
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
  reportSource: RemoteParentReport,
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
  // parent view honours that, but this report - the one feature built for
  // sharing onward with a teacher or doctor - used to quote every private body
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
      .map((r) => `- _${r.date}_ - "${r.body}"`)
      .join("\n") || "_No reflections yet._") +
    (privateCount > 0
      ? `\n\n_${privateCount} reflection${privateCount === 1 ? "" : "s"} kept private by ${learner.name || "your learner"} and excluded from this report._`
      : "");

  const examLines = (learner.upcomingExams || [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => `- **${e.date}** - ${e.title}`)
    .join("\n") || "_None logged._";

  const missesCount = missedQuestionsForLearner(learner, state.missedQuestions).length;
  const sourceNote = `Numbers use synced learner progress last updated ${new Date(reportSource.updatedAt!).toLocaleString()}.`;

  return `# Vidya: ${learner.name || "Learner"} report

_Generated ${today}. ${sourceNote}_

## Profile
- **Grade**: ${learner.grade}
- **Board**: ${learner.board}
- **School**: ${learner.school || "-"}${learner.city ? ` (${learner.city})` : ""}
- **Interests**: ${(learner.interests || []).join(", ") || "-"}

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

_All findings are observations, not verdicts. Read together with the kid, never at them. Vidya never claims - only opines._
`;
}

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
      // 18:30 UTC the previous day - so the UTC form labelled every column
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
