import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  streamText: vi.fn(),
  toUIMessageStreamResponse: vi.fn(),
  convertToModelMessages: vi.fn(),
  isSameOrigin: vi.fn(),
  clientKey: vi.fn(),
  rateLimit: vi.fn(),
  rateHeaders: vi.fn(),
  resolveCapabilityForRequest: vi.fn(),
  bumpCapabilityUsage: vi.fn(),
  recordSafetySignal: vi.fn(),
  identityFromRequest: vi.fn(),
  dbConfigured: vi.fn(),
  getLearnerAiTutorRuntimePolicy: vi.fn(),
  configuredCredentialKeyring: vi.fn(),
  credentialAad: vi.fn(),
  decryptCredential: vi.fn(),
  createParentTutorModel: vi.fn(),
  setAiConnectionStatusForParent: vi.fn(),
  markAiConnectionUsedForParent: vi.fn(),
}));

vi.mock("ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("ai")>();
  return {
    ...actual,
    streamText: mocks.streamText,
    convertToModelMessages: mocks.convertToModelMessages,
  };
});
vi.mock("@/lib/api/guard", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/guard")>();
  return {
    ...actual,
    isSameOrigin: mocks.isSameOrigin,
    clientKey: mocks.clientKey,
    rateLimit: mocks.rateLimit,
    rateHeaders: mocks.rateHeaders,
  };
});
vi.mock("@/lib/capabilities/server", () => ({
  resolveCapabilityForRequest: mocks.resolveCapabilityForRequest,
}));
vi.mock("@/lib/db/queries", () => ({
  bumpCapabilityUsage: mocks.bumpCapabilityUsage,
  recordSafetySignal: mocks.recordSafetySignal,
}));
vi.mock("@/lib/auth/session", () => ({ identityFromRequest: mocks.identityFromRequest }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: mocks.dbConfigured }));
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  getLearnerAiTutorRuntimePolicy: mocks.getLearnerAiTutorRuntimePolicy,
}));
vi.mock("@/lib/ai/credential-vault", () => ({
  configuredCredentialKeyring: mocks.configuredCredentialKeyring,
  credentialAad: mocks.credentialAad,
  decryptCredential: mocks.decryptCredential,
}));
vi.mock("@/lib/ai/parent-tutor-model", () => ({
  createParentTutorModel: mocks.createParentTutorModel,
}));
vi.mock("@/lib/db/ai-connections", () => ({
  setAiConnectionStatusForParent: mocks.setAiConnectionStatusForParent,
  markAiConnectionUsedForParent: mocks.markAiConnectionUsedForParent,
}));

import { POST } from "./route";

const learnerIdentity = {
  kind: "learner",
  userId: "device:learner-a",
  learner: { id: "learner-a" },
  verificationLevel: 2,
};

const runtimePolicy = {
  learnerId: "learner-a",
  parentId: "parent-a",
  tutorProfileId: "11111111-1111-4111-8111-111111111111",
  connectionId: "22222222-2222-4222-8222-222222222222",
  provider: "openrouter",
  modelId: "anthropic/claude-haiku-4.5",
  dailyTurnLimit: 12,
  maxOutputTokens: 480,
  encryptedCredential: {
    ciphertext: "ciphertext",
    iv: "iv",
    tag: "tag",
    keyVersion: "v1",
  },
};

