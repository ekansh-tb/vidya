import { afterEach, describe, expect, it, vi } from "vitest";
import { supportedVideoType } from "./video-export";
afterEach(() => vi.unstubAllGlobals());
describe("canvas video export capability", () => {
  it("offers storyboard fallback when recording is unavailable", () => { expect(supportedVideoType()).toBeNull(); });
  it("uses only a format the browser reports it supports", () => {
    vi.stubGlobal("HTMLCanvasElement", class { captureStream() {} });
    vi.stubGlobal("MediaRecorder", { isTypeSupported: (type: string) => type === "video/mp4" });
    expect(supportedVideoType()).toBe("video/mp4");
  });
  it("does not treat camera media APIs as sufficient for canvas export", () => {
    vi.stubGlobal("HTMLCanvasElement", class {});
    vi.stubGlobal("MediaRecorder", { isTypeSupported: () => true });
    expect(supportedVideoType()).toBeNull();
  });
});

import { exportCreationVideo } from "./video-export";
import { newProject } from "./project";

describe("canvas recording cleanup", () => {
  function installRecorder(failConstruction = false) {
    const stopTrack = vi.fn();
    class Canvas { width = 0; height = 0; captureStream() { return { getTracks: () => [{ stop: stopTrack }] }; } getContext() { return { drawImage: vi.fn() }; } }
    class Recorder {
      static isTypeSupported(type: string) { return type === "video/webm"; }
      state = "inactive"; ondataavailable?: (event: { data: Blob }) => void; onstop?: () => void;
      constructor() { if (failConstruction) throw new Error("Codec unavailable"); }
      start() { this.state = "recording"; }
      stop() { this.state = "inactive"; this.ondataavailable?.({ data: new Blob(["encoded-frames"]) }); this.onstop?.(); }
    }
    vi.stubGlobal("HTMLCanvasElement", Canvas); vi.stubGlobal("MediaRecorder", Recorder);
    vi.stubGlobal("document", { createElement: () => new Canvas() });
    vi.stubGlobal("Image", class { onload?: () => void; set src(_value: string) { this.onload?.(); } });
    return stopTrack;
  }
  it("exports the supported format and stops every canvas track", async () => {
    vi.useFakeTimers(); const stop = installRecorder();
    const pending = exportCreationVideo(newProject("flipbook", "project", "2026-10-08T00:00:00.000Z"));
    await vi.advanceTimersByTimeAsync(900);
    const result = await pending; expect(result.extension).toBe("webm"); expect(result.blob.size).toBeGreaterThan(0); expect(stop).toHaveBeenCalledOnce(); expect(vi.getTimerCount()).toBe(0); vi.useRealTimers();
  });
  it("releases the stream if a browser rejects the recorder constructor", async () => {
    const stop = installRecorder(true);
    await expect(exportCreationVideo(newProject("flipbook", "project", "2026-10-08T00:00:00.000Z"))).rejects.toThrow("storyboard"); expect(stop).toHaveBeenCalledOnce();
  });
  it("cancels an in-progress export without retaining tracks or timers", async () => {
    vi.useFakeTimers(); const stop = installRecorder(); const controller = new AbortController();
    const pending = exportCreationVideo(newProject("flipbook", "project", "2026-10-08T00:00:00.000Z"), controller.signal);
    const assertion = expect(pending).rejects.toThrow("cancelled");
    await vi.advanceTimersByTimeAsync(0); controller.abort(); await assertion;
    expect(stop).toHaveBeenCalledOnce(); expect(vi.getTimerCount()).toBe(0); vi.useRealTimers();
  });
});
