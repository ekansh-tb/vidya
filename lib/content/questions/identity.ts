import type { LearnerProfile, MissedQuestion, Question, SubjectId, Topic } from "../../types";

type Scope = Pick<LearnerProfile, "board" | "grade">;
type Banks = Partial<Record<SubjectId, Record<string, Topic>>>;
export type ScopedQuestion = Question & { subjectId: SubjectId; topicId: string };

/** Lossless identity, not a stem hash or array position. Options are order-independent.
 * Answer/explanation/options edits constitute a new content revision. The bank
 * namespace identifies the existing authored bank, not an inferred learner stage.
 */
export function questionIdentity(scope: Scope, question: ScopedQuestion): string {
  return JSON.stringify([
    "vidya-review-v1", "primary-stage5-bank", scope.board, scope.grade,
    question.subjectId, question.topicId,
    question.q, question.a, [...question.opts].sort(), question.ex,
  ]);
}

/** No fallback across topics/curricula or for provenance-free legacy cards.
 * Exact, unique content matches can adopt identity while retaining card ID/history.
 */
export function reviewIdentityForCard(scope: Scope, card: MissedQuestion, banks: Banks): string | null {
  if (!card.subjectId || !card.topicId) return null;
  const candidates = banks[card.subjectId]?.[card.topicId]?.items.filter((item) =>
    item.q === card.q && item.a === card.correct && item.ex === card.ex &&
    (card.questionKey === undefined || card.questionKey === questionIdentity(scope, {
      ...item, subjectId: card.subjectId!, topicId: card.topicId!,
    }))) ?? [];
  if (candidates.length !== 1) return null;
  const key = questionIdentity(scope, {
    ...candidates[0], subjectId: card.subjectId, topicId: card.topicId,
  });
  return card.questionKey === undefined || card.questionKey === key ? key : null;
}
