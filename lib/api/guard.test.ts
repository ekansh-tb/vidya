import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  tutorRequestSchema, assemblyRequestSchema, totalChars, isSameOrigin,
  clientKey, rateLimit, rateHeaders, LIMITS,
} from "./guard";

const store = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db/request-limits", () => ({ consumeRequestLimit: store }));

// ---------------------------------------------------------------- helpers

function req(headers: Record<string, string> = {}) {
  return new Request("https://vidya-quest.vercel.app/api/tutor", {
    method: "POST",
    headers,
  });
}

function msg(text: string, role: "user" | "assistant" = "user") {
  return { role, parts: [{ type: "text", text }] };
}

// isSameOrigin short-circuits outside production, so these tests pin NODE_ENV.
function setEnv(v: string) {
  vi.stubEnv("NODE_ENV", v as "production" | "development" | "test");
}
afterEach(() => vi.unstubAllEnvs());

// ---------------------------------------------------------------- schema

describe("tutorRequestSchema", () => {
  it("accepts a normal tutor turn", () => {
    const r = tutorRequestSchema.safeParse({
      messages: [msg("How do I add fractions?")],
      subject: "cls-maths",
      grade: 6,
      board: "cambridge-lower-secondary",
    });
    expect(r.success).toBe(true);
  });

  it("rejects an empty conversation", () => {
    expect(tutorRequestSchema.safeParse({ messages: [] }).success).toBe(false);
  });

  it("rejects more messages than the cap", () => {
    const messages = Array.from({ length: LIMITS.maxMessages + 1 }, () => msg("hi"));
    expect(tutorRequestSchema.safeParse({ messages }).success).toBe(false);
  });

  it("rejects a single oversized message", () => {
    const messages = [msg("x".repeat(LIMITS.maxCharsPerMessage + 1))];
    expect(tutorRequestSchema.safeParse({ messages }).success).toBe(false);
  });

  it("rejects an unknown role", () => {
    const r = tutorRequestSchema.safeParse({ messages: [{ role: "root", parts: [] }] });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown board", () => {
    const r = tutorRequestSchema.safeParse({ messages: [msg("hi")], board: "ib-myp" });
    expect(r.success).toBe(false);
  });

  it("accepts every board the app actually ships", () => {
    for (const board of [
      "cambridge-primary", "cambridge-lower-secondary",
      "cambridge-igcse", "icse", "cbse",
    ]) {
      const r = tutorRequestSchema.safeParse({ messages: [msg("hi")], board });
      expect(r.success, board).toBe(true);
    }
  });

  it("caps a care note so it cannot dominate the system prompt", () => {
    const careNote = "y".repeat(LIMITS.maxPromptFieldChars + 1);
    expect(tutorRequestSchema.safeParse({ messages: [msg("hi")], careNote }).success).toBe(false);
  });

  it("rejects an out-of-range grade", () => {
    expect(tutorRequestSchema.safeParse({ messages: [msg("hi")], grade: 99 }).success).toBe(false);
    expect(tutorRequestSchema.safeParse({ messages: [msg("hi")], grade: 0 }).success).toBe(false);
  });

  it("rejects tool message parts from clients", () => {
    const r = tutorRequestSchema.safeParse({
      messages: [{ role: "assistant", parts: [{ type: "tool-invocation", state: "result" }] }],
    });
    expect(r.success).toBe(false);
  });
});

describe("assemblyRequestSchema", () => {
  it("accepts an empty body — assembly has no required fields", () => {
    expect(assemblyRequestSchema.safeParse({}).success).toBe(true);
  });

  it("accepts the learner's own school", () => {
    const r = assemblyRequestSchema.safeParse({ school: "Chatrabhuj Narsee School, Pune" });
    expect(r.success).toBe(true);
  });

  it("rejects a negative streak", () => {
    expect(assemblyRequestSchema.safeParse({ streak: -1 }).success).toBe(false);
  });
});

// ---------------------------------------------------------------- totalChars

describe("totalChars", () => {
  it("sums text across parts and messages", () => {
    expect(totalChars([msg("abc"), msg("de")])).toBe(5);
  });

  it("counts a legacy string content field", () => {
    expect(totalChars([{ role: "user", content: "hello" }])).toBe(5);
  });

  it("ignores parts with no text", () => {
    expect(totalChars([{ role: "user", parts: [{ type: "step-start" }] }])).toBe(0);
  });
});

