import { z } from "zod";
import { requireParent } from "@/lib/auth/session";
import { parentCircleRequest } from "@/lib/circles/contract";
import { circleAvailability, circleBody, circleMutationLimit, circleResponse } from "@/lib/circles/http";
import { acceptCircleInvite, cardsForLearner, circlesForLearner, closeCircleForParent, createCircleInvite, parentOwnsCircleLearner, reviewCircleCard } from "@/lib/db/circles";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const unavailable = circleAvailability(req); if (unavailable) return unavailable;
  const parent = await requireParent(); if (!parent) return circleResponse({ error: "Unauthorized" }, 401);
  const learnerId = z.uuid().safeParse(new URL(req.url).searchParams.get("learnerId"));
  if (!learnerId.success) return circleResponse({ error: "Choose a learner" }, 400);
  try {
    if (!await parentOwnsCircleLearner(parent.userId, learnerId.data)) return circleResponse({ error: "Not found" }, 404);
    const [circles, cards] = await Promise.all([circlesForLearner(learnerId.data), cardsForLearner(learnerId.data, true)]);
    return circleResponse({ circles, cards });
  } catch { return circleResponse({ error: "Private circles are unavailable right now" }, 503); }
}
export async function POST(req: Request) {
  const unavailable = circleAvailability(req); if (unavailable) return unavailable;
  const parent = await requireParent(); if (!parent) return circleResponse({ error: "Unauthorized" }, 401);
  const limited = await circleMutationLimit(parent.userId); if (limited) return limited;
  const body = await circleBody(req); if (!body.ok) return circleResponse({ error: "Invalid request" }, body.reason === "too_large" ? 413 : 400);
  const parsed = parentCircleRequest.safeParse(body.value); if (!parsed.success) return circleResponse({ error: "Invalid request" }, 400);
  try {
    const action = parsed.data;
    if (action.action === "invite") {
      const code = await createCircleInvite(parent.userId, action.learnerId, action.alias);
      return code ? circleResponse({ code, expiresInDays: 5 }) : circleResponse({ error: "Cannot create an invitation for this learner. A maximum of five current circles or invitations is supported." }, 409);
    }
    const ok = action.action === "accept" ? await acceptCircleInvite(parent.userId, action.learnerId, action.alias, action.code)
      : action.action === "review" ? await reviewCircleCard(parent.userId, action.cardId, action.approved)
      : await closeCircleForParent(parent.userId, action.circleId, action.action === "block" ? "blocked" : "left");
    return ok ? circleResponse({ ok: true }) : circleResponse({ error: "This invitation or action is no longer available" }, 409);
  } catch { return circleResponse({ error: "This action could not finish. Refresh and try again." }, 503); }
}
