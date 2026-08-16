import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const KEY_BYTES = 32;
const IV_BYTES = 12;
const VERSION = /^[A-Za-z0-9._-]{1,32}$/;

export type CredentialEnvironment = {
  AI_CREDENTIAL_ENCRYPTION_KEY?: string;
  AI_CREDENTIAL_ENCRYPTION_KEY_VERSION?: string;
  AI_CREDENTIAL_DECRYPTION_KEYS?: string;
};

export type CredentialKeyring = {
  currentVersion: string;
  keys: Map<string, Buffer>;
};

export type EncryptedCredential = {
  ciphertext: string;
  iv: string;
  tag: string;
  keyVersion: string;
};

function decodeKey(value: string, name: string): Buffer {
  const key = Buffer.from(value, "base64");
  if (key.length !== KEY_BYTES) {
    throw new Error(`${name} must decode to exactly 32 bytes.`);
  }
  return key;
}

function parsePreviousKeys(value: string | undefined): Record<string, unknown> {
  if (!value?.trim()) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("AI_CREDENTIAL_DECRYPTION_KEYS must be valid JSON.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI_CREDENTIAL_DECRYPTION_KEYS must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

export function keyringFromEnvironment(env: CredentialEnvironment): CredentialKeyring {
  const currentKey = env.AI_CREDENTIAL_ENCRYPTION_KEY?.trim();
  if (!currentKey) {
    throw new Error("AI_CREDENTIAL_ENCRYPTION_KEY is not configured.");
  }
  const currentVersion = env.AI_CREDENTIAL_ENCRYPTION_KEY_VERSION?.trim();
  if (!currentVersion || !VERSION.test(currentVersion)) {
    throw new Error("AI_CREDENTIAL_ENCRYPTION_KEY_VERSION is not valid.");
  }

  const previous = parsePreviousKeys(env.AI_CREDENTIAL_DECRYPTION_KEYS);
  if (Object.hasOwn(previous, currentVersion)) {
    throw new Error("AI_CREDENTIAL_DECRYPTION_KEYS duplicates the current key version.");
  }

  const keys = new Map<string, Buffer>();
  for (const [version, encoded] of Object.entries(previous)) {
    if (!VERSION.test(version) || typeof encoded !== "string") {
      throw new Error("AI_CREDENTIAL_DECRYPTION_KEYS contains an invalid entry.");
    }
    keys.set(version, decodeKey(encoded, `AI credential key ${version}`));
  }
  keys.set(currentVersion, decodeKey(currentKey, "AI_CREDENTIAL_ENCRYPTION_KEY"));
  return { currentVersion, keys };
}

export function configuredCredentialKeyring(): CredentialKeyring {
  return keyringFromEnvironment({
    AI_CREDENTIAL_ENCRYPTION_KEY: process.env.AI_CREDENTIAL_ENCRYPTION_KEY,
    AI_CREDENTIAL_ENCRYPTION_KEY_VERSION: process.env.AI_CREDENTIAL_ENCRYPTION_KEY_VERSION,
    AI_CREDENTIAL_DECRYPTION_KEYS: process.env.AI_CREDENTIAL_DECRYPTION_KEYS,
  });
}

export function credentialVaultConfigured(): boolean {
  try {
    configuredCredentialKeyring();
    return true;
  } catch {
    return false;
  }
}

export function credentialAad(input: {
  parentId: string;
  connectionId: string;
  provider: string;
}): string {
  return `vidya:ai-credential:${input.parentId}:${input.connectionId}:${input.provider}`;
}

export function encryptCredential(
  secret: string,
  aad: string,
  keyring: CredentialKeyring,
): EncryptedCredential {
  const key = keyring.keys.get(keyring.currentVersion);
  if (!key) throw new Error("Current AI credential encryption key is unavailable.");
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    keyVersion: keyring.currentVersion,
  };
}

export function decryptCredential(
  encrypted: EncryptedCredential,
  aad: string,
  keyring: CredentialKeyring,
): string {
  const key = keyring.keys.get(encrypted.keyVersion);
  if (!key) throw new Error("AI credential encryption key version is unavailable.");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(encrypted.iv, "base64"),
  );
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(Buffer.from(encrypted.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function credentialFingerprint(provider: string, secret: string): string {
  return createHash("sha256")
    .update("vidya-ai-credential\0")
    .update(provider)
    .update("\0")
    .update(secret)
    .digest("hex");
}
