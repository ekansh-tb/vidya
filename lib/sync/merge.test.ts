import { describe, it, expect } from "vitest";
import { mergeGameState } from "./merge";
import { DEFAULT_STATE } from "../game-store";
import type { GameState } from "../types";

const base = (patch: Partial<GameState> = {}): GameState => ({ ...DEFAULT_STATE, ...patch });

describe("mergeGameState — never lose earned progress", () => {
  it("takes the higher XP and coins", () => {
    const out = mergeGameState(base({ xp: 100, coins: 10 }), base({ xp: 250, coins: 5 }));
    expect(out.xp).toBe(250);
    expect(out.coins).toBe(10);
  });

  it("unions badges from both devices", () => {
    const out = mergeGameState(base({ badges: ["a", "b"] }), base({ badges: ["b", "c"] }));
    expect(out.badges.sort()).toEqual(["a", "b", "c"]);
  });

  it("unions passport stamps and read books", () => {
    const out = mergeGameState(
      base({ passportStamps: ["mars"], readBooks: ["x"], rewardedBooks: ["x"] }),
      base({ passportStamps: ["moon"], readBooks: ["y"], rewardedBooks: ["y"] }),
    );
    expect(out.passportStamps.sort()).toEqual(["mars", "moon"]);
    expect(out.readBooks.sort()).toEqual(["x", "y"]);
    expect(out.rewardedBooks!.sort()).toEqual(["x", "y"]);
  });

  it("keeps the best per-topic mastery from either device", () => {
    const out = mergeGameState(
      base({ progress: { maths: { place: { attempts: 5, correct: 3, mastery: 60 } } } }),
      base({ progress: {
        maths: { place: { attempts: 2, correct: 2, mastery: 80 } },
        science: { forces: { attempts: 1, correct: 1, mastery: 100 } },
      } }),
    );
    expect(out.progress.maths.place).toEqual({ attempts: 5, correct: 3, mastery: 80 });
    expect(out.progress.science.forces.mastery, "a subject only on the remote must survive").toBe(100);
  });

  it("takes the max of every stats counter", () => {
    const out = mergeGameState(
      base({ stats: { ...DEFAULT_STATE.stats, totalAnswered: 40, quizzesCompleted: 2 } }),
      base({ stats: { ...DEFAULT_STATE.stats, totalAnswered: 10, quizzesCompleted: 9 } }),
    );
    expect(out.stats.totalAnswered).toBe(40);
    expect(out.stats.quizzesCompleted).toBe(9);
  });

  it("treats fastestQuiz as lower-is-better", () => {
    const out = mergeGameState(
      base({ stats: { ...DEFAULT_STATE.stats, fastestQuiz: 90 } }),
      base({ stats: { ...DEFAULT_STATE.stats, fastestQuiz: 45 } }),
    );
    expect(out.stats.fastestQuiz).toBe(45);
  });

  it("keeps a fastestQuiz that exists on only one side", () => {
    const out = mergeGameState(
      base({ stats: { ...DEFAULT_STATE.stats, fastestQuiz: null } }),
      base({ stats: { ...DEFAULT_STATE.stats, fastestQuiz: 30 } }),
    );
    expect(out.stats.fastestQuiz).toBe(30);
  });

  it("unions seen questions so a topic is not re-served", () => {
    const out = mergeGameState(
      base({ seenQuestions: { maths: { place: ["q1"] } } }),
      base({ seenQuestions: { maths: { place: ["q2"], other: ["q3"] } } }),
    );
    expect(out.seenQuestions.maths.place.sort()).toEqual(["q1", "q2"]);
    expect(out.seenQuestions.maths.other).toEqual(["q3"]);
  });
});

