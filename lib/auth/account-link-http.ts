import "server-only";

import { dbConfigured } from "../db/client";
import { rateLimit, rateHeaders } from "../api/guard";

export function accountLinkResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "private, no-store" } });
}

/** These credential mutations require an exact origin, even in development. */
export function accountLinkGuard(req: Request): Response | null {
  if (req.headers.get("origin") !== new URL(req.url).origin) {
    return accountLinkResponse({ error: "Forbidden" }, 403);
  }
  if (!dbConfigured()) return accountLinkResponse({ error: "Storage unavailable" }, 503);
  return null;
}

export async function accountLinkRateLimit(userId: string): Promise<Response | null> {
  const result = await rateLimit(`account-link:${userId}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (result.ok && !result.unavailable) return null;
  const response = result.unavailable
    ? accountLinkResponse({ error: "Request limits unavailable. Please try again." }, 503)
    : accountLinkResponse({ error: "Too many requests" }, 429);
  for (const [key, value] of Object.entries(rateHeaders(result, 20))) response.headers.set(key, value);
  return response;
}

/** Bound the streamed body, rather than trusting a Content-Length header. */
export async function accountLinkBody(req: Request): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
