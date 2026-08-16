import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/api/guard";
import {
  configuredCredentialKeyring,
  credentialAad,
  credentialFingerprint,
  encryptCredential,
} from "@/lib/ai/credential-vault";
import {
  configuredOpenRouterCallbackUrl,
  exchangeOpenRouterAuthorizationCode,
  OPENROUTER_CALLBACK_PATH,
  readOpenRouterOauthTransaction,
} from "@/lib/ai/openrouter-oauth";
import { dbConfigured } from "@/lib/db/client";
import { createAiConnectionForParent } from "@/lib/db/ai-connections";

export const runtime = "nodejs";

const CALLBACK_RATE = { limit: 10, windowMs: 10 * 60 * 1000 };
const querySchema = z.string().min(1).max(512);
const COOKIE_NAME = "vidya_openrouter_oauth";

function cookieValue(req: Request): string | null {
  for (const part of (req.headers.get("cookie") ?? "").split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) return value.join("=") || null;
  }
  return null;
}

function clearCookie(): string {
  const attributes = [
    `${COOKIE_NAME}=`,
    `Path=${OPENROUTER_CALLBACK_PATH}`,
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

function parentRedirect(callbackUrl: string, status: string): Response {
  const url = new URL("/parent", callbackUrl);
  url.searchParams.set("ai", status);
  return new Response(null, {
    status: 303,
    headers: {
      location: url.toString(),
      "set-cookie": clearCookie(),
      "cache-control": "private, no-store",
      "referrer-policy": "no-referrer",
    },
  });
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error
    && typeof error === "object"
    && "code" in error
    && (error as { code?: unknown }).code === "23505",
  );
}

export async function GET(req: Request) {
  let callbackUrl: string;
  try {
    callbackUrl = configuredOpenRouterCallbackUrl(req.url);
  } catch {
    return Response.json(
      { error: "OpenRouter connection unavailable" },
      {
        status: 503,
        headers: {
          "cache-control": "private, no-store",
          "set-cookie": clearCookie(),
        },
      },
    );
  }

  if (!dbConfigured()) return parentRedirect(callbackUrl, "connection_failed");

  const parent = await requireParent();
  if (!parent) return parentRedirect(callbackUrl, "sign_in_required");

  const verdict = rateLimit(
    `parent-openrouter-callback:${parent.userId}:${clientKey(req)}`,
    CALLBACK_RATE,
  );
  if (!verdict.ok) return parentRedirect(callbackUrl, "connection_failed");

  const code = querySchema.safeParse(new URL(req.url).searchParams.get("code"));
  const transactionCookie = cookieValue(req);
  if (!code.success || !transactionCookie) {
    return parentRedirect(callbackUrl, "connection_failed");
  }

  let keyring;
  let transaction: { verifier: string; label: string };
  try {
    keyring = configuredCredentialKeyring();
    transaction = readOpenRouterOauthTransaction({
      cookieValue: transactionCookie,
      parentId: parent.userId,
      keyring,
    });
  } catch {
    return parentRedirect(callbackUrl, "connection_failed");
  }

  try {
    const exchanged = await exchangeOpenRouterAuthorizationCode({
      code: code.data,
      verifier: transaction.verifier,
    });
    const id = randomUUID();
    const encryptedCredential = encryptCredential(
      exchanged.key,
      credentialAad({
        parentId: parent.userId,
        connectionId: id,
        provider: "openrouter",
      }),
      keyring,
    );
    await createAiConnectionForParent({
      id,
      parentId: parent.userId,
      actorId: parent.userId,
      provider: "openrouter",
      label: transaction.label,
      source: "oauth",
      status: "active",
      encryptedCredential,
      credentialFingerprint: credentialFingerprint("openrouter", exchanged.key),
      credentialHint: exchanged.key.slice(-4),
      providerAccountId: exchanged.providerAccountId,
    });
    return parentRedirect(callbackUrl, "connected");
  } catch (error) {
    if (isUniqueViolation(error)) return parentRedirect(callbackUrl, "duplicate");
    return parentRedirect(callbackUrl, "connection_failed");
  }
}
