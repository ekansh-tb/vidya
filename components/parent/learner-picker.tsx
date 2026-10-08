"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { placementLabel } from "@/lib/learning/placement";
import type { LearnerProfile } from "@/lib/types";

/** Native modal semantics keep focus inside the sheet and restore its trigger. */
export function LearnerPicker({ learners, selectedId, onChange, onFeedback }: {
  learners: LearnerProfile[];
  selectedId: string;
  onChange: (id: string) => void;
  onFeedback: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dragStart = useRef<number | null>(null);
  const selected = learners.find(learner => learner.id === selectedId);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const sheet = dialog.current;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width };
    // Fixed-body locking also prevents background movement on mobile Safari.
    body.style.position = "fixed"; body.style.top = `-${scrollY}px`; body.style.width = "100%";
    sheet.showModal();
    return () => {
      sheet.close();
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [open]);

  return <div className="parent-learner-picker">
    <div className="parent-learner-desktop">
      <label htmlFor="parent-selected-learner">Viewing learner</label>
      <select id="parent-selected-learner" value={selectedId} onChange={event => onChange(event.target.value)}>
        {learners.map(learner => <option key={learner.id} value={learner.id}>{learner.name || "Unnamed learner"} · {placementLabel(learner)}</option>)}
      </select>
    </div>
    <button type="button" className="parent-learner-trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => { onFeedback(); setOpen(true); }}>
      <span><span className="parent-small">Viewing learner</span><strong>{selected?.name || "Choose a learner"}</strong><span className="parent-small">{selected && placementLabel(selected)}</span></span>
      <ChevronDown size={20} aria-hidden="true" />
    </button>
    <dialog ref={dialog} className="parent-learner-sheet" aria-labelledby="learner-sheet-title" onClose={() => setOpen(false)} onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="parent-sheet-content">
        <button type="button" className="parent-sheet-handle" aria-label="Close learner chooser" onClick={() => setOpen(false)}
          onPointerDown={event => { dragStart.current = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerUp={event => { if (dragStart.current !== null && event.clientY - dragStart.current > 50) setOpen(false); dragStart.current = null; }}
          onPointerCancel={() => { dragStart.current = null; }}><span /></button>
        <div className="parent-sheet-title"><h2 id="learner-sheet-title">Choose a learner</h2><button type="button" aria-label="Close" onClick={() => setOpen(false)}><X size={20} aria-hidden="true" /></button></div>
        <p>View their learning without changing their device.</p>
        <div className="parent-sheet-options">{learners.map(learner => <button type="button" key={learner.id} aria-pressed={learner.id === selectedId} onClick={() => { onFeedback(); onChange(learner.id); setOpen(false); }}>
          <span><strong>{learner.name || "Unnamed learner"}</strong><span className="parent-small">{placementLabel(learner)}</span></span>{learner.id === selectedId && <Check size={20} aria-hidden="true" />}
        </button>)}</div>
      </div>
    </dialog>
  </div>;
}
