import { adminAccess, adminResponse } from "@/lib/admin/http";
import { listAudit } from "@/lib/db/admin";
export async function GET(req: Request) { const a = await adminAccess(req); if (a.response) return a.response; try { return adminResponse({ events: await listAudit() }); } catch { return adminResponse({ error: "Audit unavailable" }, 503); } }