describe("mergeGameState — never drop what a child wrote", () => {
  it("keeps the longer notebook entry rather than clobbering", () => {
    const out = mergeGameState(
      base({ notebook: { maths: "short" } }),
      base({ notebook: { maths: "a much longer note written elsewhere", science: "remote only" } }),
    );
    expect(out.notebook.maths).toBe("a much longer note written elsewhere");
    expect(out.notebook.science).toBe("remote only");
  });

  it("does not shrink a local note when the remote is a stub", () => {
    const out = mergeGameState(
      base({ notebook: { maths: "a long local note that matters" } }),
      base({ notebook: { maths: "x" } }),
    );
    expect(out.notebook.maths).toBe("a long local note that matters");
  });

  it("unions reflections by date and keeps the local one on a clash", () => {
    const local = base({ dailyReflections: [{ date: "2026-08-10", body: "local", savedAt: "1", private: true }] });
    const remote = base({ dailyReflections: [
      { date: "2026-08-10", body: "remote", savedAt: "2" },
      { date: "2026-08-09", body: "older", savedAt: "0" },
    ] });
    const out = mergeGameState(local, remote);
    expect(out.dailyReflections).toHaveLength(2);
    expect(out.dailyReflections.find((r) => r.date === "2026-08-10")?.body).toBe("local");
    expect(out.dailyReflections.find((r) => r.date === "2026-08-09")?.body).toBe("older");
  });

  it("unions missed questions and compositions by id", () => {
    const out = mergeGameState(
      base({
        missedQuestions: [{ id: "m1", q: "?", given: "a", correct: "b", ex: "", missedAt: "1" }],
        savedCompositions: [{ id: "c1", name: "one", notes: [1], tempoMs: 200, createdAt: "1" }],
      }),
      base({
        missedQuestions: [{ id: "m2", q: "?", given: "a", correct: "b", ex: "", missedAt: "2" }],
        savedCompositions: [{ id: "c2", name: "two", notes: [2], tempoMs: 200, createdAt: "2" }],
      }),
    );
    expect(out.missedQuestions.map((m) => m.id).sort()).toEqual(["m1", "m2"]);
    expect(out.savedCompositions.map((c) => c.id).sort()).toEqual(["c1", "c2"]);
  });

  it("keeps the newer review schedule for a card held on both devices", () => {
    // A plain union by id kept whichever copy it walked first, which could
    // discard a review the other device had already recorded.
    const card = { id: "m1", q: "?", given: "a", correct: "b", ex: "", missedAt: "2026-08-01T00:00:00.000Z" };
    const out = mergeGameState(
      base({ missedQuestions: [{ ...card, box: 1, lastReviewedAt: "2026-08-10T00:00:00.000Z" }] }),
      base({ missedQuestions: [{ ...card, box: 3, lastReviewedAt: "2026-08-12T00:00:00.000Z" }] }),
    );
    expect(out.missedQuestions).toHaveLength(1);
    expect(out.missedQuestions[0].box).toBe(3);
  });

  it("a lapse on one device survives a promotion on the other", () => {
    // The outcome that must never be lost. Hiding a question the learner has
    // forgotten costs them the thing they were trying to learn; showing one
    // they know costs ten seconds.
    const card = { id: "m1", q: "?", given: "a", correct: "b", ex: "", missedAt: "2026-08-01T00:00:00.000Z" };
    const stamp = "2026-08-12T00:00:00.000Z";
    const out = mergeGameState(
      base({ missedQuestions: [{ ...card, box: 4, lastReviewedAt: stamp }] }),
      base({ missedQuestions: [{ ...card, box: 0, lastReviewedAt: stamp }] }),
    );
    expect(out.missedQuestions[0].box).toBe(0);
  });
});

describe("mergeGameState — the local device owns preferences", () => {
  it("does not let a remote copy flip settings", () => {
    const local = base({ settings: { ...DEFAULT_STATE.settings, sound: false, music: true } });
    const remote = base({ settings: { ...DEFAULT_STATE.settings, sound: true, music: false } });
    const out = mergeGameState(local, remote);
    expect(out.settings.sound).toBe(false);
    expect(out.settings.music).toBe(true);
  });

  it("keeps the local avatar and current subject", () => {
    const out = mergeGameState(
      base({ avatarId: "peacock", lastSubjectId: "cls-maths" }),
      base({ avatarId: "lion", lastSubjectId: "gk" }),
    );
    expect(out.avatarId).toBe("peacock");
    expect(out.lastSubjectId).toBe("cls-maths");
  });

  it("stays onboarded if either side is", () => {
    expect(mergeGameState(base({ onboarded: false }), base({ onboarded: true })).onboarded).toBe(true);
    expect(mergeGameState(base({ onboarded: true }), base({ onboarded: false })).onboarded).toBe(true);
  });
});

describe("mergeGameState — total and pure", () => {
  it("returns local unchanged for null/undefined remote", () => {
    const local = base({ xp: 7 });
    expect(mergeGameState(local, null)).toBe(local);
    expect(mergeGameState(local, undefined)).toBe(local);
  });

  it("survives a malformed remote payload without throwing", () => {
    const local = base({ xp: 7, badges: ["a"] });
    const junk = {
      xp: "not a number", badges: "nope", progress: 42,
      stats: null, inventory: "x", seenQuestions: [], notebook: 3,
    } as unknown as Partial<GameState>;
    const out = mergeGameState(local, junk);
    expect(out.xp, "garbage must not overwrite real progress").toBe(7);
    expect(out.badges).toEqual(["a"]);
    expect(out.progress).toEqual({});
  });

  it("does not mutate either input", () => {
    const local = base({ xp: 1, badges: ["a"] });
    const remote = base({ xp: 2, badges: ["b"] });
    const localCopy = JSON.parse(JSON.stringify(local));
    const remoteCopy = JSON.parse(JSON.stringify(remote));
    mergeGameState(local, remote);
    expect(local).toEqual(localCopy);
    expect(remote).toEqual(remoteCopy);
  });

  it("is idempotent — merging twice changes nothing further", () => {
    const local = base({ xp: 10, badges: ["a"] });
    const remote = base({ xp: 20, badges: ["b"] });
    const once = mergeGameState(local, remote);
    const twice = mergeGameState(once, remote);
    expect(twice).toEqual(once);
  });
});
