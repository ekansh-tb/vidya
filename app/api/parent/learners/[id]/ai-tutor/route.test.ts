import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  getLearnerForParent: vi.fn(),
  getLearnerAiAssignmentForParent: vi.fn(),
  setLearnerAiAssignmentForParent: vi.fn(),
  removeLearnerAiAssignmentForParent: vi.fn(),
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
vi.mock("@/lib/db/queries", () => ({ getLearnerForParent: mocks.getLearnerForParent }));
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  getLearnerAiAssignmentForParent: mocks.getLearnerAiAssignmentForParent,
  setLearnerAiAssignmentForParent: mocks.setLearnerAiAssignmentForParent,
  removeLearnerAiAssignmentForParent: mocks.removeLearnerAiAssignmentForParent,
}));

import { DELETE, GET, PUT } from "./route";

const LEARNER_ID = "11111111-1111-4111-8111-111111111111";
const PROFILE_ID = "22222222-2222-4222-8222-222222222222";
const assignment = {
  learnerId: LEARNER_ID,
  tutorProfileId: PROFILE_ID,
  enabled: true,
  dailyTurnLimit: 20,
  maxOutputTokens: 500,
  createdAt: "2026-08-16T10:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};
const input = {
  tutorProfileId: PROFILE_ID,
  enabled: true,
  dailyTurnLimit: 20,
  maxOutputTokens: 500,
};

function request(method: "GET" | "PUT" | "DELETE", body?: unknown) {
  return new Request(`https://vidya.example/api/parent/learners/${LEARNER_ID}/ai-tutor`, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function context(id = LEARNER_ID) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 10, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.getLearnerForParent.mockResolvedValue({ id: LEARNER_ID });
  mocks.getLearnerAiAssignmentForParent.mockResolvedValue(assignment);
  mocks.setLearnerAiAssignmentForParent.mockResolvedValue(assignment);
  mocks.removeLearnerAiAssignmentForParent.mockResolvedValue(true);
});

describe("parent learner AI assignment", () => {
  it("enforces origin, storage, and parent authentication guards", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await GET(request("GET"), context())).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await GET(request("GET"), context())).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await GET(request("GET"), context())).status).toBe(401);
    expect(mocks.getLearnerForParent).not.toHaveBeenCalled();
  });

  it("returns an owned learner's assignment or an explicit null", async () => {
    const response = await GET(request("GET"), context());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ assignment });

    mocks.getLearnerAiAssignmentForParent.mockResolvedValue(null);
    expect(await (await GET(request("GET"), context())).json()).toEqual({ assignment: null });
  });

  it("masks malformed and cross-family learner IDs as not found", async () => {
    expect((await GET(request("GET"), context("bad-id"))).status).toBe(404);
    expect(mocks.getLearnerForParent).not.toHaveBeenCalled();

    mocks.getLearnerForParent.mockResolvedValue(null);
    expect((await GET(request("GET"), context())).status).toBe(404);
    expect(mocks.getLearnerAiAssignmentForParent).not.toHaveBeenCalled();
  });

  it("requires recent Clerk reverification before reading assignment input", async () => {
    const challenge = Response.json({ clerk_error: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);
    expect(await PUT(request("PUT", input), context())).toBe(challenge);
    expect(mocks.setLearnerAiAssignmentForParent).not.toHaveBeenCalled();
  });

  it("rate limits assignment changes before reverification", async () => {
    mocks.rateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 1 });
    mocks.rateHeaders.mockReturnValue({ "retry-after": "60" });

    const response = await PUT(request("PUT", input), context());
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(mocks.requireRecentParentReverification).not.toHaveBeenCalled();
    expect(mocks.setLearnerAiAssignmentForParent).not.toHaveBeenCalled();
  });

  it("strictly validates limits and bounds request size", async () => {
    expect((await PUT(request("PUT", { ...input, dailyTurnLimit: 61 }), context())).status)
      .toBe(400);
    expect((await PUT(request("PUT", { ...input, maxOutputTokens: 127 }), context())).status)
      .toBe(400);
    expect(mocks.setLearnerAiAssignmentForParent).not.toHaveBeenCalled();

    const oversized = new Request(
      `https://vidya.example/api/parent/learners/${LEARNER_ID}/ai-tutor`,
      { method: "PUT", headers: { "content-length": "3000" }, body: "{}" },
    );
    expect((await PUT(oversized, context())).status).toBe(413);
  });

  it("saves only through the same-parent assignment query", async () => {
    const response = await PUT(request("PUT", input), context());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ assignment });
    expect(mocks.setLearnerAiAssignmentForParent).toHaveBeenCalledWith({
      parentId: "parent-a",
      actorId: "parent-a",
      learnerId: LEARNER_ID,
      ...input,
    });

    mocks.setLearnerAiAssignmentForParent.mockResolvedValue(null);
    expect((await PUT(request("PUT", input), context())).status).toBe(409);
  });

  it("removes an owned assignment and reports an already-empty state", async () => {
    const response = await DELETE(request("DELETE"), context());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ deleted: true });
    expect(mocks.removeLearnerAiAssignmentForParent)
      .toHaveBeenCalledWith("parent-a", LEARNER_ID, "parent-a");

    mocks.removeLearnerAiAssignmentForParent.mockResolvedValue(false);
    expect(await (await DELETE(request("DELETE"), context())).json()).toEqual({ deleted: false });
  });
});
