# Curriculum and tutor scope audit

## Current release ledger

Updated 2026-10-01 from release checks recorded during delivery. Use this ledger for release status; the historical audit below preserves the original evidence, not a list of defects confirmed to remain in production.

| Workstream | Release evidence | Status and boundary |
| --- | --- | --- |
| Assembly curriculum routing, finding 10 | [PR68](https://github.com/ekansh-tb/vidya/pull/68), commit `5e2a181` | Verified live during release acceptance. Original reproduction below is historical. |
| Tutor curriculum scope and trust, findings 1, 5 and 11 | [PR69](https://github.com/ekansh-tb/vidya/pull/69), commit `4dce4d6` | Verified live during release acceptance. Original prompt and request-trust defects below describe the earlier snapshot, not a fresh finding against this release. This does not establish actual school curriculum verification. |
| Review provenance and identity, findings 3 and 4 | [PR72](https://github.com/ekansh-tb/vidya/pull/72), commit `6a48507` | Verified live during release acceptance. Preserve the earlier reproductions as regression evidence. |
| Mapping and provenance labels, finding 2 and pack sample review | [PR73](https://github.com/ekansh-tb/vidya/pull/73), commit `cb71051` | Verified live during release acceptance. Label corrections do not implement a separate curriculum-stage model or verify a school's actual curriculum. |
| Science and English content corrections, findings 8 and 9 | [PR74](https://github.com/ekansh-tb/vidya/pull/74), production commit `c92a337d555fa0512d9a63c6c7196ed85c66e63d` | Verified production during release acceptance: both `/api/health` and `/api/health/ready`; live English question 4 includes the original extract and a model answer with limited inference; live Science cheat sheet instructs learners to retain and investigate unusual readings. Original findings below remain historical evidence. |
| School overlay provenance and confidence, findings 6 and 7 | [PR76](https://github.com/ekansh-tb/vidya/pull/76), commit `6eaaf01` | Verified live: keyboard-selected confidence upgrades persist after reload; review copy describes scheduled progression. Isolated tests cover cross-device entry preservation and recorded-time conflict resolution. Upload board/grade binding remains unresolved. |

Still unresolved: a separate curriculum-stage model and compatibility plan; verification against actual curriculum editions and school documents; and binding uploaded syllabuses to board and grade. Neither corrected labels nor authoritative stored profile fields establish educational accuracy. Other sampled limitations below are not automatically closed by these releases. Release states are a dated snapshot, not continuously refreshed CI results.

## Historical audit snapshot

Everything below this heading records the original 2026-10-01 source audit and its follow-up, before the releases listed above. Terms such as “current”, “still”, “open”, and “actionable” refer to that inspected snapshot. File hashes, line numbers, test counts, reproductions and recommended delivery order are retained as historical evidence; they must not be read as current release diagnostics. The release ledger above takes precedence where fixes have shipped.

Date: 2026-10-01. Read-only source audit of the shared workspace. Only this report was added. No learner records, credentials, production requests, source changes, migrations or deployment were used. The user reports PR61 merged and live acceptance for new and retained subject choices; this audit does not independently reverify that release.

Status: complete for the inspected scope. Eleven actionable findings are recorded below, including four P1 findings. Completion of this audit does not mean the defects are fixed or that worldwide curriculum coverage has been verified. Finalization reconfirmed the tutor route hash and directly retrieved the official Cambridge Primary stages article and NIST outlier guidance. No personal learner details are included.

## Verified scope and snapshot

### Focused recheck: request trust, routing and Grade 6 provenance

Rechecked the current workspace after the follow-up instruction. The tutor route still matches the snapshot hash below. No real learner names or profile data were used. The three requested issues remain open in this snapshot:

| Priority | Current evidence | Required correction |
| --- | --- | --- |
| P1, finding 11 | `lib/db/queries.ts:29-31,570-573` supplies stored grade, board and school; `app/api/tutor/route.ts:467` retains only the authenticated ID; line 582 uses request metadata for the prompt. | Bind prompt scope to validated server-held learner context. A correctly authenticated request must not choose a different policy grade or board through its body. |
| P1, finding 1 | `app/api/tutor/route.ts:185` still treats grade 9 or above as IGCSE; lines 175-177 invent school context when absent. | Remove grade-based curriculum inference and invented schools independently of fixing metadata trust. Both defects need regression coverage. |
| P1 mapping and P2 provenance, finding 2 and sample review | Grade 6 pack contexts still assert a specific school and Stage 7: `cls7-maths.ts:45`, `cls7-science.ts:30`, `cls7-english.ts:45`, `cls7-humanities.ts:72,518`, `cls7-gp-ict.ts:41,489`. | Separate framework/stage, local grade mapping, authored examples and verified school assignment. Do not change saved learner mappings automatically. |

Official-source search was refreshed for [Science 0893](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/science/), [Humanities 0839](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/humanities/) and [Cambridge Primary stages](https://help.cambridgeinternational.org/hc/en-gb/articles/360000048218-At-what-age-should-children-start-following-Cambridge-Primary-curriculum-frameworks). It confirms subject identities, broad curriculum structure and six Primary stages. It does not establish any learner's school affiliation, a universal Grade 6 to Stage 7 mapping, or objective-by-objective correctness of the authored packs. Earlier full-page retrieval failures and restricted-framework limits remain documented below. The earlier 144-test result was not rerun for this documentation-only recheck.

Inspected tutor prompt construction and request fields, tutor UI context, assembly fallback, board/stage modeling, pack lookup and school overlays, quiz/review identity, and confidence storage. Sampled the Cambridge Lower Secondary packs registered at app Grade 6: Mathematics, Science, English and History, plus Global Perspectives/ICT metadata. These are selected samples, not a complete content, translation, safeguarding or university audit.

The tutor route is concurrently owned by Zeno. Findings below describe the inspected snapshot, not a claim that subsequent changes remain defective. Its SHA-256 was unchanged between prompt reproduction and final source check: `2c6057710ecacf10dc2f414f4862d5d5305846e8b7a700e14064f26374cad9b5`. Recheck that file before implementing any recommendation. Line numbers refer to this workspace snapshot.

Validation performed:

- Seven existing test files passed, 144 tests: pack-index, pack registry, question availability, school syllabus, curriculum coverage audit, API guard and spaced repetition.
- Coverage audit: 32 board/grade combinations, 47 indexed packs, 6 admitted question banks, 0 structural issues. Reported coverage: 1 supported, 5 partial, 26 unavailable. These labels describe the app catalog, not worldwide completeness or independently verified educational quality.
- Executed extracted prompt construction in memory, without importing the live API handler or making provider calls. Used synthetic curriculum inputs only.
- Executed synthetic school overlays and review-card admission checks in memory. Scanned existing question data for duplicate stems and recalculated selected maths answers.
- No full build, browser acceptance, real AI response evaluation or authenticated school framework access was performed. Passing existing tests does not cover the defects below.

## Historical prioritized findings

### 1. P1: Tutor selects the wrong curriculum and invents school context

Locations: [route.ts:175](../app/api/tutor/route.ts#L175), [route.ts:185](../app/api/tutor/route.ts#L185), [route.ts:270](../app/api/tutor/route.ts#L270), [guard.ts:67](../lib/api/guard.ts#L67).

Reproduction on the inspected snapshot:

| Explicit input | Generated prompt behavior |
| --- | --- |
| CBSE, Grade 6, no school | Cambridge Primary Stage 5, a named Pune school and age 10 |
| CBSE, Grade 9, no school | Cambridge IGCSE and an invented school |
| ICSE, Grade 9, no school | Cambridge IGCSE and an invented school |
| Cambridge Primary, Grade 2 | Stage 5, age 10 and an invented school |
| Cambridge Lower Secondary, Grade 6, no school | Stage 7 and a named Pune school |

Cause: `board === "cambridge-igcse" || grade >= 9`, default school strings, and the universal final Primary branch. Missing board/grade is also accepted by the schema. This is reproducible prompt misrouting, not proof that a specific provider produced an incorrect answer.

Action: select curriculum from an explicit validated tuple, never an age/grade shortcut. Unknown or unsupported scope needs a neutral, disclosed general-learning mode or a request for clarification. School/location examples should be learner-selected or presented as examples, not claimed as the learner's context. Keep Zeno's route work authoritative and add a cross-board/grade prompt matrix before closing this finding.

### 2. P1: A local grade-to-stage convention is treated as worldwide curriculum truth

Locations: [boards.ts:22](../lib/content/boards.ts#L22), [subjects.ts:803](../lib/content/subjects.ts#L803), [route.ts:191](../app/api/tutor/route.ts#L191), [cls7-maths.ts:43](../lib/content/packs/cls7-maths.ts#L43).

The catalog restricts Cambridge Primary to Grades 1 through 5 and derives Lower Secondary stage as grade plus one. Pack registration and prompt text use the same local mapping. A learner following another school structure cannot express Primary Stage 6 through that catalog and can receive Stage 7 from Grade 6 without confirming the stage.

Cambridge officially describes six Primary stages and allows different pacing. Its implementation guide documents multiple mappings, including a structure starting Stage 2 in Grade 1 and another compressing Lower Secondary later. There is no universal grade-number offset. Sources: [Cambridge Primary stages](https://help.cambridgeinternational.org/hc/en-gb/articles/360000048218-At-what-age-should-children-start-following-Cambridge-Primary-curriculum-frameworks), [Cambridge implementation guide](https://www.cambridgeinternational.org/implementing-curriculum/).

Action: model curriculum stage separately from local grade, with an explicitly selected or verified mapping. Preserve existing registrations, selections and progress through an explicit compatibility migration; do not relabel every Grade 6 profile or shift pack IDs automatically. Test Primary Stage 6 and more than one supported school structure.

### 3. P1: Daily Quest misses are saved without provenance and disappear from review

Locations: [app/page.tsx:275](../app/page.tsx#L275), [quiz-view.tsx:63](../components/views/quiz-view.tsx#L63), [quiz-view.tsx:219](../components/views/quiz-view.tsx#L219), [availability.ts:35](../lib/content/questions/availability.ts#L35).

Daily Quest supplies neither outer `subjectId` nor `topicId`. Each enriched current question has both, but the new missed card stores the outer props. The admission filter then rejects cards missing those fields. In-memory reproduction: a new Daily-style miss yielded 0 admitted review cards; the same card carrying the current question's provenance yielded 1.

Action: persist current-question provenance, including curriculum and content version as the identity model evolves. Test a wrong Daily answer followed by review admission. Do not loosen the availability filter to admit provenance-free legacy cards indiscriminately.

### 4. P2: Question text merges independent review histories

Locations: [quiz-view.tsx:183](../components/views/quiz-view.tsx#L183), [quiz-view.tsx:204](../components/views/quiz-view.tsx#L204), [quiz-view.tsx:224](../components/views/quiz-view.tsx#L224), [questions/index.ts:143](../lib/content/questions/index.ts#L143), [questions/index.ts:379](../lib/content/questions/index.ts#L379).

The current bank contains the stem `Largest planet?` in both `science/earth-space` and `gk/space`, with different explanations. Correct-answer promotion, wrong-answer lookup and replacement compare only `q`. Answering one can therefore promote or overwrite the other's review history. This is a current data collision, not only a future scale concern.

Action: introduce stable question identity scoped to curriculum, stage/grade, subject, topic and content revision. Preserve historical card IDs and map unambiguous legacy records; keep ambiguous records separate. Test identical wording in different topics and revised answers without deleting progress.

### 5. P2: Tutor subject anchors ignore grade and school syllabus context

Locations: [route.ts:123](../app/api/tutor/route.ts#L123), [route.ts:173](../app/api/tutor/route.ts#L173), [route.ts:196](../app/api/tutor/route.ts#L196), [route.ts:238](../app/api/tutor/route.ts#L238), [tutor-view.tsx:119](../components/views/tutor-view.tsx#L119).

ICSE subject blurbs are Class 7 strings selected by subject alone. An ICSE Grade 6 Chemistry request receives the Class 7 atomicity/valency/balancing anchor alongside a scope guard that forbids those topics. The ICSE branch also requests Class-7 language for Grade 6 or 8. The tutor request carries no selected pack revision, explicit Cambridge stage or accepted school syllabus; a school name is not enough to reconstruct any of these. The subject field is a free string and has no board/subject relationship validation.

Action: resolve a grade/stage-specific, versioned context on the server and keep authored framework context distinct from accepted school content. Reject or clarify incompatible subject/pathway pairs. Do not infer a textbook from a board alone. Regression tests should assert no contradictory Grade 6/7 anchors and no silent substitution when exact context is unavailable.

### 6. P2: School overlays stamp the whole pack while retaining unrelated practice

Locations: [school-syllabus.ts:155](../lib/content/school-syllabus.ts#L155), [school-syllabus.ts:186](../lib/content/school-syllabus.ts#L186), [use-pack.ts:63](../lib/content/packs/use-pack.ts#L63), [types.ts:48](../lib/types.ts#L48).

The overlay changes topics and stamps the pack as a school scheme of work, but retains all original questions, flashcards, mistakes and cheat sheets through object spreading. A synthetic History replacement retained the exact original question and flashcard arrays, with 8 questions pointing to topics no longer present. Parent uploads also carry no board or grade; the upload path checks only subject ID and does not validate the current year or grade.

Action: show provenance separately for syllabus topics and original framework practice. Do not imply that unchanged practice is school-approved. Explicitly map retained practice to the new scope, or mark it as supplemental and unmapped. Bind accepted uploads to learner curriculum, grade/stage, year and version; require review on incompatible changes. Test orphan topic references and stale uploads. No private school documents were inspected here.

### 7. P2: Replacing a school syllabus can transfer confidence to a different topic

Locations: [syllabus-panel.tsx:105](../components/parent/syllabus-panel.tsx#L105), [exam-prep-view.tsx:308](../components/views/exam-prep-view.tsx#L308), [exam-prep-view.tsx:317](../components/views/exam-prep-view.tsx#L317).

Uploaded topic IDs are positional, `sch-<subject>-1`, and confidence is stored under subject plus topic ID without syllabus revision. If a later upload places a different topic first, it inherits the previous first topic's confidence. The same mechanism applies across years. This is supported by the actual upload ID generator and confidence lookup; no real learner's notebook was inspected.

Action: use stable topic identity within a versioned syllabus, archive prior confidence and migrate only explicitly matched topics. Test reordered and replaced uploads. The UI also promises that weak topics get priority tomorrow, but repository search found the confidence key only in this component; treat that promise as unimplemented until a recommendation consumer is wired and tested.

### 8. P2: Grade 6 Science teaches outlier exclusion without enough evidence

Locations: [cls7-science.ts:62](../lib/content/packs/cls7-science.ts#L62), [cls7-science.ts:275](../lib/content/packs/cls7-science.ts#L275).

Question `cs7-3` selects exclusion of a 3.8-second observation because it differs from four others. Its explanation guesses a stopwatch slip without evidence; the syllabus bullet also directs learners to omit pattern-breaking readings. NIST guidance distinguishes confirmed errors from unexplained outliers and recommends investigation rather than automatic deletion. [NIST outlier guidance](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

Action: narrowly revise this question and matching explanation/bullet to investigate, repeat where appropriate, retain the record and justify any exclusion. No wholesale science rewrite is needed. This concerns scientific reasoning, not a claim that a specific Cambridge assessment mark scheme was checked.

### 9. P2: Grade 6 English supplies an invented quotation as evidence

Location: [cls7-english.ts:331](../lib/content/packs/cls7-english.ts#L331), question `cls7e-4`.

The task asks learners to improve a vague statement about a lonely narrator but provides no underlying passage. The model adds a detail about two cups and calls it an actual quotation. A learner cannot derive it from the given question. This undermines the pack's own evidence-first instruction even though its original-extract policy is otherwise explicit.

Action: include the relevant original passage in the question, or label the entire response as a hypothetical worked example with invented wording. Test that cited model quotations can be located in the supplied source extract, allowing explicitly labeled illustrative examples.

### 10. P2: Assembly repeats curriculum inference even if tutor routing is fixed

Locations: [assembly/route.ts:26](../app/api/assembly/route.ts#L26), [assembly/route.ts:87](../app/api/assembly/route.ts#L87), [assembly/route.ts:104](../app/api/assembly/route.ts#L104).

The assembly independently routes Grade 9+ to IGCSE and labels other non-Lower-Secondary pathways Cambridge Primary. Its offline fallback accepts only a name and suggests place value and Science without selected subjects, grade or availability. Thus a learner who chose only English can still receive an unrelated daily plan. The assembly correctly avoids inventing a school name, but that does not fix its curriculum routing.

Action: share an explicit curriculum resolver with tutor routing and make the offline plan use selected, available content or neutral choices such as opening a book. Include selected-subject-only, CBSE/ICSE secondary and unavailable-content cases. Quote attribution accuracy was not audited.

## Grade 6 sample review and provenance distinctions

| Sample | Verified result | Limit or follow-up |
| --- | --- | --- |
| Maths `cm-17`, lines 415-416 | Recalculation confirms the ratio shares 200/250 and the unit-price answer 290. | Rupees are legitimate example content, not proof the learner lives in India. No need to erase every local example. |
| Maths `cm-18` through `cm-20`, lines 421-436 | Recalculated probability 0.5, horizontal distance 9, compound area 80, volume 120 and surface area 158. | This confirms arithmetic only, not universal Grade 6 placement. |
| Maths `cm-22`, lines 447-448 | Counterexample and parity explanation are mathematically valid; they fit the official emphasis on reasoning and checking conjectures. | The claim about which sentence earns most marks is not established by a cited assessment rubric. |
| Science `cs7-3`, lines 275-283 | Specific reasoning defect confirmed against NIST guidance. | See finding 8. |
| Science `cs7-6`, lines 305-306 | Uses the biological species concept as an unqualified universal test. | A bounded educational simplification needs its limits stated, especially asexual organisms and hybridization. [University of Minnesota teaching text](https://open.lib.umn.edu/evosex/chapter/2-15-speciation/) explicitly notes limitations. This is not a finding about any learner's beliefs or a claim about future human evolution. |
| English `cls7e-3`, lines 324-325 | The meaning of reluctant is supported by the original extract's context. | The exact Stage 7 objective attribution was not independently checked in an authenticated framework. |
| English `cls7e-4`, lines 331-332 | Model quotation is absent from the task's supplied text. | See finding 9. |
| History `clsh7-2` and `clsh7-3`, lines 251-258 | Both source extracts are labeled as original practice, not authentic historical documents. The answers distinguish perspective and corroboration. | Preserve that disclosure. These exercises do not establish the learner's school periods, prescribed textbook or assessment scheme. |

The official [Mathematics 0862 page](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/mathematics/) supports the broad strands and reasoning emphasis. It does not prove every claimed objective number, textbook unit order or mark allocation in the pack. The official [English 0861 page](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/english/) supports reading, writing and spoken communication in varied cultural contexts and identifies a separate second-language pathway. The app's generic English label should eventually expose its actual 0861 scope rather than imply all English pathways are covered.

Cambridge's public [Humanities 0839 listing](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/humanities/) identifies People, Past and Places; the [Lower Secondary catalog](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum) establishes flexible subject combinations. Search results confirmed the Humanities description, but direct retrieval timed out during this audit. The Science direct page also failed retrieval. No official-source finding here depends on reading those unavailable full pages. School-support documents were not accessed, and mirror copies were not used as proof of exact stage objectives.

Several generic Grade 6 packs still include CNS Amanora in visible context: Maths line 45, Science line 30, History line 72, English line 45 and Global Perspectives line 41. These are authored template provenance, not verified learner affiliation. Separate template origin, framework alignment, textbook mapping and verified school assignment in both metadata and UI. Historical comments claiming objective-by-objective verification were not treated as current independent evidence. The Humanities school-scheme registry is empty at line 97 of `school-syllabus.ts`; preserve the generic-content caveat.

## Safeguards confirmed and boundaries not to overstate

- Known-grade pack lookups match exactly in `pack-index.ts:126-130` and `packs/index.ts:66-70`. The 144-test run confirms registry consistency and existing exact-grade tests. Do not reintroduce cross-grade fallback while fixing prompt scope.
- Unknown-grade lookup deliberately returns the first registered subject pack. This is a compatibility hazard to quarantine at entry points, not a reproduced known-grade leak. The normal inspected pack UI passes the learner's grade.
- Question banks are currently admitted only for Cambridge Primary Grade 5. Other curricula receive no legacy question bank. This is a useful availability guard, not verification that every item in that bank is globally applicable.
- No current cross-grade topic-ID collision was found in the sampled ICSE Maths, Physics and English Language packs. The confidence finding above is specifically about positional IDs from repeated school uploads, not an invented collision in those packs.
- Five board IDs and school-grade models are implemented. Worldwide curricula and university study remain product scope gaps, not evidence of an implemented adult/university pathway. Unsupported choices must remain explicit rather than mapped to the nearest existing board.
- Mastery currently uses a non-decreasing smoothed quiz score (`quiz-view.tsx:275-280`). It is not a validated proficiency estimate and cannot decrease after later poor performance. Treat it as a reporting/model limitation for a later scoped change, preserving the underlying attempt history.

## Historical suggested delivery order

1. Coordinate findings 1, 5 and 11 with Zeno; fix authoritative context selection as well as routing. Cover assembly routing separately under finding 10. Verify prompt tuples without paid provider calls first.
2. Fix Daily miss provenance and duplicate question identity with explicit preservation of historical records. Add UI-to-store-to-review regression coverage.
3. Design explicit stage selection and a compatibility plan before changing grade registrations. Correct generic school labels without rewriting all examples.
4. Version school uploads, bind confidence to topic identity and label supplemental practice honestly.
5. Make the two narrowly identified content corrections, then obtain the actual framework editions and school documents needed for deeper objective-level review. Do not claim complete curriculum validation from this sample.

## Follow-up: authenticated profile trust boundary

### 11. P1: Authenticated learner metadata is available but client metadata controls tutor scope

Confirmed against the same tutor route SHA-256 recorded above. This is distinct from finding 1: correcting the grade-based IGCSE branch alone would still let the client select a different valid board and grade.

Trace:

1. [queries.ts:551](../lib/db/queries.ts#L551) resolves an active device token and reads the associated database learner. [queries.ts:24](../lib/db/queries.ts#L24) and [queries.ts:49](../lib/db/queries.ts#L49) show that the returned row includes `grade`, `board`, `school` and `pickedSubjects`, not just identity.
2. [session.ts:240](../lib/auth/session.ts#L240) places that row in `identity.learner`. [capabilities/server.ts:76](../lib/capabilities/server.ts#L76) resolves the capability and returns the identity. The signed-in linked-learner path also returns a database learner row.
3. [tutor/route.ts:377](../app/api/tutor/route.ts#L377) takes grade, board, school and subject from the parsed request. At [line 467](../app/api/tutor/route.ts#L467), it retains only `decision.identity.learner.id` from the authenticated profile for subsequent processing.
4. [ai-tutor-policies.ts:299](../lib/db/ai-tutor-policies.ts#L299) uses that ID to obtain the enabled parent assignment, provider configuration and limits. Although the query joins `learners` for ownership, it does not select grade, board or school and does not reconcile request metadata.
5. [tutor/route.ts:582](../app/api/tutor/route.ts#L582) calls `systemPrompt` with the request-derived values. No comparison with the stored profile occurs in the inspected normal tutor path.

Concrete trigger: a learner with a valid linked identity, an enabled AI assignment and remaining allowance changes the request body from their stored ICSE Grade 6 context to `board: cambridge-igcse`, `grade: 10`, an arbitrary school string and `subject: igcse-chemistry`. The schema accepts those values independently ([guard.ts:67](../lib/api/guard.ts#L67)). The resulting prompt claims IGCSE and omits the Class 6 scope guard. Keeping `board: icse` while changing the grade to 7 also selects a different scope guard. Ordinary stale local metadata can produce the same mismatch without deliberate tampering.

Verification: executed the actual request schema and extracted prompt builder in memory with synthetic values. The forged IGCSE body passed validation, its submitted school appeared in the prompt, and the Class 6 guard was absent. An ICSE Grade 6 stored-profile tuple served only as the comparison context in this demonstration; no real database profile, token, authenticated HTTP request or paid provider call was used. The authenticated-profile disconnect is established by the source trace above, not by claiming a live end-to-end exploit.

Impact: a linked learner can change the curriculum and developmental framing used for the model, bypassing the intended stored-grade curriculum guard. This is not evidence of bypassing device authentication, revocation, parent capability disablement, enabled-assignment checks, provider limits or the static crisis response. Those still use authenticated identity or message-based logic. Nor is grade alone verified age: a stored grade must not become an automatic adult-access signal.

Minimal remediation for the route owner:

- Retain the authenticated learner row and derive curriculum scope from validated server-held grade and board. A request may not override those policy fields. Use stored school only as descriptive data, and leave it unspecified when absent.
- Decide and document the authoritative update path for profile changes. Database storage alone does not prove educational accuracy, and stale profile differences need a visible correction flow rather than silent client precedence. The inspected parent update helper scopes writes by parent ownership; the full profile synchronization/write policy was not audited here.
- Validate the requested subject against that scope. If free exploration beyond selected subjects is supported, make it explicit while retaining developmental safeguards. Treat school, topic and other free text as data rather than trusted instructions.
- Validate server-held board/grade combinations as well. Missing or unsupported context must produce a neutral/clarifying response, not a client-derived default or a guessed adult role.
- Add a mocked route regression: hold the authenticated learner and parent assignment fixed, change body grade/board/school, and assert the provider receives the same authoritative curriculum scope or a clear mismatch rejection. Cover omitted metadata, invalid stored combinations, out-of-scope subjects, stale local profiles, revoked devices and parent-disabled AI. Preserve the current static crisis-response behavior.

Only this report was updated for the follow-up. No route or profile code was edited.
