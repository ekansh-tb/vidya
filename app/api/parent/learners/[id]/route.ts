import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { updateLearnerForParent } from "@/lib/db/queries";
import { isSameOrigin, rateLimit } from "@/lib/api/guard";
import { profilePlacementFields } from "@/lib/learning/placement";
export const runtime = "nodejs";
const schema = z.object({ name: z.string().trim().min(1).max(80).optional() }).and(profilePlacementFields);
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const parent = await requireParent();
  if (!parent) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const limit = await rateLimit(`placement:${parent.userId}`, { limit: 30, windowMs: 600_000 });
  if (!limit.ok) return Response.json({ error: "Please try later" }, { status: limit.unavailable ? 503 : 429 });
  const data = schema.safeParse(await req.json().catch(() => null));
  if (!data.success) return Response.json({ error: "Invalid placement" }, { status: 400 });
  if (data.data.placement?.kind === "early-years" && process.env.EARLY_YEARS_ENABLED !== "true") return Response.json({ error: "Preschool enrollment is not yet available" }, { status: 409 });
  const { id } = await context.params;
  const learner = await updateLearnerForParent(parent.userId, id, data.data);
  return learner ? Response.json({ learner }) : Response.json({ error: "Not found" }, { status: 404 });
}
