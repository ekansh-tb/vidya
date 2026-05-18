"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { CosmicBg } from "@/components/effects/cosmic-bg";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/parent";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrMsg(null);

    const supabase = createBrowserSupabase();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      setErrMsg(error.message);
      return;
    }
    setStatus("sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-neutral-100 px-4 relative">
      <CosmicBg mode="parent" intensity={0.85} />
      <div className="w-full max-w-sm relative">
        <div className="mb-10 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-500">Parent Sign-In</div>
          <h1 className="font-display text-3xl font-bold mt-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            One link, sent to your inbox. No passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={status === "sending" || status === "sent"}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent" || !email.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {status === "sending" ? "Sending…" : status === "sent" ? "Link sent" : "Send magic link"}
          </button>
        </form>

        {status === "sent" && (
          <div className="mt-5 rounded-md border border-emerald-700/40 bg-emerald-950/40 px-3 py-2.5 text-xs text-emerald-200">
            Check {email} for a sign-in link. The link expires in 60 minutes.
          </div>
        )}

        {status === "error" && errMsg && (
          <div className="mt-5 rounded-md border border-rose-700/40 bg-rose-950/40 px-3 py-2.5 text-xs text-rose-200">
            {errMsg}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-neutral-900 text-[11px] text-neutral-500 leading-relaxed">
          The parent zone hosts sensitive controls — AI configuration,
          medical notes, exam schedules. We use one-time email links so
          there&apos;s nothing to remember and nothing to leak.{" "}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
          >
            ← Back to kid mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