// ---------------------------------------------------------------- origin

describe("isSameOrigin", () => {
  it("is skipped outside production so local dev and curl keep working", () => {
    setEnv("development");
    expect(isSameOrigin(req())).toBe(true);
  });

  it("accepts a matching Origin in production", () => {
    setEnv("production");
    expect(isSameOrigin(req({
      host: "vidya-quest.vercel.app",
      origin: "https://vidya-quest.vercel.app",
    }))).toBe(true);
  });

  it("falls back to Referer when Origin is absent", () => {
    setEnv("production");
    expect(isSameOrigin(req({
      host: "vidya-quest.vercel.app",
      referer: "https://vidya-quest.vercel.app/parent",
    }))).toBe(true);
  });

  it("rejects a cross-site Origin", () => {
    setEnv("production");
    expect(isSameOrigin(req({
      host: "vidya-quest.vercel.app",
      origin: "https://evil.example.com",
    }))).toBe(false);
  });

  it("rejects a request with neither Origin nor Referer — not a browser", () => {
    setEnv("production");
    expect(isSameOrigin(req({ host: "vidya-quest.vercel.app" }))).toBe(false);
  });

  it("rejects a malformed Origin instead of throwing", () => {
    setEnv("production");
    expect(isSameOrigin(req({ host: "vidya-quest.vercel.app", origin: "not a url" }))).toBe(false);
  });

  it("does not treat a lookalike subdomain as same-origin", () => {
    setEnv("production");
    expect(isSameOrigin(req({
      host: "vidya-quest.vercel.app",
      origin: "https://vidya-quest.vercel.app.evil.com",
    }))).toBe(false);
  });
});

// ---------------------------------------------------------------- clientKey

describe("clientKey", () => {
  it("takes the first hop of x-forwarded-for", () => {
    expect(clientKey(req({ "x-forwarded-for": "203.0.113.9, 70.41.3.18" }))).toBe("203.0.113.9");
  });

  it("falls back to x-real-ip", () => {
    expect(clientKey(req({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
  });

  it("degrades to a constant rather than throwing", () => {
    expect(clientKey(req())).toBe("unknown");
  });
});

// ---------------------------------------------------------------- rate limit

describe("shared rateLimit", () => {
  beforeEach(() => { store.mockReset(); });
  it("awaits and forwards the shared result without another counter", async () => {
    const verdict = { ok: true, remaining: 2, resetAt: 100000, retryAfterSeconds: 0 };
    store.mockResolvedValue(verdict);
    expect(await rateLimit("a", { limit: 3, windowMs: 60000 })).toEqual(verdict);
    expect(store).toHaveBeenCalledWith("a", { limit: 3, windowMs: 60000 });
  });
  it("fails closed in production without logging store errors or falling back locally", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.mockRejectedValue(new Error("private database credential"));
    try {
      const results = await Promise.all(Array.from({ length: 10 }, () => rateLimit("a", { limit: 3, windowMs: 60000 })));
      for (const result of results) {
        expect(result).toMatchObject({ ok: false, unavailable: true, remaining: 0, retryAfterSeconds: 5 });
        expect(JSON.stringify(result)).not.toContain("credential");
      }
      expect(log).not.toHaveBeenCalled();
    } finally { vi.unstubAllEnvs(); log.mockRestore(); }
  });
  it("distinguishes exhausted budget from unavailable storage", async () => {
    store.mockResolvedValue({ ok: false, remaining: 0, resetAt: 100000, retryAfterSeconds: 10 });
    const result = await rateLimit("a", { limit: 3, windowMs: 60000 });
    expect(result.unavailable).toBeUndefined();
    expect(rateHeaders(result, 3)).toEqual({ "x-ratelimit-limit": "3", "x-ratelimit-remaining": "0", "x-ratelimit-reset": "100", "retry-after": "10" });
  });
  it("preserves allowed headers without retry-after", () => {
    expect(rateHeaders({ ok: true, remaining: 1, resetAt: 60001, retryAfterSeconds: 0 }, 2)).toEqual({ "x-ratelimit-limit": "2", "x-ratelimit-remaining": "1", "x-ratelimit-reset": "61" });
  });
});
