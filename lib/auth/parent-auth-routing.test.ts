import { readFileSync } from "node:fs";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";
import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { learningAppHref, parentReturnPath } from "./parent-return";

async function authProps(mode: "sign-in" | "sign-up", query: Record<string, unknown>) {
  const source = readFileSync(`app/${mode}/[[...${mode}]]/page.tsx`, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const exports: { default?: (props: { searchParams: Promise<Record<string, unknown>> }) => Promise<ReactElement<{ children: ReactElement<Record<string, unknown>> }>> } = {};
  const dependencies = (name: string) => {
    if (name === "react/jsx-runtime") return jsxRuntime;
    if (name === "@clerk/nextjs") return { SignIn: "sign-in", SignUp: "sign-up" };
    if (name === "@/components/auth/parent-auth-shell") return { ParentAuthShell: "main" };
    if (name === "@/lib/auth/clerk-appearance") return { parentAuthAppearance: {} };
    if (name === "@/lib/auth/parent-return") return { parentReturnPath };
    throw new Error(`Unexpected dependency: ${name}`);
  };
  new Function("require", "exports", compiled.outputText)(dependencies, exports);
  return (await exports.default!({ searchParams: Promise.resolve(query) })).props.children.props;
}

it.each(["sign-in", "sign-up"] as const)("%s overrides a saved learner-home redirect for both authentication paths", async mode => {
  const props = await authProps(mode, { next: "/parent", redirect_url: "https://vidyagyan.study/" });
  expect(props.forceRedirectUrl).toBe("/parent");
  expect(props[mode === "sign-in" ? "signUpForceRedirectUrl" : "signInForceRedirectUrl"]).toBe("/parent");
});

it.each(["sign-in", "sign-up"] as const)("%s retains valid owner destinations and rejects ambiguous query arrays", async mode => {
  expect((await authProps(mode, { next: "/admin/content?revision=2" })).forceRedirectUrl).toBe("/admin/content?revision=2");
  expect((await authProps(mode, { next: ["/parent", "//outside.test"] })).forceRedirectUrl).toBe("/parent");
});

it("returns to the learner host only from the production parent host", () => {
  expect(learningAppHref("parents.vidyagyan.study")).toBe("https://vidyagyan.study/");
  for (const host of [null, "localhost:3103", "vidya-preview.vercel.app", "parents.vidyagyan.study.outside.test"]) expect(learningAppHref(host)).toBe("/");
});
