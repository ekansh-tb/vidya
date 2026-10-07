# Parent authentication readability, 7 October 2026

The reported immutable preview reproduced dark Clerk labels on a dark card. Its Google button and form title were barely visible. The application supplied removed colour names (`colorText`, `colorTextSecondary`, `colorInputBackground`, `colorInputText`) to the current Clerk SDK. Current names are documented at https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/variables.

Design: paper #f7f8fc, white card, ink #252544, secondary #56566f and violet #6554c0. Outfit headings and Plus Jakarta Sans labels/buttons match the learning entry while keeping adult authentication independent of a child's theme. A single centred column stays readable on phones. No cosmic animation behind form labels.

    Vidya / For parents
    Welcome / short explanation
    White Clerk card: enabled social providers / email / verification
    Child device-code guidance / return to learning

The card remains Clerk's supported component across verification and OAuth callbacks. No custom password handling, provider hardcoding, Clerk branding removal, plan purchase or authentication-policy change. Sign-up uses the same safe parent return-path validation and preserves that destination when switching between sign-in and sign-up.

Anekantavada decision: parents need readable trusted controls; children use their separate device-code entry; accessibility needs visible contrast, focus outlines, 48px controls and zoomable 16px fields; engineering retains Clerk-owned verification and provider configuration. An illustrated sidebar or animated background adds distraction and is not part of this fix.

Official pricing at https://clerk.com/pricing currently lists up to three social connections on the free Hobby plan, including Google-style social login. Enterprise SAML/OIDC/EASIE connections are not included on Hobby. The supplied preview shows Google and Development mode; it does not verify production OAuth credentials or the application's actual billing plan. Authenticated dashboard inspection is required for those facts. No plan or connection settings have been changed by this source release.

Local verification: typecheck, lint, 910 unit tests, 33 security/migration regressions, zero known audit vulnerabilities and production build passed. Hosted UI acceptance, deployment and dashboard evidence are recorded separately in the PR. Existing signed-in parent and child account sessions are preserved.
