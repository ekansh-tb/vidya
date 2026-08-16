import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import {
  configuredCredentialKeyring,
  credentialAad,
  decryptCredential,
} from "@/lib/ai/credential-vault";
import { validateProviderCredential } from "@/lib/ai/provider-validation";
import {
  getAiConnectionCredentialForParent,
  setAiConnectionStatusForParent,
} from "@/lib/db/ai-connections";
import { dbConfigured } from "@/lib/db/client";

export const runtime = "nodejs";
export const maxDuration = 20;

const RATE = { limit: 10, windowMs: 10 * 60 * 1000 };
const paramsSchema = z.object({ id: z.uuid() });
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-connection-validate:${parent.userId}:${clientKey(req)}`,
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
    const validation = await validateProviderCredential(connection.provider, secret);
    if (validation.kind === "unavailable") {
      return json({ error: "Provider validation unavailable" }, 502);
    }

    const status = validation.kind === "valid" ? "active" : "needs_attention";
    const updated = await setAiConnectionStatusForParent(
      parent.userId,
      connection.id,
      status,
      parent.userId,
    );
    if (!updated) return json({ error: "Not found" }, 404);
    return json({ connection: updated });
  } catch {
    console.error("[api/parent/ai-connections/:id/validate] failed");
    return json({ error: "Provider validation unavailable" }, 502);
  }
}
