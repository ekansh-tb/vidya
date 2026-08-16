import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import { dbConfigured } from "@/lib/db/client";
import { pauseAllLearnerAiAssignmentsForParent } from "@/lib/db/ai-tutor-policies";

export const runtime = "nodejs";

const RATE = { limit: 5, windowMs: 10 * 60 * 1000 };
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!dbConfigured()) return json({ error: "Storage unavailable" }, 503);

  const parent = await requireParent();
  if (!parent) return json({ error: "Unauthorized" }, 401);

  const verdict = rateLimit(
    `parent-ai-pause-all:${parent.userId}:${clientKey(req)}`,
    RATE,
  );
  if (!verdict.ok) {
    return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
  }

  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  try {
    const pausedAssignments = await pauseAllLearnerAiAssignmentsForParent(
      parent.userId,
      parent.userId,
    );
    return json({ pausedAssignments });
  } catch {
    console.error("[api/parent/ai-tutors/pause-all] failed");
    return json({ error: "Could not pause learner AI access" }, 500);
  }
}
