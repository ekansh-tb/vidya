import type { LearnerProfile, MissedQuestion } from "../../types";
import { capNotebook, newCard, recordCorrect, recordWrong } from "../../spaced-repetition";
import { questionsForLearner } from "./availability";
import { questionIdentity, reviewIdentityForCard, type ScopedQuestion } from "./identity";

/** Shared by Daily and topic quizzes. Never merge cards merely by their wording. */
export function recordQuizReviewAnswer(
  scope: Pick<LearnerProfile, "board" | "grade">,
  existing: MissedQuestion[],
  question: ScopedQuestion,
  given: string,
  options: { isDeva?: boolean; now?: number; createId?: () => string } = {},
): MissedQuestion[] {
  const now = options.now ?? Date.now();
  const key = questionIdentity(scope, question);
  const banks = questionsForLearner(scope);
  const candidates = existing.map((card, index) =>
    reviewIdentityForCard(scope, card, banks) === key ? index : -1).filter((index) => index !== -1);
  const keyed = candidates.filter((index) => existing[index].questionKey !== undefined);
  const matches = keyed.length ? keyed : candidates;
  // Ambiguous historical duplicates are retained, not collapsed or jointly promoted.
  const index = matches.length === 1 ? matches[0] : -1;
  if (given === question.a) {
    if (index === -1) return existing;
    const outcome = recordCorrect({ ...existing[index], questionKey: key }, now);
    return existing.flatMap((card, at) => at !== index ? [card]
      : outcome.kind === "scheduled" ? [outcome.card] : []);
  }
  const timestamp = new Date(now).toISOString();
  const entry = index !== -1
    ? recordWrong({ ...existing[index], questionKey: key, given, missedAt: timestamp }, now)
    : newCard({
      id: options.createId?.() ?? `m-${now.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
      questionKey: key, q: question.q, given, correct: question.a, ex: question.ex,
      subjectId: question.subjectId, topicId: question.topicId, isDeva: options.isDeva,
      missedAt: timestamp,
    }, now);
  return capNotebook([entry, ...existing.filter((_, at) => at !== index)], 50);
}
