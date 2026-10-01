import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db/request-limits", () => ({ consumeRequestLimit: vi.fn(async () => ({ ok: true, remaining: 19, resetAt: 10000, retryAfterSeconds: 0 })) }));
const m = vi.hoisted(() => ({ auth: vi.fn(), user: vi.fn(), recent: vi.fn(), enroll: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: m.auth, currentUser: m.user }));
vi.mock("@/lib/auth/clerk-config", () => ({ clerkConfigured: true }));
vi.mock("@/lib/auth/reverification", () => ({ requireRecentAccountReverification: m.recent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: () => true }));
vi.mock("@/lib/db/parent-enrollment", () => ({ enrollParent: m.enroll }));
import { POST } from "./route";
import { __resetRateLimiter } from "@/lib/api/guard";
import { PARENT_ACKNOWLEDGEMENT_VERSION } from "@/lib/auth/parent-enrollment-contract";
const payload = { adultGuardianAttestation: true, acknowledgementVersion: PARENT_ACKNOWLEDGEMENT_VERSION };
const user = {
  id: "account", firstName: "Guardian", publicMetadata: {},
  primaryEmailAddress: { id: "email-id", emailAddress: "adult@example.test", verification: { status: "verified" } },
};
function request(body: unknown = payload, origin = "https://vidya.test") {
  return new Request("https://vidya.test/api/account/parent-enrollment", {
    method: "POST", headers: { origin }, body: JSON.stringify(body),
  });
}
beforeEach(() => {
  vi.resetAllMocks(); __resetRateLimiter();
  m.auth.mockResolvedValue({ userId: "account", sessionId: "session" });
  m.user.mockResolvedValue(user); m.recent.mockResolvedValue(null); m.enroll.mockResolvedValue(true);
});
describe("explicit parent enrollment", () => {
  it.each([{ userId: null, sessionId: null }, { userId: "account", sessionId: null }])("requires an authenticated Clerk session", async (identity) => {
    m.auth.mockResolvedValue(identity);
    expect((await POST(request())).status).toBe(401);
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it.each([null, { ...user, id: "another-account" }])("rejects absent or mismatched currentUser", async (value) => {
    m.user.mockResolvedValue(value);
    expect((await POST(request())).status).toBe(401);
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it.each([null, { id: "email-id", emailAddress: "unverified@example.test", verification: { status: "unverified" } }])("requires server-verified primary email", async (email) => {
    m.user.mockResolvedValue({ ...user, primaryEmailAddress: email });
    expect((await POST(request())).status).toBe(403);
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it.each([{}, { ...payload, adultGuardianAttestation: false }, { ...payload, acknowledgementVersion: "old" }, { ...payload, role: "parent" }, { ...payload, userId: "someone-else" }, { ...payload, email: "forged@example.test" }])("requires exact versioned attestation and rejects extra fields", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it("requires recent strict reverification", async () => {
    m.recent.mockResolvedValue(Response.json({ clerk_error: { reason: "reverification-error" } }, { status: 403 }));
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(await response.json()).toHaveProperty("clerk_error");
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it("passes authenticated evidence only, never metadata as authority", async () => {
    m.user.mockResolvedValue({ ...user, publicMetadata: { role: "parent" } });
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(m.enroll).toHaveBeenCalledWith({ userId: "account", sessionId: "session", email: "adult@example.test", emailId: "email-id", displayName: "Guardian" });
  });
  it("honors persistent learner rejection after revocation despite parent metadata", async () => {
    m.user.mockResolvedValue({ ...user, publicMetadata: { role: "parent" } });
    m.enroll.mockResolvedValue(false);
    const response = await POST(request());
    expect(response.status).toBe(409);
    expect(await response.json()).toHaveProperty("code", "learner_account");
  });
  it("uses learner metadata only as an additional denial", async () => {
    m.user.mockResolvedValue({ ...user, publicMetadata: { role: "learner" } });
    expect((await POST(request())).status).toBe(409);
    expect(m.enroll).not.toHaveBeenCalled();
  });
  it("allows idempotent existing-parent responses through the same checks", async () => {
    expect((await POST(request())).status).toBe(200);
    expect((await POST(request())).status).toBe(200);
    expect(m.recent).toHaveBeenCalledTimes(2);
  });
  it("rejects cross-origin requests before authentication", async () => {
    expect((await POST(request(payload, "https://other.test"))).status).toBe(403);
    expect(m.auth).not.toHaveBeenCalled();
  });
  it("fails closed on database or Clerk errors", async () => {
    m.enroll.mockRejectedValue(new Error("internal-details"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("internal-details");
  });
});
