import { describe, expect, it } from "vitest";
import {
  aiConnectionCredentialFromRow,
  aiConnectionSummaryFromRow,
} from "./ai-connections";

const privateRow = {
  id: "11111111-1111-4111-8111-111111111111",
  parent_id: "parent-a",
  provider: "openai",
  label: "Family OpenAI",
  source: "api_key",
  status: "active",
  credential_ciphertext: "encrypted-secret",
  credential_iv: "encrypted-iv",
  credential_tag: "encrypted-tag",
  credential_key_version: "v1",
  credential_fingerprint: "f".repeat(64),
  credential_hint: "1234",
  provider_account_id: null,
  last_validated_at: "2026-08-16T10:00:00.000Z",
  last_used_at: null,
  created_at: "2026-08-16T10:00:00.000Z",
  updated_at: "2026-08-16T10:00:00.000Z",
};

describe("AI connection persistence shapes", () => {
  it("maps a parent-facing summary without any credential material", () => {
    const summary = aiConnectionSummaryFromRow(privateRow);
    const serialized = JSON.stringify(summary);

    expect(summary).toEqual({
      id: privateRow.id,
      provider: "openai",
      label: "Family OpenAI",
      source: "api_key",
      status: "active",
      credentialHint: "1234",
      lastValidatedAt: privateRow.last_validated_at,
      lastUsedAt: null,
      createdAt: privateRow.created_at,
      updatedAt: privateRow.updated_at,
    });
    expect(serialized).not.toContain("encrypted-secret");
    expect(serialized).not.toContain("encrypted-iv");
    expect(serialized).not.toContain("encrypted-tag");
    expect(serialized).not.toContain(privateRow.credential_fingerprint);
    expect(serialized).not.toContain(privateRow.parent_id);
    expect(serialized).not.toContain("providerAccountId");
  });

  it("maps credential material only for the internal server path", () => {
    expect(aiConnectionCredentialFromRow(privateRow)).toEqual({
      id: privateRow.id,
      provider: "openai",
      source: "api_key",
      encryptedCredential: {
        ciphertext: "encrypted-secret",
        iv: "encrypted-iv",
        tag: "encrypted-tag",
        keyVersion: "v1",
      },
    });
  });

  it("fails closed when a database row contains an unsupported provider", () => {
    expect(() => aiConnectionSummaryFromRow({
      ...privateRow,
      provider: "unreviewed-provider",
    })).toThrow(/unsupported AI provider/);
  });
});
