import { beforeEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
const sql = vi.hoisted(() => vi.fn());
vi.mock("./client", () => ({ getSql: () => sql }));
import { hashAccountLinkToken, requestAccountLink, approveAccountLink, revokeAccountLink, learnerAccountLinkStatus, parentAccountLinkStatus } from "./account-links";
beforeEach(() => vi.resetAllMocks());
it("domain-separates account pairing from device token hashes", () => {
  expect(hashAccountLinkToken("secret")).not.toBe(createHash("sha256").update("secret").digest("hex"));
});
it("stores only a hash of a random 256-bit token", async () => {
  sql.mockResolvedValue([{ expires_at: "2026-10-01T00:10:00Z" }]);
  const first = await requestAccountLink("child");
  const second = await requestAccountLink("child");
  expect(first?.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(first?.token).not.toBe(second?.token);
  expect(sql.mock.calls[0].slice(1)).toEqual(["child", hashAccountLinkToken(first!.token)]);
});
it("approval and revocation accept only an explicit database success", async () => {
  sql.mockResolvedValue([]);
  expect(await approveAccountLink("owner", "learner", "token", "child")).toBe(false);
  expect(await revokeAccountLink("owner", "learner")).toBe(false);
});
it("keeps a revoked learner classified even if a parent row also exists", async () => {
  sql.mockResolvedValue([{ classified: "child", revoked_at: new Date(), is_parent: true }]);
  expect(await learnerAccountLinkStatus("child")).toEqual({ status: "revoked" });
});
it("uses database expiry for pending requests and exposes no token", async () => {
  sql.mockResolvedValue([{ classified: "child", expires_at: "2026-10-01T00:10:00Z", pending_valid: false, token_hash: "hidden" }]);
  expect(await learnerAccountLinkStatus("child")).toEqual({ status: "expired", expiresAt: "2026-10-01T00:10:00.000Z" });
});
it("returns only the linked learner and guardian display names", async () => {
  sql.mockResolvedValue([{ learner_id: "private", learner_name: "Learner", guardian_name: "Guardian" }]);
  expect(await learnerAccountLinkStatus("child")).toEqual({ status: "linked", learnerName: "Learner", guardianName: "Guardian" });
});
it("scopes parent status by both learner and parent and fails closed on no row", async () => {
  sql.mockResolvedValue([]);
  expect(await parentAccountLinkStatus("owner", "learner")).toBeNull();
  expect(sql.mock.calls[0].slice(1)).toEqual(["learner", "owner"]);
});
