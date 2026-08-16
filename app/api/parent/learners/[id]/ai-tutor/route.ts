import { z } from "zod";
import { readBoundedJson } from "@/lib/api/bounded-json";
import { clientKey, isSameOrigin, rateHeaders, rateLimit } from "@/lib/api/guard";
import { TUTOR_POLICY_LIMITS } from "@/lib/ai/tutor-policy";
import { requireParent } from "@/lib/auth/session";
import { requireRecentParentReverification } from "@/lib/auth/reverification";
import {
  getLearnerAiAssignmentForParent,
  removeLearnerAiAssignmentForParent,
  setLearnerAiAssignmentForParent,
} from "@/lib/db/ai-tutor-policies";
import { dbConfigured } from "@/lib/db/client";
import { getLearnerForParent } from "@/lib/db/queries";

export const runtime = "nodejs";

const RATE = { limit: 30, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 2 * 1024;
const paramsSchema = z.object({ id: z.uuid() });
const assignmentSchema = z.object({
  tutorProfileId: z.uuid(),
  enabled: z.boolean(),
  dailyTurnLimit: z.number().int()
    .min(TUTOR_POLICY_LIMITS.dailyTurns.min)
    .max(TUTOR_POLICY_LIMITS.dailyTurns.max),
  maxOutputTokens: z.number().int()
    .min(TUTOR_POLICY_LIMITS.maxOutputTokens.min)
    .max(TUTOR_POLICY_LIMITS.maxOutputTokens.max),
}).strict();
const privateHeaders = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { ...privateHeaders, ...headers },
  });
}

type ParentLearnerResult =
  | { ok: false; response: Response }
  | { ok: true; parentId: string; learnerId: string };

async function parentAndLearner(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<ParentLearnerResult> {
  if (!isSameOrigin(req)) return { ok: false, response: json({ error: "Forbidden" }, 403) };
  if (!dbConfigured()) {
    return { ok: false, response: json({ error: "Storage unavailable" }, 503) };
  }
  const parent = await requireParent();
  if (!parent) return { ok: false, response: json({ error: "Unauthorized" }, 401) };
  const parsed = paramsSchema.safeParse(await ctx.params);
  if (!parsed.success) return { ok: false, response: json({ error: "Not found" }, 404) };
  const learner = await getLearnerForParent(parent.userId, parsed.data.id);
  if (!learner) return { ok: false, response: json({ error: "Not found" }, 404) };
  return { ok: true, parentId: parent.userId, learnerId: learner.id };
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const resolved = await parentAndLearner(req, ctx);
  if (!resolved.ok) return resolved.response;
  try {
    const assignment = await getLearnerAiAssignmentForParent(
      resolved.parentId,
      resolved.learnerId,
    );
    return json({ assignment });
  } catch {
    console.error("[api/parent/learners/:id/ai-tutor] read failed");
    return json({ error: "Could not read learner AI settings" }, 500);
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const resolved = await parentAndLearner(req, ctx);
  if (!resolved.ok) return resolved.response;

  const verdict = rateLimit(
    `parent-learner-ai-set:${resolved.parentId}:${clientKey(req)}`,
    RATE,
  );
  if (!verdict.ok) {
    return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
  }
  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  const body = await readBoundedJson(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return json({ error: "Bad request" }, body.reason === "too_large" ? 413 : 400);
  }
  const parsed = assignmentSchema.safeParse(body.value);
  if (!parsed.success) return json({ error: "Bad request" }, 400);

  try {
    const assignment = await setLearnerAiAssignmentForParent({
      parentId: resolved.parentId,
      actorId: resolved.parentId,
      learnerId: resolved.learnerId,
      ...parsed.data,
    });
    return assignment
      ? json({ assignment })
      : json({ error: "AI tutor profile is unavailable" }, 409);
  } catch {
    console.error("[api/parent/learners/:id/ai-tutor] update failed");
    return json({ error: "Could not save learner AI settings" }, 500);
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const resolved = await parentAndLearner(req, ctx);
  if (!resolved.ok) return resolved.response;

  const verdict = rateLimit(
    `parent-learner-ai-delete:${resolved.parentId}:${clientKey(req)}`,
    RATE,
  );
  if (!verdict.ok) {
    return json({ error: "Too many requests" }, 429, rateHeaders(verdict, RATE.limit));
  }
  const reverification = await requireRecentParentReverification();
  if (reverification) return reverification;

  try {
    const deleted = await removeLearnerAiAssignmentForParent(
      resolved.parentId,
      resolved.learnerId,
      resolved.parentId,
    );
    return json({ deleted });
  } catch {
    console.error("[api/parent/learners/:id/ai-tutor] delete failed");
    return json({ error: "Could not remove learner AI settings" }, 500);
  }
}
