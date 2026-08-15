import "server-only";

import { anthropic } from "@ai-sdk/anthropic";

type ModelChoice = {
  gateway: string;
  directAnthropic: string;
};

export const VIDYA_MODELS = {
  haiku: {
    gateway: "anthropic/claude-haiku-4.5",
    directAnthropic: "claude-haiku-4-5",
  },
  sonnet: {
    gateway: "anthropic/claude-sonnet-5",
    directAnthropic: "claude-sonnet-5",
  },
} as const satisfies Record<string, ModelChoice>;

export function aiProviderConfigured(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.ANTHROPIC_API_KEY,
  );
}

/**
 * AI SDK string model ids use Vercel AI Gateway. A direct Anthropic key needs
 * the provider instance instead, otherwise the key check succeeds but the
 * request still attempts gateway authentication.
 */
export function resolveVidyaModel(choice: ModelChoice) {
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN) {
    return choice.gateway;
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(choice.directAnthropic);
  }
  return choice.gateway;
}
