# Practice studio and private family sets

## Scope

Every current school grade, including preserved Grade 13 profiles, has a practice studio entry. Each school grade has six original English Maths exploration questions, 78 total. These are short general starters, not a completed subject bank, curriculum alignment or school examination coverage. Existing exact-grade study packs and Cambridge Primary Grade 5 question banks remain distinct selectable sources. No cross-grade fallback is used. English/Hindi family sets carry their actual author-selected content language; the app does not translate them silently.

Preschool opens family-guided play prompts and the existing reviewed activity collection, without a formal mock option, a timer or self-marking. The server/client attempt contract rejects formal preschool mock attempts. Grade does not establish chronological age or reading readiness.

Parents find Preparation sets and answer guides in Children. The original parent and connected co-parent have equal learner-level editing authority. A set is private to one learner. Maximum 20 sets, 40 questions each; no public publishing, unrestricted uploads, AI generation or extra billing. Parents attest to suitability and permission to use material privately. Family answers are not independently verified by Vidya.

Saving uses revision checks. Conflicts preserve the editor's unsaved work and ask for a reload; no silent last-write-wins. Archiving hides the set from new learner sessions. A placement correction hides mismatched sets until a parent explicitly checks and moves the material. Existing saved session snapshots remain intact.

A session stores its selected question order and authored guide snapshot, separate learner responses, per-question timestamps, navigation and submission. Reload and sync never reshuffle it. The learner can choose topics and session length. Multiple-choice questions retain their options as accessible tappable choices; practice gives immediate explanations, while mock feedback waits for submission. Public Maths starters offer optional counters, rectangle measurements or line-graph controls after guide review: predict, change and check. These models are separate exploration, not a substitute answer to the current question. New sessions prefer less-seen questions in the selected content revision. Finite banks repeat. Maximum 20 ordinary saved sessions, with no automatic pruning on merges. Creation reserves answer space against the existing whole-state sync limit and refuses safely when near quota. Existing sync errors remain visible; no work is deleted to fit a new session.

## Privacy and authority

Migration 0020 is additive. `vidya_save_preparation_set` serializes with guardian membership changes and locks the learner before rechecking current authority and exact placement. Both parent reads and learner reads are scoped in SQL. Revoked parents cannot use previously loaded profiles to save; foreign learner UUIDs grant no access. Mutations require same origin, bounded JSON and rate limits. All new private API responses are no-store. No service-worker private cache is added. The public cache version changes so existing installed apps receive the existing save-before-update prompt; the account compatibility marker and learner storage are unchanged.

The parent report projection includes session identity, parent/catalog title, placement, counts and editable self-assessed marks. It excludes learner typed responses, question snapshots, guides, hints, reflections and AI transcripts. The child screen explains sharing. This is not mastery, psychometric scoring, a teacher's mark or independent learning evidence. There is no new analytics or event collection.

## Evidence and review

The starter review record in `lib/preparation/starters.ts` explicitly identifies AI-assisted internal editorial checks and limits. It does not claim independent teacher review or child usability. Original wording and mathematical explanations are checked internally; developmental and reading suitability needs family/teacher judgment. Six questions per grade must not be presented as a complete curriculum or inflated into a count of learning activities.

Pedagogy follows the sources and competing perspectives in `repeatable-exam-preparation.md`: short retrieval with explanation, worked examples, learner choice, useful feedback, revisiting after a break and concrete models. Additional current references inspected:

- [UNICEF RITEC research and design tools](https://www.unicef.org/innocenti/reports/responsible-innovation-technology-children): design for autonomy, creativity, relationships, inclusion and safety. These are design considerations, not proof of Vidya's wellbeing outcomes.
- [Cambridge study resources](https://www.cambridgeinternational.org/why-choose-us/parents-and-students/learning-with-lasting-impact/study-resources/): question styles, command words, practice and teacher guidance. Original Vidya starters do not become official Cambridge material by following these principles.

Anekantavada decisions: child choice and privacy coexist with useful family summaries; school-specific family material coexists with honestly scoped public exploration; gamification uses participation and visible saved work without compulsory streaks, countdowns or perfect-score pressure; accessible native controls and restrained motion take precedence over decorative effects that obscure learning. More formal tests are not assumed appropriate for early years. No measured engagement or retention improvement is claimed.

## Release record

Record implemented, tested, deployed, browser accepted, independent educator/child usability, and learning/retention evidence separately. Rollback must retain migration 0020 and app support for multiple Science mocks and preparation snapshots. Do not reset Advika or other real learners to verify this release.
