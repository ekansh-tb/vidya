import { afterEach, describe, expect, it, vi } from "vitest";
import { coreCatalogAvailable, healthResponse, readinessResponse } from "./status";

afterEach(() => vi.useRealTimers());

describe("public health redaction", () => {
  it("exposes only status and a validated deployed commit", async () => {
    const response = healthResponse("ready", "A".repeat(40));
    expect(await response.json()).toEqual({ status: "ready", commit: "a".repeat(40) });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it.each([undefined, "", "abc1234", "a".repeat(41), "z".repeat(40),
    "postgres://user:secret@private/db", "learner@example.test", "a".repeat(40) + "\n",
    { secret: "do not serialize" }, "b".repeat(65)])(
    "omits missing or malformed metadata (%j)", async (commit) => {
      expect(await healthResponse("alive", commit).json()).toEqual({ status: "alive" });
    },
  );

  it("accepts a full SHA-256 object ID", async () => {
    expect(await healthResponse("alive", "b".repeat(64)).json()).toEqual({
      status: "alive", commit: "b".repeat(64),
    });
  });
});

describe("limited core readiness", () => {
  it("checks the actual bundled catalog without remote requests", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    try {
      expect(await coreCatalogAvailable()).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("returns unavailable for a missing local dependency", async () => {
    const response = await readinessResponse(undefined, async () => false);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
  });

  it.each(["throw", "reject"])("redacts %s failures including private diagnostics", async (mode) => {
    const error = new Error("postgres://user:secret@private/db learner@example.test");
    const check = () => {
      if (mode === "throw") throw error;
      return Promise.reject(error);
    };
    const response = await readinessResponse("c".repeat(40), check);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable", commit: "c".repeat(40) });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("bounds an unavailable dependency and safely handles a late rejection", async () => {
    vi.useFakeTimers();
    let reject!: (reason: Error) => void;
    const result = readinessResponse(undefined, () => new Promise<boolean>((_, fail) => { reject = fail; }));
    await vi.advanceTimersByTimeAsync(500);
    const response = await result;
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
    reject(new Error("late private failure"));
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(0);
  });
});
