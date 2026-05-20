import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { CosmicBg } from "@/components/effects/cosmic-bg";
import { OpinionCard } from "@/components/parent/opinion-card";

/**
 * Parent dashboard. Clerk-gated (also enforced in proxy.ts — this server
 * check is defence in depth so a misconfigured middleware can't expose it).
 *
 * Supabase reads are intentionally not wired yet — the migration's been
 * rewritten for Clerk JWT but isn't run. Once it is, learner counts and
 * verification-level surface here.
 */
export default async function ParentDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?next=/parent");

  const user = await currentUser();
  const displayName =
    user?.firstName?.trim() ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Parent";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <main className="min-h-screen text-neutral-100 relative">
      <CosmicBg mode="parent" intensity={0.6} />
      <header className="border-b border-neutral-900 relative bg-neutral-950/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">Vidya · Parent</div>
            <h1 className="font-display text-2xl font-bold mt-1">Dashboard</h1>
          </div>
          <SignOutButton>
            <button
              type="submit"
              className="text-[11px] uppercase tracking-widest font-bold px-3 py-2 rounded-md border border-neutral-800 hover:border-neutral-700 active:scale-95 transition"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1">Signed in as</div>
          <div className="text-base font-semibold">{displayName}</div>
          {email && <div className="text-xs text-neutral-500 mt-0.5">{email}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            label="Learners on this account"
            value="—"
            footer="Sync activates after the Supabase migration runs and the kid-claim flow lands."
          />
          <Card
            label="Verification rung"
            value="Rung 2"
            footer="Parent-verified once you confirm your email. Rung 3 (BYOK + incognito) needs ops review."
          />
          <Card
            label="Data isolation"
            value="Enforced"
            footer="Each kid's data sealed to their profile via Clerk role + RLS."
          />
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold">Preview · how findings will look</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">
              Sample data — not yet linked to a real learner
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <OpinionCard
              tone="academic"
              window="Last 7 days · Mathematics"
              observation="62% of attempted questions were on fractions; 41% accuracy there."
              opinion="This might mean fractions are a current sticking point. Other Maths topics this week were 78%+, so it looks topic-specific, not a broad slip."
              escalation={{ label: "Worth a chat with the class teacher", to: "teacher" }}
            />
            <OpinionCard
              tone="medical"
              window="Across the last 4 sessions"
              observation="Average session length dropped 38% after 7pm."
              opinion="This might mean evening sessions are tiring. Light or screen-time could be a factor — worth seeing if morning sessions feel different."
              escalation={{ label: "Worth a doctor's note if it persists", to: "doctor" }}
            />
            <OpinionCard
              tone="warm"
              window="This week"
              observation="3 new badges unlocked; longest streak in 6 weeks."
              opinion="This might be a good week to celebrate out loud — momentum is real and visible to your learner."
              escalation={{ label: "A note from you on the class noticeboard?", to: "self" }}
            />
          </div>
          <p className="mt-3 text-[10px] text-neutral-600 leading-relaxed max-w-3xl">
            Every finding the parent dashboard ever shows will be shaped exactly like this:
            <span className="text-neutral-400"> data window + observed % + &quot;this might mean…&quot; + a human to escalate to.</span>{" "}
            No claims. No verdicts. You stay in charge.
          </p>
        </section>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-5">
          <h2 className="font-display text-lg font-bold mb-1">What lives here next</h2>
          <ul className="text-sm text-neutral-400 space-y-1.5 mt-3">
            <li>· <span className="text-neutral-200">Add a learner</span> — issue a claim code that lets your kid sign in (or auto-link via same Wi-Fi)</li>
            <li>· <span className="text-neutral-200">Health profile</span> per kid — advisories, doctor-recommended therapy tracks (rung 3)</li>
            <li>· <span className="text-neutral-200">AI configuration</span> — bring your own keys (OpenAI / Anthropic / Grok / OpenRouter / Gemini), route by subject (rung 3)</li>
            <li>· <span className="text-neutral-200">Exam schedule</span> — dates in, reminders out, revision curated automatically (rung 2)</li>
            <li>· <span className="text-neutral-200">Analytics</span> — opinions, never claims; every finding shows the data behind it</li>
            <li>· <span className="text-neutral-200">Incognito toggles</span> — what each kid can and can&apos;t see in their lobby (rung 3, parent-invisible)</li>
          </ul>
        </div>

        <p className="text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-900 pt-6">
          VIDYA is built so that AI and humans can take care of each other.
          You teach the AI how to teach your kid; the AI helps your kid
          flourish; we both observe quietly. Nothing here is ever a claim —
          only an opinion you can verify, override, or discard.
        </p>
      </section>
    </main>
  );
}

function Card({ label, value, footer }: { label: string; value: string; footer: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
      <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{label}</div>
      <div className="font-display text-3xl font-bold mt-1.5 tracking-tight">{value}</div>
      <div className="text-[11px] text-neutral-500 mt-1.5 leading-snug">{footer}</div>
    </div>
  );
}
