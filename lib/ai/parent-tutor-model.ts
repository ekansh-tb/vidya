import "server-only";

import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createXai } from "@ai-sdk/xai";
import type { AiProviderId } from "./providers";
import { isTutorModelId } from "./tutor-policy";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export type ParentTutorModelInput = {
  provider: AiProviderId;
  modelId: string;
  credential: string;
};

export function normalizeParentTutorModelId(
  provider: AiProviderId,
  modelId: string,
): string {
  const trimmed = modelId.trim();
  const normalized = provider === "google" && trimmed.startsWith("models/")
    ? trimmed.slice("models/".length)
    : trimmed;
  if (!isTutorModelId(normalized)) {
    throw new Error("AI tutor model id is invalid.");
  }
  return normalized;
}

export function createParentTutorModel({
  provider,
  modelId,
  credential,
}: ParentTutorModelInput) {
  const apiKey = credential.trim();
  if (!apiKey) throw new Error("AI tutor credential is unavailable.");

  const normalizedModelId = normalizeParentTutorModelId(provider, modelId);
  switch (provider) {
    case "openrouter":
      return createOpenAICompatible({
        name: "openrouter",
        apiKey,
        baseURL: OPENROUTER_BASE_URL,
        includeUsage: true,
      })(normalizedModelId);
    case "openai":
      return createOpenAI({ apiKey })(normalizedModelId);
    case "anthropic":
      return createAnthropic({ apiKey })(normalizedModelId);
    case "google":
      return createGoogleGenerativeAI({ apiKey })(normalizedModelId);
    case "xai":
      return createXai({ apiKey })(normalizedModelId);
  }
}
