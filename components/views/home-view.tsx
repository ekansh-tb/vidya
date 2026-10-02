"use client";

import { createPortal } from "react-dom";
import { useId, useMemo, useState } from "react";
import { BookOpen, Compass, Home, Palette, Footprints, Settings, Users, ArrowRight, Music, Globe, NotebookPen, Wind, Trophy, GraduationCap } from "lucide-react";
import { Mascot } from "@/components/ui/mascot";
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
  const upcoming = (learner.upcomingExams || []).filter((e) => e.date >= new Date().toLocaleDateString("en-CA"))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const mode = learner.grade <= 2 ? "Little discoveries" : learner.grade <= 5 ? "Your discovery trail" : learner.grade <= 8 ? "Your project studio" : "Your learning workspace";
  const tile = (label: string, desc: string, Icon: typeof BookOpen, target: ViewName) => (
    <button key={label} onClick={() => onNavigate(target)} className="buddy-tile">
      <Icon aria-hidden="true" className="w-6 h-6" /><span><strong>{label}</strong><small>{desc}</small></span><ArrowRight aria-hidden="true" className="w-4 h-4 ml-auto" />
    </button>
  );
  return <div className="buddy-home min-h-screen max-w-3xl mx-auto px-5 pt-6 pb-28">
    <header className="flex items-center justify-between gap-3 mb-7">
      <button aria-label={`Open profile for ${name}`} onClick={() => onNavigate("profile")} className="flex items-center gap-3 min-h-11 text-left">
        <Mascot avatarId={state.avatarId} customAvatar={state.customAvatar} size="sm" />
        <span><small className="block text-[var(--text-muted)]">Your place to learn and make</small><strong className="font-display text-xl">Hello, {name}</strong></span>
      </button>
      <div className="flex gap-2">
        <button className="buddy-icon" aria-label="Switch learner" onClick={() => onNavigate("learners")}><Users aria-hidden="true" className="w-5 h-5" /></button>
        <button className="buddy-icon" aria-label="Settings" onClick={() => onNavigate("settings")}><Settings aria-hidden="true" className="w-5 h-5" /></button>
      </div>
    </header>
    <h1 className="font-display text-3xl font-bold mb-2">{tabs.find((t) => t.id === tab)?.label}</h1>
    <p className="text-[var(--text-muted)] mb-6">{mode}. Choose something that makes you curious.</p>
    {tab === "today" && <div className="space-y-5">
      {learner.familyNote && !learner.familyNote.seenAt && <aside className="buddy-panel"><h2 className="font-bold">A note from home</h2><p className="my-2 whitespace-pre-wrap">{learner.familyNote.body}</p><button className="buddy-action" onClick={() => update(learner.id, { familyNote: { ...learner.familyNote!, seenAt: new Date().toISOString() } })}>Got it</button></aside>}
      <section className="buddy-panel buddy-trail"><span aria-hidden="true" className="text-4xl">🪔</span><h2 className="font-display text-xl font-bold mt-3">A little curiosity goes a long way</h2><p className="mt-2 text-[var(--text-muted)]">Welcome back. We can explore, practise, or make something together. You choose.</p></section>
      {recommendation.kind !== "unavailable" ? <NextBestQuestCard recommendation={recommendation} onStart={start} /> : <section className="buddy-panel"><h2 className="font-display text-xl font-bold">Find your next discovery</h2><p className="my-3 text-[var(--text-muted)]">Curriculum practice for this grade is not ready yet. Available books and exploration are clearly marked in Explore.</p><button className="buddy-action" onClick={() => onNavigate("home", { tab: "explore" })}>Explore what is available <ArrowRight aria-hidden="true" className="w-4 h-4" /></button></section>}
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
      <section><h2 className="font-display text-xl font-bold mb-3">Beyond the classroom</h2><p className="text-sm text-[var(--text-muted)] mb-3">General exploration. These activities do not establish curriculum coverage.</p><div className="grid sm:grid-cols-2 gap-3">{tile("Library", "Read or discover a book", BookOpen, "library")}{tile("Field trips", "Explore places and ideas", Globe, "field-trip")}{tile("Assembly", "A thought to start your day", GraduationCap, "assembly")}{hasQuiz && tile("Practice challenge", "Questions from your current grade", Compass, "daily")}</div></section>
    </div>}
    {tab === "create" && <div className="grid sm:grid-cols-2 gap-3">{tile("Music", "Play, record, and save a melody", Music, "music")}{tile("Notebook", "Keep your questions and ideas", NotebookPen, "notebook")}{tile("Wellness", "Make room for a calm break", Wind, "wellness")}</div>}
    {tab === "journey" && <div className="space-y-5"><Reflection state={state} /><section className="buddy-panel"><h2 className="font-display text-xl font-bold">Every visit adds to your story</h2><p className="mt-2 text-[var(--text-muted)]">Your progress stays here when you take a break. Practice counts describe what you tried, not everything you understand.</p><dl className="grid grid-cols-3 gap-3 mt-5"><div><dt>Practice answers</dt><dd className="text-2xl font-bold">{state.stats.totalAnswered}</dd></div><div><dt>Books marked read</dt><dd className="text-2xl font-bold">{state.readBooks.length}</dd></div><div><dt>Places explored</dt><dd className="text-2xl font-bold">{state.passportStamps.length}</dd></div></dl></section><div className="grid sm:grid-cols-2 gap-3">{tile("Your profile", "Appearance, interests, and saved progress", Users, "profile")}{tile("Your collection", "Badges from your learning journey", Trophy, "profile")}{tile("Saved questions", "Return to earlier practice", BookOpen, "review")}{tile("Classroom", "Clearly labeled simulated classmates", GraduationCap, "friends")}</div></div>}
    <LearningNavigation tab={tab} onNavigate={onNavigate} />
  </div>;
}

