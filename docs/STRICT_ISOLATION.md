# Strict per-learner data isolation

**Hard product rule.** Every learner's data — XP, streak, badges, quiz history,
seen-questions, friend streak, classroom roster, classroom noticeboard, music
compositions, notebook, future health profile, future AI keys — is private to
that one learner. No other learner on the same device (including siblings) may
read, see, or have those values mixed into their experience.

## Allowed cross-learner UI (whitelist)

Only **one** surface may read across learner profiles, and only these fields:

- `LearnersView` — the profile switcher
  - **Reads:** `id`, `name`, `avatarId`, `grade`, `board`, `school`
  - **NEVER reads:** `state.xp`, `state.streak`, `state.badges`,
    `state.progress`, `state.notebook`, `state.classRoster`,
    `state.savedCompositions`, any future `state.health` or `state.aiConfig`.

Every other view receives **only the active learner**.

## Where this is enforced

- `app/page.tsx` — `Object.values(profiles.learners)` is used in exactly two
  places: `existingIds` for the Add Learner uniqueness check (IDs only), and
  `learners` for the LearnersView switcher (whitelisted fields only).
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
