import { BOARDS } from "./boards";
import {
  curriculumCoverageMatrix,
  type BoardGradeCurriculumCoverage,
  type CurriculumCoverageStatus,
} from "./curriculum-coverage";
import { ALL_PACKS } from "./packs";
import { PACK_INDEX } from "./packs/pack-index";
import { questionsForLearner } from "./questions/availability";
import { pickerGroupsForBoard } from "./subjects";

export type CurriculumAuditIssue = {
  code: string;
  message: string;
};

export type CurriculumAuditResult = {
  issues: CurriculumAuditIssue[];
  matrix: BoardGradeCurriculumCoverage[];
  indexedPackCount: number;
  admittedQuestionBankCount: number;
};

const packKey = (pack: { subjectId: string; grade?: number | null }) =>
  `${pack.subjectId}@${pack.grade ?? "any"}`;

/**
 * Audit the registries that feed learner-facing availability. The returned
 * issue list is stable so CI output remains reviewable across runs.
 */
export async function auditCurriculumCoverage(): Promise<CurriculumAuditResult> {
  const issues: CurriculumAuditIssue[] = [];
  const addIssue = (code: string, message: string) => issues.push({ code, message });
  const matrix = curriculumCoverageMatrix();

  auditBoardCatalog(matrix, addIssue);
  await auditPackRegistry(matrix, addIssue);
  const admittedQuestionBankCount = auditQuestionBanks(matrix, addIssue);

  issues.sort((left, right) => {
    const leftKey = `${left.code}:${left.message}`;
    const rightKey = `${right.code}:${right.message}`;
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });

  return {
    issues,
    matrix,
    indexedPackCount: PACK_INDEX.length,
    admittedQuestionBankCount,
  };
}

export function formatCurriculumAuditSummary(result: CurriculumAuditResult): string {
  const statuses: Record<CurriculumCoverageStatus, number> = {
    supported: 0,
    partial: 0,
    unavailable: 0,
  };
  for (const coverage of result.matrix) statuses[coverage.status] += 1;

  return [
    `Curriculum audit: ${result.matrix.length} board-grade cohorts`,
    `${statuses.supported} supported`,
    `${statuses.partial} partial`,
    `${statuses.unavailable} unavailable`,
    `${result.indexedPackCount} indexed packs`,
    `${result.admittedQuestionBankCount} admitted question banks`,
    `${result.issues.length} issues`,
  ].join("; ");
}

function auditBoardCatalog(
  matrix: BoardGradeCurriculumCoverage[],
  addIssue: (code: string, message: string) => void,
): void {
  const boardIds = new Set<string>();
  for (const board of BOARDS) {
    if (boardIds.has(board.id)) {
      addIssue("duplicate-board", `Board ${board.id} is declared more than once.`);
    }
    boardIds.add(board.id);

    const [minimum, maximum] = board.gradeRange;
    if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
      addIssue("invalid-grade-range", `Board ${board.id} has invalid range ${minimum}-${maximum}.`);
    }
  }

  for (const coverage of matrix) {
    const key = `${coverage.board}@${coverage.grade}`;
    const subjectIds = coverage.subjects.map((subject) => subject.subjectId);
    if (subjectIds.length === 0) {
      addIssue("empty-catalog", `${key} exposes no catalog subjects.`);
    }
    if (new Set(subjectIds).size !== subjectIds.length) {
      addIssue("duplicate-catalog-subject", `${key} exposes a subject more than once.`);
    }

    const availableCount = coverage.subjects.filter(
      (subject) => subject.status === "supported",
    ).length;
    const expectedStatus: CurriculumCoverageStatus =
      availableCount === 0
        ? "unavailable"
        : availableCount === coverage.subjects.length
          ? "supported"
          : "partial";
    if (coverage.status !== expectedStatus || coverage.availableSubjectCount !== availableCount) {
      addIssue(
        "invalid-coverage-summary",
        `${key} says ${coverage.status} with ${coverage.availableSubjectCount} available, expected ${expectedStatus} with ${availableCount}.`,
      );
    }

    const catalogIds = new Set(subjectIds);
    for (const group of pickerGroupsForBoard(coverage.board, coverage.grade)) {
      const offeredIds = new Set(group.subjects);
      for (const subjectId of group.subjects) {
        if (!catalogIds.has(subjectId)) {
          addIssue(
            "picker-subject-missing-from-catalog",
            `${key} picker group ${group.id} offers ${subjectId}, but the catalog omits it.`,
          );
        }
      }
      for (const subjectId of group.compulsoryIds || []) {
        if (!offeredIds.has(subjectId)) {
          addIssue(
            "invalid-compulsory-subject",
            `${key} picker group ${group.id} marks ${subjectId} compulsory without offering it.`,
          );
        }
      }
    }
  }
}

