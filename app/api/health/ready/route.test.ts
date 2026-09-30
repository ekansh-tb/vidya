import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/boards", () => {
  throw new Error("Catalog import failed: /private/build learner@example.test");
});

import { GET } from "./route";
import { GET as live } from "../route";

afterEach(() => vi.unstubAllEnvs());

describe("unavailable catalog at the route boundary", () => {
  it("returns redacted 503 while runtime liveness remains available", async () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", undefined);
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
    expect(response.headers.get("cache-control")).toBe("no-store");
    const liveness = live();
    expect(liveness.status).toBe(200);
    expect(await liveness.json()).toEqual({ status: "alive" });
  });
});
