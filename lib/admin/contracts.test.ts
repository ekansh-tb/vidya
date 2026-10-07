import { describe, it, expect } from "vitest";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
import { activitySchema, reviewSchema, contentMutation, coverage, supportSchema, type ContentRevision } from "./contracts";
describe("content and receipt contracts", () => {
  it("accepts existing authored identities without changing them", () => { for (const a of ACTIVITY_CATALOG) expect(activitySchema.safeParse(a).success, `${a.id}: ${JSON.stringify(activitySchema.safeParse(a).error?.issues)}`).toBe(true); });
  it("rejects missing and repeated review dimensions", () => {
    expect(reviewSchema.safeParse({ checks: ["factual"], limitations: "Not independently tested with children." }).success).toBe(false);
    expect(reviewSchema.safeParse({ checks: ["factual", "factual", "language", "accessibility", "rights"], limitations: "Not independently tested with children." }).success).toBe(false);
  });
  it("requires explicit review limitations", () => { expect(reviewSchema.safeParse({ checks: ["factual", "developmental", "language", "accessibility", "rights"], limitations: "" }).success).toBe(false); });
  it("rejects answer IDs outside the question", () => { const a = structuredClone(ACTIVITY_CATALOG[0]); a.steps[0].answer = "nonexistent"; expect(activitySchema.safeParse(a).success).toBe(false); });
  it("rejects fabricated grade and out-of-contract mutation properties", () => { const a = structuredClone(ACTIVITY_CATALOG[0]); a.placements = ["school:0"]; expect(activitySchema.safeParse(a).success).toBe(false); expect(contentMutation.safeParse({ action: "publish", id: a.id, revision: 1, force: true }).success).toBe(false); });
  it("counts distinct currently published IDs and flags duplicate titles separately", () => {
    const base: ContentRevision = { id: "one", revision: 1, status: "published", payload: ACTIVITY_CATALOG[0], reviewedBy: "editor", reviewedAt: "today", reviewRecord: null, createdAt: "today", publishedAt: "today" };
    const report = coverage([base, { ...base, id: "two" }, { ...base, revision: 2, status: "draft" }, { ...base, id: "archived", status: "archived" }]);
    expect(report.placements.find(p => p.placement === "nursery")?.activities).toBe(2); expect(report.duplicates).toHaveLength(1);
  });
  it("does not promote undocumented awards or invalid dates", () => {
    const a = { organization: "Example", channel: "email", status: "approved", contribution: "Credit request", evidence: "", occurredOn: "2026-10-08", nextAction: "", amount: null, currency: null, expiry: null };
    expect(supportSchema.safeParse(a).success).toBe(false); expect(supportSchema.safeParse({ ...a, status: "sent", evidence: "Sent Items record", occurredOn: "2026-99-01" }).success).toBe(false);
  });
});
