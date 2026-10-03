import { expect, it } from "vitest";
import { recoverableAccountCache } from "./account-cache";
import type { LearnerProfile } from "../types";

it("keeps pending work in a previously linked cache after token revocation", () => {
  const linked = { id: "linked:remote-one", remoteId: "remote-one", state: { pendingWork: true } } as unknown as LearnerProfile;
  expect(recoverableAccountCache([linked], "remote-one")).toBe(linked);
  expect(recoverableAccountCache([linked], "remote-two")).toBeUndefined();
});

it("does not import an unlinked legacy archive into a newly enrolled account", () => {
  const legacy = { id: "learner-primary", remoteId: "remote-one" } as LearnerProfile;
  expect(recoverableAccountCache([legacy], "remote-one")).toBeUndefined();
  const authorized = { ...legacy, deviceToken: "synthetic-device-token" };
  expect(recoverableAccountCache([authorized], "remote-one")).toBe(authorized);
});
