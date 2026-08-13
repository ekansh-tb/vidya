import type { MissedQuestion } from "./types";

/**
 * Spaced repetition for the Wrong-Answer Notebook.
 *
 * THE PROBLEM THIS FIXES
 * ----------------------
 * A miss used to leave the notebook the first time the learner answered that
 * question correctly — `missedQuestions.filter(m => m.q !== currentQ.q)` in
 * quiz-view. One right answer, gone forever.
 *
 * That is the weakest possible evidence of learning. The correct answer and
 * its explanation were on screen moments earlier, the options are in the same
 * order, and the question is word-for-word the one they just read. Answering
 * it again minutes later measures short-term recall, which is exactly the
 * thing that decays. The notebook was emptying itself fastest for the
 * questions the learner had most recently been shown the answer to.
 *
 * THE MODEL
 * ---------
 * Leitner boxes, not SM-2. SM-2's ease factors need a self-rated difficulty
 * ("how hard was that?") after every card, which is a poor fit for a
 * ten-year-old mid-quiz and would need a UI that interrupts the flow. Boxes
 * need only what we already observe: right or wrong.
 *
 * A miss enters at box 0, due immediately. Each correct answer moves it up a
 * box and pushes it further out. A wrong answer at any box drops it straight
 * back to 0 — a lapse means the interval was too long, and creeping back down
 * one step at a time would keep showing a card the learner has demonstrably
 * lost.
 *
 * It retires only after surviving every interval, which means the same
 * question answered right on five separate days spread over about eight weeks.
 * That is a claim about learning worth making. One right answer is not.
 *
 * ON THE DAY GRAIN
 * ----------------
 * Intervals are whole days and due-ness is checked against the moment of use,
 * not midnight, so a card due "tomorrow" is available 24 hours later rather
 * than at some hour the child has to guess. Nothing here shows the learner a
 * box number, an interval, or a schedule — they see questions that are ready,
 * and that is all the ceremony a notebook needs.
 */

/** Days until a card at each box is due again. Index = box the card is IN. */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35] as const;

/** Survive this box and the card has earned its way out of the notebook. */
export const RETIRE_BOX = BOX_INTERVAL_DAYS.length - 1;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The box a card is in, tolerating entries written before this existed.
 *
 * Absent means box 0 — an un-scheduled miss is due now, which is both the
 * safe default and what the old behaviour effectively did.
 */
export function boxOf(m: MissedQuestion): number {
  const b = m.box;
  if (typeof b !== "number" || !Number.isFinite(b)) return 0;
  return Math.min(RETIRE_BOX, Math.max(0, Math.floor(b)));
}

/** Is this card ready to be asked again? */
export function isDue(m: MissedQuestion, now: number = Date.now()): boolean {
  if (!m.dueAt) return true;
  const t = Date.parse(m.dueAt);
  return Number.isNaN(t) ? true : t <= now;
}

export function dueCount(list: MissedQuestion[] | undefined, now: number = Date.now()): number {
  return (list ?? []).filter((m) => isDue(m, now)).length;
}

/**
 * Due cards first, then the ones resting, each group oldest-miss-first.
 *
 * Oldest-first within the due group on purpose: the card that has been waiting
 * longest is the one closest to being forgotten, and a learner who only has
 * time for three questions should get those three.
 */
export function sortForReview(
  list: MissedQuestion[],
  now: number = Date.now(),
): MissedQuestion[] {
  return [...list].sort((a, b) => {
    const ad = isDue(a, now), bd = isDue(b, now);
    if (ad !== bd) return ad ? -1 : 1;
    if (ad) return Date.parse(a.missedAt || "") - Date.parse(b.missedAt || "");
    // Both resting: the one coming back soonest first, so the list reads as a
    // queue rather than an arbitrary pile.
    return Date.parse(a.dueAt || "") - Date.parse(b.dueAt || "");
  });
}

export type ReviewOutcome =
  /** Promoted and scheduled further out. */
  | { kind: "scheduled"; card: MissedQuestion }
  /** Survived the last box — it leaves the notebook. */
  | { kind: "retired" };

/**
 * Record a correct answer against a card.
 *
 * Promotion is refused for a card that is not yet due. Otherwise a learner
 * could open the notebook, answer the same question five times in a minute,
 * and retire it — reintroducing exactly the bug this module exists to fix,
 * just with more steps. An early correct answer is fine and costs nothing; it
 * simply does not buy schedule.
 */
export function recordCorrect(
  m: MissedQuestion,
  now: number = Date.now(),
): ReviewOutcome {
  if (!isDue(m, now)) return { kind: "scheduled", card: m };

  const next = boxOf(m) + 1;
  if (next > RETIRE_BOX) return { kind: "retired" };

  return {
    kind: "scheduled",
    card: {
      ...m,
      box: next,
      dueAt: new Date(now + BOX_INTERVAL_DAYS[next] * DAY_MS).toISOString(),
      lastReviewedAt: new Date(now).toISOString(),
      reviews: (m.reviews ?? 0) + 1,
    },
  };
}

/** Record a wrong answer: straight back to box 0, due immediately. */
export function recordWrong(
  m: MissedQuestion,
  now: number = Date.now(),
): MissedQuestion {
  return {
    ...m,
    box: 0,
    dueAt: new Date(now).toISOString(),
    lastReviewedAt: new Date(now).toISOString(),
    reviews: (m.reviews ?? 0) + 1,
  };
}

/** A brand-new miss: box 0, due now. */
export function newCard(
  m: Omit<MissedQuestion, "box" | "dueAt">,
  now: number = Date.now(),
): MissedQuestion {
  return { ...m, box: 0, dueAt: new Date(now).toISOString() };
}

/**
 * Trim the notebook to its cap, dropping the best-learned cards first.
 *
 * The old cap was `slice(0, 50)` on a most-recent-first list, which evicted by
 * age — so a card the learner had been failing for weeks was dropped to make
 * room for one they missed once this afternoon. Under spaced repetition cards
 * also live much longer, so eviction stops being rare and the order starts to
 * matter.
 *
 * Highest box goes first: those are the ones with the most evidence behind
 * them. Among equals, the one due furthest away — it is the least urgent thing
 * in the notebook by definition.
 */
export function capNotebook(list: MissedQuestion[], cap = 50): MissedQuestion[] {
  if (list.length <= cap) return list;
  const ranked = [...list].sort((a, b) => {
    const ab = boxOf(a), bb = boxOf(b);
    if (ab !== bb) return bb - ab;
    return Date.parse(b.dueAt || "") - Date.parse(a.dueAt || "");
  });
  const drop = new Set(ranked.slice(0, list.length - cap).map((m) => m.id));
  return list.filter((m) => !drop.has(m.id));
}

/**
 * Merge two copies of one card from different devices.
 *
 * Whichever was reviewed more recently carries the truth about the schedule —
 * but a LAPSE always wins over a promotion at the same instant, because
 * forgetting is the more important signal and the cheaper error. Showing a
 * card the learner actually knows costs them ten seconds; hiding one they have
 * lost costs them the thing they were trying to learn.
 */
export function mergeCard(a: MissedQuestion, b: MissedQuestion): MissedQuestion {
  const at = Date.parse(a.lastReviewedAt || a.missedAt || "") || 0;
  const bt = Date.parse(b.lastReviewedAt || b.missedAt || "") || 0;
  if (at !== bt) return at > bt ? a : b;
  return boxOf(a) <= boxOf(b) ? a : b;
}
