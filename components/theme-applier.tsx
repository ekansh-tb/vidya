"use client";

import { useEffect } from "react";
export type ThemeId = "playful" | "vivid" | "terminal";
export type Appearance = "light" | "dark" | "system";

/** Legacy theme IDs remain compatible; appearance is an independent choice. */
export function ThemeApplier({ theme, appearance = "light" }: { theme: ThemeId; appearance?: Appearance }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.appearance = appearance === "system" ? (media.matches ? "dark" : "light") : appearance;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, appearance]);
  return null;
}
export function themeForGrade(grade: number | null): ThemeId {
  return grade === null || grade <= 5 ? "playful" : "vivid";
}