function request(text = "How do I add fractions?") {
  return new Request("https://vidya.example/api/tutor", {
    method: "POST",
    headers: {
      origin: "https://vidya.example",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", parts: [{ type: "text", text }] }],
      subject: "maths",
      grade: 5,
      board: "cambridge-primary",
    }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.clientKey.mockReturnValue("client-a");
  mocks.rateLimit.mockReturnValue({ ok: true, remaining: 29, resetAt: 0 });
  mocks.rateHeaders.mockReturnValue({ "x-ratelimit-limit": "30" });
  mocks.dbConfigured.mockReturnValue(false);
  mocks.resolveCapabilityForRequest.mockResolvedValue({
    allowed: true,
    reason: "ok",
    identity: learnerIdentity,
  });
  mocks.getLearnerAiTutorRuntimePolicy.mockResolvedValue(runtimePolicy);
  mocks.configuredCredentialKeyring.mockReturnValue({ currentVersion: "v1", keys: new Map() });
  mocks.credentialAad.mockReturnValue("parent-bound-aad");
  mocks.decryptCredential.mockReturnValue("parent-provider-secret");
  mocks.createParentTutorModel.mockReturnValue({ provider: "test", modelId: "test-model" });
  mocks.setAiConnectionStatusForParent.mockResolvedValue({ status: "needs_attention" });
  mocks.markAiConnectionUsedForParent.mockResolvedValue(true);
  mocks.convertToModelMessages.mockResolvedValue([{ role: "user", content: "question" }]);
  mocks.bumpCapabilityUsage.mockResolvedValue({ allowed: true, used: 1, perDay: 12 });
  mocks.toUIMessageStreamResponse.mockReturnValue(new Response("generated", { status: 200 }));
  mocks.streamText.mockReturnValue({
    toUIMessageStreamResponse: mocks.toUIMessageStreamResponse,
  });
});

describe("POST parent-controlled tutor runtime", () => {
  it("returns the fixed crisis response before capability, policy, or provider checks", async () => {
    const response = await POST(request("I want to kill myself"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("1098");
    expect(mocks.resolveCapabilityForRequest).not.toHaveBeenCalled();
    expect(mocks.getLearnerAiTutorRuntimePolicy).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("requires an allowed linked learner without revealing the parent setting", async () => {
    mocks.resolveCapabilityForRequest.mockResolvedValue({
      allowed: false,
      reason: "feature_disabled",
      identity: learnerIdentity,
    });

    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Miss Vidya isn't available right now." });
    expect(mocks.getLearnerAiTutorRuntimePolicy).not.toHaveBeenCalled();
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });

  it("returns a child-safe unavailable reply when no assignment is active", async () => {
    mocks.getLearnerAiTutorRuntimePolicy.mockResolvedValue(null);

    const response = await POST(request());
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("Miss Vidya isn't available right now.");
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
  });

  it("decrypts the parent credential with bound AAD and applies both parent limits", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("generated");
    expect(mocks.getLearnerAiTutorRuntimePolicy).toHaveBeenCalledWith("learner-a");
    expect(mocks.credentialAad).toHaveBeenCalledWith({
      parentId: "parent-a",
      connectionId: runtimePolicy.connectionId,
      provider: "openrouter",
    });
    expect(mocks.decryptCredential).toHaveBeenCalledWith(
      runtimePolicy.encryptedCredential,
      "parent-bound-aad",
      expect.anything(),
    );
    expect(mocks.createParentTutorModel).toHaveBeenCalledWith({
      provider: "openrouter",
      modelId: runtimePolicy.modelId,
      credential: "parent-provider-secret",
    });
    expect(mocks.bumpCapabilityUsage).toHaveBeenCalledWith(
      "learner-a",
      "ai.tutor.full",
      12,
    );
    expect(mocks.streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: { provider: "test", modelId: "test-model" },
      maxOutputTokens: 480,
    }));
    expect(mocks.streamText.mock.calls[0][0]).not.toHaveProperty("temperature");
    expect(mocks.bumpCapabilityUsage.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.streamText.mock.invocationCallOrder[0]);
  });

  it("does not spend a turn when credential preparation fails", async () => {
    mocks.decryptCredential.mockImplementation(() => {
      throw new Error("decrypt failed");
    });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Try again later.");
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("enforces the parent daily limit before provider execution", async () => {
    mocks.bumpCapabilityUsage.mockResolvedValue({ allowed: false, used: 12, perDay: 12 });

    const response = await POST(request());

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: "Miss Vidya has done a lot of thinking today. She'll be ready again tomorrow.",
    });
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("fails closed when durable usage accounting is unavailable", async () => {
    mocks.bumpCapabilityUsage.mockRejectedValue(new Error("database unavailable"));

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Try again later.");
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("marks only credential failures for parent attention and masks stream details", async () => {
    await POST(request());
    const options = mocks.streamText.mock.calls[0][0];
    const credentialError = new Error("wrapper", {
      cause: new (await import("ai")).APICallError({
        message: "secret provider detail",
        url: "https://provider.example/v1/messages",
        requestBodyValues: {},
        statusCode: 401,
      }),
    });

    await options.onError({ error: credentialError });

    expect(mocks.setAiConnectionStatusForParent).toHaveBeenCalledWith(
      "parent-a",
      runtimePolicy.connectionId,
      "needs_attention",
      "system:tutor-runtime",
    );
    expect(mocks.toUIMessageStreamResponse).toHaveBeenCalledWith({
      onError: expect.any(Function),
    });
    const mask = mocks.toUIMessageStreamResponse.mock.calls[0][0].onError;
    expect(mask(credentialError)).toBe("Miss Vidya is unavailable right now. Try again later.");
  });

  it("keeps the connection active for transient provider failures", async () => {
    await POST(request());
    const options = mocks.streamText.mock.calls[0][0];
    const transientError = new (await import("ai")).APICallError({
      message: "provider busy",
      url: "https://provider.example/v1/messages",
      requestBodyValues: {},
      statusCode: 429,
    });

    await options.onError({ error: transientError });

    expect(mocks.setAiConnectionStatusForParent).not.toHaveBeenCalled();
  });

  it("handles a credential failure thrown before streaming starts", async () => {
    const credentialError = new (await import("ai")).APICallError({
      message: "provider rejected credential",
      url: "https://provider.example/v1/messages",
      requestBodyValues: {},
      statusCode: 403,
    });
    mocks.streamText.mockImplementation(() => {
      throw credentialError;
    });

    const response = await POST(request());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Miss Vidya is unavailable right now." });
    expect(mocks.setAiConnectionStatusForParent).toHaveBeenCalledWith(
      "parent-a",
      runtimePolicy.connectionId,
      "needs_attention",
      "system:tutor-runtime",
    );
  });

  it("records the parent connection only after a successful generation", async () => {
    await POST(request());
    const options = mocks.streamText.mock.calls[0][0];

    expect(mocks.markAiConnectionUsedForParent).not.toHaveBeenCalled();
    await options.onFinish({ finishReason: "stop" });
    expect(mocks.markAiConnectionUsedForParent).toHaveBeenCalledWith(
      "parent-a",
      runtimePolicy.connectionId,
    );

    mocks.markAiConnectionUsedForParent.mockClear();
    await options.onFinish({ finishReason: "error" });
    expect(mocks.markAiConnectionUsedForParent).not.toHaveBeenCalled();
  });
});
