import { describe, expect, it } from "vitest";
import { selectSpeechVoice } from "./speech-voices";

const voice = (name: string, lang: string, isDefault = false) => ({ name, lang, voiceURI: name, default: isDefault });
describe("guidance voice selection", () => {
  it("prefers a natural English voice over a basic regional voice", () => {
    const natural = voice("English Natural", "en-GB");
    expect(selectSpeechVoice([voice("Basic", "en-IN", true), natural], "en-IN")).toBe(natural);
  });
  it("honors an explicit learner choice within the spoken language", () => {
    const chosen = voice("My voice", "en-AU");
    expect(selectSpeechVoice([voice("Natural", "en-US"), chosen], "en", chosen.voiceURI)).toBe(chosen);
  });
  it("does not speak another language just to match a voice preference", () => {
    const hindi = voice("Hindi", "hi-IN");
    expect(selectSpeechVoice([voice("Natural", "en-US"), hindi], "hi-IN", "Natural")).toBe(hindi);
    expect(selectSpeechVoice([hindi], "en")).toBeUndefined();
  });
  it("handles delayed voice lists and locale spelling", () => {
    expect(selectSpeechVoice([], "en")).toBeUndefined();
    const selected = voice("Enhanced", "EN_US");
    expect(selectSpeechVoice([selected], "en-US")).toBe(selected);
  });
});
