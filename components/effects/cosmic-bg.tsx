"use client";

import { useEffect, useMemo, useState } from "react";

export type CosmicMode = "alpha" | "z" | "parent";

/** Pick a cosmic background mode from a learner grade. Parent contexts pass "parent" explicitly. */
export function cosmicModeForGrade(grade: number | undefined): CosmicMode {
  if (grade == null) return "alpha";
  return grade <= 5 ? "alpha" : "z";
}

/**
 * Generation-tuned background animation.
 *
 *  alpha  — Gen Alpha / kids ≤ Grade 5
 *           Warm spaceship gliding through friendly planets and big twinkly stars.
 *           Characterful, playful, sun-gold + magenta. SAFE FOR KIDS — no scary motifs.
 *
 *  z      — Gen Z / kids Grades 6–12
 *           Sleek hyperspace warp. Neon grid lines, no characters, geometric.
 *           Cyan + violet, slightly cyberpunk, fast.
 *
 *  parent — adults
 *           Cinematic deep-space drift. Slow nebula, distant galaxy, contemplative.
 *           Indigo + amber. NO cartoons, NO memes, NO faces. Adult.
 *
 * Background music stays default off (see [[music-default-off]] memory).
 * Respects prefers-reduced-motion — animations freeze on a still frame.
 */
export function CosmicBg({
  mode,
  intensity = 1,
}: {
  mode: CosmicMode;
  /** 0 = subtle (use behind dense content), 1 = full (default), 1.5 = showcase */
  intensity?: number;
}) {
  // Generate stars only client-side so SSR/CSR markup matches (deterministic seed).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(() => makeStars(mode), [mode]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: BG[mode] }}
    >
      {/* Static gradient veil — always present, no animation */}
      <div className="absolute inset-0" style={{ background: VEIL[mode], opacity: 0.55 * intensity }} />

      {/* Animated layers — only mount client-side to keep SSR deterministic */}
      {mounted && (
        <>
          {mode === "alpha" && <AlphaScene intensity={intensity} />}
          {mode === "z" && <ZScene intensity={intensity} />}
          {mode === "parent" && <ParentScene intensity={intensity} />}
          <Starfield stars={stars} />
        </>
      )}

      <style jsx>{globalCss}</style>
    </div>
  );
}

// ── Backgrounds per mode ────────────────────────────────────────────
const BG: Record<CosmicMode, string> = {
  alpha:  "radial-gradient(ellipse at 30% 20%, #2a124e 0%, #0c0420 50%, #050010 100%)",
  z:      "radial-gradient(ellipse at 50% 50%, #0c1330 0%, #050918 60%, #02030d 100%)",
  parent: "radial-gradient(ellipse at 50% 60%, #0d0a1c 0%, #060514 55%, #000 100%)",
};

const VEIL: Record<CosmicMode, string> = {
  alpha:  "linear-gradient(180deg, rgba(244, 114, 182, 0.10) 0%, transparent 60%)",
  z:      "linear-gradient(180deg, transparent 0%, rgba(34, 211, 238, 0.07) 100%)",
  parent: "linear-gradient(180deg, transparent 0%, rgba(167, 139, 250, 0.06) 100%)",
};

