import "server-only";

import { auth, reverificationErrorResponse } from "@clerk/nextjs/server";

/** Requires a signed-in account; does not establish guardian authority. */
export async function requireRecentAccountReverification(): Promise<Response | null> {
  const { has } = await auth();
  if (has({ reverification: "strict" })) return null;

  const response = reverificationErrorResponse("strict");
  response.headers.set("cache-control", "private, no-store");
  return response;
}

/** Parent routes must establish parent authority separately. */
export const requireRecentParentReverification = requireRecentAccountReverification;
