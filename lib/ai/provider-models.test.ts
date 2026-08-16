import { describe, expect, it, vi } from "vitest";
import {
  discoverProviderModels,
  parseProviderModels,
  providerModelsRequest,
} from "./provider-models";

describe("provider model discovery", () => {
  it.each([
    ["openrouter", "https://openrouter.ai/api/v1/models?output_modalities=text", "authorization", "Bearer secret"],
    ["openai", "https://api.openai.com/v1/models", "authorization", "Bearer secret"],
    ["anthropic", "https://api.anthropic.com/v1/models?limit=1000", "x-api-key", "secret"],
    ["google", "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000", "x-goog-api-key", "secret"],
    ["xai", "https://api.x.ai/v1/language-models", "authorization", "Bearer secret"],
  ] as const)("builds the documented %s model-list request", (provider, url, header, value) => {
    const request = providerModelsRequest(provider, "secret");
    expect(request.url).toBe(url);
    expect(request.url).not.toContain("secret");
    expect(request.headers.get(header)).toBe(value);
  });

  it("parses OpenAI-compatible, Anthropic, Google, and xAI response shapes", () => {
    expect(parseProviderModels("openai", {
      data: [{ id: "gpt-4.1-mini" }, { id: "gpt-4.1-mini" }],
    })).toEqual({
      models: [{ id: "gpt-4.1-mini", name: "gpt-4.1-mini" }],
      truncated: false,
    });
    expect(parseProviderModels("anthropic", {
      data: [{ id: "claude-haiku-4-5", display_name: "Claude Haiku 4.5" }],
    })?.models).toEqual([{ id: "claude-haiku-4-5", name: "Claude Haiku 4.5" }]);
    expect(parseProviderModels("google", {
      models: [
        {
          name: "models/gemini-2.5-flash",
          displayName: "Gemini 2.5 Flash",
          supportedGenerationMethods: ["generateContent"],
        },
        {
          name: "models/text-embedding-004",
          supportedGenerationMethods: ["embedContent"],
        },
      ],
    })?.models).toEqual([{
      id: "models/gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
    }]);
    expect(parseProviderModels("xai", {
      models: [{ id: "grok-4.3" }],
    })?.models).toEqual([{ id: "grok-4.3", name: "grok-4.3" }]);
  });

  it("drops malformed IDs and bounds the public catalog", () => {
    const data = Array.from({ length: 510 }, (_, index) => ({
      id: index === 0 ? "https://unsafe.example/model" : `provider/model-${index}`,
      name: `Model ${index}`,
    }));
    const parsed = parseProviderModels("openrouter", { data });
    expect(parsed?.models).toHaveLength(500);
    expect(parsed?.truncated).toBe(true);
    expect(JSON.stringify(parsed)).not.toContain("unsafe.example");
  });

  it("distinguishes rejected credentials, provider failures, and invalid payloads", async () => {
    await expect(discoverProviderModels(
      "openai",
      "secret",
      vi.fn(async () => new Response("{}", { status: 401 })),
    )).resolves.toEqual({ kind: "invalid_credential" });
    await expect(discoverProviderModels(
      "openai",
      "secret",
      vi.fn(async () => new Response("{}", { status: 503 })),
    )).resolves.toEqual({ kind: "unavailable" });
    await expect(discoverProviderModels(
      "openai",
      "secret",
      vi.fn(async () => Response.json({ unexpected: [] })),
    )).resolves.toEqual({ kind: "invalid_response" });
  });

  it("rejects oversized provider responses without exposing their contents", async () => {
    const result = await discoverProviderModels(
      "openrouter",
      "secret",
      vi.fn(async () => Response.json({ data: [{ id: "provider/model", detail: "x".repeat(500) }] })),
      1_000,
      100,
    );
    expect(result).toEqual({ kind: "invalid_response" });
    expect(JSON.stringify(result)).not.toContain("x".repeat(20));
  });

  it("aborts a stalled provider request", async () => {
    vi.useFakeTimers();
    const fetcher: typeof fetch = async (input) => {
      const request = input instanceof Request ? input : new Request(input);
      return new Promise<Response>((_resolve, reject) => {
        request.signal.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    };
    try {
      const result = discoverProviderModels("anthropic", "secret", fetcher, 5);
      await vi.advanceTimersByTimeAsync(5);
      await expect(result).resolves.toEqual({ kind: "unavailable" });
    } finally {
      vi.useRealTimers();
    }
  });
});
