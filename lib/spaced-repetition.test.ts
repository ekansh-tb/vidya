// The behaviour this replaces: a miss left the notebook the first time the
// learner answered that question right — often minutes after reading the
// answer. These tests exist so that cannot come back.

import { describe, it, expect } from "vitest";
import {
  boxOf, isDue, dueCount, sortForReview, recordCorrect, recordWrong, newCard,
  capNotebook, mergeCard, BOX_INTERVAL_DAYS, RETIRE_BOX,
} from "./spaced-repetition";
import type { MissedQuestion } from "./types";

const T0 = Date.parse("2026-08-13T09:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

function card(patch: Partial<MissedQuestion> = {}): MissedQuestion {
  return {
    id: patch.id ?? "m1",
    q: "What is 25% of 80?",
    given: "25",
    correct: "20",
    ex: "25% is a quarter.",
    missedAt: new Date(T0).toISOString(),
    ...patch,
  };
}

describe("legacy entries", () => {
  it("a card with no schedule is box 0 and due now", () => {
    // Every notebook in the wild predates this module.
    const legacy = card();
    expect(boxOf(legacy)).toBe(0);
    expect(isDue(legacy, T0)).toBe(true);
  });

  it("survives a corrupt box or dueAt rather than throwing", () => {
    expect(boxOf(card({ box: -5 }))).toBe(0);
    expect(boxOf(card({ box: 99 }))).toBe(RETIRE_BOX);
    expect(boxOf(card({ box: NaN }))).toBe(0);
    expect(isDue(card({ dueAt: "not-a-date" }), T0)).toBe(true);
  });
});

describe("promotion", () => {
  it("ONE correct answer does not clear a miss", () => {
    // The whole point. This used to delete the card outright.
    const out = recordCorrect(card(), T0);
    expect(out.kind).toBe("scheduled");
    if (out.kind !== "scheduled") return;
    expect(out.card.box).toBe(1);
    expect(isDue(out.card, T0), "must not be askable again immediately").toBe(false);
  });

  it("each success pushes the next review further out", () => {
    let c = card();
    let now = T0;
    const gaps: number[] = [];
    for (let i = 0; i < RETIRE_BOX; i++) {
      const out = recordCorrect(c, now);
      if (out.kind !== "scheduled") throw new Error(`retired early at box ${i}`);
      gaps.push((Date.parse(out.card.dueAt!) - now) / DAY);
      c = out.card;
      now = Date.parse(c.dueAt!);
    }
    expect(gaps).toEqual(BOX_INTERVAL_DAYS.slice(1));
    // Strictly increasing — an interval that shrank would mean the schedule
    // was punishing success.
    expect([...gaps].sort((a, b) => a - b)).toEqual(gaps);
  });

  it("retires only after surviving every interval", () => {
    let c = card();
    let now = T0;
    for (let i = 0; i < RETIRE_BOX; i++) {
      const out = recordCorrect(c, now);
      if (out.kind !== "scheduled") throw new Error("retired too early");
      c = out.card;
      now = Date.parse(c.dueAt!);
    }
    expect(recordCorrect(c, now).kind).toBe("retired");
  });

  it("takes about eight weeks and five separate days to retire", () => {
    // Guards the claim the module makes about what retirement means.
    const total = BOX_INTERVAL_DAYS.reduce<number>((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(45);
    expect(RETIRE_BOX).toBe(5);
  });

  it("answering early does not buy schedule", () => {
    // Otherwise a learner opens the notebook and answers the same question
    // five times in a minute to make it disappear — the original bug, with
    // extra steps.
    const scheduled = recordCorrect(card(), T0);
    if (scheduled.kind !== "scheduled") throw new Error("expected scheduled");
    const again = recordCorrect(scheduled.card, T0 + 60_000);
    expect(again.kind).toBe("scheduled");
    if (again.kind !== "scheduled") return;
    expect(again.card.box, "box must not move before the card is due").toBe(1);
    expect(again.card.dueAt).toBe(scheduled.card.dueAt);
  });

  it("cannot be retired by hammering it while it rests", () => {
    let c = card();
    const first = recordCorrect(c, T0);
    if (first.kind !== "scheduled") throw new Error("expected scheduled");
    c = first.card;
    for (let i = 0; i < 20; i++) {
      const out = recordCorrect(c, T0 + i * 1000);
      expect(out.kind).toBe("scheduled");
      if (out.kind === "scheduled") c = out.card;
    }
    expect(boxOf(c)).toBe(1);
  });
});

describe("lapses", () => {
  it("a wrong answer drops straight to box 0, due now", () => {
    const high = card({ box: 4, dueAt: new Date(T0).toISOString() });
    const out = recordWrong(high, T0);
    expect(out.box).toBe(0);
    expect(isDue(out, T0)).toBe(true);
  });

  it("a lapse counts as a review", () => {
    expect(recordWrong(card({ reviews: 3 }), T0).reviews).toBe(4);
  });
});

describe("what the learner is shown", () => {
  it("counts only cards that are actually ready", () => {
    const list = [
      card({ id: "a" }),
      card({ id: "b", dueAt: new Date(T0 + 3 * DAY).toISOString() }),
      card({ id: "c", dueAt: new Date(T0 - DAY).toISOString() }),
    ];
    // The home banner used to show the whole notebook, so a learner with
    // everything scheduled weeks out was told they had work waiting.
    expect(dueCount(list, T0)).toBe(2);
  });

  it("puts due cards first, oldest miss first", () => {
    const list = [
      card({ id: "resting", dueAt: new Date(T0 + DAY).toISOString() }),
      card({ id: "newer", missedAt: new Date(T0 - DAY).toISOString() }),
      card({ id: "oldest", missedAt: new Date(T0 - 9 * DAY).toISOString() }),
    ];
    expect(sortForReview(list, T0).map((m) => m.id)).toEqual(["oldest", "newer", "resting"]);
  });

  it("orders resting cards by when they come back", () => {
    const list = [
      card({ id: "later", dueAt: new Date(T0 + 9 * DAY).toISOString() }),
      card({ id: "sooner", dueAt: new Date(T0 + DAY).toISOString() }),
    ];
    expect(sortForReview(list, T0).map((m) => m.id)).toEqual(["sooner", "later"]);
  });

  it("does not mutate the list it is given", () => {
    const list = [card({ id: "a" }), card({ id: "b" })];
    const before = list.map((m) => m.id);
    sortForReview(list, T0);
    expect(list.map((m) => m.id)).toEqual(before);
  });
});

describe("capping the notebook", () => {
  it("drops the best-learned cards, not the oldest", () => {
    // The old cap evicted by age, so a card the learner had been failing for
    // weeks was dropped to make room for one missed this afternoon.
    const struggling = card({ id: "struggling", box: 0 });
    const nearlyLearned = card({ id: "learned", box: 5, dueAt: new Date(T0 + 30 * DAY).toISOString() });
    const kept = capNotebook([struggling, nearlyLearned], 1);
    expect(kept.map((m) => m.id)).toEqual(["struggling"]);
  });

  it("leaves a notebook under the cap alone", () => {
    const list = [card({ id: "a" }), card({ id: "b" })];
    expect(capNotebook(list, 50)).toHaveLength(2);
  });

  it("preserves the caller's ordering", () => {
    const list = [card({ id: "a", box: 5 }), card({ id: "b" }), card({ id: "c" })];
    expect(capNotebook(list, 2).map((m) => m.id)).toEqual(["b", "c"]);
  });
});

describe("merging two devices", () => {
  it("the more recent review wins", () => {
    const older = card({ box: 1, lastReviewedAt: new Date(T0).toISOString() });
    const newer = card({ box: 2, lastReviewedAt: new Date(T0 + DAY).toISOString() });
    expect(mergeCard(older, newer).box).toBe(2);
    expect(mergeCard(newer, older).box).toBe(2);
  });

  it("a lapse beats a promotion recorded at the same instant", () => {
    // Forgetting is the more important signal and the cheaper error: showing
    // a card they know costs ten seconds, hiding one they lost costs them the
    // thing they were learning.
    const stamp = new Date(T0).toISOString();
    const lapsed = card({ box: 0, lastReviewedAt: stamp });
    const promoted = card({ box: 3, lastReviewedAt: stamp });
    expect(mergeCard(promoted, lapsed).box).toBe(0);
    expect(mergeCard(lapsed, promoted).box).toBe(0);
  });

  it("falls back to the miss time when neither has been reviewed", () => {
    const a = card({ id: "a", missedAt: new Date(T0).toISOString() });
    const b = card({ id: "b", missedAt: new Date(T0 + DAY).toISOString() });
    expect(mergeCard(a, b).id).toBe("b");
  });
});

describe("newCard", () => {
  it("enters at box 0 and is immediately askable", () => {
    const c = newCard({
      id: "x", q: "q", given: "g", correct: "c", ex: "e",
      missedAt: new Date(T0).toISOString(),
    }, T0);
    expect(c.box).toBe(0);
    expect(isDue(c, T0)).toBe(true);
  });
});
