import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { isSameOrigin, clientKey, rateHeaders, rateLimit } from "@/lib/api/guard";
import { readBoundedJson } from "@/lib/api/bounded-json";
import {
  configuredCredentialKeyring,
  credentialAad,
  credentialFingerprint,
  encryptCredential,
} from "@/lib/ai/credential-vault";
import { validateProviderCredential } from "@/lib/ai/provider-validation";
import { dbConfigured } from "@/lib/db/client";
import {
  deleteAiConnectionForParent,
  getAiConnectionCredentialForParent,
  replaceDirectAiConnectionCredentialForParent,
} from "@/lib/db/ai-connections";

export const runtime = "nodejs";

const DELETE_RATE = { limit: 20, windowMs: 10 * 60 * 1000 };
const REPLACE_RATE = { limit: 10, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 2 * 1024;
const paramsSchema = z.object({ id: z.uuid() });
const replaceSchema = z.object({
  credential: z.string().trim().min(12).max(512),
}).strict();
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
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

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-connection-replace:${parent.userId}:${clientKey(req)}`,
    REPLACE_RATE,
  );
  if (!verdict.ok) {
    return json(
      { error: "Too many requests" },
      429,
      rateHeaders(verdict, REPLACE_RATE.limit),
    );
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const parsedParams = paramsSchema.safeParse(await ctx.params);
  if (!parsedParams.success) return json({ error: "Not found" }, 404);

  const body = await readBoundedJson(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return json(
      { error: "Bad request" },
      body.reason === "too_large" ? 413 : 400,
    );
  }
  const parsedBody = replaceSchema.safeParse(body.value);
  if (!parsedBody.success) return json({ error: "Bad request" }, 400);

  let keyring;
  try {
    keyring = configuredCredentialKeyring();
  } catch {
    return json({ error: "Credential storage unavailable" }, 503);
  }

  try {
    const connection = await getAiConnectionCredentialForParent(
      parent.userId,
      parsedParams.data.id,
    );
    if (!connection) return json({ error: "Not found" }, 404);
    if (connection.source !== "api_key") {
      return json({ error: "Linked accounts must be reconnected through the provider" }, 409);
    }

    const credential = parsedBody.data.credential;
    const validation = await validateProviderCredential(connection.provider, credential);
    if (validation.kind === "invalid") {
      return json({ error: "Provider rejected this credential" }, 400);
    }
    if (validation.kind === "unavailable") {
      return json({ error: "Provider validation unavailable" }, 503);
    }

    const encryptedCredential = encryptCredential(
      credential,
      credentialAad({
        parentId: parent.userId,
        connectionId: connection.id,
        provider: connection.provider,
      }),
      keyring,
    );
    const updated = await replaceDirectAiConnectionCredentialForParent({
      parentId: parent.userId,
      connectionId: connection.id,
      actorId: parent.userId,
      status: validation.kind === "valid" ? "active" : "needs_attention",
      encryptedCredential,
      credentialFingerprint: credentialFingerprint(connection.provider, credential),
      credentialHint: credential.slice(-4),
    });
    if (!updated) return json({ error: "Not found" }, 404);
    return json({ connection: updated }, 200);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return json({ error: "That provider key is already connected" }, 409);
    }
    console.error("[api/parent/ai-connections/:id] credential replacement failed");
    return json({ error: "Could not replace provider key" }, 500);
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-connection-delete:${parent.userId}:${clientKey(req)}`,
    DELETE_RATE,
  );
  if (!verdict.ok) {
    return json(
      { error: "Too many requests" },
      429,
      rateHeaders(verdict, DELETE_RATE.limit),
    );
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const parsed = paramsSchema.safeParse(await ctx.params);
  if (!parsed.success) return json({ error: "Not found" }, 404);

  try {
    const deleted = await deleteAiConnectionForParent(
      parent.userId,
      parsed.data.id,
      parent.userId,
    );
    if (!deleted) return json({ error: "Not found" }, 404);
    return json({ deleted: true }, 200);
  } catch {
    console.error("[api/parent/ai-connections/:id] delete failed");
    return json({ error: "Could not delete AI connection" }, 500);
  }
}
