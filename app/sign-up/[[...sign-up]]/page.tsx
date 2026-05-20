import { SignUp } from "@clerk/nextjs";
import { CosmicBg } from "@/components/effects/cosmic-bg";

/**
 * Parent sign-up. Currently any new Clerk user is treated as role=parent.
 *
 * Kids do not self-sign-up; their profile is created from inside the
 * parent dashboard with a claim code. See docs/AUTH_ARCHITECTURE.md.
 */
export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      <CosmicBg mode="parent" intensity={0.85} />
      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-500">
            Parent Sign-Up
          </div>
          <h1 className="font-display text-3xl font-bold mt-2 tracking-tight text-neutral-100">
            Start a family
          </h1>
          <p className="text-sm text-neutral-400 mt-2 italic">
            One parent account, multiple learners. You stay in control
            of what each kid can see.
          </p>
        </div>
        <SignUp signInUrl="/sign-in" />
      </div>
    </main>
  );
}
