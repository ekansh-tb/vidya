"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, Minus, Plus, Shapes } from "lucide-react";
import { graphValue, labValues, visualLabFor } from "@/lib/learning/visual-lab";
import type { GameState, LearnerProfile } from "@/lib/types";
import { speakFromGesture } from "@/lib/speech";
import styles from "./visual-lab-view.module.css";

export function VisualLabView({ learner, state, setState, onBack }: {
  learner: LearnerProfile; state: GameState; setState: (update: (state: GameState) => GameState) => void; onBack: () => void;
}) {
  const lab = visualLabFor(learner);
  const hi = learner.learningLanguage === "hi";
  return <main className={styles.page} data-calm={state.settings.motion === false} lang={hi ? "hi" : "en"}>
    <button type="button" onClick={onBack} className={styles.back}><ArrowLeft size={18} aria-hidden="true"/>{hi ? "वापस चलो" : "Back to learning"}</button>
    {!lab ? <p role="status">{hi ? "पहले सीखने का स्तर चुनो।" : "Choose a learning level first."}</p> : <Lab key={`${learner.id}:${lab.id}:${lab.placementKey}`} lab={lab} learner={learner} state={state} setState={setState}/>}
  </main>;
}

function Lab({ lab, learner, state, setState }: { lab: NonNullable<ReturnType<typeof visualLabFor>>; learner: LearnerProfile; state: GameState; setState: (update: (state: GameState) => GameState) => void }) {
  const [values, setValues] = useState(() => labValues(lab, state.visualLab));
  const { a, b, c } = values;
  const hi = learner.learningLanguage === "hi";
  const graph = ["line", "quadratic", "wave", "tangent"].includes(lab.model);
  const change = (update: Partial<typeof values>) => {
    const normalized = labValues(lab, { version: 1, id: lab.id, placementKey: lab.placementKey, ...values, ...update, updatedAt: new Date().toISOString() });
    setValues(normalized);
    setState(current => ({ ...current, visualLab: { version: 1, id: lab.id, placementKey: lab.placementKey, ...normalized, updatedAt: new Date().toISOString() } }));
  };
  const range = (label: string, key: keyof typeof values, min: number, max: number) => <label className={styles.control}><span>{label}<output>{values[key]}</output></span><input aria-label={label} type="range" min={min} max={max} step={1} value={values[key]} onChange={e => change({ [key]: Number(e.target.value) })}/></label>;
  const counter = (label: string, value: number, min: number, max: number, key: keyof typeof values) => <div className={styles.counter}><button type="button" aria-label={hi ? "एक कम करो" : "Take one away"} disabled={value <= min} onClick={() => change({ [key]: value - 1 })}><Minus size={20}/></button><output aria-live="polite"><strong>{value}</strong><span>{label}</span></output><button type="button" aria-label={hi ? "एक जोड़ो" : "Add one"} disabled={value >= max} onClick={() => change({ [key]: value + 1 })}><Plus size={20}/></button></div>;
  const cells = (total: number, filled: number, columns: number, shape = "circle") => <div className={styles.cells} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden="true">{Array.from({ length: total }, (_, i) => <span key={i} className={styles.cell} data-filled={i < filled} data-shape={shape}/>)}</div>;
  const formula = lab.model === "line" ? `y = ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : lab.model === "quadratic" ? `y = ${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : lab.model === "wave" ? `y = ${a} sin(${b}x)` : `y = x², x = ${a}, ${hi ? "ढलान" : "slope"} = ${2 * a}`;
  return <>
    <header className={styles.heading}><Shapes aria-hidden="true" size={24}/><p>{hi ? "देखो और बदलो" : "See what changes"}</p><h1>{lab.title[hi ? 1 : 0]}</h1><p>{lab.prompt[hi ? 1 : 0]}</p>
      {learner.placement?.kind === "early-years" && <button type="button" className={styles.read} onClick={() => speakFromGesture(lab.prompt[hi ? 1 : 0], { lang: hi ? "hi-IN" : "en-IN", rate: .85 })}>{hi ? "सुनो" : "Read aloud"}</button>}
    </header>
    <section className={styles.workbench} aria-label={lab.title[hi ? 1 : 0]}>
      {lab.model === "count" && <>{counter(hi ? "बीज" : "seeds", a, 0, lab.max, "a")}<div className={styles.countFrame} role="img" aria-label={`${a} ${hi ? "बीज," : "seeds,"} ${lab.max - a} ${hi ? "खाली खाने" : "empty spaces"}`}>{cells(lab.max, a, lab.max <= 5 ? lab.max : 5)}</div><p className={styles.result}>{hi ? `${a} भरे + ${lab.max - a} खाली = ${lab.max} खाने` : `${a} filled + ${lab.max - a} empty = ${lab.max} spaces`}</p></>}
      {lab.model === "array" && <><div className={styles.controls}>{range(hi ? "कतारें" : "Rows", "a", 1, lab.max)}{range(hi ? "स्तंभ" : "Columns", "b", 1, lab.max)}</div><div className={styles.countFrame} role="img" aria-label={`${a} × ${b} = ${a * b}`}>{cells(a * b, a * b, b)}</div><p className={styles.result} aria-live="polite">{a} × {b} = {a * b}</p></>}
      {["fraction", "equivalent"].includes(lab.model) && <><div className={styles.controls}>{range(hi ? "बराबर हिस्से" : "Equal parts", "b", 2, lab.max)}{range(hi ? "रंगे हिस्से" : "Shaded parts", "a", 0, b)}</div><div className={styles.fraction} role="img" aria-label={`${a} / ${b}`} style={{ gridTemplateColumns: `repeat(${b},1fr)` }}>{Array.from({ length: b }, (_, i) => <span key={i} data-filled={i < a}/>)}</div><p className={styles.result} aria-live="polite">{a}/{b}{lab.model === "equivalent" ? ` = ${a * c}/${b * c}` : ""}</p>{lab.model === "equivalent" && <>{range(hi ? "हर हिस्से को बाँटो" : "Split each part into", "c", 1, 3)}<div className={styles.fraction} role="img" aria-label={`${a * c} / ${b * c}`} style={{ gridTemplateColumns: `repeat(${b * c},1fr)` }}>{Array.from({ length: b * c }, (_, i) => <span key={i} data-filled={i < a * c}/>)}</div></>}</>}
      {lab.model === "ratio" && <><div className={styles.controls}>{range(hi ? "वृत्त" : "Circles", "a", 1, lab.max)}{range(hi ? "वर्ग" : "Squares", "b", 1, lab.max)}</div>{range(hi ? "दोनों समूह बढ़ाओ" : "Scale both groups by", "c", 1, 3)}<div className={styles.groups}><div role="img" aria-label={`${a * c} circles`}>{cells(a * c, a * c, Math.min(6, a * c))}</div><div role="img" aria-label={`${b * c} squares`}>{cells(b * c, b * c, Math.min(6, b * c), "square")}</div></div><p className={styles.result} aria-live="polite">{a} : {b} = {a * c} : {b * c}</p></>}
      {lab.model === "percent" && <>{range(hi ? "प्रतिशत" : "Percent", "a", 0, 100)}<div className={styles.hundred} role="img" aria-label={`${a} ${hi ? "खाने रंगे, कुल 100" : "of 100 squares shaded"}`}>{cells(100, a, 10, "square")}</div><p className={styles.result} aria-live="polite">{a}% = {a}/100 = {(a / 100).toFixed(2)}</p></>}
      {graph && <><p className={styles.formula} aria-live="polite">{formula}</p><Graph lab={lab} a={a} b={b}/><div className={styles.controls}>{lab.model === "tangent" ? range(hi ? "बिंदु x" : "Point x", "a", -3, 3) : <>{range(lab.model === "wave" ? hi ? "आयाम" : "Amplitude" : "a", "a", lab.model === "wave" ? 1 : -lab.max, lab.max)}{range(lab.model === "wave" ? hi ? "आवृत्ति गुणक" : "Frequency multiplier" : "b", "b", lab.model === "wave" ? 1 : -4, lab.model === "wave" ? 3 : 4)}</>}</div>{lab.model === "wave" && <p className={styles.caption}>{hi ? "x रेडियन में है।" : "x is measured in radians."}</p>}</>}
    </section>
    <p className={styles.caption}>{hi ? "यह सामान्य खोज है, आपके स्कूल के पाठ्यक्रम या समझ का आकलन नहीं। बदलाव अपने आप सहेजे जाते हैं।" : "General exploration, not a school curriculum or an assessment. Your changes save automatically."}</p>
  </>;
}

function Graph({ lab, a, b }: { lab: NonNullable<ReturnType<typeof visualLabFor>>; a: number; b: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const clip = useId();
  useEffect(() => { const el = root.current; if (!el) return; const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width)); observer.observe(el); return () => observer.disconnect(); }, []);
  const height = 260, pad = 30, x = (value: number) => pad + (value + 5) / 10 * (width - pad * 2), y = (value: number) => height - pad - (value + 10) / 20 * (height - pad * 2);
  const path = Array.from({ length: 201 }, (_, i) => { const value = -5 + i / 20; return `${i ? "L" : "M"}${x(value)},${y(graphValue(lab.model, value, a, b))}`; }).join(" ");
  return <div ref={root} className={styles.graph}><svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={lab.model === "tangent" ? `Curve y equals x squared. Tangent at x ${a}, slope ${2 * a}.` : `Graph with a ${a} and b ${b}. x from minus 5 to 5, y from minus 10 to 10.`}>
    <defs><clipPath id={clip}><rect x={pad} y={pad} width={Math.max(1, width - 2 * pad)} height={height - 2 * pad}/></clipPath></defs>
    {[-10, -5, 0, 5, 10].map(value => <g key={value}><line x1={pad} x2={width - pad} y1={y(value)} y2={y(value)} stroke="var(--border)"/><text x={pad - 5} y={y(value) + 4} textAnchor="end" fill="var(--text-muted)" fontSize={12}>{value}</text></g>)}
    {[-5, 0, 5].map(value => <text key={value} x={x(value)} y={height - 10} fill="var(--text-muted)" fontSize={12} textAnchor="middle">{value}</text>)}
    <line x1={x(0)} x2={x(0)} y1={pad} y2={height - pad} stroke="var(--text-muted)"/><line x1={pad} x2={width - pad} y1={y(0)} y2={y(0)} stroke="var(--text-muted)"/>
    <text x={width - 15} y={y(0) + 4} fill="var(--text)" fontSize={14}>x</text><text x={x(0) + 8} y={18} fill="var(--text)" fontSize={14}>y</text>
    <g clipPath={`url(#${clip})`}><path d={path} stroke="var(--accent)" strokeWidth={3} fill="none"/>{lab.model === "tangent" && <><line x1={x(-5)} x2={x(5)} y1={y(2 * a * -5 - a * a)} y2={y(2 * a * 5 - a * a)} stroke="var(--text)" strokeWidth={2} strokeDasharray="6 4"/><circle cx={x(a)} cy={y(a * a)} r={5} fill="var(--text)"/></>}</g>
  </svg></div>;
}
