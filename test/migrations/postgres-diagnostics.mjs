import { safeFailure } from "../../scripts/migration-runner.mjs";

class HarnessFailure extends Error {}

// Stage labels come only from harness code. Never copy driver/assertion messages:
// assertion messages may contain actual values, and driver errors may contain SQL.
export function sanitized(error, stage = "database operation") {
  if (error instanceof HarnessFailure) return error;
  const rawCode = error?.code ?? error?.sqlState;
  const code = /^[0-9A-Z]{5}$/.test(rawCode ?? "") ? rawCode : undefined;
  const kind = error?.code === "ERR_ASSERTION" ? "assertion failed" : "operation failed";
  const runnerDiagnostic = safeFailure(error);
  const runner = runnerDiagnostic.startsWith("Migration failed during ")
    ? ` ${runnerDiagnostic}` : "";
  return Object.assign(new HarnessFailure(
    `${stage}: ${kind}${code ? ` (SQLSTATE ${code})` : ""}.${runner}`), { code });
}
