"use client";
import { TaraScene } from "@/components/learning/tara-scene";
/** Original authored companion. No AI, external art, or hidden chat. */
export function LearningCompanion({ line, decorations = [], compact = false }: { line: string; decorations?: string[]; compact?: boolean }) {
  return <div className={`learning-companion ${compact ? "compact" : ""}`}>
    <TaraScene><svg viewBox="0 0 150 140" role="img" aria-label="Tara, your learning companion" width={compact ? 72 : 130}>
      <ellipse cx="75" cy="124" rx="43" ry="8" fill="#164b4920" />
      <path d="M73 90 Q5 70 22 25 Q50 8 70 58 Q62 8 98 12 Q127 37 90 90" fill="#71c6ad" stroke="#145955" strokeWidth="3" />
      <path d="M28 28 Q53 30 64 72 M94 18 Q82 42 83 76" fill="none" stroke="#145955" strokeWidth="4" />
      <ellipse cx="76" cy="93" rx="33" ry="32" fill="#148884" stroke="#145955" strokeWidth="3" />
      <circle cx="83" cy="62" r="27" fill="#a8e1cb" stroke="#145955" strokeWidth="3" />
      <circle cx="74" cy="59" r="3" fill="#164b49" /><circle cx="92" cy="59" r="3" fill="#164b49" />
      <path d="M80 69 Q85 76 90 68" stroke="#164b49" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M99 62 L111 68 L99 73" fill="#f3be5a" /><path d="M66 122 L60 130 M88 122 L94 130" stroke="#164b49" strokeWidth="4" strokeLinecap="round" />
      {decorations.includes("scarf") && <path d="M61 83 Q83 94 104 81 L99 92 Q81 102 60 93Z" fill="#ef987d" />}
      {decorations.includes("leaf") && <path d="M72 34 Q47 8 70 14 Q88 22 72 34" fill="#b9d86f" />}
      {decorations.includes("star") && <text x="105" y="30" fontSize="25">✦</text>}
    </svg></TaraScene>
    <div className="tara-message"><strong>Tara</strong><span className="tara-decorations">{decorations.map(d=><span key={d} role="img" aria-label={`Tara decoration: ${d}`}>{({leaf:"🍃",scarf:"🧣",star:"⭐"})[d]}</span>)}</span><p aria-live="polite">{line}</p></div>
  </div>;
}
