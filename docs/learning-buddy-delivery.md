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
- Parent entry deployed as `e6d0a7169996e63164975b81ad69f05136a3eb32` (PR 83). The exact parent-domain root routes to `/parent`, and sign-in returns there. The signed-in production Parent Portal was observed in the browser. The canonical learner-domain root retains its learner entry.
- Parent follow-up deployed as `4fd7ed00669f132782d3b620d3f0472dcbea8557` (PR 85). The Parent Portal's Kid App link points to `https://vidyagyan.study`. Unfinished local enrollment remains saveable without weakening server placement validation. CI and 29 focused placement/backup tests passed; both production health endpoints returned this commit. Browser acceptance of this follow-up remains pending after repeated browser-control timeouts.
- Activity release contains 90 preschool entries, 30 per level, English/Hindi, six areas of five entries. Each level has explicit scaffolding, some reusable mechanics and overlapping everyday topics. This is not 90 unrelated lesson concepts, nor complete curriculum coverage. Hindi rhyme options have separate words and pictures. Original text and system emoji avoid external asset dependencies.
- Review records describe the actual source-grounded editorial review by the implementing agent, with factual, developmental, language, accessibility and rights checks. They explicitly do not assert independent educator validation, clinical advice, or consented child usability research. Those reviews remain required evidence for further curriculum expansion.
- School general exploration is enabled in successive groups through `lib/learning/release.ts`. Existing supported curriculum practice retains exact board/grade routing. Three starter activities per grade are a small exploration collection, not syllabus coverage.
- New activity completion is idempotent by identity/revision/day/source, separate from legacy XP. Only distinct learning days drive permanent decorations. App and caregiver reports remain distinct. Canvas creations persist; merge unions completion keys and retained artwork. Parent reports allowlist evidence and exclude draft artwork and device-local measurement.
- Guest usage counts live only under `vidya:local-measurement:v1:*`, outside GameState, sync, reports and network requests. Only dates, numeric counts, declared placement/language and viewport category are recorded. No names, care notes, recordings or free text. D1/D7/D30 are local observations with immature windows marked unknown. No server behavioural analytics or analytics consent is introduced.

### Anekantavada decision record: starter activities

Child: large choices, free retries, no timer pressure, original Tara companion, retained unlocks and creative/offline alternatives. Parent: transparent evidence limits and reports, exact placement, server-side preschool AI denial. Teacher: explicit objectives, general-exploration labels and a bounded source-grounded collection. Development: short steps, caregiver scaffolding, movement alternatives and progression from naming to comparing; independent validation pending. Accessibility: native keyboard controls, tap alternatives, text/voice fallback, reduced motion and responsive surfaces. Language/culture: independently authored Hindi rhyme pairs and explicit English/Hindi switching; Marathi legacy content retained. Engineering: stable revisions, storage v3, additive SQL, family-scoped reads/writes, deduplicated completions and saved drawings.

Conflicts: extra explanatory choices can lengthen UKG sessions; caregivers may stop at any point. Local speech synthesis cannot guarantee Hindi voices. Emoji appearance varies by operating system. Participation counts cannot establish comprehension. Device-local return counts are not a population retention baseline. These uncertainties stay visible rather than being converted into claims.

### Activity release acceptance status

PR 84 is implemented and its pre-follow-up CI passed. It is not merged or deployed to production. The latest compatibility changes are included before the next CI run. Local Hindi UKG enrollment, constructive wrong-answer feedback, a free hint, pause, reload, resume and English switching were observed. The complete activity was not finished in that check. A hosted preview's fresh entry was observed, but subsequent browser operations timed out repeatedly. Nursery, LKG, complete UKG, school Grade 1/2, and synthetic parent linking/revocation/recovery journeys remain unaccepted. Keep the launch held until these checks succeed. Browser health or CI alone does not qualify it.

