import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
const require = createRequire(import.meta.url);
const braces = require("braces");
const malicious = "{".repeat(6000) + "a,b" + "}".repeat(6000);

test("every installed braces string entry rejects deep nesting without exhausting the stack", () => {
  assert.equal(require("braces/package.json").name, "@vidya/braces");
  for (const entry of [braces, braces.parse, braces.create, braces.compile, braces.expand, braces.stringify]) {
    assert.throws(() => entry(malicious, {maxLength:100000,rangeLimit:false}), {name:"SyntaxError"});
    assert.throws(() => entry("(".repeat(6000)+"x"+")".repeat(6000)), {name:"SyntaxError"});
  }
});

test("direct AST walkers reject excessive depth and child cycles", () => {
  const root = {type:"root",nodes:[]}; let current = root;
  for (let i=0; i<6000; i++) { const child = {type:"brace",nodes:[]}; current.nodes.push(child); current=child; }
  const cycle = {type:"root",nodes:[]}; cycle.nodes.push(cycle);
  for (const entry of [braces.compile,braces.expand,braces.stringify]) {
    assert.throws(() => entry(root), {name:"SyntaxError"});
    assert.throws(() => entry(cycle), {name:"SyntaxError"});
  }
});

test("ordinary ranges, nested alternatives, escapes and globs remain compatible", () => {
  assert.deepEqual(braces.expand("src/{app,components}/**/*.{ts,tsx}"), ["src/app/**/*.ts","src/app/**/*.tsx","src/components/**/*.ts","src/components/**/*.tsx"]);
  assert.deepEqual(braces.expand("{1..3}"), ["1","2","3"]);
  assert.deepEqual(braces.expand("{a,{b,c}}"), ["a","b","c"]);
  assert.equal(braces.stringify(braces.parse("x/{a,b}/z")), "x/{a,b}/z");
  assert.equal(braces.compile("x/{a,b}/z"), "x/(a|b)/z");
  assert.deepEqual(braces.expand("\\{literal\\}"), ["{literal}"]);
});