function Reflection({ state }: { state: GameState }) {
  const id = useId(); const [draft, setDraft] = useState(""); const [privateNote, setPrivate] = useState(false);
  const set = useGameStore((s) => s.set);
  const date = new Date().toLocaleDateString("en-CA");
  const saved = state.dailyReflections?.find((r) => r.date === date);
  return <section className="buddy-panel"><h2 className="font-display text-xl font-bold">A thought to keep</h2>{saved ? <p role="status" className="mt-3">Your reflection is saved for today.</p> : <><label className="block mt-3" htmlFor={id}>What did you learn today?</label><textarea id={id} aria-describedby={`${id}-privacy`} maxLength={200} value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full mt-2 p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)]" /><label className="flex gap-2 min-h-11 items-center"><input type="checkbox" checked={privateNote} onChange={(e) => setPrivate(e.target.checked)} />Keep this reflection private</label><p id={`${id}-privacy`} className="text-sm text-[var(--text-muted)]">{privateNote ? "This reflection will be excluded from parent reports." : "A linked parent can read this reflection in their report."}</p><button className="buddy-action mt-3" disabled={!draft.trim()} onClick={() => set((current) => current.dailyReflections.some((r) => r.date === date) ? current : ({ ...current, dailyReflections: [...current.dailyReflections, { date, body: draft.trim(), savedAt: new Date().toISOString(), private: privateNote || undefined }] }))}>Save reflection</button></>}</section>;
}

function LearningNavigation({ tab, onNavigate }: { tab: HomeTab; onNavigate: (v: ViewName, params?: Record<string, unknown>) => void }) {
  const navigation = <nav aria-label="Learning navigation" className="buddy-nav">{tabs.map((t) => <button key={t.id} aria-current={tab === t.id ? "page" : undefined} onClick={() => onNavigate("home", { tab: t.id })}><t.icon aria-hidden="true" className="w-5 h-5" /><span>{t.label}</span></button>)}</nav>;
  return typeof document === "undefined" ? navigation : createPortal(navigation, document.body);
}
