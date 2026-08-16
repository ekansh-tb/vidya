import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  getAiConnectionCredentialForParent: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  decryptCredential: vi.fn(),
  discoverProviderModels: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.requireParent }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/api/guard", () => ({
  isSameOrigin: mocks.isSameOrigin,
  clientKey: mocks.clientKey,
  rateLimit: mocks.rateLimit,
  rateHeaders: mocks.rateHeaders,
}));
vi.mock("@/lib/db/ai-connections", () => ({
  getAiConnectionCredentialForParent: mocks.getAiConnectionCredentialForParent,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  decryptCredential: mocks.decryptCredential,
}));
vi.mock("@/lib/ai/provider-models", () => ({
  discoverProviderModels: mocks.discoverProviderModels,
}));

import { GET } from "./route";

const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";
const encryptedCredential = {
  ciphertext: "private-ciphertext",
  iv: "private-iv",
  tag: "private-tag",
  keyVersion: "v1",
};

function request() {
  return new Request(`https://vidya.example/api/parent/ai-connections/${CONNECTION_ID}/models`);
}

function context(id = CONNECTION_ID) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 10, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.getAiConnectionCredentialForParent.mockResolvedValue({
    id: CONNECTION_ID,
    provider: "openrouter",
    encryptedCredential,
  });
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.decryptCredential.mockReturnValue("provider-secret");
  mocks.discoverProviderModels.mockResolvedValue({
    kind: "success",
    models: [{ id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5" }],
    truncated: false,
  });
});

describe("GET parent AI connection models", () => {
  it("requires same origin, storage, a parent session, and a valid id", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await GET(request(), context())).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await GET(request(), context())).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await GET(request(), context())).status).toBe(401);

    mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
    expect((await GET(request(), context("not-a-uuid"))).status).toBe(404);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("rate limits provider catalog requests before reading credentials", async () => {
    mocks.rateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 1 });
    expect((await GET(request(), context())).status).toBe(429);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("masks missing and cross-family connections as not found", async () => {
    mocks.getAiConnectionCredentialForParent.mockResolvedValue(null);
    expect((await GET(request(), context())).status).toBe(404);
    expect(mocks.getAiConnectionCredentialForParent)
      .toHaveBeenCalledWith("parent-a", CONNECTION_ID);
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });

  it("decrypts only after ownership and returns a secret-free model list", async () => {
    const response = await GET(request(), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: CONNECTION_ID,
      provider: "openrouter",
    });
    expect(mocks.decryptCredential).toHaveBeenCalledWith(
      encryptedCredential,
      "parent-bound-aad",
      expect.anything(),
    );
    expect(mocks.discoverProviderModels).toHaveBeenCalledWith(
      "openrouter",
      "provider-secret",
    );
    expect(body).toEqual({
      provider: "openrouter",
      models: [{ id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5" }],
      truncated: false,
    });
    expect(JSON.stringify(body)).not.toContain("provider-secret");
    expect(JSON.stringify(body)).not.toContain("private-ciphertext");
  });

  it("returns bounded provider errors without provider or credential details", async () => {
    mocks.discoverProviderModels.mockResolvedValueOnce({ kind: "invalid_credential" });
    expect((await GET(request(), context())).status).toBe(409);

    mocks.discoverProviderModels.mockResolvedValueOnce({ kind: "unavailable" });
    const response = await GET(request(), context());
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Provider model list unavailable" });
  });

  it("fails closed when the credential vault is not configured", async () => {
    mocks.configuredCredentialKeyring.mockImplementation(() => {
      throw new Error("missing key");
    });
    const response = await GET(request(), context());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Credential storage unavailable" });
    expect(mocks.discoverProviderModels).not.toHaveBeenCalled();
  });
});
