import type { LearnerProfile, ViewState } from "../types";
import { viewForLearningResume } from "./resume";

/** A late account restore may resume reading, but cannot interrupt a new choice. */
export class LearningRevisit {
  private identity?: Pick<LearnerProfile, "id" | "remoteId" | "deviceToken">;
  private interacted = false;

  touch() { this.interacted = true; }

  restore(learner: LearnerProfile): ViewState | undefined {
    const previous = this.identity;
    if (!previous || previous.id !== learner.id || previous.remoteId !== learner.remoteId || previous.deviceToken !== learner.deviceToken) {
      this.identity = { id: learner.id, remoteId: learner.remoteId, deviceToken: learner.deviceToken };
      this.interacted = false;
    }
    if (this.interacted) return undefined;
    const { state } = learner;
    return viewForLearningResume(state.learningResume, learner) ?? (state.activities?.draft
      ? { name: "activities", params: { activityId: state.activities.draft.activityId, activityRevision: state.activities.draft.revision } }
      : { name: "home" });
  }
}
