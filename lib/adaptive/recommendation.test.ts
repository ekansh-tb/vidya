import { describe, expect, it } from "vitest";
import { questionsForLearner } from "@/lib/content/questions/availability";
import type { Board, GameState, MissedQuestion } from "@/lib/types";
import { recommendNextQuest } from "./recommendation";

const NOW = Date.parse("2026-08-16T12:00:00.000Z");
const LEARNER = { board: "cambridge-primary" as const, grade: 5 };
const banks = questionsForLearner(LEARNER);
const firstMathsTopicId = Object.keys(banks.maths || {})[0];
const firstMathsTopic = banks.maths?.[firstMathsTopicId];

function recommend(overrides: Partial<Parameters<typeof recommendNextQuest>[0]> = {}) {
  return recommendNextQuest({
    learner: LEARNER,
    progress: {},
    missedQuestions: [],
    rotationIndex: 0,
    now: NOW,
    ...overrides,
  });
}

function validMiss(overrides: Partial<MissedQuestion> = {}): MissedQuestion {
  const question = firstMathsTopic?.items[0];
  return {
    id: "stage-5-review",
    q: question?.q || "",
    given: "Another answer",
    correct: question?.a || "",
    ex: question?.ex || "",
    subjectId: "maths",
    topicId: firstMathsTopicId,
    missedAt: "2026-08-15T12:00:00.000Z",
    ...overrides,
  };
}

describe("recommendNextQuest", () => {
  it.each([
    { board: "cambridge-primary" as Board, grade: 4 },
    { board: "cambridge-lower-secondary" as Board, grade: 6 },
    { board: "cambridge-igcse" as Board, grade: 10 },
    { board: "icse" as Board, grade: 7 },
    { board: "cbse" as Board, grade: 5 },
  ])("does not assess unavailable $board Grade $grade content", (learner) => {
    expect(recommend({
      learner,
      progress: {
        maths: {
          [firstMathsTopicId]: { attempts: 3, correct: 0, mastery: 0 },
        },
      },
    })).toEqual({ kind: "unavailable", reason: "no-verified-question-bank" });
  });

  it("prioritizes an admitted due review over topic practice", () => {
    const result = recommend({
      progress: {
        maths: {
          [firstMathsTopicId]: { attempts: 1, correct: 2, mastery: 30 },
        },
      },
      missedQuestions: [validMiss({ dueAt: "2026-08-16T11:00:00.000Z" })],
    });

    expect(result).toEqual({ kind: "due-review", dueCount: 1 });
  });

  it("ignores resting and unverified review cards", () => {
    const result = recommend({
      missedQuestions: [
        validMiss({ dueAt: "2026-08-17T12:00:00.000Z" }),
        validMiss({ id: "unknown", q: "Not in the verified bank" }),
      ],
    });

    expect(result).toMatchObject({ kind: "topic", source: "unseen" });
  });

  it("chooses the weakest attempted topic before unseen topics", () => {
    const mathsTopicIds = Object.keys(banks.maths || {});
    const stronger = mathsTopicIds[0];
    const weaker = mathsTopicIds[1];

    const result = recommend({
      progress: {
        maths: {
          [stronger]: { attempts: 2, correct: 10, mastery: 80 },
          [weaker]: { attempts: 1, correct: 2, mastery: 35 },
        },
      },
    });

    expect(result).toMatchObject({
      kind: "topic",
      source: "weakest-attempted",
      subjectId: "maths",
      topicId: weaker,
      mastery: 35,
    });
  });

  it("interleaves an unseen topic after two remediation recommendations", () => {
    const result = recommend({
      progress: {
        maths: {
          [firstMathsTopicId]: { attempts: 2, correct: 1, mastery: 25 },
        },
      },
      rotationIndex: 2,
    });

    expect(result).toMatchObject({ kind: "topic", source: "unseen" });
  });

  it("rotates between equally weak topics", () => {
    const [first, second] = Object.keys(banks.maths || {});
    const progress: GameState["progress"] = {
      maths: {
        [first]: { attempts: 2, correct: 1, mastery: 40 },
        [second]: { attempts: 2, correct: 1, mastery: 40 },
      },
    };

    const one = recommend({ progress, rotationIndex: 0 });
    const two = recommend({ progress, rotationIndex: 1 });

    expect(one).toMatchObject({ kind: "topic", source: "weakest-attempted" });
    expect(two).toMatchObject({ kind: "topic", source: "weakest-attempted" });
    expect(two).not.toEqual(one);
  });

  it("does not immediately repeat the topic shown on the current results screen", () => {
    const result = recommend({
      recentTopic: { subjectId: "maths", topicId: firstMathsTopicId },
      rotationIndex: 0,
    });

    expect(result).not.toMatchObject({
      kind: "topic",
      subjectId: "maths",
      topicId: firstMathsTopicId,
    });
  });

  it("rotates unseen topics deterministically after completed topics reach 100", () => {
    const completed: GameState["progress"] = {
      maths: {
        [firstMathsTopicId]: { attempts: 1, correct: 7, mastery: 100 },
      },
    };

    const first = recommend({ progress: completed, rotationIndex: 7 });
    const repeated = recommend({ progress: completed, rotationIndex: 7 });
    const next = recommend({ progress: completed, rotationIndex: 8 });

    expect(first).toEqual(repeated);
    expect(first).toMatchObject({ kind: "topic", source: "unseen" });
    expect(next).toMatchObject({ kind: "topic", source: "unseen" });
    expect(next).not.toEqual(first);
  });

  it("rotates keep-fresh practice when every topic has been completed", () => {
    const progress: GameState["progress"] = {};
    for (const [subjectId, topics] of Object.entries(banks)) {
      progress[subjectId] = {};
      for (const topicId of Object.keys(topics || {})) {
        progress[subjectId][topicId] = { attempts: 1, correct: 7, mastery: 100 };
      }
    }

    const result = recommend({ progress, rotationIndex: 3 });
    expect(result).toMatchObject({ kind: "topic", source: "keep-fresh", mastery: 100 });
  });
});