async function auditPackRegistry(
  matrix: BoardGradeCurriculumCoverage[],
  addIssue: (code: string, message: string) => void,
): Promise<void> {
  const indexedKeys = PACK_INDEX.map(packKey);
  const registryKeys = ALL_PACKS.map(packKey);
  auditDuplicateKeys("pack-index", indexedKeys, addIssue);
  auditDuplicateKeys("pack-registry", registryKeys, addIssue);

  const indexed = new Set(indexedKeys);
  const registered = new Set(registryKeys);
  for (const key of registered) {
    if (!indexed.has(key)) addIssue("pack-missing-from-index", `${key} exists only in ALL_PACKS.`);
  }
  for (const key of indexed) {
    if (!registered.has(key)) addIssue("phantom-pack-index", `${key} exists only in PACK_INDEX.`);
  }

  for (const entry of PACK_INDEX) {
    const key = packKey(entry);
    if (entry.grade == null) {
      addIssue("pack-without-grade", `${key} cannot support an exact-grade coverage claim.`);
      continue;
    }

    const catalogMatches = matrix.filter(
      (coverage) =>
        coverage.grade === entry.grade &&
        coverage.subjects.some((subject) => subject.subjectId === entry.subjectId),
    );
    if (catalogMatches.length !== 1) {
      addIssue(
        "ambiguous-pack-catalog",
        `${key} matches ${catalogMatches.length} board-grade catalogs; expected exactly one.`,
      );
    }

    try {
      const loaded = await entry.load();
      if (packKey(loaded) !== key) {
        addIssue("pack-loader-mismatch", `${key} loader returned ${packKey(loaded)}.`);
      }
      if (loaded.topics.length === 0) {
        addIssue("empty-pack", `${key} has no topics.`);
      }
      const requiredSections = [
        ["plan", loaded.plan],
        ["flashcards", loaded.flashcards],
        ["questions", loaded.questions],
        ["mistakes", loaded.mistakes],
        ["cheat", loaded.cheat],
      ] as const;
      for (const [section, entries] of requiredSections) {
        if (entries.length === 0) {
          addIssue("empty-pack-section", `${key} has no ${section} entries.`);
        }
      }
    } catch (error) {
      addIssue(
        "pack-loader-failed",
        `${key} failed to load: ${error instanceof Error ? error.message : String(error)}.`,
      );
    }
  }
}

function auditQuestionBanks(
  matrix: BoardGradeCurriculumCoverage[],
  addIssue: (code: string, message: string) => void,
): number {
  let count = 0;

  for (const coverage of matrix) {
    const key = `${coverage.board}@${coverage.grade}`;
    const catalogIds = new Set<string>(coverage.subjects.map((subject) => subject.subjectId));
    const banks = questionsForLearner(coverage);

    for (const [subjectId, topics] of Object.entries(banks)) {
      count += 1;
      if (!catalogIds.has(subjectId)) {
        addIssue(
          "question-bank-outside-catalog",
          `${key} admits a ${subjectId} question bank outside its subject catalog.`,
        );
      }
      if (!topics || Object.keys(topics).length === 0) {
        addIssue("empty-question-bank", `${key} ${subjectId} has no topics.`);
        continue;
      }
      for (const [topicId, topic] of Object.entries(topics)) {
        if (topic.items.length === 0) {
          addIssue("empty-question-topic", `${key} ${subjectId}/${topicId} has no questions.`);
        }
      }
    }
  }

  return count;
}

function auditDuplicateKeys(
  registry: string,
  keys: string[],
  addIssue: (code: string, message: string) => void,
): void {
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) addIssue("duplicate-registry-key", `${registry} repeats ${key}.`);
    seen.add(key);
  }
}
