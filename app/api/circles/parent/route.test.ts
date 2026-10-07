import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ requireParent: vi.fn(), dbConfigured: vi.fn(), isSameOrigin: vi.fn(), rateLimit: vi.fn(), parentOwnsCircleLearner: vi.fn(), createCircleInvite: vi.fn(), acceptCircleInvite: vi.fn(), reviewCircleCard: vi.fn(), closeCircleForParent: vi.fn(), cardsForLearner: vi.fn(), circlesForLearner: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: mocks.isSameOrigin, rateLimit: mocks.rateLimit, rateHeaders: () => ({}) }));
vi.mock("@/lib/db/circles", () => mocks);
import { GET, POST } from "./route";
const learnerId = "00000000-0000-4000-8000-000000000001";
const request = (body: unknown) => new Request("https://vidya.example/api/circles/parent", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
beforeEach(() => { vi.resetAllMocks(); mocks.dbConfigured.mockReturnValue(true); mocks.isSameOrigin.mockReturnValue(true); mocks.requireParent.mockResolvedValue({ userId: "actual-parent" }); mocks.rateLimit.mockResolvedValue({ ok: true }); });
describe("parent circle approval boundary", () => {
  it("requires parent authentication before issuing an invitation", async () => { mocks.requireParent.mockResolvedValue(null); expect((await POST(request({ action: "invite", learnerId, alias: "Curious Crane" }))).status).toBe(401); expect(mocks.createCircleInvite).not.toHaveBeenCalled(); });
  it("verifies learner ownership before revealing pending cards", async () => { mocks.parentOwnsCircleLearner.mockResolvedValue(false); const response = await GET(new Request(`https://vidya.example/api/circles/parent?learnerId=${learnerId}`)); expect(response.status).toBe(404); expect(mocks.cardsForLearner).not.toHaveBeenCalled(); });
  it("uses actual server parent identity for card approval", async () => { mocks.reviewCircleCard.mockResolvedValue(true); const response = await POST(request({ action: "review", cardId: learnerId, approved: true })); expect(response.status).toBe(200); expect(mocks.reviewCircleCard).toHaveBeenCalledWith("actual-parent", learnerId, true); });
  it("rejects an asserted parent identity in the body", async () => { const response = await POST(request({ action: "review", cardId: learnerId, approved: true, parentId: "other-parent" })); expect(response.status).toBe(400); expect(mocks.reviewCircleCard).not.toHaveBeenCalled(); });
  it("checks origin before any parent-authenticated mutation", async () => { mocks.isSameOrigin.mockReturnValue(false); expect((await POST(request({ action: "invite", learnerId, alias: "Curious Crane" }))).status).toBe(403); expect(mocks.requireParent).not.toHaveBeenCalled(); });
});
