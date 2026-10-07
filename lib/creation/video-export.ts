import { frameSVG, FRAME_HEIGHT, FRAME_WIDTH, type CreationProject } from "./project";
export function supportedVideoType(): string | null {
  if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement === "undefined" || !HTMLCanvasElement.prototype.captureStream) return null;
  return ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}
/** Records an owned drawing canvas only. Never asks for camera or microphone. */
export async function exportCreationVideo(project: CreationProject, signal?: AbortSignal): Promise<{ blob: Blob; extension: string }> {
  const mimeType = supportedVideoType();
  if (!mimeType) throw new Error("Video export is not supported here. Download your storyboard instead.");
  const canvas = document.createElement("canvas"); canvas.width = FRAME_WIDTH; canvas.height = FRAME_HEIGHT;
  const context = canvas.getContext("2d"); if (!context) throw new Error("Drawing is unavailable. Download your storyboard instead.");
  const images = await Promise.all(project.frames.map((frame) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("A frame could not be drawn."));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(frameSVG(frame))}`;
  })));
  if (signal?.aborted) throw new Error("Export cancelled.");
  const stream = canvas.captureStream(12);
  let recorder: MediaRecorder;
  try { recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_000_000 }); }
  catch { stream.getTracks().forEach((track) => track.stop()); throw new Error("Video export could not start. Download your storyboard instead."); }
  const chunks: Blob[] = [];
  let timer: ReturnType<typeof setInterval> | undefined; let timeout: ReturnType<typeof setTimeout> | undefined;
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => { clearInterval(timer); clearTimeout(timeout); stream.getTracks().forEach((track) => track.stop()); signal?.removeEventListener("abort", cancel); };
    const fail = (message: string) => { if (settled) return; settled = true; cleanup(); if (recorder.state !== "inactive") recorder.stop(); reject(new Error(message)); };
    const cancel = () => fail("Export cancelled.");
    signal?.addEventListener("abort", cancel, { once: true });
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onerror = () => fail("Video export could not finish. Download your storyboard instead.");
    recorder.onstop = () => { if (settled) return; settled = true; cleanup(); const blob = new Blob(chunks, { type: mimeType }); if (!blob.size) reject(new Error("Video export was empty. Download your storyboard instead.")); else resolve({ blob, extension: mimeType.startsWith("video/mp4") ? "mp4" : "webm" }); };
    let frame = 0;
    if (signal?.aborted) { cancel(); return; }
    try { context.drawImage(images[0], 0, 0); recorder.start(); } catch { fail("Video export could not start. Download your storyboard instead."); return; }
    timer = setInterval(() => { frame++; if (frame >= images.length) { clearInterval(timer); recorder.stop(); } else context.drawImage(images[frame], 0, 0); }, 800);
    timeout = setTimeout(() => fail("Video export timed out. Download your storyboard instead."), 12_000);
  });
}
