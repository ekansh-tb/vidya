import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import {
  configuredCredentialKeyring,
  credentialAad,
  decryptCredential,
} from "@/lib/ai/credential-vault";
import { discoverProviderModels } from "@/lib/ai/provider-models";
import { getAiConnectionCredentialForParent } from "@/lib/db/ai-connections";
import { dbConfigured } from "@/lib/db/client";

export const runtime = "nodejs";
export const maxDuration = 20;

const RATE = { limit: 20, windowMs: 10 * 60 * 1000 };
const paramsSchema = z.object({ id: z.uuid() });
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-models:${parent.userId}:${clientKey(req)}`,
    RATE,
  );
  if (!verdict.ok) {
    return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
  }

  const parsed = paramsSchema.safeParse(await ctx.params);
  if (!parsed.success) return json({ error: "Not found" }, 404);

  try {
    const connection = await getAiConnectionCredentialForParent(
      parent.userId,
      parsed.data.id,
    );
    if (!connection) return json({ error: "Not found" }, 404);

    let keyring;
    try {
      keyring = configuredCredentialKeyring();
    } catch {
      return json({ error: "Credential storage unavailable" }, 503);
    }
    const secret = decryptCredential(
      connection.encryptedCredential,
      credentialAad({
        parentId: parent.userId,
        connectionId: connection.id,
        provider: connection.provider,
      }),
      keyring,
    );
    const discovery = await discoverProviderModels(connection.provider, secret);
    if (discovery.kind === "invalid_credential") {
      return json({ error: "Provider rejected this connection" }, 409);
    }
    if (discovery.kind !== "success") {
      return json({ error: "Provider model list unavailable" }, 502);
    }
    return json({
      provider: connection.provider,
      models: discovery.models,
      truncated: discovery.truncated,
    });
  } catch {
    console.error("[api/parent/ai-connections/:id/models] discovery failed");
    return json({ error: "Provider model list unavailable" }, 502);
  }
}
