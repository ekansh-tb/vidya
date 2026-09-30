import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const saved = vi.hoisted(() => ({ settings: { voice: true, voiceVolume: 0.6, voiceURI: "natural" } }));
vi.mock("./audio-bootstrap", () => ({ readPersistedAudioSettings: () => saved.settings }));
const natural = { voiceURI: "natural", name: "English Natural", lang: "en-GB", default: false };
let spoken: { text: string; voice?: unknown; pitch?: number; volume?: number; lang?: string }[];

beforeEach(() => {
  vi.resetModules();
  saved.settings = { voice: true, voiceVolume: 0.6, voiceURI: "natural" };
  spoken = [];
  vi.stubGlobal("window", { speechSynthesis: {
    getVoices: () => [natural], cancel: vi.fn(),
    speak: (utterance: typeof spoken[number]) => spoken.push(utterance),
  } });
  vi.stubGlobal("SpeechSynthesisUtterance", class {
    constructor(public text: string) {}
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("spoken guidance preferences", () => {
  it("keeps the startup greeting silent when this learner muted voice", async () => {
    saved.settings.voice = false;
    const { vidya } = await import("./speech");
    vidya.greet("Test");
    expect(spoken).toHaveLength(0);
  });
  it("uses natural pitch and the selected voice for the greeting", async () => {
    const { vidya } = await import("./speech");
    vidya.greet("Test");
    expect(spoken[0]).toMatchObject({ voice: natural, pitch: 1, volume: 0.6, lang: "en-GB" });
    expect(spoken[0].text).not.toMatch(/madam|missed you|waiting/i);
  });
  it("reads the active learner's settings on each utterance", async () => {
    const { speak } = await import("./speech");
    speak("First learner");
    saved.settings.voiceVolume = 0.2;
    speak("Second learner");
    expect(spoken[1].volume).toBe(0.2);
    saved.settings.voice = false;
    speak("Muted learner");
    expect(spoken).toHaveLength(2);
  });
});
