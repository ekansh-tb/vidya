import { isAiProviderId, type AiProviderId } from "./providers";

export type AiConnectionSource = "api_key" | "oauth";
export type AiConnectionStatus = "active" | "needs_attention";

export type AiConnectionSummary = {
  id: string;
  provider: AiProviderId;
  label: string;
  source: AiConnectionSource;
  status: AiConnectionStatus;
  credentialHint: string;
  lastValidatedAt: string;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function recordOf(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function requiredString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function optionalDateString(value: unknown): string | null | undefined {
  if (value === null) return null;
  return requiredString(value) ?? undefined;
}

export function parseAiConnectionSummary(value: unknown): AiConnectionSummary | null {
  const row = recordOf(value);
  if (!row) return null;

  const id = requiredString(row.id);
  const provider = isAiProviderId(row.provider) ? row.provider : null;
  const label = requiredString(row.label);
  const source = row.source === "api_key" || row.source === "oauth" ? row.source : null;
  const status = row.status === "active" || row.status === "needs_attention" ? row.status : null;
  const credentialHint = typeof row.credentialHint === "string" ? row.credentialHint : null;
  const lastValidatedAt = requiredString(row.lastValidatedAt);
  const lastUsedAt = optionalDateString(row.lastUsedAt);
  const createdAt = requiredString(row.createdAt);
  const updatedAt = requiredString(row.updatedAt);

  if (
    !id || !provider || !label || !source || !status || credentialHint === null
    || !lastValidatedAt || lastUsedAt === undefined || !createdAt || !updatedAt
  ) {
    return null;
  }

  return {
    id,
    provider,
    label,
    source,
    status,
    credentialHint,
    lastValidatedAt,
    lastUsedAt,
    createdAt,
    updatedAt,
  };
}

export function parseAiConnectionsResponse(value: unknown): AiConnectionSummary[] | null {
  const payload = recordOf(value);
  if (!payload || !Array.isArray(payload.connections)) return null;
  const connections = payload.connections.map(parseAiConnectionSummary);
  return connections.every((connection): connection is AiConnectionSummary => connection !== null)
    ? connections
    : null;
}

export function parseCreatedAiConnection(value: unknown): AiConnectionSummary | null {
  const payload = recordOf(value);
  return payload ? parseAiConnectionSummary(payload.connection) : null;
}

export function parseAuthorizationUrl(value: unknown): string | null {
  const payload = recordOf(value);
  return payload ? requiredString(payload.authorizationUrl) : null;
}

export function isOpenRouterAuthorizationUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.origin === "https://openrouter.ai"
      && url.pathname === "/auth";
  } catch {
    return false;
  }
}

export function isDeletedAiConnection(value: unknown): boolean {
  return recordOf(value)?.deleted === true;
}

export function apiErrorMessage(value: unknown, fallback: string): string {
  const error = recordOf(value)?.error;
  return typeof error === "string" && error.trim() && error.length <= 200
    ? error.trim()
    : fallback;
}
