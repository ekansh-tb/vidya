/**
 * Is Clerk actually configured?
 *
 * Clerk's "keyless" mode works under `next dev` (it writes a temporary key into
 * .clerk/), but a PRODUCTION build has no such fallback: `clerkMiddleware()`
 * throws `Missing publishableKey` on every request it handles. Because the
 * middleware matcher covers essentially the whole site, one missing environment
 * variable takes down the entire app — including the kid experience, which
 * needs no authentication at all.
 *
 * So we check first and degrade deliberately:
 *   - Clerk configured    → normal behaviour, /parent gated by a real session.
 *   - Clerk NOT configured → the kid app still runs; /parent and the auth pages
 *     are closed off entirely. We fail CLOSED on the parent area: an
 *     unconfigured deployment must never expose the parent dashboard, which can
 *     read every learner profile on the device.
 *
 * The publishable key is a public value (it ships to the browser), so reading
 * it here leaks nothing.
 */
export const clerkConfigured: boolean =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;
