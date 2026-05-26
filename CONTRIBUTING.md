# Contributing to Vidya

Thanks for your interest in Vidya. This document is the canonical reference for how work flows into the `main` branch.

By participating you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Quick start

```bash
git clone https://github.com/ekansh-tb/vidya.git
cd vidya
npm install
cp .env.local.example .env.local   # add ANTHROPIC_API_KEY if you want AI features
npm run dev
```

Before opening a PR:

```bash
npm run lint
npm run build
```

Both must pass locally. CI will block the merge otherwise.

---

## Ways to contribute

- **Bug reports** — open an issue using the *Bug report* template.
- **Feature requests** — open an issue using the *Feature request* template. For anything bigger than a small UI tweak, please discuss in an issue before writing code.
- **Security vulnerabilities** — **do not** open a public issue. See [SECURITY.md](./SECURITY.md).
- **Curriculum / content** — exam packs and question banks under `lib/content/` are welcome contributions. Please cite the source board / textbook in the PR description.
- **Documentation** — typo fixes, clarifications, and new docs under `docs/` are always welcome.

---

## Branching model

`main` is the only long-lived branch and is **protected** (see [docs/github-setup.md](./docs/github-setup.md)). All work happens on short-lived feature branches that are merged back via pull request.

External contributors **fork the repo** and open PRs from their fork.

### Branch naming

Use one of the following prefixes:

| Prefix     | Use for                                    | Example                            |
| ---------- | ------------------------------------------ | ---------------------------------- |
| `feat/`    | New features                               | `feat/music-room-recording`        |
| `fix/`     | Bug fixes                                  | `fix/quiz-score-rollover`          |
| `docs/`    | Documentation only                         | `docs/contributing-guide`          |
| `chore/`   | Tooling, deps, CI, no production code      | `chore/bump-next-15.2`             |
| `refactor/`| Code restructuring with no behavior change | `refactor/extract-exam-pack-shape` |
| `test/`    | Tests only                                 | `test/game-store`                  |
| `perf/`    | Performance improvements                   | `perf/lazy-load-tutor`             |
| `security/`| Security hardening                         | `security/sanitize-tutor-input`    |

Use kebab-case after the prefix. Keep the slug short.

---

## Commit messages — Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for every commit on `main`. Because we **squash and merge**, the *PR title* becomes the squash commit subject — so the PR title is what really matters.

Format:

```
<type>(<scope>)?: <subject>
```

| Type       | Meaning                                       |
| ---------- | --------------------------------------------- |
| `feat`     | New user-visible feature                      |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation only                            |
| `style`    | Formatting, no code change                    |
| `refactor` | Code change that neither fixes nor adds       |
| `perf`     | Performance improvement                       |
| `test`     | Add/correct tests                             |
| `build`    | Build system / dependencies                   |
| `ci`       | CI configuration                              |
| `chore`    | Other maintenance                             |
| `security` | Security-relevant change                      |
| `revert`   | Revert a previous commit                      |

Rules:

- Subject line ≤ 72 characters, imperative mood ("add", not "added"), no trailing period.
- Use `!` after the type for breaking changes: `feat(api)!: rename tutor endpoint`.
- Reference issues in the body, not the subject: `Closes #42`.

Examples:

```
feat(exam-pack): add ICSE Class 8 Physics pack
fix(theme): correct vivid theme contrast on quiz buttons
docs: clarify ANTHROPIC_API_KEY fallback behavior
chore(deps): bump framer-motion to 11.13.0
security(tutor): strip system-prompt-injection markers from input
```

---

## Pull request process

### 1. Open the PR

- Target `main`.
- Fill out **every** section of the PR template — reviewers will ask you to if you don't.
- Open as **Draft** until CI is green and you're ready for review.
- Link the issue it closes (`Closes #123`) in the body.
- Keep PRs **small and focused**. One concern per PR. If the diff exceeds ~500 lines, consider splitting it.

### 2. CI must pass

The following checks run on every PR and **must be green** before merge:

- `lint` — `npm run lint` (Next.js ESLint)
- `typecheck` — `tsc --noEmit`
- `build` — `npm run build`
- `codeql` — static security analysis
- `secrets-scan` — scans for accidentally committed credentials
- `dependency-review` — flags vulnerable dependencies introduced by the PR

Push fixes as new commits — do **not** force-push during review, it makes incremental review impossible. Force-push is fine before review starts or after a full re-review is needed.

### 3. Review

- Every PR requires **at least one approval** from a code owner (see [CODEOWNERS](./.github/CODEOWNERS)).
- Reviewers respond within 3 business days. If a PR has been silent for longer, ping `@ekansh-tb` in a comment.
- Address every review comment. Either fix it, or reply explaining why you disagree. Resolve conversations only when the reviewer agrees.
- Re-request review after pushing changes.

### 4. Merge

- We use **Squash and merge**, exclusively. Merge commits and rebase-merge are disabled.
- The PR title becomes the squash commit message — make sure it follows Conventional Commits.
- The contributor's feature branch is deleted automatically after merge.
- Only maintainers can merge. Contributors **cannot self-merge**.
- The PR must be up-to-date with `main` before the merge button unlocks.

### 5. After merge

- Vercel auto-deploys `main` to production at https://vidya-quest.vercel.app.
- Watch the deployment for 10 minutes. If the change breaks production, revert immediately (`git revert <sha>` → PR → merge) rather than trying to forward-fix under pressure.

---

## Code style

- **TypeScript everywhere.** No `any` without a `// eslint-disable-next-line` and a comment explaining why.
- **Functional React components** with hooks. No class components.
- **Tailwind** for styling. Theme tokens live in `app/globals.css` as CSS variables; do not hard-code colors.
- **Server vs client.** Default to Server Components. Add `"use client"` only when you need state, effects, or browser APIs.
- **State.** Persistent app state goes through the Zustand store in `lib/game-store.ts`. Don't write directly to `localStorage` from components.
- **AI prompts.** System prompts for Miss Vidya and the Principal must include the per-grade scope guards. See `app/api/tutor/route.ts` for the pattern.

ESLint enforces what it can; the rest is reviewed by humans.

---

## Tests

The repo does not yet have a test suite. PRs that add one (Vitest preferred) are very welcome. Until then, every PR must include a **Test plan** section describing the manual verification the author performed.

---

## Reporting security issues

**Do not open public issues for security vulnerabilities.** See [SECURITY.md](./SECURITY.md) for the private disclosure process.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE) that covers the project.
