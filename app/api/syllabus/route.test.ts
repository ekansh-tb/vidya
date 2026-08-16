import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  aiProviderConfigured: vi.fn(),
  generateObject: vi.fn(),
  isSameOrigin: vi.fn(),
  rateLimit: vi.fn(),
  requireParent: vi.fn(),
}));

vi.mock("ai", () => ({ generateObject: mocks.generateObject }));
vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/api/guard", () => ({
  isSameOrigin: mocks.isSameOrigin,
  clientKey: vi.fn(() => "client"),
  rateLimit: mocks.rateLimit,
  rateHeaders: vi.fn(() => ({})),
}));
vi.mock("@/lib/ai/models", () => ({
  aiProviderConfigured: mocks.aiProviderConfigured,
  resolveVidyaModel: vi.fn(),
  VIDYA_MODELS: { sonnet: { gateway: "gateway", directAnthropic: "direct" } },
}));

import { POST } from "./route";

function request() {
  return new Request("https://vidya.example/api/syllabus", { method: "POST" });
}

beforeEach(() => {
  vi.restoreAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.aiProviderConfigured.mockReturnValue(false);
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 11, resetAt: 0, retryAfterSeconds: 0 });
});

describe("POST syllabus readiness", () => {
  it("rejects cross-origin requests before checking configuration", async () => {
    mocks.isSameOrigin.mockReturnValue(false);

    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(mocks.requireParent).not.toHaveBeenCalled();
  });

  it("requires a parent before reporting provider readiness", async () => {
    mocks.requireParent.mockResolvedValue(null);

    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(mocks.aiProviderConfigured).not.toHaveBeenCalled();
  });

  it("returns an explicit unavailable response without billing a rate-limit use", async () => {
    const response = await POST(request());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Syllabus extraction is unavailable until an AI provider is configured.",
    });
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.generateObject).not.toHaveBeenCalled();
  });
});
