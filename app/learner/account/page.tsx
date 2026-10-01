import Link from "next/link";
import { clerkConfigured } from "@/lib/auth/clerk-config";
import { LearnerAccountPanel } from "./learner-account-panel";

export const dynamic = "force-dynamic";

export default function Page() {
  return <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
    <section className="mx-auto max-w-xl space-y-5">
      <h1 className="font-display text-3xl font-bold">Your learner sign-in</h1>
      <p className="text-sm text-neutral-300">A sign-in is optional. You can keep learning as a guest without linking an account.</p>
      <Link href="/" className="inline-block min-h-11 py-3 text-violet-300 underline">Continue learning as a guest</Link>
      {clerkConfigured ? <LearnerAccountPanel /> : <p role="status">Account linking is unavailable here. Guest learning is still open.</p>}
    </section>
  </main>;
}
