"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LEARNER_ACCOUNT_ACKNOWLEDGEMENT, LEARNER_ACCOUNT_DISCLOSURE, learnerLinkStatusSchema, pairingRequestSchema, type LearnerLinkStatus } from "@/lib/auth/account-link-ui";

export function LearnerAccountPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <p role="status">Loading sign-in...</p>;
  if (!isSignedIn || !user) return <div className="space-y-4">
    <p className="text-sm">Use your own separate sign-in, not your parent&apos;s account. Signing in alone does not classify or link you.</p>
    <SignInButton mode="modal" forceRedirectUrl="/learner/account"><button type="button" className="min-h-11 rounded bg-violet-600 px-4">Sign in to request a link</button></SignInButton>
  </div>;
  return <SignedInLearnerAccount key={user.id} accountId={user.id} />;
}

function SignedInLearnerAccount({ accountId }: { accountId: string }) {
  const [status, setStatus] = useState<LearnerLinkStatus | null>(null);
  const [pairing, setPairing] = useState<{ token: string; expiresAt: string } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (pairing && now >= Date.parse(pairing.expiresAt)) setPairing(null);
  }, [now, pairing]);
  useEffect(() => {
    const controller = new AbortController();
    setStatus(null);
    void (async () => {
      try {
        const response = await fetch("/api/account/learner-link", { cache: "no-store", signal: controller.signal });
        const parsed = learnerLinkStatusSchema.safeParse(await response.json());
        if (!response.ok || !parsed.success || parsed.data.accountId !== accountId) throw new Error("Unavailable");
        if (!controller.signal.aborted) {
          setStatus(parsed.data);
          const data = parsed.data;
          setPairing((current) => data.status === "pending" && current?.expiresAt === data.expiresAt ? current : null);
        }
      } catch {
        if (!controller.signal.aborted) { setPairing(null); setNotice("Could not check your account. Try checking again."); }
      }
    })();
    return () => controller.abort();
  }, [accountId, refresh]);

  async function request() {
    if (!accepted || busy || !status || status.status === "parent" || status.status === "linked") return;
    setBusy(true); setPairing(null); setNotice("");
    try {
      const response = await fetch("/api/account/learner-link", {
        method: "POST", cache: "no-store", headers: { "content-type": "application/json" },
        body: JSON.stringify({ learnerAccountAcknowledgement: true }),
      });
      const parsed = pairingRequestSchema.safeParse(await response.json());
      if (!response.ok || !parsed.success || parsed.data.accountId !== accountId) throw new Error("Unavailable");
      setPairing(parsed.data); setStatus({ accountId, status: "pending", expiresAt: parsed.data.expiresAt });
      setNotice("Show this pairing code only to the parent or guardian you want to approve your account.");
    } catch { setNotice("Could not create a pairing code. Check your account status before trying again."); }
    finally { setBusy(false); }
  }

  const expired = status && "expiresAt" in status && now >= Date.parse(status.expiresAt);
  return <div className="space-y-4">
    <p className="text-sm leading-relaxed">{LEARNER_ACCOUNT_DISCLOSURE}</p>
    <p className="text-xs text-neutral-400">Your sign-in reference: <span className="break-all">{accountId}</span>. Your parent will check this reference before approving.</p>
    <p role="status">{!status ? "Account status is loading or unavailable."
      : status.status === "linked" ? `Linked learner: ${status.learnerName}. Approving parent or guardian: ${status.guardianName ?? "the parent account that approved your link"}.`
        : status.status === "parent" ? "This is a parent account. Use your own separate learner sign-in."
          : status.status === "revoked" ? "Your parent has removed this sign-in link. Your account remains a learner account."
            : expired || status.status === "expired" ? "Your pairing code has expired. Request a new one if you still want to link."
              : status.status === "pending" ? "Waiting for parent approval."
                : status.status === "unclassified" ? "You have not chosen a learner account yet."
                  : "Your learner account is not linked."}</p>
    {status && "expiresAt" in status && <p className="text-sm">Pairing request expires {new Date(status.expiresAt).toLocaleTimeString()}.</p>}
    {status && status.status !== "parent" && status.status !== "linked" && <>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={accepted} disabled={busy} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0" /><span>{LEARNER_ACCOUNT_ACKNOWLEDGEMENT}</span></label>
      <button type="button" disabled={!accepted || busy} onClick={() => void request()} className="min-h-11 rounded bg-violet-600 px-4 disabled:opacity-50">{busy ? "Requesting..." : "Request a new parent pairing code"}</button>
      <p className="text-xs text-neutral-400">A new request replaces the previous code. The learner classification stays even if you hide the code, reload, or unlink later.</p>
    </>}
    {pairing && now < Date.parse(pairing.expiresAt) && <div className="rounded border border-neutral-700 p-4">
      <p className="text-sm">Parent pairing code, not a device-link code:</p>
      <output className="my-3 block break-all select-all font-mono">{pairing.token}</output>
      <p className="text-sm">Expires {new Date(pairing.expiresAt).toLocaleTimeString()}.</p>
      <button type="button" onClick={() => setPairing(null)} className="min-h-11 underline">Hide code from this screen</button>
      <p className="text-xs text-neutral-400">Hiding does not cancel it. It expires automatically or is replaced by a new request.</p>
    </div>}
    <button type="button" disabled={busy} onClick={() => { setNotice(""); setRefresh((value) => value + 1); }} className="min-h-11 underline">Check link status</button>
    <p role="status" className="text-sm">{notice}</p>
    <SignOutButton redirectUrl="/learner/account"><button type="button" className="min-h-11 underline">Sign out</button></SignOutButton>
  </div>;
}
