import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ adminAccess: vi.fn(), revokeAdminDevice: vi.fn(), correctAdminPlacement: vi.fn() }));
vi.mock("@/lib/admin/http", async original => ({ ...await original<typeof import("@/lib/admin/http")>(), adminAccess: mocks.adminAccess }));
vi.mock("@/lib/db/admin", () => mocks);
import { POST } from "./route";
const parentId = "user_parent"; const learnerId = "d894bb01-ae83-4460-8b9f-1f672c48e9b1"; const deviceId = "f894bb01-ae83-4460-8b9f-1f672c48e9b1";
const req = (body: unknown) => new Request("https://vidyagyan.study/api/admin/operations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
describe("scoped owner support mutations", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.adminAccess.mockResolvedValue({ owner: { userId: "user_owner" } }); });
  it("requires confirmation before revoking a device", async () => { expect((await POST(req({ action: "revoke-device", parentId, learnerId, deviceId, confirmation: "yes" }))).status).toBe(400); expect(mocks.revokeAdminDevice).not.toHaveBeenCalled(); });
  it("passes explicit family and device scope to the database", async () => { mocks.revokeAdminDevice.mockResolvedValue(false); expect((await POST(req({ action: "revoke-device", parentId, learnerId, deviceId, confirmation: "REVOKE" }))).status).toBe(409); expect(mocks.revokeAdminDevice).toHaveBeenCalledWith("user_owner", parentId, learnerId, deviceId); });
  it("preserves grade13 compatibility with explicit board and confirmation", async () => { mocks.correctAdminPlacement.mockResolvedValue(true); const placement = { version: 1, kind: "school", grade: 13, board: "cambridge-igcse" }; expect((await POST(req({ action: "correct-placement", parentId, learnerId, placement, confirmation: "CORRECT PLACEMENT" }))).status).toBe(200); expect(mocks.correctAdminPlacement).toHaveBeenCalledWith("user_owner", parentId, learnerId, placement); });
  it("does not silently enable preschool corrections", async () => { vi.stubEnv("EARLY_YEARS_ENABLED", "false"); expect((await POST(req({ action: "correct-placement", parentId, learnerId, placement: { version: 1, kind: "early-years", level: "nursery" }, confirmation: "CORRECT PLACEMENT" }))).status).toBe(409); expect(mocks.correctAdminPlacement).not.toHaveBeenCalled(); });
});
