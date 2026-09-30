import { healthResponse } from "@/lib/health/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Liveness only. No database, authentication or AI calls in this handler. */
export function GET() {
  return healthResponse("alive", process.env.VERCEL_GIT_COMMIT_SHA);
}
