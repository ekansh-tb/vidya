"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton, useClerk, useReverification, useUser } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import { PARENT_ACKNOWLEDGEMENT_TEXT, PARENT_ACKNOWLEDGEMENT_VERSION } from "@/lib/auth/parent-enrollment-contract";

export function ParentEnrollmentForm({ blocked }: { blocked: boolean }) {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitRequest = useCallback(async () => {
    const response = await fetch("/api/account/parent-enrollment", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ adultGuardianAttestation: accepted, acknowledgementVersion: PARENT_ACKNOWLEDGEMENT_VERSION }),
    });
    // Clerk's hook recognizes its challenge in the returned JSON and retries.
    return response.json();
  }, [accepted]);
  const enrollWithReverification = useReverification(submitRequest);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!accepted || blocked || busy) return;
    setBusy(true); setError(null);
    try {
      const result = await enrollWithReverification();
      if (result?.ok === true) {
        router.replace("/parent"); router.refresh();
      } else {
        setError(typeof result?.error === "string" ? result.error : "Enrollment was not completed. Please try again.");
      }
    } catch (cause) {
      setError(isReverificationCancelledError(cause)
        ? "Verification was cancelled. Your account was not enrolled."
        : "Could not complete enrollment. Please try again.");
    } finally { setBusy(false); }
  }

  if (!isLoaded) return <p role="status">Loading your account...</p>;
  const verified = user?.primaryEmailAddress?.verification.status === "verified";
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">Give your child room to explore, and stay connected to what they choose to share. <Link href="/mission" className="text-[var(--accent)] underline">Read Vidya&apos;s mission</Link>.</p>
      <p className="text-sm text-[var(--text-muted)]">Signed in as {user?.primaryEmailAddress?.emailAddress ?? "an account without a primary email"}.</p>
      {blocked ? (
        <p role="status" className="text-[var(--text-muted)]">This is a learner account. A parent or guardian must use a separate adult account. Unlinking a learner does not change its account type.</p>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">Set up your own parent account to manage learners you are responsible for. This does not give you access to another family. This acknowledgement is a self-declaration, not verification of age or guardianship.</p>
          {!verified && <p role="status" className="text-sm text-[var(--warning)]">Verify your primary email in account settings before continuing.</p>}
          <button type="button" onClick={() => clerk.openUserProfile()} className="min-h-11 text-sm text-[var(--accent)] underline focus-visible:outline focus-visible:outline-2">Account settings and email verification</button>
          <label className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-4 text-sm leading-relaxed">
            <input type="checkbox" required checked={accepted} disabled={busy} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" />
            <span>{PARENT_ACKNOWLEDGEMENT_TEXT}</span>
          </label>
          <p className="text-xs text-[var(--text-muted)]">Acknowledgement version: {PARENT_ACKNOWLEDGEMENT_VERSION}. Vidya records the text, time, verified email and account/session references. You may be asked to verify your sign-in again.</p>
          <button type="submit" disabled={!accepted || !verified || busy} className="parent-primary w-full justify-center">
            {busy ? "Setting up your account..." : "Confirm and create parent account"}
          </button>
        </form>
      )}
      {error && <p role="alert" className="text-sm text-[var(--error)]">{error}</p>}
      <div className="flex flex-wrap items-center gap-5 text-sm">
        <SignOutButton redirectUrl="/sign-in?next=/parent/enroll"><button type="button" className="min-h-11 underline">Sign out and use another account</button></SignOutButton>
        <Link href="/" className="min-h-11 py-3 text-[var(--text-muted)] underline">Return to learning</Link>
      </div>
    </div>
  );
}
