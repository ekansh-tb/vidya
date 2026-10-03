import { expect, it } from "vitest";
import { canRegisterLearningWorker } from "./registration-scope";

it("never installs a public-shell updater on dedicated authenticated hosts or parent/login routes", () => {
  for (const hostname of ["parents.vidyagyan.study", "teacher.vidyagyan.study"]) {
    expect(canRegisterLearningWorker(hostname, "/")).toBe(false);
    expect(canRegisterLearningWorker(hostname, "/parent")).toBe(false);
  }
  for (const pathname of ["/parent", "/parent/reports", "/sign-in", "/sign-up"]) {
    expect(canRegisterLearningWorker("vidyagyan.study", pathname)).toBe(false);
  }
  expect(canRegisterLearningWorker("vidyagyan.study", "/")).toBe(true);
  expect(canRegisterLearningWorker("vidya-preview.vercel.app", "/")).toBe(true);
});
