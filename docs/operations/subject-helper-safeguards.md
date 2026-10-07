# Subject helpers: scope and provider release gate

Status on 8 October 2026: versioned contracts and a fail-closed runtime gate are implemented. Live provider turns remain paused. No learner has a durable approved eligibility record in this release. Existing parent assignments and encrypted API keys are preserved. Crisis support is authored locally and stays available before the provider gate. Preschool continues to use authored activities, never a school-grade fallback.

The runtime reads exact board, grade and subject from authenticated server context. A published helper additionally requires separately confirmed stage, English/Hindi language, reviewed objective source excerpts, immutable source revision references and five publishing checks. Grade never proves age, reading ability, stage or processing permission. Client age, stage, consent, provider and language claims cannot grant scope.

The eligibility contract binds a review to learner, parent, assigned tutor profile, connection, provider and model. It references age assurance, applicable consent threshold, processing purpose and legal basis review, revocable consent, provider retention/configuration review, moderation and incident response, funded allowance and helper revision. References do not establish those facts by themselves. The server resolver deliberately returns no record until a durable audited review and revocation workflow exists. There is no environment-variable bypass. Tests use clearly synthetic review records to exercise the future path.

Before activation, implement authorized durable records and expiry/revocation, review actual provider agreements and endpoint retention settings, verify moderation and correction/report flows, confirm funded allowance and test complete child/parent journeys. A parent API key or ChatGPT subscription does not establish funding or child safeguards. Existing adapters and credential vault are reused only after the eligibility check. Unknown age stays closed before credential decryption, model creation, message conversion and usage billing.

## Current official provider evidence

- [OpenAI under-18 guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance): processing personal data below age 13 or the applicable digital-consent age requires zero data retention. The gate requires reviewed ZDR configuration below the recorded applicable threshold. This check alone does not satisfy all safeguarding obligations.
- [Anthropic guidance for organizations serving minors](https://support.claude.com/en/articles/9307344-responsible-use-of-anthropic-s-models-guidelines-for-organizations-serving-minors), updated 16 March 2026: requires age controls, appropriate safeguards, regulatory compliance and clear AI disclosure. [Developer child-safety guidance](https://support.claude.com/en/articles/15591275-child-safety-guidance-for-developers) also informs the pending provider review. No Anthropic configuration has been approved by this release.
- [Gemini API terms](https://ai.google.dev/gemini-api/terms): prohibit API clients directed towards or likely to be accessed by under-18s. Google stays unavailable for this child-facing endpoint even if a future local record claims approval. Parent ownership of the credential does not override those terms.
- [xAI enterprise terms](https://x.ai/legal/terms-of-service-enterprise): put input rights, consent and evaluation responsibilities on the customer and describe retention options. This is not a verified approval for Vidya's child use case; actual applicable agreement, age requirements and retention configuration still need review.
- OpenRouter review must cover the router and every downstream recipient/model. A router credential does not remove downstream provider requirements. No such chain is currently approved.

These are provider-specific requirements, not a claim of legal compliance or guaranteed safe teaching. Terms and product configuration need rechecking before every provider release.

## Perspectives and unresolved questions

Child autonomy favors continued independent authored exploration during the pause. Parent trust requires an honest pause notice rather than implying a saved toggle is consent. Teaching usefulness requires grounded reviewed objectives and correction. Language inclusion requires separate Hindi source and instruction review. Reliability requires no billable provider work when eligibility lookup fails. Data minimization favors evidence references over birth dates in chat requests. The unresolved cost is reduced live tutoring availability until those safeguards and content are actually reviewed; authored learning and creation remain usable.

Implemented and unit-tested are separate from deployed, browser-accepted, child usability and learning evidence. This file records no provider approval, child usability study or retention improvement.
