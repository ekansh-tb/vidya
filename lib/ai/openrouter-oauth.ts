import "server-only";

import { createHash, randomBytes } from "node:crypto";
import {
  decryptCredential,
  encryptCredential,
  type CredentialKeyring,
  type EncryptedCredential,
} from "./credential-vault";

const TRANSACTION_TTL_MS = 10 * 60 * 1000;
const AAD_PREFIX = "vidya:openrouter-oauth";

type StoredOauthTransaction = {
  verifier: string;
  expiresAt: string;
};

function isEncryptedCredential(value: unknown): value is EncryptedCredential {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<EncryptedCredential>;
  return typeof candidate.ciphertext === "string"
    && typeof candidate.iv === "string"
    && typeof candidate.tag === "string"
    && typeof candidate.keyVersion === "string";
}

function aad(parentId: string): string {
  return `${AAD_PREFIX}:${parentId}`;
}

export function createOpenRouterOauthTransaction(input: {
  parentId: string;
  callbackUrl: string;
  keyring: CredentialKeyring;
  now?: Date;
}): { authorizationUrl: string; cookieValue: string } {
  const now = input.now ?? new Date();
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const stored: StoredOauthTransaction = {
    verifier,
    expiresAt: new Date(now.getTime() + TRANSACTION_TTL_MS).toISOString(),
  };
  const encrypted = encryptCredential(
    JSON.stringify(stored),
    aad(input.parentId),
    input.keyring,
  );
  const cookieValue = Buffer.from(JSON.stringify(encrypted), "utf8").toString("base64url");

  const url = new URL("https://openrouter.ai/auth");
  url.searchParams.set("callback_url", input.callbackUrl);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return { authorizationUrl: url.toString(), cookieValue };
}

export function readOpenRouterOauthTransaction(input: {
  cookieValue: string;
  parentId: string;
  keyring: CredentialKeyring;
  now?: Date;
}): { verifier: string } {
  let encrypted: unknown;
  try {
    encrypted = JSON.parse(
      Buffer.from(input.cookieValue, "base64url").toString("utf8"),
    ) as unknown;
  } catch {
    throw new Error("OpenRouter connection transaction is invalid.");
  }
  if (!isEncryptedCredential(encrypted)) {
    throw new Error("OpenRouter connection transaction is invalid.");
  }

  let stored: StoredOauthTransaction;
  try {
    stored = JSON.parse(
      decryptCredential(encrypted, aad(input.parentId), input.keyring),
    ) as StoredOauthTransaction;
  } catch {
    throw new Error("OpenRouter connection transaction is invalid.");
  }
  if (typeof stored.verifier !== "string" || typeof stored.expiresAt !== "string") {
    throw new Error("OpenRouter connection transaction is invalid.");
  }
  const expiresAt = new Date(stored.expiresAt).getTime();
  const now = (input.now ?? new Date()).getTime();
  if (!Number.isFinite(expiresAt) || now > expiresAt) {
    throw new Error("OpenRouter connection transaction expired.");
  }
  return { verifier: stored.verifier };
}
