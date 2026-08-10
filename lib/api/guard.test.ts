import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  tutorRequestSchema, assemblyRequestSchema, totalChars, isSameOrigin,
  clientKey, rateLimit, rateHeaders, __resetRateLimiter, LIMITS,
} from "./guard";

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

  it("tolerates unknown message part kinds the AI SDK may add", () => {
    const r = tutorRequestSchema.safeParse({
      messages: [{ role: "assistant", parts: [{ type: "tool-invocation", state: "result" }] }],
    });
    expect(r.success).toBe(true);
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

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimiter());

  const opts = { limit: 3, windowMs: 60_000 };

  it("allows up to the limit then denies", () => {
    expect(rateLimit("a", opts).ok).toBe(true);
    expect(rateLimit("a", opts).ok).toBe(true);
    expect(rateLimit("a", opts).ok).toBe(true);
    expect(rateLimit("a", opts).ok).toBe(false);
  });

  it("counts each client separately", () => {
    rateLimit("a", opts); rateLimit("a", opts); rateLimit("a", opts);
    expect(rateLimit("a", opts).ok).toBe(false);
    expect(rateLimit("b", opts).ok).toBe(true);
  });

  it("reports remaining budget accurately", () => {
    expect(rateLimit("a", opts).remaining).toBe(2);
    expect(rateLimit("a", opts).remaining).toBe(1);
    expect(rateLimit("a", opts).remaining).toBe(0);
  });

  it("never reports negative remaining once over", () => {
    for (let i = 0; i < 8; i++) rateLimit("a", opts);
    expect(rateLimit("a", opts).remaining).toBe(0);
  });

  it("reopens after the window expires", () => {
    // The window must be comfortably longer than the gap between the first two
    // calls, or a loaded machine can roll it over early and the "denied"
    // assertion flakes. 60ms is far more than two synchronous calls need.
    const short = { limit: 1, windowMs: 60 };
    expect(rateLimit("a", short).ok).toBe(true);
    expect(rateLimit("a", short).ok).toBe(false);
    // Busy-wait comfortably past the window rather than faking timers, since
    // the limiter reads Date.now() directly.
    const until = Date.now() + 120;
    while (Date.now() < until) { /* spin */ }
    expect(rateLimit("a", short).ok).toBe(true);
  });

  it("supplies a positive retry-after only when denied", () => {
    expect(rateLimit("a", opts).retryAfterSeconds).toBe(0);
    rateLimit("a", opts); rateLimit("a", opts);
    expect(rateLimit("a", opts).retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe("rateHeaders", () => {
  beforeEach(() => __resetRateLimiter());

  it("omits retry-after while the client is under budget", () => {
    const h = rateHeaders(rateLimit("a", { limit: 2, windowMs: 60_000 }), 2);
    expect(h["retry-after"]).toBeUndefined();
    expect(h["x-ratelimit-limit"]).toBe("2");
    expect(h["x-ratelimit-remaining"]).toBe("1");
  });

  it("sets retry-after once denied", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    rateLimit("a", opts);
    const h = rateHeaders(rateLimit("a", opts), 1);
    expect(Number(h["retry-after"])).toBeGreaterThan(0);
  });
});
