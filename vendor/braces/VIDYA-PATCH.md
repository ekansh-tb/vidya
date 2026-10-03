# Bounded braces fork

This private, local fork retains braces 3.0.3's MIT license and original source.
It is not an upstream patched release. It is installed under the `braces` import
name through an npm override, with its own `@vidya/braces` package identity.

Source: https://github.com/micromatch/braces/tree/3.0.3
Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

The advisory lists no upstream patched release as checked on 4 October 2026.
The fork rejects nesting of 64 levels in the iterative parser before an AST can
reach recursive walkers. Compile, expand, and stringify also validate direct
AST arguments iteratively, rejecting excessive depth, cyclic child graphs and
excessive node counts. Caller options cannot disable these limits.

Tests exercise every public entry point, malformed/deep direct ASTs, and ordinary
brace expansion used by Tailwind, globbing and lint. CI still runs the complete
dependency audit, lint, tests and build. No advisory is ignored or severity
threshold lowered. This mitigation addresses recursive stack exhaustion; it is
not a claim that arbitrary untrusted glob patterns are safe for server use.

Remove the fork when a verified upstream fix is available and passes regression
tests. Upstream code is excluded from application lint, while this repository's
guard and regression tests remain linted.
