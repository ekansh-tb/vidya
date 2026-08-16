import { describe, expect, it } from "vitest";
import {
  apiErrorMessage,
  isOpenRouterAuthorizationUrl,
  isDeletedAiConnection,
  parseAiConnectionsResponse,
  parseAuthorizationUrl,
  parseCreatedAiConnection,
} from "./connection-summary";

const connection = {
  id: "11111111-1111-4111-8111-111111111111",
  provider: "openrouter",
  label: "Family OpenRouter",
  source: "oauth",
  status: "active",
  credentialHint: "1234",
  lastValidatedAt: "2026-08-16T10:00:00.000Z",
  lastUsedAt: null,
  createdAt: "2026-08-16T10:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};

describe("AI connection response parsing", () => {
  it("constructs a public summary and drops unexpected private fields", () => {
    const parsed = parseAiConnectionsResponse({
      connections: [{
        ...connection,
        parent_id: "parent-secret",
        credential_ciphertext: "encrypted-secret",
        provider_account_id: "provider-account-secret",
      }],
    });

    expect(parsed).toEqual([connection]);
    expect(JSON.stringify(parsed)).not.toContain("parent-secret");
    expect(JSON.stringify(parsed)).not.toContain("encrypted-secret");
    expect(JSON.stringify(parsed)).not.toContain("provider-account-secret");
  });

  it("rejects a response when any connection is malformed", () => {
    expect(parseAiConnectionsResponse({
      connections: [connection, { ...connection, provider: "unknown" }],
    })).toBeNull();
    expect(parseAiConnectionsResponse({ connections: "not-an-array" })).toBeNull();
  });

  it("parses create, authorization, delete, and bounded error payloads", () => {
    expect(parseCreatedAiConnection({ connection })).toEqual(connection);
    expect(parseAuthorizationUrl({ authorizationUrl: "https://openrouter.ai/auth" }))
      .toBe("https://openrouter.ai/auth");
    expect(isDeletedAiConnection({ deleted: true })).toBe(true);
    expect(apiErrorMessage({ error: "  Try again  " }, "Fallback")).toBe("Try again");
    expect(apiErrorMessage({ error: "x".repeat(201) }, "Fallback")).toBe("Fallback");
  });

  it("allows redirects only to the exact OpenRouter authorization endpoint", () => {
    expect(isOpenRouterAuthorizationUrl("https://openrouter.ai/auth?callback_url=x"))
      .toBe(true);
    expect(isOpenRouterAuthorizationUrl("https://openrouter.ai.evil.example/auth"))
      .toBe(false);
    expect(isOpenRouterAuthorizationUrl("https://openrouter.ai/api/v1/keys"))
      .toBe(false);
    expect(isOpenRouterAuthorizationUrl("not-a-url")).toBe(false);
  });
});
