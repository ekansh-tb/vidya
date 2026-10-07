import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ adminAccess: vi.fn(), listContent: vi.fn(), seedContent: vi.fn(), createDraft: vi.fn(), reviewContent: vi.fn(), publishContent: vi.fn(), archiveContent: vi.fn() }));
vi.mock("@/lib/admin/http", async (original) => ({ ...await original<typeof import("@/lib/admin/http")>(), adminAccess: mocks.adminAccess }));
vi.mock("@/lib/db/admin", () => mocks);
import { GET, POST } from "./route";
const request = (body: unknown) => new Request("https://vidyagyan.study/api/admin/content", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
describe("admin content boundaries", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.adminAccess.mockResolvedValue({ owner: { userId: "user_owner" } }); });
  it("never loads content for a denied owner", async () => { mocks.adminAccess.mockResolvedValue({ response: Response.json({ error: "Owner access required" }, { status: 403 }) }); expect((await GET(new Request("https://vidyagyan.study/api/admin/content"))).status).toBe(403); expect(mocks.listContent).not.toHaveBeenCalled(); });
  it("requires the complete review record", async () => { const r = await POST(request({ action: "review", id: "one", revision: 1, record: { checks: ["factual"], limitations: "Unknown" } })); expect(r.status).toBe(400); expect(mocks.reviewContent).not.toHaveBeenCalled(); });
  it("returns no-store for stale revision conflicts", async () => { mocks.publishContent.mockResolvedValue(false); const r = await POST(request({ action: "publish", id: "one", revision: 1 })); expect(r.status).toBe(409); expect(r.headers.get("cache-control")).toContain("no-store"); });
  it("passes only the authenticated owner to publishing", async () => { mocks.publishContent.mockResolvedValue(true); expect((await POST(request({ action: "publish", id: "one", revision: 2 }))).status).toBe(200); expect(mocks.publishContent).toHaveBeenCalledWith("user_owner", "one", 2); });
});
