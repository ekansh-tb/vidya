# Learning buddy delivery

## Release 1: shared foundation

Four learning destinations replace the crowded home. Today gives one curriculum suggestion and a resumable classroom. Explore keeps subject availability explicit. Create retains music and notebook. My Journey retains profile, collections, reflections and saved questions. Parent notes and upcoming plans remain available.

Hints and narrowing choices are free. Historical currency, inventory and streak records are preserved. Absence no longer resets a streak or spends a freeze. Existing simulated classroom scores are labeled. New learners explicitly choose board and grade.

## Perspective record

| Perspective | Decision and evidence boundary |
| --- | --- |
| Child | Fewer competing actions, help without spending coins, a welcoming return. Enjoyment and return improvement require observation. |
| Parent | Parent notes, private reflections and saved progress remain accessible. No new telemetry is sent. |
| Teacher | Curriculum availability remains exact-grade. Practice attempts are not called mastery. |
| Development | Grade affects presentation, not verified age or legal eligibility. Preschool remains a separate next release. |
| Accessibility | Named navigation, visible focus, minimum 44px controls and no required motion. Browser and assistive-technology checks are recorded separately. |
| Language and culture | Existing subject languages are preserved. Full English/Hindi activity localization belongs to the activity release. |
| Engineering | Existing profile identities and schema remain unchanged in release 1. CI and browser checks precede deployment. |

## Following releases

Placement compatibility, reviewed early-years activities, five experience modes, a completion ledger and local habit measurement follow the shared release. No current retention improvement or complete curriculum coverage is claimed.

## Compatibility floor and activity release

- Foundation deployed as `b1843ad1f5c95370073f2a852cf84f40f0e84eac` (PR 81). Production identity matched Vercel project `prj_hIwxGlbWhwW5EFCCa2mgKZlSCbvb`; both health endpoints matched the commit. Today/Create navigation accepted in the production browser, including the fixed bottom bar.
- Compatibility floor deployed as `f5b79cb7577c26d1d1b226b2d78d30d72a9b15d9` (PR 82). Additive `0011_learning_placement.sql` applied via the serialized migration runner after CI PostgreSQL tests passed. Both production health endpoints matched the floor. Do not roll back below this application/storage model once preschool profiles exist. Retain database changes.
- Activity release contains 90 preschool entries, 30 per level, English/Hindi, six areas of five entries. Each level has explicit scaffolding, some reusable mechanics and overlapping everyday topics. This is not 90 unrelated lesson concepts, nor complete curriculum coverage. Hindi rhyme options have separate words and pictures. Original text and system emoji avoid external asset dependencies.
- Review records describe the actual source-grounded editorial review by the implementing agent, with factual, developmental, language, accessibility and rights checks. They explicitly do not assert independent educator validation, clinical advice, or consented child usability research. Those reviews remain required evidence for further curriculum expansion.
- School general exploration is enabled in successive groups through `lib/learning/release.ts`. Existing supported curriculum practice retains exact board/grade routing. Three starter activities per grade are a small exploration collection, not syllabus coverage.
- New activity completion is idempotent by identity/revision/day/source, separate from legacy XP. Only distinct learning days drive permanent decorations. App and caregiver reports remain distinct. Canvas creations persist; merge unions completion keys and retained artwork. Parent reports allowlist evidence and exclude draft artwork and device-local measurement.
- Guest usage counts live only under `vidya:local-measurement:v1:*`, outside GameState, sync, reports and network requests. Only dates, numeric counts, declared placement/language and viewport category are recorded. No names, care notes, recordings or free text. D1/D7/D30 are local observations with immature windows marked unknown. No server behavioural analytics or analytics consent is introduced.

### Anekantavada decision record: starter activities

Child: large choices, free retries, no timer pressure, original Tara companion, retained unlocks and creative/offline alternatives. Parent: transparent evidence limits and reports, exact placement, server-side preschool AI denial. Teacher: explicit objectives, general-exploration labels and a bounded source-grounded collection. Development: short steps, caregiver scaffolding, movement alternatives and progression from naming to comparing; independent validation pending. Accessibility: native keyboard controls, tap alternatives, text/voice fallback, reduced motion and responsive surfaces. Language/culture: independently authored Hindi rhyme pairs and explicit English/Hindi switching; Marathi legacy content retained. Engineering: stable revisions, storage v3, additive SQL, family-scoped reads/writes, deduplicated completions and saved drawings.

Conflicts: extra explanatory choices can lengthen UKG sessions; caregivers may stop at any point. Local speech synthesis cannot guarantee Hindi voices. Emoji appearance varies by operating system. Participation counts cannot establish comprehension. Device-local return counts are not a population retention baseline. These uncertainties stay visible rather than being converted into claims.

### Ranked follow-up backlog

1. Independent educator, developmental and Hindi literacy review of each starter; consented usability sessions by level, language and access need.
2. Complete authenticated production parent linking/revocation/recovery acceptance using a synthetic learner. Never reuse a real child's profile for testing.
3. Review and tag legacy books, music, field trips, wellness and notebook activities for declared placement and interaction demands. Preschool cannot enter unreviewed legacy routes. School legacy areas remain clearly separate from the newly reviewed starter system.
4. Richer school-grade investigation, construction and simulation collections. Current general exploration is intentionally bounded; unavailable curriculum stays labeled.
5. Parent-controlled time budgets across devices, reading-comfort preferences and large-text testing. Existing parent AI/capability controls remain enforced; do not present a soft reminder as an enforceable limit.
6. Establish an actual research baseline before retention or learning improvement claims. Server measurement remains disabled until jurisdiction-specific purpose/consent review.
7. Weekly prioritization from production failures, content gaps, parent/teacher feedback and consented child research. Release and verify changes individually.
