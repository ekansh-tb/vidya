import { describe, expect, it } from "vitest";
import { updateReloadDecision, validUpdateId } from "@/components/pwa/update-protocol";

describe("PWA client update loop guard", () => {
  it("claims without reloading on the first service worker installation", () => {
    expect(updateReloadDecision({
      hasController: false,
      hasReloaded: false,
      pendingUpdateId: null,
      appliedUpdateId: null,
    })).toBe("claim-only");
  });

  it("reloads once after an acknowledged update takes control", () => {
    expect(updateReloadDecision({
      hasController: true,
      hasReloaded: false,
      pendingUpdateId: "update_20260816",
      appliedUpdateId: null,
    })).toBe("reload");
  });

  it("ignores repeated controller changes for the same update", () => {
    expect(updateReloadDecision({
      hasController: true,
      hasReloaded: false,
      pendingUpdateId: "update_20260816",
      appliedUpdateId: "update_20260816",
    })).toBe("ignore");
    expect(updateReloadDecision({
      hasController: true,
      hasReloaded: true,
      pendingUpdateId: "update_20260816",
      appliedUpdateId: null,
    })).toBe("ignore");
  });

  it("rejects malformed update identifiers", () => {
    expect(validUpdateId("short")).toBe(false);
    expect(validUpdateId("update with spaces")).toBe(false);
    expect(validUpdateId("update_20260816")).toBe(true);
  });
});
