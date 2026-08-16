import { describe, expect, it } from "vitest";
import { readBoundedJson } from "./bounded-json";

describe("bounded JSON request reader", () => {
  it("parses JSON only when its UTF-8 body fits the byte limit", async () => {
    const request = new Request("https://vidya.example/api", {
      method: "POST",
      body: JSON.stringify({ value: "नमस्ते" }),
    });

    await expect(readBoundedJson(request, 64)).resolves.toEqual({
      ok: true,
      value: { value: "नमस्ते" },
    });
  });

  it("rejects a declared oversized body before reading it", async () => {
    const request = new Request("https://vidya.example/api", {
      method: "POST",
      headers: { "content-length": "1000" },
      body: "{}",
    });

    await expect(readBoundedJson(request, 100)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  it("stops a streamed body when actual bytes exceed the limit", async () => {
    const request = new Request("https://vidya.example/api", {
      method: "POST",
      body: JSON.stringify({ value: "x".repeat(200) }),
    });

    await expect(readBoundedJson(request, 100)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  it("rejects missing and malformed JSON bodies", async () => {
    await expect(readBoundedJson(
      new Request("https://vidya.example/api", { method: "POST" }),
      100,
    )).resolves.toEqual({ ok: false, reason: "invalid" });

    await expect(readBoundedJson(new Request("https://vidya.example/api", {
      method: "POST",
      body: "not-json",
    }), 100)).resolves.toEqual({ ok: false, reason: "invalid" });
  });
});
