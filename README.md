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
- **Curriculum-anchored content**
  - Cambridge Primary Stage 5 (Grade 5) — Maths, Science, English, Hindi, Marathi, GK.
  - Cambridge IGCSE (Grade 9–10) — full subject groupings + Computer Science 0478 exam pack.
  - ICSE / CISCE Class 6–7 — Selina-aligned exam packs for Maths, Physics, Chemistry, Biology, History & Civics, Geography, Computer Studies.
  - Maharashtra-mandated Marathi (Balbharati) across boards.
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
- **Zustand** + localStorage for state (per-learner profile isolation)
- **TypeScript** throughout

## Running locally

```bash
npm install
ANTHROPIC_API_KEY=sk-… npm run dev
```

The app works fully without an API key — AI features fall back to a gentle "ask a grown-up to plug in the key" message. With a key set, Miss Vidya and the Daily Assembly come alive.

## Project structure

```
app/
  page.tsx                    # Router + theme + learner gating
  api/tutor/route.ts          # AI tutor streaming endpoint
  api/assembly/route.ts       # Daily assembly generator
  globals.css                 # Three themes via CSS variables + [data-theme]
  layout.tsx                  # Font loading
components/
  views/                      # All screens (home, subject, quiz, exam-prep, music, …)
  theme-applier.tsx           # Sets data-theme on <html> from active learner
  ui/                         # Buttons, mascot, indicators
  effects/                    # Diya companion, particles, voice bubble
lib/
  types.ts                    # GameState, LearnerProfile, ExamPack, etc.
  game-store.ts               # Zustand + multi-profile + daily rollovers
  storage.ts                  # localStorage v1→v2 migration
  content/
    subjects.ts               # Primary + IGCSE + ICSE subject definitions
    questions/                # Grade 5 quiz banks
    packs/                    # Exam packs (IGCSE-CS, ICSE-7, ICSE-6) + registry
    library.ts                # Curated reading list
    destinations.ts           # Field Trip destinations
```

## What I learned building this

- **Three themes from one component tree** is achievable with CSS variables + a single `[data-theme]` attribute swap. No conditional component code needed.
- **Per-learner state isolation** doesn't need a database — a `profiles: Record<id, Profile>` map in localStorage with a `currentLearnerId` pointer is enough for single-device families.
- **Exam packs are the right abstraction** for curriculum content. Subject ID + grade → pack. New grade = new pack file, no UI changes.
- **AI scope guards matter.** Tell the model precisely what *not* to teach for a given grade — examiner reports are surprisingly consistent about over-teaching being a real mistake.

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
