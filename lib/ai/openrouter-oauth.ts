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
export const OPENROUTER_CALLBACK_PATH = "/api/parent/ai-connections/openrouter/callback";

type StoredOauthTransaction = {
  verifier: string;
  label: string;
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
  label: string;
  callbackUrl: string;
  keyring: CredentialKeyring;
  now?: Date;
}): { authorizationUrl: string; cookieValue: string } {
  const now = input.now ?? new Date();
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const stored: StoredOauthTransaction = {
    verifier,
    label: input.label,
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
}): { verifier: string; label: string } {
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
  if (
    typeof stored.verifier !== "string"
    || typeof stored.label !== "string"
    || typeof stored.expiresAt !== "string"
  ) {
    throw new Error("OpenRouter connection transaction is invalid.");
  }
  const expiresAt = new Date(stored.expiresAt).getTime();
  const now = (input.now ?? new Date()).getTime();
  if (!Number.isFinite(expiresAt) || now > expiresAt) {
    throw new Error("OpenRouter connection transaction expired.");
  }
  return { verifier: stored.verifier, label: stored.label };
}

export function openRouterCallbackUrl(input: {
  configuredOrigin?: string;
  requestUrl: string;
  production: boolean;
}): string {
  const candidate = input.configuredOrigin?.trim();
  if (!candidate && input.production) {
    throw new Error("AI_OAUTH_CALLBACK_ORIGIN is not configured.");
  }

  const url = new URL(candidate || input.requestUrl);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (
    url.username
    || url.password
    || url.search
    || url.hash
    || (candidate && url.pathname !== "/")
    || (
      url.protocol !== "https:"
      && !(!input.production && isLocal && url.protocol === "http:")
    )
  ) {
    throw new Error("AI_OAUTH_CALLBACK_ORIGIN must be a secure origin.");
  }
  return new URL(OPENROUTER_CALLBACK_PATH, url.origin).toString();
}

export function configuredOpenRouterCallbackUrl(requestUrl: string): string {
  return openRouterCallbackUrl({
    configuredOrigin: process.env.AI_OAUTH_CALLBACK_ORIGIN,
    requestUrl,
    production: process.env.NODE_ENV === "production",
  });
}

export async function exchangeOpenRouterAuthorizationCode(input: {
  code: string;
  verifier: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}): Promise<{ key: string; providerAccountId: string | null }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 10_000);
  try {
    const response = await (input.fetcher ?? fetch)(
      new Request("https://openrouter.ai/api/v1/auth/keys", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          code: input.code,
          code_verifier: input.verifier,
          code_challenge_method: "S256",
        }),
        cache: "no-store",
        signal: controller.signal,
      }),
    );
    if (!response.ok) throw new Error("exchange rejected");

    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > 4_096) {
      throw new Error("invalid exchange");
    }
    const responseText = await response.text();
    if (Buffer.byteLength(responseText, "utf8") > 4_096) {
      throw new Error("invalid exchange");
    }
    const raw = JSON.parse(responseText) as unknown;
    if (!raw || typeof raw !== "object") throw new Error("invalid exchange");
    const key = (raw as { key?: unknown }).key;
    const userId = (raw as { user_id?: unknown }).user_id;
    if (typeof key !== "string" || key.length < 12 || key.length > 512) {
      throw new Error("invalid exchange");
    }
    if (userId != null && (typeof userId !== "string" || userId.length > 256)) {
      throw new Error("invalid exchange");
    }
    return { key, providerAccountId: userId == null ? null : userId };
  } catch {
    throw new Error("OpenRouter connection could not be completed.");
  } finally {
    clearTimeout(timeout);
  }
}
