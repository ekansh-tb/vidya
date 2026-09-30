import { NextRequest, type NextFetchEvent } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: true,
  auth: vi.fn(),
  clerk: vi.fn(),
}));

vi.mock("@/lib/auth/clerk-config", () => ({
  get clerkConfigured() { return mocks.configured; },
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: (
    callback: (auth: typeof mocks.auth, req: NextRequest) => Promise<Response>,
  ) => (req: NextRequest, event: NextFetchEvent) => {
    mocks.clerk(req, event);
    return callback(mocks.auth, req);
  },
  createRouteMatcher: (patterns: string[]) => (req: NextRequest) =>
    patterns.some((pattern) => new RegExp(`^${pattern}$`).test(req.nextUrl.pathname)),
}));

import middleware from "./middleware";

const event = {} as NextFetchEvent;
const request = (path: string) => new NextRequest(`https://vidya.example${path}`);
async function responseFor(path: string) {
  const response = await middleware(request(path), event);
  if (!response) throw new Error("Expected a middleware response");
  return response;
}

beforeEach(() => {
  mocks.configured = true;
  mocks.auth.mockReset().mockResolvedValue({ userId: null });
  mocks.clerk.mockReset();
});

describe("exact public health middleware bypass", () => {
  it.each([
    "/api/health", "/api/health/ready",
    "/api/health?probe=1", "/api/health/ready?probe=1",
  ])("does not invoke unavailable Clerk for %s", async (path) => {
    mocks.clerk.mockImplementation(() => { throw new Error("Clerk unavailable"); });
    const response = await responseFor(path);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(mocks.clerk).not.toHaveBeenCalled();
    expect(mocks.auth).not.toHaveBeenCalled();
  });

  it.each(["/api/health", "/api/health/ready"])("also works without Clerk configured: %s", async (path) => {
    mocks.configured = false;
    const response = await responseFor(path);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(mocks.clerk).not.toHaveBeenCalled();
  });

  it.each([
    "/api/health/", "/api/health/ready/", "/api/health/private",
    "/api/health/ready/private", "/api/healthcheck", "/api/health/readyz",
    "/api/Health", "/api/health%2Fready", "/api/tutor", "/api/parent/roster",
  ])("retains Clerk initialization for %s", async (path) => {
    const req = request(path);
    await middleware(req, event);
    expect(mocks.clerk).toHaveBeenCalledExactlyOnceWith(req, event);
    expect(mocks.auth).toHaveBeenCalledOnce();
  });
});

describe("existing parent and auth behavior", () => {
  it.each(["/parent", "/parent/dashboard"])("keeps anonymous parent path guarded: %s", async (path) => {
    const response = await responseFor(path);
    const location = new URL(response.headers.get("location")!);
    expect(response.status).toBe(307);
    expect(location.pathname).toBe("/sign-in");
    expect(location.searchParams.get("next")).toBe(path);
    expect(mocks.clerk).toHaveBeenCalledOnce();
    expect(mocks.auth).toHaveBeenCalledOnce();
  });

  it("allows an authenticated parent only after Clerk runs", async () => {
    mocks.auth.mockResolvedValue({ userId: "synthetic-parent" });
    const response = await responseFor("/parent/dashboard");
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(mocks.auth).toHaveBeenCalledOnce();
  });

  it("does not bypass Clerk failure on another API", async () => {
    mocks.auth.mockRejectedValue(new Error("Clerk unavailable"));
    await expect(middleware(request("/api/parent/roster"), event)).rejects.toThrow("Clerk unavailable");
  });

  it.each(["/parent/dashboard", "/sign-in", "/sign-up"])("preserves the unconfigured fallback for %s", async (path) => {
    mocks.configured = false;
    const response = await responseFor(path);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    expect(mocks.clerk).not.toHaveBeenCalled();
  });

  it("preserves the signed-in redirect away from auth pages", async () => {
    mocks.auth.mockResolvedValue({ userId: "synthetic-parent" });
    const response = await responseFor("/sign-in");
    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    expect(mocks.auth).toHaveBeenCalledOnce();
  });
});
