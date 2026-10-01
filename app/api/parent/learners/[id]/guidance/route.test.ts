import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ parent: vi.fn(), reverify: vi.fn(), configured: vi.fn(), owner: vi.fn(), append: vi.fn(), list: vi.fn(), rate: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.parent }));
vi.mock("@/lib/auth/reverification", () => ({ requireRecentParentReverification: mocks.reverify }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.configured }));
vi.mock("@/lib/db/queries", () => ({ getLearnerForParent: mocks.owner }));
vi.mock("@/lib/api/guard", async (original) => ({ ...await original<typeof import("@/lib/api/guard")>(), rateLimit: mocks.rate }));
vi.mock("@/lib/db/parent-guidance", async (original) => ({ ...await original<typeof import("@/lib/db/parent-guidance")>(), appendParentGuidance: mocks.append, listParentGuidance: mocks.list }));
import { GET, PUT } from "./route";
const id = "11111111-1111-4111-8111-111111111111";
const ctx = () => ({ params: Promise.resolve({ id }) });
const input = { expectedVersion: 0, content: "Use fraction bars", status: "approved" };
function req(method = "PUT", body: unknown = input, origin = "https://vidya.example") {
  return new Request(`https://vidya.example/api/parent/learners/${id}/guidance`, { method, headers: { origin, "content-type": "application/json" }, ...(method === "GET" ? {} : { body: JSON.stringify(body) }) });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.parent.mockResolvedValue({ userId: "parent-a" });
  mocks.reverify.mockResolvedValue(null);
  mocks.configured.mockReturnValue(true);
  mocks.owner.mockResolvedValue({ id });
  mocks.append.mockResolvedValue(true);
  mocks.list.mockResolvedValue({ versions: [], nextCursor: null });
  mocks.rate.mockReturnValue({ ok: true });
});
describe("owned learner guidance API", () => {
  it("scopes history limits to the authenticated parent separately from writes", async () => {
    await GET(req("GET"), ctx());
    expect(mocks.rate).toHaveBeenLastCalledWith("parent-guidance-read:parent-a", { limit: 60, windowMs: 600000 });
    await PUT(req(), ctx());
    expect(mocks.rate).toHaveBeenLastCalledWith("parent-guidance:parent-a", { limit: 30, windowMs: 600000 });
    mocks.parent.mockResolvedValue({ userId: "parent-b" });
    await GET(req("GET"), ctx());
    expect(mocks.rate).toHaveBeenLastCalledWith("parent-guidance-read:parent-b", { limit: 60, windowMs: 600000 });
  });
  it.each([false, true])("blocks history before ownership/database reads when unavailable=%s", async (unavailable) => {
    mocks.rate.mockResolvedValue({ ok: false, unavailable, remaining: 0, resetAt: Date.now() + 5000, retryAfterSeconds: 5 });
    const response = await GET(req("GET"), ctx());
    expect(response.status).toBe(unavailable ? 503 : 429);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("retry-after")).toBe("5");
    expect(mocks.owner).not.toHaveBeenCalled();
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("sanitizes thrown limiter failures as private 503", async () => {
    mocks.rate.mockRejectedValue(new Error("secret-store-diagnostic"));
    const response = await GET(req("GET"), ctx());
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.text()).not.toContain("secret-store-diagnostic");
    expect(mocks.owner).not.toHaveBeenCalled();
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("rejects unauthenticated history before allocating a limiter bucket", async () => {
    mocks.parent.mockResolvedValue(null);
    expect((await GET(req("GET"), ctx())).status).toBe(401);
    expect(mocks.rate).not.toHaveBeenCalled();
  });
  it("reads history privately using authenticated parent and owned learner", async () => {
    const response = await GET(req("GET"), ctx());
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mocks.owner).toHaveBeenCalledWith("parent-a", id);
    expect(mocks.list).toHaveBeenCalledWith("parent-a", id, { limit: 20 });
    expect(await response.json()).toEqual({ versions: [], nextCursor: null });
  });
  it("requires parent identity and ownership on reads and writes", async () => {
    for (const method of [GET, PUT]) {
      mocks.parent.mockResolvedValueOnce(null);
      expect((await method(req(method === GET ? "GET" : "PUT"), ctx())).status).toBe(401);
      mocks.owner.mockResolvedValueOnce(null);
      expect((await method(req(method === GET ? "GET" : "PUT"), ctx())).status).toBe(404);
    }
    expect(mocks.append).not.toHaveBeenCalled();
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("blocks cross-origin writes before identity resolution", async () => {
    expect((await PUT(req("PUT", input, "https://evil.example"), ctx())).status).toBe(403);
    expect(mocks.parent).not.toHaveBeenCalled();
  });
  it("rejects absent origins, opaque origins and mismatched schemes", async () => {
    for (const origin of ["null", "http://vidya.example"]) {
      expect((await PUT(req("PUT", input, origin), ctx())).status).toBe(403);
    }
    const missing = req();
    missing.headers.delete("origin");
    expect((await PUT(missing, ctx())).status).toBe(403);
    expect(mocks.append).not.toHaveBeenCalled();
  });
  it("requires recent reverification even for withdrawal", async () => {
    mocks.reverify.mockResolvedValue(Response.json({ reverification: true }, { status: 403 }));
    const response = await PUT(req("PUT", { expectedVersion: 1, status: "withdrawn", content: "" }), ctx());
    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mocks.append).not.toHaveBeenCalled();
  });
  it("rejects forged authority, empty and oversized input", async () => {
    for (const body of [{ ...input, parentId: "b" }, { ...input, learnerId: "b" }, { ...input, content: " " }, { ...input, content: "x".repeat(2001) }]) {
      expect((await PUT(req("PUT", body), ctx())).status).toBe(400);
    }
    expect((await PUT(req("PUT", { ...input, content: "x".repeat(17000) }), ctx())).status).toBe(413);
    expect(mocks.append).not.toHaveBeenCalled();
  });
  it("appends draft, approval, correction and withdrawal without deleting history", async () => {
    for (const status of ["draft", "approved", "withdrawn"]) {
      const body = { ...input, status, content: status === "withdrawn" ? "" : input.content };
      const response = await PUT(req("PUT", body), ctx());
      expect(response.status).toBe(200);
      expect(mocks.append).toHaveBeenLastCalledWith("parent-a", id, body);
    }
  });
  it("returns conflict for stale revisions and hides database errors", async () => {
    mocks.append.mockResolvedValueOnce(false);
    expect((await PUT(req(), ctx())).status).toBe(409);
    mocks.owner.mockRejectedValueOnce(new Error("private data"));
    const response = await PUT(req(), ctx());
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("private data");
  });
  it("rate limits writes and fails closed without storage", async () => {
    mocks.rate.mockReturnValue({ ok: false, remaining: 0, resetAt: Date.now() + 10000 });
    expect((await PUT(req(), ctx())).status).toBe(429);
    mocks.configured.mockReturnValue(false);
    expect((await GET(req("GET"), ctx())).status).toBe(503);
    expect(mocks.append).not.toHaveBeenCalled();
  });
  it("returns cursor pages and rechecks ownership for older requests", async () => {
    const older = () => new Request(`${req("GET").url}?cursor=48&limit=50`, { headers: { origin: "https://vidya.example" } });
    mocks.list.mockResolvedValue({ versions: [{ version: 47 }], nextCursor: "47" });
    const response = await GET(older(), ctx());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ versions: [{ version: 47 }], nextCursor: "47" });
    expect(mocks.list).toHaveBeenCalledWith("parent-a", id, { cursor: "48", limit: 50 });
    mocks.list.mockClear();
    mocks.owner.mockResolvedValue(null);
    expect((await GET(older(), ctx())).status).toBe(404);
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("rejects malformed, duplicate and identity-bearing pagination parameters", async () => {
    for (const query of [
      "cursor=", "cursor=0", "cursor=-1", "cursor=01", "cursor=1.5", "cursor=1e2",
      "cursor=2147483648", "cursor=1&cursor=2", "limit=", "limit=0", "limit=51",
      "limit=1.5", "limit=1e1", "limit=20&limit=20", "parentId=forged", "offset=20",
    ]) {
      const request = new Request(`${req("GET").url}?${query}`, { headers: { origin: "https://vidya.example" } });
      const response = await GET(request, ctx());
      expect(response.status, query).toBe(400);
      expect(response.headers.get("cache-control")).toContain("no-store");
    }
    expect(mocks.list).not.toHaveBeenCalled();
  });
});
