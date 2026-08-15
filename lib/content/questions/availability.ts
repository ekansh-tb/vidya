import type { LearnerProfile, MissedQuestion, SubjectId, Topic } from "../../types";
import { QUESTIONS } from ".";

export type LearnerQuestionBanks = Partial<Record<SubjectId, Record<string, Topic>>>;

const NO_QUESTION_BANKS: LearnerQuestionBanks = {};

/**
 * Question banks that match the learner's board and grade exactly.
 *
 * The current banks contain Cambridge Primary Stage 5 content only. Returning
 * a shared empty object for every other curriculum keeps callers honest and
 * prevents another grade from being offered or measured against this content.
 */
export function questionsForLearner(
  learner: Pick<LearnerProfile, "board" | "grade">,
): LearnerQuestionBanks {
  return learner.board === "cambridge-primary" && learner.grade === 5
    ? QUESTIONS
    : NO_QUESTION_BANKS;
}

/**
 * Persisted review cards that still belong to the learner's current
 * curriculum. Older cards without subject and topic provenance are excluded
 * because their grade cannot be established safely.
 */
export function missedQuestionsForLearner(
  learner: Pick<LearnerProfile, "board" | "grade">,
  missedQuestions: MissedQuestion[] | undefined,
): MissedQuestion[] {
  const banks = questionsForLearner(learner);

  return (missedQuestions || []).filter((miss) => {
    if (!miss.subjectId || !miss.topicId) return false;
    const topic = banks[miss.subjectId]?.[miss.topicId];
    return !!topic?.items.some((item) => item.q === miss.q);
  });
}
