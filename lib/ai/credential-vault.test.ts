import { describe, expect, it } from "vitest";
import {
  credentialAad,
  credentialFingerprint,
  decryptCredential,
  encryptCredential,
  keyringFromEnvironment,
  type CredentialKeyring,
} from "./credential-vault";

const key = (fill: number) => Buffer.alloc(32, fill).toString("base64");

function keyring(): CredentialKeyring {
  return {
    currentVersion: "v2",
    keys: new Map([
      ["v1", Buffer.alloc(32, 1)],
      ["v2", Buffer.alloc(32, 2)],
    ]),
  };
}

describe("credential vault", () => {
  it("round trips a secret only with the same parent-bound context", () => {
    const aad = credentialAad({
      parentId: "parent-a",
      connectionId: "connection-a",
      provider: "openai",
    });
    const encrypted = encryptCredential("sk-parent-secret", aad, keyring());

    expect(encrypted.ciphertext).not.toContain("sk-parent-secret");
    expect(encrypted.keyVersion).toBe("v2");
    expect(decryptCredential(encrypted, aad, keyring())).toBe("sk-parent-secret");

    const wrongParent = credentialAad({
      parentId: "parent-b",
      connectionId: "connection-a",
      provider: "openai",
    });
    expect(() => decryptCredential(encrypted, wrongParent, keyring())).toThrow();
  });

  it("keeps older credentials decryptable during key rotation", () => {
    const aad = "vidya:test";
    const oldRing: CredentialKeyring = {
      currentVersion: "v1",
      keys: new Map([["v1", Buffer.alloc(32, 1)]]),
    };
    const encrypted = encryptCredential("old-secret", aad, oldRing);

    expect(decryptCredential(encrypted, aad, keyring())).toBe("old-secret");
  });

  it("parses a current key plus versioned decryption keys", () => {
    const parsed = keyringFromEnvironment({
      AI_CREDENTIAL_ENCRYPTION_KEY: key(2),
      AI_CREDENTIAL_ENCRYPTION_KEY_VERSION: "v2",
      AI_CREDENTIAL_DECRYPTION_KEYS: JSON.stringify({ v1: key(1) }),
    });

    expect(parsed.currentVersion).toBe("v2");
    expect(parsed.keys.get("v1")).toHaveLength(32);
    expect(parsed.keys.get("v2")).toHaveLength(32);
  });

  it("rejects missing, short, duplicate, and malformed encryption configuration", () => {
    expect(() => keyringFromEnvironment({})).toThrow(/AI_CREDENTIAL_ENCRYPTION_KEY/);
    expect(() => keyringFromEnvironment({
      AI_CREDENTIAL_ENCRYPTION_KEY: Buffer.alloc(16).toString("base64"),
      AI_CREDENTIAL_ENCRYPTION_KEY_VERSION: "v1",
    })).toThrow(/32 bytes/);
    expect(() => keyringFromEnvironment({
      AI_CREDENTIAL_ENCRYPTION_KEY: key(2),
      AI_CREDENTIAL_ENCRYPTION_KEY_VERSION: "v2",
      AI_CREDENTIAL_DECRYPTION_KEYS: "not-json",
    })).toThrow(/JSON/);
    expect(() => keyringFromEnvironment({
      AI_CREDENTIAL_ENCRYPTION_KEY: key(2),
      AI_CREDENTIAL_ENCRYPTION_KEY_VERSION: "v2",
      AI_CREDENTIAL_DECRYPTION_KEYS: JSON.stringify({ v2: key(1) }),
    })).toThrow(/duplicates/);
  });

  it("creates a stable one-way fingerprint without exposing the secret", () => {
    const one = credentialFingerprint("openai", "sk-secret");
    const two = credentialFingerprint("openai", "sk-secret");
    const otherProvider = credentialFingerprint("anthropic", "sk-secret");

    expect(one).toBe(two);
    expect(one).toMatch(/^[a-f0-9]{64}$/);
    expect(one).not.toContain("sk-secret");
    expect(otherProvider).not.toBe(one);
  });
});
