import { readFileSync } from "node:fs";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

it("discloses provider transmission and confidentiality limits before editing", () => {
  // Render the checked-in component without changing the shared JSX test config.
  const source = readFileSync("components/parent/learner-guidance-panel.tsx", "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const exports: { LearnerGuidancePanel?: React.ComponentType<{ learnerId: string }> } = {};
  const dependencies = (name: string) => {
    if (name === "react") return React;
    if (name === "react/jsx-runtime") return jsxRuntime;
    if (name === "@clerk/nextjs") return { useReverification: (operation: unknown) => operation };
    if (name === "@clerk/nextjs/errors") return { isReverificationCancelledError: () => false };
    throw new Error("Unexpected component dependency");
  };
  new Function("require", "exports", compiled.outputText)(dependencies, exports);
  const html = renderToStaticMarkup(React.createElement(exports.LearnerGuidancePanel!, { learnerId: "owned-learner" }));
  expect(html).toContain("AI provider configured for this learner");
  expect(html).toContain("not secrets or sensitive personal details");
  expect(html).toContain("Model responses are not guaranteed to keep this text confidential");
  expect(html).toContain("Withdrawal stops future use; it cannot recall a reply already in progress");
});
