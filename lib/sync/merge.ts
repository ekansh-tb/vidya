import type { GameState, MissedQuestion } from "../types";
import { mergeCard, capNotebook } from "../spaced-repetition";

/**
 * Merges two copies of a learner's GameState.
 *
 * WHY A MERGE AND NOT LAST-WRITE-WINS
 * -----------------------------------
 * A child uses a tablet at home and a laptop at school. With last-write-wins,
 * the second device to sync silently erases whatever the first one earned —
 * an evening's work gone with no error and no way to notice. So conflicts are
 * resolved field by field, and the rule is chosen per field:
 *
 *   ACCUMULATED progress (xp, coins, badges, stamps, books, mastery, counters)
 *     → max or union. These only ever grow, so combining them can never lose
 *       work. It can in principle over-count if the same quiz was completed on
 *       both devices, and that is the deliberate trade: a child seeing slightly
 *       generous XP is a far better failure than a child losing a badge.
 *
 *   PREFERENCES and CURRENT POSITION (settings, avatar, last subject, daily
 *   quest, buddy)
 *     → the local device wins. It is the device in the child's hands right
 *       now; having its sound setting flipped by a laptop that synced last
 *       week would be baffling.
 *
 *   COLLECTIONS of authored content (notes, reflections, compositions, class
 *   notes, missed questions)
 *     → union, de-duplicated by their natural key. Never drop something the
 *       child wrote.
 *
 * The function is pure and total: it must never throw on a malformed remote
 * payload, because the remote copy could be older than the current shape.
 */

type Rec<T> = Record<string, T>;

