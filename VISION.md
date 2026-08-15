# Vidya Verse — Blueprint

> "School isn't a building. It's an experience. By 2045, that experience lives in a window."

## North Star

**Vidya stops being a quiz app the moment a kid opens it and feels they've walked into a school, not a game.**
A 20-year-out reading of where personal learning is going: classrooms become rooms in software, teachers become persistent AI personalities, peers become async collaborators, the curriculum becomes adaptive, and the school day becomes a ritual a child *wants* to enter.

Original anchor: Grade 5, Cambridge Primary Stage 5 + Maharashtra State Board (Marathi/Hindi). Single-learner first, multi-tenant ready.

**Where it actually landed (2026-08-16):** Cambridge Primary, Cambridge Lower
Secondary, Cambridge IGCSE, ICSE and CBSE across grades 1 to 12, with authored
content concentrated in specific grades, three age-banded themes,
and multi-learner profiles on one device. The Grade-5 framing below is the
origin story, not the current scope; `README.md` describes what ships today.

---

## Curriculum anchor (verified, May 2026)

- **School**: Chatrabhuj Narsee School (CNS), Amanora Park Town, Pune — Cambridge Assessment International Education
- **Board**: Cambridge Primary (Stage 5)
  - Maths 0096 · English 0058 · Science 0097 · Global Perspectives 0838 · ICT/Computing
- **State-mandated languages**: Marathi (2020 Compulsory Marathi Act) + Hindi (Maharashtra GR June 2025, NEP 2020) — both via Balbharati Sulabhbharati Std 5
- **EVS**: Maharashtra Balbharati Std 5 EVS Part 1 — used as the "GK + general awareness" anchor in Vidya
- **Verified open-source PDFs**: `books.ebalbharati.in/pdfs/<code>.pdf` for Marathi / Hindi / English / EVS Std 5

The Marathi syllabus is 28 chapters (नाच रे मोरा · हत्तीचे चातुर्य · सिंह आणि बेडूक · बैलपोळा · …). The Hindi Sulabhbharati Std 5 is 2 units, ~38 lessons (नंदनवन · बूँदें · पेटूराम · रोबोट · …). The Cambridge Stage 5 Maths strands are Number / Geometry & Measure / Statistics & Probability with **percentages and ratio introduced this year**. Science adds **forces, magnets, Earth–Sun–Moon, adaptations, scientific enquiry**. Global Perspectives rotates six themes (Sport, Planet Earth, Family & Community, Health & Well-being, Education for All, Reduce/Reuse/Recycle).

These are the canvas Vidya paints on. Every Classroom maps to a real textbook.

---

## The Four Identity Shifts

1. **From home page → School Lobby.** You don't "open the app." You walk into Vidya.
2. **From subject tile → Classroom.** Each subject is a themed room with its own teacher, atmosphere, sound, and material.
3. **From quiz → School Day.** Periods, assembly, recess, library hour, sports, prep — a daily rhythm.
4. **From streak counter → Diya.** A companion who lives with you, grows with you, and notices when you've been away.

---

## Phase A — Foundations ✅ shipped

| | Pillar | Status | Lives in |
|---|---|---|---|
| 1 | **Vidya Verse Lobby** — replaces home; companion, assembly card, field-trip teaser | ✅ | `components/views/home-view.tsx` |
| 2 | **Miss Vidya AI Tutor** — chat with an AI teacher per subject, server-side | ✅ | `components/views/tutor-view.tsx` · `app/api/tutor/route.ts` |
| 3 | **Diya** — persistent companion that grows with XP and reacts to events | ✅ | `components/effects/diya.tsx` · `lib/diya.ts` |
| 4 | **Field Trip mode** — Wikipedia + facts mini-quiz + passport stamps | ✅ | `components/views/field-trip-view.tsx` · `lib/content/destinations.ts` |

The lobby now derives the current school period from a local timetable and
suggests its matching room. Editable family timetables and school-calendar
exceptions remain open.

Also shipped: variety fix, 6/7 meme overlay, post-quest summary w/ review, custom avatar upload, skim-the-book panel, Match Quest mode, Friend Streak.

---

## Phase B — School Day (mostly shipped)

Shipped: period clock with a local timetable, Notebook, Library, Music Room,
Daily Assembly and Wellness break. Still open: **editable timetables and
calendar exceptions**, **per-room class atmospheres** (ambient sound and
dressed rooms), and **Art Studio**.

- **Period clock & timetable** - the local period clock and room suggestion are shipped. Parent editing, weekend rules, holidays and school-specific calendar sync remain open.
- **Class Atmospheres** — each Classroom view dresses itself: Maths chalkboard, Science lab benches, Hindi/Marathi reading corner, GK globe room. Ambient sound per room.
- **Notebook** - plain-text notes per subject with automatic saving. Rich text and mobile voice-to-text remain open.
- **Library** - 18-book discovery shelf, three complete public-domain books, saved reading position, reading controls, filtering and device read-aloud.
- **Art Studio** — drawing canvas (touch + stylus), AI critique with "kind teacher" prompt.
- **Music Room** — Tone.js sandbox: compose a melody, learn raagas, build a tabla loop.
- **Daily Assembly** — once-a-day greeting from the AI principal with a thought-for-the-day. Builds the "ritual of entering school."
- **Wellness break** — guided breathing, posture stretch, water reminder. Imagined from Maharashtra board's *Tula Mahit Aahe Ka* / *Stress-Less* modules.

---

## Phase C: Adaptive Brain in progress

