import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireParent: vi.fn(),
  requireRecentParentReverification: vi.fn(),
  dbConfigured: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  listAiTutorProfilesForParent: vi.fn(),
  createAiTutorProfileForParent: vi.fn(),
  getAiConnectionCredentialForParent: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  decryptCredential: vi.fn(),
  discoverProviderModels: vi.fn(),
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
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  listAiTutorProfilesForParent: mocks.listAiTutorProfilesForParent,
  createAiTutorProfileForParent: mocks.createAiTutorProfileForParent,
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

import { GET, POST } from "./route";

const CONNECTION_ID = "11111111-1111-4111-8111-111111111111";
const profile = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Science Guide",
  connectionId: CONNECTION_ID,
  connectionLabel: "Family OpenRouter",
  provider: "openrouter",
  connectionStatus: "active",
  modelId: "anthropic/claude-haiku-4.5",
  createdAt: "2026-08-16T10:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};
const input = {
  name: profile.name,
  connectionId: CONNECTION_ID,
  modelId: profile.modelId,
};

function request(method: "GET" | "POST", body?: unknown) {
  return new Request("https://vidya.example/api/parent/ai-tutors", {
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
  mocks.requireParent.mockResolvedValue({ kind: "parent", userId: "parent-a" });
  mocks.requireRecentParentReverification.mockResolvedValue(null);
  mocks.listAiTutorProfilesForParent.mockResolvedValue([profile]);
  mocks.getAiConnectionCredentialForParent.mockResolvedValue({
    id: CONNECTION_ID,
    provider: "openrouter",
    encryptedCredential: {
      ciphertext: "private-ciphertext",
      iv: "private-iv",
      tag: "private-tag",
      keyVersion: "v1",
    },
  });
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.decryptCredential.mockReturnValue("provider-secret");
  mocks.discoverProviderModels.mockResolvedValue({
    kind: "success",
    models: [{ id: profile.modelId, name: "Claude Haiku 4.5" }],
    truncated: false,
  });
  mocks.createAiTutorProfileForParent.mockResolvedValue(profile);
});

describe("parent AI tutor profiles", () => {
  it("lists only ownership-scoped, public summaries", async () => {
    const response = await GET(request("GET"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ profiles: [profile] });
    expect(mocks.listAiTutorProfilesForParent).toHaveBeenCalledWith("parent-a");
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
    expect(mocks.listAiTutorProfilesForParent).not.toHaveBeenCalled();
  });

  it("requires recent Clerk reverification before reading the request body", async () => {
    const challenge = Response.json({ clerk_error: true }, { status: 403 });
    mocks.requireRecentParentReverification.mockResolvedValue(challenge);
    const response = await POST(request("POST", input));
    expect(response).toBe(challenge);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("rate limits and bounds create requests before reading credentials", async () => {
    mocks.rateLimit.mockReturnValueOnce({ ok: false, remaining: 0, resetAt: 1 });
    expect((await POST(request("POST", input))).status).toBe(429);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();

    const oversized = new Request("https://vidya.example/api/parent/ai-tutors", {
      method: "POST",
      headers: { "content-length": "3000" },
      body: "{}",
    });
    expect((await POST(oversized)).status).toBe(413);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();
  });

  it("rejects malformed input and cross-family connections before decryption", async () => {
    expect((await POST(request("POST", { ...input, modelId: "model with spaces" }))).status)
      .toBe(400);
    expect(mocks.getAiConnectionCredentialForParent).not.toHaveBeenCalled();

    mocks.getAiConnectionCredentialForParent.mockResolvedValue(null);
    expect((await POST(request("POST", input))).status).toBe(404);
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });

  it("verifies the model against the parent's live provider catalog", async () => {
    const response = await POST(request("POST", input));
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: CONNECTION_ID,
      provider: "openrouter",
    });
    expect(mocks.discoverProviderModels).toHaveBeenCalledWith("openrouter", "provider-secret");
    expect(mocks.createAiTutorProfileForParent).toHaveBeenCalledWith(expect.objectContaining({
      parentId: "parent-a",
      actorId: "parent-a",
      connectionId: CONNECTION_ID,
      name: profile.name,
      modelId: profile.modelId,
    }));
    expect(body).toEqual({ profile });
    expect(JSON.stringify(body)).not.toContain("provider-secret");
    expect(JSON.stringify(body)).not.toContain("private-ciphertext");
  });

  it("rejects an unavailable model and provider failures without saving", async () => {
    mocks.discoverProviderModels.mockResolvedValueOnce({
      kind: "success",
      models: [{ id: "another/model", name: "Another" }],
      truncated: false,
    });
    expect((await POST(request("POST", input))).status).toBe(400);
    expect(mocks.createAiTutorProfileForParent).not.toHaveBeenCalled();

    mocks.discoverProviderModels.mockResolvedValueOnce({ kind: "unavailable" });
    expect((await POST(request("POST", input))).status).toBe(502);
    expect(mocks.createAiTutorProfileForParent).not.toHaveBeenCalled();

    mocks.discoverProviderModels.mockResolvedValueOnce({ kind: "invalid_credential" });
    expect((await POST(request("POST", input))).status).toBe(409);
    expect(mocks.createAiTutorProfileForParent).not.toHaveBeenCalled();
  });

  it("fails closed when the credential vault is unavailable", async () => {
    mocks.configuredCredentialKeyring.mockImplementation(() => {
      throw new Error("missing key");
    });
    expect((await POST(request("POST", input))).status).toBe(503);
    expect(mocks.discoverProviderModels).not.toHaveBeenCalled();
  });

  it("returns conflict for a duplicate profile name or inactive connection", async () => {
    mocks.createAiTutorProfileForParent.mockRejectedValueOnce({ code: "23505" });
    expect((await POST(request("POST", input))).status).toBe(409);

    mocks.createAiTutorProfileForParent.mockResolvedValueOnce(null);
    expect((await POST(request("POST", input))).status).toBe(409);
  });
});
