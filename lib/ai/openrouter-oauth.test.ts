import { describe, expect, it } from "vitest";
import { type CredentialKeyring } from "./credential-vault";
import {
  createOpenRouterOauthTransaction,
  exchangeOpenRouterAuthorizationCode,
  openRouterCallbackUrl,
  readOpenRouterOauthTransaction,
} from "./openrouter-oauth";

const ring: CredentialKeyring = {
  currentVersion: "v1",
  keys: new Map([["v1", Buffer.alloc(32, 4)]]),
};

describe("OpenRouter OAuth transaction", () => {
  it("uses only a configured HTTPS origin in production", () => {
    expect(openRouterCallbackUrl({
      configuredOrigin: "https://vidyagyan.study",
      requestUrl: "https://untrusted.example/start",
      production: true,
    })).toBe("https://vidyagyan.study/api/parent/ai-connections/openrouter/callback");

    expect(() => openRouterCallbackUrl({
      requestUrl: "https://untrusted.example/start",
      production: true,
    })).toThrow(/not configured/);
    expect(() => openRouterCallbackUrl({
      configuredOrigin: "https://vidyagyan.study/unexpected-path",
      requestUrl: "https://untrusted.example/start",
      production: true,
    })).toThrow(/origin/);
    expect(() => openRouterCallbackUrl({
      configuredOrigin: "http://localhost:3000",
      requestUrl: "https://untrusted.example/start",
      production: true,
    })).toThrow(/origin/);
  });

  it("creates a documented S256 authorization URL without exposing the verifier", () => {
    const now = new Date("2026-08-16T10:00:00.000Z");
    const transaction = createOpenRouterOauthTransaction({
      parentId: "parent-a",
      label: "Family OpenRouter",
      callbackUrl: "https://vidyagyan.study/api/parent/ai-connections/openrouter/callback",
      keyring: ring,
      now,
    });
    const url = new URL(transaction.authorizationUrl);
    const stored = readOpenRouterOauthTransaction({
      cookieValue: transaction.cookieValue,
      parentId: "parent-a",
      keyring: ring,
      now,
    });

    expect(url.origin).toBe("https://openrouter.ai");
    expect(url.pathname).toBe("/auth");
    expect(url.searchParams.get("callback_url")).toBe(
      "https://vidyagyan.study/api/parent/ai-connections/openrouter/callback",
    );
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(transaction.cookieValue).not.toContain(stored.verifier);
    expect(stored.label).toBe("Family OpenRouter");
    expect(Buffer.from(transaction.cookieValue, "base64url").toString("utf8"))
      .not.toContain("2026-08-16T10:10:00.000Z");
  });

  it("binds the verifier to the same parent and ten-minute window", () => {
    const createdAt = new Date("2026-08-16T10:00:00.000Z");
    const transaction = createOpenRouterOauthTransaction({
      parentId: "parent-a",
      label: "Family OpenRouter",
      callbackUrl: "https://vidyagyan.study/callback",
      keyring: ring,
      now: createdAt,
    });

    expect(readOpenRouterOauthTransaction({
      cookieValue: transaction.cookieValue,
      parentId: "parent-a",
      keyring: ring,
      now: new Date("2026-08-16T10:09:59.000Z"),
    }).verifier).toMatch(/^[A-Za-z0-9_-]{64}$/);

    expect(() => readOpenRouterOauthTransaction({
      cookieValue: transaction.cookieValue,
      parentId: "parent-b",
      keyring: ring,
      now: createdAt,
    })).toThrow();

    expect(() => readOpenRouterOauthTransaction({
      cookieValue: transaction.cookieValue,
      parentId: "parent-a",
      keyring: ring,
      now: new Date("2026-08-16T10:10:01.000Z"),
    })).toThrow(/expired/);
  });

  it("exchanges a code using the documented server-side PKCE contract", async () => {
    const fetcher: typeof fetch = async (input) => {
      const request = input instanceof Request ? input : new Request(input);
      expect(request.url).toBe("https://openrouter.ai/api/v1/auth/keys");
      expect(request.method).toBe("POST");
      expect(await request.json()).toEqual({
        code: "authorization-code",
        code_verifier: "pkce-verifier",
        code_challenge_method: "S256",
      });
      return Response.json({ key: "sk-or-generated-secret", user_id: "openrouter-user" });
    };

    await expect(exchangeOpenRouterAuthorizationCode({
      code: "authorization-code",
      verifier: "pkce-verifier",
      fetcher,
    })).resolves.toEqual({
      key: "sk-or-generated-secret",
      providerAccountId: "openrouter-user",
    });
  });

  it("rejects failed and malformed code exchange responses without exposing details", async () => {
    const denied: typeof fetch = async () => new Response(
      JSON.stringify({ error: "provider secret detail" }),
      { status: 403 },
    );
    const malformed: typeof fetch = async () => Response.json({ key: "short" });

    await expect(exchangeOpenRouterAuthorizationCode({
      code: "authorization-code",
      verifier: "pkce-verifier",
      fetcher: denied,
    })).rejects.toThrow("OpenRouter connection could not be completed.");
    await expect(exchangeOpenRouterAuthorizationCode({
      code: "authorization-code",
      verifier: "pkce-verifier",
      fetcher: malformed,
    })).rejects.toThrow("OpenRouter connection could not be completed.");
  });
});
