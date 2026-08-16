import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_STATE } from "@/lib/game-store";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  getLearnerStateForParent: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({ isSameOrigin: mocks.isSameOrigin }));
vi.mock("@/lib/db/queries", () => ({
  getLearnerStateForParent: mocks.getLearnerStateForParent,
}));

import { GET } from "./route";

const LEARNER_ID = "00000000-0000-4000-8000-000000000001";
const UPDATED_AT = "2026-08-16T10:15:30.000Z";

function request() {
  return new Request(`https://vidya.example/api/parent/learners/${LEARNER_ID}/state`);
}

function context(id = LEARNER_ID) {
  return { params: Promise.resolve({ id }) };
}

function validState() {
  return {
    ...DEFAULT_STATE,
    progress: {},
    stats: { ...DEFAULT_STATE.stats },
    streak: 3,
    longestStreak: 5,
    missedQuestions: [],
    dailyReflections: [{
      date: "2026-08-16",
      body: "private words",
      savedAt: UPDATED_AT,
      private: true,
    }],
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.getLearnerStateForParent.mockReset();
});

describe("GET parent learner state", () => {
  it("requires an authenticated parent before reading state", async () => {
    mocks.requireParent.mockResolvedValue(null);

    const response = await GET(request(), context());

    expect(response.status).toBe(401);
    expect(mocks.getLearnerStateForParent).not.toHaveBeenCalled();
  });

  it("passes the authenticated parent id into the ownership-scoped query", async () => {
    mocks.getLearnerStateForParent.mockResolvedValue({
      state: validState(),
      revision: 2,
      updatedAt: UPDATED_AT,
    });

    const response = await GET(request(), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.getLearnerStateForParent).toHaveBeenCalledWith("parent-a", LEARNER_ID);
    expect(body.status).toBe("ready");
    expect(JSON.stringify(body)).not.toContain("private words");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("returns 404 when the ownership-scoped query finds no learner", async () => {
    mocks.getLearnerStateForParent.mockResolvedValue(null);

    const response = await GET(request(), context());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not found" });
  });

  it("returns an absent report for an owned learner with no sync row", async () => {
    mocks.getLearnerStateForParent.mockResolvedValue({
      state: null,
      revision: 0,
      updatedAt: null,
    });

    const response = await GET(request(), context());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "absent",
      state: null,
      revision: 0,
      updatedAt: null,
    });
  });

  it("fails closed when stored reporting fields are malformed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.getLearnerStateForParent.mockResolvedValue({
      state: { secret: "must not leave the server" },
      revision: 2,
      updatedAt: UPDATED_AT,
    });

    const response = await GET(request(), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "unavailable" });
    expect(JSON.stringify(body)).not.toContain("must not leave the server");
  });

  it("rejects malformed learner ids before querying storage", async () => {
    const response = await GET(request(), context("not-a-uuid"));

    expect(response.status).toBe(404);
    expect(mocks.getLearnerStateForParent).not.toHaveBeenCalled();
  });
});
