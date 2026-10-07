import { z } from "zod";
import { adminAccess, adminResponse, readAdminBody } from "@/lib/admin/http";
import { placementSchema } from "@/lib/learning/placement";
import { revokeAdminDevice, correctAdminPlacement } from "@/lib/db/admin";
const revoke = z.object({ action: z.literal("revoke-device"), parentId: z.string().regex(/^user_[A-Za-z0-9]+$/), learnerId: z.uuid(), deviceId: z.uuid(), confirmation: z.literal("REVOKE") }).strict();
const correct = z.object({ action: z.literal("correct-placement"), parentId: z.string().regex(/^user_[A-Za-z0-9]+$/), learnerId: z.uuid(), placement: placementSchema, confirmation: z.literal("CORRECT PLACEMENT") }).strict();
const operation = z.union([revoke, correct]);
export async function POST(req: Request) {
  const a = await adminAccess(req, true); if (a.response) return a.response;
  let raw: unknown; try { raw = await readAdminBody(req); } catch { return adminResponse({ error: "Invalid JSON" }, 400); }
  const d = operation.safeParse(raw); if (!d.success) return adminResponse({ error: "Invalid operation or confirmation" }, 400);
  if (d.data.action === "correct-placement" && d.data.placement.kind === "early-years" && process.env.EARLY_YEARS_ENABLED !== "true") return adminResponse({ error: "Preschool placement changes are not enabled" }, 409);
  try { const changed = d.data.action === "revoke-device" ? await revokeAdminDevice(a.owner.userId, d.data.parentId, d.data.learnerId, d.data.deviceId) : await correctAdminPlacement(a.owner.userId, d.data.parentId, d.data.learnerId, d.data.placement); return changed ? adminResponse({ changed: true }) : adminResponse({ error: "Resource not available in this family" }, 409); } catch { return adminResponse({ error: "Support operation unavailable" }, 503); }
}
