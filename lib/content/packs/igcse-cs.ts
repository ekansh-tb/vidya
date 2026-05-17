// Adapter that wraps the existing IGCSE CS content into the generic ExamPack shape.

import type { ExamPack } from "../exam-pack";
import {
  IGCSE_CS_TOPICS, IGCSE_CS_QUESTIONS, IGCSE_CS_FLASHCARDS,
  IGCSE_CS_MISTAKES, IGCSE_CS_CHEAT,
} from "../igcse-cs";

export const IGCSE_CS_PACK: ExamPack = {
  subjectId: "igcse-cs",
  title: "Computer Science — IGCSE 0478",
  context: "Cambridge IGCSE · v5 (2026–28) · CNS Pune",
  highlights: [
    { label: "Paper 1", value: "Topics 1–6 · 75m · 1h45" },
    { label: "Paper 2", value: "Topics 7–10 · 75m · 1h45" },
    { label: "A* boundary", value: "~77%" },
  ],
  pinnedRule: {
    heading: "The pseudocode rule",
    body: "All coding answers on Paper 2 must be in Cambridge pseudocode. Python or Java earn zero marks — except the final 15-mark scenario question, where Python, Visual Basic, or Java are allowed.",
  },
  reference: { label: "Cambridge 0478 official syllabus PDF", url: "https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf" },
  plan: [
    { title: "Walk the 10 topics", hint: "2 min each — note where you feel weak" },
    { title: "25 must-know flashcards", hint: "Flip them all at least once" },
    { title: "Practice questions", hint: "Mix of MCQ + short-answer + pseudocode tracing" },
    { title: "Cambridge pseudocode reference", hint: "Memorise keywords + the 5 patterns" },
    { title: "Top 10 examiner traps", hint: "Where students lose marks" },
    { title: "10-min morning cheat sheet", hint: "Re-read just before the exam" },
  ],
  topics: IGCSE_CS_TOPICS.map((t) => ({
    id: t.id,
    paper: t.paper,
    num: t.num,
    title: t.title,
    blurb: t.blurb,
    syllabus: t.syllabus,
  })),
  flashcards: IGCSE_CS_FLASHCARDS,
  questions: IGCSE_CS_QUESTIONS.map((q) => ({
    id: q.id,
    topic: q.topic,
    q: q.q,
    model: q.model,
    opts: q.opts,
    a: q.a,
    hint: q.hint,
  })),
  mistakes: IGCSE_CS_MISTAKES,
  cheat: IGCSE_CS_CHEAT,
};
