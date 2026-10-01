# Curriculum stage compatibility and migration plan

Planning snapshot: 2026-10-01. This document proposes future work; it changes no schema, code, learner data or release state. No personal learner records were inspected. PR73 corrected ambiguous display labels, with production acceptance recorded in the curriculum release ledger. The structural model remains unresolved. This plan does not itself perform deployment checks.

## Decision and boundaries

Add explicit, versioned learning contexts beside the existing board and grade fields. Preserve every existing learner ID, local-to-server association, subject selection and progress record. Do not convert local grades to stages automatically. Existing content may remain accessible under a disclosed legacy app convention without claiming verified curriculum placement.

Worldwide school curricula and learning through all universities are the product ambition, not implemented coverage. The current five board choices are starting points. Cambridge must not be restricted to India or inferred from residence. New framework records, translations, university courses, institutional relationships and accreditation require their own evidence and release gates.

Free lessons, practice, books and activities must remain reachable during migration, including local/guest use. A missing stage or unsupported curriculum must not force enrollment, a guardian relationship, payment or AI use. Optional parent-funded AI remains separate from core access until sponsorship is approved. Adult AI funding is a later product decision, not a reason to require an adult learner to acquire a guardian.

## Current source evidence

| Surface | Inspected contract | Compatibility consequence |
| --- | --- | --- |
| [types.ts](../lib/types.ts#L61) | `Board` is five string literals. `LearnerProfile` at line 87 requires numeric grade and board; school is descriptive. | Neither a free-form university year nor an ungraded learning path fits without a new contract. Do not invent a sixth legacy board or sentinel grade. |
| [boards.ts](../lib/content/boards.ts#L21) | App ranges are Primary 1-5, Lower Secondary 6-8, IGCSE 9-10, ICSE 1-10 and CBSE 1-12. | The display correction does not expand support. Preserve ranges until replacement consumers are ready. |
| [subjects.ts](../lib/content/subjects.ts#L798) | Lower Secondary groups depend on grade; `cambridgeStageForGrade` at line 803 returns grade or grade plus one. | This function cannot establish confirmed stage. Identify and replace each consumer before retiring it. |
| [0001_init.sql](../db/migrations/0001_init.sql#L33) | Learners have stable UUIDs, optional parent ownership, local IDs, board text and required grade 1-13. Learner state at line 67 is a JSON blob with a revision counter. | Additive storage is needed. Preserve UUIDs, parent/local-ID uniqueness and conflict detection; do not recreate learners. Nullable parent ownership alone is not an implemented adult pathway. |
| [queries.ts](../lib/db/queries.ts#L24) | Database profile and create/update helpers carry board, grade, school and subject choices. | Update read and write contracts together; database storage does not itself verify educational accuracy. |
| [guard.ts](../lib/api/guard.ts#L57) | Request board enum and numeric grade validation still reflect legacy scope. | New contexts need their own validation; do not widen one UI dropdown while downstream handlers still assume the old enum. |
| [pack-index.ts](../lib/content/packs/pack-index.ts#L126), [packs/index.ts](../lib/content/packs/index.ts#L66) | Known-grade lookup is exact; omitted grade retains first-subject-pack compatibility behavior. | Preserve exact legacy lookup. Never use omitted-grade fallback to fill an unsupported new context. |
| [types.ts](../lib/types.ts#L186) | Topic progress contains attempts, correct and mastery; game state keys progress by nested strings. | Existing aggregate mastery is not evidence of equivalent achievement in a new stage. Retain it with its original scope. |
| [identity.ts](../lib/content/questions/identity.ts#L11) | Review identity includes bank namespace, board, grade, subject, topic and content. | Changing profile grade can change identity. Keep historical keys and stored context; never regenerate all cards under a new stage. |
| [school-syllabus.ts](../lib/content/school-syllabus.ts#L141) | Confidence identity includes board, grade, school, pack and topic revision/content. Overlay labels distinguish supplemental practice from school topics. | Preserve v2 confidence and revision history. Display-copy changes are not new learning identities. |
| [types.ts](../lib/types.ts#L48), [school-syllabus.ts](../lib/content/school-syllabus.ts#L198) | Parent uploads contain year, source label, timestamp and subjects. Their curriculum and grade are explicitly unverified. | Parent acceptance of extraction is not school verification. Add applicability evidence without upgrading old uploads automatically. |
| [tutor-curriculum.ts](../lib/ai/tutor-curriculum.ts#L45) | Tutor resolves stored board/grade, rejects unsupported combinations and disclaims stage equivalence. | Coordinate future context resolution with the tutor owner. Preserve server authority and capability policy. This plan does not replace that helper. |

Also include `lib/game-store.ts` and `lib/sync/{client,merge,use-sync}.ts` in the implementation inventory. Local persistence, linked-device synchronization and revision conflicts are part of the migration, not just SQL concerns. Current code is a moving shared workspace snapshot, not evidence that every inspected change is live.

## Distinct concepts in the proposed contract

These are conceptual fields, not a finalized SQL migration. A learner may have multiple learning contexts and per-subject stage choices; one account-wide grade must not dictate every subject.

| Concept | Meaning and allowed uncertainty | Must not imply |
| --- | --- | --- |
| Country or jurisdiction | Optional applicability metadata on a framework or scheme; learner residence is a separate optional field. Multiple jurisdictions or no country may apply. | Nationality, language, curriculum choice or legal applicability. |
| Authority | Identified issuer of a framework, qualification or syllabus, with official provenance. Publishers and schools are separate entities unless they actually issue that document. | A school affiliation or a universal equivalence between authorities. |
| Framework or programme | Stable internal identifier plus issuer code, title and type. Preserve aliases for all five legacy board IDs. | Content availability, enrollment or accreditation. |
| Version | Framework edition, syllabus revision or examination validity window, supported by source evidence. Unknown is explicit. | Upload date equals publication date; academic year equals framework version. |
| Stage or level | Identifier within that framework version, selected explicitly. Permit unknown and not applicable. | Local grade, age, adult status or equivalence across frameworks. |
| Local grade | Learner/school terminology and optional local system identifier. Preserve the original numeric legacy value separately. | Stage assignment; universal ordering of labels such as year, class, form or semester. |
| School and verified scheme | Optional institution identity and a separately versioned scheme, applicable to specified subjects, cohort and academic year. | A typed school name or parent-uploaded file proves attendance or approval. |
| Source and assertion status | Record who asserted a value, when, evidence reference, applicability and review status per field. Distinguish unknown, learner-declared, parent-declared, legacy convention and evidence-reviewed. | One verified field makes the entire profile verified. |
| Content availability | Per context, subject and resource: available, partial, unavailable or alignment unverified, with known limitations. | Framework existence means Vidya provides its curriculum. |

Keep official source URLs, document editions, applicable dates, reviewer decisions and rights to use material in a provenance record. Private school documents remain learner-scoped unless sharing is separately authorized. Confirmation should be available without uploading identifying documents where declaration suffices; disclose the weaker evidence level.

## Compatibility rules

1. Preserve `learner.id`, database UUID, local ID, account links, devices and ownership. Add context IDs without replacing identity. Backfill is repeatable and keyed by existing learner identity, not names.
2. Capture the legacy board/grade/subject tuple as an immutable compatibility reference. A backfilled context has stage unknown and origin `legacy-app-convention`. Do not write Stage 7 into every Grade 6 profile.
3. Keep current pack IDs, topic IDs, question IDs, review keys, confidence keys and history. Future context-aware content associations are an additional index over existing content, not renames. Framework editions and content revisions are separate dimensions.
4. Explicitly confirming or changing a context creates a new association and activation event. Show what becomes available, unsupported or remains historical before switching. Prior learning remains readable; transfer achievement only through a reviewed, versioned equivalence record with a reversible link. No equivalence is assumed in this plan.
5. Retain selected subjects even if unavailable in the new context. Mark them historical or unavailable and offer explicit choices. Do not silently drop them or insert mandatory subjects without applicable evidence.
6. Resolve new-context content by explicit framework/version/stage/subject applicability. An unresolved result is unknown or unavailable, never the closest grade or first pack. Offer general free learning with its actual alignment disclosed. Legacy content remains under the legacy resolver and is labeled accordingly.
7. Server-held learning context governs linked-learner policy. Client requests cannot promote declaration status, change stage-based policy or grant adult access. Local guest declarations remain local and unverified; syncing does not automatically upgrade their authority.
8. Version profile and sync envelopes. Until every writer preserves new fields, keep them in separately persisted records with revision checks. Older clients may read their existing legacy context; reject conflicting activation writes with a refresh instruction rather than discard new fields. Resolve simultaneous edits explicitly and preserve both histories.
9. Rollback disables new-context activation and returns legacy learners to their saved reference without deleting new records. New-only contexts must show a compatible unavailable/general-learning view, not be coerced into legacy grades. Block new-only enrollment on old clients until that fallback exists.

## Independent adult and university paths

Plan an independent learner entry alongside the child and parent doors. Separate account role, guardian relationship, safeguarding policy, learning context and optional report sharing. A university learner can be a minor; an adult can study school material. Neither university enrollment nor a high grade grants adult privileges, and selecting a parent door must not automatically create authority over a learner.

Future higher-education contexts need institution, programme, programme version, course/module code, academic period and optional local year/level. Do not encode a university degree as Grade 14 or reuse a school board ID. Permit independent study with no institution and no claimed qualification. Official programme catalogs must be checked individually before claiming alignment; no university partnerships, courses, credits or accreditation are established here.

Transition from a safeguarded child account requires a separately reviewed eligibility and consent process. Present the proposed guardian-access changes, obtain explicit learner consent when eligible, record the policy basis, and revoke or retain sharing according to that approved policy. Retain the same learner identity and history. Do not automatically inherit adult status, continue guardian monitoring indefinitely, delete relationships silently or transfer the account to a new ID. Required age/eligibility checks and jurisdiction-specific rules are unresolved inputs, not legal conclusions in this plan.

Adult reports should default to private under the proposed adult model; voluntary sharing is granular and revocable. Reports must distinguish recorded activity from inferred proficiency and must not reclassify historical mastery as verified competence after migration.

## Incremental releases and gates

| Release | Deliverable | Required gate before expanding rollout |
| --- | --- | --- |
| 0: baseline | Inventory all board/grade readers and writers, state serializers, pack lookups, tutor/assembly consumers and account-policy checks. Freeze synthetic compatibility fixtures. | Record existing counts and identities; fixtures cover each current board, missing metadata, retained selections and unavailable grades. Treat release 73 as a copy change only. |
| 1: additive storage | New context/provenance records, versioned API and local storage contract, no active lookup change. | Isolated DB and local-store tests prove idempotent backfill, no UUID/key changes, no inferred stage, denied cross-learner writes, stale-revision rejection and old-client field preservation. Exercise rollback before production approval. |
| 2: explicit confirmation | Optional stage/version confirmation and an unknown choice; preview effect before activation. Keep guest/free access. | Synthetic Grade 6 learners can select different applicable stages without automatic grade mutation. Primary Stage 6 can be represented independently of the legacy range without inventing content. Test keyboard access, RTL layout, language selection independent of curriculum, mixed-subject stages and cancel/resume. Translation samples must remain labeled until verified. |
| 3: context-aware lookup | New resolver behind a rollout control; compare legacy and new results before activating it. | Exact scope matches only; unsupported cases never fall through to another grade. Verify all selected subjects retained, old cards readable, no duplicate progress, stable confidence revisions, declared versus reviewed schemes, and preserved AI policy/quotas with mocked providers. |
| 4: additional school frameworks | Add a framework only with documented authority/version, catalog boundaries, rights and reviewed content applicability. | Validate each framework independently, including more than one country context where applicable. Catalog support and content support are reported separately. No default stage mapping, compulsory language or school mandate based on country. |
| 5: adult/university pilot | Independent learner permissions and ungraded/module-based contexts after account-policy approval. | Minor university learner stays safeguarded; adult school learner needs no guardian. Test explicit transition consent, revocation of report access, unchanged learner IDs, export/history access and rejection of forged role/stage metadata. Pilot only named, reviewed content; no global coverage claim. |
| 6: retire legacy inference | Remove remaining grade-to-stage callers once supported clients use explicit context. Keep compatibility reads for historical data. | Prove no active consumer calls the old inference function; no orphaned records; no loss in core free-learning access. Rollback and export remain available. Removal of legacy columns is a separate, later decision. |

Use small cohorts and synthetic data first. Measure context resolution outcomes, unexpected lookup differences, conflict rates, preserved record counts and free-content access failures without recording personal learner text. Any identity loss, unauthorized access or silent reassignment blocks expansion. Release owners set rollout thresholds before activation; this document does not invent acceptable failure rates.

## Official evidence and limits

- [Cambridge Primary stages](https://help.cambridgeinternational.org/hc/en-gb/articles/360000048218-At-what-age-should-children-start-following-Cambridge-Primary-curriculum-frameworks), retrieved 2026-10-01, describes six stages and permits different ages and pacing. This supports separating stage from the app's grade convention; it does not assign a stage to any learner.
- [Cambridge Lower Secondary curriculum](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/), retrieved 2026-10-01, permits flexible subject combinations and coexistence with national or bilingual programmes. This supports multiple contexts and explicit selections, not a single country-derived pathway.

No official university catalogs, worldwide legal rules, accreditation databases or restricted school frameworks were validated for this planning task. The plan's data model is a proposal informed by current source and these bounded examples, not a claim that one schema has already been proven for every educational system.

## Unresolved inputs before implementation

- Who approves framework/version records and evidence-reviewed scheme applicability, and how are disputes, expiry and corrections handled?
- Which framework/version is the first explicit-stage pilot, and which content has sufficient evidence and reuse rights? Existing comments claiming verification are not enough.
- What is the authority for activating context changes on each child, guest and independent-adult path? Coordinate with the account, tutor and synchronization owners.
- Which old client versions must remain writable, and how will context conflicts, offline edits and unknown fields survive them?
- Which historical progress fields have enough provenance for explicit transfer? Everything else remains historical without inferred equivalence.
- Which adult eligibility, consent, guardian-access and retention policies apply in the intended pilot jurisdictions? Obtain appropriate review before implementing them.
- Which university programme/course sources, accessibility needs and verified translations are in scope for the first pilot? No broad catalog import is authorized by this plan.
- Who owns rollout controls, compatibility monitoring, support messaging and rollback approval? Preserve core free access while these decisions are made.

Validation for this document: source inspection, official-source retrieval and local link/format checks only. No code tests, migrations, paid AI calls, browser acceptance, Git actions or deployments were performed for this planning task.
