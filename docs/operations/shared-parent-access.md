# Shared parent access

One original parent and one invited co-parent use independent Clerk accounts for the same learner ID. Existing learners and saved states are retained. Enrollment alone does not infer a relationship; matching learner names do not grant access.

The original parent invites a verified email using a privately shared 48-hour code. The server stores a SHA-256 token hash and accepts only a fresh verified primary email from Clerk, after parent enrollment and recent account verification. No automatic email is sent. Owner replacement, expiry, cancellation and single use are enforced in SQL under the existing account-mutation advisory lock.

Both parents can read filtered reports, manage placement, learning plans, devices, safety controls, learner account links, guidance and circle approvals. AI provider credentials and account configuration stay account scoped. The co-parent can pause/resume an existing configured tutor without copying old allowances. Private reflection and transcript exclusions remain enforced by the report response builder.

Only the original parent manages adult invitations/removal; the co-parent can leave. Revoking co-parent access invalidates unused codes and revokes devices minted through that parent's codes. Device code issuance, redemption and co-parent removal share one advisory lock. Learner account-link authorization is rechecked after row-lock waits and ownership transfer. Original-parent devices and learner progress survive removal.

The parent dashboard refreshes authority on foreground return and every 30 seconds while visible; cached reporting data is cleared on hide. An already rendered page cannot be erased from an offline device. Server reads/writes recheck authority and deny revoked requests. Memberships are tied to the original owner so an ownership transfer does not carry old co-parent access into another family.

Apply additive migrations 0018 and 0019 through the normal direct-connection migration runner after isolated qualification and required CI, before enabling the new application queries. Retain schema on rollback; old compatible code still supports the original parent, but does not expose new co-parent access. No Clerk identity, historical learner or curriculum data is deleted.

A separately authorized owner-request mapping may connect an already enrolled, identified parent without fabricating invitation acceptance. Record that as an owner-request mapping in the audit trail, preserve all pre-existing profiles and validate the exact target learner and recipient before mutation. Do not infer consent or membership from email matching alone.

Qualification distinguishes unit/API tests, isolated database tests and race tests, synthetic browser component checks, production deployment, and actual family mapping. The temporary browser fixture and synthetic network overrides must be removed before build. Live acceptance must not write synthetic answers into a real learner's state.
