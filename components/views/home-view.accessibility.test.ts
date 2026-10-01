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

describe("Home accessibility", () => {
  it("names header navigation without changing its destinations", () => {
    const { onNavigate, html } = render();
    for (const [label, destination] of [
      ["Settings", "settings"], ["Switch learner", "learners"],
      ["Open profile for Sample", "profile"], ["View 3-day streak and profile", "profile"],
    ]) {
      const button = controls.find((p) => p["aria-label"] === label);
      expect(button, label).toBeDefined();
      button!.onClick!();
      expect(onNavigate).toHaveBeenLastCalledWith(destination);
    }
    expect(html).toContain("button:focus-visible");
    for (const label of ["Settings", "Switch learner"]) {
      expect(controls.find((p) => p["aria-label"] === label)?.className).toContain("w-11 h-11 shrink-0");
    }
  });

  it("associates reflection prompt and privacy description with the textarea", () => {
    const { html } = render();
    const id = html.match(/<textarea[^>]* id="([^"]+)"/)?.[1];
    const description = html.match(/<textarea[^>]*aria-describedby="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`for="${id}"`);
    expect(html).toContain(`id="${description}"`);
    expect(html).toContain("What did you learn today?");
    const privacy = controls.find((p) => p["aria-label"] === "Keep reflection private");
    expect(privacy?.["aria-pressed"]).toBe(false);
    expect(privacy?.className).toContain("min-h-11");
    expect(html).toContain("focus-visible:outline-cyan-200");
  });

  it.each(["cambridge-primary", "cambridge-igcse"] as const)("removes local transforms and looping motion when reduced: %s", (board) => {
    reduced = true;
    render(board);
    expect(motions.length).toBeGreaterThan(10);
    for (const props of motions) {
      expect(props.whileTap).toBeUndefined();
      if (props.initial && typeof props.initial === "object") {
        expect(props.initial).not.toHaveProperty("y");
        expect(props.initial).not.toHaveProperty("scale");
        expect(props.initial).not.toHaveProperty("width");
      }
      expect(props.animate ?? {}).not.toHaveProperty("backgroundPosition");
    }
    for (const props of controls) {
      const classes = String(props.className).split(" ");
      expect(classes.some((c) => c.startsWith("active:scale"))).toBe(false);
    }
  });

  it("retains motion when no reduction is requested", () => {
    render();
    expect(motions.some((p) => p.whileTap !== undefined)).toBe(true);
    expect(motions.some((p) => p.animate && typeof p.animate === "object" && "backgroundPosition" in p.animate)).toBe(true);
  });
});
