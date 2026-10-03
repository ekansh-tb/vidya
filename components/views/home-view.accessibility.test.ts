import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_STATE } from "@/lib/game-store";
import type { GameState, LearnerProfile, ViewName } from "@/lib/types";

// Match the existing subject-picker render fixture without changing shared JSX config.
const require = createRequire(import.meta.url);
type Props = Record<string, unknown> & { children?: React.ReactNode; onClick?: () => void };
let reduced = false;
let controls: Props[] = [];
let motions: Props[] = [];
const runtime = require("react/jsx-runtime");
const jsx = (kind: React.ElementType, props: Props, key?: string) => {
  if (kind === "button") controls.push(props);
  return runtime.jsx(kind, props, key);
};
const jsxs = (kind: React.ElementType, props: Props, key?: string) => {
  if (kind === "button") controls.push(props);
  return runtime.jsxs(kind, props, key);
};
const motion = Object.fromEntries(["button", "div"].map((tag) => [tag, (props: Props) => {
  motions.push(props);
  if (tag === "button") controls.push(props);
  const dom = { ...props };
  for (const key of ["initial", "animate", "transition", "whileTap"]) delete dom[key];
  return React.createElement(tag, dom, props.children);
}]));
const subject = { id: "maths", name: "Maths", icon: () => null, accent: "#FBBF24", soft: "transparent", glow: "transparent" };
const compiled = ts.transpileModule(readFileSync(new URL("./home-view.tsx", import.meta.url), "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports: { HomeView?: React.ComponentType<{
  state: GameState; learner: LearnerProfile; onNavigate: (v: ViewName, params?: Record<string, unknown>) => void;
}> } = {};
new Function("require", "exports", compiled)((id: string) => {
  if (id === "react/jsx-runtime") return { ...runtime, jsx, jsxs };
  if (id === "framer-motion") return { motion, useReducedMotion: () => reduced };
  if (id === "@/lib/game-store") return { useGameStore: (select: (s: object) => unknown) => select({ updateLearnerMeta: vi.fn(), set: vi.fn() }) };
  if (id === "@/lib/audio") return { sfx: { click: vi.fn(), coin: vi.fn() } };
  if (id === "@/lib/capabilities/use-capability") return { useCapability: () => ({ allowed: true }) };
  if (id === "@/lib/content/subjects") return { subjectsForLearner: () => [subject] };
  if (id === "@/lib/content/questions/availability") return { questionsForLearner: () => ({ maths: { counting: {} } }) };
  if (id === "@/lib/content/packs/pack-index") return { hasPack: () => true };
  if (id === "@/lib/adaptive/recommendation") return { recommendNextQuest: () => ({ kind: "unavailable" }) };
  if (id === "@/lib/school-day") return {
    currentPeriod: () => ({ id: "lesson", name: "Maths", subjectId: "maths" }),
    nextPeriod: () => null, periodProgress: () => 0.5,
  };
  if (id === "@/lib/economy") return { xpToLevel: () => ({ level: 1, xpInLevel: 0, xpNeeded: 100 }) };
  if (id === "@/lib/learning/activity") return { companionUnlocks: () => [] };
  if (id === "@/lib/utils") return { todayKey: () => "2026-10-01" };
  if (id.startsWith("@/components/")) return new Proxy({}, { get: () => () => null });
  return require(id);
}, exports);

function render(board: LearnerProfile["board"] = "cambridge-primary") {
  const onNavigate = vi.fn();
  const state = { ...DEFAULT_STATE, name: "Sample", streak: 3, lastSubjectId: "maths" as const };
  const learner: LearnerProfile = {
    id: "synthetic", name: "Sample", board, grade: 5,
    pickedSubjects: board === "cambridge-igcse" ? ["igcse-cs"] : ["maths"],
    familyNote: { body: "Synthetic encouragement", postedAt: "2026-10-01T00:00:00Z" },
    upcomingExams: [{ id: "synthetic-exam", title: "Practice", date: "2026-10-02", subjectId: "maths" }],
    createdAt: "2026-10-01T00:00:00Z",
    state,
  };
  const html = renderToStaticMarkup(React.createElement(exports.HomeView!, { state, learner, onNavigate }));
  return { html, onNavigate };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 1, 18));
  controls = [];
  motions = [];
  reduced = false;
});
afterEach(() => vi.useRealTimers());

describe("Learning navigation", () => {
  it("provides named header controls and one active navigation destination", () => {
    const { onNavigate, html } = render();
    for (const [label, destination] of [["Settings", "settings"], ["Switch learner", "learners"], ["Open profile for Sample", "profile"]]) {
      const button = controls.find((p) => p["aria-label"] === label);
      expect(button, label).toBeDefined(); button!.onClick!();
      expect(onNavigate).toHaveBeenLastCalledWith(destination);
    }
    expect(html).toContain('aria-label="Learning navigation"');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toContain("Curriculum practice for this grade is not ready yet");
    expect(html).not.toContain("% mastered");
    expect(html).not.toContain("Power-ups");
  });
  it("moves to the selected section without selecting another curriculum", () => {
    const { onNavigate } = render();
    const explore = controls.find((p) => p.children && Array.isArray(p.children) && JSON.stringify(p.children).includes("Explore"));
    expect(explore).toBeDefined(); explore!.onClick!();
    expect(onNavigate).toHaveBeenLastCalledWith("activities");
  });
});
