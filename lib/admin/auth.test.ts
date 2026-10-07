import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), currentUser: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => mocks);
vi.mock("@/lib/auth/clerk-config", () => ({ clerkConfigured: true }));
import { ownerIds, requireOwner } from "./auth";
describe("owner authorization", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("VIDYA_ADMIN_CLERK_USER_IDS", "user_owner123"); });
  it("has no email or domain fallback", () => { expect([...ownerIds("owner@example.com, @example.com,user_valid123,bad-id")]).toEqual(["user_valid123"]); });
  it("fails closed with no configured owners", async () => { vi.stubEnv("VIDYA_ADMIN_CLERK_USER_IDS", ""); expect(await requireOwner()).toBeNull(); expect(mocks.auth).not.toHaveBeenCalled(); });
  it("rejects an ordinary signed-in parent", async () => { mocks.auth.mockResolvedValue({ userId: "user_parent456" }); expect(await requireOwner()).toBeNull(); expect(mocks.currentUser).not.toHaveBeenCalled(); });
  it("requires a matching current verified Clerk identity", async () => { mocks.auth.mockResolvedValue({ userId: "user_owner123" }); mocks.currentUser.mockResolvedValue({ id: "user_other789" }); expect(await requireOwner()).toBeNull(); });
  it("accepts only explicitly listed matching identity", async () => { mocks.auth.mockResolvedValue({ userId: "user_owner123" }); mocks.currentUser.mockResolvedValue({ id: "user_owner123" }); expect(await requireOwner()).toEqual({ userId: "user_owner123" }); });
});
