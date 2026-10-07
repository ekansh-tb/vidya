import { beforeEach, describe, expect, it, vi } from "vitest";
import { reviewedTutorFixture } from "@/test/fixtures/tutor-eligibility";

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
  readReviewedTutorEligibility: vi.fn(),
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
vi.mock("@/lib/ai/tutor-eligibility.server", () => ({ readReviewedTutorEligibility: mocks.readReviewedTutorEligibility }));

import { POST } from "./route";

const learnerIdentity = {
  kind: "learner",
  userId: "device:learner-a",
  learner: { id: "learner-a", name: "Learner A", grade: 5, board: "cambridge-primary", school: null, pickedSubjects: null },
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
  // A hypothetical reviewed record exercises the future provider path. The
  // real resolver is separately tested to return null in this release.
  mocks.readReviewedTutorEligibility.mockResolvedValue(reviewedTutorFixture());
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
    expect(response.headers.get("cache-control")).toContain("no-store");
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
      headers: { "cache-control": "private, no-store" },
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

it("returns a safe 503 before tutor policy or provider work when the shared limiter fails", async () => {
  mocks.rateLimit.mockResolvedValue({ ok: false, unavailable: true, remaining: 0, resetAt: 0, retryAfterSeconds: 5 });
  const response = await POST(request());
  expect(response.status).toBe(503);
  expect(response.headers.get("retry-after")).toBe("5");
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(await response.json()).toEqual({ error: "Service temporarily unavailable" });
  expect(mocks.resolveCapabilityForRequest).not.toHaveBeenCalled();
  expect(mocks.streamText).not.toHaveBeenCalled();
});

async function curriculumRequest(overrides: Record<string, unknown> = {}) {
  const base = request();
  const body = await base.json();
  return new Request(base.url, { method: "POST", headers: base.headers, body: JSON.stringify({ ...body, ...overrides }) });
}
function storedLearner(overrides: Record<string, unknown>) {
  mocks.resolveCapabilityForRequest.mockResolvedValue({
    allowed: true, identity: { ...learnerIdentity, learner: { ...learnerIdentity.learner, ...overrides } },
  });
}

describe("live tutor eligibility gate", () => {
  it("does not forward unknown-age conversations even when the client claims approval", async () => {
    mocks.readReviewedTutorEligibility.mockResolvedValue(null);
    const response = await POST(await curriculumRequest({ age: 18, verifiedAge: true, consent: true,
      providerRetention: "zero-data-retention", language: "hi", confirmedStage: "any", parentApproved: true }));
    expect(await response.text()).toContain("child safeguards are reviewed");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mocks.readReviewedTutorEligibility).toHaveBeenCalledWith("learner-a");
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
    expect(mocks.createParentTutorModel).not.toHaveBeenCalled();
    expect(mocks.convertToModelMessages).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
  });
  it("does not silently broaden a reviewed helper with a client stage or language", async () => {
    mocks.readReviewedTutorEligibility.mockResolvedValue(reviewedTutorFixture({}, { grade: 4 }));
    const response = await POST(await curriculumRequest({ grade: 4, stage: "reviewed", language: "hi" }));
    expect(await response.text()).toContain("AI helper is paused");
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
  });
  it("fails closed on eligibility storage failure without billing or exposing errors", async () => {
    mocks.readReviewedTutorEligibility.mockRejectedValue(new Error("private-storage-detail"));
    const response = await POST(request());
    expect(await response.text()).toContain("authored activities");
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
  });
  it("keeps crisis support available without consulting unavailable eligibility", async () => {
    mocks.readReviewedTutorEligibility.mockResolvedValue(null);
    const response = await POST(request("I want to kill myself"));
    expect(await response.text()).toContain("1098");
    expect(mocks.readReviewedTutorEligibility).not.toHaveBeenCalled();
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });
});

