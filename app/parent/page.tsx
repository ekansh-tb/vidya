import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CosmicBg } from "@/components/effects/cosmic-bg";

export default async function ParentDashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware also gates this, but a server-side check is defence in depth.
  if (!user) redirect("/sign-in?next=/parent");

  const { data: parent } = await supabase
    .from("parents")
    .select("display_name, created_at")
    .eq("id", user.id)
    .single();

  const { count: learnersCount } = await supabase
    .from("learners")
    .select("id", { count: "exact", head: true });

  return (
    <main className="min-h-screen text-neutral-100 relative">
      <CosmicBg mode="parent" intensity={0.6} />
      <header className="border-b border-neutral-900 relative bg-neutral-950/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">Vidya Quest · Parent</div>
            <h1 className="font-display text-2xl font-bold mt-1">Dashboard</h1>
          </div>
          <SignOutButton />
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1">Signed in as</div>
          <div className="text-base font-semibold">{parent?.display_name || user.email}</div>
          <div className="text-xs text-neutral-500 mt-0.5">{user.email}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            label="Learners on this account"
            value={String(learnersCount ?? 0)}
            footer="Each kid's data is sealed to their profile."
          />
          <Card
            label="Sensitive features"
            value="Coming"
            footer="Health, AI keys, exam dates roll out behind PIN gate."
          />
          <Card
            label="Data isolation"
            value="Enforced"
            footer="Row-level security on every sensitive table."
          />
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-5">
          <h2 className="font-display text-lg font-bold mb-1">What lives here next</h2>
          <ul className="text-sm text-neutral-400 space-y-1.5 mt-3">
            <li>· <span className="text-neutral-200">Health profile</span> per kid — advisories, doctor-recommended therapy tracks</li>
            <li>· <span className="text-neutral-200">AI configuration</span> — bring your own keys (OpenAI / Anthropic / Grok / OpenRouter / Gemini), route by subject</li>
            <li>· <span className="text-neutral-200">Exam schedule</span> — dates in, reminders out, revision curated automatically</li>
            <li>· <span className="text-neutral-200">Analytics</span> — opinions, never claims; every finding shows the data behind it</li>
            <li>· <span className="text-neutral-200">Incognito toggles</span> — what each kid can and can&apos;t see in their lobby</li>
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
