"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Check, Copy, FileDown } from "lucide-react";
import { CosmicBg } from "@/components/effects/cosmic-bg";
import { OpinionCard } from "@/components/parent/opinion-card";
import { useGameStore } from "@/lib/game-store";
import { subjectsForLearner } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import type { LearnerProfile } from "@/lib/types";
import {
  RecentReflections,
  WellnessSignals,
  CapabilityMap,
  FamilyNoteComposer,
  CareNoteComposer,
} from "@/components/views/parent-view";

/**
 * Parent Clerk dashboard.
 *
 * Same-device contract: a parent signing into /parent on the same browser
 * the kid uses sees that kid's localStorage learners. Cross-device sync
 * is a future commit (needs a DB).
 *
 * The dashboard mirrors the in-kid-app parent room (parent-view.tsx) but
 * with no PIN gate (Clerk auth IS the gate), a learner picker, and a
 * desktop-friendly layout.
 */
export function ParentDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { profiles, hydrated, hydrate, updateLearnerMeta, switchLearner } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  const learners = useMemo(() => Object.values(profiles.learners), [profiles.learners]);
  const selected = useMemo(
    () => (selectedId && profiles.learners[selectedId]) || learners[0] || null,
    [selectedId, profiles.learners, learners],
  );

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

        {/* Empty state — no learners yet */}
        {learners.length === 0 && (
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
                  onClick={() => { setSelectedId(l.id); switchLearner(l.id); }}
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
          <SelectedLearnerView
            key={selected.id}
            learner={selected}
            onUpdateLearner={(patch) => updateLearnerMeta(selected.id, patch)}
          />
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
  learner, onUpdateLearner,
}: {
  learner: ReturnType<typeof useGameStore.getState>["profiles"]["learners"][string];
  onUpdateLearner: (patch: Parameters<ReturnType<typeof useGameStore.getState>["updateLearnerMeta"]>[1]) => void;
}) {
  const state = learner.state;
  const accuracy = state.stats.totalAnswered > 0
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
    : null;

  const learnerSubjects = subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade);
  const subjectStats = useMemo(
    () => learnerSubjects.map((s) => {
      const topics = Object.keys(QUESTIONS[s.id] || {});
      let attempts = 0, correct = 0, masterySum = 0;
      topics.forEach((t) => {
        const p = state.progress?.[s.id]?.[t];
        if (p) { attempts += p.attempts || 0; correct += p.correct || 0; masterySum += p.mastery || 0; }
      });
      return { ...s, attempts, correct, mastery: topics.length ? Math.round(masterySum / topics.length) : 0 };
    }),
    [learnerSubjects, state.progress],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <WellnessSignals state={state} subjectStats={subjectStats} />
        <ReportExport learner={learner} subjectStats={subjectStats} />
      </div>

      <div className="space-y-4">
        <CapabilityMap learner={learner} onUpdateLearner={onUpdateLearner} />

        {/* Headline snapshot card */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3">Snapshot</div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Accuracy" value={accuracy == null ? "—" : `${accuracy}%`} />
            <StatTile label="Quizzes" value={String(state.stats.quizzesCompleted)} />
            <StatTile label="Streak" value={`${state.streak}d`} />
            <StatTile label="Longest" value={`${state.longestStreak || 0}d`} />
          </div>
        </div>

        {/* Weekly recap — last 7 days of activity */}
        <WeeklyRecap learner={learner} />

        {/* Sample OpinionCard — preserved as a "this is what richer findings will look like" */}
        <OpinionCard
          tone="warm"
          window="Over the whole profile"
          observation={`${state.stats.totalAnswered} questions answered, ${state.dailyReflections?.length ?? 0} reflections logged.`}
          opinion={
            state.stats.totalAnswered === 0
              ? "This might mean it's still day one. Give it a week before reading anything into the numbers."
              : "This might mean the kid is in a healthy rhythm. Notice it out loud when you can — kids feel seen when adults reference their work specifically."
          }
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Markdown report export — for sharing with teachers / paediatricians / self.
// Parent owns the data; we just shape it into a useful document.
// -----------------------------------------------------------------------------

function ReportExport({
  learner, subjectStats,
}: {
  learner: LearnerProfile;
  subjectStats: { id: string; name: string; attempts: number; correct: number; mastery: number }[];
}) {
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  const report = useMemo(() => buildMarkdownReport(learner, subjectStats), [learner, subjectStats]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopiedAt(Date.now());
      setTimeout(() => setCopiedAt(null), 2200);
    } catch {
      // Fallback: open a textarea in a new window? For now, silently no-op.
    }
  };

  const download = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (learner.name || "learner").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `vidya-${safeName}-${new Date().toISOString().slice(0, 10)}.md`;
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
          {copiedAt ? "Copied" : "Copy to clipboard"}
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
  subjectStats: { name: string; attempts: number; correct: number; mastery: number }[],
): string {
  const state = learner.state;
  const accuracy = state.stats.totalAnswered > 0
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
    : null;
  const today = new Date().toISOString().slice(0, 10);

  const subjectLines = subjectStats
    .filter((s) => s.attempts > 0)
    .sort((a, b) => b.mastery - a.mastery)
    .map((s) => `- **${s.name}** — ${s.mastery}% mastery, ${s.attempts} attempts (${s.correct} correct)`)
    .join("\n") || "_No subject attempts yet._";

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

  const missesCount = state.missedQuestions?.length ?? 0;

  return `# Vidya — ${learner.name || "Learner"} report

_Generated ${today} on the family device. Numbers come from local sessions only._

## Profile
- **Grade**: ${learner.grade}
- **Board**: ${learner.board}
- **School**: ${learner.school || "—"}${learner.city ? ` (${learner.city})` : ""}
- **Interests**: ${(learner.interests || []).join(", ") || "—"}

## Snapshot
- **Accuracy**: ${accuracy == null ? "—" : `${accuracy}%`}
- **Questions answered**: ${state.stats.totalAnswered}
- **Quizzes completed**: ${state.stats.quizzesCompleted}
- **Daily quests completed**: ${state.stats.dailyQuestsCompleted}
- **Current streak**: ${state.streak} day${state.streak === 1 ? "" : "s"}
- **Longest streak**: ${state.longestStreak || 0} day${state.longestStreak === 1 ? "" : "s"}
- **Wrong-Answer Notebook**: ${missesCount} question${missesCount === 1 ? "" : "s"} awaiting a second try

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
      label: "Parent PIN (unlocks AI tutor at rung 2)",
      done: !!learner.parentPin,
      hint: learner.parentPin ? "set" : "Set from the in-kid-app Parent room.",
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
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const reflectionsWeek = (state.dailyReflections || []).filter((r) => new Date(r.savedAt).getTime() >= sevenDaysAgo);
  const missesWeek = (state.missedQuestions || []).filter((m) => new Date(m.missedAt).getTime() >= sevenDaysAgo);
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
      iso: d.toISOString().slice(0, 10),
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
          value={missesWeek.length}
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

function RecapStat({ label, value, sub }: { label: string; value: number; sub?: string }) {
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
