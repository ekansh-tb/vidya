import { z } from "zod";
import { dbConfigured } from "@/lib/db/client";
import { contentInitialized, listContent, publishedActivity } from "@/lib/db/admin";
import { PUBLISHED_SCHOOL_GRADES } from "@/lib/learning/release";
import { activitySchema } from "@/lib/admin/contracts";
export const runtime = "nodejs";
const query = z.object({ placement: z.string().regex(/^(nursery|lkg|ukg|school:([1-9]|1[0-3]))$/), language: z.enum(["en", "hi"]), id: z.string().regex(/^[a-z0-9-]{1,100}$/).optional(), revision: z.coerce.number().int().min(1).max(100000).optional() }).refine(v => !v.revision || !!v.id);
const headers = { "cache-control": "public, max-age=0, must-revalidate", "x-content-type-options": "nosniff" };
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const d = query.safeParse({ placement: p.get("placement"), language: p.get("language"), id: p.get("id") ?? undefined, revision: p.get("revision") ?? undefined });
  if (!d.success) return Response.json({ error: "Invalid content selection" }, { status: 400, headers });
  const { placement, language, id, revision } = d.data;
  if (placement.startsWith("school:") && !PUBLISHED_SCHOOL_GRADES.includes(Number(placement.slice(7)))) return Response.json({ activities: [], initialized: true }, { headers });
  if (!dbConfigured()) return Response.json({ error: "Publication service unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
  try {
    if (id) {
      const activity = await publishedActivity(id, revision);
      if (!activity || !activity.placements.includes(placement) || !activitySchema.safeParse(activity).success || !activity.title[language]) return Response.json({ error: "Reviewed activity unavailable for this placement" }, { status: 404, headers });
      return Response.json({ activities: [activity], initialized: true }, { headers });
    }
    if (!await contentInitialized()) return Response.json({ error: "Collection has not been imported" }, { status: 503, headers: { "cache-control": "no-store" } });
    const all = await listContent();
    const activities = all.filter(r => r.status === "published" && r.payload.placements.includes(placement) && r.payload.title[language] && activitySchema.safeParse(r.payload).success).map(r => r.payload);
    return Response.json({ activities, initialized: true }, { headers });
  } catch { return Response.json({ error: "Publication service unavailable" }, { status: 503, headers: { "cache-control": "no-store" } }); }
}
