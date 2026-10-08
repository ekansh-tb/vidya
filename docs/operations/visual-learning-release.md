# Visual learning and instruments, 8 October 2026

## Implementation

The music room has six synthesized instruments: Mini Piano, drum pads, marimba, synthesizer, harp and flute tones. Piano has chromatic keys, octave selection, an optional wider keyboard, native key buttons and letter shortcuts. Preschool starts with five natural notes; song practice reveals the full required octave. All instruments retain shared mute and volume routing. Recorder and composition controls are expandable. No microphone, camera, downloaded samples or paid provider is required.

Legacy note IDs 0 through 7 retain C4 D4 E4 F4 G4 A4 B4 C5. Additional pitches are encoded as 100 plus MIDI, restricted to C3 through C6. Earlier compositions and timing remain readable. These new note IDs and harp/flute voices require this release or later for faithful playback. Rollback must preserve these readers, the visual-lab state reader and learning point resume fields. No database schema migration is needed. Existing databases, profiles and compositions are retained.

Music has one original optional prompt for each Nursery, LKG, UKG and Grade 1 through 13 placement. They are general exploration, not curriculum coverage or an assessment. Music prompts and new instrument surface text support English and Hindi; existing composition/song controls still contain English copy.

Visual playground provides exact-placement starting models: preschool counting, Grade 1 number frames, Grade 2 arrays, Grades 3 and 4 equal parts, Grade 5 equivalent fractions, Grade 6 ratios, Grade 7 percentages, Grades 8 and 9 lines, Grade 10 quadratics, Grade 11 sine waves, Grade 12 tangent slope and Grade 13 compatibility exploration. A corrected or missing placement does not reuse another level's saved setup. Controls use native buttons/ranges; numerical labels and shape differences accompany graphics. English is default, Hindi is available. The workspace saves bounded values through the existing account cache/synchronization mechanism with latest-edit conflict resolution. It adds no tracking, rewards, scoring, public sharing or parent-report metrics.

Study collections now show one point with Previous/Next and an optional point picker. The selected point's content address is saved alongside subject, exact placement and topic. Inserting a different point does not shift the resume location. Removed or edited text produces an explicit changed-lesson notice. Historical confidence entries remain unchanged. Existing topic-only resume records remain compatible.

## Editorial decision and review record

Original exploration configuration revision: 1. Implementation/editorial reviewer: Codex, 8 October 2026. These records do not assert independent expert review or add published entries to the activity catalog. Existing school activity publication gates remain Grades 1 and 2.

- Factual check: deterministic counter, array, equal-part, ratio, percentage and graph formula tests. Musical pitch conversion tests retain A4 = 440 Hz, the octave frequency relationship and legacy IDs.
- Developmental check: early years use bounded counters and five-key free play with caregiver prompts. Grade is a presentation starting point, not an age or ability inference. Independent developmental review remains pending.
- Language check: original English/Hindi task text and new visual controls reviewed for consistency. Specialist language review and broader composition-control translation remain pending.
- Accessibility check: keyboard controls, concise accessible graphic descriptions, touch targets, no required drag, visible text equivalents, reduced-motion CSS, light/dark contrast inspection and horizontal piano scrolling with visible guidance. Device and assistive-technology acceptance is recorded separately below.
- Rights check: original code, CSS and task copy; no third-party illustration, recording or screenshot was copied into the product. Existing installed Lucide/Tone dependencies are retained.

Child agency favours free exploration without timers or accuracy scores. Parent trust favours honest save state and no inferred ability report. Teaching value favours one manipulated quantity at a time, with visible results. The limited model selection and grade starting points need child/educator feedback. No retention, mastery or wellbeing improvement is claimed.

## Validation

Final local type checking, lint and 1,216 tests passed. The dependency audit found zero vulnerabilities; 34 security and migration-runner checks passed. 110 database-dependent tests are skipped locally and require isolated CI integration. Browser checks cover 16 exact-placement visual configurations at 320 pixels, all six preschool instruments at 320 pixels, the 24-key piano at 320/820/1366 pixels, English/Hindi and light/dark examples, keyboard-triggered notes, a synthetic chromatic composition retained after reload, visual value reload, and exact CBSE Grade 7 lesson-point reload. No browser console errors were observed in the isolated instrument fixture. Temporary fixture routes were removed before the final production build. Public cache version is 2026-10-08-visual-1; the required account compatibility version remains unchanged.

Local synthetic browser cache and isolated rendering fixtures are not proof of server persistence, physical audio audibility or physical-device usability. Final CI, production deployment and production browser acceptance are recorded separately after release. No child usability, specialist educator/language validation, learning or retention evidence has been collected by these checks.