> **This remains the largest learning gap.** Wrong answers now enter a tested
> Leitner spaced-repetition queue and linked learners can sync that schedule
> across devices. Topic mastery is still a flat `{attempts, correct, mastery}`
> ratio. There is no concept graph, dependency model, diagnostic assessment or
> personalized next-best lesson.

- **Mastery Map** — every concept (not topic) tracked. Graph of dependencies (multiplication needs addition; fractions need division; perimeter needs multiplication). Map paints itself as she progresses.
- **Adaptive Quest** - the review queue is shipped; weakest-concept selection, unseen-topic rotation and generated question variants remain open.
- **Diagnostic Day** — once a week, a 15-min mixed quiz that recalibrates mastery scores.
- **Explanation Generator** — every wrong answer triggers a 30-second AI explanation in her voice teacher's style.

---

## Phase D — Lab & Maker

- **Science Sims** — drag-drop circuits, plant cell zoom-in, force vectors, magnet field, water-cycle simulator (all built with React + SVG or React Three Fiber).
- **Math Sandbox** — number-line, fraction wall, geometry tool, function plotter.
- **Code Lab** — block coding (Scratch-style) → Python preview. Daily "tiny code" challenge.
- **Language Studio** — record yourself reading aloud; AI gives gentle pronunciation feedback in Hindi / Marathi / English.
- **Maker Mode** — pick a project ("build a vegetable garden", "design a city park"). Multi-week.

---

## Phase E — World & Social

- **Field Trip Atlas** — every Wikipedia-listed UNESCO + planet + biome → one "trip card."
- **News for Kids** — daily curated 2-minute brief.
- **Show & Tell** — record a 60-second voice/photo; saves to her timeline.
- **Class Buddies** — invite real friends (extending the existing Friend Streak); shared field trips and study groups.
- **Pen-Pal AI personas** — kids from imagined other schools to swap letters with, builds language fluency.
- **Parent Portal v2** — daily learning report, time spent, concept-level mastery, suggested practice.

---

## Phase F — 2045 Vision (forecast horizon)

These are the bets that pay off when the underlying tech is here. Architecting now so we slot them in:

- **Spatial classrooms (WebXR)** — Apple Vision-class glasses are mainstream. Vidya renders a real classroom you stand inside. Today's `react-three-fiber` 2D fallback becomes 3D scenes.
- **Real-time voice tutor** — sub-100ms LLM voice. Miss Vidya holds a real conversation, not a chat.
- **Continuous assessment** — eye-tracking, dwell time, sketch interpretation. The app *knows* when she's stuck without her saying it.
- **Holographic peers** — async AI classmates with consistent personalities — Aaditya, the curious one; Meera, the careful one; Zayn, the funny one. Group discussions feel populated.
- **Procedural curriculum** — instead of fixed chapters, the AI generates a lesson today that perfectly fits where her mastery map has weak edges.
- **Verifiable learning record** — every concept mastered is signed and portable. When she leaves Vidya for a high school, the record travels.
- **Tactile feedback (Pico haptics, ultrasound)** — the chalk feels like chalk; the violin string vibrates.
- **Family-shared world** — siblings, cousins, parents all enter the same Vidya Verse, can leave each other notes, take trips together.

---

## Engineering debt that gates the vision

Phases C–F all assume infrastructure that does not exist yet. In rough order of
what blocks the most:

1. **Curriculum depth and truth.** Exact-grade matching prevents another
   grade's pack from being substituted, but broad board ranges still contain
   classrooms without authored lessons. A coverage matrix and one complete
   lesson loop per supported cohort block any claim of universal coverage.
2. **A content pipeline.** Exam packs are hand-authored TypeScript. Full board
   coverage needs structured imports, validation, citations, versioning and a
   human review workflow.
3. **The adaptive model.** Spaced repetition exists, but the Mastery Map,
   Diagnostic Day, concept dependencies and recommendation engine do not.
4. **Remote adult experiences.** Linked learner state is durable, but the
   parent dashboard still reads reports from localStorage on the current
   browser. Teacher classes, assignments and reports do not exist yet.
5. **Assessment beyond MCQ.** Adaptive Quest and the Explanation Generator need
   to know *why* an answer was wrong, which multiple choice barely captures.

## Constraints we honor

- **Web only** and PWA-installable. Runs on her tablet, her dad's laptop, her phone.
- **Offline-resilient after use.** Public books and field-trip media are cached after a successful request. Personalized pages and API responses are never cached, and a fresh offline navigation receives a generic retry page.
- **Privacy first.** Learning state stays on the device unless a parent links the learner for sync or exports a backup. Miss Vidya and the AI Daily Assembly send the context and text required for those features to the configured AI provider.
- **Accessibility** - Devanagari rendering, reduced-motion support, visible focus, semantic controls and continuing screen-reader audits.
- **Speed target** - interaction feedback under 200ms, with slower celebration and transition timing where it helps comprehension.
- **Animation discipline** — Disney's 12 principles applied: anticipation before reveals, gentle slow-in/slow-out on transitions, exaggerated celebrations, never punitive on errors, consistent visual vocabulary.

---

## How we sequence

We don't try to ship 2045 today. We ship the **identity shift** in Phase A, the **daily rhythm** in Phase B, the **adaptive brain** in Phase C, then the labs and the social layer. Each phase ships in 1–3 iterations. Every iteration is deployable.

**Next up:** exact curriculum coverage, complete lesson loops and the concept
mastery model. Content authoring tooling and remote parent reports follow in
parallel because they turn one strong cohort into a product that can scale.
