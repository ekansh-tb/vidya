"use client";

import { createPortal } from "react-dom";
import { useId, useMemo, useState, useRef } from "react";
import { BookOpen, Compass, Home, Palette, Footprints, Settings, Users, ArrowRight, Music, Globe, NotebookPen, Wind, Trophy, GraduationCap } from "lucide-react";
import { LearningCompanion } from "@/components/ui/learning-companion";
import { companionUnlocks } from "@/lib/learning/activity";
import { todayKey } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { ActivityArt } from "@/components/learning/activity-art";
import { useLearningMotion } from "@/components/learning/use-learning-motion";
import { placementLabel, experienceMode } from "@/lib/learning/placement";
import { NextBestQuestCard } from "@/components/learning/next-best-quest-card";
import { subjectsForLearner } from "@/lib/content/subjects";
import { questionsForLearner } from "@/lib/content/questions/availability";
import { hasPack } from "@/lib/content/packs/pack-index";
import { recommendNextQuest } from "@/lib/adaptive/recommendation";
import { useGameStore } from "@/lib/game-store";
import type { GameState, LearnerProfile, ViewName } from "@/lib/types";

export const HOME_TABS = ["today", "explore", "create", "journey"] as const;
export type HomeTab = typeof HOME_TABS[number];
const tabs = [
  { id: "today", label: "Today", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "create", label: "Create", icon: Palette },
  { id: "journey", label: "My Journey", icon: Footprints },
] as const;

