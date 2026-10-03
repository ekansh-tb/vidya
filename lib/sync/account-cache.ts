import type { LearnerProfile } from "../types";

/** Use only after redeem validates ownership of this exact remote learner. */
export function recoverableAccountCache(learners: LearnerProfile[], remoteId: string) {
  return learners.find(learner => learner.remoteId === remoteId &&
    (learner.deviceToken || learner.id === `linked:${remoteId}`));
}
