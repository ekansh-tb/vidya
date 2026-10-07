"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CIRCLE_ALIASES, type CircleCard, type CircleSummary } from "@/lib/circles/contract";
export function ParentCircles({ learnerId }: { learnerId?: string }) {
  const [circles, setCircles] = useState<CircleSummary[]>([]); const [cards, setCards] = useState<CircleCard[]>([]);
  const [alias, setAlias] = useState<typeof CIRCLE_ALIASES[number]>(CIRCLE_ALIASES[0]);
  const [joinCode, setJoinCode] = useState(""); const [invite, setInvite] = useState(""); const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
  const requestSequence = useRef(0);
  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    if (!learnerId) return;
    try { const response = await fetch(`/api/circles/parent?learnerId=${encodeURIComponent(learnerId)}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); if (sequence !== requestSequence.current) return; setCircles(data.circles); setCards(data.cards); }
    catch (error) { if (sequence === requestSequence.current) setStatus(error instanceof Error ? error.message : "Private circles could not load."); }
  }, [learnerId]);
  useEffect(() => { setCircles([]); setCards([]); setInvite(""); setJoinCode(""); setStatus(""); void refresh(); const requests = requestSequence; return () => { requests.current++; }; }, [refresh]);
  async function action(payload: unknown) {
    if (busy) return; setBusy(true); setStatus("");
    try { const response = await fetch("/api/circles/parent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); if (data.code) setInvite(data.code); else setJoinCode(""); setStatus("Updated private circles."); await refresh(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "This action could not finish."); }
    finally { setBusy(false); }
  }
  if (!learnerId) return <section className="learning-panel"><h3>Private circles</h3><p>Link a learner account first. Private circles connect families only after both parents approve.</p></section>;
  return <section className="learning-panel"><h3>Private circles</h3><p>Invite a family you know. Both parents approve, and children choose whether to share a project card. No directory, chat, or uploads.</p>
    <label className="block mt-3">Your child&apos;s circle nickname<select className="block w-full min-h-11 mt-1" value={alias} onChange={(event) => setAlias(event.target.value as typeof alias)}>{CIRCLE_ALIASES.map((name) => <option key={name}>{name}</option>)}</select></label>
    <p className="text-sm mt-3">Creating an invitation approves this connection for your child. Invitations expire in five days and work once.</p>
    <button className="min-h-11 rounded-lg px-3 mt-2" disabled={busy} onClick={() => void action({ action: "invite", learnerId, alias })}>Create family invitation</button>
    {invite && <div className="mt-3"><p>Give this code directly to the other parent:</p><code className="block break-all text-sm select-all p-3">{invite}</code><p className="text-xs">We show this code once. Refreshing will hide it.</p></div>}
    <label className="block mt-4">Invitation from another parent<input className="block w-full min-h-11 mt-1 px-2" value={joinCode} maxLength={32} autoComplete="off" onChange={(event) => setJoinCode(event.target.value.trim())} /></label><button className="min-h-11 rounded-lg px-3 mt-2" disabled={busy || joinCode.length !== 32} onClick={() => void action({ action: "accept", learnerId, alias, code: joinCode })}>Approve and join for this child</button>
    <div className="mt-4 space-y-3">{circles.map((circle) => <div key={circle.id} className="p-3 rounded-xl" style={{ border: "1px solid var(--border)" }}><strong>{circle.friendAlias ?? "Awaiting the other parent's approval"}</strong><p className="text-sm">{circle.status === "active" ? `Your child is ${circle.alias}` : circle.status}</p>{["active", "pending"].includes(circle.status) && <div className="flex gap-2 flex-wrap"><button className="min-h-11" disabled={busy} onClick={() => void action({ action: "leave", circleId: circle.id })}>Leave circle</button><button className="min-h-11" disabled={busy} onClick={() => void action({ action: "block", circleId: circle.id })}>Block circle</button></div>}</div>)}</div>
    {cards.some((card) => card.status === "pending") && <div className="mt-5"><h4>Cards your child wants to share</h4><p className="text-sm">Only this title and first picture go to the circle. Other pages and private drafts stay private.</p>{cards.filter((card) => card.status === "pending").map((card) => <div key={card.id} className="p-3 mt-3 rounded-xl" style={{ border: "1px solid var(--border)" }}><strong>{card.title}</strong><Image unoptimized width={720} height={480} className="w-full max-w-sm rounded-lg mt-2" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`} alt={`Project card preview: ${card.title}`} /><div className="flex gap-3 flex-wrap"><button className="min-h-11" disabled={busy} onClick={() => void action({ action: "review", cardId: card.id, approved: true })}>Approve this card</button><button className="min-h-11" disabled={busy} onClick={() => void action({ action: "review", cardId: card.id, approved: false })}>Keep this card private</button></div></div>)}</div>}
    <p role="status" className="text-sm mt-3">{status}</p>
  </section>;
}
