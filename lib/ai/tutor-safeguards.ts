import { z } from "zod";
import { AI_PROVIDER_IDS, type AiProviderId } from "./providers";
import { helperMatchesCurriculum, subjectHelperSchema, type SubjectHelperProfile } from "./subject-helper";
import type { TutorCurriculum } from "./tutor-curriculum";

const evidence = z.string().min(1).max(160);
/** Evidence references only. Do not collect a birth date in tutor requests. */
export const tutorEligibilitySchema = z.object({
  version: z.literal(1), recordId: evidence, learnerId: evidence, parentId: evidence,
  connectionId: evidence, tutorProfileId: evidence, provider: z.enum(AI_PROVIDER_IDS), modelId: evidence,
  reviewedAt: z.iso.datetime(), expiresAt: z.iso.datetime(), revokedAt: z.iso.datetime().nullable(),
  ageAssurance: z.object({ minimumAge: z.number().int().min(0).max(120),
    applicableDigitalConsentAge: z.number().int().min(13).max(21), evidenceId: evidence }).strict(),
  purpose: z.literal("reviewed-learning-helper"), legalBasisReviewId: evidence,
  consent: z.object({ recordId: evidence, grantedAt: z.iso.datetime(), withdrawnAt: z.iso.datetime().nullable() }).strict(),
  providerReview: z.object({ recordId: evidence, minorsPermitted: z.literal(true),
    retention: z.enum(["zero-data-retention", "reviewed-limited-retention"]),
    configurationEvidenceId: evidence, trainingDisabled: z.literal(true),
    moderationReviewId: evidence, incidentResponseReviewId: evidence,
    // A router approval must cover every service that receives the turn.
    downstreamServices: z.array(z.object({ provider: evidence, modelId: evidence,
      reviewId: evidence, retention: z.enum(["zero-data-retention", "reviewed-limited-retention"]) }).strict()).max(8),
  }).strict(),
  fundedAllowance: z.object({ recordId: evidence, expiresAt: z.iso.datetime() }).strict(),
  helper: subjectHelperSchema,
}).strict();
export type TutorEligibility = z.infer<typeof tutorEligibilitySchema>;
type Binding = { learnerId: string; parentId: string; connectionId: string; tutorProfileId: string; provider: AiProviderId; modelId: string };
export type TutorSafeguardDecision = { allowed: true; helper: SubjectHelperProfile } | { allowed: false; reason: string };

/** Only server-read, durable audited records may be supplied as `review`. */
export function evaluateTutorEligibility(review: unknown, binding: Binding, scope: TutorCurriculum, now = new Date()): TutorSafeguardDecision {
  const result = tutorEligibilitySchema.safeParse(review);
  if (!result.success) return { allowed: false, reason: "missing-reviewed-eligibility" };
  const record = result.data;
  if (record.learnerId !== binding.learnerId || record.parentId !== binding.parentId
    || record.connectionId !== binding.connectionId || record.tutorProfileId !== binding.tutorProfileId
    || record.provider !== binding.provider || record.modelId !== binding.modelId) {
    return { allowed: false, reason: "eligibility-binding-mismatch" };
  }
  const time = now.getTime();
  if (record.revokedAt || record.consent.withdrawnAt || Date.parse(record.expiresAt) <= time
    || Date.parse(record.fundedAllowance.expiresAt) <= time || Date.parse(record.reviewedAt) > time
    || Date.parse(record.consent.grantedAt) > time) return { allowed: false, reason: "inactive-eligibility" };
  if (!helperMatchesCurriculum(record.helper, scope)) return { allowed: false, reason: "helper-scope-mismatch" };
  if (Object.values(record.helper.reviews).some((check) => Date.parse(check.reviewedAt) > time)) {
    return { allowed: false, reason: "inactive-helper-review" };
  }
  // The Gemini API terms prohibit API clients directed towards or likely accessed
  // by under-18s. Vidya's child-facing endpoint is not an adult-only client.
  if (binding.provider === "google") return { allowed: false, reason: "provider-child-client-prohibited" };
  const threshold = Math.max(13, record.ageAssurance.applicableDigitalConsentAge);
  if (binding.provider === "openai" && record.ageAssurance.minimumAge < threshold
    && record.providerReview.retention !== "zero-data-retention") {
    return { allowed: false, reason: "provider-child-retention-requirement" };
  }
  if (binding.provider === "openrouter") {
    const downstream = record.providerReview.downstreamServices;
    if (!downstream.length || downstream.some((service) => service.modelId !== binding.modelId
      || /google|gemini/i.test(service.provider) || (/openai/i.test(service.provider)
        && record.ageAssurance.minimumAge < threshold && service.retention !== "zero-data-retention"))) {
      return { allowed: false, reason: "downstream-provider-not-reviewed" };
    }
  }
  return { allowed: true, helper: record.helper };
}
