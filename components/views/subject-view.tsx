"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, NotebookPen, MessageCircle, BookOpen } from "lucide-react";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { questionsForLearner } from "@/lib/content/questions/availability";
import { usePack } from "@/lib/content/packs/use-pack";
import type { GameState, LearnerProfile, ViewName, SubjectId } from "@/lib/types";
import { sfx } from "@/lib/audio";
import { vidya } from "@/lib/speech";
import { useCapability } from "@/lib/capabilities/use-capability";
import { useGameStore } from "@/lib/game-store";

export function SubjectView({ subjectId, state, learner, onNavigate, onBack, voiceEnabled }: {
  subjectId: SubjectId; state: GameState; learner: LearnerProfile;
  onNavigate: (view: ViewName, params?: Record<string, unknown>) => void;
  onBack: () => void; voiceEnabled: boolean;
}) {
  const subject = SUBJECT_MAP[subjectId];
  const quizTopics = Object.entries(questionsForLearner(learner)[subjectId] || {});
  const { exists: hasStudyPack, pack, error, retry } = usePack(subjectId, learner.grade, {
    school: learner.school, board: learner.board, uploaded: learner.schoolSyllabus,
  });
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;
  const set = useGameStore(store => store.set);
  const Icon = subject.icon;
  useEffect(() => {
    set(current => ({ ...current, lastSubjectId: subjectId, lastSubjectAt: new Date().toISOString() }));
  }, [subjectId, set]);
  useEffect(() => {
    if (!voiceEnabled) return;
    const timer = setTimeout(() => vidya.subjectIntro(subject.name), 200);
    return () => clearTimeout(timer);
  }, [subjectId, voiceEnabled, subject.name]);

  function openTopic(topicId: string) {
    sfx.click();
    onNavigate("exam-prep", { subjectId, topicId });
  }
  const topicButtons = (topics: NonNullable<typeof pack>["topics"]) => topics.map(topic =>
    <button type="button" key={topic.id} onClick={() => openTopic(topic.id)} className="learning-panel flex min-h-14 w-full items-center gap-3 text-left focus-visible:outline focus-visible:outline-2">
      <span className="flex-1 font-semibold">{topic.title}</span><ChevronRight size={18} aria-hidden="true"/>
    </button>);
  const practiceButtons = (topics: typeof quizTopics) => topics.map(([id, topic]) =>
    <button type="button" key={id} onClick={() => { sfx.click(); onNavigate("quiz", { subjectId, topicId: id }); }} className="learning-panel flex min-h-14 w-full items-center gap-3 text-left focus-visible:outline focus-visible:outline-2">
      <span className="text-2xl" aria-hidden="true">{topic.icon}</span><span className="flex-1 font-semibold">{topic.title}</span><ChevronRight size={18} aria-hidden="true"/>
    </button>);
  const firstPractice = quizTopics[0];
  const firstChapter = pack?.topics[0];

  return <main className="mx-auto min-h-screen max-w-3xl px-5 pb-24 pt-6">
    <button type="button" onClick={onBack} className="mb-5 flex min-h-11 items-center gap-1 text-[var(--text-muted)]"><ChevronLeft aria-hidden="true" size={20}/>Back to learning</button>
    <header className="mb-6 flex items-center gap-4">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon aria-hidden="true" size={28}/></span>
      <div className="min-w-0"><p className="learning-eyebrow">Your subject space · Grade {learner.grade}</p><h1 className={`break-words font-display text-3xl font-bold ${subject.isDeva ? "font-deva" : ""}`}>{subject.name}</h1></div>
    </header>
    {firstPractice ? <section className="learning-panel mb-6" aria-labelledby="subject-start-title">
      <p className="learning-eyebrow">Start with one idea</p><h2 id="subject-start-title" className="mt-2 text-xl font-bold">{firstPractice[1].title}</h2>
      <p className="learning-caption mt-2">Try a question. Hints and retries are here whenever you need them.</p>
      <button type="button" className="learning-primary mt-4" onClick={() => onNavigate("quiz", { subjectId, topicId: firstPractice[0] })}>Start practice<ChevronRight aria-hidden="true" size={18}/></button>
    </section> : firstChapter ? <section className="learning-panel mb-6" aria-labelledby="subject-start-title">
      <p className="learning-eyebrow">Start with one idea</p><h2 id="subject-start-title" className="mt-2 text-xl font-bold">{firstChapter.title}</h2>
      <p className="learning-caption mt-2">{firstChapter.blurb}</p><button type="button" className="learning-primary mt-4" onClick={() => openTopic(firstChapter.id)}>Explore this topic<ChevronRight aria-hidden="true" size={18}/></button>
    </section> : hasStudyPack ? <section className="learning-panel mb-6" role="status" aria-busy={!error}>
      <h2 className="text-lg font-bold">{error ? "This collection could not open" : "Opening your topics"}</h2><p className="learning-caption mt-2">{error ? "Check your connection and try again. Your progress is still saved." : "One topic at a time. Your collection is loading."}</p>{error && <button type="button" className="learning-primary mt-3" onClick={retry}>Try again</button>}
    </section> : <section className="learning-panel mb-6" role="status">
      <BookOpen aria-hidden="true" className="mb-3 text-[var(--accent)]"/><h2 className="text-xl font-bold">This collection is still growing</h2><p className="learning-caption mt-2">{subject.name} lessons for Grade {learner.grade} are being prepared. Keep an idea in your notebook, or explore another room.</p>
    </section>}
    {(quizTopics.length > 1 || (!quizTopics.length && (pack?.topics.length ?? 0) > 1)) && <section className="mb-6" aria-labelledby="subject-choices-title">
      <h2 id="subject-choices-title" className="mb-3 text-lg font-bold">Or choose another topic</h2><div className="space-y-2">{quizTopics.length ? practiceButtons(quizTopics.slice(1, 3)) : topicButtons(pack!.topics.slice(1, 3))}</div>
    </section>}
    {(quizTopics.length > 3 || (!quizTopics.length && (pack?.topics.length ?? 0) > 3)) && <details className="learning-panel mb-6">
      <summary className="min-h-11 cursor-pointer py-2 font-semibold">See all topics</summary><div className="mt-3 space-y-2">{quizTopics.length ? practiceButtons(quizTopics.slice(3)) : topicButtons(pack!.topics.slice(3))}</div>
    </details>}
    <details className="learning-panel mb-6"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Notebook and study tools</summary><div className="mt-3 flex flex-wrap gap-3">
      <button type="button" className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 font-semibold" onClick={() => onNavigate("notebook", { subjectId })}><NotebookPen aria-hidden="true" className="mr-2 inline" size={17}/>Open notebook</button>
      {firstPractice && <button type="button" className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 font-semibold" onClick={() => onNavigate("match", { subjectId, topicId: firstPractice[0] })}>Try matching pairs</button>}
      {hasStudyPack && <button type="button" className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 font-semibold" onClick={() => onNavigate("exam-prep", { subjectId })}>Open study collection</button>}
      {aiTutorAllowed && <button type="button" className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 font-semibold" onClick={() => onNavigate("tutor", { subjectId })}><MessageCircle aria-hidden="true" className="mr-2 inline" size={17}/>Ask the AI helper</button>}
    </div></details>
    {pack && <details className="text-sm text-[var(--text-muted)]"><summary className="min-h-11 cursor-pointer py-2">About this collection</summary><p className="mt-2">{pack.context}</p>{!quizTopics.length && <p className="mt-2">These are study topics. A grade-matched question bank is not available for this subject.</p>}</details>}
    {!!state.progress?.[subjectId] && <p className="learning-caption mt-4">Your recorded practice is saved. Choose where to continue.</p>}
  </main>;
}
