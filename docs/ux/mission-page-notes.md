# Mission page implementation

The production route is `/mission`, owned by `app/mission/page.tsx`. The reviewed HTML prototype is unchanged. The implementation mapping now includes the worldwide, lifelong learning extension.

This server component carries the shared-world, two-door design into a public mission page. Children are invited to think independently rather than inherit an adult identity or future. Cross-generational benefits are expressed as hopes, not scientific claims or guaranteed outcomes. The page states that lessons, practice, books and activities form free core learning; AI is optional and parent funded unless sponsorship is approved.

Learner links target `/`; the parent link targets `/parent`. Next Link renders ordinary anchors, and in-page links are native anchors. There are no event handlers, client component directives, forms, new animation dependencies or animated elements. Navigation and all page copy remain available without page JavaScript. The existing root layout and destination routes retain their own behavior.

Responsive two-column sections collapse to one column on smaller screens. A skip link, main landmark, ordered headings, named navigation, visible keyboard focus and generous link targets support access. Explicit local colors avoid relying on age-theme colors for contrast. No global styles or shared theme tokens are modified. English copy makes no translation-availability promise.

The mission page describes goals for transparent reporting and cross-cultural access; it does not claim that the prototype's proposed settings or reporting controls have shipped. Sign-in, linking, funding, AI controls and reporting remain owned by their existing routes and services.

The mission now explicitly includes every curriculum worldwide and learners at all universities, from school through university and lifelong learning. CBSE, ICSE, Cambridge and IGCSE are starting examples; Cambridge offerings are international. The adult learner path is explicitly planned, with independent permissions, child safeguarding and informed adult transition consent. No university content, affiliation, accreditation, translation or global availability is claimed. The two current CTAs still target `/` and `/parent`; no unimplemented adult route is linked.

Validation of the initial mission page, before this copy and planning extension:

- `npm run typecheck -- --incremental false`: passed.
- `npx eslint app/mission/page.tsx`: passed.
- `npm test -- --reporter=dot`: 59 files passed, 1 skipped; 609 tests passed, 65 skipped. Vite emitted a configuration-format warning about a future default loader; the test command exited successfully.
- Direct React server rendering: passed assertions for one main landmark, one h1, learner and parent anchors, matching in-page navigation targets, no client directive and no em dash. This is not a browser acceptance test.

Browser, responsive visual and assistive-technology acceptance remain with the main agent. No Git publication or deployment was performed by this worker. This extension changes only the mission page, this note and the implementation mapping; the reviewed HTML prototype remains intact.

Extension validation: typecheck passed with incremental output disabled. Direct server-render assertions passed for lifelong scope copy, both destination CTAs, a single h1, unique IDs and matching fragment targets. The changed files contain no em dashes and pass whitespace checks. The full test suite was not repeated for this content-only extension; the earlier suite result above is historical. No adult authorization behavior was implemented or tested.
