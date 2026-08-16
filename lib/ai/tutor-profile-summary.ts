import { isAiProviderId, type AiProviderId } from "./providers";
import {
  isTutorDailyTurnLimit,
  isTutorMaxOutputTokens,
  isTutorModelId,
} from "./tutor-policy";

export type AiTutorProfileSummary = {
  id: string;
  name: string;
  connectionId: string;
  connectionLabel: string;
  provider: AiProviderId;
  connectionStatus: "active" | "needs_attention";
  modelId: string;
  createdAt: string;
  updatedAt: string;
};

export type LearnerAiAssignmentSummary = {
  learnerId: string;
  tutorProfileId: string;
  enabled: boolean;
  dailyTurnLimit: number;
  maxOutputTokens: number;
  createdAt: string;
  updatedAt: string;
};

export type AiTutorModelSummary = {
  id: string;
  name: string;
};

export type AiTutorModelsResponse = {
  provider: AiProviderId;
  models: AiTutorModelSummary[];
  truncated: boolean;
};

function recordOf(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringOf(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function parseAiTutorProfileSummary(value: unknown): AiTutorProfileSummary | null {
  const row = recordOf(value);
  if (!row) return null;
  const id = stringOf(row.id);
  const name = stringOf(row.name);
  const connectionId = stringOf(row.connectionId);
  const connectionLabel = stringOf(row.connectionLabel);
  const provider = isAiProviderId(row.provider) ? row.provider : null;
  const connectionStatus = row.connectionStatus === "active"
    || row.connectionStatus === "needs_attention"
    ? row.connectionStatus
    : null;
  const modelId = isTutorModelId(row.modelId) ? row.modelId : null;
  const createdAt = stringOf(row.createdAt);
  const updatedAt = stringOf(row.updatedAt);
  if (
    !id || !name || !connectionId || !connectionLabel || !provider
    || !connectionStatus || !modelId || !createdAt || !updatedAt
  ) {
    return null;
  }
  return {
    id,
    name,
    connectionId,
    connectionLabel,
    provider,
    connectionStatus,
    modelId,
    createdAt,
    updatedAt,
  };
}

export function parseAiTutorProfilesResponse(value: unknown): AiTutorProfileSummary[] | null {
  const payload = recordOf(value);
  if (!payload || !Array.isArray(payload.profiles)) return null;
  const profiles = payload.profiles.map(parseAiTutorProfileSummary);
  return profiles.every((profile): profile is AiTutorProfileSummary => profile !== null)
    ? profiles
    : null;
}

export function parseCreatedAiTutorProfile(value: unknown): AiTutorProfileSummary | null {
  const payload = recordOf(value);
  return payload ? parseAiTutorProfileSummary(payload.profile) : null;
}

export function parseAiTutorModelsResponse(value: unknown): AiTutorModelsResponse | null {
  const payload = recordOf(value);
  if (
    !payload
    || !isAiProviderId(payload.provider)
    || !Array.isArray(payload.models)
    || typeof payload.truncated !== "boolean"
    || payload.models.length > 500
  ) {
    return null;
  }

  const models: AiTutorModelSummary[] = [];
  const seen = new Set<string>();
  for (const value of payload.models) {
    const model = recordOf(value);
    const id = model && isTutorModelId(model.id) ? model.id : null;
    const name = model ? stringOf(model.name) : null;
    if (!id || !name || name.length > 160 || seen.has(id)) return null;
    seen.add(id);
    models.push({ id, name });
  }

  return { provider: payload.provider, models, truncated: payload.truncated };
}

export function isDeletedAiTutorProfile(value: unknown): boolean {
  return recordOf(value)?.deleted === true;
}

export function parseLearnerAiAssignmentSummary(
  value: unknown,
): LearnerAiAssignmentSummary | null {
  const row = recordOf(value);
  if (!row) return null;
  const learnerId = stringOf(row.learnerId);
  const tutorProfileId = stringOf(row.tutorProfileId);
  const createdAt = stringOf(row.createdAt);
  const updatedAt = stringOf(row.updatedAt);
  if (
    !learnerId || !tutorProfileId || typeof row.enabled !== "boolean"
    || !isTutorDailyTurnLimit(row.dailyTurnLimit)
    || !isTutorMaxOutputTokens(row.maxOutputTokens)
    || !createdAt || !updatedAt
  ) {
    return null;
  }
  return {
    learnerId,
    tutorProfileId,
    enabled: row.enabled,
    dailyTurnLimit: row.dailyTurnLimit,
    maxOutputTokens: row.maxOutputTokens,
    createdAt,
    updatedAt,
  };
}

export function parseLearnerAiAssignmentResponse(
  value: unknown,
): LearnerAiAssignmentSummary | null | undefined {
  const payload = recordOf(value);
  if (!payload || !("assignment" in payload)) return undefined;
  if (payload.assignment === null) return null;
  return parseLearnerAiAssignmentSummary(payload.assignment) ?? undefined;
}
