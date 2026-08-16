import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  readBoundedJson: vi.fn(),
  deleteAiConnectionForParent: vi.fn(),
  getAiConnectionCredentialForParent: vi.fn(),
  replaceDirectAiConnectionCredentialForParent: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  credentialFingerprint: vi.fn(),
  encryptCredential: vi.fn(),
  validateProviderCredential: vi.fn(),
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
vi.mock("@/lib/api/bounded-json", () => ({ readBoundedJson: mocks.readBoundedJson }));
vi.mock("@/lib/db/ai-connections", () => ({
  deleteAiConnectionForParent: mocks.deleteAiConnectionForParent,
  getAiConnectionCredentialForParent: mocks.getAiConnectionCredentialForParent,
  replaceDirectAiConnectionCredentialForParent:
    mocks.replaceDirectAiConnectionCredentialForParent,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  credentialFingerprint: mocks.credentialFingerprint,
  encryptCredential: mocks.encryptCredential,
}));
vi.mock("@/lib/ai/provider-validation", () => ({
  validateProviderCredential: mocks.validateProviderCredential,
}));

import { DELETE, PATCH } from "./route";

const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";

function request(method: "DELETE" | "PATCH" = "DELETE") {
  return new Request(`https://vidya.example/api/parent/ai-connections/${CONNECTION_ID}`, {
    method,
  });
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
  mocks.requireParent.mockResolvedValue({
    kind: "parent",
    userId: "parent-a",
    email: "parent@example.test",
  });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.deleteAiConnectionForParent.mockResolvedValue({ id: CONNECTION_ID });
  mocks.readBoundedJson.mockResolvedValue({
    ok: true,
    value: { credential: "sk-parent-replacement-5678" },
  });
  mocks.getAiConnectionCredentialForParent.mockResolvedValue({
    id: CONNECTION_ID,
    provider: "openai",
    source: "api_key",
    encryptedCredential: {
      ciphertext: "old-ciphertext",
      iv: "old-iv",
      tag: "old-tag",
      keyVersion: "v1",
    },
  });
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.credentialFingerprint.mockReturnValue("f".repeat(64));
  mocks.encryptCredential.mockReturnValue({
    ciphertext: "new-ciphertext",
    iv: "new-iv",
    tag: "new-tag",
    keyVersion: "v1",
  });
  mocks.validateProviderCredential.mockResolvedValue({ kind: "valid" });
  mocks.replaceDirectAiConnectionCredentialForParent.mockResolvedValue({
    id: CONNECTION_ID,
    provider: "openai",
    label: "Family OpenAI",
    source: "api_key",
    status: "active",
    credentialHint: "5678",
    lastValidatedAt: "2026-08-16T11:00:00.000Z",
    lastUsedAt: null,
    createdAt: "2026-08-16T09:00:00.000Z",
    updatedAt: "2026-08-16T11:00:00.000Z",
  });
});

describe("PATCH parent AI connection credential", () => {
  it("requires recent Clerk reverification before reading the replacement", async () => {
    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);

    const response = await PATCH(request("PATCH"), context());

    expect(response).toBe(challenge);
    expect(mocks.readBoundedJson).not.toHaveBeenCalled();
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("rate limits and bounds input before reading any stored credential", async () => {
    mocks.rateLimit.mockReturnValueOnce({ ok: false, remaining: 0, resetAt: 1 });
    expect((await PATCH(request("PATCH"), context())).status).toBe(429);
    expect(mocks.requireRecentParentReverification).not.toHaveBeenCalled();

    mocks.rateLimit.mockReturnValue({ ok: true, remaining: 9, resetAt: 0 });
    mocks.readBoundedJson.mockResolvedValue({ ok: false, reason: "too_large" });
    expect((await PATCH(request("PATCH"), context())).status).toBe(413);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("masks malformed, missing, and cross-family connection ids", async () => {
    expect((await PATCH(request("PATCH"), context("not-a-uuid"))).status).toBe(404);
    expect(mocks.readBoundedJson).not.toHaveBeenCalled();

    mocks.getAiConnectionCredentialForParent.mockResolvedValue(null);
    expect((await PATCH(request("PATCH"), context())).status).toBe(404);
    expect(mocks.replaceDirectAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("does not replace credentials for a linked account", async () => {
    mocks.getAiConnectionCredentialForParent.mockResolvedValue({
      id: CONNECTION_ID,
      provider: "openrouter",
      source: "oauth",
      encryptedCredential: {},
    });

    const response = await PATCH(request("PATCH"), context());

    expect(response.status).toBe(409);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
    expect(mocks.replaceDirectAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("validates, encrypts, and replaces a direct key without returning secret material", async () => {
    const response = await PATCH(request("PATCH"), context());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.validateProviderCredential).toHaveBeenCalledWith(
      "openai",
      "sk-parent-replacement-5678",
    );
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: CONNECTION_ID,
      provider: "openai",
    });
    expect(mocks.replaceDirectAiConnectionCredentialForParent).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: CONNECTION_ID,
      actorId: "parent-a",
      status: "active",
      encryptedCredential: {
        ciphertext: "new-ciphertext",
        iv: "new-iv",
        tag: "new-tag",
        keyVersion: "v1",
      },
      credentialFingerprint: "f".repeat(64),
      credentialHint: "5678",
    });
    expect(JSON.stringify(body)).not.toContain("sk-parent-replacement-5678");
    expect(JSON.stringify(body)).not.toContain("new-ciphertext");
  });

  it("fails closed when the provider rejects or cannot check the key", async () => {
    mocks.validateProviderCredential.mockResolvedValueOnce({ kind: "invalid" });
    expect((await PATCH(request("PATCH"), context())).status).toBe(400);

    mocks.validateProviderCredential.mockResolvedValueOnce({ kind: "unavailable" });
    expect((await PATCH(request("PATCH"), context())).status).toBe(503);

    expect(mocks.replaceDirectAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("stores a provider billing response as needs attention", async () => {
    mocks.validateProviderCredential.mockResolvedValue({ kind: "needs_attention" });

    expect((await PATCH(request("PATCH"), context())).status).toBe(200);
    expect(mocks.replaceDirectAiConnectionCredentialForParent).toHaveBeenCalledWith(
      expect.objectContaining({ status: "needs_attention" }),
    );
  });

  it("fails closed when credential encryption is unavailable", async () => {
    mocks.configuredCredentialKeyring.mockImplementation(() => {
      throw new Error("missing key");
    });

    expect((await PATCH(request("PATCH"), context())).status).toBe(503);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });
});

describe("DELETE parent AI connection", () => {
  it("requires recent Clerk reverification before deleting", async () => {
    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);

    const response = await DELETE(request(), context());

    expect(response).toBe(challenge);
    expect(mocks.deleteAiConnectionForParent).not.toHaveBeenCalled();
  });

  it("masks malformed, missing, and cross-family ids as not found", async () => {
    expect((await DELETE(request(), context("not-a-uuid"))).status).toBe(404);
    expect(mocks.deleteAiConnectionForParent).not.toHaveBeenCalled();

    mocks.deleteAiConnectionForParent.mockResolvedValue(null);
    expect((await DELETE(request(), context())).status).toBe(404);
    expect(mocks.deleteAiConnectionForParent).toHaveBeenCalledWith(
      "parent-a",
      CONNECTION_ID,
      "parent-a",
    );
  });

  it("deletes only through the ownership-scoped query", async () => {
    const response = await DELETE(request(), context());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ deleted: true });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.deleteAiConnectionForParent).toHaveBeenCalledWith(
      "parent-a",
      CONNECTION_ID,
      "parent-a",
    );
  });
});