// ── α : Spaceship through friendly universe ─────────────────────────
function AlphaScene({ intensity }: { intensity: number }) {
  return (
    <>
      {/* Three friendly planets drifting */}
      <div
        className="absolute rounded-full alpha-planet"
        style={{
          width: 240, height: 240, top: "12%", right: "-60px",
          background: "radial-gradient(circle at 30% 30%, #fbbf24, #d97706 55%, #7c2d12)",
          opacity: 0.85 * intensity,
          boxShadow: "0 0 80px rgba(251, 191, 36, 0.45)",
          animation: "alpha-drift-a 35s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full alpha-planet"
        style={{
          width: 140, height: 140, bottom: "8%", left: "-30px",
          background: "radial-gradient(circle at 35% 30%, #f472b6, #a21caf 60%, #4c1d95)",
          opacity: 0.75 * intensity,
          boxShadow: "0 0 60px rgba(244, 114, 182, 0.45)",
          animation: "alpha-drift-b 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 80, height: 80, top: "60%", right: "20%",
          background: "radial-gradient(circle at 30% 30%, #67e8f9, #06b6d4 60%, #0e7490)",
          opacity: 0.7 * intensity,
          boxShadow: "0 0 40px rgba(103, 232, 249, 0.55)",
          animation: "alpha-drift-c 22s ease-in-out infinite",
        }}
      />

      {/* The spaceship — a stylised SVG craft traveling left-to-right with a trail */}
      <div
        className="absolute"
        style={{
          top: "45%", left: "-200px",
          animation: "alpha-ship 38s linear infinite",
          opacity: 0.95 * intensity,
        }}
      >
        <svg width="180" height="64" viewBox="0 0 180 64" xmlns="http://www.w3.org/2000/svg">
          {/* trail */}
          <defs>
            <linearGradient id="trail" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0" />
              <stop offset="50%" stopColor="#f472b6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="shipBody" cx="35%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          <path d="M 10 32 Q 60 28, 120 32 T 145 32" stroke="url(#trail)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* hull */}
          <ellipse cx="148" cy="32" rx="22" ry="11" fill="url(#shipBody)" stroke="#fde68a" strokeWidth="0.6" />
          {/* cockpit */}
          <ellipse cx="155" cy="28" rx="7" ry="4.5" fill="#67e8f9" opacity="0.85" />
          {/* fin */}
          <path d="M 138 26 L 132 18 L 145 24 Z" fill="#f472b6" />
        </svg>
      </div>

      {/* Soft aurora ribbon */}
      <div
        className="absolute"
        style={{
          left: "-20%", top: "70%", width: "140%", height: "180px",
          background: "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "alpha-aurora 18s ease-in-out infinite",
        }}
      />
    </>
  );
}

// ── Z : Hyperspace warp ─────────────────────────────────────────────
function ZScene({ intensity }: { intensity: number }) {
  // 14 radial streaks at angles, animating outward
  const streaks = Array.from({ length: 14 }, (_, i) => i);
  return (
    <>
      {/* Center vanishing point */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "radial-gradient(circle, #fff 0%, rgba(34, 211, 238, 0.6) 50%, transparent 100%)",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
          opacity: intensity,
        }}
      />
      {/* Warp streaks */}
      {streaks.map((i) => {
        const angle = (i / streaks.length) * 360;
        const delay = (i * 0.18) % 2.5;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 z-streak"
            style={{
              width: 2, height: 380,
              background: "linear-gradient(180deg, transparent 0%, #22d3ee 45%, #a78bfa 80%, transparent 100%)",
              transformOrigin: "50% 0",
              transform: `translate(-50%, 0) rotate(${angle}deg)`,
              animationDelay: `${delay}s`,
              opacity: 0.75 * intensity,
            }}
          />
        );
      })}
      {/* Grid horizon — subtle perspective lines at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "32%",
          background: `repeating-linear-gradient(90deg, transparent 0px, transparent 70px, rgba(34, 211, 238, 0.18) 70px, rgba(34, 211, 238, 0.18) 71px),
                       repeating-linear-gradient(180deg, transparent 0px, transparent 70px, rgba(167, 139, 250, 0.15) 70px, rgba(167, 139, 250, 0.15) 71px)`,
          maskImage: "linear-gradient(180deg, transparent 0%, #000 80%)",
          opacity: 0.45 * intensity,
        }}
      />
    </>
  );
}

// ── Parent : Cinematic drift ────────────────────────────────────────
function ParentScene({ intensity }: { intensity: number }) {
  return (
    <>
      {/* Distant galaxy */}
      <div
        className="absolute parent-galaxy"
        style={{
          width: 460, height: 460, top: "8%", right: "-160px",
          background: "radial-gradient(ellipse at center, rgba(252, 211, 77, 0.25) 0%, rgba(167, 139, 250, 0.18) 30%, transparent 70%)",
          filter: "blur(8px)",
          opacity: 0.85 * intensity,
        }}
      />
      {/* Drifting nebula */}
      <div
        className="absolute parent-nebula"
        style={{
          width: 700, height: 380, bottom: "-80px", left: "-120px",
          background: "radial-gradient(ellipse at center, rgba(217, 70, 239, 0.16) 0%, rgba(99, 102, 241, 0.12) 35%, transparent 75%)",
          filter: "blur(30px)",
          opacity: 0.9 * intensity,
          animation: "parent-drift 90s ease-in-out infinite",
        }}
      />
      {/* Slow vignette pulse — barely perceptible */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)",
          animation: "parent-vignette 16s ease-in-out infinite",
          opacity: 0.6 * intensity,
        }}
      />
    </>
  );
}

