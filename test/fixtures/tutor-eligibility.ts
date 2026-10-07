/** Synthetic records for gate tests. These are never a published review. */
export function reviewedTutorFixture(overrides: Record<string, unknown> = {}, helperOverrides: Record<string, unknown> = {}) {
  const check = { recordId: "synthetic-review", reviewerId: "synthetic-reviewer", reviewedAt: "2026-01-01T00:00:00Z" };
  return {
    version: 1, recordId: "synthetic-eligibility", learnerId: "learner-a", parentId: "parent-a",
    connectionId: "22222222-2222-4222-8222-222222222222", tutorProfileId: "11111111-1111-4111-8111-111111111111", provider: "openrouter", modelId: "anthropic/claude-haiku-4.5",
    reviewedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z", revokedAt: null,
    ageAssurance: { minimumAge: 10, applicableDigitalConsentAge: 18, evidenceId: "synthetic-age-review" },
    purpose: "reviewed-learning-helper", legalBasisReviewId: "synthetic-basis",
    consent: { recordId: "synthetic-consent", grantedAt: "2026-01-01T00:00:00Z", withdrawnAt: null },
    providerReview: { recordId: "synthetic-provider-review", minorsPermitted: true,
      retention: "zero-data-retention", configurationEvidenceId: "synthetic-config", trainingDisabled: true,
      moderationReviewId: "synthetic-moderation", incidentResponseReviewId: "synthetic-incidents",
      downstreamServices: [{ provider: "anthropic", modelId: "anthropic/claude-haiku-4.5", reviewId: "synthetic-downstream", retention: "zero-data-retention" }],
    },
    fundedAllowance: { recordId: "synthetic-funding", expiresAt: "2099-01-01T00:00:00Z" },
    helper: { version: 1, id: "synthetic-helper", revision: 1, state: "published",
      board: "cambridge-primary", grade: 5, subjectId: "maths", language: "en",
      confirmedStage: { label: "Reviewed sample stage", evidenceId: "synthetic-stage-evidence" },
      objectives: [{ id: "sample-fractions", text: "Represent fractions with equal parts.",
        sourceRevisionId: "synthetic-source-v1", sourceUrl: "https://example.org/synthetic-reviewed-source",
        sourceExcerpt: "For this synthetic exercise, divide a shape into equal parts." }],
      reviews: { factual: check, developmental: check, language: check, accessibility: check, rights: check },
      ...helperOverrides,
    }, ...overrides,
  };
}
