import { beforeEach, expect, it, vi } from "vitest";
const consume = vi.hoisted(() => vi.fn());
vi.mock("../db/request-limits", () => ({ consumeRequestLimit: consume }));
import { accountLinkRateLimit } from "./account-link-http";
beforeEach(() => vi.resetAllMocks());
it("awaits the shared-store verdict", async () => {
  consume.mockResolvedValue({ ok: true, remaining: 19, resetAt: 10000, retryAfterSeconds: 0 });
  expect(await accountLinkRateLimit("parent")).toBeNull();
  expect(consume).toHaveBeenCalledWith("account-link:parent", { limit: 20, windowMs: 600000 });
});
it("returns 429 with retry and private cache headers for quota exhaustion", async () => {
  consume.mockResolvedValue({ ok: false, remaining: 0, resetAt: 10000, retryAfterSeconds: 10 });
  const result = await accountLinkRateLimit("parent");
  expect(result?.status).toBe(429);
  expect(result?.headers.get("retry-after")).toBe("10");
  expect(result?.headers.get("cache-control")).toBe("private, no-store");
});
it("returns a sanitized 503 with retry for unavailable storage", async () => {
  consume.mockRejectedValue(new Error("database secret"));
  const result = await accountLinkRateLimit("parent");
  expect(result?.status).toBe(503);
  expect(result?.headers.get("retry-after")).toBe("5");
  expect(await result?.text()).not.toContain("secret");
});