export function HomeView({ state, learner, onNavigate, tab = "today" }: {
  state: GameState; learner: LearnerProfile; tab?: HomeTab;
  onNavigate: (v: ViewName, params?: Record<string, unknown>) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const calm = !!reduced || state.settings.motion === false;
  useLearningMotion(root, calm, tab);
  const update = useGameStore((s) => s.updateLearnerMeta);
  const subjects = subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade);
  const banks = questionsForLearner(learner);
  const recommendation = useMemo(() => recommendNextQuest({ learner, progress: state.progress,
    missedQuestions: state.missedQuestions, rotationIndex: state.stats.quizzesCompleted, now: Date.now() }),
    [learner, state.progress, state.missedQuestions, state.stats.quizzesCompleted]);
  const start = () => {
    if (recommendation.kind === "due-review") onNavigate("review");
    if (recommendation.kind === "study-pack") onNavigate("exam-prep", { subjectId: recommendation.subjectId });
    if (recommendation.kind === "topic") onNavigate("quiz", { subjectId: recommendation.subjectId, topicId: recommendation.topicId });
  };
  const name = state.name.split(" ")[0] || "friend";
  const last = subjects.find((s) => s.id === state.lastSubjectId);
  const hasQuiz = subjects.some((s) => Object.keys(banks[s.id] || {}).length > 0);
  const upcoming = (learner.upcomingExams || []).filter((e) => e.date >= todayKey())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const mode = (learner.grade ?? 1) <= 2 ? "Little discoveries" : (learner.grade ?? 1) <= 5 ? "Your discovery trail" : (learner.grade ?? 1) <= 8 ? "Your project studio" : "Your learning workspace";
  const tile = (label: string, desc: string, Icon: typeof BookOpen, target: ViewName, params?: Record<string, unknown>) => (
    <button key={label} onClick={() => onNavigate(target, params)} className="buddy-tile">
      <span className={"buddy-tile-art tile-" + target}><Icon aria-hidden="true" className="w-6 h-6" /></span><span><strong>{label}</strong><small>{desc}</small></span><ArrowRight aria-hidden="true" className="w-4 h-4 ml-auto" />
    </button>
  );
  return <div ref={root} data-calm={calm} className={"buddy-home kids-world mode-" + experienceMode(learner)}>
    <header className="kids-header">
      <button className="kids-brand" aria-label={"Open profile for " + name} onClick={() => onNavigate("profile")}><span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span><strong>vidya</strong><span className="kids-level">{placementLabel(learner)}</span></button>
      <div className="kids-header-actions">
        <button className="kids-icon" aria-label="Switch learner" onClick={() => onNavigate("learners")}><Users aria-hidden="true" /></button>
        <button className="kids-icon" aria-label="Settings" onClick={() => onNavigate("settings")}><Settings aria-hidden="true" /></button>
      </div>
    </header>
    <div className="kids-heading"><div><p className="learning-eyebrow">Hello, {name}</p><h1>{tab === "today" ? ((learner.grade ?? 1) <= 5 ? "Where will we go today?" : "Your next step") : tabs.find(item => item.id === tab)?.label}</h1><p className="kids-subtitle">{mode}</p></div></div>
    {tab === "today" && <div className="space-y-5">
      {learner.familyNote && !learner.familyNote.seenAt && <aside className="buddy-panel"><h2 className="font-bold">A note from home</h2><p className="my-2 whitespace-pre-wrap">{learner.familyNote.body}</p><button className="buddy-action" onClick={() => update(learner.id, { familyNote: { ...learner.familyNote!, seenAt: new Date().toISOString() } })}>Got it</button></aside>}
      {recommendation.kind !== "unavailable" ? <NextBestQuestCard recommendation={recommendation} onStart={start} appearance="light" /> : <section className="kids-adventure domain-language"><div className="kids-adventure-copy"><span className="kids-tag">Choose your own next step</span><h2>Find a book to get lost in</h2><p>Curriculum practice for this grade is not ready yet. Browse the library or choose available exploration.</p><button className="buddy-action" onClick={() => onNavigate("library")}>Open the library <ArrowRight aria-hidden="true" className="w-4 h-4" /></button></div><div className="kids-adventure-art" data-activity-art><ActivityArt domain="language" /></div></section>}
      {state.activities?.draft && <button className="buddy-action" onClick={() => onNavigate("activities")}>Resume your saved activity</button>}
      {last && <button className="buddy-tile w-full" onClick={() => onNavigate("subject", { subjectId: last.id })}><BookOpen aria-hidden="true" className="w-6 h-6" /><span><strong>Continue {last.name}</strong><small>Return to your last classroom</small></span><ArrowRight aria-hidden="true" className="w-4 h-4 ml-auto" /></button>}
      <div className="grid sm:grid-cols-2 gap-3">{tile("Make something", "Draw ideas, write, or try a melody", Palette, "music")}{tile("Take a break", "A calm moment or a little movement", Wind, "wellness")}</div>
      {upcoming && <aside className="buddy-panel"><h2 className="font-bold">Your upcoming plan</h2><p>{upcoming.title} · {upcoming.date}</p><button className="buddy-action mt-3" onClick={() => onNavigate(upcoming.subjectId ? "exam-prep" : "settings", upcoming.subjectId ? { subjectId: upcoming.subjectId } : undefined)}>Open your plan</button></aside>}
    </div>}
    {tab === "explore" && <div className="space-y-5">
      <section><h2 className="font-display text-xl font-bold mb-3">Your classrooms</h2><div className="grid sm:grid-cols-2 gap-3">{subjects.map((s) => {
        const supported = hasPack(s.id, learner.grade) || Object.keys(banks[s.id] || {}).length > 0;
        const attempts = Object.values(state.progress[s.id] || {}).reduce((sum, p) => sum + p.attempts, 0);
        return <button key={s.id} className="buddy-tile" onClick={() => onNavigate("subject", { subjectId: s.id })} aria-label={`Open ${s.name}`}><s.icon aria-hidden="true" className="w-6 h-6" /><span><strong>{s.name}</strong><small>{supported ? `${attempts} recorded practice attempts` : "Curriculum content not ready yet"}</small></span></button>;
      })}</div></section>
      <section><h2 className="font-display text-xl font-bold mb-3">Beyond the classroom</h2><p className="text-sm text-[var(--text-muted)] mb-3">General exploration. These activities do not establish curriculum coverage.</p><div className="grid sm:grid-cols-2 gap-3">{tile("Learning adventures", "Reviewed general exploration for your grade", Compass, "activities")}{tile("Library", "Read or discover a book", BookOpen, "library")}{tile("Field trips", "Explore places and ideas", Globe, "field-trip")}{tile("Assembly", "A thought to start your day", GraduationCap, "assembly")}{hasQuiz && tile("Practice challenge", "Questions from your current grade", Compass, "daily")}</div></section>
    </div>}
    {tab === "create" && <div className="grid sm:grid-cols-2 gap-3">{tile("Make a creation", "A picture, a design, or a project", Palette, "activities", { tab: "make" })}{tile("Music", "Play, record, and save a melody", Music, "music")}{tile("Notebook", "Keep your questions and ideas", NotebookPen, "notebook")}{tile("Wellness", "Make room for a calm break", Wind, "wellness")}</div>}
    {tab === "journey" && <div className="space-y-5"><LearningCompanion compact decorations={companionUnlocks(state.activities ?? { completions: [] })} line="Your discoveries stay here. Taking a break loses nothing."/><Reflection state={state} /><section className="buddy-panel"><h2 className="font-display text-xl font-bold">Every visit adds to your story</h2><p className="mt-2 text-[var(--text-muted)]">Your progress stays here when you take a break. Practice counts describe what you tried, not everything you understand.</p><dl className="grid grid-cols-3 gap-3 mt-5"><div><dt>Practice answers</dt><dd className="text-2xl font-bold">{state.stats.totalAnswered}</dd></div><div><dt>Books marked read</dt><dd className="text-2xl font-bold">{state.readBooks.length}</dd></div><div><dt>Places explored</dt><dd className="text-2xl font-bold">{state.passportStamps.length}</dd></div></dl></section><div className="grid sm:grid-cols-2 gap-3">{tile("Your profile", "Appearance, interests, and saved progress", Users, "profile")}{tile("Your collection", "Badges from your learning journey", Trophy, "profile")}{tile("Saved questions", "Return to earlier practice", BookOpen, "review")}{tile("Classroom", "Clearly labeled simulated classmates", GraduationCap, "friends")}</div></div>}
    <LearningNavigation tab={tab} onNavigate={onNavigate} calm={calm} />
  </div>;
}

