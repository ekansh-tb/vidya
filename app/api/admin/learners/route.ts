import { z } from "zod";
import { adminAccess, adminResponse } from "@/lib/admin/http";
import { listAdminLearners, adminDevices } from "@/lib/db/admin";
const params = z.object({ parentId: z.string().regex(/^user_[A-Za-z0-9]+$/), learnerId: z.uuid() });
export async function GET(req: Request) {
  const a = await adminAccess(req); if (a.response) return a.response;
  try {
    const p = new URL(req.url).searchParams;
    if (p.has("learnerId")) { const d = params.safeParse({ parentId: p.get("parentId"), learnerId: p.get("learnerId") }); if (!d.success) return adminResponse({ error: "Invalid family scope" }, 400); return adminResponse({ devices: await adminDevices(d.data.parentId, d.data.learnerId) }); }
    return adminResponse({ learners: await listAdminLearners() });
  } catch { return adminResponse({ error: "Learner support unavailable" }, 503); }
}