const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Union of two string arrays, order-stable, first occurrence wins. */
function unionStrings(a: unknown, b: unknown): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of [...arr<unknown>(a), ...arr<unknown>(b)]) {
    if (typeof v !== "string" || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** Union of object arrays keyed by `key`; the FIRST side's entry wins a tie. */
function unionBy<T extends Record<string, unknown>>(a: unknown, b: unknown, key: string): T[] {
  const out: T[] = [];
  const seen = new Set<string>();
  for (const item of [...arr<T>(a), ...arr<T>(b)]) {
    if (!item || typeof item !== "object") continue;
    const k = String(item[key] ?? "");
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

/**
 * Wrong-Answer Notebook across two devices.
 *
 * A union by id is wrong here. The same card can carry a different Leitner box
 * and due date on each device — the kid reviewed on the iPad, then again on
 * the phone before the two synced — and "first occurrence wins" would keep
 * whichever copy the merge happened to walk first. That can throw away a
 * lapse, which is the one outcome that must not be lost: hiding a question the
 * learner has forgotten costs them the thing they were trying to learn.
 *
 * mergeCard resolves each pair by review recency, with a lapse winning ties.
 */
function mergeMissedQuestions(a: unknown, b: unknown): MissedQuestion[] {
  const byId = new Map<string, MissedQuestion>();
  for (const item of [...arr<MissedQuestion>(a), ...arr<MissedQuestion>(b)]) {
    if (!item || typeof item !== "object") continue;
    const id = String(item.id ?? "");
    if (!id) continue;
    const existing = byId.get(id);
    byId.set(id, existing ? mergeCard(existing, item) : item);
  }
  // Cap after merging, not before: two devices can each be at the cap with
  // different cards, and the union is what needs trimming.
  return capNotebook([...byId.values()]);
}

/** Per-subject, per-topic progress: keep the better attempt record. */
function mergeProgress(a: unknown, b: unknown): GameState["progress"] {
  const out: Rec<Rec<{ attempts: number; correct: number; mastery: number }>> = {};
  const left = (a && typeof a === "object" ? a : {}) as Rec<Rec<Record<string, unknown>>>;
  const right = (b && typeof b === "object" ? b : {}) as Rec<Rec<Record<string, unknown>>>;

  for (const subject of new Set([...Object.keys(left), ...Object.keys(right)])) {
    const ls = left[subject] ?? {};
    const rs = right[subject] ?? {};
    out[subject] = {};
    for (const topic of new Set([...Object.keys(ls), ...Object.keys(rs)])) {
      const lt = ls[topic] ?? {};
      const rt = rs[topic] ?? {};
      out[subject][topic] = {
        attempts: Math.max(num(lt.attempts), num(rt.attempts)),
        correct: Math.max(num(lt.correct), num(rt.correct)),
        mastery: Math.max(num(lt.mastery), num(rt.mastery)),
      };
    }
  }
  return out as GameState["progress"];
}

/** seenQuestions: subject → topic → question ids. Union everywhere. */
function mergeSeen(a: unknown, b: unknown): GameState["seenQuestions"] {
  const out: Rec<Rec<string[]>> = {};
  const left = (a && typeof a === "object" ? a : {}) as Rec<Rec<unknown>>;
  const right = (b && typeof b === "object" ? b : {}) as Rec<Rec<unknown>>;

  for (const subject of new Set([...Object.keys(left), ...Object.keys(right)])) {
    const ls = left[subject] ?? {};
    const rs = right[subject] ?? {};
    out[subject] = {};
    for (const topic of new Set([...Object.keys(ls), ...Object.keys(rs)])) {
      out[subject][topic] = unionStrings(ls[topic], rs[topic]);
    }
  }
  return out as GameState["seenQuestions"];
}

/**
 * Notebook: subject → text. Both sides may hold real writing, and there is no
 * safe way to interleave prose, so the LONGER text wins — a proxy for "more
 * was written" that never silently discards the bigger piece of work. Equal
 * lengths keep the local copy.
 */
function mergeNotebook(local: unknown, remote: unknown): Rec<string> {
  const out: Rec<string> = {};
  const l = (local && typeof local === "object" ? local : {}) as Rec<unknown>;
  const r = (remote && typeof remote === "object" ? remote : {}) as Rec<unknown>;
  for (const key of new Set([...Object.keys(l), ...Object.keys(r)])) {
    const lv = typeof l[key] === "string" ? (l[key] as string) : "";
    const rv = typeof r[key] === "string" ? (r[key] as string) : "";
    out[key] = rv.length > lv.length ? rv : lv;
  }
  return out;
}

/**
 * Merge `remote` into `local`.
 *
 * `local` is authoritative for preferences and current position; accumulated
 * progress is combined. Returns a new object; neither input is mutated.
 */
export function mergeGameState(local: GameState, remote: Partial<GameState> | null | undefined): GameState {
  if (!remote || typeof remote !== "object") return local;
  const r = remote as Record<string, unknown>;

  const localStats = local.stats ?? ({} as GameState["stats"]);
  const remoteStats = (r.stats && typeof r.stats === "object" ? r.stats : {}) as Record<string, unknown>;
  const localInv = local.inventory ?? ({} as GameState["inventory"]);
  const remoteInv = (r.inventory && typeof r.inventory === "object" ? r.inventory : {}) as Record<string, unknown>;

  // fastestQuiz is the one counter where LOWER is better.
  const fastest = (() => {
    const a = local.stats?.fastestQuiz;
    const b = remoteStats.fastestQuiz;
    const av = typeof a === "number" ? a : null;
    const bv = typeof b === "number" ? b : null;
    if (av == null) return bv;
    if (bv == null) return av;
    return Math.min(av, bv);
  })();

  return {
    ...local,

    // ---- accumulated: combine, never lose ----
    xp: Math.max(num(local.xp), num(r.xp)),
    coins: Math.max(num(local.coins), num(r.coins)),
    streak: Math.max(num(local.streak), num(r.streak)),
    longestStreak: Math.max(num(local.longestStreak), num(r.longestStreak)),
    assemblyStreak: Math.max(num(local.assemblyStreak), num(r.assemblyStreak)),
    badges: unionStrings(local.badges, r.badges),
    passportStamps: unionStrings(local.passportStamps, r.passportStamps),
    readBooks: unionStrings(local.readBooks, r.readBooks),
    rewardedBooks: unionStrings(local.rewardedBooks, r.rewardedBooks),
    completedActivities: unionStrings(local.completedActivities, r.completedActivities),
    moveBreaks: Math.max(num(local.moveBreaks), num(r.moveBreaks)),
    progress: mergeProgress(local.progress, r.progress),
    seenQuestions: mergeSeen(local.seenQuestions, r.seenQuestions),
    inventory: {
      hint: Math.max(num(localInv.hint), num(remoteInv.hint)),
      fiftyFifty: Math.max(num(localInv.fiftyFifty), num(remoteInv.fiftyFifty)),
      freeze: Math.max(num(localInv.freeze), num(remoteInv.freeze)),
      doubleXp: Math.max(num(localInv.doubleXp), num(remoteInv.doubleXp)),
    },
    stats: {
      totalAnswered: Math.max(num(localStats.totalAnswered), num(remoteStats.totalAnswered)),
      totalCorrect: Math.max(num(localStats.totalCorrect), num(remoteStats.totalCorrect)),
      quizzesCompleted: Math.max(num(localStats.quizzesCompleted), num(remoteStats.quizzesCompleted)),
      dailyQuestsCompleted: Math.max(num(localStats.dailyQuestsCompleted), num(remoteStats.dailyQuestsCompleted)),
      fastestQuiz: fastest,
    },

    // ---- authored content: union, never drop what a child wrote ----
    notebook: mergeNotebook(local.notebook, r.notebook),
    dailyReflections: unionBy(local.dailyReflections, r.dailyReflections, "date"),
    // Not a plain union: the same card can carry different review schedules on
    // two devices, and taking whichever copy happened to be seen first would
    // silently discard a lapse recorded on the other. See mergeCard.
    missedQuestions: mergeMissedQuestions(local.missedQuestions, r.missedQuestions),
    savedCompositions: unionBy(local.savedCompositions, r.savedCompositions, "id"),
    classRoster: unionBy(local.classRoster, r.classRoster, "id"),
    classNotes: unionBy(local.classNotes, r.classNotes, "id"),

    // ---- preferences & position: the device in their hands wins ----
    // (settings, avatarId, customAvatar, name, dailyQuest, comeback,
    //  lastSubjectId, buddyId, friendStreak and onboarded all come from
    //  `...local` above and are deliberately not overridden.)
    onboarded: Boolean(local.onboarded || r.onboarded),
  };
}
