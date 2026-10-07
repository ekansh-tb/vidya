import { dbConfigured } from "../db/client";
import { isSameOrigin, rateHeaders, rateLimit } from "../api/guard";
import { readBoundedJson } from "../api/bounded-json";
export function circleResponse(data: unknown, status = 200) { return Response.json(data, { status, headers: { "cache-control": "private, no-store" } }); }
export function circleAvailability(req: Request) {
  if (!isSameOrigin(req)) return circleResponse({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return circleResponse({ error: "Private circles are unavailable right now" }, 503);
  return null;
}
export async function circleMutationLimit(identity: string) {
  const limit = { limit: 40, windowMs: 10 * 60 * 1000 }; const result = await rateLimit(`private-circle:${identity}`, limit);
  if (result.unavailable) return circleResponse({ error: "Private circles are unavailable right now" }, 503);
  if (!result.ok) return Response.json({ error: "Please try again later" }, { status: 429, headers: { ...rateHeaders(result, limit.limit), "cache-control": "private, no-store" } });
  return null;
}
export async function circleBody(req: Request) { return readBoundedJson(req, 4096); }