function Reflection({ state }: { state: GameState }) {
  const id = useId(); const [draft, setDraft] = useState(""); const [privateNote, setPrivate] = useState(false);
  const set = useGameStore((s) => s.set);
  const date = todayKey();
  const saved = state.dailyReflections?.find((r) => r.date === date);
  return <section className="buddy-panel"><h2 className="font-display text-xl font-bold">A thought to keep</h2>{saved ? <p role="status" className="mt-3">Your reflection is saved for today.</p> : <><label className="block mt-3" htmlFor={id}>What did you learn today?</label><textarea id={id} aria-describedby={`${id}-privacy`} maxLength={200} value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full mt-2 p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)]" /><label className="flex gap-2 min-h-11 items-center"><input type="checkbox" checked={privateNote} onChange={(e) => setPrivate(e.target.checked)} />Keep this reflection private</label><p id={`${id}-privacy`} className="text-sm text-[var(--text-muted)]">{privateNote ? "This reflection will be excluded from parent reports." : "A linked parent can read this reflection in their report."}</p><button className="buddy-action mt-3" disabled={!draft.trim()} onClick={() => set((current) => current.dailyReflections.some((r) => r.date === date) ? current : ({ ...current, dailyReflections: [...current.dailyReflections, { date, body: draft.trim(), savedAt: new Date().toISOString(), private: privateNote || undefined }] }))}>Save reflection</button></>}</section>;
}

function LearningNavigation({ tab, onNavigate, calm }: { tab: HomeTab; onNavigate: (v: ViewName, params?: Record<string, unknown>) => void; calm: boolean }) {
  const navigation = <nav aria-label="Learning navigation" className="kids-nav" data-calm={calm}>{tabs.map((t) => <button key={t.id} aria-current={tab === t.id ? "page" : undefined} onClick={() => onNavigate("home", { tab: t.id })}><t.icon aria-hidden="true" className="w-5 h-5" /><span>{t.label}</span></button>)}</nav>;
  return typeof document === "undefined" ? navigation : createPortal(navigation, document.body);
}
