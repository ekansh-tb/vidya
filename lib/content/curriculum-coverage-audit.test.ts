import { describe, expect, it } from "vitest";
import {
  auditCurriculumCoverage,
  formatCurriculumAuditSummary,
} from "./curriculum-coverage-audit";

describe("curriculum content audit", () => {
  it("finds no registry drift or invalid derived coverage", async () => {
    const result = await auditCurriculumCoverage();

    console.info(formatCurriculumAuditSummary(result));
    expect(
      result.issues,
      result.issues.map((issue) => `[${issue.code}] ${issue.message}`).join("\n"),
    ).toEqual([]);
  });
});
