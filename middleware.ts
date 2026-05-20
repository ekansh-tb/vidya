// Clerk + path-role gating.
//
// Two duties:
//   1. Initialise Clerk auth on every matched request.
//   2. Gate /parent/** to signed-in users — anonymous hits redirect
//      to /sign-in?next=<original-path>.
//
// Future (when role metadata + /student/** routes ship):
//   - require role=parent on /parent/**
//   - require role=learner on /student/**
//   - redirect signed-in users away from /sign-in to their role home

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isParentArea = createRouteMatcher(["/parent(.*)"]);
const isAuthArea = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Parent area requires a signed-in user. Anonymous → /sign-in with return target.
  if (isParentArea(req) && !userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Signed-in users hitting the auth pages get bounced to home.
  if (isAuthArea(req) && userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match everything except Next internals and static assets.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
