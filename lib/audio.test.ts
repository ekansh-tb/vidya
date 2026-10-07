import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({ nodes: [] as { kind: string; volume: { value: number }; mute: boolean; dispose: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; triggerAttackRelease: ReturnType<typeof vi.fn> }[], start: vi.fn(), visibility: undefined as (() => void) | undefined, saved: { sound: true, music: true, voice: true, musicVolume: -24, sfxVolume: -18, voiceVolume: 0.55, audioMuted: false } }));
vi.mock("./audio-bootstrap", () => ({ readPersistedAudioSettings: () => mock.saved }));
vi.mock("tone", () => {
  class Node {
    volume = { value: 0 }; mute = false;
    dispose = vi.fn(); start = vi.fn(); stop = vi.fn(); triggerAttackRelease = vi.fn(); releaseAll = vi.fn(); triggerRelease = vi.fn();
    constructor(public kind: string) { mock.nodes.push(this); }
    toDestination() { return this; } connect() { return this; }
  }
  return {
    start: mock.start, now: () => 1,
    Volume: class extends Node { constructor() { super("volume"); } },
    Reverb: class extends Node { constructor() { super("reverb"); } },
    PolySynth: class extends Node { constructor() { super("poly"); } },
    Synth: class extends Node { constructor() { super("synth"); } },
    Clock: class extends Node { constructor() { super("clock"); } },
    MembraneSynth: class extends Node { constructor() { super("drum"); } },
    NoiseSynth: class extends Node { constructor() { super("noise"); } },
    getTransport: () => { throw new Error("Global Transport must remain untouched"); },
  };
});
beforeEach(() => {
  vi.resetModules(); mock.nodes = []; mock.start.mockClear(); mock.saved.audioMuted = false;
  vi.stubGlobal("window", {});
  vi.stubGlobal("document", { hidden: false, addEventListener: (_: string, fn: () => void) => { mock.visibility = fn; }, removeEventListener: vi.fn() });
});
afterEach(() => vi.unstubAllGlobals());

describe("shared audio lifecycle", () => {
  it("does not authorize audible playback on hydration or arbitrary gestures", async () => {
    const audio = await import("./audio");
    audio.syncAudioSettings(mock.saved); await audio.startMusic(); audio.armAudioOnFirstGesture();
    expect(mock.start).not.toHaveBeenCalled(); expect(audio.isAudioStarted()).toBe(false);
    await audio.enableAudioFromGesture(); expect(mock.start).toHaveBeenCalledOnce();
    expect(mock.nodes.find((n) => n.kind === "clock")?.start).toHaveBeenCalled();
  });
  it("master mute gates effects and instruments and preserves channel preferences", async () => {
    const audio = await import("./audio"); const instrument = await audio.createStudioInstrument("marimba");
    const node = mock.nodes.filter((n) => n.kind === "poly").at(-1)!;
    instrument.play(2); expect(node.triggerAttackRelease).toHaveBeenCalledOnce();
    audio.setMasterMuted(true); instrument.play(3); audio.sfx.click();
    expect(node.triggerAttackRelease).toHaveBeenCalledOnce(); expect(audio.isSfxEnabled()).toBe(true);
    expect(mock.nodes[0].mute).toBe(true);
  });
  it("suspends ambience inside the studio, ducks narration and stops only its own clock", async () => {
    const audio = await import("./audio"); await audio.enableAudioFromGesture();
    const bus = mock.nodes[1]; const clock = mock.nodes.find((n) => n.kind === "clock")!;
    audio.setNarrationActive(true); expect(bus.volume.value).toBe(-36);
    audio.setNarrationActive(false); expect(bus.volume.value).toBe(-24);
    audio.setStudioActive(true); expect(bus.mute).toBe(true); expect(clock.stop).toHaveBeenCalled();
    audio.setStudioActive(false); expect(bus.mute).toBe(false);
    await audio.stopMusic(); expect(clock.stop).toHaveBeenCalled();
  });
  it("silences inactive pages and disposes every owned instrument and listener", async () => {
    const audio = await import("./audio"); const handle = await audio.createStudioInstrument("percussion");
    Object.defineProperty(document, "hidden", { value: true, configurable: true }); mock.visibility?.();
    handle.play(0); expect(mock.nodes.find((n) => n.kind === "drum")?.triggerAttackRelease).not.toHaveBeenCalled();
    expect(mock.nodes[0].mute).toBe(true);
    audio.disposeAudio();
    expect(mock.nodes.every((node) => node.dispose.mock.calls.length === 1)).toBe(true);
    expect(audio.isAudioStarted()).toBe(false); expect(document.removeEventListener).toHaveBeenCalled();
  });
});
