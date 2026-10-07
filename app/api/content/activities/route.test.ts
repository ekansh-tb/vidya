import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ dbConfigured: vi.fn(), contentInitialized: vi.fn(), listContent: vi.fn(), publishedActivity: vi.fn() }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/db/admin", () => mocks);
import { GET } from "./route";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
const request = (query: string) => new Request(`https://vidyagyan.study/api/content/activities?${query}`);
describe("public publication selection", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.dbConfigured.mockReturnValue(true); mocks.contentInitialized.mockResolvedValue(true); });
  it("never enables an unlaunched grade", async () => { const r = await GET(request("placement=school:5&language=en")); expect(await r.json()).toEqual({ activities: [], initialized: true }); expect(mocks.listContent).not.toHaveBeenCalled(); });
  it("keeps authored fallback before import even when unrelated drafts exist", async () => { mocks.contentInitialized.mockResolvedValue(false); mocks.listContent.mockResolvedValue([{ status: "draft", payload: ACTIVITY_CATALOG[0] }]); expect((await GET(request("placement=nursery&language=en"))).status).toBe(503); expect(mocks.listContent).not.toHaveBeenCalled(); });
  it("excludes drafts, another placement and administrator review identity", async () => {
    mocks.listContent.mockResolvedValue([{ status: "draft", payload: ACTIVITY_CATALOG[0] }, { status: "published", payload: ACTIVITY_CATALOG.find(a => a.placements.includes("lkg")) }, { status: "published", payload: ACTIVITY_CATALOG[0], reviewedBy: "private-owner-id" }]);
    const r = await GET(request("placement=nursery&language=en")); const data = await r.json(); expect(data.activities).toHaveLength(1); expect(JSON.stringify(data)).not.toContain("private-owner-id");
  });
  it("allows an explicitly requested retained revision and rejects a wrong level", async () => {
    mocks.publishedActivity.mockResolvedValue(ACTIVITY_CATALOG[0]);
    expect((await GET(request(`placement=nursery&language=hi&id=${ACTIVITY_CATALOG[0].id}&revision=1`))).status).toBe(200);
    expect((await GET(request(`placement=lkg&language=hi&id=${ACTIVITY_CATALOG[0].id}&revision=1`))).status).toBe(404);
  });
  it("does not fallback from a valid empty published collection", async () => { mocks.listContent.mockResolvedValue([{ status: "archived", payload: ACTIVITY_CATALOG[0] }]); const r = await GET(request("placement=nursery&language=en")); expect(await r.json()).toEqual({ activities: [], initialized: true }); });
});
