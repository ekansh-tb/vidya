import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  reverificationErrorResponse: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mocks.auth,
  reverificationErrorResponse: mocks.reverificationErrorResponse,
}));

import { requireRecentParentReverification } from "./reverification";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.reverificationErrorResponse.mockReturnValue(
    Response.json({ clerk_error: { reason: "reverification-error" } }, { status: 403 }),
  );
});

describe("parent reverification", () => {
  it("accepts Clerk's strict recent-verification preset", async () => {
    const has = vi.fn(() => true);
    mocks.auth.mockResolvedValue({ has });

    await expect(requireRecentParentReverification()).resolves.toBeNull();
    expect(has).toHaveBeenCalledWith({ reverification: "strict" });
  });

  it("returns Clerk's machine-readable challenge when verification is stale", async () => {
    mocks.auth.mockResolvedValue({ has: vi.fn(() => false) });

    const response = await requireRecentParentReverification();

    expect(mocks.reverificationErrorResponse).toHaveBeenCalledWith("strict");
    expect(response?.status).toBe(403);
    expect(response?.headers.get("cache-control")).toBe("private, no-store");
  });
});
