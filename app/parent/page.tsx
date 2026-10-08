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
import { createElement } from "react";
import { redirect } from "next/navigation";
import { requireParent } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Middleware authenticates only. Never mount the local-data dashboard for
  // a learner or an account that has not established parent authority.
  if (!await requireParent()) redirect("/parent/enroll");
  return createElement(ParentDashboard);
}
