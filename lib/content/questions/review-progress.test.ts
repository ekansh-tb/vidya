import { describe, expect, it } from "vitest";
import type { MissedQuestion } from "../../types";
import { missedQuestionsForLearner, questionsForLearner } from "./availability";
import { questionIdentity, reviewIdentityForCard, type ScopedQuestion } from "./identity";
import { recordQuizReviewAnswer } from "./review-progress";
import { buildParentReportResponse, chooseParentReportState } from "../../parent-report";
import { DEFAULT_STATE } from "../../game-store";

const scope = { board: "cambridge-primary" as const, grade: 5 };
const banks = questionsForLearner(scope);
const now = Date.parse("2026-10-01T00:00:00Z");
function planet(subjectId: "science" | "gk"): ScopedQuestion {
  for (const [topicId, topic] of Object.entries(banks[subjectId]!)) {
    const question = topic.items.find((item) => item.q === "Largest planet?");
    if (question) return { ...question, subjectId, topicId };
  }
  throw new Error("Missing duplicate-stem regression fixture");
}
const science = planet("science");
const generalKnowledge = planet("gk");
function miss(question: ScopedQuestion, existing: MissedQuestion[] = [], id = "new") {
  return recordQuizReviewAnswer(scope, existing, question, "Earth", { now, createId: () => id });
}
function legacy(id = "historical"): MissedQuestion {
  return { id, q: science.q, correct: science.a, ex: science.ex, given: "Earth",
    subjectId: science.subjectId, topicId: science.topicId, missedAt: new Date(now - 100000).toISOString(),
    box: 2, reviews: 4, dueAt: new Date(now - 1).toISOString() };
}

