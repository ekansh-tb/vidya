import "server-only";

export const AI_PROVIDER_IDS = [
  "openrouter",
  "openai",
  "anthropic",
  "google",
  "xai",
] as const;

export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];
export type CredentialValidation =
  | { kind: "valid" }
  | { kind: "needs_attention" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export const AI_PROVIDER_LABELS: Record<AiProviderId, string> = {
  openrouter: "OpenRouter",
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google Gemini",
  xai: "xAI",
};

export function isAiProviderId(value: unknown): value is AiProviderId {
  return typeof value === "string" && AI_PROVIDER_IDS.includes(value as AiProviderId);
}

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
): Promise<CredentialValidation> {
  try {
    const response = await fetcher(providerCredentialRequest(provider, secret));
    if (response.ok) return { kind: "valid" };
    if (response.status === 401 || response.status === 403) return { kind: "invalid" };
    if (response.status === 402 || response.status === 429) {
      return { kind: "needs_attention" };
    }
    return { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}
