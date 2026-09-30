import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import type { LearnerProfile, SubjectId } from "@/lib/types";
import * as subjects from "@/lib/content/subjects";
import * as boards from "@/lib/content/boards";

// The repository's Vitest configuration preserves JSX. Compile this focused
// render fixture without changing the shared configuration or app build.
const require = createRequire(import.meta.url);
let saveAction: (() => void) | undefined;
const compiled = ts.transpileModule(readFileSync(new URL("./subject-picker-view.tsx", import.meta.url), "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports: { SubjectPickerView?: React.ComponentType<{ learner: LearnerProfile; onSave: (ids: SubjectId[]) => void }> } = {};
new Function("require", "exports", compiled)((id: string) => {
  if (id === "@/lib/content/subjects") return subjects;
  if (id === "@/lib/content/boards") return boards;
  if (id === "@/lib/audio") return { sfx: { click: vi.fn() } };
  if (id === "@/components/ui/button") return {
    Button: ({ children, disabled, onClick }: React.PropsWithChildren<{ disabled?: boolean; onClick?: () => void }>) => {
      saveAction = onClick;
      return React.createElement("button", { disabled }, children);
    },
  };
  return require(id);
}, exports);
const SubjectPickerView = exports.SubjectPickerView!;

function renderPicker(pickedSubjects: SubjectId[] = [], grade = 6, school?: string, onSave = vi.fn()) {
  const learner = { name: "Learner", board: "cambridge-lower-secondary", grade, school, pickedSubjects } as LearnerProfile;
  return renderToStaticMarkup(React.createElement(SubjectPickerView, { learner, onSave }));
}

describe("generic subject picker", () => {
  it("renders no presumed mandates or locked subjects without school context", () => {
    const html = renderPicker();
    expect(html).not.toMatch(/Maharashtra|CNS|mandated|Min 6|ICE award/);
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).toContain("Choose at least one to start");
    // The only disabled button is the empty-selection save action.
    expect(html.match(/disabled=""/g)).toHaveLength(1);
  });

  it("allows saving one explicit choice without adding school-specific subjects", () => {
    const html = renderPicker(["cls-maths"]);
    expect(html).not.toContain('disabled=""');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it("keeps saved choices visible and selected even outside the grade catalog", () => {
    const html = renderPicker(["cls-physics", "cls-marathi", "cls-art"]);
    expect(html).toContain("Previously selected");
    expect(html).toContain("Physics");
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(3);
    expect(html).not.toContain('disabled=""');
  });

  it("does not infer requirements even from a descriptive school name", () => {
    const html = renderPicker([], 6, "CNS Amanora");
    expect(html).toContain("CNS Amanora");
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).not.toContain("Maharashtra");
  });

  it("saves every retained choice without injecting subjects or changing IDs", () => {
    const selected: SubjectId[] = ["cls-marathi", "cls-art", "cls-physics"];
    const onSave = vi.fn();
    renderPicker(selected, 6, undefined, onSave);
    saveAction?.();
    expect(onSave).toHaveBeenCalledWith(selected);
    expect(selected).toEqual(["cls-marathi", "cls-art", "cls-physics"]);
  });
});
