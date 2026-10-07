import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ requireOwner: vi.fn(), dbConfigured: vi.fn(), isSameOrigin: vi.fn(), rateLimit: vi.fn() }));
vi.mock("./auth", () => ({ requireOwner: mocks.requireOwner }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: mocks.isSameOrigin, rateLimit: mocks.rateLimit }));
import { adminAccess, adminResponse, readAdminBody } from "./http";
describe("owner API request guards", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireOwner.mockResolvedValue({ userId: "user_owner" }); mocks.dbConfigured.mockReturnValue(true); mocks.isSameOrigin.mockReturnValue(true); mocks.rateLimit.mockResolvedValue({ ok: true }); });
  it("rejects cross-origin requests before reading identity", async () => { mocks.isSameOrigin.mockReturnValue(false); const r = await adminAccess(new Request("https://vidyagyan.study/api/admin/content"), true); expect(r.response?.status).toBe(403); expect(mocks.requireOwner).not.toHaveBeenCalled(); });
  it("does not permit a parent session without owner authorization", async () => { mocks.requireOwner.mockResolvedValue(null); const r = await adminAccess(new Request("https://vidyagyan.study/api/admin/learners")); expect(r.response?.status).toBe(403); expect(r.response?.headers.get("cache-control")).toContain("no-store"); });
  it("fails closed if the shared mutation quota is unavailable", async () => { mocks.rateLimit.mockResolvedValue({ ok: false, unavailable: true }); expect((await adminAccess(new Request("https://vidyagyan.study/api/admin/content"), true)).response?.status).toBe(503); });
  it("always excludes private responses from caching", () => { const r = adminResponse({ safe: true }); expect(r.headers.get("cache-control")).toBe("private, no-store"); expect(r.headers.get("vary")).toBe("Cookie"); });
  it("rejects non-JSON and oversized request bodies", async () => { await expect(readAdminBody(new Request("https://vidyagyan.study", { method: "POST", body: "test" }))).rejects.toThrow(); await expect(readAdminBody(new Request("https://vidyagyan.study", { method: "POST", headers: { "content-type": "application/json" }, body: '"' + "a".repeat(100001) + '"' }))).rejects.toThrow(); });
});
