/** Device-local product counts. Never part of GameState, sync or a network request. */
export type LocalMeasurement = {
  version: 1; firstVisit: string; visits: string[]; meaningfulDays: string[];
  started: number; completed: number; abandoned: number; delayedRevisits: number;
  desire: { yes: number; later: number }; placement: string; language: "en" | "hi"; device: "phone" | "tablet" | "desktop";
};
const prefix = "vidya:local-measurement:v1:";
// A namespace, not encryption or an anonymity guarantee. Raw profile IDs may contain nicknames.
function namespace(localId: string): string {
  let hash = 14695981039346656037n;
  for (const char of localId) { hash ^= BigInt(char.codePointAt(0)!); hash = BigInt.asUintN(64, hash * 1099511628211n); }
  return hash.toString(16);
}
export function readLocalMeasurement(localId: string): LocalMeasurement | null {
  try { const raw = localStorage.getItem(prefix+namespace(localId)); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function recordLocalMeasurement(localId: string, context: Pick<LocalMeasurement,"placement"|"language"|"device">, day: string, event: "visit"|"start"|"complete"|"abandon"|"delayed"|"yes"|"later") {
  if (typeof window === "undefined") return;
  const old = readLocalMeasurement(localId);
  const next: LocalMeasurement = old ?? { version: 1, firstVisit:day, visits:[], meaningfulDays:[], started:0, completed:0, abandoned:0, delayedRevisits:0, desire:{yes:0,later:0}, ...context };
  next.visits = [...new Set([...next.visits,day])];
  if (event === "start") next.started++;
  if (event === "complete") { next.completed++; next.meaningfulDays = [...new Set([...next.meaningfulDays,day])]; }
  if (event === "abandon") next.abandoned++;
  if (event === "delayed") next.delayedRevisits++;
  if (event === "yes" || event === "later") next.desire[event]++;
  try { localStorage.setItem(prefix+namespace(localId), JSON.stringify({...next,...context})); } catch { /* Measurements must never block learning. */ }
}
export function localReturnWindow(data: LocalMeasurement, dayOffset: 1 | 7 | 30): boolean | null {
  const target = new Date(`${data.firstVisit}T12:00:00`); target.setDate(target.getDate()+dayOffset);
  const key = `${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,"0")}-${String(target.getDate()).padStart(2,"0")}`;
  const last = [...data.visits].sort().at(-1);
  return !last || last < key ? null : data.visits.includes(key);
}
