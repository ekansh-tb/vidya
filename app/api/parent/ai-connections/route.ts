import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { isSameOrigin, clientKey, rateHeaders, rateLimit } from "@/lib/api/guard";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { dbConfigured } from "@/lib/db/client";
import {
  createAiConnectionForParent,
  listAiConnectionsForParent,
} from "@/lib/db/ai-connections";
import {
  configuredCredentialKeyring,
  credentialAad,
  credentialFingerprint,
  encryptCredential,
} from "@/lib/ai/credential-vault";
import {
  AI_PROVIDER_IDS,
  validateProviderCredential,
} from "@/lib/ai/provider-validation";

export const runtime = "nodejs";

const CREATE_RATE = { limit: 10, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 4 * 1024;
const privateHeaders = { "cache-control": "private, no-store" };
const createSchema = z.object({
  provider: z.enum(AI_PROVIDER_IDS),
  label: z.string().trim().min(1).max(80),
  credential: z.string().trim().min(12).max(512),
}).strict();

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
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
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  try {
    const connections = await listAiConnectionsForParent(parent.userId);
    return json({ connections });
  } catch {
    console.error("[api/parent/ai-connections] list failed");
    return json({ error: "Could not read AI connections" }, 500);
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-connection-create:${parent.userId}:${clientKey(req)}`,
    CREATE_RATE,
  );
  if (!verdict.ok) {
    return json(
      { error: "Too many requests" },
      429,
      rateHeaders(verdict, CREATE_RATE.limit),
    );
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const body = await readBoundedJson(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return json(
      { error: "Bad request" },
      body.reason === "too_large" ? 413 : 400,
    );
  }
  const parsed = createSchema.safeParse(body.value);
  if (!parsed.success) return json({ error: "Bad request" }, 400);

  let keyring;
  try {
    keyring = configuredCredentialKeyring();
  } catch {
    return json({ error: "Credential storage unavailable" }, 503);
  }

  const { provider, label, credential } = parsed.data;
  const validation = await validateProviderCredential(provider, credential);
  if (validation.kind === "invalid") {
    return json({ error: "Provider rejected this credential" }, 400);
  }
  if (validation.kind === "unavailable") {
    return json({ error: "Provider validation unavailable" }, 503);
  }

  const id = randomUUID();
  try {
    const encryptedCredential = encryptCredential(
      credential,
      credentialAad({ parentId: parent.userId, connectionId: id, provider }),
      keyring,
    );
    const connection = await createAiConnectionForParent({
      id,
      parentId: parent.userId,
      actorId: parent.userId,
      provider,
      label,
      source: "api_key",
      status: validation.kind === "valid" ? "active" : "needs_attention",
      encryptedCredential,
      credentialFingerprint: credentialFingerprint(provider, credential),
      credentialHint: credential.slice(-4),
    });
    return json({ connection }, 201);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return json(
        { error: "A connection with that label or credential already exists" },
        409,
      );
    }
    console.error("[api/parent/ai-connections] create failed");
    return json({ error: "Could not save AI connection" }, 500);
  }
}
