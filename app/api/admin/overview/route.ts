import { adminAccess, adminResponse } from "@/lib/admin/http";
import { operationalOverview } from "@/lib/db/admin";
export async function GET(req: Request) { const a = await adminAccess(req); if (a.response) return a.response; try { return adminResponse({ counts: await operationalOverview() }); } catch { return adminResponse({ error: "Operations unavailable" }, 503); } }
