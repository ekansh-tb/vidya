# Public health and redacted diagnostics

## Contract

| Endpoint | Success | Failure | Meaning |
| --- | --- | --- | --- |
| GET /api/health | 200, status alive | Platform failures may prevent a response | The handler can execute. |
| GET /api/health/ready | 200, status ready | 503, status unavailable | The local bundled board catalog imports and is nonempty within 500 ms. |

JSON contains only `status` and, when available and valid, `commit`. The commit
comes only from `VERCEL_GIT_COMMIT_SHA`, accepting a full 40 or 64 character hex
Git object ID. Missing or malformed metadata is omitted, not a readiness failure.
No branch names, deployment URLs, configuration, credentials, learner data,
dependency details or exception messages are returned. Responses use `no-store`.
The routes are dynamic so a build-time response is not reused after deployment.

Readiness is a deliberately limited local catalog smoke check. It does not prove
that every curriculum, content chunk, asset, UI journey or university is supported
or works. It is not an end-to-end production acceptance result.

## Cost and dependency boundaries

Neither handler imports database, AI or authentication clients, calls a provider,
reads learner records, or checks secret configuration. No public database probe
is implemented. Polling therefore cannot trigger Neon queries or AI inference
from these handlers. The board metadata import is local and module-cached; no
exam-pack bodies are loaded. The timeout bounds the response, not cancellation of
the module loader. It does not start remote work or allow user-chosen checks.

Missing optional AI is not a core failure. Local learning is designed to work
without a database; a ready response does not promise account sync, parent
features, authentication or AI availability. Verify these separately using
controlled synthetic accounts and approved operational access. Do not add a
public `deep`, database, URL or token parameter to these endpoints.

No shared rate limiter is changed or invoked. Routine monitoring can use a
60-second interval; ordinary hosting and middleware request costs still apply.

## Exact middleware bypass

Middleware returns `NextResponse.next()` for exactly `/api/health` and
`/api/health/ready` before invoking Clerk or checking its configuration. Query
strings do not change the pathname. No prefix bypass exists: nested paths,
lookalikes and trailing-slash pathnames still take the normal middleware path.
Next or the hosting layer may normalize URLs before middleware receives them.

All other API routes retain Clerk initialization and their existing route-level
authorization. Parent routes retain their session gate and the existing closed
fallback when Clerk is unconfigured. A mocked regression test covers both exact
health paths with a failing Clerk wrapper, nonmatching API paths, and parent and
auth redirects. The bypass avoids request-time Clerk work, not module imports
or platform failures. It does not prove database connectivity or security.
Redaction applies to handler responses; platform failures can still occur before
that boundary. Verify the complete deployed path after release.

## Deployment verification procedure

This change does not deploy anything. After an independently authorized release:

1. Obtain the expected commit from trusted deployment metadata, without reading
   secrets. Confirm that the platform provides `VERCEL_GIT_COMMIT_SHA` if commit
   comparison is required. A missing commit means identity is unverified.
2. Request both paths without cookies or authorization, first on the deployment
   URL and then on `https://vidyagyan.study`. Do not follow redirects silently.
   Use `curl --max-time 10 -i https://vidyagyan.study/api/health` and the same
   command with `/api/health/ready`.
3. Expect 200, JSON, `Cache-Control: no-store`, and exactly the documented keys.
   Compare `commit`, when present, with the expected release. An HTML page,
   redirect, missing required deployment identity or unexpected body is not a
   successful verification. An alive response alone is not readiness.
4. In an isolated test environment, simulate catalog rejection or absence and
   verify 503 with only status and optional commit. Verify timeout behavior with
   the focused tests, not by damaging production content. Missing AI or database
   modules should not change the handler result for the local catalog check.
   Confirm that both exact endpoints work without an authenticated session when
   Clerk is unavailable, while anonymous parent requests remain redirected and
   other APIs retain their own authorization behavior. Do not disable production
   authentication to run this check.
5. Record timestamp, hostname, HTTP status, redacted JSON and commit comparison.
   Do not retain full headers that may contain cookies, raw upstream errors,
   request bodies or account identifiers. Separately record browser acceptance
   and authenticated-feature checks; they are not implied by health success.

Local focused validation:

```sh
npx vitest run middleware.test.ts lib/health app/api/health
npx eslint middleware.ts middleware.test.ts lib/health app/api/health
```
