"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, Download, Play, Square, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState, LearnerProfile } from "@/lib/types";
import { canSaveStudio, CREATION_COLORS, emptyFrame, FRAME_HEIGHT, FRAME_WIDTH, MAX_FRAMES, MAX_POINTS, MAX_STROKES, newProject, readCreationProject, shapePosition, storyboardHTML, type CreationMode, type CreationProject, type CreationShape } from "@/lib/creation/project";
import { exportCreationVideo, supportedVideoType } from "@/lib/creation/video-export";

const MODES: { id: CreationMode; label: string; description: string }[] = [
  { id: "drawing", label: "Draw", description: "Make marks and follow an idea." },
  { id: "shapes", label: "Build with shapes", description: "Turn circles and triangles into something new." },
  { id: "story", label: "Tell a story", description: "Write pages and choose what happens next." },
  { id: "flipbook", label: "Make a flipbook", description: "Change a drawing, one frame at a time." },
];
const id = () => crypto.randomUUID();
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function CreationView({ state, setState, learner, onBack }: { state: GameState; setState: (updater: (s: GameState) => GameState) => void; learner: LearnerProfile; onBack: () => void }) {
  const [project, setProject] = useState<CreationProject | null>(readCreationProject(state.creativeStudio?.draft) ?? null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [storyPage, setStoryPage] = useState(0);
  const [color, setColor] = useState(CREATION_COLORS[0]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [liveStroke, setLiveStroke] = useState<[number, number][]>([]);
  const stroke = useRef<[number, number][] | null>(null);
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const exportAbort = useRef<AbortController | null>(null);
  const savedFingerprint = useRef(JSON.stringify(project));
  const reduced = useReducedMotion();
  const calm = !!reduced || state.settings.motion === false;
  const early = learner.placement?.kind === "early-years";
  const frame = project?.frames[Math.min(frameIndex, project.frames.length - 1)];
  const page = project?.pages[Math.min(pageIndex, project.pages.length - 1)];
  const shownFrame = playing ? project?.frames[previewFrame] : frame;
  function stopPreview() { if (previewTimer.current) clearInterval(previewTimer.current); previewTimer.current = null; setPlaying(false); }
  useEffect(() => {
    const stop = () => { if (document.hidden) { stopPreview(); exportAbort.current?.abort(); } };
    document.addEventListener("visibilitychange", stop);
    return () => { if (previewTimer.current) clearInterval(previewTimer.current); exportAbort.current?.abort(); document.removeEventListener("visibilitychange", stop); };
  }, []);
  const fingerprint = JSON.stringify(project);
  useEffect(() => {
    if (fingerprint === savedFingerprint.current || !project) return;
    savedFingerprint.current = fingerprint;
    setState((previous) => ({ ...previous, creativeStudio: { version: 1, projects: previous.creativeStudio?.projects ?? [], draft: project, deletedProjectIds: previous.creativeStudio?.deletedProjectIds } }));
  }, [fingerprint, project, setState]);
  function update(edit: (previous: CreationProject) => CreationProject) {
    setProject((previous) => previous ? { ...edit(previous), updatedAt: new Date().toISOString() } : previous);
  }
  function updateFrame(edit: (previous: NonNullable<typeof frame>) => NonNullable<typeof frame>) { update((previous) => ({ ...previous, frames: previous.frames.map((item, index) => index === frameIndex ? edit(item) : item) })); }
  function begin(mode: CreationMode) { stopPreview(); setFrameIndex(0); setPageIndex(0); setStoryPage(0); setSelectedShape(null); setProject(newProject(mode, id(), new Date().toISOString())); setStatus(""); }
  function addShape(kind: CreationShape["kind"]) {
    if (!frame || frame.shapes.length >= 24) { setStatus("This frame has 24 shapes. Try moving or removing one."); return; }
    const shape: CreationShape = { id: id(), kind, x: 240 + frame.shapes.length % 4 * 60, y: 220, size: 80, color };
    updateFrame((previous) => ({ ...previous, shapes: [...previous.shapes, shape] })); setSelectedShape(shape.id);
  }
  function point(event: React.PointerEvent<SVGSVGElement>): [number, number] { const rect = event.currentTarget.getBoundingClientRect(); return [Math.min(FRAME_WIDTH, Math.max(0, Math.round((event.clientX - rect.left) / rect.width * FRAME_WIDTH))), Math.min(FRAME_HEIGHT, Math.max(0, Math.round((event.clientY - rect.top) / rect.height * FRAME_HEIGHT)))]; }
  function finishStroke() {
    const points = stroke.current; stroke.current = null; setLiveStroke([]);
    if (points?.length && frame && frame.strokes.length < MAX_STROKES) updateFrame((previous) => ({ ...previous, strokes: [...previous.strokes, { color, points }] }));
  }
  function saveProject() {
    if (!project || !project.title.trim()) { setStatus("Give your creation a title first."); return; }
    const previous = state.creativeStudio?.projects ?? [];
    const studio = { version: 1 as const, draft: project, projects: [project, ...previous.filter((item) => item.id !== project.id)], deletedProjectIds: state.creativeStudio?.deletedProjectIds };
    if (!canSaveStudio(studio)) { setStatus("Your saved collection is full. Export a storyboard and remove an older creation before saving another."); return; }
    setState((current) => ({ ...current, creativeStudio: studio })); setStatus(`Saved ${project.title}. ${project.visibility === "private" ? "It stays private." : "You chose to show it in your family summary."}`);
  }
  function playPreview() {
    if (!project || calm) return;
    stopPreview(); setPreviewFrame(0); setPlaying(true); let index = 0;
    previewTimer.current = setInterval(() => { index++; if (index >= project.frames.length) stopPreview(); else setPreviewFrame(index); }, 800);
  }
  async function exportVideo() {
    if (!project) return; setExporting(true); exportAbort.current = new AbortController();
    try { const result = await exportCreationVideo(project, exportAbort.current.signal); download(result.blob, `vidya-flipbook.${result.extension}`); setStatus("Your video is ready."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Video export failed. Download your storyboard instead."); }
    finally { setExporting(false); exportAbort.current = null; }
  }
  const shape = frame?.shapes.find((item) => item.id === selectedShape);
  return <main className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24" style={{ color: "var(--text)" }}>
    <button className="inline-flex items-center gap-1 min-h-11 mb-4" onClick={() => { stopPreview(); exportAbort.current?.abort(); onBack(); }}><ChevronLeft size={20} /> Back to learning</button>
    <header className="mb-6"><h1 className="font-display text-3xl font-bold">Your idea starts here</h1><p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Draw, build, tell a story, or make a picture move. Your unfinished work saves as you go.</p></header>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">{MODES.filter((mode) => !early || mode.id !== "story").map((mode) => <button key={mode.id} aria-pressed={project?.mode === mode.id} className="glass-card p-4 text-left min-h-24" style={{ border: `2px solid ${project?.mode === mode.id ? "var(--accent)" : "var(--border)"}` }} onClick={() => { if (!project || window.confirm("Start a new draft? Save this creation first to keep it in your collection.")) begin(mode.id); }}><strong>{mode.label}</strong><span className="block text-xs mt-2" style={{ color: "var(--text-muted)" }}>{mode.description}</span></button>)}</div>
    {!project ? <section className="glass-card p-6"><p>Choose a way to create. There is no score and no right answer.</p></section> : <>
      <section className="glass-card p-4 mb-4"><label className="text-sm font-bold">Title<input value={project.title} maxLength={80} onChange={(event) => update((previous) => ({ ...previous, title: event.target.value }))} placeholder="My little world" className="block w-full rounded-lg min-h-11 px-3 mt-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} /></label></section>
      {project.mode === "story" ? <section className="glass-card p-4 mb-4"><h2 className="font-display text-xl font-bold">A story with choices</h2><div className="flex gap-2 flex-wrap my-3">{project.pages.map((item, index) => <button key={item.id} className="min-h-11 rounded-lg px-3" aria-pressed={pageIndex === index} onClick={() => setPageIndex(index)} style={{ background: pageIndex === index ? "var(--accent-soft)" : "var(--surface)" }}>Page {index + 1}</button>)}<Button disabled={project.pages.length >= 8} onClick={() => { update((previous) => ({ ...previous, pages: [...previous.pages, { id: id(), text: "", choices: [] }] })); setPageIndex(project.pages.length); }}>Add page</Button></div>
        {page && <><label className="text-sm">What happens on this page?<textarea maxLength={800} value={page.text} onChange={(event) => update((previous) => ({ ...previous, pages: previous.pages.map((item) => item.id === page.id ? { ...item, text: event.target.value } : item) }))} className="block w-full rounded-lg p-3 mt-2 mb-3 min-h-32" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} /></label>{page.choices.map((choice, index) => <div key={index} className="grid sm:grid-cols-2 gap-2 mb-2"><label className="text-xs">Choice label<input maxLength={80} value={choice.label} onChange={(event) => update((previous) => ({ ...previous, pages: previous.pages.map((item) => item.id === page.id ? { ...item, choices: item.choices.map((old, i) => i === index ? { ...old, label: event.target.value } : old) } : item) }))} className="block w-full rounded-lg min-h-11 px-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} /></label><label className="text-xs">Go to page<select value={choice.nextId} onChange={(event) => update((previous) => ({ ...previous, pages: previous.pages.map((item) => item.id === page.id ? { ...item, choices: item.choices.map((old, i) => i === index ? { ...old, nextId: event.target.value } : old) } : item) }))} className="block w-full rounded-lg min-h-11 px-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>{project.pages.map((target, i) => <option key={target.id} value={target.id}>Page {i + 1}</option>)}</select></label></div>)}<Button disabled={page.choices.length >= 2 || project.pages.length < 2} onClick={() => update((previous) => ({ ...previous, pages: previous.pages.map((item) => item.id === page.id ? { ...item, choices: [...item.choices, { label: "Choose a path", nextId: project.pages.find((target) => target.id !== page.id)!.id }] } : item) }))}>Add a choice</Button></>}
        <div className="rounded-xl p-4 mt-5" style={{ background: "var(--accent-soft)" }}><h3 className="font-bold">Read your story</h3><p className="whitespace-pre-wrap text-sm my-3">{project.pages[storyPage]?.text || "Write a page to begin."}</p><div className="flex gap-2 flex-wrap">{project.pages[storyPage]?.choices.map((choice, index) => <Button key={index} variant="secondary" onClick={() => setStoryPage(Math.max(0, project.pages.findIndex((item) => item.id === choice.nextId)))}>{choice.label}</Button>)}<Button variant="ghost" onClick={() => setStoryPage(0)}>Start again</Button></div></div>
      </section> : <section className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3"><h2 className="font-display text-xl font-bold">{project.mode === "flipbook" ? `Frame ${frameIndex + 1}` : "Your canvas"}</h2><div className="flex gap-2"><Button variant="ghost" disabled={!frame?.shapes.length && !frame?.strokes.length} onClick={() => updateFrame((previous) => previous.strokes.length ? { ...previous, strokes: previous.strokes.slice(0, -1) } : { ...previous, shapes: previous.shapes.slice(0, -1) })}><Undo2 size={16} /> Undo</Button>{project.mode === "flipbook" && <Button disabled={project.frames.length >= MAX_FRAMES || playing} onClick={() => { update((previous) => ({ ...previous, frames: [...previous.frames, { ...emptyFrame(id()), shapes: structuredClone(frame?.shapes ?? []), strokes: structuredClone(frame?.strokes ?? []) }] })); setFrameIndex(project.frames.length); }}><Plus size={16} /> Copy frame</Button>}</div></div>
        <div className="flex gap-2 flex-wrap mb-3">{CREATION_COLORS.map((tone, index) => <button key={tone} aria-label={`Choose ${["teal", "violet", "coral", "gold", "navy", "white"][index]}`} aria-pressed={color === tone} onClick={() => setColor(tone)} className="rounded-full min-w-11 min-h-11" style={{ background: tone, border: `3px solid ${color === tone ? "var(--text)" : "var(--border)"}` }} />)}{(["circle", "square", "triangle"] as const).map((kind) => <Button key={kind} variant="secondary" disabled={playing} onClick={() => addShape(kind)}>Add {kind}</Button>)}</div>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Draw with a finger or pointer. You can also add shapes and move them with the buttons below.</p>
        <svg role="img" aria-label="Your drawing canvas" viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`} className="w-full rounded-xl" style={{ background: "#f0f6fa", touchAction: project.mode === "shapes" ? "auto" : "none", border: "1px solid var(--border)" }} onPointerDown={(event) => { if (playing || project.mode === "shapes" || (event.target as SVGElement).closest("[data-shape]")) return; if ((frame?.strokes.length ?? 0) >= MAX_STROKES) { setStatus("This frame has enough drawing marks. Add a new frame or undo a mark."); return; } event.currentTarget.setPointerCapture(event.pointerId); stroke.current = [point(event)]; setLiveStroke([...stroke.current]); }} onPointerMove={(event) => { if (stroke.current) { if (stroke.current.length >= MAX_POINTS) stroke.current = stroke.current.filter((_, index) => index % 2 === 0); stroke.current.push(point(event)); setLiveStroke([...stroke.current]); } }} onPointerUp={finishStroke} onPointerCancel={() => { stroke.current = null; setLiveStroke([]); }}>
          {shownFrame?.shapes.map((item) => <g key={item.id} data-shape={item.id} onClick={() => setSelectedShape(item.id)}>{item.kind === "circle" ? <circle cx={item.x} cy={item.y} r={item.size / 2} fill={item.color} /> : item.kind === "triangle" ? <polygon points={`${item.x},${item.y - item.size / 2} ${item.x - item.size / 2},${item.y + item.size / 2} ${item.x + item.size / 2},${item.y + item.size / 2}`} fill={item.color} /> : <rect x={item.x - item.size / 2} y={item.y - item.size / 2} width={item.size} height={item.size} fill={item.color} />}</g>)}
          {liveStroke.length > 0 && <polyline points={liveStroke.map((coords) => coords.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
          {shownFrame?.strokes.map((item, index) => <polyline key={index} points={item.points.map((coords) => coords.join(",")).join(" ")} fill="none" stroke={item.color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />)}
        </svg>
        {frame?.shapes.length ? <div className="mt-3"><label className="text-sm">Choose a shape<select value={selectedShape ?? ""} onChange={(event) => setSelectedShape(event.target.value)} className="rounded-lg min-h-11 px-2 ml-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}><option value="">Choose a shape</option>{frame.shapes.map((item, index) => <option key={item.id} value={item.id}>{item.kind} {index + 1}</option>)}</select></label>{shape && <div className="flex gap-2 flex-wrap mt-2">{([[-20, 0, "Left"], [20, 0, "Right"], [0, -20, "Up"], [0, 20, "Down"]] as const).map(([x, y, label]) => <Button key={label} variant="secondary" onClick={() => updateFrame((previous) => ({ ...previous, shapes: previous.shapes.map((item) => item.id === shape.id ? shapePosition(item, item.x + x, item.y + y) : item) }))}>{label}</Button>)}<Button variant="ghost" onClick={() => updateFrame((previous) => ({ ...previous, shapes: previous.shapes.filter((item) => item.id !== shape.id) }))}>Remove shape</Button></div>}</div> : null}
        <label className="block text-sm mt-4">Frame caption<input maxLength={120} value={frame?.caption ?? ""} onChange={(event) => updateFrame((previous) => ({ ...previous, caption: event.target.value }))} className="block w-full rounded-lg min-h-11 px-3 mt-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} /></label>
        {project.mode === "flipbook" && <div className="flex gap-2 flex-wrap mt-4">{project.frames.map((item, index) => <button key={item.id} className="min-h-11 rounded-lg px-3" aria-pressed={frameIndex === index} onClick={() => { stopPreview(); setFrameIndex(index); setSelectedShape(null); }} style={{ background: frameIndex === index ? "var(--accent-soft)" : "var(--surface)" }}>Frame {index + 1}</button>)}<Button disabled={calm || project.frames.length < 2} onClick={() => playing ? stopPreview() : playPreview()}>{playing ? <><Square size={16} /> Pause</> : <><Play size={16} /> Preview once</>}</Button>{calm && <p className="text-xs">Animations are off. View your frames one at a time.</p>}</div>}
      </section>}
      <section className="glass-card p-4 mb-5"><label className="flex gap-3 items-start text-sm"><input className="mt-1" type="checkbox" checked={project.visibility === "parent"} onChange={(event) => {
        const visibility = event.target.checked ? "parent" : "private";
        const updatedAt = new Date().toISOString();
        update(previous => ({ ...previous, visibility }));
        setState(previous => ({ ...previous, creativeStudio: { version: 1, ...previous.creativeStudio, projects: (previous.creativeStudio?.projects ?? []).map(saved => saved.id === project.id ? { ...saved, visibility, updatedAt } : saved) } }));
      }} /><span>Show this creation in my family summary<span className="block text-xs mt-1" style={{ color: "var(--text-muted)" }}>Your draft stays private. Saved work is shared only when you choose this.</span></span></label><div className="flex gap-2 flex-wrap mt-4"><Button onClick={saveProject}>Save creation</Button><Button variant="secondary" onClick={() => download(new Blob([storyboardHTML(project)], { type: "text/html" }), "vidya-storyboard.html")}><Download size={16} /> Download storyboard</Button>{project.mode === "flipbook" && <Button variant="secondary" disabled={exporting || !supportedVideoType()} onClick={() => void exportVideo()}>{exporting ? "Making video…" : "Export video"}</Button>}{exporting && <Button variant="ghost" onClick={() => exportAbort.current?.abort()}>Cancel export</Button>}</div></section>
    </>}
    <p role="status" className="text-sm mb-4 min-h-6">{status}</p>
    <section><h2 className="font-display text-xl font-bold mb-3">Your collection</h2><div className="grid sm:grid-cols-2 gap-3">{state.creativeStudio?.projects.map((item) => <div key={item.id} className="glass-card p-4"><h3 className="font-bold break-words">{item.title}</h3><p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.visibility === "private" ? "Private" : "Shown in family summary"} · {MODES.find((mode) => mode.id === item.mode)?.label}</p><div className="flex gap-2 flex-wrap mt-3"><Button variant="secondary" onClick={() => { stopPreview(); setProject(structuredClone(item)); setFrameIndex(0); setPageIndex(0); setStoryPage(0); }}>Open</Button><Button variant="ghost" onClick={() => { if (window.confirm(`Remove ${item.title} from your saved collection?`)) setState((previous) => ({ ...previous, creativeStudio: { version: 1, draft: previous.creativeStudio?.draft, projects: (previous.creativeStudio?.projects ?? []).filter((old) => old.id !== item.id), deletedProjectIds: { ...previous.creativeStudio?.deletedProjectIds, [item.id]: new Date().toISOString() } } })); }}>Remove</Button></div></div>)}</div></section>
  </main>;
}
