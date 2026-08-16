import { missedQuestionsForLearner, questionsForLearner } from "@/lib/content/questions/availability";
import { isDue } from "@/lib/spaced-repetition";
import type { GameState, LearnerProfile, SubjectId } from "@/lib/types";

type RecommendationInput = {
  learner: Pick<LearnerProfile, "board" | "grade">;
  progress: GameState["progress"];
  missedQuestions: GameState["missedQuestions"];
  /** A changing whole number supplied by the caller, such as quizzes completed. */
  rotationIndex: number;
  /** Explicit clock input keeps recommendation selection pure and testable. */
  now: number;
  /** A topic completed on the current results screen should not be repeated. */
  recentTopic?: { subjectId: SubjectId; topicId: string };
};

export type NextQuestRecommendation =
  | {
      kind: "due-review";
      dueCount: number;
    }
  | {
      kind: "topic";
      source: "weakest-attempted" | "unseen" | "keep-fresh";
      subjectId: SubjectId;
      topicId: string;
      topicTitle: string;
      topicIcon: string;
      attempts: number;
      mastery: number | null;
    }
  | {
      kind: "unavailable";
      reason: "no-verified-question-bank" | "no-topics";
    };

type TopicCandidate = Extract<NextQuestRecommendation, { kind: "topic" }>;

function safeWholeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function safeMastery(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function rotate<T>(items: T[], index: number): T {
  return items[safeWholeNumber(index) % items.length];
}

/**
 * Picks one optional next quest from the learner's admitted question bank.
 *
 * Order is intentional:
 * 1. Review cards that are due now.
 * 2. The lowest-mastery attempted topic that still has room to grow.
 * 3. An unseen topic, rotated deterministically.
 * 4. A fully mastered topic to keep fresh when everything has been explored.
 *
 * The exact curriculum gate runs before progress is inspected. Unavailable
 * boards and grades therefore never receive a recommendation or mastery label
 * based on Cambridge Primary Grade 5 content.
 */
export function recommendNextQuest({
  learner,
  progress,
  missedQuestions,
  rotationIndex,
  now,
  recentTopic,
}: RecommendationInput): NextQuestRecommendation {
  const banks = questionsForLearner(learner);
  if (Object.keys(banks).length === 0) {
    return { kind: "unavailable", reason: "no-verified-question-bank" };
  }

  const dueCount = missedQuestionsForLearner(learner, missedQuestions)
    .filter((miss) => isDue(miss, now)).length;
  if (dueCount > 0) return { kind: "due-review", dueCount };

  const attempted: TopicCandidate[] = [];
  const unseen: TopicCandidate[] = [];

  for (const [subjectId, topics] of Object.entries(banks)) {
    if (!topics) continue;
    for (const [topicId, topic] of Object.entries(topics)) {
      if (recentTopic?.subjectId === subjectId && recentTopic.topicId === topicId) continue;
      const recorded = progress[subjectId]?.[topicId];
      const attempts = safeWholeNumber(recorded?.attempts ?? 0);
      const candidate: TopicCandidate = {
        kind: "topic",
        source: attempts > 0 ? "weakest-attempted" : "unseen",
        subjectId: subjectId as SubjectId,
        topicId,
        topicTitle: topic.title,
        topicIcon: topic.icon,
        attempts,
        mastery: attempts > 0 ? safeMastery(recorded?.mastery ?? 0) : null,
      };

      if (attempts > 0) attempted.push(candidate);
      else unseen.push(candidate);
    }
  }

  if (attempted.length === 0 && unseen.length === 0) {
    return { kind: "unavailable", reason: "no-topics" };
  }

  const needsPractice = attempted.filter((topic) => (topic.mastery ?? 0) < 100);
  const exploreNow = unseen.length > 0 && safeWholeNumber(rotationIndex) % 3 === 2;
  if (exploreNow) return rotate(unseen, rotationIndex);

  if (needsPractice.length > 0) {
    const lowestMastery = Math.min(...needsPractice.map((topic) => topic.mastery ?? 0));
    const equallyWeak = needsPractice.filter(
      (topic) => (topic.mastery ?? 0) === lowestMastery,
    );
    return rotate(equallyWeak, rotationIndex);
  }

  if (unseen.length > 0) return rotate(unseen, rotationIndex);

  const lowestMastery = Math.min(...attempted.map((topic) => topic.mastery ?? 0));
  const equallyFresh = attempted
    .filter((topic) => (topic.mastery ?? 0) === lowestMastery)
    .map((topic) => ({ ...topic, source: "keep-fresh" as const }));
  return rotate(equallyFresh, rotationIndex);
}
