import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { beforeEach, expect, it, vi } from "vitest";
import { DEFAULT_STATE } from "@/lib/game-store";
import type { GameState } from "@/lib/types";
import * as schoolSyllabus from "@/lib/content/school-syllabus";

// Use the existing SSR fixture approach without changing shared JSX configuration.
const require = createRequire(import.meta.url);
type Props = Record<string, unknown> & { children?: React.ReactNode; onClick?: () => void };
const runtime = require("react/jsx-runtime");
let controls: Props[] = [];
let motions: Props[] = [];
let reduced = false;
let openTopic: string | null | undefined;
const audio = { startMusic: vi.fn(), stopMusic: vi.fn(), sfx: { click: vi.fn() } };
const speech = { stopSpeaking: vi.fn() };

function load(file: string, syllabus = false) {
  const compiled = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports: Record<string, React.ComponentType<Record<string, unknown>>> = {};
  const capture = (method: "jsx" | "jsxs") => (kind: React.ElementType, props: Props, key?: string) => {
    if (kind === "button") controls.push(props);
    return runtime[method](kind, props, key);
  };
  new Function("require", "exports", compiled + (syllabus ? "\nexports.SyllabusSection = SyllabusSection;" : ""))((id: string) => {
    if (id === "react/jsx-runtime") return { ...runtime, jsx: capture("jsx"), jsxs: capture("jsxs") };
    // Persist just the syllabus disclosure state across manual SSR rerenders.
    if (id === "react" && syllabus) return { ...React, useState: (initial: string | null) => {
      if (openTopic === undefined) openTopic = initial;
      return [openTopic, (value: string | null) => { openTopic = value; }];
    } };
    if (id === "framer-motion") return { useReducedMotion: () => reduced, motion: {
      div: (props: Props) => {
        motions.push(props);
        const dom = { ...props };
        for (const key of ["initial", "animate", "exit"]) delete dom[key];
        return React.createElement("div", dom, props.children);
      },
    } };
    if (id === "@/lib/audio") return audio;
    if (id === "@/lib/speech") return speech;
    if (id === "@/lib/content/school-syllabus") return schoolSyllabus;
    if (id.startsWith("@/")) return {};
    if (id === "next/link") return { default: (props: Props) => React.createElement("a", props) };
    return require(id);
  }, exports);
  return exports;
}

const Settings = load("./settings-view.tsx").SettingsView;
const Syllabus = load("./exam-prep-view.tsx", true).SyllabusSection;
const pack = { subjectId: "maths", topics: [
  { id: "one", title: "First topic", syllabus: ["First checklist"], blurb: "First" },
  { id: "two", title: "Second topic", syllabus: ["Second checklist"], blurb: "Second" },
] };
function renderSyllabus(state = DEFAULT_STATE, setState: (update: (s: GameState) => GameState) => void = vi.fn()) {
  controls = [];
  motions = [];
  return renderToStaticMarkup(React.createElement(Syllabus, { pack, state, setState }));
}

beforeEach(() => {
  controls = [];
  motions = [];
  reduced = false;
  openTopic = undefined;
  vi.clearAllMocks();
});

it.each([
  ["Background music", "music"],
  ["Sound effects", "sound"],
  ["Spoken guidance", "voice"],
] as const)("keeps %s named, keyboard-native and at least 44px while toggling", (label, setting) => {
  let state: GameState = { ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings, [setting]: false } };
  const render = () => {
    controls = [];
    return renderToStaticMarkup(React.createElement(Settings, {
      state, setState: (update: (s: GameState) => GameState) => { state = update(state); }, onBack: vi.fn(),
    }));
  };
  for (const checked of [false, true]) {
    const html = render();
    const button = controls.find((p) => p["aria-label"] === label)!;
    expect(button.role).toBe("switch");
    expect(button.type).toBe("button");
    expect(button["aria-checked"]).toBe(checked);
    expect(button.className).toContain("w-12 min-h-11 shrink-0");
    expect(button.className).toContain("focus-visible:outline");
    expect(html).toContain('aria-hidden="true" class="relative block w-12 h-7');
    button.onClick!();
    expect(state.settings[setting]).toBe(!checked);
  }
  if (setting === "music") {
    expect(audio.startMusic).toHaveBeenCalledOnce();
    expect(audio.stopMusic).toHaveBeenCalledOnce();
  }
  if (setting === "voice") expect(speech.stopSpeaking).toHaveBeenCalledOnce();
});

it("keeps aria-expanded synchronized when closing, opening and switching topics", () => {
  const expanders = () => controls.filter((p) => "aria-expanded" in p);
  let html = renderSyllabus();
  expect(expanders().map((p) => p["aria-expanded"])).toEqual([true, false]);
  expect(html).toContain("First checklist");
  expect(html).not.toContain("Second checklist");
  expanders()[0].onClick!();
  html = renderSyllabus();
  expect(expanders().map((p) => p["aria-expanded"])).toEqual([false, false]);
  expect(html).not.toContain("First checklist");
  expanders()[1].onClick!();
  html = renderSyllabus();
  expect(expanders().map((p) => p["aria-expanded"])).toEqual([false, true]);
  expect(html).toContain("Second checklist");
  expanders()[0].onClick!();
  html = renderSyllabus();
  expect(expanders().map((p) => p["aria-expanded"])).toEqual([true, false]);
  expect(html).not.toContain("Second checklist");
  expect(expanders().every((p) => p.type === "button")).toBe(true);
});

it("announces the selected confidence after saving and keeps rating controls tappable", () => {
  let state = { ...DEFAULT_STATE, notebook: {} };
  const render = () => renderSyllabus(state, (update) => { state = update(state); });
  render();
  for (const rating of ["weak", "strong"]) {
    const button = controls.find((p) => p["aria-label"] === `${rating} confidence for First topic`)!;
    expect(button.type).toBe("button");
    expect(button.className).toContain("min-h-11 min-w-11");
    expect(button.className).toContain("focus-visible:outline");
    button.onClick!();
    render();
    const selected = controls.filter((p) => p["aria-pressed"] === true);
    expect(selected).toHaveLength(1);
    expect(selected[0]["aria-label"]).toBe(`${rating} confidence for First topic`);
  }
});

it.each([false, true])("respects reduced motion (%s) for topic expansion", (preference) => {
  reduced = preference;
  renderSyllabus();
  const panel = motions.find((p) => p.className === "overflow-hidden")!;
  expect(panel).toBeDefined();
  if (preference) {
    expect(panel.initial).toBe(false);
    expect(panel.animate).toEqual({ opacity: 1 });
    expect(panel.exit).toEqual({ opacity: 0 });
  } else {
    expect(panel.initial).toEqual({ opacity: 0, y: -4, height: 0 });
    expect(panel.animate).toEqual({ opacity: 1, y: 0, height: "auto" });
  }
  for (const button of controls.filter((p) => "aria-expanded" in p)) {
    expect(button.className).toContain("motion-safe:active:scale-[0.99]");
    expect(String(button.className).split(" ")).not.toContain("active:scale-[0.99]");
  }
});