describe("quiz misses entering review", () => {
  it("admits a Daily miss using current-question provenance with no outer subject/topic props", () => {
    const saved = miss(science);
    expect(saved[0]).toMatchObject({ subjectId: "science", topicId: science.topicId,
      questionKey: questionIdentity(scope, science), box: 0 });
    expect(missedQuestionsForLearner(scope, saved)).toEqual(saved);
    expect(missedQuestionsForLearner({ ...scope, grade: 4 }, saved)).toEqual([]);
    expect(missedQuestionsForLearner({ board: "cbse", grade: 5 }, saved)).toEqual([]);
  });
  it("never overwrites or promotes the independent identical stem in another topic", () => {
    const first = miss(science, [], "science-card");
    const both = miss(generalKnowledge, first, "gk-card");
    expect(both).toHaveLength(2);
    expect(new Set(both.map((card) => card.questionKey)).size).toBe(2);
    expect(both.find((card) => card.id === "science-card")).toEqual(first[0]);
    const correct = recordQuizReviewAnswer(scope, both, science, science.a, { now });
    expect(correct.find((card) => card.id === "science-card")?.box).toBe(1);
    expect(correct.find((card) => card.id === "gk-card")).toEqual(both[0]);
    const wrongAgain = miss(science, correct);
    expect(wrongAgain.find((card) => card.id === "science-card")).toMatchObject({ box: 0, reviews: 2 });
    expect(wrongAgain.find((card) => card.id === "gk-card")).toEqual(both[0]);
  });
  it("adopts one exact legacy match without replacing its ID or review history", () => {
    const original = legacy();
    const corrected = recordQuizReviewAnswer(scope, [original], science, science.a, { now });
    expect(corrected[0]).toMatchObject({ id: original.id, missedAt: original.missedAt,
      box: 3, reviews: 5, questionKey: questionIdentity(scope, science) });
    expect(original.questionKey).toBeUndefined();
    expect(original.reviews).toBe(4);
    const lapsed = miss(science, [original]);
    expect(lapsed[0]).toMatchObject({ id: original.id, box: 0, reviews: 5 });
  });
  it("keeps ambiguous legacy records separate and reuses only a subsequent explicit card", () => {
    const originals = [legacy("old-a"), legacy("old-b")];
    expect(recordQuizReviewAnswer(scope, originals, science, science.a, { now })).toEqual(originals);
    const saved = miss(science, originals, "explicit");
    expect(saved).toHaveLength(3);
    expect(saved.slice(1)).toEqual(originals);
    const again = miss(science, saved, "must-not-be-created");
    expect(again).toHaveLength(3);
    expect(again[0]).toMatchObject({ id: "explicit", reviews: 1 });
    expect(again.slice(1)).toEqual(originals);
  });
  it("retains but never admits provenance-free or changed-answer legacy cards", () => {
    const invalid = [
      { ...legacy("no-topic"), topicId: undefined },
      { ...legacy("stale-answer"), correct: "Saturn" },
      { ...legacy("stale-explanation"), ex: "Old revision" },
    ];
    expect(missedQuestionsForLearner(scope, invalid)).toEqual([]);
    const saved = miss(science, invalid);
    expect(saved.slice(1)).toEqual(invalid);
    expect(missedQuestionsForLearner(scope, saved)).toEqual([saved[0]]);
  });
  it("distinguishes content revisions and preserves unrelated stored progress", () => {
    const saved = miss(science);
    const revised = { ...science, a: "A revised answer", ex: "A revised explanation" };
    expect(questionIdentity(scope, revised)).not.toBe(questionIdentity(scope, science));
    expect(questionIdentity(scope, { ...science, opts: [...science.opts].reverse() }))
      .toBe(questionIdentity(scope, science));
    expect(questionIdentity(scope, { ...science, opts: [...science.opts, "Another option"] }))
      .not.toBe(questionIdentity(scope, science));
    expect(questionIdentity({ ...scope, grade: 6 }, science)).not.toBe(questionIdentity(scope, science));
    const revisedBanks = { science: { [science.topicId]: { title: "Fixture", icon: "", items: [revised] } } };
    expect(reviewIdentityForCard(scope, saved[0], revisedBanks)).toBeNull();
    const separate = miss(revised, saved, "revised");
    expect(separate).toHaveLength(2);
    expect(separate[1]).toEqual(saved[0]);
  });
  it("does not infer a legacy identity when content is ambiguous within one topic", () => {
    const other = { ...science, opts: [...science.opts, "Extra choice"] };
    const ambiguousBanks = { science: { [science.topicId]: { title: "Fixture", icon: "", items: [science, other] } } };
    expect(reviewIdentityForCard(scope, legacy(), ambiguousBanks)).toBeNull();
    const keyed = miss(science)[0];
    expect(reviewIdentityForCard(scope, keyed, ambiguousBanks)).toBe(keyed.questionKey);
  });
  it("preserves independent legacy cards when only the matching topic is answered", () => {
    const gkCard = { ...legacy("gk-legacy"), subjectId: generalKnowledge.subjectId,
      topicId: generalKnowledge.topicId, ex: generalKnowledge.ex };
    const result = recordQuizReviewAnswer(scope, [legacy(), gkCard], science, science.a, { now });
    expect(result[0].reviews).toBe(5);
    expect(result[1]).toEqual(gkCard);
  });
  it("keeps valid review identity through minimized parent reporting without exposing given answers", () => {
    const saved = miss(science);
    const report = buildParentReportResponse({
      state: { ...DEFAULT_STATE, missedQuestions: saved },
      revision: 1, updatedAt: new Date(now).toISOString(),
    });
    expect(report.status).toBe("ready");
    if (report.status !== "ready") throw new Error("Expected valid report");
    expect(report.state.missedQuestions[0]).not.toHaveProperty("given");
    const projected = chooseParentReportState(DEFAULT_STATE, report).state;
    expect(missedQuestionsForLearner(scope, projected.missedQuestions)).toHaveLength(1);
    expect(projected.missedQuestions[0].questionKey).toBe(saved[0].questionKey);
  });
});
