import { afterEach, describe, expect, it, vi } from "vitest";

// Fail loudly if either handler starts importing optional service clients.
vi.mock("@/lib/db/client", () => { throw new Error("Database unavailable"); });
vi.mock("@/lib/ai/models", () => { throw new Error("AI unavailable"); });
vi.mock("@/lib/auth/session", () => { throw new Error("Auth unavailable"); });

import { GET as live } from "./route";
import { GET as ready } from "./ready/route";

afterEach(() => vi.unstubAllEnvs());

describe("health handlers without optional services", () => {
  it("returns liveness with no deployment metadata", async () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", undefined);
    const response = live();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "alive" });
  });

  it("reports local readiness despite unavailable database, auth and AI modules", async () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "d".repeat(40));
    const response = await ready();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ready", commit: "d".repeat(40) });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
