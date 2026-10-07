import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ requireLearnerFrom: vi.fn(), dbConfigured: vi.fn(), isSameOrigin: vi.fn(), rateLimit: vi.fn(), requestCircleCard: vi.fn(), cardsForLearner: vi.fn(), circlesForLearner: vi.fn(), closeCircleForLearner: vi.fn(), reactToCircleCard: vi.fn(), reportCircle: vi.fn(), unshareCircleCard: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireLearnerFrom: mocks.requireLearnerFrom }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: mocks.isSameOrigin, rateLimit: mocks.rateLimit, rateHeaders: () => ({}) }));
vi.mock("@/lib/db/circles", () => mocks);
import { GET, POST } from "./route";
const circleId = "00000000-0000-4000-8000-000000000001";
const request = (body: unknown) => new Request("https://vidya.example/api/circles/learner", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json", "x-vidya-device": "synthetic-token" } });
beforeEach(() => { vi.resetAllMocks(); mocks.dbConfigured.mockReturnValue(true); mocks.isSameOrigin.mockReturnValue(true); mocks.requireLearnerFrom.mockResolvedValue({ learner: { id: "actual-server-learner" } }); mocks.rateLimit.mockResolvedValue({ ok: true }); mocks.requestCircleCard.mockResolvedValue(true); });
describe("learner circle authorization", () => {
  it("denies revoked/unlinked devices before any card operation", async () => { mocks.requireLearnerFrom.mockResolvedValue(null); expect((await POST(request({ action: "share", circleId, projectId: "project" }))).status).toBe(401); expect(mocks.requestCircleCard).not.toHaveBeenCalled(); });
  it("uses the authenticated learner identity and stored project id only", async () => { const response = await POST(request({ action: "share", circleId, projectId: "project" })); expect(response.status).toBe(200); expect(mocks.requestCircleCard).toHaveBeenCalledWith("actual-server-learner", circleId, "project"); expect(response.headers.get("cache-control")).toBe("private, no-store"); });
  it("rejects forged card snapshots before querying stored creations", async () => { expect((await POST(request({ action: "share", circleId, projectId: "project", snapshot: {} }))).status).toBe(400); expect(mocks.requestCircleCard).not.toHaveBeenCalled(); });
  it("fails closed for an unavailable shared request limiter", async () => { mocks.rateLimit.mockResolvedValue({ unavailable: true }); expect((await POST(request({ action: "share", circleId, projectId: "project" }))).status).toBe(503); expect(mocks.requestCircleCard).not.toHaveBeenCalled(); });
  it("does not show a parent's pending invitation to children", async () => { mocks.circlesForLearner.mockResolvedValue([{ id: circleId, status: "pending" }, { id: "active", status: "active" }]); mocks.cardsForLearner.mockResolvedValue([]); const body = await (await GET(new Request("https://vidya.example/api/circles/learner"))).json(); expect(body.circles).toEqual([{ id: "active", status: "active" }]); });
});
