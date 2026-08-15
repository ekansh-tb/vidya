import { describe, expect, it } from "vitest";
import type { Board, MissedQuestion } from "../../types";
import { missedQuestionsForLearner, questionsForLearner } from "./availability";

describe("questionsForLearner", () => {
  it("returns all six Stage 5 banks for Cambridge Primary Grade 5", () => {
    const banks = questionsForLearner({ board: "cambridge-primary", grade: 5 });

    expect(Object.keys(banks).sort()).toEqual([
      "english",
      "gk",
      "hindi",
      "marathi",
      "maths",
      "science",
    ]);
    expect(Object.keys(banks.maths || {}).length).toBeGreaterThan(0);
  });

  it.each([1, 4])(
    "returns no Stage 5 banks for Cambridge Primary Grade %i",
    (grade) => {
      expect(questionsForLearner({ board: "cambridge-primary", grade })).toEqual({});
    },
  );

  it.each<Board>([
    "cambridge-lower-secondary",
    "cambridge-igcse",
    "icse",
    "cbse",
  ])("returns no Stage 5 banks for %s", (board) => {
    expect(questionsForLearner({ board, grade: 5 })).toEqual({});
  });
});

describe("missedQuestionsForLearner", () => {
  const grade5Banks = questionsForLearner({ board: "cambridge-primary", grade: 5 });
  const topicId = Object.keys(grade5Banks.maths || {})[0];
  const question = grade5Banks.maths?.[topicId]?.items[0];
  const validMiss: MissedQuestion = {
    id: "valid-stage-5-miss",
    q: question?.q || "",
    given: "A different answer",
    correct: question?.a || "",
    ex: question?.ex || "",
    subjectId: "maths",
    topicId,
    missedAt: "2026-08-16T00:00:00.000Z",
  };

  it("preserves a valid Cambridge Primary Grade 5 review card", () => {
    expect(missedQuestionsForLearner(
      { board: "cambridge-primary", grade: 5 },
      [validMiss],
    )).toEqual([validMiss]);
  });

  it.each([
    { board: "cambridge-primary" as const, grade: 1 },
    { board: "cambridge-primary" as const, grade: 4 },
    { board: "cbse" as const, grade: 5 },
  ])("hides Stage 5 review cards from $board Grade $grade", (learner) => {
    expect(missedQuestionsForLearner(learner, [validMiss])).toEqual([]);
  });

  it("rejects cards that cannot be proven to belong to the admitted bank", () => {
    const missingProvenance = { ...validMiss, id: "missing", topicId: undefined };
    const unknownQuestion = { ...validMiss, id: "unknown", q: "Not in this bank" };

    expect(missedQuestionsForLearner(
      { board: "cambridge-primary", grade: 5 },
      [missingProvenance, unknownQuestion],
    )).toEqual([]);
  });
});
