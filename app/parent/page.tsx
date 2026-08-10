// Server wrapper for the parent dashboard.
//
// The dashboard itself is a client component that calls Clerk's `useUser`.
// Next tried to prerender it at build time, which fails with
// "useUser can only be used within the <ClerkProvider />" whenever Clerk has no
// keys — so a keyless build (CI, or a fresh clone) could not compile at all.
//
// Forcing dynamic rendering keeps the build key-free. When Clerk is
// unconfigured, middleware.ts redirects /parent away before this ever renders.
import { ParentDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default function Page() {
  return <ParentDashboard />;
}