On 4 October, browser control recovered. A full Nursery matching activity was completed with wrong-answer feedback, free help, reload, English/Hindi switching and retained correct-response feedback. Recorded evidence showed three attempts, one independent response, one hint and one retry. A full Hindi LKG counting activity was completed, revealing that the instruction's object-touch action was not implemented. The updated player now has concrete counting objects, saved counted marks, corrected counting prompts and separate Grade 1/2 groups. Counting activities use revision 2 so earlier records retain their original identity. These changes require fresh browser acceptance.

Saved artwork now has a Make gallery showing the latest picture per activity/day, up to eight recent pictures. Preschool no longer displays a fake Custom board in the learner picker. Parent-only roster reports explicitly disable ephemeral note/local-setting editing, and preschool setup explains scripted guidance rather than AI unlocks. Legacy school surfaces are still not fully bilingual or reviewed by interaction demands. These remain outstanding work.

The refreshed dependency audit identified GHSA-vfj7-8cjw-p6xm in braces 3.0.3 with no upstream patched release. A private MIT-preserving fork bounds parser and AST walker depth; its installed entry points have malicious-pattern/direct-AST and ordinary-glob regressions. `vendor/braces/VIDYA-PATCH.md` records the actual mitigation and removal condition. The clean install audit reports no known vulnerabilities without ignored advisories or a lower severity threshold. Other dependency versions are preserved. Browser and full CI gates still apply.

### Ranked follow-up backlog

1. Independent educator, developmental and Hindi literacy review of each starter; consented usability sessions by level, language and access need.
2. Complete authenticated production parent linking/revocation/recovery acceptance using a synthetic learner. Never reuse a real child's profile for testing.
3. Review and tag legacy books, music, field trips, wellness and notebook activities for declared placement and interaction demands. Preschool cannot enter unreviewed legacy routes. School legacy areas remain clearly separate from the newly reviewed starter system.
4. Richer school-grade investigation, construction and simulation collections. Current general exploration is intentionally bounded; unavailable curriculum stays labeled.
5. Parent-controlled time budgets across devices, reading-comfort preferences and large-text testing. Existing parent AI/capability controls remain enforced; do not present a soft reminder as an enforceable limit.
6. Establish an actual research baseline before retention or learning improvement claims. Server measurement remains disabled until jurisdiction-specific purpose/consent review.
7. Weekly prioritization from production failures, content gaps, parent/teacher feedback and consented child research. Release and verify changes individually.

## Account transition and motion release, 4 October 2026

Implemented locally: database-owned roster, parent enrollment saves directly to the account, parent/local enrollment retries share a parent-scoped identity, and child enrollment uses a single-use device code without repeating name or grade. Legacy unlinked browser profiles cannot open learning automatically; archives remain recoverable but are not enrolled identities. No child, parent, Clerk account, book or content row was deleted. This follows the owner's fresh-start authorization while avoiding an unnecessary destructive purge.

The public service-worker compatibility release refreshes older tabs through the existing acknowledgement protocol only after the new public shell is fetched. APIs, parent pages and authentication responses remain uncached. Linked sessions retain their offline cache and resume synchronization on reconnection. Save status distinguishes account save, pending/offline cache and failure. Pending requests from a switched learner cannot apply their response to the new active learner.

Production driver evidence: the synthetic UKG report stored one creation at revision 2; Neon returned `updated_at` as a Date. `String(Date)` failed the report's ISO contract. Query mapping now normalizes timestamps to ISO. Parent roster comes from the ownership-scoped database list; duplicate local representations of the same remote learner no longer become extra parent learner entries.

Original 3D Tara asset (Three.js, dynamically loaded) draws on demand and stops after brief interactions. Authored illustration survives failed model loading or unavailable WebGL. Framer Motion hover/tap/scroll reveals honor OS reduced motion and the learner's animation toggle. Music remains opt-in; sound can be muted; optional 12ms haptics default off and gracefully skip unsupported devices. HyperFrames generated a silent three-second single-play celebration, with documented render checks. Nursery/LKG/UKG creation grids are 4x4/5x5/6x6 for new drafts; old 8x8 drafts remain viewable.

