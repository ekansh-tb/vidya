export const AI_PROVIDER_IDS = [
  "openrouter",
  "openai",
  "anthropic",
  "google",
  "xai",
] as const;

export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

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
