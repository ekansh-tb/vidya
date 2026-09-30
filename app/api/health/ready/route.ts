import { readinessResponse } from "@/lib/health/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Limited core readiness; external feature availability is intentionally separate. */
export function GET() {
  return readinessResponse(process.env.VERCEL_GIT_COMMIT_SHA);
}
