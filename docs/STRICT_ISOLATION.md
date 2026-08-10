# Strict per-learner data isolation

**Hard product rule.** Every learner's data — XP, streak, badges, quiz history,
seen-questions, friend streak, classroom roster, classroom noticeboard, music
compositions, notebook, future health profile, future AI keys — is private to
that one learner. No other learner on the same device (including siblings) may
read, see, or have those values mixed into their experience.

## Allowed cross-learner UI (whitelist)

Exactly **two** surfaces may read across learner profiles.

**1. `LearnersView` — the kid-facing profile switcher.** Restricted fields:
  - **Reads:** `id`, `name`, `avatarId`, `grade`, `board`, `school`
  - **NEVER reads:** `state.xp`, `state.streak`, `state.badges`,
    `state.progress`, `state.notebook`, `state.classRoster`,
    `state.savedCompositions`, any future `state.health` or `state.aiConfig`.

**2. `app/parent/page.tsx` — the parent dashboard.** Full read across every
learner on the device, by design: this is the legitimate cross-kid oversight
case from the checklist below. It is not kid-facing and is gated in
`middleware.ts`, which redirects anonymous hits on `/parent(.*)` to
`/sign-in`. Note the gate is *authentication only* — any signed-in Clerk
user reaching this device's browser sees every profile on it, because
profiles are device-local and not owned by a Clerk account.

Every other view receives **only the active learner**.

## Where this is enforced

- `app/page.tsx` — `profiles.learners` is touched in exactly two places:
  `Object.keys(...)` for the Add Learner ID-uniqueness check (IDs only), and
  `Object.values(...)` for the LearnersView switcher (whitelisted fields only).
- `app/parent/page.tsx` — the whitelisted exception above.
- `components/views/learners-view.tsx` — visually renders only the whitelisted
  fields; an inline comment + this doc are the contract.
- `components/views/classroom-view.tsx` — sealed to the active learner; AI
  peers come from `state.classRoster` (which is itself per-learner). No
  sibling reads.
- `app/api/tutor/route.ts`, `app/api/assembly/route.ts` — accept request bodies
  with only the active learner's name / grade / board. They do NOT touch
  storage. Siblings cannot leak via prompt context.

## When adding a new view

Before reading anything from `profiles.learners[someOtherId]`, ask:
1. Does the parent need this for legitimate cross-kid oversight?
2. If yes, is the view in the (future) parent dashboard behind a PIN gate?
3. If no, you should be reading `state` / `learner` (the active one) instead.

## Related memories

- `[[strict-isolation]]` — the rule
- `[[supabase-in-scope]]` — when data leaves the device, RLS must mirror this
- `[[vidya-vision]]` — why isolation matters in the product philosophy
