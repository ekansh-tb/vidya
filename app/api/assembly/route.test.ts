import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ configured: vi.fn(), rate: vi.fn(), generate: vi.fn() }));
vi.mock("ai", () => ({ generateText: mocks.generate }));
vi.mock("@/lib/api/guard", async (original) => ({ ...await original<typeof import("@/lib/api/guard")>(), rateLimit: mocks.rate }));
vi.mock("@/lib/ai/models", () => ({ aiProviderConfigured: mocks.configured, resolveVidyaModel: vi.fn(), VIDYA_MODELS: { haiku: "mock" } }));
import { POST } from "./route";
function request() { return new Request("https://vidya.example/api/assembly", { method: "POST", body: "{}" }); }
beforeEach(() => { vi.resetAllMocks(); mocks.configured.mockReturnValue(true); });
describe("assembly shared request limit", () => {
  it("returns safe 503 before paid work on store failure", async () => {
    mocks.rate.mockResolvedValue({ ok: false, unavailable: true, retryAfterSeconds: 5 });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("5");
    expect(await response.json()).toEqual({ error: "Service temporarily unavailable" });
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("preserves the free local assembly without requiring a database", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ source: "local" });
    expect(mocks.rate).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("retains offline fallback and rate headers when quota is exhausted", async () => {
    mocks.rate.mockResolvedValue({ ok: false, remaining: 0, resetAt: 60000, retryAfterSeconds: 10 });
    const response = await POST(request());
    expect(await response.json()).toMatchObject({ source: "local" });
    expect(response.headers.get("retry-after")).toBe("10");
    expect(response.headers.get("x-ratelimit-remaining")).toBe("0");
    expect(mocks.generate).not.toHaveBeenCalled();
  });
});
