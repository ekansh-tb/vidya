"use client";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
export function CompanionCelebration() {
  const reduced=useReducedMotion();const motion=useGameStore(s=>s.state.settings.motion);
  const [failed,fail]=useState(false);
  if(reduced || motion===false || failed) return null;
  return <video className="companion-celebration" src="/learning/tara-celebration.mp4" poster="/learning/tara-celebration-poster.jpg" autoPlay muted playsInline aria-hidden="true" onError={()=>fail(true)}/>;
}
