import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const saved = vi.hoisted(() => ({ settings: { voice: true, voiceVolume: 0.6, voiceURI: "natural", audioMuted: false } }));
vi.mock("./audio-bootstrap", () => ({ readPersistedAudioSettings: () => saved.settings }));
const natural = { voiceURI: "natural", name: "English Natural", lang: "en-GB", default: false };
let spoken: { text: string; voice?: unknown; pitch?: number; volume?: number; lang?: string; onstart?: () => void; onend?: () => void }[];

beforeEach(() => {
  vi.resetModules();
  saved.settings = { voice: true, voiceVolume: 0.6, voiceURI: "natural", audioMuted: false };
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
  it("keeps cold automatic narration silent despite remembered voice:true", async () => {
    const { speak, vidya } = await import("./speech");
    speak("Automatic instruction"); vidya.greet("Test");
    expect(spoken).toHaveLength(0);
  });
  it("allows a labelled narration action while honoring the current voice toggle", async () => {
    const { speakFromGesture, speak } = await import("./speech");
    speakFromGesture("Read this instruction"); expect(spoken).toHaveLength(1);
    speak("Later feedback"); expect(spoken).toHaveLength(2);
    saved.settings.voice = false; speakFromGesture("Muted narration"); expect(spoken).toHaveLength(2);
  });
  it("honours master mute as well as the separate narration preference", async () => {
    saved.settings.audioMuted = true;
    const { speakFromGesture } = await import("./speech");
    speakFromGesture("Silent instruction");
    expect(spoken).toHaveLength(0);
  });
  it("ducks ambience only while speech is active and restores it on cancellation", async () => {
    const audio = await import("./audio");
    const duck = vi.spyOn(audio, "setNarrationActive");
    const { speakFromGesture: speak, stopSpeaking } = await import("./speech");
    speak("Listen"); spoken[0].onstart?.();
    expect(duck).toHaveBeenLastCalledWith(true);
    stopSpeaking(); expect(duck).toHaveBeenLastCalledWith(false);
  });
  it("keeps the startup greeting silent when this learner muted voice", async () => {
    saved.settings.voice = false;
    const { vidya } = await import("./speech");
    vidya.greet("Test");
    expect(spoken).toHaveLength(0);
  });
  it("uses natural pitch and the selected voice for the greeting", async () => {
    const { vidya } = await import("./speech");
    const { authorizeAudioFromGesture } = await import("./audio"); authorizeAudioFromGesture();
    vidya.greet("Test");
    expect(spoken[0]).toMatchObject({ voice: natural, pitch: 1, volume: 0.6, lang: "en-GB" });
    expect(spoken[0].text).not.toMatch(/madam|missed you|waiting/i);
  });
  it("does not let a cancelled older utterance reset the active instruction", async () => {
    const audio = await import("./audio"); const duck = vi.spyOn(audio, "setNarrationActive");
    const { speakFromGesture: speak } = await import("./speech");
    speak("Old instruction"); speak("New instruction"); spoken[1].onstart?.();
    const calls = duck.mock.calls.length; spoken[0].onend?.();
    expect(duck.mock.calls).toHaveLength(calls); expect(duck).toHaveBeenLastCalledWith(true);
  });
  it("reads the active learner's settings on each utterance", async () => {
    const { speakFromGesture: speak } = await import("./speech");
    speak("First learner");
    saved.settings.voiceVolume = 0.2;
    speak("Second learner");
    expect(spoken[1].volume).toBe(0.2);
    saved.settings.voice = false;
    speak("Muted learner");
    expect(spoken).toHaveLength(2);
  });
});
