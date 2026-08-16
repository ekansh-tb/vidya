import { describe, expect, it, vi } from "vitest";
import {
  providerCredentialRequest,
  validateProviderCredential,
} from "./provider-validation";

describe("provider credential validation", () => {
  it.each([
    ["openrouter", "https://openrouter.ai/api/v1/key", "authorization", "Bearer secret"],
    ["openai", "https://api.openai.com/v1/models", "authorization", "Bearer secret"],
    ["anthropic", "https://api.anthropic.com/v1/models", "x-api-key", "secret"],
    ["google", "https://generativelanguage.googleapis.com/v1beta/models", "x-goog-api-key", "secret"],
    ["xai", "https://api.x.ai/v1/models", "authorization", "Bearer secret"],
  ] as const)("builds a server-only %s validation request", (provider, url, header, value) => {
    const request = providerCredentialRequest(provider, "secret");

    expect(request.url).toBe(url);
    expect(request.url).not.toContain("secret");
    expect(request.headers.get(header)).toBe(value);
  });

  it("distinguishes valid, billable-attention, invalid, and unavailable results", async () => {
    const okFetch = vi.fn(async () => new Response("{}", { status: 200 }));
    const paymentFetch = vi.fn(async () => new Response("{}", { status: 402 }));
    const invalidFetch = vi.fn(async () => new Response("{}", { status: 401 }));
    const unavailableFetch = vi.fn(async () => new Response("{}", { status: 503 }));

    await expect(validateProviderCredential("openai", "secret", okFetch)).resolves.toEqual({
      kind: "valid",
    });
    await expect(validateProviderCredential("openai", "secret", paymentFetch)).resolves.toEqual({
      kind: "needs_attention",
    });
    await expect(validateProviderCredential("openai", "secret", invalidFetch)).resolves.toEqual({
      kind: "invalid",
    });
    await expect(validateProviderCredential("openai", "secret", unavailableFetch)).resolves.toEqual({
      kind: "unavailable",
    });
  });

  it("treats rate-limited credentials as real but needing attention", async () => {
    const limitedFetch = vi.fn(async () => new Response("{}", { status: 429 }));

    await expect(validateProviderCredential("anthropic", "secret", limitedFetch)).resolves.toEqual({
      kind: "needs_attention",
    });
  });

  it("does not leak provider response bodies through its result", async () => {
    const fetcher = vi.fn(async () => new Response(
      JSON.stringify({ error: "secret provider detail" }),
      { status: 401, headers: { "content-type": "application/json" } },
    ));

    const result = await validateProviderCredential("google", "secret", fetcher);

    expect(result).toEqual({ kind: "invalid" });
    expect(JSON.stringify(result)).not.toContain("secret provider detail");
  });
});
