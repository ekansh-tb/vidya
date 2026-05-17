"use client";

import { useEffect, useState } from "react";

export function ParticleField() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = ["#22D3EE", "#A78BFA", "#F472B6", "#FBBF24", "#A3E635"];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 5,
        color: colors[i % colors.length],
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            opacity: 0.5 + Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  const colors = ["#22D3EE", "#A78BFA", "#F472B6", "#FBBF24", "#A3E635", "#FB7185"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${Math.random() * 100}%`,
            width: `${8 + Math.random() * 10}px`,
            height: `${12 + Math.random() * 10}px`,
            background: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            boxShadow: `0 0 8px ${colors[i % colors.length]}88`,
            animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ${Math.random() * 0.3}s ease-in forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
