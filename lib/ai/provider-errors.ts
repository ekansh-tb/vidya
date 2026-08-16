import { APICallError } from "ai";

const CREDENTIAL_STATUS_CODES = new Set([401, 402, 403]);

function apiStatusCode(error: unknown, depth = 0): number | null {
  if (depth > 3) return null;
  if (APICallError.isInstance(error)) return error.statusCode ?? null;
  if (error && typeof error === "object" && "cause" in error) {
    return apiStatusCode((error as { cause?: unknown }).cause, depth + 1);
  }
  return null;
}

export function isProviderCredentialError(error: unknown): boolean {
  const statusCode = apiStatusCode(error);
  return statusCode !== null && CREDENTIAL_STATUS_CODES.has(statusCode);
}
