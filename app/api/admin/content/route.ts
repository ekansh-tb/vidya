import { contentMutation } from "@/lib/admin/contracts";
import { adminAccess, adminResponse, readAdminBody } from "@/lib/admin/http";
import { listContent, seedContent, createDraft, reviewContent, publishContent, archiveContent } from "@/lib/db/admin";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const access = await adminAccess(req); if (access.response) return access.response;
  try { return adminResponse({ revisions: await listContent() }); } catch { return adminResponse({ error: "Content storage unavailable" }, 503); }
}
export async function POST(req: Request) {
  const access = await adminAccess(req, true); if (access.response) return access.response;
  let raw: unknown; try { raw = await readAdminBody(req); } catch { return adminResponse({ error: "Invalid JSON" }, 400); }
  const parsed = contentMutation.safeParse(raw); if (!parsed.success) return adminResponse({ error: "Invalid content or missing review checks" }, 400);
  const d = parsed.data;
  try {
    if (d.action === "seed") return adminResponse({ imported: await seedContent(access.owner.userId) });
    if (d.action === "draft") { const created = await createDraft(access.owner.userId, d.payload); return created ? adminResponse({ revision: created }, 201) : adminResponse({ error: "Another draft was created. Refresh and retry." }, 409); }
    const changed = d.action === "review" ? await reviewContent(access.owner.userId, d.id, d.revision, d.record) : d.action === "publish" ? await publishContent(access.owner.userId, d.id, d.revision) : await archiveContent(access.owner.userId, d.id, d.revision);
    return changed ? adminResponse({ changed: true }) : adminResponse({ error: "Revision unavailable or transition not permitted" }, 409);
  } catch { return adminResponse({ error: "Operation unavailable. Refresh before retrying." }, 503); }
}
