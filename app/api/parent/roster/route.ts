import { requireParent } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { listLearnersForParent } from "@/lib/db/queries";
import { isSameOrigin } from "@/lib/api/guard";

export const runtime = "nodejs";
function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "private, no-store" } });
}

/** No local ids, device credentials or caller-selected owner enter this roster. */
export async function GET(req: Request) {
  if (!isSameOrigin(req)) return reply({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return reply({ error: "Storage unavailable" }, 503);
  try {
    const parent = await requireParent();
    if (!parent) return reply({ error: "Unauthorized" }, 401);
    const rows = await listLearnersForParent(parent.userId);
    const learners = rows.filter((row) => row.parentId === parent.userId).map((row) => ({
      id: row.id, name: row.name, grade: row.grade, board: row.board,
      school: row.school, city: row.city, verificationLevel: row.verificationLevel,
      pickedSubjects: row.pickedSubjects, subjectsLocked: row.subjectsLocked,
      disabledCapabilities: row.disabledCapabilities, createdAt: row.createdAt,
    }));
    return reply({ parentId: parent.userId, learners });
  } catch { return reply({ error: "Could not load your family roster" }, 503); }
}
