/** Neon returns timestamptz as Date objects; API contracts require ISO strings. */
export function databaseTimestamp(value: unknown): string {
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || !Number.isFinite(date.getTime())) throw new Error("Invalid database timestamp");
  return date.toISOString();
}
