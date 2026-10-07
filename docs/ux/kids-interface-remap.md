# Kids interface remap, 7 October 2026

The owner rejected the previous child home. The live baseline put a large greeting, WebGL companion, sound controls and starter-day selector before the first activity. This release puts the next activity and varied visual choices first.

Design tokens: ink #252544, violet #6554c0, paper #f7f8fc, sky #dcf0ff, peach #ffe1cb and mint #dff1e5. Outfit handles headings; Plus Jakarta Sans handles controls and body text; Noto Sans Devanagari remains available for Hindi. The signature is an illustrated activity shelf using original flat vectors and the actual activity pictures. Quiet white surfaces separate the choices.

Layout chosen:

    Vidya / level                  language / learner / settings
    Hello / one short heading
    Next or resumed activity                     illustration
    Learning areas / varied picture choices
    Offline play
                  Play / Stories / Make / My Journey

The earlier large companion-first layout was rejected because it pushed play below the first screen. A map requiring children to learn another navigation metaphor was also rejected. This layout uses named, direct controls.

Implemented:
- Remove the WebGL companion from the application render path; retain existing public model paths for older clients.
- Finite GSAP illustration arrival, scoped cleanup, no animation gate on content, and motion-off alternatives.
- One next/resumed activity; a choice from each available learning area before repeating an area.
- All reviewed activities remain reachable, including offline activities. No grade substitution or content expansion.
- Separate starter-day controls, permanent companion decorations and observed practice into My Journey.
- Persistent bottom navigation, remembered section after visiting settings, and restored activity launch focus/scroll after exit.
- Match entry, school home and activity player surfaces; use compact authored 2D Tara where relevant.
- English default and explicit Hindi switching, existing account saving and parent-owned enrollment remain.
- Public offline cache version advances as a normal update. Existing compatibility enrollment gating remains; visual changes do not force-reload a child's in-progress activity.

Anekantavada decision record: the child perspective favors visible pictures and direct play; parent and teacher perspectives keep evidence details accessible without filling the child home; accessibility favors large controls, keyboard focus, visible instructions and optional sound/motion; language inclusion preserves Hindi and its placement-specific objectives; engineering favors static vector artwork over GPU and asset loading dependencies. The tradeoff is one additional Journey destination. These are design decisions, not measured child preferences.

Local entry rendered successfully. The local server reported unavailable database storage, so linked acceptance belongs to the hosted preview. Typecheck, lint, 910 unit tests, 33 security/migration regressions, dependency audit and production build passed before preview submission. Isolated database CI, hosted responsive acceptance and production release evidence are recorded in the PR.

No schema changes, no learner reset, no content deletion, no outreach and no new server analytics. Physical iPad, audio/haptic hardware and consented child usability research remain unverified. No learning or retention improvement is claimed.

Preview critique kept the original activity shelf and removed excess filter rows on phones in favor of a horizontally scrollable area strip. Settings now share the same surface; advancing an activity clears previous narration. Grades 1/2 open their reviewed general-exploration starter directly from Today. Older grades retain their existing curriculum recommendation or clearly described library route. Initial enrollment returns to the top of the home.
