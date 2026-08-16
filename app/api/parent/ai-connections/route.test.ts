import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  listAiConnectionsForParent: vi.fn(),
  createAiConnectionForParent: vi.fn(),
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
vi.mock("@/lib/db/ai-connections", () => ({
  listAiConnectionsForParent: mocks.listAiConnectionsForParent,
  createAiConnectionForParent: mocks.createAiConnectionForParent,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  credentialFingerprint: mocks.credentialFingerprint,
  encryptCredential: mocks.encryptCredential,
}));
vi.mock("@/lib/ai/provider-validation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/provider-validation")>();
  return { ...actual, validateProviderCredential: mocks.validateProviderCredential };
});

import { GET, POST } from "./route";

const summary = {
  id: "11111111-1111-4111-8111-111111111111",
  provider: "openai",
  label: "Family OpenAI",
  source: "api_key",
  status: "active",
  credentialHint: "1234",
  lastValidatedAt: "2026-08-16T10:00:00.000Z",
  lastUsedAt: null,
  createdAt: "2026-08-16T10:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};

function request(method: "GET" | "POST", body?: unknown) {
  return new Request("https://vidya.example/api/parent/ai-connections", {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
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
  mocks.listAiConnectionsForParent.mockResolvedValue([summary]);
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.credentialFingerprint.mockReturnValue("f".repeat(64));
  mocks.encryptCredential.mockReturnValue({
    ciphertext: "ciphertext",
    iv: "iv",
    tag: "tag",
    keyVersion: "v1",
  });
  mocks.validateProviderCredential.mockResolvedValue({ kind: "valid" });
  mocks.createAiConnectionForParent.mockResolvedValue(summary);
});

describe("GET parent AI connections", () => {
  it("returns only parent-facing summaries with private caching", async () => {
    const response = await GET(request("GET"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.listAiConnectionsForParent).toHaveBeenCalledWith("parent-a");
    expect(body).toEqual({ connections: [summary] });
    expect(JSON.stringify(body)).not.toContain("ciphertext");
  });

  it("requires same origin, storage, and a parent session", async () => {
    mocks.isSameOrigin.mockReturnValue(false);
    expect((await GET(request("GET"))).status).toBe(403);

    mocks.isSameOrigin.mockReturnValue(true);
    mocks.dbConfigured.mockReturnValue(false);
    expect((await GET(request("GET"))).status).toBe(503);

    mocks.dbConfigured.mockReturnValue(true);
    mocks.requireParent.mockResolvedValue(null);
    expect((await GET(request("GET"))).status).toBe(401);
    expect(mocks.listAiConnectionsForParent).not.toHaveBeenCalled();
  });
});

describe("POST parent AI connection", () => {
  const input = {
    provider: "openai",
    label: "Family OpenAI",
    credential: "sk-parent-secret-1234",
  };

  it("requires recent Clerk reverification before reading the credential", async () => {
    const challenge = Response.json({ challenge: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);

    const response = await POST(request("POST", input));

    expect(response).toBe(challenge);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
    expect(mocks.createAiConnectionForParent).not.toHaveBeenCalled();
  });

  it("rejects malformed input without contacting a provider", async () => {
    const response = await POST(request("POST", {
      provider: "unreviewed",
      label: "",
      credential: "short",
    }));

    expect(response.status).toBe(400);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
  });

  it("rejects an oversized request before contacting a provider", async () => {
    const response = await POST(new Request(
      "https://vidya.example/api/parent/ai-connections",
      {
        method: "POST",
        headers: { "content-length": "5000" },
        body: "{}",
      },
    ));

    expect(response.status).toBe(413);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
  });

  it("fails closed when the provider rejects or cannot validate the credential", async () => {
    mocks.validateProviderCredential.mockResolvedValueOnce({ kind: "invalid" });
    expect((await POST(request("POST", input))).status).toBe(400);
    expect(mocks.createAiConnectionForParent).not.toHaveBeenCalled();

    mocks.validateProviderCredential.mockResolvedValueOnce({ kind: "unavailable" });
    expect((await POST(request("POST", input))).status).toBe(503);
    expect(mocks.createAiConnectionForParent).not.toHaveBeenCalled();
  });

  it("encrypts a validated key with parent-bound AAD and returns no secret", async () => {
    const response = await POST(request("POST", input));
    const body = await response.json();
    const createInput = mocks.createAiConnectionForParent.mock.calls[0][0];

    expect(response.status).toBe(201);
    expect(mocks.validateProviderCredential).toHaveBeenCalledWith("openai", input.credential);
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: createInput.id,
      provider: "openai",
    });
    expect(mocks.encryptCredential).toHaveBeenCalledWith(
      input.credential,
      "parent-bound-aad",
      expect.anything(),
    );
    expect(createInput).toMatchObject({
      parentId: "parent-a",
      actorId: "parent-a",
      provider: "openai",
      label: "Family OpenAI",
      source: "api_key",
      status: "active",
      credentialHint: "1234",
    });
    expect(body).toEqual({ connection: summary });
    expect(JSON.stringify(body)).not.toContain(input.credential);
    expect(JSON.stringify(body)).not.toContain("ciphertext");
  });

  it("stores a provider-confirmed billing issue as needing attention", async () => {
    mocks.validateProviderCredential.mockResolvedValue({ kind: "needs_attention" });

    expect((await POST(request("POST", input))).status).toBe(201);
    expect(mocks.createAiConnectionForParent.mock.calls[0][0].status)
      .toBe("needs_attention");
  });

  it("returns 409 for a duplicate label or credential without leaking details", async () => {
    mocks.createAiConnectionForParent.mockRejectedValue({ code: "23505", detail: input.credential });

    const response = await POST(request("POST", input));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "A connection with that label or credential already exists" });
    expect(JSON.stringify(body)).not.toContain(input.credential);
  });

  it("returns unavailable when credential encryption is not configured", async () => {
    mocks.configuredCredentialKeyring.mockImplementation(() => {
      throw new Error("missing key");
    });

    const response = await POST(request("POST", input));

    expect(response.status).toBe(503);
    expect(mocks.validateProviderCredential).not.toHaveBeenCalled();
  });
});
