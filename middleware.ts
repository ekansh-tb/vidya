// Clerk + path-role gating.
//
// Three duties:
//   1. Initialise Clerk auth on every matched request — but only when Clerk is
//      actually configured (see lib/auth/clerk-config.ts). Without a
//      publishable key, clerkMiddleware() throws on EVERY request in a
//      production build, which took the whole app down rather than just the
//      parent area.
//   2. Gate /parent/** to signed-in users — anonymous hits redirect
//      to /sign-in?next=<original-path>.
//   3. When Clerk is absent, close the parent area and the auth pages instead
//      of opening them. The kid app keeps working.
//
// Future (when role metadata + /student/** routes ship):
//   - require role=parent on /parent/**
//   - require role=learner on /student/**
//
// NOTE: this middleware does NOT protect /api/**. clerkMiddleware only
// *initialises* auth on a matched route; it never requires a session. The AI
// routes guard themselves — see lib/api/guard.ts.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { parentReturnPath } from "@/lib/auth/parent-return";
import { clerkConfigured } from "@/lib/auth/clerk-config";

const isParentArea = createRouteMatcher(["/parent(.*)"]);
const isAuthArea = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

/** Fallback used when Clerk has no keys: kid app open, everything auth-shaped closed. */
function withoutClerk(req: NextRequest) {
  if (req.nextUrl.hostname === "parents.vidyagyan.study" && (req.nextUrl.pathname === "/" || isParentArea(req) || isAuthArea(req))) {
    const url = req.nextUrl.clone(); url.pathname = "/parent-unavailable"; url.search = "";
    return NextResponse.rewrite(url);
  }
  if (isParentArea(req) || isAuthArea(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

const withClerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Parent area requires a signed-in user. Anonymous → /sign-in with return target.
  if (isParentArea(req) && !userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Signed-in users on parent auth pages return to a parent page.
  if (isAuthArea(req) && userId) {
    const url = new URL(parentReturnPath(req.nextUrl.searchParams.get("next")), req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, event: import("next/server").NextFetchEvent) {
  // Only these exact public probes skip Clerk. Other APIs keep their own guards.
  const pathname = req.nextUrl.pathname;
  if (pathname === "/api/health" || pathname === "/api/health/ready") {
    return NextResponse.next();
  }
  if (!clerkConfigured) return withoutClerk(req);
  if (req.nextUrl.hostname === "parents.vidyagyan.study" && pathname === "/") {
    const url = req.nextUrl.clone(); url.pathname = "/parent"; url.search = "";
    return NextResponse.redirect(url);
  }
  return withClerk(req, event);
}

export const config = {
  matcher: [
    // Match everything except Next internals and static assets.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
