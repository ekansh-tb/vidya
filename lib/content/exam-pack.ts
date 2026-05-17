// Generic ExamPack — any subject, any grade, any board.
// The IGCSE-CS content is the prototype; this type is a superset.

import type { SubjectId } from "../types";

export type SyllabusTopic = {
  id: string;
  paper?: 1 | 2;
  num?: number;
  title: string;
  blurb: string;
  syllabus: string[];
};

export type ExamQuestion = {
  id: string;
  topic: string;
  q: string;
  model: string;
  opts?: string[];
  a?: string;
  hint?: string;
};

export type Flashcard = { term: string; def: string };

export type CheatSection = { heading: string; bullets: string[] };

export type ExamPack = {
  subjectId: SubjectId;
  /** Grade this pack targets — used to disambiguate when the same subjectId covers multiple grades. */
  grade?: number;
  /** Display headline at top of exam-prep view */
  title: string;
  /** One-line context: board / code / school */
  context: string;
  /** Optional intro accents shown on the overview card */
  highlights?: { label: string; value: string }[];
  /** Optional rule that must be repeated (e.g. "pseudocode only") */
  pinnedRule?: { heading: string; body: string };
  /** External reference (syllabus PDF or official page) */
  reference?: { label: string; url: string };
  /** Tonight's plan — 4–6 short steps */
  plan: { title: string; hint: string }[];
  topics: SyllabusTopic[];
  flashcards: Flashcard[];
  questions: ExamQuestion[];
  mistakes: { mistake: string; fix: string }[];
  cheat: CheatSection[];
};
