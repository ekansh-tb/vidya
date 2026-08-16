import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  dbConfigured: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  credentialFingerprint: vi.fn(),
  encryptCredential: vi.fn(),
  configuredOpenRouterCallbackUrl: vi.fn(),
  readOpenRouterOauthTransaction: vi.fn(),
  exchangeOpenRouterAuthorizationCode: vi.fn(),
  createAiConnectionForParent: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({
  clientKey: mocks.clientKey,
  rateLimit: mocks.rateLimit,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  credentialFingerprint: mocks.credentialFingerprint,
  encryptCredential: mocks.encryptCredential,
}));
vi.mock("@/lib/ai/openrouter-oauth", () => ({
  OPENROUTER_CALLBACK_PATH: "/api/parent/ai-connections/openrouter/callback",
  configuredOpenRouterCallbackUrl: mocks.configuredOpenRouterCallbackUrl,
  readOpenRouterOauthTransaction: mocks.readOpenRouterOauthTransaction,
  exchangeOpenRouterAuthorizationCode: mocks.exchangeOpenRouterAuthorizationCode,
}));
vi.mock("@/lib/db/ai-connections", () => ({
  createAiConnectionForParent: mocks.createAiConnectionForParent,
}));

import { GET } from "./route";

const CALLBACK = "https://vidyagyan.study/api/parent/ai-connections/openrouter/callback";
const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";

function request(input: { code?: string; cookie?: string } = {}) {
  const url = new URL(CALLBACK);
  if (input.code !== undefined) url.searchParams.set("code", input.code);
  return new Request(url, {
    headers: input.cookie === undefined
      ? undefined
      : { cookie: `vidya_openrouter_oauth=${input.cookie}` },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 4, resetAt: 0 });
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.configuredOpenRouterCallbackUrl.mockReturnValue(CALLBACK);
  mocks.readOpenRouterOauthTransaction.mockReturnValue({
    verifier: "pkce-verifier",
    label: "Family OpenRouter",
  });
  mocks.exchangeOpenRouterAuthorizationCode.mockResolvedValue({
    key: "sk-or-generated-secret",
    providerAccountId: "openrouter-user",
  });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.credentialFingerprint.mockReturnValue("f".repeat(64));
  mocks.encryptCredential.mockReturnValue({
    ciphertext: "ciphertext",
    iv: "iv",
    tag: "tag",
    keyVersion: "v1",
  });
  mocks.createAiConnectionForParent.mockResolvedValue({ id: CONNECTION_ID });
});

describe("GET OpenRouter connection callback", () => {
  it("redirects unsigned parents without exchanging a code", async () => {
    mocks.requireParent.mockResolvedValue(null);

    const response = await GET(request({ code: "code", cookie: "transaction" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=sign_in_required",
    );
    expect(mocks.exchangeOpenRouterAuthorizationCode).not.toHaveBeenCalled();
  });

  it("fails closed for missing or invalid transaction state and clears the cookie", async () => {
    const missing = await GET(request({ code: "code" }));
    expect(missing.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=connection_failed",
    );
    expect(missing.headers.get("set-cookie")).toContain("Max-Age=0");

    mocks.readOpenRouterOauthTransaction.mockImplementation(() => {
      throw new Error("wrong parent");
    });
    const invalid = await GET(request({ code: "code", cookie: "transaction" }));
    expect(invalid.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=connection_failed",
    );
    expect(mocks.exchangeOpenRouterAuthorizationCode).not.toHaveBeenCalled();
  });

  it("exchanges, encrypts, and stores the generated key without putting it in a response", async () => {
    const response = await GET(request({ code: "authorization-code", cookie: "transaction" }));
    const createInput = mocks.createAiConnectionForParent.mock.calls[0][0];

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=connected",
    );
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(mocks.readOpenRouterOauthTransaction).toHaveBeenCalledWith({
      cookieValue: "transaction",
      parentId: "parent-a",
      keyring: expect.anything(),
    });
    expect(mocks.exchangeOpenRouterAuthorizationCode).toHaveBeenCalledWith({
      code: "authorization-code",
      verifier: "pkce-verifier",
    });
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: createInput.id,
      provider: "openrouter",
    });
    expect(createInput).toMatchObject({
      parentId: "parent-a",
      actorId: "parent-a",
      provider: "openrouter",
      label: "Family OpenRouter",
      source: "oauth",
      status: "active",
      credentialHint: "cret",
      providerAccountId: "openrouter-user",
    });
    expect(response.headers.get("location")).not.toContain("sk-or-generated-secret");
  });

  it("does not store when exchange fails and reports duplicate connections honestly", async () => {
    mocks.exchangeOpenRouterAuthorizationCode.mockRejectedValueOnce(new Error("exchange failed"));
    const failed = await GET(request({ code: "code", cookie: "transaction" }));
    expect(failed.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=connection_failed",
    );
    expect(mocks.createAiConnectionForParent).not.toHaveBeenCalled();

    mocks.exchangeOpenRouterAuthorizationCode.mockResolvedValue({
      key: "sk-or-generated-secret",
      providerAccountId: null,
    });
    mocks.createAiConnectionForParent.mockRejectedValue({ code: "23505" });
    const duplicate = await GET(request({ code: "code", cookie: "transaction" }));
    expect(duplicate.headers.get("location")).toBe(
      "https://vidyagyan.study/parent?ai=duplicate",
    );
  });
});
