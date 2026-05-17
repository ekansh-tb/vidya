"use client";

import { useEffect } from "react";

export type ThemeId = "playful" | "vivid" | "terminal";

/** Side-effect-only: sets data-theme on <html>. Renders nothing. */
export function ThemeApplier({ theme }: { theme: ThemeId }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

/** Default theme suggestion by grade band. Always overridable on the learner profile. */
export function themeForGrade(grade: number): ThemeId {
  if (grade <= 5) return "playful";   // Gen Alpha — Advika, primary
  if (grade <= 8) return "vivid";     // Class 6–8 — early teen
  return "terminal";                  // Class 9+ — Gen Z senior, Nevaan
}
