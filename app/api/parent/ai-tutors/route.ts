import { randomUUID } from "node:crypto";
import { z } from "zod";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import {
  configuredCredentialKeyring,
  credentialAad,
  decryptCredential,
} from "@/lib/ai/credential-vault";
import { discoverProviderModels } from "@/lib/ai/provider-models";
import { isTutorModelId } from "@/lib/ai/tutor-policy";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { getAiConnectionCredentialForParent } from "@/lib/db/ai-connections";
import {
  createAiTutorProfileForParent,
  listAiTutorProfilesForParent,
} from "@/lib/db/ai-tutor-policies";
import { dbConfigured } from "@/lib/db/client";

export const runtime = "nodejs";
export const maxDuration = 20;

const RATE = { limit: 15, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 2 * 1024;
const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  connectionId: z.uuid(),
  modelId: z.string().trim().min(1).max(160).refine(isTutorModelId),
}).strict();
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

function uniqueViolation(error: unknown): boolean {
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
    return json({ profiles: await listAiTutorProfilesForParent(parent.userId) });
  } catch {
    console.error("[api/parent/ai-tutors] list failed");
    return json({ error: "Could not read AI tutors" }, 500);
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);
  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(`parent-ai-tutor-create:${parent.userId}:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
  }
  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const body = await readBoundedJson(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return json({ error: "Bad request" }, body.reason === "too_large" ? 413 : 400);
  }
  const parsed = createSchema.safeParse(body.value);
  if (!parsed.success) return json({ error: "Bad request" }, 400);

  const connection = await getAiConnectionCredentialForParent(
    parent.userId,
    parsed.data.connectionId,
  );
  if (!connection) return json({ error: "Not found" }, 404);

  let secret: string;
  try {
    secret = decryptCredential(
      connection.encryptedCredential,
      credentialAad({
        parentId: parent.userId,
        connectionId: connection.id,
        provider: connection.provider,
      }),
      configuredCredentialKeyring(),
    );
  } catch {
    return json({ error: "Credential storage unavailable" }, 503);
  }

  const discovery = await discoverProviderModels(connection.provider, secret);
  if (discovery.kind === "invalid_credential") {
    return json({ error: "Provider rejected this connection" }, 409);
  }
  if (discovery.kind !== "success") {
    return json({ error: "Provider model list unavailable" }, 502);
  }
  if (!discovery.models.some((model) => model.id === parsed.data.modelId)) {
    return json({ error: "Model is not available to this connection" }, 400);
  }

  try {
    const profile = await createAiTutorProfileForParent({
      id: randomUUID(),
      parentId: parent.userId,
      actorId: parent.userId,
      connectionId: parsed.data.connectionId,
      name: parsed.data.name,
      modelId: parsed.data.modelId,
    });
    if (!profile) return json({ error: "Connection needs attention" }, 409);
    return json({ profile }, 201);
  } catch (error) {
    if (uniqueViolation(error)) {
      return json({ error: "An AI tutor with that name already exists" }, 409);
    }
    console.error("[api/parent/ai-tutors] create failed");
    return json({ error: "Could not save AI tutor" }, 500);
  }
}
