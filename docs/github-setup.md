# GitHub repository configuration

This document is the source of truth for how the `ekansh-tb/vidya` repository is configured on GitHub. The files in [`.github/`](../.github) handle everything that can live in source. The settings below have to be applied in the GitHub UI (or via the GitHub API) and should be re-applied if the repo is ever migrated.

> **Audience:** the project maintainer(s). Contributors don't need to read this.

---

## 1. General settings

`Settings → General`

- **Default branch**: `main`
- **Features**
  - Wikis: **off** (docs live in `docs/`)
  - Issues: **on**
  - Sponsorships: maintainer's choice
  - Preserve this repository: **on** (Arctic Code Vault is gone, but the toggle still exists for archival)
  - Discussions: **on** (used by `ISSUE_TEMPLATE/config.yml` for the "Question" contact link)
  - Projects: **on**
- **Pull Requests**
  - **Allow merge commits**: ❌ **off**
  - **Allow squash merging**: ✅ **on**
    - Default commit message: **"Pull request title and description"**
  - **Allow rebase merging**: ❌ **off**
  - **Always suggest updating pull request branches**: ✅ **on**
  - **Allow auto-merge**: ✅ **on**
  - **Automatically delete head branches**: ✅ **on**
- **Archives**
  - Include Git LFS objects in archives: maintainer's choice

---

## 2. Branch protection — `main`

`Settings → Branches → Add branch ruleset` (or classic Branch protection rule)

Protect the `main` branch with the following:

- **Require a pull request before merging**: ✅
  - Required approvals: **1**
  - Dismiss stale pull request approvals when new commits are pushed: ✅
  - Require review from Code Owners: ✅ (uses [`.github/CODEOWNERS`](../.github/CODEOWNERS))
  - Require approval of the most recent reviewable push: ✅
- **Require status checks to pass before merging**: ✅
  - Require branches to be up to date before merging: ✅
  - Required checks (add each by name once it has run at least once):
    - `Lint`
    - `Typecheck`
    - `Build`
    - `Analyze (javascript-typescript)` (CodeQL)
    - `Review dependencies`
    - `Gitleaks`
- **Require conversation resolution before merging**: ✅
- **Require signed commits**: ✅ *(recommended; require contributors to sign their commits)*
- **Require linear history**: ✅ *(enforced by disabling merge commits + squash-only)*
- **Require deployments to succeed before merging**: ❌ *(Vercel runs after merge)*
- **Lock branch**: ❌
- **Do not allow bypassing the above settings**: ✅ — **apply to administrators as well**. The maintainer goes through PRs too.
- **Restrict who can push to matching branches**: ✅
  - Allow only: no users / no teams (i.e. **nobody pushes directly to `main`** — everything goes through a PR)
- **Allow force pushes**: ❌
- **Allow deletions**: ❌

---

## 3. Security & analysis

`Settings → Code security and analysis`

Enable everything GitHub offers for public repos:

- **Dependency graph**: ✅ (always on for public repos)
- **Dependabot**
  - Dependabot alerts: ✅
  - Dependabot security updates: ✅
  - Dependabot version updates: ✅ — configured by [`.github/dependabot.yml`](../.github/dependabot.yml)
  - Grouped security updates: ✅
- **Code scanning**
  - Default setup or Advanced: **Advanced** — we use the [`codeql.yml`](../.github/workflows/codeql.yml) workflow
- **Secret scanning**
  - Secret scanning: ✅ (always on for public repos)
  - Push protection: ✅ — blocks pushes that contain detected secrets
  - Validity checks: ✅
  - Non-provider patterns: ✅
- **Private vulnerability reporting**: ✅ — enables the workflow described in [`SECURITY.md`](../SECURITY.md)

---

## 4. Actions permissions

`Settings → Actions → General`

- **Actions permissions**: **Allow `ekansh-tb`, and select non-`ekansh-tb`, actions and reusable workflows**
  - Allow actions created by GitHub: ✅
  - Allow actions by Marketplace verified creators: ✅
  - Allow specified actions (in addition to the above) — we pin everything by SHA, so this list is unused in practice
- **Fork pull request workflows from outside collaborators**: **Require approval for first-time contributors**
- **Workflow permissions**: **Read repository contents and packages permissions** (least privilege)
  - Individual workflows escalate via per-job `permissions:` blocks
- **Allow GitHub Actions to create and approve pull requests**: ❌ off — Dependabot uses its own token

---

## 5. Collaborators & teams

`Settings → Collaborators and teams`

- Add collaborators only as needed.
- **Base permission**: `Read`. Contributors fork and PR; they don't need write access.

---

## 6. Tags & releases

- **Tag protection rule**: protect `v*.*.*` to prevent accidental deletion of release tags.
- Use the **Releases** UI to cut releases; release notes should be auto-generated from squashed PR titles (works because we squash-merge with Conventional Commit titles).

---

## 7. Webhooks & integrations

- **Vercel**: connected to deploy `main` to production and PRs to preview.
- **GitHub Apps**: keep the list minimal. Audit `Settings → Integrations → GitHub Apps` every quarter.

---

## 8. Verifying the setup

After applying the settings above, open a throwaway PR with a deliberate failure (e.g. an obvious lint error) and confirm:

- [ ] CI runs `Lint`, `Typecheck`, `Build`, CodeQL, dependency review, Gitleaks
- [ ] The PR cannot be merged while any required check is red
- [ ] The PR cannot be merged without one CODEOWNERS approval
- [ ] The "Merge" button shows **only** "Squash and merge"
- [ ] After merge, the head branch is auto-deleted
- [ ] Direct `git push origin main` is rejected for everyone, including the maintainer

If any of these don't behave as described, fix the corresponding setting above.

---

## 9. Re-applying via the API (optional)

Branch protection can also be set via the REST or GraphQL API for repeatability. A minimal `gh` invocation:

```bash
gh api -X PUT repos/ekansh-tb/vidya/branches/main/protection \
  -f required_status_checks.strict=true \
  -F required_status_checks.contexts[]='Lint' \
  -F required_status_checks.contexts[]='Typecheck' \
  -F required_status_checks.contexts[]='Build' \
  -F required_status_checks.contexts[]='Analyze (javascript-typescript)' \
  -F required_status_checks.contexts[]='Review dependencies' \
  -F required_status_checks.contexts[]='Gitleaks' \
  -F enforce_admins=true \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.require_code_owner_reviews=true \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F restrictions=null \
  -F required_linear_history=true \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F required_conversation_resolution=true
```

Modern rulesets (the successor to classic branch protection) are richer; consider migrating once you're happy with the configuration above.
