import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "./game-store";
import {
  buildParentReportResponse,
  chooseParentReportState,
  parseParentReportResponse,
  type ParentReportLoadState,
} from "./parent-report";
import type { GameState } from "./types";

const UPDATED_AT = "2026-08-16T10:15:30.000Z";

function syncedState() {
  return {
    ...DEFAULT_STATE,
    progress: {
      maths: { fractions: { attempts: 8, correct: 6, mastery: 75 } },
    },
    stats: {
      ...DEFAULT_STATE.stats,
      totalAnswered: 8,
      totalCorrect: 6,
      quizzesCompleted: 2,
      dailyQuestsCompleted: 1,
    },
    streak: 4,
    longestStreak: 7,
    inventory: { hint: 999, fiftyFifty: 999, freeze: 999, doubleXp: 999 },
    missedQuestions: [
      {
        id: "miss-1",
        q: "What is one half of eight?",
        given: "2",
        correct: "4",
        ex: "Divide eight into two equal groups.",
        subjectId: "maths",
        topicId: "fractions",
        missedAt: UPDATED_AT,
      },
    ],
    dailyReflections: [
      {
        date: "2026-08-15",
        body: "This must remain private",
        savedAt: UPDATED_AT,
        private: true,
      },
      {
        date: "2026-08-16",
        body: "Fractions became easier today",
        savedAt: "2026-08-16T11:15:30.000Z",
      },
    ],
  };
}

describe("parent report response minimization", () => {
  it("returns only reporting fields and removes private reflection bodies", () => {
    const response = buildParentReportResponse({
      state: syncedState(),
      revision: 3,
      updatedAt: UPDATED_AT,
    });

    expect(response.status).toBe("ready");
    if (response.status !== "ready") return;

    expect(response.state).not.toHaveProperty("inventory");
    expect(response.state.missedQuestions[0]).toEqual({
      id: "miss-1",
      q: "What is one half of eight?",
      subjectId: "maths",
      topicId: "fractions",
      missedAt: UPDATED_AT,
    });
    expect(response.state.dailyReflections[0]).toEqual({
      date: "2026-08-15",
      savedAt: UPDATED_AT,
      private: true,
    });
    expect(JSON.stringify(response)).not.toContain("This must remain private");
    expect(response.state.dailyReflections[1]).toMatchObject({
      private: false,
      body: "Fractions became easier today",
    });
  });

  it("marks malformed stored state unavailable without returning it", () => {
    const response = buildParentReportResponse({
      state: { ...syncedState(), stats: { totalAnswered: "eight" }, secret: "do not leak" },
      revision: 3,
      updatedAt: UPDATED_AT,
    });

    expect(response).toEqual({ status: "unavailable" });
    expect(JSON.stringify(response)).not.toContain("do not leak");
  });

  it("distinguishes an owned learner with no synced state", () => {
    expect(buildParentReportResponse({ state: null, revision: 0, updatedAt: null })).toEqual({
      status: "absent",
      state: null,
      revision: 0,
      updatedAt: null,
    });
  });

  it("rejects malformed client responses", () => {
    expect(parseParentReportResponse({ status: "ready", state: { streak: 3 } })).toBeNull();
    expect(parseParentReportResponse({ status: "unknown" })).toBeNull();
  });

  it("drops a private body even if an untrusted response tries to include it", () => {
    const response = buildParentReportResponse({
      state: syncedState(),
      revision: 3,
      updatedAt: UPDATED_AT,
    });
    if (response.status !== "ready") throw new Error("fixture must be valid");
    const untrusted = structuredClone(response) as unknown as {
      state: { dailyReflections: Array<Record<string, unknown>> };
    };
    untrusted.state.dailyReflections[0].body = "injected private words";

    const parsed = parseParentReportResponse(untrusted);

    expect(parsed?.status).toBe("ready");
    expect(JSON.stringify(parsed)).not.toContain("injected private words");
  });
});

describe("parent report source decisions", () => {
  const localState: GameState = {
    ...DEFAULT_STATE,
    streak: 1,
    longestStreak: 2,
    stats: { ...DEFAULT_STATE.stats, totalAnswered: 1 },
  };

  it("prefers validated remote reporting fields without mutating local state", () => {
    const response = buildParentReportResponse({
      state: syncedState(),
      revision: 3,
      updatedAt: UPDATED_AT,
    });
    if (response.status !== "ready") throw new Error("fixture must be valid");

    const decision = chooseParentReportState(localState, {
      status: "ready",
      state: response.state,
      revision: response.revision,
      updatedAt: response.updatedAt,
    });

    expect(decision.source).toBe("remote");
    expect(decision.state.streak).toBe(4);
    expect(decision.state.stats.totalAnswered).toBe(8);
    expect(decision.state.inventory).toBe(localState.inventory);
    expect(decision.state.dailyReflections[0].body).toBe("");
    expect(localState.streak).toBe(1);
  });

  it.each([
    "unlinked",
    "loading",
    "absent",
    "unavailable",
  ] as const)("uses the unchanged local state when remote status is %s", (status) => {
    const remote: ParentReportLoadState = { status };
    const decision = chooseParentReportState(localState, remote);

    expect(decision.source).toBe("local");
    expect(decision.state).toBe(localState);
    expect(decision.fallbackReason).toBe(status);
  });
});
