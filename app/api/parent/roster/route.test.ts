import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ parent: vi.fn(), list: vi.fn(), origin: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: m.parent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: () => true }));
vi.mock("@/lib/db/queries", () => ({ listLearnersForParent: m.list }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: m.origin }));
import { GET } from "./route";
const request = () => new Request("https://vidya.test/api/parent/roster?parentId=other-family");
beforeEach(() => {
  vi.resetAllMocks(); m.origin.mockReturnValue(true); m.parent.mockResolvedValue({ userId: "owner" }); m.list.mockResolvedValue([]);
});
it("rejects unauthorized callers without reading learners", async () => {
  m.parent.mockResolvedValue(null);
  expect((await GET(request())).status).toBe(401);
  expect(m.list).not.toHaveBeenCalled();
});
it("uses only authenticated ownership and excludes foreign rows and device metadata", async () => {
  m.list.mockResolvedValue([{ id: "owned", parentId: "owner", name: "Own child", localId: "private-local", clerkUserId: "private-clerk" }, { id: "foreign", parentId: "other-family", name: "Other child" }]);
  const response = await GET(request());
  expect(m.list).toHaveBeenCalledWith("owner");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  const text = await response.text();
  expect(text).toContain("Own child");
  expect(text).not.toMatch(/Other child|foreign|private-local|private-clerk/);
});
it("returns an empty roster for an empty family", async () => {
  expect(await (await GET(request())).json()).toEqual({ parentId: "owner", learners: [] });
});
it("returns a sanitized error on storage failure", async () => {
  m.list.mockRejectedValue(new Error("private-database-details"));
  const response = await GET(request());
  expect(response.status).toBe(503);
  expect(await response.text()).not.toContain("private-database-details");
});
it("rejects cross-origin callers", async () => {
  m.origin.mockReturnValue(false);
  expect((await GET(request())).status).toBe(403);
  expect(m.list).not.toHaveBeenCalled();
});
