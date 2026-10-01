import { beforeEach, expect, it, vi } from "vitest";
vi.mock("@/lib/db/request-limits", () => ({ consumeRequestLimit: vi.fn(async () => ({ ok: true, remaining: 19, resetAt: 10000, retryAfterSeconds: 0 })) }));
const m = vi.hoisted(() => ({ auth: vi.fn(), request: vi.fn(), status: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: m.auth }));
vi.mock("@/lib/auth/clerk-config", () => ({ clerkConfigured: true }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: () => true }));
vi.mock("@/lib/db/account-links", () => ({ requestAccountLink: m.request, learnerAccountLinkStatus: m.status }));
import { GET, POST } from "./route";
import { __resetRateLimiter } from "@/lib/api/guard";
const request = (body: unknown = { learnerAccountAcknowledgement: true }) => new Request("https://vidya.test/api/account/learner-link", {
  method: "POST", headers: { origin: "https://vidya.test" }, body: JSON.stringify(body),
});
beforeEach(() => {
  vi.resetAllMocks(); __resetRateLimiter();
  m.auth.mockResolvedValue({ userId: "signed-child" });
  m.request.mockResolvedValue({ token: "secret", expiresAt: "later" });
  m.status.mockResolvedValue({ status: "unclassified" });
});
it("uses only the signed-in account and returns a non-cacheable token", async () => {
  const response = await POST(request());
  expect(response.status).toBe(201);
  expect(m.request).toHaveBeenCalledWith("signed-child");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
});
it("rejects caller-selected account ids or roles", async () => {
  expect((await POST(request({ userId: "parent", role: "learner" }))).status).toBe(400);
  expect(m.request).not.toHaveBeenCalled();
});
it("rejects unsigned callers", async () => {
  m.auth.mockResolvedValue({ userId: null });
  expect((await POST(request())).status).toBe(401);
  expect(m.request).not.toHaveBeenCalled();
});
it("fails closed for an existing parent or linked account", async () => {
  m.request.mockResolvedValue(null);
  expect((await POST(request())).status).toBe(409);
});
it.each([{}, { learnerAccountAcknowledgement: false }])("requires explicit learner classification acknowledgement", async (body) => {
  expect((await POST(request(body))).status).toBe(400);
  expect(m.request).not.toHaveBeenCalled();
});
it("status reads never classify an account and are scoped to auth", async () => {
  const response = await GET(new Request("https://vidya.test/api/account/learner-link?userId=other"));
  expect(await response.json()).toEqual({ accountId: "signed-child", status: "unclassified" });
  expect(m.status).toHaveBeenCalledWith("signed-child");
  expect(m.request).not.toHaveBeenCalled();
  expect(response.headers.get("cache-control")).toBe("private, no-store");
});
it("status reads require a session", async () => {
  m.auth.mockResolvedValue({ userId: null });
  expect((await GET(request())).status).toBe(401);
  expect(m.status).not.toHaveBeenCalled();
});
