"use client";

import { useEffect, useState } from "react";
import { useReverification, useUser } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import { canApproveAccount, pairingTokenSchema, parentLinkCommand, reviewedAccountSchema, type ReviewedAccount } from "@/lib/auth/account-link-ui";

/** The dashboard supplies only an id from its ownership-scoped server roster. */
export function ParentAccountLinkPanel({ learnerId }: { learnerId: string }) {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) return null;
  return <AccountLinkEditor key={`${user.id}:${learnerId}`} parentId={user.id} learnerId={learnerId} />;
}

function AccountLinkEditor({ parentId, learnerId }: { parentId: string; learnerId: string }) {
  const [token, setToken] = useState("");
  const [review, setReview] = useState<ReviewedAccount | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [revokeConfirmed, setRevokeConfirmed] = useState(false);
  const [linked, setLinked] = useState<{ clerkUserId: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [now, setNow] = useState(0);
  const command = useReverification((input: Parameters<typeof parentLinkCommand>[1]) => parentLinkCommand(learnerId, input));
  function clearPairing() { setToken(""); setReview(null); setConfirmed(false); setRevokeConfirmed(false); }
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (review && now >= Date.parse(review.expiresAt)) {
      setReview(null); setToken(""); setConfirmed(false); setNotice("The inspected request expired. Ask for a new pairing code.");
    }
  }, [review, now]);
  useEffect(() => {
    const controller = new AbortController();
    setLinked(null);
    void (async () => {
      try {
        const response = await fetch(`/api/parent/learners/${learnerId}/account-link`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok || data.parentId !== parentId || !(data.clerkUserId === null || typeof data.clerkUserId === "string")) throw new Error("Unavailable");
        if (!controller.signal.aborted) setLinked({ clerkUserId: data.clerkUserId });
      } catch {
        if (!controller.signal.aborted) setNotice("Could not check the sign-in link. Reload before making changes.");
      }
    })();
    return () => controller.abort();
  }, [learnerId, parentId, refresh]);

  async function inspect() {
    const value = token.trim();
    if (!pairingTokenSchema.safeParse(value).success || !linked || linked.clerkUserId || busy) return;
    setBusy(true); setReview(null); setConfirmed(false); setNotice(""); setToken(value);
    try {
      const result = await command({ action: "inspect", token: value });
      const parsed = reviewedAccountSchema.safeParse(result);
      if (result?.httpStatus !== 200 || !parsed.success || Date.parse(parsed.data.expiresAt) <= Date.now()) throw new Error("Unavailable");
      setReview({ ...parsed.data, token: value });
    } catch (error) { clearPairing(); setNotice(isReverificationCancelledError(error) ? "Verification cancelled. No account was linked." : "This request is unavailable. Ask the learner for a fresh pairing code."); }
    finally { setBusy(false); }
  }

  async function approve() {
    if (!canApproveAccount(review, token, confirmed, Date.now()) || !review || busy || !linked || linked.clerkUserId) return;
    setBusy(true); setNotice("");
    try {
      const result = await command({ action: "approve", token: review.token, expectedClerkUserId: review.clerkUserId });
      if (result?.httpStatus !== 200 || result.ok !== true) throw new Error("Unavailable");
      setNotice("Learner sign-in linked. Device links are separate.");
    } catch (error) { setNotice(isReverificationCancelledError(error) ? "Verification cancelled. No approval was sent." : "Approval was not confirmed. Reload the link status before trying again."); }
    finally { clearPairing(); setLinked(null); setRefresh((value) => value + 1); setBusy(false); }
  }

  async function revoke() {
    if (!linked?.clerkUserId || !revokeConfirmed || busy) return;
    setBusy(true); setNotice("");
    try {
      const result = await command({ action: "revoke" });
      if (result?.httpStatus !== 200 || result.ok !== true) throw new Error("Unavailable");
      setNotice("Sign-in link revoked. The account remains classified as a learner. Separately linked devices are unchanged.");
    } catch (error) { setNotice(isReverificationCancelledError(error) ? "Verification cancelled. No revocation was sent." : "Revocation was not confirmed. Reload to check the link status."); }
    finally { clearPairing(); setLinked(null); setRefresh((value) => value + 1); setBusy(false); }
  }

  return <section className="space-y-4 rounded-lg border border-neutral-700 p-5">
    <h3 className="text-xl font-bold">Learner sign-in account</h3>
    <p className="text-sm text-neutral-300">Optional: link this learner&apos;s own Clerk sign-in. This is separate from the device code below. Never use your parent account as the learner&apos;s sign-in.</p>
    <p className="text-sm">Ask the learner to open <a href="/learner/account" className="underline">learner account settings</a> on their own signed-in session and explicitly request a parent pairing code.</p>
    {!linked ? <p role="status">Sign-in link status is loading or unavailable.</p> : linked.clerkUserId ? <>
      <p className="break-all text-sm">Linked sign-in reference: {linked.clerkUserId}</p>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={revokeConfirmed} disabled={busy} onChange={(event) => setRevokeConfirmed(event.target.checked)} />Remove this sign-in account&apos;s access to the learner. Device access must be managed separately.</label>
      <button type="button" disabled={!revokeConfirmed || busy} onClick={() => void revoke()} className="min-h-11 rounded border border-red-700 px-4 disabled:opacity-50">Revoke sign-in link</button>
    </> : <>
      <form onSubmit={(event) => { event.preventDefault(); void inspect(); }} className="space-y-3" autoComplete="off">
        <label className="block text-sm">Parent pairing code<input type="password" autoComplete="off" spellCheck={false} maxLength={43} value={token} disabled={busy} onChange={(event) => { setToken(event.target.value); setReview(null); setConfirmed(false); }} className="mt-2 block w-full rounded border border-neutral-600 bg-neutral-950 p-3" /></label>
        <button type="submit" disabled={busy || !pairingTokenSchema.safeParse(token.trim()).success} className="min-h-11 rounded border border-neutral-600 px-4 disabled:opacity-50">Inspect sign-in account</button>
      </form>
      {review && <div className="space-y-3 rounded border border-violet-700 p-4">
        <p className="break-all text-sm">Account to approve: {review.clerkUserId}</p>
        <p className="text-sm">Expires {new Date(review.expiresAt).toLocaleTimeString()}. Compare this reference with the learner&apos;s screen. Inspecting has not linked anything.</p>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={confirmed} disabled={busy} onChange={(event) => setConfirmed(event.target.checked)} />I checked that this is this learner&apos;s own account and want it linked to this learner.</label>
        <button type="button" disabled={busy || !canApproveAccount(review, token, confirmed, now)} onClick={() => void approve()} className="min-h-11 rounded bg-violet-600 px-4 disabled:opacity-50">Approve this account</button>
      </div>}
    </>}
    <div className="flex flex-wrap gap-4 text-sm">
      <button type="button" disabled={busy} onClick={clearPairing} className="min-h-11 underline">Clear pairing details</button>
      <button type="button" disabled={busy} onClick={() => { clearPairing(); setRefresh((value) => value + 1); }} className="min-h-11 underline">Reload sign-in link</button>
    </div>
    <p role="status" className="text-sm">{notice}</p>
  </section>;
}
