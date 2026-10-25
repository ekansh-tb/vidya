# Family studio entry

## Scope

The public welcome now offers explicit learner and parent/guardian entry. Learners reveal the existing device-code form; Back restores focus to the learner choice. The parent route remains `/parent`, with existing server authorization and return-path validation.

Parent sign-up shows the account, learner and device sequence. Returning sign-in omits this setup sequence. Adult acknowledgement text and version are unchanged; supporting explanations are available in a disclosure. Unverified accounts retain the email-verification action.

The shared light palette uses warm white and ink blue. Dark tokens retain their independent foregrounds. Entry choices use Lucide icons, touch targets, keyboard focus and brief hover/press feedback. Reduced motion and existing calm preferences suppress the new movement. Parent placement inputs use 52-pixel targets and a single-column phone layout where needed. Learner-home headings, cards, navigation and shortcut spacing share the studio styling; shortcut icons use semantic colors to remain legible in dark mode.

## Data and compatibility

No database migration, profile reset, authentication/provider change, new tracking or progress-format change. Existing learner recovery, linking and shared-parent authorization are retained. Grade eligibility and publication rules remain unchanged. Preserved work was integrated onto the preparation-studio release, retaining parent progress and private preparation sets.

## Verification

Type checking, lint and 1,259 unit tests pass. All 34 security/static-migration checks pass; dependency audit reports no vulnerabilities. Release CI additionally runs the isolated PostgreSQL migration and database suites.

Browser checks cover English/Hindi welcome, learner-code focus, Back focus restoration, phone width without horizontal overflow, parent LKG dark controls and school placement choices. Learner home was checked at 390, 768 and 1280 pixels using synthetic state and the actual theme component. The temporary fixture is removed before build. No synthetic work is written to real learners.

Production identity, health and signed-in parent rendering are checked after deployment. A completed new-family sign-up and linked-child journey are not represented by the synthetic checks. Child usability and learning/retention improvements remain unmeasured.