Shared perspectives: children get one code entry and no password; parents own enrollment and revocation; teachers get observed-practice evidence rather than mastery claims; accessibility preserves instructions without sound, motion or 3D. Reliability keeps recoverable cache and uses database ownership. Conflicting tradeoff: requiring parent enrollment removes immediate guest play and needs connectivity for first use. Owner explicitly requested account-backed sessions. This release does not establish age/guardianship verification, human educator review, retention gains, push notifications or complete cross-device offline acceptance.

Private sponsor dashboard built outside the repository and public app. Official programs researched on 4 October; Outlook Vidya conversation searched, Clerk follow-up read. Three sent emails, three recorded form receipts and zero confirmed awards remain distinct. No new outreach was sent. Sponsor source pages and eligibility uncertainty are recorded in the dashboard.

Verification and deployment status for this increment must be filled from final CI and browser results before production merge.

Preview acceptance on 4 October: parent enrollment created Nursery, Hindi LKG, Grade 1 and Grade 2 as server-owned learners without repeated child enrollment. Full Nursery matching included a wrong answer, free hint, keyboard response, reload/resume and language switching. Hindi LKG counted four touchable objects, blocked repeated counting and completed both steps. Grade 1/2 completed distinct three/six-object exploration with curriculum gaps honestly labeled. UKG revocation returned to account entry at the next online check; fresh-code recovery restored the saved creation and permanent leaf. Parent reporting read validated server progress. Separate-family isolation is tested in the isolated database suite, not claimed as a two-real-account browser result.

The school-template audit found 11 unique template identities. All 129 activity identities are unique. A step-level audit found two duplicated UKG counting finals; revision 3 now explores one fewer object. Reused interaction mechanics across placements remain intentional, not a claim of 129 wholly different games. No content or books were deleted.

English remains the default for fresh entry and profiles. Explicit Hindi choices retain their progress. The account cache recovery helper retains previously linked, pending offline work after code recovery without importing unlinked legacy archives. GSAP 3.15.0 now drives finite Three.js/WebGL reactions. The mesh and high-DPI canvas defects found in browser checks are repaired; the versioned asset avoids reusing an older cached mesh. Latest local typecheck, lint and tests pass: 890 tests with 87 database-dependent tests skipped locally. CI executes the database suite separately. Production rollout and final GSAP preview acceptance remain pending at this record; the PR release comment will retain deployment and post-release evidence.

Remaining evidence limits: independent child/developmental/Hindi educator validation, physical iPad/haptic/audio checks, full multi-device offline conflict acceptance, push notifications and learning/retention improvement. Device-local appearance, language and legacy notes/syllabus preferences are not represented as database-backed history. The database owns enrollment, placement, progress and family/device controls; the offline cache still serves previously linked devices.

PR 84 merged as `2042edf1d0d88c9d12292a320f17b09040b24659`. Production deployment `dpl_86EW9UuQ1mmQkBvgYcKPTyjJZiej` is Ready in techbirdit-ej/vidya; both public health endpoints report that commit. The anonymous root and current mesh return cacheable 200 responses. An older unlinked production profile returned to account entry on revisit. A synthetic production Nursery learner was parent-created, device-linked, and completed a full activity in English with account saving. No real learner was used for testing.

Live acceptance found a misleading update banner on the dedicated parent host: its root redirects to authenticated parent content and cannot cache a public learning shell. The follow-up scopes learning-worker registration and notices to the public child root, including client-route transitions. Parent and login pages remain network-backed. This avoids reinstalling the child-shell updater on dedicated parent/teacher hosts without clearing any existing caches or account data. Local verification now passes 891 tests; follow-up CI and production acceptance remain pending until its PR release record. Automatic refresh of every already-open or offline historical client is not claimed as browser-accepted; account gating on production revisit is accepted.