describe("authoritative tutor curriculum", () => {
  it.each([
    ["cbse", 6, "cbse-maths", "CBSE"],
    ["cbse", 9, "cbse-science", "CBSE"],
    ["icse", 9, "icse-maths", "ICSE (CISCE)"],
    ["cambridge-primary", 2, "maths", "Cambridge Primary"],
    ["cambridge-lower-secondary", 6, "cls-maths", "Cambridge Lower Secondary"],
    ["cambridge-igcse", 10, "igcse-cs", "Cambridge IGCSE"],
  ])("uses stored %s grade %i despite mismatched body metadata", async (board, grade, subject, label) => {
    storedLearner({ board, grade, school: "Stored Example School", name: "Stored Learner" });
    mocks.readReviewedTutorEligibility.mockResolvedValue(reviewedTutorFixture({}, { board, grade, subjectId: subject }));
    await POST(await curriculumRequest({ board: "cambridge-igcse", grade: 10, school: "CLIENT_SCHOOL", name: "CLIENT_NAME", subject }));
    const system = mocks.streamText.mock.calls[0][0].system;
    expect(system).toContain(`${label}, Grade ${grade}`);
    expect(system).toContain("Stored Example School");
    expect(system).toContain('"firstName":"Stored"');
    expect(system).not.toMatch(/CLIENT_SCHOOL|CLIENT_NAME|Stage [0-9]|year.old|Pune|Hadapsar/);
    if (board !== "cambridge-igcse") expect(system).not.toContain("Cambridge IGCSE");
  });

  it("does not fall back to a body school when the stored school is absent", async () => {
    await POST(await curriculumRequest({ school: "CLIENT_SCHOOL", grade: undefined, board: undefined, name: undefined }));
    expect(mocks.streamText.mock.calls[0][0].system).toContain('"school":null');
    expect(mocks.streamText.mock.calls[0][0].system).not.toContain("CLIENT_SCHOOL");
  });
  it("keeps identical curriculum prompts when body scope changes or is omitted", async () => {
    for (const values of [
      { board: "icse", grade: 9, school: "Wrong school", name: "Wrong name" },
      { board: "cbse", grade: 2, school: "Another school", name: "Another name" },
      { board: undefined, grade: undefined, school: undefined, name: undefined },
    ]) await POST(await curriculumRequest(values));
    expect(new Set(mocks.streamText.mock.calls.map(([options]) => options.system)).size).toBe(1);
  });

  it.each([
    { board: "cbse", grade: 13 }, { board: "cambridge-primary", grade: 9 },
    { board: undefined }, { grade: undefined }, { board: "unsupported" },
  ])("does not repair invalid stored scope from a valid request %j", async (stored) => {
    storedLearner(stored);
    const response = await POST(request());
    expect(await response.text()).toContain("profile settings");
    expect(mocks.streamText).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
    expect(mocks.decryptCredential).not.toHaveBeenCalled();
  });
  it.each([undefined, "igcse-cs", "unknown", "__proto__"])("clarifies missing or incompatible subject %s without spending a turn", async (subject) => {
    const response = await POST(await curriculumRequest({ subject }));
    expect(await response.text()).toContain("choose a subject");
    expect(mocks.streamText).not.toHaveBeenCalled();
    expect(mocks.bumpCapabilityUsage).not.toHaveBeenCalled();
  });
  it("allows explicit within-board exploration without claiming school enrollment", async () => {
    storedLearner({ board: "cbse", grade: 6, pickedSubjects: ["cbse-maths"] });
    mocks.readReviewedTutorEligibility.mockResolvedValue(reviewedTutorFixture({}, { board: "cbse", grade: 6, subjectId: "cbse-science" }));
    await POST(await curriculumRequest({ subject: "cbse-science" }));
    expect(mocks.streamText.mock.calls[0][0].system).toContain('"id":"cbse-science"');
    expect(mocks.streamText.mock.calls[0][0].system).toContain("it does not establish enrollment");
  });
  it.each(["unlinked", "revoked"])("preserves the guest/denied behavior for %s identity", async (reason) => {
    mocks.resolveCapabilityForRequest.mockResolvedValue({ allowed: false, identity: { kind: "anonymous", reason } });
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Miss Vidya isn't available right now." });
    expect(mocks.streamText).not.toHaveBeenCalled();
  });
  it("preserves free crisis support even with invalid curriculum and subject", async () => {
    storedLearner({ board: "unknown", grade: 99 });
    const base = await curriculumRequest({ subject: "unknown" });
    const body = await base.json();
    body.messages = [{ role: "user", parts: [{ type: "text", text: "I want to kill myself" }] }];
    const response = await POST(new Request(base.url, { method: "POST", headers: base.headers, body: JSON.stringify(body) }));
    expect(await response.text()).toContain("1098");
    expect(mocks.resolveCapabilityForRequest).not.toHaveBeenCalled();
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
  });
});

it("keeps crisis support available without logging private safety-storage errors", async () => {
  mocks.dbConfigured.mockReturnValue(true);
  mocks.identityFromRequest.mockResolvedValue(learnerIdentity);
  mocks.recordSafetySignal.mockRejectedValueOnce(Object.assign(
    new Error("fake-db-password private-crisis-excerpt"),
    { detail: "private-learner-identifier", cause: new Error("fake-db-connection-string") },
  ));

  const response = await POST(request("I want to kill myself"));
  const body = await response.text();

  expect(mocks.recordSafetySignal).toHaveBeenCalledTimes(1);
  expect(response.status).toBe(200);
  expect(body).toContain("1098");
  expect(body).not.toContain("fake-db-password");
  expect(body).not.toContain("private-crisis-excerpt");
  expect(vi.mocked(console.error).mock.calls).toEqual([["[api/tutor] could not record safety signal"]]);
  expect(mocks.streamText).not.toHaveBeenCalled();
  expect(mocks.resolveCapabilityForRequest).not.toHaveBeenCalled();
});
