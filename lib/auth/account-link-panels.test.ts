/** Render the real panels without modifying the shared JSX test configuration. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import * as contract from "./account-link-ui";

function renderPanel(path: string, name: string, signedIn: boolean, props: Record<string, unknown> = {}) {
  const compiled = ts.transpileModule(readFileSync(resolve(path), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const exports: Record<string, React.ComponentType<Record<string, unknown>>> = {};
  const requireForTest = (id: string) => {
    if (id === "react") return React;
    if (id === "react/jsx-runtime") return jsxRuntime;
    if (id === "@/lib/auth/account-link-ui") return contract;
    if (id === "@clerk/nextjs/errors") return { isReverificationCancelledError: () => false };
    if (id === "@clerk/nextjs") return {
      useUser: () => ({ isLoaded: true, isSignedIn: signedIn, user: signedIn ? { id: "own-account" } : null }),
      useReverification: (operation: unknown) => operation,
      SignInButton: ({ children }: { children: React.ReactNode }) => children,
      SignOutButton: ({ children }: { children: React.ReactNode }) => children,
    };
    throw new Error("Unexpected component dependency");
  };
  // Only checked-in component source is evaluated. No network or env input.
  new Function("require", "exports", compiled.outputText)(requireForTest, exports);
  return renderToStaticMarkup(React.createElement(exports[name], props));
}
afterEach(() => vi.unstubAllGlobals());
it("guest learner entry does not classify, create accounts or request tokens", () => {
  const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
  const html = renderPanel("app/learner/account/learner-account-panel.tsx", "LearnerAccountPanel", false);
  expect(html).toContain("Sign in to request a link");
  expect(html).toContain("Signing in alone does not classify or link you");
  expect(fetcher).not.toHaveBeenCalled();
});
it("signed-in learner sees monitoring disclosure before any classification action", () => {
  const html = renderPanel("app/learner/account/learner-account-panel.tsx", "LearnerAccountPanel", true);
  expect(html).toContain("synced learning progress and safety reports");
  expect(html).toContain("separate from linking a device");
  expect(html).not.toContain("Request a new parent pairing code");
});
it("parent panel waits for scoped status before presenting approval controls", () => {
  const html = renderPanel("app/parent/parent-account-link-panel.tsx", "ParentAccountLinkPanel", true, { learnerId: "11111111-1111-4111-8111-111111111111" });
  expect(html).toContain("loading or unavailable");
  expect(html).not.toContain("Approve this account");
  expect(html).toContain("separate from the device code");
});
it("signed-out callers cannot render parent account-link controls", () => {
  expect(renderPanel("app/parent/parent-account-link-panel.tsx", "ParentAccountLinkPanel", false, { learnerId: "unused" })).toBe("");
});
