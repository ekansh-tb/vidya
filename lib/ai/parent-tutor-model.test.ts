import { describe, expect, it } from "vitest";
import {
  createParentTutorModel,
  normalizeParentTutorModelId,
} from "./parent-tutor-model";
import type { AiProviderId } from "./providers";

describe("normalizeParentTutorModelId", () => {
  it("removes the Google discovery resource prefix", () => {
    expect(normalizeParentTutorModelId("google", "models/gemini-2.5-flash"))
      .toBe("gemini-2.5-flash");
  });

  it("preserves provider-qualified OpenRouter model ids", () => {
    expect(normalizeParentTutorModelId(
      "openrouter",
      "anthropic/claude-haiku-4.5",
    )).toBe("anthropic/claude-haiku-4.5");
  });

  it.each(["", "models/", "https://example.com/model", "bad model"])(
    "rejects an invalid model id: %s",
    (modelId) => {
      expect(() => normalizeParentTutorModelId("google", modelId)).toThrow(
        "AI tutor model id is invalid.",
      );
    },
  );
});

describe("createParentTutorModel", () => {
  it.each<{
    provider: AiProviderId;
    modelId: string;
    expectedProvider: string;
    expectedModelId: string;
  }>([
    {
      provider: "openrouter",
      modelId: "anthropic/claude-haiku-4.5",
      expectedProvider: "openrouter.chat",
      expectedModelId: "anthropic/claude-haiku-4.5",
    },
    {
      provider: "openai",
      modelId: "gpt-5-mini",
      expectedProvider: "openai.responses",
      expectedModelId: "gpt-5-mini",
    },
    {
      provider: "anthropic",
      modelId: "claude-haiku-4-5",
      expectedProvider: "anthropic.messages",
      expectedModelId: "claude-haiku-4-5",
    },
    {
      provider: "google",
      modelId: "models/gemini-2.5-flash",
      expectedProvider: "google.generative-ai",
      expectedModelId: "gemini-2.5-flash",
    },
    {
      provider: "xai",
      modelId: "grok-3-mini",
      expectedProvider: "xai.chat",
      expectedModelId: "grok-3-mini",
    },
  ])("creates the $provider model without a request", ({
    provider,
    modelId,
    expectedProvider,
    expectedModelId,
  }) => {
    const model = createParentTutorModel({
      provider,
      modelId,
      credential: "  provider-secret  ",
    });

    expect(model.provider).toBe(expectedProvider);
    expect(model.modelId).toBe(expectedModelId);
    expect(JSON.stringify(model)).not.toContain("provider-secret");
  });

  it("rejects an empty credential", () => {
    expect(() => createParentTutorModel({
      provider: "anthropic",
      modelId: "claude-haiku-4-5",
      credential: "   ",
    })).toThrow("AI tutor credential is unavailable.");
  });
});
