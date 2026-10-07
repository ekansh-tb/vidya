import { z } from "zod";

export const wallTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const id = z.string().uuid();
export const intervalSchema = z.object({
  id, label: z.string().trim().min(1).max(80), day: z.number().int().min(0).max(6), start: wallTimeSchema, end: wallTimeSchema,
}).refine(value => value.start < value.end, { message: "End must follow start on the same day." });
export const scheduledSessionSchema = z.object({
  id, activityId: z.string().regex(/^[a-z0-9-]{1,100}$/), revision: z.number().int().min(1).max(100000), date: z.iso.date(), start: wallTimeSchema, end: wallTimeSchema,
}).refine(value => value.start < value.end, { message: "End must follow start on the same day." });
export const learningPlanSchema = z.object({
  version: z.literal(1), timezone: z.string().max(80).refine(value => { try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; } }, "Choose a valid timezone."),
  commitments: z.array(intervalSchema).max(40), windows: z.array(intervalSchema).max(21), sessions: z.array(scheduledSessionSchema).max(24),
}).refine(value => {
  const ids = [...value.commitments, ...value.windows, ...value.sessions].map(item => item.id);
  return new Set(ids).size === ids.length;
}, { message: "Every plan item needs its own identity." });
export const planSaveSchema = z.object({ expectedRevision: z.number().int().min(0), plan: learningPlanSchema });
export type PlanInterval = z.infer<typeof intervalSchema>;
export type ScheduledSession = z.infer<typeof scheduledSessionSchema>;
export type LearningPlan = z.infer<typeof learningPlanSchema>;
export const EMPTY_LEARNING_PLAN: LearningPlan = { version: 1, timezone: "Asia/Kolkata", commitments: [], windows: [], sessions: [] };
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function minuteOf(time: string) { const [hours, minutes] = time.split(":").map(Number); return hours * 60 + minutes; }
export function timeOf(minutes: number) { return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; }
export function dateWeekday(date: string) { return new Date(`${date}T12:00:00Z`).getUTCDay(); }
export function overlap(a: {start:string;end:string}, b: {start:string;end:string}) { return minuteOf(a.start) < minuteOf(b.end) && minuteOf(b.start) < minuteOf(a.end); }

export function planConflicts(plan: LearningPlan) {
  const conflicts: { ids: string[]; message: string; blocking: boolean }[] = [];
  for (let i = 0; i < plan.commitments.length; i++) for (let j = i + 1; j < plan.commitments.length; j++) {
    const a = plan.commitments[i], b = plan.commitments[j];
    if (a.day === b.day && overlap(a, b)) conflicts.push({ ids: [a.id, b.id], message: `${a.label} and ${b.label} overlap on ${WEEKDAYS[a.day]}.`, blocking: false });
  }
  for (const session of plan.sessions) {
    const day = dateWeekday(session.date);
    if (!plan.windows.some(window => window.day === day && window.start <= session.start && window.end >= session.end)) conflicts.push({ ids: [session.id], message: `The activity on ${session.date} is outside the available time you entered.`, blocking: true });
    for (const busy of plan.commitments) if (busy.day === day && overlap(session, busy)) conflicts.push({ ids: [session.id, busy.id], message: `The activity on ${session.date} overlaps ${busy.label}.`, blocking: true });
  }
  for (let i = 0; i < plan.sessions.length; i++) for (let j = i + 1; j < plan.sessions.length; j++) {
    const a = plan.sessions[i], b = plan.sessions[j];
    if (a.date === b.date && overlap(a, b)) conflicts.push({ ids: [a.id, b.id], message: `Two activities overlap on ${a.date}.`, blocking: true });
  }
  return conflicts;
}

/** Deterministic proposal only; it never invents commitments or available hours. */
export function proposeSession(plan: LearningPlan, date: string, durationMinutes: number): {start:string;end:string} | null {
  if (!z.iso.date().safeParse(date).success || !Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 60) return null;
  const day = dateWeekday(date);
  const busy = [...plan.commitments.filter(item => item.day === day), ...plan.sessions.filter(item => item.date === date)];
  const windows = plan.windows.filter(item => item.day === day).sort((a,b) => a.start.localeCompare(b.start));
  for (const window of windows) {
    let start = minuteOf(window.start);
    const end = minuteOf(window.end);
    while (start + durationMinutes <= end) {
      const candidate = { start: timeOf(start), end: timeOf(start + durationMinutes) };
      const blocked = busy.filter(item => overlap(candidate, item));
      if (!blocked.length) return candidate;
      start = Math.max(...blocked.map(item => minuteOf(item.end)));
    }
  }
  return null;
}
