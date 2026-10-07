import "server-only";
import type { TutorEligibility } from "./tutor-safeguards";

/**
 * No durable eligibility collection/review workflow exists in this release.
 * Parent toggles, saved API keys, grades, Clerk sessions and request claims do
 * not prove age assurance, processing consent or provider retention approval.
 * Keep live turns closed until an audited, revocable server record is shipped.
 * Do not add an environment-variable bypass or read browser profile metadata.
 */
export async function readReviewedTutorEligibility(learnerId: string): Promise<TutorEligibility | null> {
  void learnerId;
  return null;
}
