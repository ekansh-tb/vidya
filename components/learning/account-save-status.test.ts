import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import type { SyncState } from "@/lib/sync/client";

const require = createRequire(import.meta.url);
function component(path: string, dependencies: Record<string, unknown> = {}) {
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const exports: Record<string, React.ComponentType<Record<string, unknown>>> = {};
  new Function("require", "exports", compiled.outputText)((name: string) => dependencies[name] ?? require(name), exports);
  return exports;
}
const popover = component("components/ui/info-popover.tsx");
const { AccountSaveStatus } = component("components/learning/account-save-status.tsx", { "@/components/ui/info-popover": popover });

it.each([
  ["idle", "Connect an account"],
  ["syncing", "Saving to your account…"],
  ["synced", "Saved to your account"],
  ["offline", "Offline: saved on this device, waiting to sync"],
  ["error", "Account save unavailable. Check connection or reconnect"],
] satisfies [SyncState, string][])("retains the complete %s status for announcements and tap-to-read details", (status, description) => {
  const html = renderToStaticMarkup(React.createElement(AccountSaveStatus, { status }));
  expect(html).toContain(`role="status" aria-atomic="true">${description}</span>`);
  expect(html).toContain(`<summary aria-label="${description}"`);
  expect(html).toContain(`<p>${description}</p>`);
  if (status === "error") expect(html).toContain("<span>Not saved</span>");
  if (status === "offline") expect(html).toContain("<span>Offline</span>");
});

it("keeps Hindi details and accessible disclosure names", () => {
  const html = renderToStaticMarkup(React.createElement(AccountSaveStatus, { status: "offline", language: "hi" }));
  expect(html).toContain("ऑफ़लाइन: इस डिवाइस पर सहेजा, इंटरनेट पर सिंक होगा");
  expect(html).toContain("<summary aria-label=");
});
