// Regression guards for reward double-counting.
//
// These reproduce the exact award logic from the Library and Field Trip views.
// Both previously paid out every time an action was repeated, which inflates
// XP, and therefore level, badges, and every parent-facing metric derived from
// them. The logic lives inline in the views, so these tests mirror it rather
// than importing it — if a view's formula changes, update the mirror here and
// the intent below still holds.

import { describe, it, expect } from "vitest";

type Progress = {
  xp: number;
  coins: number;
  readBooks: string[];
  rewardedBooks?: string[];
  passportStamps: string[];
};

/** Mirrors toggleRead in components/views/library-view.tsx */
function toggleRead(p: Progress, bookId: string): Progress {
  const list = p.readBooks || [];
  const already = list.includes(bookId);
  const next = already ? list.filter((x) => x !== bookId) : [...list, bookId];
  const rewarded = p.rewardedBooks ?? list;
  const alreadyRewarded = rewarded.includes(bookId);
  const earns = !already && !alreadyRewarded;
  return {
    ...p,
    readBooks: next,
    rewardedBooks: earns ? [...rewarded, bookId] : rewarded,
    xp: earns ? p.xp + 20 : p.xp,
    coins: earns ? p.coins + 5 : p.coins,
  };
}

/** Mirrors finishTrip in components/views/field-trip-view.tsx */
function finishTrip(p: Progress, destId: string, correctCount: number): Progress {
  const firstVisit = !p.passportStamps?.includes(destId);
  const coinGain = 10 + correctCount * 5;
  return {
    ...p,
    xp: firstVisit ? p.xp + 30 : p.xp,
    coins: firstVisit ? p.coins + coinGain : p.coins,
    passportStamps: firstVisit ? [...(p.passportStamps || []), destId] : p.passportStamps,
  };
}

const fresh = (): Progress => ({ xp: 0, coins: 0, readBooks: [], rewardedBooks: [], passportStamps: [] });

describe("library reading rewards", () => {
  it("pays once for a first read", () => {
    const after = toggleRead(fresh(), "panchatantra");
    expect(after.xp).toBe(20);
    expect(after.coins).toBe(5);
    expect(after.readBooks).toEqual(["panchatantra"]);
  });

  it("does not pay again when toggled off and on — the farm bug", () => {
    let p = fresh();
    p = toggleRead(p, "panchatantra");   // +20
    p = toggleRead(p, "panchatantra");   // un-mark
    p = toggleRead(p, "panchatantra");   // re-mark: must NOT pay
    expect(p.xp, "re-marking a book must not re-award").toBe(20);
    expect(p.coins).toBe(5);
  });

  it("survives a long toggle spree without inflating XP", () => {
    let p = fresh();
    for (let i = 0; i < 50; i++) p = toggleRead(p, "book");
    expect(p.xp).toBe(20);
    expect(p.coins).toBe(5);
  });

  it("still pays for a genuinely different book", () => {
    let p = fresh();
    p = toggleRead(p, "a");
    p = toggleRead(p, "b");
    expect(p.xp).toBe(40);
  });

  it("grandfathers profiles created before rewardedBooks existed", () => {
    // Legacy profile: already read two books, no rewardedBooks field at all.
    const legacy: Progress = { xp: 40, coins: 10, readBooks: ["a", "b"], passportStamps: [] };
    let p = toggleRead(legacy, "a");  // un-mark
    p = toggleRead(p, "a");           // re-mark — must not pay a second time
    expect(p.xp, "the upgrade itself must not make old books farmable").toBe(40);
  });

  it("un-marking never refunds, so XP cannot go backwards", () => {
    let p = toggleRead(fresh(), "a");
    const before = p.xp;
    p = toggleRead(p, "a");
    expect(p.xp).toBe(before);
  });
});

describe("field trip rewards", () => {
  it("pays on the first visit and stamps the passport", () => {
    const after = finishTrip(fresh(), "mars", 3);
    expect(after.xp).toBe(30);
    expect(after.coins).toBe(25);
    expect(after.passportStamps).toEqual(["mars"]);
  });

  it("does not pay again on a replay", () => {
    let p = finishTrip(fresh(), "mars", 3);
    p = finishTrip(p, "mars", 3);
    p = finishTrip(p, "mars", 3);
    expect(p.xp, "replaying a stamped destination must not re-award").toBe(30);
    expect(p.coins).toBe(25);
    expect(p.passportStamps).toEqual(["mars"]);
  });

  it("still pays for a new destination", () => {
    let p = finishTrip(fresh(), "mars", 0);
    p = finishTrip(p, "ajanta", 0);
    expect(p.xp).toBe(60);
    expect(p.passportStamps).toEqual(["mars", "ajanta"]);
  });
});
