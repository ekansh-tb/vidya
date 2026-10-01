# Vidya shared world UX proposal

Open `shared-world-prototype.html` directly from disk. It has inline CSS and JavaScript, no dependencies, no remote assets and no persistence. This is a reviewable design proposal, not a runtime implementation. Existing unrelated workspace changes were left untouched.

Documentation review, 2026-10-01: the HTML demonstrates local child and parent interactions only. Working prototype controls are not evidence of production delivery. Component contracts, worldwide curriculum coverage, university and independent-adult flows below remain proposals unless separately verified in the application. For the supplied verified-live curriculum fixes and pending work, use the [curriculum release ledger](../curriculum-audit-october.md#current-release-ledger). This review inspected source and copy only; it did not repeat browser or production acceptance.

## Design decision

In the prototype, one open book forms two visibly different doors into a shared learning world. The child can begin a free sample immediately. The parent can preview a separate guidance space, without inheriting an adult role from navigation. Language and accessibility precede both doors. No nationality, gender, school, age or curriculum is inferred.

Tokens: ink `#17294d`, learning blue `#2446b5`, paper `#f5f8ff`, white `#ffffff`, lilac `#e7e1ff`, yellow `#ffdc68`. Display uses Trebuchet MS with Verdana fallback; controls use system sans; reading uses Georgia. System fonts keep the prototype self-contained, but script coverage and line metrics need device testing. The signature is the two-page doorway, rather than an avatar, flag, leaderboard or AI chat hero. An initial dashboard-card concept was rejected because it obscured the free starting path. Cards appear only after entry as direct activity choices.

```text
Language / direction / accessibility
             Shared world
    Child door       Parent door
    Guest start      Separate identity + explicit link
    Book             Observed activity / interpretation
    Practice         Guidance preferences
    Explore          Optional AI funding and limits
```

## Working interactions and boundaries

The preserved HTML prototype demonstrates the child and parent slice only. The lifelong learning plan below extends that scope; it does not add working university enrollment or an adult permission system to the prototype.

- Guest entry, parent preview, return navigation and keyboard focus movement.
- English UI with explicitly unverified Arabic and Devanagari script samples. Direction is independently selectable. No claim of translated curriculum or verified localization.
- Larger text, stronger contrast, reduced motion and OS motion preference support. Native select, button, details and modal dialog controls. Escape closes dialogs; focus returns to their launch controls.
- Three original sample activities: short reading with an ephemeral draft, a retryable practice question with a hint, and a prediction followed by an explanation. No generated tutoring.
- Curriculum selection with an explicit next-step description. It does not assign content, grades or a default regional requirement.
- Parent link simulation, removal, privacy explanations and parent guidance preference preview. Every relationship is labeled as a simulation.
- Parent report reflects only actual interactions in this tab. Counts are observations; interpretations are explicitly limited. Notes are excluded. Repeated answer selections count separately, including correct repeats.
- Reset clears activity, draft and simulated relationship. It intentionally leaves display and guidance preferences until reload. Nothing persists to disk or an account.

## Component contracts and implementation map

Paths below are existing integration candidates verified by repository listing, not a claim that they already satisfy these proposed contracts. README was read for current architecture and limitations. Runtime source behavior and live services were not audited for this design task.

| Proposed component | Inputs and events | Integration candidate | Required data or guard |
| --- | --- | --- | --- |
| EntryPreferences | `locale`, `direction`, `textScale`, `contrast`, `motion`; emits explicit preference changes | `components/views/settings-view.tsx`, `app/page.tsx` | Translation completeness and review status per locale; script fonts; preference storage policy; no curriculum inference |
| SharedWorldDoors | `guestAvailability`, `parentAuthAvailability`; emits `enterGuest` or `beginParentAuth` | `components/views/onboarding-view.tsx`, `app/parent/page.tsx` | Child entry remains usable when auth or AI is unavailable; route selection never grants a role |
| LearningShelf | `contentAvailability[]`, `selectedCurriculum?`, `selectedLevel?`; emits `openActivity(contentId)` | `components/views/home-view.tsx`, `library-view.tsx`, `book-reader.tsx`, `quiz-view.tsx`, `field-trip-view.tsx` | Content language, provenance, rights, exact level, offline availability and accessibility metadata; distinguish missing content from loading |
| CurriculumChooser | `catalog`, `selection?`; emits explicit curriculum, level and subject choices | `components/views/add-learner-view.tsx`, `subject-picker-view.tsx`, `lib/content/packs/pack-index.ts` | Separate grade from Cambridge stage; require exact content lookup; show gaps; provide free exploration when no match exists |
| RelationshipBanner | `unlinked / pending / linked / revoked / unavailable`, verified parent display identity, sharing scope; emits link or help actions | `components/views/link-account-view.tsx`, `lib/capabilities/server.ts` | Server-authenticated relationship, single-use claim lifecycle, revocation and device authority; a label must never authorize access |
| InquiryActivity | `contentId`, authored prompt, explanation and source; emits answer or explicit activity events | `components/views/quiz-view.tsx`, `notebook-view.tsx`, `tutor-view.tsx` | No hidden inference from notes; AI output identified separately; explicit note-sharing policy; allow non-typed thinking |
| ParentEvidenceReport | events with `learnerId`, `contentId`, timestamp, event type, source device, hint/retry context; interpretations carry uncertainty and provenance | `app/parent/dashboard.tsx`, `components/views/parent-view.tsx` | Authenticated learner scope, aggregation rules, missing/synced/local distinctions; no diagnosis or inferred ability |
| OptionalAIControls | `fundingStatus`, enabled assignment, provider availability, limits and pause state; emits verified parent updates | `app/api/parent/ai-tutors/route.ts`, `lib/ai/tutor-policy.ts`, `lib/ai/parent-tutor-model.ts` | Server-side entitlement and budget enforcement; encrypted credentials; separately approved sponsor entitlement; never expose secrets to a learner |
| PrivacyExplanation | storage mode, actual sharing scope, AI provider data flow, retention/deletion policy | Entry, linking and AI activation surfaces | Policy backed by actual storage and APIs; age/jurisdiction requirements need explicit review, not geography guessed from language |

## Worldwide and lifelong learning extension

The mission covers every curriculum worldwide and learners at all universities, from school through university and continued adult learning. CBSE, ICSE, Cambridge and IGCSE are starting examples, not exhaustive categories or a geographic limit. Cambridge programmes, including IGCSE, must not be categorized as India-only. University content, partnerships, accreditation, translations and verified global availability are not established by this proposal.

Preserve the child door and parent door. Add a distinct independent learner entry in a future enrollment design, with accessible language and display preferences available before role selection. An adult seeking university study or returning to learning must not have to create a parent account, invent a child profile or accept guardian monitoring. University enrollment is not proof of adulthood; minors in university retain appropriate child safeguards. A parent may also learn independently, but the two contexts must have separate permissions.

```text
Shared world and entry preferences
  Child learner -> safeguarded learning, explicit parent relationship
  Parent -> separate authentication, scoped child guidance
  Independent adult learner -> own learning, private reports, optional sharing
    School curriculum / university study / independent lifelong learning
    Explicit programme and level choices -> verified availability or honest gap
```

| Planned component | Contract and data dependencies | Integration boundary |
| --- | --- | --- |
| IndependentLearnerEntry | Explicit intent, eligibility state and independent account authority; no mandatory guardian link; unknown eligibility cannot bypass safeguards | New enrollment design required; existing learner and parent entry components are candidates, not shipped adult routes |
| LifelongStudyChooser | School curriculum or university/independent study; optional institution, programme, discipline, course, level and edition/version; provenance, rights and availability for each content item | Extend catalog beyond board/grade; do not map university years to school grades or imply an institutional partnership from a catalog label |
| AdultLearningHome | Own books, lessons, practice, activities and private progress; optional sharing audience, scope and expiry | Planned adult view and server authorization; neither parent reports nor parent funding is a prerequisite |
| AdultTransitionReview | `child / eligibility-review / eligible-awaiting-consent / independent`; explicit learner confirmation with policy version and time; preview existing links, report access, provider assignments and funding changes | New reviewed transition service; do not promote by date rollover, selected university or navigation alone |
| AdultSharingControls | Purpose-specific opt-in, recipient identity, scope, expiry and revocation; no automatic continuation of parent reporting | Enforce grants on the server; separately authorize any continued historical access; explain that revocation cannot erase copies previously exported |
| AdultOptionalAI | Adult-controlled funding choice, provider disclosure, budget and pause state, or separately approved sponsor entitlement | New policy and entitlement work; a payer or sponsor gains no learning-data access merely by paying |

Transition requirements: establish eligibility under a reviewed policy without inferring age or jurisdiction from curriculum, script or nationality. Show the learner what changes before explicit consent. On a completed transition, end guardian-derived grants and invalidate related access tokens and sessions; any continued sharing needs a new, scoped adult authorization. If consent is deferred or eligibility is unresolved, do not silently convert roles or treat old child consent as permission for indefinite adult monitoring. The handling of retained historical reports and access during review needs a specified policy and server enforcement before launch. Retain child protections for ineligible users and provide an accessible correction/help path.

Availability states must distinguish verified content, partial content and unavailable content, with last-reviewed provenance. Allow free exploration and an explicit “not listed” path without substituting a different curriculum or promising future delivery. Institutional discovery is not affiliation or accreditation. Do not present unavailable university content as an enrollment CTA.

Additional acceptance cases for the planned flow: an eligible adult without a guardian can enter independent learning; a minor university learner cannot bypass child safeguards; a parent’s own study profile cannot expose child data; a transition requires explicit confirmation; old guardian grants cannot fetch newly private data after transition; declining or revoking adult sharing blocks recipient access; changing language leaves programme and permission choices intact. These cases are requirements, not passing tests in this task.

## HyperFrames provenance and adaptation

Read the user-requested frontend-design, HyperFrames entry and HyperFrames registry skills in full. This is an app UX layout, not a timed composition, so no video workflow, runtime, registry item installation or package changes were performed.

Catalog inspected during the original design task using Node 24. Portable command, with the machine-specific executable path omitted:

```sh
npx hyperframes catalog --query 'page-slide conic-progress-ring chat-message modal-morph' --json
```

Observed response: `tier: words`, `tier_detail: local word match`, `total: 386`, `shown: 54`, `dropped: 0`, `unindexed: 0`. Output was filtered to six results. This establishes catalog metadata only. Item source, animation rendering, accessibility and suitability for runtime reuse were not verified. Catalog freshness beyond the CLI response was not independently verified. The registry skill documents the upstream [registry manifest](https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry/registry.json).

| Catalog entry | Observed metadata | UX decision |
| --- | --- | --- |
| `page-slide` | Component; outgoing and incoming page panels, inspired by transitions.dev | Inspiration for retaining context between choices and an activity. Prototype uses a brief vertical reveal, not copied slide code. Remove motion under OS or user preference. |
| `conic-progress-ring` | Component; angular fill and center count driven by a percentage | Not used. A ring risks implying mastery from sparse activity. Plain observed counts are more honest. |
| `chat-message` | Component; typed message variants, corner-origin entry, mock UI tag | Useful conceptual distinction between a child question and an AI reply. Deferred because AI is optional and off; do not import a video message animation as an accessible chat component. |
| `modal-morph` | Component; measured shared-element transform between card and panel | Inspiration for contextual disclosure only. Native dialog provides modal behavior in the prototype; morph animation is omitted. |

## Backend and product work not implemented here

This artifact adds no backend. README documents existing parent auth, linking, encrypted provider storage, assignments and usage controls; those should be integrated and verified, not described as absent. The earlier browser-local-only description of parent reports is superseded: current `app/parent/dashboard.tsx` loads synced reports through `loadOwnedReport`, displays their source, and explicitly avoids substituting a local report when synced progress is unavailable. This is source evidence, not a new live acceptance claim or proof that the proposal's complete event and interpretation contract is delivered.

Before integrating this proposal, verify the remaining contracts against the current application: reviewed locale catalogs and content translations; curriculum/level availability presentation; production sharing and deletion policy; report aggregation with per-event source and hint/retry context beyond loading synced state; approved sponsorship policy and entitlement service; server-backed handling of this prototype's exact guidance preference; pending/revoked/offline relationship presentation; provider disclosure and activation review. This is an integration checklist, not a claim that every underlying capability is absent. No entitlement, consent, localization or AI reliability claim is established by this mockup. Do not promise perfect teaching.

## Review checklist and validation limits

1. Start with no enrollment. Adjust language sample, direction and text size before choosing a door.
2. Enter as a guest. Open each activity, answer incorrectly and correctly, reveal a hint, and write an optional temporary draft.
3. Preview the parent report. Confirm counts describe actions and do not claim comprehension; confirm draft text is absent.
4. Simulate linking, return to the child view and inspect the visible relationship. Simulate unlinking. Confirm both remain labeled demo states.
5. Select each curriculum option. Confirm there is no automatic grade, country, school or regional-language requirement.
6. Test 320px, 390px, tablet and desktop widths, 200% zoom and large text. Test RTL independently of language samples, including focus order, dialogs and the report table. The table can scroll horizontally inside its wrapper.
7. Use keyboard only: skip link, preferences, door choice, activity, modal open/close with Escape and focus return. Check with a screen reader and actual Arabic/Devanagari font environments.
8. Enable OS reduced motion and the explicit reduced-motion control. Confirm the activity reveal disappears. Verify color contrast in the rendered interface, including focus and hover states.

Static checks cover JavaScript parsing, duplicate IDs, local ID references, absence of external dependencies and forbidden punctuation. Browser, mobile and assistive-technology acceptance remain for the main agent, as requested. No browser UI was operated. No runtime tests, deployment or Git publication are claimed.
