import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import { configuredCredentialKeyring } from "@/lib/ai/credential-vault";
import {
  configuredOpenRouterCallbackUrl,
  createOpenRouterOauthTransaction,
  OPENROUTER_CALLBACK_PATH,
} from "@/lib/ai/openrouter-oauth";
import { dbConfigured } from "@/lib/db/client";
import { listAiConnectionsForParent } from "@/lib/db/ai-connections";

export const runtime = "nodejs";

const START_RATE = { limit: 10, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 1024;
const schema = z.object({
  label: z.string().trim().min(1).max(80),
}).strict();
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

function transactionCookie(value: string): string {
  const attributes = [
    `vidya_openrouter_oauth=${value}`,
    `Path=${OPENROUTER_CALLBACK_PATH}`,
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=600",
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-openrouter-start:${parent.userId}:${clientKey(req)}`,
    START_RATE,
  );
  if (!verdict.ok) {
    return json(
      { error: "Too many requests" },
      429,
      rateHeaders(verdict, START_RATE.limit),
    );
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const body = await readBoundedJson(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return json({ error: "Bad request" }, body.reason === "too_large" ? 413 : 400);
  }
  const parsed = schema.safeParse(body.value);
  if (!parsed.success) return json({ error: "Bad request" }, 400);

  let keyring;
  let callbackUrl: string;
  try {
    keyring = configuredCredentialKeyring();
    callbackUrl = configuredOpenRouterCallbackUrl(req.url);
  } catch {
    return json({ error: "OpenRouter connection unavailable" }, 503);
  }

  try {
    const existing = await listAiConnectionsForParent(parent.userId);
    if (existing.some((connection) => (
      connection.label.toLowerCase() === parsed.data.label.toLowerCase()
    ))) {
      return json({ error: "A connection with that label already exists" }, 409);
    }

    const transaction = createOpenRouterOauthTransaction({
      parentId: parent.userId,
      label: parsed.data.label,
      callbackUrl,
      keyring,
    });
    return json(
      { authorizationUrl: transaction.authorizationUrl },
      200,
      { "set-cookie": transactionCookie(transaction.cookieValue) },
    );
  } catch {
    console.error("[api/parent/ai-connections/openrouter/start] failed");
    return json({ error: "Could not start OpenRouter connection" }, 500);
  }
}
