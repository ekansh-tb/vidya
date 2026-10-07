"use client";
import { useGameStore } from "@/lib/game-store";
/** Original SVG bird authored for Vidya. No external assets or hidden chat. */
export function LearningCompanion({ line, decorations = [], compact = false }: { line: string; decorations?: string[]; compact?: boolean }) {
  const visible = useGameStore(s => s.state.settings.companion !== false);
  if (!visible) return null;
  return <div className={`learning-companion ${compact ? "compact" : ""}`}>
    <svg viewBox="0 0 160 145" role="img" aria-label="Tara, an illustrated teal bird" width={compact ? 72 : 130}>
      <ellipse cx="80" cy="134" rx="42" ry="6" fill="#164b4915" />
      <path d="M48 100 L15 82 L25 112 L57 115" fill="#287f7b" stroke="#164b49" strokeWidth="3" strokeLinejoin="round" />
      <path d="M45 83 C43 114 65 128 88 126 C115 124 133 106 125 77 C121 62 111 51 100 48 C75 42 50 53 45 83Z" fill="#4aa99c" stroke="#164b49" strokeWidth="3" />
      <path d="M70 94 C57 98 63 120 86 122 C106 122 119 107 114 92" fill="#c7ecdb" />
      <path d="M55 81 C44 94 54 112 77 109 C83 105 87 95 85 87 C74 95 64 92 55 81Z" fill="#237b76" stroke="#164b49" strokeWidth="2" />
      <circle cx="100" cy="56" r="29" fill="#a9e0cf" stroke="#164b49" strokeWidth="3" />
      <path d="M125 57 L146 65 L125 74Z" fill="#f2ba56" stroke="#97611e" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="108" cy="53" r="4" fill="#164b49" /><circle cx="109" cy="52" r="1.3" fill="white" />
      <path d="M93 27 Q91 15 101 19 Q105 21 104 27" fill="#237b76" stroke="#164b49" strokeWidth="2" />
      <path d="M76 125 L74 135 L65 135 M98 125 L101 135 L110 135" fill="none" stroke="#97611e" strokeWidth="3" strokeLinecap="round" />
      {decorations.includes("scarf") && <path d="M77 79 Q100 88 123 76 L124 87 Q109 95 98 94 L94 110 L83 104 L88 92 Q79 91 73 88Z" fill="#e89578" stroke="#8e4c38" strokeWidth="1.5" />}
      {decorations.includes("leaf") && <path d="M91 30 Q73 10 91 13 Q110 16 91 30Z" fill="#b3d57a" stroke="#53753d" strokeWidth="1.5" />}
      {decorations.includes("star") && <path d="M134 21 L137 29 L146 30 L139 36 L141 45 L134 40 L126 45 L128 36 L122 30 L131 29Z" fill="#f2ba56" stroke="#97611e" />}
    </svg>
    <div className="tara-message"><strong>Tara</strong><span className="tara-decorations">{decorations.map(d => <span key={d} role="img" aria-label={`Tara decoration: ${d}`}>{({leaf:"🍃",scarf:"🧣",star:"⭐"})[d]}</span>)}</span><p>{line}</p></div>
  </div>;
}
