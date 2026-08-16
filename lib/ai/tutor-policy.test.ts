import { describe, expect, it } from "vitest";
import {
  isTutorDailyTurnLimit,
  isTutorMaxOutputTokens,
  isTutorModelId,
  TUTOR_POLICY_LIMITS,
} from "./tutor-policy";

describe("parent tutor policy validation", () => {
  it("keeps parent limits within the currently enforced tutor ceilings", () => {
    expect(TUTOR_POLICY_LIMITS.dailyTurns).toEqual({ min: 1, max: 60, default: 60 });
    expect(TUTOR_POLICY_LIMITS.maxOutputTokens).toEqual({ min: 128, max: 900, default: 900 });
    expect(isTutorDailyTurnLimit(1)).toBe(true);
    expect(isTutorDailyTurnLimit(60)).toBe(true);
    expect(isTutorDailyTurnLimit(0)).toBe(false);
    expect(isTutorDailyTurnLimit(61)).toBe(false);
    expect(isTutorDailyTurnLimit(1.5)).toBe(false);
    expect(isTutorMaxOutputTokens(128)).toBe(true);
    expect(isTutorMaxOutputTokens(900)).toBe(true);
    expect(isTutorMaxOutputTokens(127)).toBe(false);
    expect(isTutorMaxOutputTokens(901)).toBe(false);
  });

  it("accepts provider model identifiers without accepting prose or URLs", () => {
    expect(isTutorModelId("anthropic/claude-haiku-4.5")).toBe(true);
    expect(isTutorModelId("gpt-4.1-mini")).toBe(true);
    expect(isTutorModelId("models/gemini-2.5-flash")).toBe(true);
    expect(isTutorModelId("model with spaces")).toBe(false);
    expect(isTutorModelId("https://provider.example/model")).toBe(false);
    expect(isTutorModelId(42)).toBe(false);
  });
});
