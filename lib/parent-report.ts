import { z } from "zod";
import type { GameState, MissedQuestion, SubjectId } from "./types";

const isoTimestampSchema = z.iso.datetime({ offset: true });

const topicProgressSchema = z.object({
  attempts: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  mastery: z.number().finite().nonnegative(),
});

const syncedStateSchema = z.object({
  progress: z.record(
    z.string().min(1).max(128),
    z.record(z.string().min(1).max(160), topicProgressSchema),
  ),
  stats: z.object({
    totalAnswered: z.number().int().nonnegative(),
    totalCorrect: z.number().int().nonnegative(),
    quizzesCompleted: z.number().int().nonnegative(),
    dailyQuestsCompleted: z.number().int().nonnegative(),
  }),
  streak: z.number().int().nonnegative(),
  longestStreak: z.number().int().nonnegative(),
  missedQuestions: z.array(z.object({
    id: z.string().min(1).max(160),
    q: z.string().min(1).max(4_000),
    subjectId: z.string().min(1).max(80).optional(),
    topicId: z.string().min(1).max(160).optional(),
    missedAt: isoTimestampSchema,
  })).max(5_000),
  dailyReflections: z.array(z.object({
    date: z.iso.date(),
    body: z.string().max(200),
    savedAt: isoTimestampSchema,
    private: z.boolean().optional(),
  })).max(2_000),
});

const parentReportReflectionSchema = z.discriminatedUnion("private", [
  z.object({
    date: z.iso.date(),
    savedAt: isoTimestampSchema,
    private: z.literal(true),
  }),
  z.object({
    date: z.iso.date(),
    savedAt: isoTimestampSchema,
    private: z.literal(false),
    body: z.string().max(200),
  }),
]);

const parentReportStateSchema = z.object({
  progress: syncedStateSchema.shape.progress,
  stats: syncedStateSchema.shape.stats,
  streak: syncedStateSchema.shape.streak,
  longestStreak: syncedStateSchema.shape.longestStreak,
  missedQuestions: syncedStateSchema.shape.missedQuestions,
  dailyReflections: z.array(parentReportReflectionSchema).max(2_000),
});

export type ParentReportState = z.infer<typeof parentReportStateSchema>;

export type ParentStateSource = {
  state: unknown | null;
  revision: number;
  updatedAt: string | null;
};

export type ParentReportResponse =
  | {
      status: "ready";
      state: ParentReportState;
      revision: number;
      updatedAt: string;
    }
  | { status: "absent"; state: null; revision: 0; updatedAt: null }
  | { status: "unavailable" };

const parentReportResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    state: parentReportStateSchema,
    revision: z.number().int().nonnegative(),
    updatedAt: isoTimestampSchema,
  }),
  z.object({
    status: z.literal("absent"),
    state: z.null(),
    revision: z.literal(0),
    updatedAt: z.null(),
  }),
  z.object({ status: z.literal("unavailable") }),
]);

/**
 * Validate an untrusted JSON state and keep only fields used by parent reports.
 * Private reflection bodies are removed on the server, not merely hidden by UI.
 */
export function minimizeParentReportState(value: unknown): ParentReportState | null {
  const parsed = syncedStateSchema.safeParse(value);
  if (!parsed.success) return null;

  return {
    progress: parsed.data.progress,
    stats: parsed.data.stats,
    streak: parsed.data.streak,
    longestStreak: parsed.data.longestStreak,
    missedQuestions: parsed.data.missedQuestions,
    dailyReflections: parsed.data.dailyReflections.map((reflection) => (
      reflection.private
        ? {
            date: reflection.date,
            savedAt: reflection.savedAt,
            private: true,
          }
        : {
            date: reflection.date,
            savedAt: reflection.savedAt,
            private: false,
            body: reflection.body,
          }
    )),
  };
}

/** Converts a database result into the only response shapes the client accepts. */
export function buildParentReportResponse(source: ParentStateSource): ParentReportResponse {
  if (source.state === null) {
    return { status: "absent", state: null, revision: 0, updatedAt: null };
  }

  const state = minimizeParentReportState(source.state);
  if (
    !state ||
    !Number.isSafeInteger(source.revision) ||
    source.revision < 0 ||
    !source.updatedAt ||
    !isoTimestampSchema.safeParse(source.updatedAt).success
  ) {
    return { status: "unavailable" };
  }

  return {
    status: "ready",
    state,
    revision: source.revision,
    updatedAt: source.updatedAt,
  };
}

/** Treat the network response as untrusted even though it came from our route. */
export function parseParentReportResponse(value: unknown): ParentReportResponse | null {
  const parsed = parentReportResponseSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export type ParentReportLoadState =
  | { status: "unlinked" }
  | { status: "loading" }
  | { status: "ready"; state: ParentReportState; revision: number; updatedAt: string }
  | { status: "absent" }
  | { status: "unavailable" };

export type ParentReportDecision = {
  state: GameState;
  source: "remote" | "local";
  fallbackReason?: Exclude<ParentReportLoadState["status"], "ready">;
  updatedAt?: string;
};

/**
 * Overlay only validated reporting fields. Other gameplay data stays local and
 * never needs to cross the parent reporting endpoint.
 */
function applyRemoteReport(localState: GameState, remoteState: ParentReportState): GameState {
  const missedQuestions: MissedQuestion[] = remoteState.missedQuestions.map((miss) => ({
    id: miss.id,
    q: miss.q,
    given: "",
    correct: "",
    ex: "",
    subjectId: miss.subjectId as SubjectId | undefined,
    topicId: miss.topicId,
    missedAt: miss.missedAt,
  }));

  return {
    ...localState,
    progress: remoteState.progress,
    stats: { ...localState.stats, ...remoteState.stats },
    streak: remoteState.streak,
    longestStreak: remoteState.longestStreak,
    missedQuestions,
    dailyReflections: remoteState.dailyReflections.map((reflection) => ({
      date: reflection.date,
      savedAt: reflection.savedAt,
      private: reflection.private || undefined,
      body: reflection.private ? "" : reflection.body,
    })),
  };
}

/** Prefer a valid remote report and otherwise return the local state unchanged. */
export function chooseParentReportState(
  localState: GameState,
  remote: ParentReportLoadState,
): ParentReportDecision {
  if (remote.status === "ready") {
    return {
      state: applyRemoteReport(localState, remote.state),
      source: "remote",
      updatedAt: remote.updatedAt,
    };
  }

  return {
    state: localState,
    source: "local",
    fallbackReason: remote.status,
  };
}
