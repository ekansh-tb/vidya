import type { Board, Subject, SubjectId } from "../types";
import { BOARDS, boardOption, gradesForBoard } from "./boards";
import { PACK_INDEX } from "./packs/pack-index";
import { questionsForLearner } from "./questions/availability";
import { pickerGroupsForBoard, subjectsForLearner } from "./subjects";

export type CurriculumContentSource = "question-bank" | "exam-pack";
export type CurriculumCoverageStatus = "supported" | "partial" | "unavailable";
export type SubjectCoverageStatus = Exclude<CurriculumCoverageStatus, "partial">;

export type SubjectCurriculumCoverage = {
  board: Board;
  grade: number;
  subjectId: SubjectId;
  subjectName: string;
  status: SubjectCoverageStatus;
  sources: CurriculumContentSource[];
};

export type BoardGradeCurriculumCoverage = {
  board: Board;
  boardLabel: string;
  grade: number;
  status: CurriculumCoverageStatus;
  subjectCount: number;
  availableSubjectCount: number;
  availableSubjectIds: SubjectId[];
  unavailableSubjectIds: SubjectId[];
  subjects: SubjectCurriculumCoverage[];
};

/**
 * Every subject the catalog offers for a board and grade, including optional
 * choices. Passing all picker choices through the catalog's own learner helper
 * keeps grade-specific filtering in one place.
 */
export function catalogSubjectsForBoardGrade(board: Board, grade: number): Subject[] {
  assertGradeInBoardRange(board, grade);
  const pickedSubjects = pickerGroupsForBoard(board, grade).flatMap((group) => group.subjects);
  return subjectsForLearner(board, pickedSubjects, grade);
}

/**
 * Coverage is derived, never hand-declared. A subject is supported when an
 * exact-grade pack or an admitted question bank exists for it.
 */
export function coverageForBoardGrade(
  board: Board,
  grade: number,
): BoardGradeCurriculumCoverage {
  const subjects = catalogSubjectsForBoardGrade(board, grade);
  const questionBanks = questionsForLearner({ board, grade });

  const subjectCoverage = subjects.map<SubjectCurriculumCoverage>((subject) => {
    const sources: CurriculumContentSource[] = [];
    if (questionBanks[subject.id] && Object.keys(questionBanks[subject.id] || {}).length > 0) {
      sources.push("question-bank");
    }
    if (PACK_INDEX.some((entry) => entry.subjectId === subject.id && entry.grade === grade)) {
      sources.push("exam-pack");
    }

    return {
      board,
      grade,
      subjectId: subject.id,
      subjectName: subject.name,
      status: sources.length > 0 ? "supported" : "unavailable",
      sources,
    };
  });

  const availableSubjectIds = subjectCoverage
    .filter((subject) => subject.status === "supported")
    .map((subject) => subject.subjectId);
  const unavailableSubjectIds = subjectCoverage
    .filter((subject) => subject.status === "unavailable")
    .map((subject) => subject.subjectId);
  const status: CurriculumCoverageStatus =
    availableSubjectIds.length === 0
      ? "unavailable"
      : availableSubjectIds.length === subjectCoverage.length
        ? "supported"
        : "partial";

  return {
    board,
    boardLabel: boardOption(board).label,
    grade,
    status,
    subjectCount: subjectCoverage.length,
    availableSubjectCount: availableSubjectIds.length,
    availableSubjectIds,
    unavailableSubjectIds,
    subjects: subjectCoverage,
  };
}

export function coverageForSubject(
  board: Board,
  grade: number,
  subjectId: SubjectId,
): SubjectCurriculumCoverage | undefined {
  return coverageForBoardGrade(board, grade).subjects.find(
    (subject) => subject.subjectId === subjectId,
  );
}

/** Stable board order followed by ascending grade order. */
export function curriculumCoverageMatrix(): BoardGradeCurriculumCoverage[] {
  return BOARDS.flatMap((board) =>
    gradesForBoard(board.id).map((grade) => coverageForBoardGrade(board.id, grade)),
  );
}

function assertGradeInBoardRange(board: Board, grade: number): void {
  const [minimum, maximum] = boardOption(board).gradeRange;
  if (!Number.isInteger(grade) || grade < minimum || grade > maximum) {
    throw new RangeError(
      `${boardOption(board).label} covers Grades ${minimum} to ${maximum}; received Grade ${grade}.`,
    );
  }
}
