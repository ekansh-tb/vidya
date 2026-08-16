import { describe, expect, it } from "vitest";
import { configuredAiProvider } from "./provider-config";

describe("configuredAiProvider", () => {
  it("returns null when no provider credential is configured", () => {
    expect(configuredAiProvider({})).toBeNull();
    expect(configuredAiProvider({ ANTHROPIC_API_KEY: "   " })).toBeNull();
  });

  it("recognizes a direct Anthropic credential", () => {
    expect(configuredAiProvider({ ANTHROPIC_API_KEY: "configured" })).toBe("anthropic");
  });

  it("recognizes both supported gateway credentials", () => {
    expect(configuredAiProvider({ AI_GATEWAY_API_KEY: "configured" })).toBe("gateway");
    expect(configuredAiProvider({ VERCEL_OIDC_TOKEN: "configured" })).toBe("gateway");
  });

  it("prefers gateway routing when both provider paths are configured", () => {
    expect(configuredAiProvider({
      AI_GATEWAY_API_KEY: "gateway",
      ANTHROPIC_API_KEY: "direct",
    })).toBe("gateway");
  });
});
