import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db/request-limits", () => ({ consumeRequestLimit: vi.fn(async () => ({ ok: true, remaining: 19, resetAt: 10000, retryAfterSeconds: 0 })) }));

const m = vi.hoisted(() => ({ parent: vi.fn(), recent: vi.fn(), inspect: vi.fn(), approve: vi.fn(), revoke: vi.fn(), status: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: m.parent }));
vi.mock("@/lib/auth/reverification", () => ({ requireRecentParentReverification: m.recent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: () => true }));
vi.mock("@/lib/db/account-links", () => ({ inspectAccountLink: m.inspect, approveAccountLink: m.approve, revokeAccountLink: m.revoke, parentAccountLinkStatus: m.status }));
import { GET, POST, DELETE } from "./route";
import { __resetRateLimiter } from "@/lib/api/guard";

const id = "11111111-1111-4111-8111-111111111111";
const ctx = () => ({ params: Promise.resolve({ id }) });
const token = "a".repeat(43);
const body = { action: "approve", token, expectedClerkUserId: "child" };
function request(value: unknown = body, method = "POST", origin = "https://vidya.test") {
  return new Request(`https://vidya.test/api/parent/learners/${id}/account-link`, {
    method, headers: { origin, "content-type": "application/json" },
    ...(method === "POST" ? { body: JSON.stringify(value) } : {}),
  });
}
beforeEach(() => {
  vi.resetAllMocks(); __resetRateLimiter();
  m.parent.mockResolvedValue({ kind: "parent", userId: "owner" });
  m.recent.mockResolvedValue(null);
  m.approve.mockResolvedValue(true); m.revoke.mockResolvedValue(true);
});

describe("parent account-link boundary", () => {
  it("reads account-link status only for the authenticated owner", async () => {
    m.status.mockResolvedValue({ clerkUserId: "child" });
    const response = await GET(request(undefined, "GET"), ctx());
    expect(await response.json()).toEqual({ parentId: "owner", clerkUserId: "child" });
    expect(m.status).toHaveBeenCalledWith("owner", id);
    expect(m.recent).not.toHaveBeenCalled();
  });
  it("does not disclose another family's link status", async () => {
    m.status.mockResolvedValue(null);
    expect((await GET(request(undefined, "GET"), ctx())).status).toBe(404);
  });
  it("does not read link status for a non-parent", async () => {
    m.parent.mockResolvedValue(null);
    expect((await GET(request(undefined, "GET"), ctx())).status).toBe(401);
    expect(m.status).not.toHaveBeenCalled();
  });
  it("passes only authenticated parent scope and reviewed subject", async () => {
    const response = await POST(request(), ctx());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(m.approve).toHaveBeenCalledWith("owner", id, token, "child");
    expect(await response.json()).toEqual({ ok: true });
  });
  it("inspect returns the candidate without binding", async () => {
    m.inspect.mockResolvedValue({ clerkUserId: "child" });
    expect(await (await POST(request({ action: "inspect", token }), ctx())).json()).toEqual({ clerkUserId: "child" });
    expect(m.approve).not.toHaveBeenCalled();
  });
  it.each([POST, DELETE])("requires parent authority", async (handler) => {
    m.parent.mockResolvedValue(null);
    expect((await handler(request(), ctx())).status).toBe(401);
    expect(m.recent).not.toHaveBeenCalled();
    expect(m.approve).not.toHaveBeenCalled(); expect(m.revoke).not.toHaveBeenCalled();
  });
  it.each([POST, DELETE])("requires recent reverification", async (handler) => {
    m.recent.mockResolvedValue(Response.json({ challenge: true }, { status: 403 }));
    expect((await handler(request(), ctx())).status).toBe(403);
    expect(m.approve).not.toHaveBeenCalled(); expect(m.revoke).not.toHaveBeenCalled();
  });
  it.each(["https://evil.test", "http://vidya.test", ""])("rejects origin %s", async (origin) => {
    expect((await POST(request(body, "POST", origin), ctx())).status).toBe(403);
    expect(m.parent).not.toHaveBeenCalled();
  });
  it.each([{ ...body, parentId: "other" }, { action: "approve", token }, { ...body, token: "ABC123" }, { ...body, role: "parent" }])("rejects injected or incomplete approval fields", async (value) => {
    expect((await POST(request(value), ctx())).status).toBe(400);
    expect(m.approve).not.toHaveBeenCalled();
  });
  it("rejects oversized streamed input", async () => {
    expect((await POST(request({ ...body, token: "a".repeat(3000) }), ctx())).status).toBe(400);
  });
  it("uses the same response for unavailable, replayed and foreign requests", async () => {
    m.approve.mockResolvedValue(false);
    expect((await POST(request(), ctx())).status).toBe(404);
  });
  it("revokes only within authenticated ownership scope", async () => {
    expect((await DELETE(request(undefined, "DELETE"), ctx())).status).toBe(200);
    expect(m.revoke).toHaveBeenCalledWith("owner", id);
  });
  it("does not expose database errors or tokens", async () => {
    m.approve.mockRejectedValue(new Error(token));
    const response = await POST(request(), ctx());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain(token);
  });
});
