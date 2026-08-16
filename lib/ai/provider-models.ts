import "server-only";

import type { AiProviderId } from "./providers";
import { isTutorModelId } from "./tutor-policy";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
const MAX_MODELS = 500;

export type ProviderModelSummary = {
  id: string;
  name: string;
};

export type ProviderModelDiscovery =
  | { kind: "success"; models: ProviderModelSummary[]; truncated: boolean }
  | { kind: "invalid_credential" }
  | { kind: "unavailable" }
  | { kind: "invalid_response" };

function recordOf(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function displayName(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, 160)
    : fallback;
}

export function providerModelsRequest(provider: AiProviderId, secret: string): Request {
  const headers = new Headers({ accept: "application/json" });
  let url: string;
  switch (provider) {
    case "openrouter":
      url = "https://openrouter.ai/api/v1/models?output_modalities=text";
      headers.set("authorization", `Bearer ${secret}`);
      break;
    case "openai":
      url = "https://api.openai.com/v1/models";
      headers.set("authorization", `Bearer ${secret}`);
      break;
    case "anthropic":
      url = "https://api.anthropic.com/v1/models?limit=1000";
      headers.set("x-api-key", secret);
      headers.set("anthropic-version", "2023-06-01");
      break;
    case "google":
      url = "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000";
      headers.set("x-goog-api-key", secret);
      break;
    case "xai":
      url = "https://api.x.ai/v1/language-models";
      headers.set("authorization", `Bearer ${secret}`);
      break;
  }
  return new Request(url, { method: "GET", headers, cache: "no-store" });
}

export function parseProviderModels(
  provider: AiProviderId,
  value: unknown,
): { models: ProviderModelSummary[]; truncated: boolean } | null {
  const payload = recordOf(value);
  if (!payload) return null;
  const raw = provider === "google" || provider === "xai" ? payload.models : payload.data;
  if (!Array.isArray(raw)) return null;

  const models: ProviderModelSummary[] = [];
  const seen = new Set<string>();
  let validCount = 0;
  for (const item of raw) {
    const model = recordOf(item);
    if (!model) continue;
    if (
      provider === "google"
      && (!Array.isArray(model.supportedGenerationMethods)
        || !model.supportedGenerationMethods.includes("generateContent"))
    ) {
      continue;
    }

    const idValue = provider === "google" ? model.name : model.id;
    if (!isTutorModelId(idValue) || seen.has(idValue)) continue;
    seen.add(idValue);
    validCount += 1;
    if (models.length >= MAX_MODELS) continue;

    const nameValue = provider === "anthropic"
      ? model.display_name
      : provider === "google"
        ? model.displayName
        : model.name;
    models.push({ id: idValue, name: displayName(nameValue, idValue) });
  }

  return { models, truncated: validCount > MAX_MODELS };
}

async function boundedJson(response: Response, maxBytes: number): Promise<unknown | null> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return null;
  if (!response.body) return null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return null;
  }
}

export async function discoverProviderModels(
  provider: AiProviderId,
  secret: string,
  fetcher: typeof fetch = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
): Promise<ProviderModelDiscovery> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const request = new Request(providerModelsRequest(provider, secret), {
      signal: controller.signal,
    });
    const response = await fetcher(request);
    if (response.status === 401 || response.status === 403) {
      return { kind: "invalid_credential" };
    }
    if (!response.ok) return { kind: "unavailable" };
    const payload = await boundedJson(response, maxResponseBytes);
    const parsed = parseProviderModels(provider, payload);
    return parsed ? { kind: "success", ...parsed } : { kind: "invalid_response" };
  } catch {
    return { kind: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
