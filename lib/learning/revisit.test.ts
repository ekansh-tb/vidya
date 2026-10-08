import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "../game-store";
import type { LearnerProfile } from "../types";
import { LearningRevisit } from "./revisit";
import { readLearningResume, resumeForNavigation, viewForLearningResume } from "./resume";

const school = { version: 1 as const, kind: "school" as const, board: "cambridge-lower-secondary" as const, grade: 6 };
function learner(id = "synthetic-one"): LearnerProfile {
  return { id, name: "Synthetic learner", board: school.board, grade: 6, placement: school, pickedSubjects: ["cls-maths"], remoteId: id, deviceToken: "test-token", state: { ...DEFAULT_STATE, learningResume: resumeForNavigation("exam-prep", { subjectId: "cls-maths", topicId: "integers" }, "2026-10-08T00:00:00Z", school) } } as LearnerProfile;
}

describe("return visits", () => {
  it("opens a newer account topic after local hydration without writing a new timestamp", () => {
    const session = new LearningRevisit();
    const local = learner();
    expect(session.restore(local)?.params?.topicId).toBe("integers");
    const remote = { ...local, state: { ...local.state, learningResume: resumeForNavigation("exam-prep", { subjectId: "cls-maths", topicId: "equations" }, "2026-10-08T01:00:00Z", school) } };
    const before = JSON.stringify(remote);
    expect(session.restore(remote)?.params?.topicId).toBe("equations");
    expect(JSON.stringify(remote)).toBe(before);
  });
  it("never interrupts a new pointer or keyboard choice with a late account response", () => {
    const session = new LearningRevisit();
    const local = learner();
    session.restore(local);
    session.touch();
    expect(session.restore({ ...local, state: { ...local.state, learningResume: resumeForNavigation("music") } })).toBeUndefined();
  });
  it("resumes each sibling independently, including a same-ID device re-link", () => {
    const session = new LearningRevisit();
    const first = learner();
    session.restore(first);
    session.touch();
    const second = learner("synthetic-two");
    second.state = { ...second.state, learningResume: resumeForNavigation("creation") };
    expect(session.restore(second)).toEqual({ name: "creation" });
    session.touch();
    expect(session.restore(first)?.params?.topicId).toBe("integers");
    session.touch();
    expect(session.restore({ ...first, deviceToken: "replacement-test-token" })?.params?.topicId).toBe("integers");
  });
  it("honours a remotely saved exit", () => {
    const session = new LearningRevisit();
    const profile = learner();
    session.restore(profile);
    expect(session.restore({ ...profile, state: { ...profile.state, learningResume: resumeForNavigation("home") } })).toEqual({ name: "home" });
  });
  it("does not restore a topic after a board or grade correction, or for preschool", () => {
    const profile = learner();
    for (const patch of [
      { board: "cbse" as const, grade: 6, placement: undefined },
      { grade: 7, placement: undefined },
      { board: null, grade: null, placement: { version: 1 as const, kind: "early-years" as const, level: "nursery" as const } },
    ]) expect(viewForLearningResume(profile.state.learningResume, { ...profile, ...patch })).toBeUndefined();
  });
  it("keeps valid legacy records but rejects coercible versions and unknown subjects", () => {
    const saved = resumeForNavigation("exam-prep", { subjectId: "cls-maths" });
    expect(viewForLearningResume(saved, learner())?.name).toBe("exam-prep");
    for (const version of ["1", "2", true, null, 3]) expect(readLearningResume({ ...saved, version })).toBeUndefined();
    expect(readLearningResume({ ...saved, subjectId: "unknown-subject" })).toBeUndefined();
    expect(readLearningResume({ ...saved, placement: { ...school, grade: 0 } })).toBeUndefined();
  });
});