// ── Shared starfield ────────────────────────────────────────────────
function Starfield({ stars }: { stars: Star[] }) {
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.colour,
            opacity: s.baseOpacity,
            animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

type Star = { x: number; y: number; size: number; colour: string; baseOpacity: number; twinkleDuration: number; delay: number };

function makeStars(mode: CosmicMode): Star[] {
  // Deterministic pseudo-random so SSR/CSR match without flicker.
  const seed = mode === "alpha" ? 41 : mode === "z" ? 67 : 89;
  const count = mode === "alpha" ? 70 : mode === "z" ? 40 : 110;
  const palette: Record<CosmicMode, string[]> = {
    alpha:  ["#fff", "#fde68a", "#f9a8d4", "#a5b4fc"],
    z:      ["#fff", "#67e8f9", "#a78bfa"],
    parent: ["#fff", "#fde68a", "#c4b5fd"],
  };
  const out: Star[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.6 + rand() * (mode === "z" ? 1.4 : 2.2),
      colour: palette[mode][Math.floor(rand() * palette[mode].length)],
      baseOpacity: 0.35 + rand() * 0.5,
      twinkleDuration: 2 + rand() * 5,
      delay: rand() * 4,
    });
  }
  return out;
}

// ── Animations (CSS, scoped via styled-jsx) ─────────────────────────
const globalCss = `
  @keyframes twinkle {
    0%, 100% { opacity: var(--start, 0.35); transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.4); }
  }

  /* α ship glide */
  @keyframes alpha-ship {
    0%   { transform: translateX(0)        translateY(0)   rotate(-2deg); }
    25%  { transform: translateX(35vw)     translateY(-12px) rotate(2deg); }
    50%  { transform: translateX(65vw)     translateY(8px)  rotate(-1deg); }
    75%  { transform: translateX(90vw)     translateY(-6px) rotate(3deg); }
    100% { transform: translateX(120vw)    translateY(0)    rotate(0deg); }
  }
  @keyframes alpha-drift-a {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(-20px, 12px); }
  }
  @keyframes alpha-drift-b {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50%      { transform: translate(18px, -10px) rotate(8deg); }
  }
  @keyframes alpha-drift-c {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(14px, 18px); }
  }
  @keyframes alpha-aurora {
    0%, 100% { transform: translateX(0)   scaleY(1); opacity: 0.6; }
    50%      { transform: translateX(40px) scaleY(1.15); opacity: 1; }
  }

  /* Z hyperspace */
  .z-streak {
    animation: z-warp 1.8s cubic-bezier(0.4, 0, 0.7, 1) infinite;
  }
  @keyframes z-warp {
    0%   { height: 20px;  opacity: 0;    transform-origin: 50% 0; transform: translate(-50%, 0) rotate(var(--angle, 0deg)) scaleY(0.2); }
    20%  { opacity: 0.9; }
    100% { height: 520px; opacity: 0;    transform: translate(-50%, 0) rotate(var(--angle, 0deg)) scaleY(1); }
  }

  /* Parent drift */
  @keyframes parent-drift {
    0%, 100% { transform: translate(0, 0)   scale(1); }
    50%      { transform: translate(80px, -20px) scale(1.05); }
  }
  @keyframes parent-vignette {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 0.7;  }
  }

  /* Accessibility — respect users who want less motion */
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
  }
`;
