"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { resolveLessonPoint } from "@/lib/learning/lesson-points";

export function LessonPointReader({ points, initialPointId, onChoose, language = "en" }: {
  points: { id: string; text: string }[];
  initialPointId?: string;
  onChoose: (id: string) => void;
  language?: "en" | "hi";
}) {
  const initial = resolveLessonPoint(points, initialPointId);
  const [index, setIndex] = useState(initial.index);
  const [moved, setMoved] = useState(false);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const hi = language === "hi";
  const choose = (next: number) => {
    if (next < 0 || next >= points.length || next === index) return;
    setIndex(next); setMoved(true); onChoose(points[next].id);
  };
  return <section aria-label={hi ? "सीखने का चरण" : "Learning point"}>
    {initial.changed && !moved && <p role="status" className="mb-3 text-sm text-[var(--text-muted)]">{hi ? "इस पाठ में बदलाव हुआ है। पहले चरण से फिर चुनें।" : "This lesson has changed. Choose a point from the updated lesson."}</p>}
    <div className="flex items-center justify-between gap-3">
      <p className="learning-eyebrow">{hi ? "एक विचार" : "One idea"}</p>
      <span className="text-sm tabular-nums text-[var(--text-muted)]">{index + 1} / {points.length}</span>
    </div>
    <div className="py-5 min-h-28" style={{ touchAction: "pan-y pinch-zoom" }}
      onPointerDown={event => { gesture.current = event.isPrimary && event.pointerType === "touch" ? { x: event.clientX, y: event.clientY, id: event.pointerId } : null; }}
      onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={event => {
        const start = gesture.current; gesture.current = null;
        if (!start || start.id !== event.pointerId || window.getSelection()?.toString()) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) choose(index + (dx < 0 ? 1 : -1));
      }}>
      <p aria-live="polite" aria-atomic="true" className="text-lg leading-relaxed text-[var(--text)] break-words">{points[index]?.text}</p>
    </div>
    {points.length > 1 && <div className="flex justify-between gap-3">
      <button type="button" disabled={index === 0} onClick={() => choose(index - 1)} className="min-h-11 px-3 rounded-xl inline-flex items-center gap-1 disabled:opacity-40 border border-[var(--border)]"><ChevronLeft size={18} aria-hidden="true"/>{hi ? "पिछला" : "Previous"}</button>
      <button type="button" disabled={index === points.length - 1} onClick={() => choose(index + 1)} className="learning-primary min-h-11 inline-flex items-center gap-1 disabled:opacity-40">{hi ? "अगला" : "Next idea"}<ChevronRight size={18} aria-hidden="true"/></button>
    </div>}
    {points.length > 1 && <details className="mt-3">
      <summary className="min-h-11 py-3 cursor-pointer text-sm font-semibold"><List size={16} aria-hidden="true" className="inline mr-2"/>{hi ? "सभी चरण" : "Choose a learning point"}</summary>
      <ol className="space-y-1">{points.map((point, i) => <li key={point.id}><button type="button" aria-current={i === index ? "step" : undefined} onClick={event => { choose(i); event.currentTarget.closest("details")?.removeAttribute("open"); }} className="min-h-11 w-full text-left flex gap-3 py-3 px-2 rounded-lg hover:bg-[var(--accent-soft)]" style={{ color: i === index ? "var(--accent)" : "var(--text-muted)" }}><span className="tabular-nums shrink-0">{i + 1}.</span><span>{point.text}</span></button></li>)}</ol>
    </details>}
  </section>;
}
