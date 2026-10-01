import { z } from "zod";
import type { GameState, LearnerProfile, SubjectId } from "../types";
import { chooseParentReportState, parseParentReportResponse, type ParentReportDecision } from "../parent-report";

const learnerSchema = z.object({
  id: z.uuid(), name: z.string().max(80), grade: z.number().int().min(1).max(13),
  board: z.enum(["cambridge-primary", "cambridge-lower-secondary", "cambridge-igcse", "icse", "cbse"]),
  school: z.string().nullable(), city: z.string().nullable(),
  verificationLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  pickedSubjects: z.array(z.string()).nullable(), subjectsLocked: z.boolean(),
  disabledCapabilities: z.array(z.string()).nullable(), createdAt: z.string(),
});
const rosterSchema = z.object({ parentId: z.string().min(1), learners: z.array(learnerSchema) });

/** A fresh placeholder for component compatibility, never a local profile. */
function blankState(): GameState {
  return {
    name: "", avatarId: "peacock", customAvatar: null, xp: 0, coins: 0,
    streak: 0, longestStreak: 0, lastPlayedDate: null, progress: {}, badges: [],
    inventory: { hint: 0, fiftyFifty: 0, freeze: 0, doubleXp: 0 },
    stats: { totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0, dailyQuestsCompleted: 0, fastestQuiz: null },
    doubleXpActive: false, dailyQuest: { date: null, completed: false },
    comeback: { wasWrong: false, sinceWrongCorrect: 0 }, seenQuestions: {},
    friendStreak: null, lastQuestCorrect: null, passportStamps: [], notebook: {},
    lastAssemblyDate: null, assemblyStreak: 0, readBooks: [], rewardedBooks: [],
    readingProgress: {}, completedActivities: [], moveBreaks: 0, savedMelody: null,
    savedCompositions: [], classRoster: [], classNotes: [], buddyId: null,
    missedQuestions: [], dailyReflections: [],
    settings: { sound: false, music: false, voice: false, musicVolume: -16, sfxVolume: -8, voiceVolume: 0.9 },
    onboarded: false,
  };
}

export type OwnedLearner = LearnerProfile & { remoteId: string };
export type RosterResult =
  | { status: "ready"; learners: OwnedLearner[] }
  | { status: "denied" | "unavailable"; learners: [] };

/** No local-profile argument exists. Unknown fields and credentials are dropped. */
export function parseOwnedRoster(value: unknown, parentId: string): OwnedLearner[] | null {
  const parsed = rosterSchema.safeParse(value);
  if (!parsed.success || parsed.data.parentId !== parentId) return null;
  const ids = parsed.data.learners.map((row) => row.id);
  if (new Set(ids).size !== ids.length) return null;
  return parsed.data.learners.map((row) => ({
    id: row.id, remoteId: row.id, name: row.name, grade: row.grade, board: row.board,
    school: row.school ?? undefined, city: row.city ?? undefined,
    verifiedLevel: row.verificationLevel, pickedSubjects: row.pickedSubjects === null ? undefined : row.pickedSubjects as SubjectId[],
    subjectsLocked: row.subjectsLocked, disabledCapabilities: row.disabledCapabilities ?? [],
    createdAt: row.createdAt, state: blankState(),
  }));
}

export async function loadOwnedRoster(parentId: string, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<RosterResult> {
  try {
    const response = await fetcher("/api/parent/roster", { signal, cache: "no-store" });
    if ([401, 403].includes(response.status)) return { status: "denied", learners: [] };
    if (!response.ok) return { status: "unavailable", learners: [] };
    const learners = parseOwnedRoster(await response.json(), parentId);
    return learners ? { status: "ready", learners } : { status: "unavailable", learners: [] };
  } catch { return { status: "unavailable", learners: [] }; }
}

export type RemoteParentReport = Omit<ParentReportDecision, "source" | "fallbackReason"> & { source: "remote" };
export type OwnedReport =
  | { status: "ready"; report: RemoteParentReport }
  | { status: "loading" | "absent" | "unavailable" | "denied" };

/** Only a validated remote report can produce reporting data. */
export async function loadOwnedReport(learnerId: string, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<OwnedReport> {
  try {
    const response = await fetcher(`/api/parent/learners/${encodeURIComponent(learnerId)}/state`, { signal, cache: "no-store" });
    if ([401, 403, 404].includes(response.status)) return { status: "denied" };
    if (!response.ok) return { status: "unavailable" };
    const result = parseParentReportResponse(await response.json());
    if (result?.status === "ready") {
      const decision = chooseParentReportState(blankState(), result);
      return { status: "ready", report: { state: decision.state, source: "remote", updatedAt: result.updatedAt } };
    }
    return { status: result?.status === "absent" ? "absent" : "unavailable" };
  } catch { return { status: "unavailable" }; }
}

export type RosterSnapshot = {
  parentId: string; generation: number;
  result: RosterResult | { status: "loading"; learners: [] };
};

/** Hide stale results synchronously, before an account-change effect runs. */
export function visibleRoster(snapshot: RosterSnapshot, parentId: string, generation: number): OwnedLearner[] {
  return snapshot.parentId === parentId && snapshot.generation === generation && snapshot.result.status === "ready"
    ? snapshot.result.learners : [];
}
