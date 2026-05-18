"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Reads its session from the cookie that
 * the server-side middleware refreshes on each request.
 *
 * Use inside Client Components and Client-Component hooks. Never import
 * this from a Server Component or API route — use `createServerSupabase`
 * from `./server.ts` instead.
 */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
