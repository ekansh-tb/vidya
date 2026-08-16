import "server-only";

import { type AiProviderId } from "./providers";

export {
  AI_PROVIDER_IDS,
  AI_PROVIDER_LABELS,
  isAiProviderId,
  type AiProviderId,
} from "./providers";

export type CredentialValidation =
  | { kind: "valid" }
  | { kind: "needs_attention" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export function providerCredentialRequest(provider: AiProviderId, secret: string): Request {
  const headers = new Headers({ accept: "application/json" });
  let url: string;
  switch (provider) {
    case "openrouter":
      url = "https://openrouter.ai/api/v1/key";
      headers.set("authorization", `Bearer ${secret}`);
      break;
    case "openai":
      url = "https://api.openai.com/v1/models";
      headers.set("authorization", `Bearer ${secret}`);
      break;
    case "anthropic":
      url = "https://api.anthropic.com/v1/models";
      headers.set("x-api-key", secret);
      headers.set("anthropic-version", "2023-06-01");
      break;
    case "google":
      url = "https://generativelanguage.googleapis.com/v1beta/models";
      headers.set("x-goog-api-key", secret);
      break;
    case "xai":
      url = "https://api.x.ai/v1/models";
      headers.set("authorization", `Bearer ${secret}`);
      break;
  }
  return new Request(url, { method: "GET", headers, cache: "no-store" });
}

export async function validateProviderCredential(
  provider: AiProviderId,
  secret: string,
  fetcher: typeof fetch = fetch,
  timeoutMs = 10_000,
): Promise<CredentialValidation> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const request = new Request(providerCredentialRequest(provider, secret), {
      signal: controller.signal,
    });
    const response = await fetcher(request);
    if (response.ok) return { kind: "valid" };
    if (response.status === 401 || response.status === 403) return { kind: "invalid" };
    if (response.status === 402) {
      return { kind: "needs_attention" };
    }
    return { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
