<!--
PR title must follow Conventional Commits, e.g.:
  feat(exam-pack): add ICSE Class 8 Physics pack
  fix(theme): correct contrast on vivid quiz buttons
The PR title becomes the squash commit message on main.
-->

## Summary

<!-- What does this PR change and why? 1–3 bullets. -->

-
-

## Type of change

<!-- Tick all that apply. -->

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` — code change with no behavior change
- [ ] `perf` — performance improvement
- [ ] `test` — tests only
- [ ] `chore` — tooling / dependencies
- [ ] `security` — security-relevant change
- [ ] **Breaking change** — bumps the `!` flag in the commit type

## Related issues

<!-- Use "Closes #N" to auto-close the issue on merge. -->

Closes #

## Screenshots / recordings

<!-- For UI changes: before/after screenshots or a short Loom/GIF. Delete if N/A. -->

## Test plan

<!-- How did you verify this works? Be specific — list the steps a reviewer can re-run. -->

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Manual verification:
  - [ ] …

## Curriculum content (if applicable)

<!-- For PRs touching lib/content/. Delete this section otherwise. -->

- [ ] Source board / textbook cited in the PR body
- [ ] Content scoped to the correct grade (no over-teaching)
- [ ] AI scope guards updated if a new grade / subject was added

## Security checklist

- [ ] No secrets, API keys, or PII committed
- [ ] No new `dangerouslySetInnerHTML` / `eval` / unsanitized user input rendered as HTML
- [ ] New external network calls are documented in the PR description
- [ ] New dependencies have been reviewed (license, maintenance, transitive deps)

## Author checklist

- [ ] PR title follows Conventional Commits
- [ ] Branch name follows the naming convention (`feat/`, `fix/`, `docs/`, …)
- [ ] PR is focused — one concern, < ~500 lines where possible
- [ ] I have read [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] I have read [SECURITY.md](../SECURITY.md) and this PR contains no undisclosed security fix
