import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  deleteAiConnectionForParent: vi.fn(),
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
vi.mock("@/lib/db/ai-connections", () => ({
  deleteAiConnectionForParent: mocks.deleteAiConnectionForParent,
}));

import { DELETE } from "./route";

const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";

function request() {
  return new Request(`https://vidya.example/api/parent/ai-connections/${CONNECTION_ID}`, {
    method: "DELETE",
  });
}

function context(id = CONNECTION_ID) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 10, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.deleteAiConnectionForParent.mockResolvedValue({ id: CONNECTION_ID });
});

describe("DELETE parent AI connection", () => {
  it("requires recent Clerk reverification before deleting", async () => {
    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);

    const response = await DELETE(request(), context());

    expect(response).toBe(challenge);
    expect(mocks.deleteAiConnectionForParent).not.toHaveBeenCalled();
  });

  it("masks malformed, missing, and cross-family ids as not found", async () => {
    expect((await DELETE(request(), context("not-a-uuid"))).status).toBe(404);
    expect(mocks.deleteAiConnectionForParent).not.toHaveBeenCalled();

    mocks.deleteAiConnectionForParent.mockResolvedValue(null);
    expect((await DELETE(request(), context())).status).toBe(404);
    expect(mocks.deleteAiConnectionForParent).toHaveBeenCalledWith(
      "parent-a",
      CONNECTION_ID,
      "parent-a",
    );
  });

  it("deletes only through the ownership-scoped query", async () => {
    const response = await DELETE(request(), context());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ deleted: true });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.deleteAiConnectionForParent).toHaveBeenCalledWith(
      "parent-a",
      CONNECTION_ID,
      "parent-a",
    );
  });
});
