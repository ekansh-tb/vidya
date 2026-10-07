import { dayKeyOf } from "@/lib/utils";
import type { GameState } from "@/lib/types";

export const PARENT_DESTINATIONS = ["Overview", "Children", "Controls"] as const;
export type ParentDestination = (typeof PARENT_DESTINATIONS)[number];
export type ParentAppearance = "light" | "dark" | "system";

export function parseParentAppearance(raw: string | null): ParentAppearance {
  return raw === "dark" || raw === "system" ? raw : "light";
}

/** Only activity evidence is read. Journals, chat, creations and care notes are private inputs. */
export function familyParticipation(state: Pick<GameState, "activities">, now = new Date()) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return { day: dayKeyOf(date), label: date.toLocaleDateString("en-IN", { weekday: "short" }) };
  });
  const eligibleDays = new Set(days.map(({ day }) => day));
  const unique = new Map((state.activities?.completions ?? [])
    .filter(record => eligibleDays.has(record.day))
    .map(record => [record.key, record]));
  const records = [...unique.values()];
  const appDays = new Set(records.filter(record => record.source === "app").map(record => record.day));
  const caregiverDays = new Set(records.filter(record => record.source === "caregiver").map(record => record.day));
  return {
    window: `${days[0].day} to ${days[6].day}`,
    days: days.map(day => ({ ...day, app: appDays.has(day.day), caregiver: caregiverDays.has(day.day) })),
    appCompletions: records.filter(record => record.source === "app").length,
    caregiverReports: records.filter(record => record.source === "caregiver").length,
    attempts: records.reduce((sum, record) => sum + record.attempts, 0),
    independentResponses: records.reduce((sum, record) => sum + record.independentResponses, 0),
    hints: records.reduce((sum, record) => sum + record.hints, 0),
    retries: records.reduce((sum, record) => sum + record.retries, 0),
    completedCreations: records.filter(record => record.creation).length,
  };
}

export function familyParticipationReport(name: string, placement: string, state: Pick<GameState, "activities">, now = new Date()) {
  const report = familyParticipation(state, now);
  return `# Vidya practice observations\n\nLearner: ${name}\nLearning level: ${placement}\nEvidence window: ${report.window}\n\n- App completions: ${report.appCompletions}\n- Caregiver reports: ${report.caregiverReports}\n- Response attempts: ${report.attempts}\n- Independent responses: ${report.independentResponses}\n- Hints: ${report.hints}\n- Retries: ${report.retries}\n- Completed creation activities: ${report.completedCreations}\n\nCompletion is participation, not proof of understanding. This report excludes journals, AI conversations, care notes and creation contents. No record does not mean no learning.\n`;
}
