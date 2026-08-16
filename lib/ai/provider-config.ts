export type AiProviderKind = "gateway" | "anthropic";

export type AiProviderEnvironment = {
  AI_GATEWAY_API_KEY?: string;
  VERCEL_OIDC_TOKEN?: string;
  ANTHROPIC_API_KEY?: string;
};

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * Select the configured provider without exposing or returning a credential.
 * Gateway credentials take precedence because they support the model ids used
 * across Vidya and keep provider routing in one place.
 */
export function configuredAiProvider(
  env: AiProviderEnvironment,
): AiProviderKind | null {
  if (present(env.AI_GATEWAY_API_KEY) || present(env.VERCEL_OIDC_TOKEN)) {
    return "gateway";
  }
  if (present(env.ANTHROPIC_API_KEY)) {
    return "anthropic";
  }
  return null;
}
