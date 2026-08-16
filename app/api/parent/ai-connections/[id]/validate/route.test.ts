import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  getAiConnectionCredentialForParent: vi.fn(),
  setAiConnectionStatusForParent: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  decryptCredential: vi.fn(),
  validateProviderCredential: vi.fn(),
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
  setAiConnectionStatusForParent: mocks.setAiConnectionStatusForParent,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  decryptCredential: mocks.decryptCredential,
}));
vi.mock("@/lib/ai/provider-validation", () => ({
  validateProviderCredential: mocks.validateProviderCredential,
}));

import { POST } from "./route";

const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";
const encryptedCredential = {
  ciphertext: "private-ciphertext",
  iv: "private-iv",
  tag: "private-tag",
  keyVersion: "v1",
};
const activeSummary = {
  id: CONNECTION_ID,
  provider: "openai",
  label: "Family OpenAI",
  source: "api_key",
  status: "active",
  credentialHint: "1234",
  lastValidatedAt: "2026-08-16T10:00:00.000Z",
  lastUsedAt: null,
  createdAt: "2026-08-16T09:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};

function request() {
  return new Request(
    `https://vidya.example/api/parent/ai-connections/${CONNECTION_ID}/validate`,
    { method: "POST" },
  );
}

function context(id = CONNECTION_ID) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.dbConfigured.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 9, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({});
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.getAiConnectionCredentialForParent.mockResolvedValue({
    id: CONNECTION_ID,
    provider: "openai",
    encryptedCredential,
  });
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.decryptCredential.mockReturnValue("provider-secret");
  mocks.validateProviderCredential.mockResolvedValue({ kind: "valid" });
  mocks.setAiConnectionStatusForParent.mockResolvedValue(activeSummary);
});

describe("POST parent AI connection validation", () => {
  it("requires same origin, storage, a parent session, and a valid id", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await POST(request(), context())).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await POST(request(), context())).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await POST(request(), context())).status).toBe(401);

    mocks.requireParent.mockResolvedValue({ userId: "parent-a" });
    expect((await POST(request(), context("not-a-uuid"))).status).toBe(404);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("rate limits before reading the stored credential", async () => {
    mocks.rateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 1 });

    expect((await POST(request(), context())).status).toBe(429);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("masks missing and cross-family connections as not found", async () => {
    mocks.getAiConnectionCredentialForParent.mockResolvedValue(null);

    expect((await POST(request(), context())).status).toBe(404);
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });

  it("reactivates a provider-validated connection without returning the secret", async () => {
    const response = await POST(request(), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: CONNECTION_ID,
      provider: "openai",
    });
    expect(mocks.validateProviderCredential).toHaveBeenCalledWith("openai", "provider-secret");
    expect(mocks.setAiConnectionStatusForParent).toHaveBeenCalledWith(
      "parent-a",
      CONNECTION_ID,
      "active",
      "parent-a",
    );
    expect(body).toEqual({ connection: activeSummary });
    expect(JSON.stringify(body)).not.toContain("provider-secret");
    expect(JSON.stringify(body)).not.toContain("private-ciphertext");
  });

  it.each(["invalid", "needs_attention"])(
    "keeps a %s provider result in needs-attention status",
    async (kind) => {
      const summary = { ...activeSummary, status: "needs_attention" };
      mocks.validateProviderCredential.mockResolvedValue({ kind });
      mocks.setAiConnectionStatusForParent.mockResolvedValue(summary);

      const response = await POST(request(), context());

      expect(response.status).toBe(200);
      expect(mocks.setAiConnectionStatusForParent).toHaveBeenCalledWith(
        "parent-a",
        CONNECTION_ID,
        "needs_attention",
        "parent-a",
      );
      expect(await response.json()).toEqual({ connection: summary });
    },
  );

  it("leaves status unchanged when the provider cannot be reached", async () => {
    mocks.validateProviderCredential.mockResolvedValue({ kind: "unavailable" });

    const response = await POST(request(), context());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Provider validation unavailable" });
    expect(mocks.setAiConnectionStatusForParent).not.toHaveBeenCalled();
  });

  it("fails closed when the credential vault is unavailable", async () => {
    mocks.configuredCredentialKeyring.mockImplementation(() => {
      throw new Error("missing key");
    });

    expect((await POST(request(), context())).status).toBe(503);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
  });
});
