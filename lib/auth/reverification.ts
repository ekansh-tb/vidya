import "server-only";

import { auth, reverificationErrorResponse } from "@clerk/nextjs/server";

/**
 * Require Clerk's strict recent-verification preset for a sensitive parent
 * action. Callers must establish the parent role before calling this helper.
 */
export async function requireRecentParentReverification(): Promise<Response | null> {
  const { has } = await auth();
  if (has({ reverification: "strict" })) return null;

  const response = reverificationErrorResponse("strict");
  response.headers.set("cache-control", "private, no-store");
  return response;
}
