import type { Board } from "../types";

/**
 * The boards Vidya models, with the grade range each one actually covers.
 * Single source of truth — first-run onboarding and the add-learner flow both
 * read this, so a grade offered in one place is offered in the other.
 *
 * Cambridge Primary is Grades 1–5 (Stages 1–5) and Cambridge Lower Secondary
 * is Grades 6–8 (Stages 7–9) — see `cambridgeStageForGrade` in ./subjects.
 */
export type BoardOption = {
  id: Board;
  label: string;
  description: string;
  /** Sensible starting grade for flows that need one (school templates).
   *  First-run onboarding deliberately ignores it — the learner picks. */
  defaultGrade: number;
  gradeRange: [number, number];
};

export const BOARDS: BoardOption[] = [
  { id: "cambridge-primary", label: "Cambridge Primary",  description: "Grades 1–5 · Stages 1–5 · ages 6–11",     defaultGrade: 5,  gradeRange: [1, 5] },
  { id: "cambridge-lower-secondary", label: "Cambridge Lower Secondary", description: "Grades 6–8 · Stages 7–9 · ages 11–14", defaultGrade: 6, gradeRange: [6, 8] },
  { id: "cambridge-igcse",   label: "Cambridge IGCSE",    description: "Year 9–10 · Upper Secondary · ages 14–16", defaultGrade: 10, gradeRange: [9, 10] },
  { id: "icse",              label: "ICSE (CISCE)",       description: "Indian Council · grades 1–10",            defaultGrade: 7,  gradeRange: [1, 10] },
  { id: "cbse",              label: "CBSE (NCERT NCF-SE 2023)", description: "Central Board · grades 1–12 · NCERT books", defaultGrade: 7, gradeRange: [1, 12] },
];

export function boardOption(board: Board): BoardOption {
  return BOARDS.find((b) => b.id === board)!;
}

/** Every grade the board offers, low → high. */
export function gradesForBoard(board: Board): number[] {
  const [lo, hi] = boardOption(board).gradeRange;
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

/** Pulls a grade into a board's real range — used when the board changes. */
export function clampGradeToBoard(board: Board, grade: number): number {
  const [lo, hi] = boardOption(board).gradeRange;
  return Math.min(hi, Math.max(lo, grade));
}
