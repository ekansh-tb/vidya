# Vidya

> A digital school that fits in a browser. Curriculum-anchored, age-aware, AI-tutored.

**Live**: https://vidya-quest.vercel.app

Vidya is an experiment in what a personal school could look like if it lived entirely in a web app: structured around a real curriculum (Cambridge Primary, Cambridge IGCSE, ICSE — multiple grades supported), narrated by an AI tutor, gamified for retention, and skinned differently for every age band.

It started as a one-learner quiz app for a Grade 5 student and grew into a multi-tenant "school of the future" — same codebase, three themes (Gen Alpha playful → early-teen vivid → Gen Z senior terminal), and per-learner profile isolation.

## Features

- **Multi-learner** — every kid has their own profile (name, school, board, grade, picked subjects, progress). Switch with one tap.
- **Three age-banded themes** — auto-applied by grade:
  - **playful** (Grade ≤ 5) — Fraunces display, aurora gradients, rounded-3xl glass cards.
  - **vivid** (Grade 6–8) — Outfit display, magenta + cyan, halftone-dot texture.
  - **terminal** (Grade 9+) — JetBrains Mono, near-black + acid lime, grid-paper, dev-console vibe.
- **Curriculum-anchored content** — every pack cites the syllabus code it was written against.
  - **Cambridge Primary** Stage 5 (Grade 5) — Maths, Science, English, Hindi, Marathi, GK.
  - **Cambridge Lower Secondary** (Grades 6–8 = Stages 7–9) — Stage 7 packs for Maths (0862), Science (0893) and English (0861), plus History, Geography, Global Perspectives, ICT, Art and the Hindi/French/Spanish language choice.
  - **Cambridge IGCSE** (Grades 9–10) — exam packs for International Mathematics **0607**, Physics 0625, Chemistry 0620, Biology 0610, First Language English 0500, French 0520 and Computer Science 0478.
  - **ICSE / CISCE** Class 6–7 — Selina-aligned packs for Maths, Physics, Chemistry, Biology, History & Civics, Geography, Computer Studies.
  - **CBSE** Class 7 (NCERT) — Maths, Science, English, Hindi, Sanskrit, Social Science.
  - Maharashtra-mandated Marathi (Balbharati) across boards.

  > **Grade ≠ Cambridge stage.** Cambridge Lower Secondary covers Grades 6–8 as
  > Stages **7–9**, so a Grade 6 learner studies Stage 7. Packs carry the
  > learner's **grade** (`grade: 6`) because that is what lookup matches on,
  > while their copy says "Stage 7". Getting this backwards teaches a whole
  > year below where the learner actually is.
- **AI Tutor (Miss Vidya)** — Claude Haiku via the AI SDK. System prompts are board-, grade-, and subject-aware, with scope guards so a Class 6 student doesn't get over-taught Class 7 content.
- **AI Principal (Daily Assembly)** — generates a thought-for-the-day, plan, and closing line per learner.
- **Exam Prep mode** — generic ExamPack shape: overview → syllabus checklist (with weak/ok/strong confidence tagging) → flashcards → practice MCQs with model answers → common mistakes → morning cheat sheet.
- **Music Room** — Sargam ↔ Western keyboard (`A S D F G H J K`), recording, named multi-composition library that persists.
- **Field Trip Atlas** — Mars, Moon, Ajanta, Shaniwar Wada, ISRO, Everest, Amazon, Mariana Trench — Wikipedia + facts + mini-quiz + passport stamp.
- **Library** — curated Grade 5 reading list (Panchatantra, R.K. Narayan, Ruskin Bond, Roald Dahl, Premchand, Balbharati).
- **Notebook** — per-subject rich-text notes, auto-saved.
- **Wellness Break** — guided breathing (box, 4-7-8, belly).
- **Friend Streak** — pair learning.

## Stack

- **Next.js 15** (App Router) on **Vercel**
- **Tailwind CSS** + CSS-variable-driven theme tokens (3 themes)
- **Framer Motion** for animations
- **Tone.js** for the Music Room synth
- **AI SDK v6** + `@ai-sdk/anthropic` (Claude Haiku 4.5) for the tutor + principal
- **Clerk** for parent authentication (the kid app is deliberately anonymous)
- **Zustand** + localStorage for state (per-learner profile isolation)
- **Zod** for API request validation
- **Vitest** for unit tests; **ESLint** flat config; **GitHub Actions** for CI
- **TypeScript** throughout

## Running locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the keys you have
npm run dev
```

Every key is optional for local poking:

- **No `ANTHROPIC_API_KEY`** (or `AI_GATEWAY_API_KEY` / `VERCEL_OIDC_TOKEN`) — the tutor shows a gentle "ask a grown-up to plug in the key" message and the Daily Assembly serves a hand-written fallback. Everything else works.
- **No Clerk keys** — Clerk starts in keyless dev mode under `next dev` and writes a temporary key into `.clerk/` (gitignored). A **production** build has no such fallback, so the app detects the missing key and degrades: the kid app runs normally while `/parent` and the auth pages are closed off (fail-closed — an unconfigured deployment must never expose a dashboard that can read every profile on the device). Set real keys before deploying.

There is no database to set up — learner state lives in the browser's `localStorage`.

## Quality gates

```bash
npm run verify      # typecheck + lint + tests — what CI runs
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (flat config)
npm run test        # vitest
```

`.github/workflows/ci.yml` runs all of the above plus a production build on every push and PR. The build is deliberately key-free: if it ever starts needing a secret, that is a regression.

## Project structure

```
app/
  page.tsx                    # Router + theme + learner gating
  api/tutor/route.ts          # AI tutor streaming endpoint
  api/assembly/route.ts       # Daily assembly generator
  parent/page.tsx             # Server wrapper (forces dynamic render)
  parent/dashboard.tsx        # Parent dashboard client component
  globals.css                 # Three themes via CSS variables + [data-theme]
  layout.tsx                  # Font loading + conditional ClerkProvider
