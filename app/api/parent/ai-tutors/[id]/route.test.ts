import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  deleteAiTutorProfileForParent: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/auth/reverification", () => ({
  requireRecentParentReverification: mocks.requireRecentParentReverification,
}));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({
  isSameOrigin: mocks.isSameOrigin,
  clientKey: mocks.clientKey,
  rateLimit: mocks.rateLimit,
  rateHeaders: mocks.rateHeaders,
}));
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  deleteAiTutorProfileForParent: mocks.deleteAiTutorProfileForParent,
}));

import { DELETE } from "./route";

const PROFILE_ID = "11111111-1111-4111-8111-111111111111";
const request = () => new Request(`https://vidya.example/api/parent/ai-tutors/${PROFILE_ID}`, {
  method: "DELETE",
});
const context = (id = PROFILE_ID) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 10, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.deleteAiTutorProfileForParent.mockResolvedValue(true);
});

describe("DELETE parent AI tutor profile", () => {
  it("requires recent Clerk reverification", async () => {
    const challenge = Response.json({ clerk_error: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);
    expect(await DELETE(request(), context())).toBe(challenge);
    expect(mocks.deleteAiTutorProfileForParent).not.toHaveBeenCalled();
  });

  it("masks malformed, missing, and cross-family IDs as not found", async () => {
    expect((await DELETE(request(), context("bad-id"))).status).toBe(404);
    expect(mocks.deleteAiTutorProfileForParent).not.toHaveBeenCalled();

    mocks.deleteAiTutorProfileForParent.mockResolvedValue(false);
    expect((await DELETE(request(), context())).status).toBe(404);
  });

  it("deletes through the ownership-scoped query and returns JSON", async () => {
    const response = await DELETE(request(), context());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ deleted: true });
    expect(mocks.deleteAiTutorProfileForParent)
      .toHaveBeenCalledWith("parent-a", PROFILE_ID, "parent-a");
  });
});
