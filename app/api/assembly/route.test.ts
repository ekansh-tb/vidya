import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  generateText: vi.fn(),
  configured: vi.fn(),
  model: vi.fn(),
  sameOrigin: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("ai", () => ({ generateText: mocks.generateText }));
vi.mock("@/lib/ai/models", () => ({
  aiProviderConfigured: mocks.configured,
  resolveVidyaModel: mocks.model,
  VIDYA_MODELS: { haiku: "mock-model" },
}));
vi.mock("@/lib/api/guard", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/api/guard")>(),
  isSameOrigin: mocks.sameOrigin,
  clientKey: () => "synthetic-client",
  rateLimit: mocks.rateLimit,
}));

import { POST } from "./route";

function request(body: unknown = {}) {
  return new Request("https://example.test/api/assembly", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.sameOrigin.mockReturnValue(true);
  mocks.configured.mockReturnValue(true);
  mocks.model.mockReturnValue("mock-model");
  mocks.rateLimit.mockResolvedValue({ ok: true, remaining: 11, retryAfterSeconds: 0 });
  mocks.generateText.mockResolvedValue({ text: JSON.stringify({ greeting: "Hello", plan: [] }) });
});

describe("assembly explicit curriculum context", () => {
  it.each([
    ["cbse", 6, "CBSE"],
    ["cbse", 10, "CBSE"],
    ["icse", 6, "ICSE"],
    ["icse", 10, "ICSE"],
    ["cambridge-primary", 2, "Cambridge Primary"],
    ["cambridge-primary", 9, "Cambridge Primary"],
    ["cambridge-lower-secondary", 6, "Cambridge Lower Secondary"],
    ["cambridge-lower-secondary", 9, "Cambridge Lower Secondary"],
    ["cambridge-igcse", 6, "Cambridge IGCSE"],
    ["cambridge-igcse", 10, "Cambridge IGCSE"],
  ])("keeps %s explicit at grade %i", async (board, grade, label) => {
    const response = await POST(request({ board, grade, school: "Synthetic unverified school" }));
    expect(response.status).toBe(200);
    const { system, prompt } = mocks.generateText.mock.calls[0][0];
    const context = JSON.parse(prompt.split("Requested learning context: ")[1]);
    expect(context.curriculum).toBe(label);
    expect(context.localGrade).toBe(grade);
    expect(system + prompt).not.toMatch(/Synthetic unverified school|Stage \d|year.old|Pune|Indian|monsoon/);
    expect(system).toContain("Selected subjects and content availability are unknown");
    expect(system).toContain("Do not infer age");
    expect(await response.json()).toHaveProperty("source", "ai");
  });

  it.each([{}, { grade: 10 }, { board: "unknown-board", grade: 10 }])(
    "keeps missing or invalid board neutral: %j", async (body) => {
      await POST(request(body));
      const { prompt } = mocks.generateText.mock.calls[0][0];
      expect(prompt).toContain("Unspecified; general learning");
      expect(prompt).not.toMatch(/Cambridge|IGCSE|ICSE|CBSE/);
    },
  );

  it("does not fill an omitted grade", async () => {
    await POST(request({ board: "icse" }));
    expect(mocks.generateText.mock.calls[0][0].prompt).toContain('"localGrade":"Unspecified"');
  });
});

describe("assembly free fallback and quota boundaries", () => {
  it("serves local choices without a configured provider", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await POST(request({ board: "icse", grade: 10 }));
    const body = await response.json();
    expect(body.source).toBe("local");
    expect(body.plan).toHaveLength(4);
    expect(body.plan.join(" ")).not.toMatch(/Maths|Science|place.value|forces|IGCSE/);
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.generateText).not.toHaveBeenCalled();
  });

  it("preserves the quota and returns local content when exhausted", async () => {
    mocks.rateLimit.mockResolvedValue({ ok: false, remaining: 0, retryAfterSeconds: 60 });
    const response = await POST(request());
    expect(mocks.rateLimit).toHaveBeenCalledWith("assembly:synthetic-client", {
      limit: 12, windowMs: 600000,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(await response.json()).toHaveProperty("source", "local");
    expect(mocks.generateText).not.toHaveBeenCalled();
  });

  it("keeps storage outage fail-closed without generation", async () => {
    mocks.rateLimit.mockResolvedValue({ ok: false, unavailable: true, retryAfterSeconds: 30 });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("30");
    expect(mocks.generateText).not.toHaveBeenCalled();
  });

  it.each(["provider failure", "invalid JSON"])("falls back after %s", async (failure) => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      if (failure === "provider failure") mocks.generateText.mockRejectedValue(new Error("synthetic failure"));
      else mocks.generateText.mockResolvedValue({ text: "invalid" });
      const response = await POST(request());
      expect(response.status).toBe(200);
      expect(await response.json()).toHaveProperty("source", "local");
    } finally {
      log.mockRestore();
    }
  });

  it("rejects a foreign origin before quota or generation", async () => {
    mocks.sameOrigin.mockReturnValue(false);
    expect((await POST(request())).status).toBe(403);
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(mocks.generateText).not.toHaveBeenCalled();
  });
});
