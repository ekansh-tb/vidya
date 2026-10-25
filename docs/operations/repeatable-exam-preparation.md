# Repeatable preparation release

## Implemented in this release

Science Term 1 has additional balanced 15-question, 30-mark written papers. Each selection contains five two-mark questions from each of the three units. Selection favours questions used less often across saved papers. Questions repeat within the finite bank; a fresh selection is not newly authored content. Consecutive selections differ. Question identities and order persist with each paper and never reshuffle on render, reload or sync.

The original paper, submission and responses keep their existing identities. Additional papers have independent UUIDs, responses, navigation and submissions. Per-answer merging preserves independent device edits. Creation stops at 20 extra saved papers; the app does not discard older papers, including when concurrent devices merge histories. The cap bounds ordinary answer-text growth below the existing 1 MB whole-state sync limit; unusually large other saved creations can still exhaust that shared quota and must surface the existing sync error rather than lose progress. Older clients cannot erase additional papers on the current server merge. Roll back only to a version supporting these fields before learners use multiple papers.

Parents receive bounded counts, self-assessed marks and selected authored question identities for separate answer guides. They do not receive typed responses. Original-paper observations remain distinct from additional papers. These marks are editable self-assessments, not independent testing or mastery evidence.

Revision shows one part of an explanation at a time, with all notes still available. Cell diagrams can hide labels for recall; particle diagrams have explicit state choices and a text equivalent. No autoplay, new tracking, paid provider, reward changes or database migration.

## Research and Anekantavada decision record

Sources inspected 25 October 2026:

- [IES practice guide, 2007](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/20072004.pdf): spacing, retrieval, worked examples with practice, combining graphics and explanations. Evidence strength differs by recommendation. This guide informs design, not a measured Vidya outcome.
- [McDaniel et al., 2011](https://eric.ed.gov/?id=EJ934340): classroom experiments in US eighth-grade science used low-stakes quizzes with feedback. This is more relevant than extrapolating only from college laboratory studies; it still does not establish effects for every grade, Indian school, subject or Vidya learner.
- [Karpicke and Blunt, 2011](https://pubmed.ncbi.nlm.nih.gov/21252317/): retrieval research with college participants. [Mintzes et al. comment](https://doi.org/10.1126/science.1203698) questions generalization and concept-mapping preparation. We retain models and explanation alongside recall; neither representation is declared universally superior.
- [Paulson, Perkins and Adams, 2009](https://phet.colorado.edu/publications/Paulson_etal_2009/Paulson_etal_2009.pdf): guidance changed exploration of a designed simulation. This supports offering choices within understandable models, not assuming unrestricted discovery always teaches better. Our static selectable diagrams are not PhET simulations and have not undergone equivalent learner testing.
- [NCF Foundational Stage, 2022](https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf): play, conversations, doing/showing/telling and observation of artefacts. Preschool gets playful review and caregiver guidance, not formal timed mock papers.

Perspectives and decisions:

| Perspective | Choice | Tension or uncertainty |
| --- | --- | --- |
| Child autonomy | Choose another paper or revisit any saved paper; no countdown lock or absence punishment | More tests can crowd out sleep, creativity and offline play. Break guidance remains visible. |
| Parent trust | Separate paper summaries and authored answer guides; typed answers remain private | Self-marking cannot establish independent understanding. |
| Teaching | Balanced unit selection, free hints in practice, retrieval followed by explanations | Finite pools can reward memorized wording. Transfer and delayed understanding require future evaluation. |
| Development | Formal papers restricted to the existing supported Grade 6 course | A placement does not establish reading ability or readiness. |
| Accessibility | Native buttons/selects, text alternatives, large targets and reduced-motion-aware feedback | Screen-reader and child usability evaluation remains a separate acceptance category. |
| Language | Existing English collection, transparently scoped | Hindi subject-specific review and equivalence are not established by translation. |
| Reliability | Additive saved fields, stable identities, per-answer merge, preserved original paper | Historical clients lack this UI; rollback must retain current field support. |

## Next releases requested and authorized

A reusable exact-placement preparation centre, parent-authored private question/answer sets and authored starter banks for missing school grades. Keep framework-neutral starters labelled as such and do not imply school syllabus completeness. Preschool uses playful review. Existing Grade 13 profiles remain compatible. New content must carry rights, factual, developmental, language and accessibility records, with review limitations stated. No provider-generated learner content is enabled by this work.

## Acceptance record

Implemented, tested, deployed, browser acceptance, child usability, and learning/retention evidence are recorded separately in the PR/release receipt. Local synthetic sessions never count as child usability or production learner work.
