import { requireLearnerFrom } from "@/lib/auth/session";
import { learnerCircleRequest } from "@/lib/circles/contract";
import { circleAvailability, circleBody, circleMutationLimit, circleResponse } from "@/lib/circles/http";
import { cardsForLearner, circlesForLearner, closeCircleForLearner, reactToCircleCard, reportCircle, requestCircleCard, unshareCircleCard } from "@/lib/db/circles";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const unavailable = circleAvailability(req); if (unavailable) return unavailable;
  const me = await requireLearnerFrom(req); if (!me) return circleResponse({ error: "Link a learner device to use private circles" }, 401);
  try {
    const [circles, cards] = await Promise.all([circlesForLearner(me.learner.id), cardsForLearner(me.learner.id)]);
    return circleResponse({ circles: circles.filter((circle) => circle.status !== "pending"), cards });
  } catch { return circleResponse({ error: "Private circles are unavailable right now" }, 503); }
}
export async function POST(req: Request) {
  const unavailable = circleAvailability(req); if (unavailable) return unavailable;
  const me = await requireLearnerFrom(req); if (!me) return circleResponse({ error: "Unauthorized" }, 401);
  const limited = await circleMutationLimit(me.learner.id); if (limited) return limited;
  const body = await circleBody(req); if (!body.ok) return circleResponse({ error: "Invalid request" }, body.reason === "too_large" ? 413 : 400);
  const parsed = learnerCircleRequest.safeParse(body.value); if (!parsed.success) return circleResponse({ error: "Invalid request" }, 400);
  try {
    const action = parsed.data;
    const ok = action.action === "share" ? await requestCircleCard(me.learner.id, action.circleId, action.projectId)
      : action.action === "unshare" ? await unshareCircleCard(me.learner.id, action.cardId)
      : action.action === "react" ? await reactToCircleCard(me.learner.id, action.cardId, action.reaction)
      : action.action === "report" ? await reportCircle(me.learner.id, action.circleId, action.reason)
      : await closeCircleForLearner(me.learner.id, action.circleId, action.action === "block" ? "blocked" : "left");
    return ok ? circleResponse({ ok: true }) : circleResponse({ error: "This action is unavailable. Save and sync your creation, check the circle is open, and keep at most 5 cards waiting for approval or 20 cards in each circle. You can stop sharing an old card to make room." }, 409);
  } catch { return circleResponse({ error: "This action could not finish. Refresh and try again." }, 503); }
}
