import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  configuredOpenRouterCallbackUrl: vi.fn(),
  createOpenRouterOauthTransaction: vi.fn(),
  listAiConnectionsForParent: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/auth/reverification", () => ({
  requireRecentParentReverification: mocks.requireRecentParentReverification,
}));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({
  isSameOrigin: mocks.isSameOrigin,
  clientKey: mocks.clientKey,
  rateLimit: mocks.rateLimit,
  rateHeaders: mocks.rateHeaders,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
}));
vi.mock("@/lib/ai/openrouter-oauth", () => ({
  OPENROUTER_CALLBACK_PATH: "/api/parent/ai-connections/openrouter/callback",
  configuredOpenRouterCallbackUrl: mocks.configuredOpenRouterCallbackUrl,
  createOpenRouterOauthTransaction: mocks.createOpenRouterOauthTransaction,
}));
vi.mock("@/lib/db/ai-connections", () => ({
  listAiConnectionsForParent: mocks.listAiConnectionsForParent,
}));

import { POST } from "./route";

function request(body: unknown = { label: "Family OpenRouter" }) {
  return new Request(
    "https://vidyagyan.study/api/parent/ai-connections/openrouter/start",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 4, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.configuredOpenRouterCallbackUrl.mockReturnValue(
    "https://vidyagyan.study/api/parent/ai-connections/openrouter/callback",
  );
  mocks.createOpenRouterOauthTransaction.mockReturnValue({
    authorizationUrl: "https://openrouter.ai/auth?code_challenge=test",
    cookieValue: "encrypted-transaction",
  });
  mocks.listAiConnectionsForParent.mockResolvedValue([]);
});

describe("POST OpenRouter connection start", () => {
  it("requires a parent and recent reverification before creating PKCE state", async () => {
    mocks.requireParent.mockResolvedValueOnce(null);
    expect((await POST(request())).status).toBe(401);

    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);
    expect(await POST(request())).toBe(challenge);
    expect(mocks.createOpenRouterOauthTransaction).not.toHaveBeenCalled();
  });

  it("rejects malformed labels and missing secure configuration", async () => {
    expect((await POST(request({ label: "" }))).status).toBe(400);

    mocks.configuredOpenRouterCallbackUrl.mockImplementation(() => {
      throw new Error("missing origin");
    });
    expect((await POST(request())).status).toBe(503);
    expect(mocks.createOpenRouterOauthTransaction).not.toHaveBeenCalled();
  });

  it("returns an OpenRouter URL and stores only encrypted PKCE state in a cookie", async () => {
    const response = await POST(request());
    const body = await response.json();
    const cookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(body).toEqual({
      authorizationUrl: "https://openrouter.ai/auth?code_challenge=test",
    });
    expect(mocks.createOpenRouterOauthTransaction).toHaveBeenCalledWith({
      parentId: "parent-a",
      label: "Family OpenRouter",
      callbackUrl: "https://vidyagyan.study/api/parent/ai-connections/openrouter/callback",
      keyring: expect.anything(),
    });
    expect(cookie).toContain("vidya_openrouter_oauth=encrypted-transaction");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=600");
    expect(cookie).toContain("Path=/api/parent/ai-connections/openrouter/callback");
    expect(cookie).not.toContain("Family OpenRouter");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("rejects a duplicate label before creating an OpenRouter key", async () => {
    mocks.listAiConnectionsForParent.mockResolvedValue([{ label: "family openrouter" }]);

    const response = await POST(request());

    expect(response.status).toBe(409);
    expect(mocks.createOpenRouterOauthTransaction).not.toHaveBeenCalled();
  });
});
