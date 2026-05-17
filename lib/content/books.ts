import type { SubjectId } from "../types";

export type BookPages = {
  title: string;
  pages: string[];
};

// Drop scanned/rendered textbook pages under /public/books/<subjectId>/
// and list them here in reading order. Empty arrays fall back to an
// auto-generated cheat sheet built from the topic's questions.
export const BOOKS: Partial<Record<SubjectId, BookPages>> = {
  maths: { title: "Maths Textbook", pages: [] },
  science: { title: "Science Textbook", pages: [] },
  english: { title: "English Reader", pages: [] },
  hindi: { title: "हिंदी पाठ्यपुस्तक", pages: [] },
  marathi: { title: "मराठी पाठ्यपुस्तक", pages: [] },
  gk: { title: "GK & World", pages: [] },
};
