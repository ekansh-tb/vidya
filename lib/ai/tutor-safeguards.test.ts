import { describe, expect, it } from "vitest";
import { reviewedTutorFixture } from "../../test/fixtures/tutor-eligibility";
import { evaluateTutorEligibility } from "./tutor-safeguards";
import { readReviewedTutorEligibility } from "./tutor-eligibility.server";
import { subjectHelperSchema, subjectHelperPrompt } from "./subject-helper";
import { resolveTutorCurriculum } from "./tutor-curriculum";

const binding = { learnerId: "learner-a", parentId: "parent-a", connectionId: "22222222-2222-4222-8222-222222222222", tutorProfileId: "11111111-1111-4111-8111-111111111111", provider: "openrouter" as const, modelId: "anthropic/claude-haiku-4.5" };
const resolved = resolveTutorCurriculum({ board: "cambridge-primary", grade: 5 }, "maths");
if (!resolved.ok) throw new Error("Synthetic curriculum invalid");
const scope = resolved.scope;
const now = new Date("2026-10-08T00:00:00Z");
const decision = (review: unknown) => evaluateTutorEligibility(review, binding, scope, now);

describe("reviewed subject-helper boundaries", () => {
  it("keeps the actual server resolver closed until durable records exist", async () => {
    expect(await readReviewedTutorEligibility("learner-a")).toBeNull();
    expect(await readReviewedTutorEligibility("grade13-with-api-key")).toBeNull();
  });
  it.each([null, undefined, {}, { age: 18, parentApproved: true }, reviewedTutorFixture({ ageAssurance: undefined })])("does not infer unknown age or eligibility from %j", (review) => {
    expect(decision(review).allowed).toBe(false);
  });
  it("requires each publishing check, confirmed stage and grounded objective", () => {
    for (const overrides of [{ confirmedStage: undefined }, { objectives: [] }, { reviews: {} }, { state: "draft" }]) {
      expect(decision(reviewedTutorFixture({}, overrides)).allowed).toBe(false);
    }
  });
  it("matches every identity/provider and exact curriculum scope", () => {
    expect(decision(reviewedTutorFixture()).allowed).toBe(true);
    for (const overrides of [{ learnerId: "peer" }, { parentId: "peer" }, { connectionId: "other" }, { tutorProfileId: "other" }, { modelId: "other" }]) {
      expect(decision(reviewedTutorFixture(overrides)).allowed).toBe(false);
    }
    for (const helper of [{ board: "cbse" }, { grade: 6 }, { subjectId: "science" }]) {
      expect(decision(reviewedTutorFixture({}, helper)).allowed).toBe(false);
    }
  });
  it("closes revoked, expired, future-dated and withdrawn records", () => {
    const valid = reviewedTutorFixture();
    for (const overrides of [{ revokedAt: "2026-01-01T00:00:00Z" }, { expiresAt: "2026-01-01T00:00:00Z" },
      { reviewedAt: "2099-01-01T00:00:00Z" }, { consent: { ...valid.consent, withdrawnAt: "2026-01-01T00:00:00Z" } },
      { fundedAllowance: { ...valid.fundedAllowance, expiresAt: "2026-01-01T00:00:00Z" } }]) {
      expect(decision(reviewedTutorFixture(overrides)).allowed).toBe(false);
    }
    expect(decision(reviewedTutorFixture({}, { reviews: {
      ...valid.helper.reviews, factual: { ...valid.helper.reviews.factual, reviewedAt: "2099-01-01T00:00:00Z" },
    } })).allowed).toBe(false);
  });
  it("keeps Gemini child-client prohibition even with a complete local review", () => {
    const review = reviewedTutorFixture({ provider: "google", modelId: "gemini" });
    expect(evaluateTutorEligibility(review, { ...binding, provider: "google", modelId: "gemini" }, scope, now)).toEqual({ allowed: false, reason: "provider-child-client-prohibited" });
  });
  it("requires OpenAI ZDR below the applicable threshold", () => {
    const valid = reviewedTutorFixture();
    const review = reviewedTutorFixture({ provider: "openai", modelId: "gpt-test", providerReview: { ...valid.providerReview, retention: "reviewed-limited-retention" } });
    const openai = { ...binding, provider: "openai" as const, modelId: "gpt-test" };
    expect(evaluateTutorEligibility(review, openai, scope, now).allowed).toBe(false);
    expect(evaluateTutorEligibility({ ...review, providerReview: valid.providerReview }, openai, scope, now).allowed).toBe(true);
  });
  it("requires router downstream review and preserves downstream restrictions", () => {
    const valid = reviewedTutorFixture();
    for (const services of [[], [{ provider: "google", modelId: binding.modelId, reviewId: "r", retention: "zero-data-retention" }],
      [{ provider: "openai", modelId: binding.modelId, reviewId: "r", retention: "reviewed-limited-retention" }]]) {
      expect(decision({ ...valid, providerReview: { ...valid.providerReview, downstreamServices: services } }).allowed).toBe(false);
    }
  });
  it("quotes learning evidence as data and keeps correction and uncertainty explicit", () => {
    const helper = subjectHelperSchema.parse(reviewedTutorFixture().helper);
    const prompt = subjectHelperPrompt(helper);
    expect(prompt).toContain('"language":"en"');
    expect(prompt).toContain("source excerpts");
    expect(prompt).toContain("invite correction");
    expect(subjectHelperSchema.safeParse({ ...helper, clientPermission: "unrestricted" }).success).toBe(false);
  });
});
