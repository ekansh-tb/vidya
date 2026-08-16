import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  usageForParent: vi.fn(),
  getLearnerAiAssignmentForParent: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: mocks.isSameOrigin }));
vi.mock("@/lib/db/queries", () => ({ usageForParent: mocks.usageForParent }));
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  getLearnerAiAssignmentForParent: mocks.getLearnerAiAssignmentForParent,
}));

import { GET } from "./route";

function request() {
  return new Request("https://vidya.example/api/parent/learners/learner-a/usage");
}

function context() {
  return { params: Promise.resolve({ id: "learner-a" }) };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.requireParent.mockResolvedValue({ userId: "parent-a" });
  mocks.usageForParent.mockResolvedValue([
    { day: "2026-08-16", capability: "ai.tutor.full", count: 4 },
  ]);
  mocks.getLearnerAiAssignmentForParent.mockResolvedValue({
    learnerId: "learner-a",
    tutorProfileId: "11111111-1111-4111-8111-111111111111",
    enabled: true,
    dailyTurnLimit: 12,
    maxOutputTokens: 480,
    createdAt: "2026-08-16T10:00:00.000Z",
    updatedAt: "2026-08-16T10:00:00.000Z",
  });
});

describe("GET parent learner usage", () => {
  it("returns the learner assignment limit with private caching", async () => {
    const response = await GET(request(), context());

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.usageForParent).toHaveBeenCalledWith("parent-a", "learner-a", 7);
    expect(mocks.getLearnerAiAssignmentForParent)
      .toHaveBeenCalledWith("parent-a", "learner-a");
    expect(await response.json()).toEqual({
      usage: [{ day: "2026-08-16", capability: "ai.tutor.full", count: 4 }],
      limits: {
        "ai.tutor.limited": 20,
        "ai.tutor.full": 12,
      },
    });
  });

  it("does not invent a full tutor limit when there is no assignment", async () => {
    mocks.getLearnerAiAssignmentForParent.mockResolvedValue(null);

    const response = await GET(request(), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.limits).toEqual({ "ai.tutor.limited": 20 });
    expect(body.limits).not.toHaveProperty("ai.tutor.full");
  });

  it("masks another family's learner id and skips the assignment lookup", async () => {
    mocks.usageForParent.mockResolvedValue(null);

    const response = await GET(request(), context());

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.getLearnerAiAssignmentForParent).not.toHaveBeenCalled();
  });

  it("requires same origin, storage, and a parent session", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await GET(request(), context())).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await GET(request(), context())).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await GET(request(), context())).status).toBe(401);
    expect(mocks.usageForParent).not.toHaveBeenCalled();
  });
});
