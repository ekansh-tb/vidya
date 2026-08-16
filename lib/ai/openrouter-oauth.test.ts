import { describe, expect, it } from "vitest";
import { type CredentialKeyring } from "./credential-vault";
import {
  createOpenRouterOauthTransaction,
  readOpenRouterOauthTransaction,
} from "./openrouter-oauth";

const ring: CredentialKeyring = {
  currentVersion: "v1",
  keys: new Map([["v1", Buffer.alloc(32, 4)]]),
};

describe("OpenRouter OAuth transaction", () => {
  it("creates a documented S256 authorization URL without exposing the verifier", () => {
    const now = new Date("2026-08-16T10:00:00.000Z");
    const transaction = createOpenRouterOauthTransaction({
      parentId: "parent-a",
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
    expect(Buffer.from(transaction.cookieValue, "base64url").toString("utf8"))
      .not.toContain("2026-08-16T10:10:00.000Z");
  });

  it("binds the verifier to the same parent and ten-minute window", () => {
    const createdAt = new Date("2026-08-16T10:00:00.000Z");
    const transaction = createOpenRouterOauthTransaction({
      parentId: "parent-a",
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
});
