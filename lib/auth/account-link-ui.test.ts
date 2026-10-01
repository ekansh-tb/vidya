import { describe, expect, it, vi } from "vitest";
import { canApproveAccount, parentLinkCommand, pairingRequestSchema, learnerLinkStatusSchema } from "./account-link-ui";
const token = "a".repeat(43);
const learnerId = "11111111-1111-4111-8111-111111111111";
const review = { token, clerkUserId: "reviewed-child", expiresAt: "2026-10-01T12:10:00Z" };
describe("pairing UI approval boundary", () => {
  it("requires inspection, deliberate confirmation, matching token and live expiry", () => {
    const now = Date.parse("2026-10-01T12:00:00Z");
    expect(canApproveAccount(null, token, true, now)).toBe(false);
    expect(canApproveAccount(review, token, false, now)).toBe(false);
    expect(canApproveAccount(review, "b".repeat(43), true, now)).toBe(false);
    expect(canApproveAccount(review, token, true, Date.parse(review.expiresAt))).toBe(false);
    expect(canApproveAccount(review, token, true, now)).toBe(true);
  });
  it("places pairing secrets and expected subject only in JSON bodies", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ok: true }));
    await parentLinkCommand(learnerId, { action: "approve", token, expectedClerkUserId: review.clerkUserId }, fetcher);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe(`/api/parent/learners/${learnerId}/account-link`);
    expect(String(url)).not.toContain(token);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ action: "approve", token, expectedClerkUserId: "reviewed-child" });
    expect(init?.cache).toBe("no-store");
  });
  it("revokes without sending any token or inspected account", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ok: true }));
    await parentLinkCommand(learnerId, { action: "revoke" }, fetcher);
    expect(fetcher.mock.calls[0][1]).toMatchObject({ method: "DELETE" });
    expect(fetcher.mock.calls[0][1]?.body).toBeUndefined();
  });
  it("preserves Clerk challenges for interactive reverification", async () => {
    const challenge = { clerk_error: { reason: "reverification-error" } };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(challenge, { status: 403 }));
    expect(await parentLinkCommand(learnerId, { action: "inspect", token }, fetcher)).toEqual({ ...challenge, httpStatus: 403 });
  });
  it("rejects malformed status and pairing responses", () => {
    expect(pairingRequestSchema.safeParse({ token: "device-code", expiresAt: "tomorrow" }).success).toBe(false);
    expect(learnerLinkStatusSchema.safeParse({ accountId: "child", status: "parent-approved" }).success).toBe(false);
  });
});
