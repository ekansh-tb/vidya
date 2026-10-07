import "server-only";
import { requireOwner } from "./auth";
import { dbConfigured } from "@/lib/db/client";
import { isSameOrigin, rateLimit } from "@/lib/api/guard";
export const PRIVATE_HEADERS = { "cache-control": "private, no-store", "vary": "Cookie", "x-content-type-options": "nosniff" };
export function adminResponse(data: unknown, status = 200) { return Response.json(data, { status, headers: PRIVATE_HEADERS }); }
export async function adminAccess(req: Request, mutation = false) {
  if (!isSameOrigin(req)) return { response: adminResponse({ error: "Forbidden" }, 403) };
  const owner = await requireOwner();
  if (!owner) return { response: adminResponse({ error: "Owner access required" }, 403) };
  if (!dbConfigured()) return { response: adminResponse({ error: "Storage unavailable" }, 503) };
  if (mutation) {
    const verdict = await rateLimit(`admin:${owner.userId}`, { limit: 60, windowMs: 600_000 });
    if (verdict.unavailable) return { response: adminResponse({ error: "Service temporarily unavailable" }, 503) };
    if (!verdict.ok) return { response: adminResponse({ error: "Too many requests" }, 429) };
  }
  return { owner };
}
export async function readAdminBody(req: Request): Promise<unknown> {
  if (!req.headers.get("content-type")?.includes("application/json")) throw new Error("Expected JSON");
  const body = await req.text(); if (body.length > 100_000) throw new Error("Body too large");
  return JSON.parse(body);
}