middleware.ts                 # Clerk gating; degrades when Clerk is unconfigured
components/
  views/                      # All screens (home, subject, quiz, exam-prep, music, …)
  theme-applier.tsx           # Sets data-theme on <html> from active learner
  ui/                         # Buttons, mascot, indicators
  effects/                    # Diya companion, particles, voice bubble
lib/
  types.ts                    # GameState, LearnerProfile, ExamPack, etc.
  game-store.ts               # Zustand + multi-profile + daily rollovers
  storage.ts                  # localStorage v1→v2 migration
  api/guard.ts                # Origin check, zod validation, rate limiting
  auth/clerk-config.ts        # Is Clerk actually configured?
  capabilities/               # Verification-ladder capability resolver
  content/
    subjects.ts               # Primary + Lower Secondary + IGCSE + ICSE + CBSE
    questions/                # Grade 5 quiz banks
    packs/                    # Exam packs + registry
      index.ts                #   ALL_PACKS — server/test use; pulls every body
      pack-index.ts           #   Light index: existence + lazy loaders
      use-pack.ts             #   React hook that loads a pack on demand
    library.ts                # Curated reading list
    destinations.ts           # Field Trip destinations
```

### A note on `pack-index.ts`

Exam packs are large. Importing `ALL_PACKS` on the client pulled every pack body into the initial bundle — a Grade 6 learner was downloading IGCSE Biology to render a banner. Client code therefore asks `pack-index.ts` "does a pack exist?" (synchronous, tiny) and loads the body from its own chunk only when a learner opens it. `pack-index.test.ts` asserts the index and the real registry describe exactly the same set in both directions, so adding a pack without indexing it fails CI.

## Known limitations

Being explicit, because these shape what is safe to promise:

- **No durable storage.** Everything lives in one `localStorage` key. Clearing site data, switching browsers or switching devices loses all progress. There is no export and no backup. This is the largest gap between Vidya and a product families could rely on.
- **The AI routes are public by necessity.** The kid app has no login, so `/api/tutor` and `/api/assembly` cannot require a session. They are guarded by same-origin checks, zod validation with hard caps, and rate limiting — but the limiter is **in-memory and per-instance**, so it raises the cost of abuse rather than capping it. Keep a spend cap on the model provider account; that is the real backstop.
- **The verification ladder is partly aspirational.** `computeRung()` returns only 0 or 2, and rung 2 is granted by any 4-digit local PIN rather than by authentication. Capability policies are a static map, so rate limits and cohorts in `CAPABILITY_POLICIES` are declared but not enforced. See `docs/AUTH_ARCHITECTURE.md` for what is spec versus shipped.
- **Adaptive learning is not built.** Mastery is a flat per-topic ratio; there is no concept graph and no spaced repetition. See Phase C in [VISION.md](./VISION.md).

## What I learned building this

- **Three themes from one component tree** is achievable with CSS variables + a single `[data-theme]` attribute swap. No conditional component code needed.
- **Per-learner state isolation** doesn't need a database — a `profiles: Record<id, Profile>` map in localStorage with a `currentLearnerId` pointer is enough for single-device families.
- **Exam packs are the right abstraction** for curriculum content. Subject ID + grade → pack. New grade = new pack file, no UI changes.
- **AI scope guards matter.** Tell the model precisely what *not* to teach for a given grade — examiner reports are surprisingly consistent about over-teaching being a real mistake.
- **Verify the syllabus code, not the subject name.** "IGCSE Maths" is two different exams: 0580 and International Mathematics 0607. 0607 requires a graphics calculator and adds an investigation paper. A pack written against the wrong code is confidently, invisibly wrong — the textbook in the learner's bag is the source of truth.
- **A lint config that never ran is worse than none.** `.eslintrc.json` extended `next/core-web-vitals` without `eslint-config-next` installed, so lint failed silently for the whole project history. Turning it on immediately surfaced conditional React hooks that could crash a screen.

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgements

- Cambridge Assessment International Education for the IGCSE / Cambridge Primary frameworks.
- CISCE for the ICSE curriculum framework.
- Selina Publishers — the de-facto ICSE textbook publisher whose chapter lists anchor the content.
- Maharashtra State Bureau of Textbook Production & Curriculum Research (Balbharati) for the open Std-level textbooks.
- Built with [Claude Code](https://claude.com/claude-code).

---

Built so any kid — Cambridge Primary, IGCSE, ICSE, CBSE — can have a digital school of their own. Profiles are intentionally anonymous by default; no real names ship in the source.
