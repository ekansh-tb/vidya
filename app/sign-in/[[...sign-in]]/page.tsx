import { SignIn } from "@clerk/nextjs";
import { CosmicBg } from "@/components/effects/cosmic-bg";

/**
 * Parent sign-in. Mounts Clerk's full-page <SignIn /> form.
 *
 * The /sign-in/** catch-all is required by Clerk so it can render
 * subroutes (factor-one, factor-two, sso-callback, etc.) without
 * a manual route per step.
 *
 * Kids do NOT sign in here. The kid lobby at / is open and writes
 * the active learner to localStorage. Adult areas (/parent/**) are
 * what require this form.
 */
export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      <CosmicBg mode="parent" intensity={0.85} />
      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-neutral-500">
            Parent Sign-In
          </div>
          <h1 className="font-display text-3xl font-bold mt-2 tracking-tight text-neutral-100">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-400 mt-2 italic">
            The parent zone hosts AI configuration, exam schedules and
            care-layer controls. Sign in to manage.
          </p>
        </div>
        <SignIn signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
