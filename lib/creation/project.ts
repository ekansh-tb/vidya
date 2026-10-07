import { z } from "zod";

export type CreationMode = "drawing" | "shapes" | "story" | "flipbook";
export type ShapeKind = "circle" | "square" | "triangle";
export type CreationShape = { id: string; kind: ShapeKind; x: number; y: number; size: number; color: string };
export type CreationStroke = { color: string; points: [number, number][] };
export type CreationFrame = { id: string; caption: string; shapes: CreationShape[]; strokes: CreationStroke[] };
export type StoryPage = { id: string; text: string; choices: { label: string; nextId: string }[] };
export type CreationProject = { version: 1; id: string; mode: CreationMode; title: string; visibility: "private" | "parent"; frames: CreationFrame[]; pages: StoryPage[]; createdAt: string; updatedAt: string };
export type CreativeStudioState = { version: 1; draft?: CreationProject; projects: CreationProject[]; deletedProjectIds?: Record<string, string> };
export const CREATION_COLORS = ["#0f7f85", "#6470d7", "#d96355", "#e2af38", "#173453", "#ffffff"];
export const FRAME_WIDTH = 720;
export const FRAME_HEIGHT = 480;
export const MAX_FRAMES = 8;
export const MAX_STROKES = 24;
export const MAX_POINTS = 48;
export const MAX_STUDIO_BYTES = 200_000;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
export function emptyFrame(id: string): CreationFrame { return { id, caption: "", shapes: [], strokes: [] }; }
export function newProject(mode: CreationMode, id: string, now: string): CreationProject {
  return { version: 1, id, mode, title: "", visibility: "private", frames: [emptyFrame(`${id}-frame-1`)], pages: [{ id: `${id}-page-1`, text: "", choices: [] }], createdAt: now, updatedAt: now };
}
export function shapePosition(shape: CreationShape, x: number, y: number): CreationShape {
  const size = clamp(shape.size, 20, 180);
  return { ...shape, size, x: Math.round(clamp(x, size / 2, FRAME_WIDTH - size / 2)), y: Math.round(clamp(y, size / 2, FRAME_HEIGHT - size / 2)) };
}
export function svgEscape(text: string): string { return text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!); }
function validColor(color: string) { return CREATION_COLORS.includes(color) ? color : CREATION_COLORS[0]; }
export function frameSVG(frame: CreationFrame): string {
  const shapes = frame.shapes.map((shape) => {
    const safe = shapePosition(shape, shape.x, shape.y); const half = safe.size / 2; const fill = validColor(safe.color);
    if (safe.kind === "circle") return `<circle cx="${safe.x}" cy="${safe.y}" r="${half}" fill="${fill}"/>`;
    if (safe.kind === "triangle") return `<polygon points="${safe.x},${safe.y - half} ${safe.x - half},${safe.y + half} ${safe.x + half},${safe.y + half}" fill="${fill}"/>`;
    return `<rect x="${safe.x - half}" y="${safe.y - half}" width="${safe.size}" height="${safe.size}" fill="${fill}"/>`;
  }).join("");
  const strokes = frame.strokes.map((stroke) => `<polyline points="${stroke.points.map(([x, y]) => `${Math.round(clamp(x, 0, FRAME_WIDTH))},${Math.round(clamp(y, 0, FRAME_HEIGHT))}`).join(" ")}" fill="none" stroke="${validColor(stroke.color)}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480"><rect width="720" height="480" fill="#f0f6fa"/>${shapes}${strokes}</svg>`;
}
export function storyboardHTML(project: CreationProject): string {
  const frames = project.frames.map((frame, index) => `<figure>${frameSVG(frame)}<figcaption>Frame ${index + 1}: ${svgEscape(frame.caption)}</figcaption></figure>`).join("");
  const pages = project.mode === "story" ? project.pages.map((page, index) => `<section><h2>Page ${index + 1}</h2><p>${svgEscape(page.text)}</p><ul>${page.choices.map((choice) => `<li>${svgEscape(choice.label)}: page ${project.pages.findIndex((target) => target.id === choice.nextId) + 1}</li>`).join("")}</ul></section>`).join("") : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><title>${svgEscape(project.title || "My creation")}</title><style>body{font:18px system-ui;color:#173453;background:white;max-width:900px;margin:24px auto;padding:20px}figure{margin:24px 0;break-inside:avoid}svg{width:100%;height:auto}figcaption{padding:12px}p{white-space:pre-wrap}section{break-inside:avoid}</style></head><body><h1>${svgEscape(project.title || "My creation")}</h1>${frames}${pages}<p>Created in Vidya. This is a storyboard document, not a video.</p></body></html>`;
}
export function canSaveStudio(studio: CreativeStudioState): boolean { return studio.projects.length <= 20 && new TextEncoder().encode(JSON.stringify(studio)).length <= MAX_STUDIO_BYTES; }

const colorSchema = z.enum(CREATION_COLORS as [string, ...string[]]);
const frameSchema = z.object({ id: z.string().max(80), caption: z.string().max(120), shapes: z.array(z.object({ id: z.string().max(80), kind: z.enum(["circle", "square", "triangle"]), x: z.number().finite().min(0).max(FRAME_WIDTH), y: z.number().finite().min(0).max(FRAME_HEIGHT), size: z.number().finite().min(20).max(180), color: colorSchema })).max(24), strokes: z.array(z.object({ color: colorSchema, points: z.array(z.tuple([z.number().finite().min(0).max(FRAME_WIDTH), z.number().finite().min(0).max(FRAME_HEIGHT)])).max(MAX_POINTS) })).max(MAX_STROKES) });
export const creationCardSnapshotSchema = z.object({ title: z.string().max(80), frame: frameSchema });
export const creationProjectSchema = z.object({ version: z.literal(1), id: z.string().max(80), mode: z.enum(["drawing", "shapes", "story", "flipbook"]), title: z.string().max(80), visibility: z.enum(["private", "parent"]), frames: z.array(frameSchema).min(1).max(MAX_FRAMES), pages: z.array(z.object({ id: z.string().max(80), text: z.string().max(800), choices: z.array(z.object({ label: z.string().max(80), nextId: z.string().max(80) })).max(2) })).min(1).max(8), createdAt: z.string().datetime(), updatedAt: z.string().datetime() });
export function readCreationProject(value: unknown): CreationProject | undefined { const result = creationProjectSchema.safeParse(value); return result.success ? result.data : undefined; }
/** Owner/family responses receive only saved work a child explicitly shared. */
export function familySharedCreations(studio: CreativeStudioState | undefined): CreationProject[] { return (studio?.projects ?? []).filter((project) => project.visibility === "parent"); }

export function mergeCreativeStudio(local: CreativeStudioState | undefined, remote: unknown): CreativeStudioState | undefined {
  if (!remote || typeof remote !== "object" || Array.isArray(remote)) return local;
  const incoming = remote as Partial<CreativeStudioState>;
  if (incoming.version !== 1 || !Array.isArray(incoming.projects)) return local;
  const deletedProjectIds: Record<string, string> = { ...local?.deletedProjectIds };
  for (const [key, stamp] of Object.entries(incoming.deletedProjectIds ?? {})) {
    if (typeof stamp === "string" && Number.isFinite(Date.parse(stamp)) && (!deletedProjectIds[key] || Date.parse(stamp) > Date.parse(deletedProjectIds[key]))) deletedProjectIds[key] = stamp;
  }
  const projects = new Map<string, CreationProject>();
  for (const value of [...(local?.projects ?? []), ...incoming.projects]) {
    const project = readCreationProject(value); if (!project) continue;
    const prior = projects.get(project.id);
    if (!prior || Date.parse(project.updatedAt) > Date.parse(prior.updatedAt)) projects.set(project.id, project);
  }
  const firstDraft = readCreationProject(local?.draft); const secondDraft = readCreationProject(incoming.draft);
  const draft = !firstDraft ? secondDraft : secondDraft && Date.parse(secondDraft.updatedAt) > Date.parse(firstDraft.updatedAt) ? secondDraft : firstDraft;
  return { version: 1, draft, deletedProjectIds, projects: [...projects.values()].filter((project) => !deletedProjectIds[project.id] || Date.parse(project.updatedAt) > Date.parse(deletedProjectIds[project.id])) };
}
