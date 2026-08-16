import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  pauseAllLearnerAiAssignmentsForParent: vi.fn(),
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
  pauseAllLearnerAiAssignmentsForParent: mocks.pauseAllLearnerAiAssignmentsForParent,
}));

import { POST } from "./route";

function request() {
  return new Request("https://vidya.example/api/parent/ai-tutors/pause-all", {
    method: "POST",
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 4, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.pauseAllLearnerAiAssignmentsForParent.mockResolvedValue(3);
});

describe("POST family AI pause", () => {
  it("requires same origin, storage, and a parent session", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await POST(request())).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await POST(request())).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await POST(request())).status).toBe(401);
    expect(mocks.pauseAllLearnerAiAssignmentsForParent).not.toHaveBeenCalled();
  });

  it("rate limits before asking for recent reverification", async () => {
    mocks.rateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 1 });

    expect((await POST(request())).status).toBe(429);
    expect(mocks.requireRecentParentReverification).not.toHaveBeenCalled();
  });

  it("requires recent parent reverification before changing assignments", async () => {
    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);

    expect(await POST(request())).toBe(challenge);
    expect(mocks.pauseAllLearnerAiAssignmentsForParent).not.toHaveBeenCalled();
  });

  it("pauses only through the parent-scoped database operation", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ pausedAssignments: 3 });
    expect(mocks.pauseAllLearnerAiAssignmentsForParent).toHaveBeenCalledWith(
      "parent-a",
      "parent-a",
    );
  });

  it("returns a bounded failure without internal details", async () => {
    mocks.pauseAllLearnerAiAssignmentsForParent.mockRejectedValue(new Error("database detail"));

    const response = await POST(request());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Could not pause learner AI access" });
  });
});
