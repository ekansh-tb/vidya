# Vidya Verse — Blueprint

> "School isn't a building. It's an experience. By 2045, that experience lives in a window."

## North Star

**Vidya stops being a quiz app the moment a kid opens it and feels they've walked into a school, not a game.**
A 20-year-out reading of where personal learning is going: classrooms become rooms in software, teachers become persistent AI personalities, peers become async collaborators, the curriculum becomes adaptive, and the school day becomes a ritual a child *wants* to enter.

Anchor: Grade 5, Cambridge Primary Stage 5 + Maharashtra State Board (Marathi/Hindi). Single-learner first, multi-tenant ready.

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

## Phase A — Foundations (shipping now)

| | Pillar | Status |
|---|---|---|
| 1 | **Vidya Verse Lobby** — replaces home; live school clock, current period, classroom doors, companion, assembly card, field-trip teaser | ⏳ |
| 2 | **Miss Vidya AI Tutor** — chat with an AI teacher per subject, server-side via Vercel AI Gateway | ⏳ |
| 3 | **Diya** — persistent companion that grows with XP, reacts to events, anchors the experience | ⏳ |
| 4 | **Field Trip mode** — explore Mars / caves / monuments with Wikipedia + facts mini-quiz + passport stamps | ⏳ |

Already shipped (last iteration): variety fix, 6/7 meme overlay, post-quest summary w/ review, custom avatar upload, skim-the-book panel, Match Quest mode, Friend Streak.

---

## Phase B — School Day (next iteration)

- **Period clock & timetable** — Homeroom → Maths → Recess → Science → Lunch → English → Library → Sports → Assembly. App suggests the right activity for the time of day.
- **Class Atmospheres** — each Classroom view dresses itself: Maths chalkboard, Science lab benches, Hindi/Marathi reading corner, GK globe room. Ambient sound per room.
- **Notebook** — rich-text per subject. Auto-save. Voice-to-text on mobile.
- **Library** — curated Grade 5 reading list (Panchatantra, Ruskin Bond, Amar Chitra Katha, Roald Dahl, NCERT supplementary, age-appropriate poetry).
- **Art Studio** — drawing canvas (touch + stylus), AI critique with "kind teacher" prompt.
- **Music Room** — Tone.js sandbox: compose a melody, learn raagas, build a tabla loop.
- **Daily Assembly** — once-a-day greeting from the AI principal with a thought-for-the-day. Builds the "ritual of entering school."
- **Wellness break** — guided breathing, posture stretch, water reminder. Imagined from Maharashtra board's *Tula Mahit Aahe Ka* / *Stress-Less* modules.

---

## Phase C — Adaptive Brain

- **Mastery Map** — every concept (not topic) tracked. Graph of dependencies (multiplication needs addition; fractions need division; perimeter needs multiplication). Map paints itself as she progresses.
- **Adaptive Quest** — quiz generator picks weakest concepts; Match Quest picks topics she hasn't seen in a week; spaced-repetition queue surfaces yesterday's misses.
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

## Constraints we honor

- **Web only** (PWA-installable). Runs on her tablet, her dad's laptop, her phone.
- **Offline-friendly** for core practice — quizzes, notes, library cached.
- **Privacy first** — child data stays on device unless an explicit parent action exports it.
- **Accessibility** — Marathi & Hindi rendering (Devanagari), reduced-motion fallbacks everywhere, screen-reader pass.
- **Speed** — every interaction under 200ms; celebrations at 600–800ms; transitions 300–400ms (per the education-learning timing table).
- **Animation discipline** — Disney's 12 principles applied: anticipation before reveals, gentle slow-in/slow-out on transitions, exaggerated celebrations, never punitive on errors, consistent visual vocabulary.

---

## How we sequence

We don't try to ship 2045 today. We ship the **identity shift** in Phase A, the **daily rhythm** in Phase B, the **adaptive brain** in Phase C, then the labs and the social layer. Each phase ships in 1–3 iterations. Every iteration is deployable.
