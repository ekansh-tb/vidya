import "server-only";

export type HealthStatus = "alive" | "ready" | "unavailable";

/** Only full Git object IDs from deployment metadata may leave this module. */
export function healthResponse(status: HealthStatus, commit: unknown): Response {
  const body: { status: HealthStatus; commit?: string } = { status };
  if (typeof commit === "string" && (commit.length === 40 || commit.length === 64)
    && !/[^a-f0-9]/i.test(commit)) {
    body.commit = commit.toLowerCase();
  }
  return Response.json(body, {
    status: status === "unavailable" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** A local catalog smoke check, not database, auth, AI or full-content readiness. */
export async function coreCatalogAvailable(): Promise<boolean> {
  const { BOARDS } = await import("@/lib/content/boards");
  return Array.isArray(BOARDS) && BOARDS.length > 0;
}

/** Bound local module loading; never expose exception details or log them here. */
export async function readinessResponse(
  commit: unknown,
  check: () => Promise<boolean> = coreCatalogAvailable,
): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const available = await Promise.race([
      Promise.resolve().then(check),
      new Promise<false>((resolve) => {
        timer = setTimeout(() => resolve(false), 500);
      }),
    ]);
    return healthResponse(available === true ? "ready" : "unavailable", commit);
  } catch {
    return healthResponse("unavailable", commit);
  } finally {
    clearTimeout(timer);
  }
}
