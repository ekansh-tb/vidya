import { describe, expect, it } from "vitest";
import { learnerCircleRequest, parentCircleRequest } from "./contract";
const learnerId = "00000000-0000-4000-8000-000000000001";
describe("private circle request boundary", () => {
  it("rejects client-supplied artwork, ownership and unrestricted messages", () => {
    expect(learnerCircleRequest.safeParse({ action: "share", circleId: learnerId, projectId: "original", snapshot: { title: "forged" } }).success).toBe(false);
    expect(learnerCircleRequest.safeParse({ action: "share", circleId: learnerId, projectId: "original", learnerId }).success).toBe(false);
    expect(learnerCircleRequest.safeParse({ action: "message", circleId: learnerId, text: "hello" }).success).toBe(false);
  });
  it("restricts reactions, report reasons and pseudonyms to authored choices", () => {
    expect(learnerCircleRequest.safeParse({ action: "react", cardId: learnerId, reaction: "My full name" }).success).toBe(false);
    expect(learnerCircleRequest.safeParse({ action: "report", circleId: learnerId, reason: "unwanted-contact" }).success).toBe(true);
    expect(parentCircleRequest.safeParse({ action: "invite", learnerId, alias: "Child Full Name" }).success).toBe(false);
  });
  it("does not let children claim invitations or approve publishing", () => {
    expect(learnerCircleRequest.safeParse({ action: "accept", learnerId, alias: "Bright Maple", code: "a".repeat(32) }).success).toBe(false);
    expect(learnerCircleRequest.safeParse({ action: "review", cardId: learnerId, approved: true }).success).toBe(false);
    expect(parentCircleRequest.safeParse({ action: "accept", learnerId, alias: "Bright Maple", code: "a".repeat(32) }).success).toBe(true);
  });
});
