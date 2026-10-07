"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { ContentRevision } from "@/lib/admin/contracts";
import { coverage, REVIEW_CHECKS } from "@/lib/admin/contracts";
const SECTIONS = ["Overview", "Content", "Learners & Families", "Quality & Safety", "AI & Costs", "Support", "Settings"] as const;
type Section = typeof SECTIONS[number];
type Learner = { id: string; parent_id: string | null; name: string; grade: number | null; board: string | null; placement?: { kind: string; level?: string; grade?: number }; active_devices: number };
type Device = { id: string; label: string | null; revoked_at: string | null };
type Receipt = { id: string; organization: string; channel: string; status: string; contribution: string; evidence: string; occurred_on: string; next_action: string; expiry: string | null; amount: number | null; currency: string | null };
type Audit = { id: string; actor: string; event: string; resource_id: string; created_at: string };
async function api<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`/api/admin/${path}`, { cache: "no-store", credentials: "same-origin", ...(body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}) });
  const data = await r.json(); if (!r.ok) throw new Error(data.error ?? "Operation unavailable"); return data;
}
export function AdminWorkspace() {
  const [section, setSection] = useState<Section>("Overview");
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [learners, setLearners] = useState<Learner[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  const [selected, setSelected] = useState<ContentRevision | null>(null); const [editor, setEditor] = useState(""); const [filter, setFilter] = useState("");
  const [checks, setChecks] = useState<string[]>([]); const [limits, setLimits] = useState("");
  const [correction, setCorrection] = useState({ level: "", board: "", confirmed: false });
  const [family, setFamily] = useState<Learner | null>(null); const [devices, setDevices] = useState<Device[]>([]); const [confirmDevice, setConfirmDevice] = useState<string | null>(null);
  const [receipt, setReceipt] = useState({ organization: "", channel: "email", status: "sent", contribution: "", evidence: "", occurredOn: "", nextAction: "", expiry: "", amount: "", currency: "USD" });
  const load = useCallback(async () => {
    const results = await Promise.all([
      api<{ counts: Record<string, number> }>("overview"), api<{ revisions: ContentRevision[] }>("content"),
      api<{ learners: Learner[] }>("learners"), api<{ receipts: Receipt[] }>("support"), api<{ events: Audit[] }>("audit"),
    ]);
    setCounts(results[0].counts); setRevisions(results[1].revisions); setSelected(current => current ? results[1].revisions.find(r => r.id === current.id && r.revision === current.revision) ?? current : null); setLearners(results[2].learners); setReceipts(results[3].receipts); setAudit(results[4].events);
  }, []);
  useEffect(() => { let active = true; load().catch(e => { if (active) setError(e instanceof Error ? e.message : "Could not load workspace"); }); return () => { active = false; }; }, [load]);
  async function action(operation: () => Promise<unknown>, success: string) {
    if (busy) return; setBusy(true); setError(""); setNotice("");
    try { await operation(); await load(); setNotice(success); } catch (e) { setError(e instanceof Error ? e.message : "Operation failed"); } finally { setBusy(false); }
  }
  function select(r: ContentRevision) { setSelected(r); setEditor(JSON.stringify(r.payload, null, 2)); setChecks([]); setLimits(r.reviewRecord?.limitations ?? r.payload.review.limits); }
  const report = coverage(revisions);
  return <main className="admin-shell">
    <header className="admin-header"><div><Link href="/" className="admin-brand">Vidya</Link><p>Owner workspace</p></div><Link href="/parent">Parent application</Link></header>
    <nav className="admin-nav" aria-label="Owner workspace">{SECTIONS.map(s => <button key={s} aria-current={section === s ? "page" : undefined} onClick={() => { setSection(s); setError(""); setNotice(""); }}>{s}</button>)}</nav>
    <div className="admin-body"><div className="admin-title"><h1>{section}</h1><button disabled={busy} onClick={() => action(load, "Workspace refreshed")}>Refresh</button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}{notice && <p role="status" className="admin-success">{notice}</p>}
    {section === "Overview" && <>
      <p>Operational records, not measures of a child’s ability or behaviour.</p>
      <div className="admin-stats">{Object.entries(counts).map(([key, value]) => <article key={key}><span>{key.replaceAll("_", " ")}</span><strong>{value}</strong></article>)}</div>
      <article className="admin-panel"><h2>Release checks</h2><p>Check exact placement, reviewed content, saved progress and both health endpoints after every release. This workspace does not deploy application code.</p><div className="admin-links"><a href="/api/health" target="_blank" rel="noreferrer">Application health</a><a href="/api/health/ready" target="_blank" rel="noreferrer">Storage readiness</a></div></article>
    </>}
    {section === "Content" && <>
      <div className="admin-toolbar"><label>Find content<input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Title, ID or placement" /></label><button disabled={busy} onClick={() => action(() => api("content", { action: "seed" }), "Existing authored content imported with original IDs and editorial limitations")}>Import existing authored collection</button></div>
      <p>Published content is immutable. Changes create a new revision. Archive removes a revision from new selection while preserving saved activities. Import preserves existing editorial review and does not claim independent expert validation.</p>
      <div className="admin-content-grid"><div className="admin-revision-list">{revisions.filter(r => `${r.id} ${r.payload.title.en} ${r.payload.placements.join(" ")}`.toLowerCase().includes(filter.toLowerCase())).map(r => <button key={`${r.id}@${r.revision}`} aria-pressed={selected?.id === r.id && selected.revision === r.revision} onClick={() => select(r)}><strong>{r.payload.title.en}</strong><span>{r.id} · v{r.revision} · {r.status}</span></button>)}{!revisions.length && <p>Import the authored collection to begin. No content has been removed.</p>}</div>
      <article className="admin-panel">{selected ? <>
        <h2>{selected.payload.title.en}</h2><p>{selected.payload.objective.en}</p><p>{selected.payload.title.hi}</p><p>Eligible: {selected.payload.placements.join(", ")} · {selected.payload.alignment}</p>
        <details><summary>Preview instructions</summary>{selected.payload.steps.map((s, i) => <div key={i}><h3>Step {i + 1}</h3><p>{s.instruction.en}</p><p lang="hi">{s.instruction.hi}</p><p>Hint: {s.hint.en}</p><p>Items: {s.items.map(i => i.label.en).join(", ")}</p></div>)}</details>
        <label>Activity JSON for a new draft<textarea className="admin-json" rows={16} value={editor} onChange={e => setEditor(e.target.value)} spellCheck={false} /></label>
        <button disabled={busy} onClick={() => action(async () => { const result = await api<{ revision: ContentRevision }>("content", { action: "draft", payload: JSON.parse(editor) }); select(result.revision); }, "New draft created. Original revision retained.")}>Save as new draft</button>
        <p>Rights: {selected.payload.rights}. Source: {selected.payload.source}</p>
        {(selected.status === "draft" || selected.status === "review") && <fieldset><legend>Recorded editorial review</legend>{REVIEW_CHECKS.map(c => <label key={c} className="admin-check"><input type="checkbox" checked={checks.includes(c)} onChange={e => setChecks(v => e.target.checked ? [...v, c] : v.filter(x => x !== c))} />{c}</label>)}<label>Limitations and unresolved uncertainty<textarea value={limits} onChange={e => setLimits(e.target.value)} rows={3} minLength={20} /></label><button disabled={busy || checks.length !== 5 || limits.trim().length < 20} onClick={() => action(() => api("content", { action: "review", id: selected.id, revision: selected.revision, record: { checks, limitations: limits } }), "Review recorded. Review the recorded limitations before publishing.")}>Record review</button></fieldset>}
        {selected.status === "review" && <button disabled={busy} onClick={() => action(() => api("content", { action: "publish", id: selected.id, revision: selected.revision }), "Reviewed revision published. Saved older revisions retained.")}>Publish reviewed revision</button>}
        {selected.status === "published" && <button disabled={busy} onClick={() => action(() => api("content", { action: "archive", id: selected.id, revision: selected.revision }), "Revision archived for new selections")}>Archive publication</button>}
        <p>Review limits: {selected.reviewRecord?.limitations ?? selected.payload.review.limits}</p>
      </> : <p>Select an activity to preview, create a draft or record a review.</p>}</article></div>
    </>}
    {section === "Learners & Families" && <>
      <p>Support uses explicit family ownership. Private reflections, care notes, progress bodies and tutor conversations are excluded.</p>
      <div className="admin-table-wrap"><table><thead><tr><th>Learner</th><th>Placement</th><th>Family</th><th>Devices</th><th>Support</th></tr></thead><tbody>{learners.map(l => <tr key={l.id}><td>{l.name}<small>{l.id}</small></td><td>{l.placement?.kind === "early-years" ? l.placement.level : `Grade ${l.grade ?? "unavailable"}`}<small>{l.board}</small></td><td>{l.parent_id ?? "Unclaimed"}</td><td>{l.active_devices}</td><td><button disabled={busy || !l.parent_id} onClick={() => action(async () => { const data = await api<{ devices: Device[] }>(`learners?learnerId=${encodeURIComponent(l.id)}&parentId=${encodeURIComponent(l.parent_id!)}`); setFamily(l); setCorrection({ level: "", board: "", confirmed: false }); setDevices(data.devices); setConfirmDevice(null); }, "Scoped device list loaded")}>Review devices</button></td></tr>)}</tbody></table></div>
      {family && <article className="admin-panel"><h2>Devices for {family.name}</h2><p>Revocation stops this device from accessing the learner account. It does not delete saved progress. Confirm with the family before using support recovery.</p>{devices.map(d => <div key={d.id} className="admin-device"><span>{d.label ?? "Unnamed device"}<small>{d.id} · {d.revoked_at ? "Revoked" : "Active"}</small></span>{!d.revoked_at && (confirmDevice === d.id ? <><button disabled={busy} onClick={() => action(async () => { await api("operations", { action: "revoke-device", parentId: family.parent_id, learnerId: family.id, deviceId: d.id, confirmation: "REVOKE" }); setDevices(v => v.map(x => x.id === d.id ? { ...x, revoked_at: "revoked" } : x)); setConfirmDevice(null); }, "Device revoked for this family")}>Confirm revocation</button><button onClick={() => setConfirmDevice(null)}>Cancel</button></> : <button onClick={() => setConfirmDevice(d.id)}>Revoke device</button>)}</div>)}
        <form className="admin-form" onSubmit={e => { e.preventDefault(); const placement = correction.level.startsWith("school:") ? { version: 1, kind: "school", grade: Number(correction.level.slice(7)), board: correction.board } : { version: 1, kind: "early-years", level: correction.level }; action(() => api("operations", { action: "correct-placement", parentId: family.parent_id, learnerId: family.id, placement, confirmation: "CORRECT PLACEMENT" }), "Placement corrected. Identity and historical progress retained."); }}>
          <h3>Correct placement</h3><p>Use a family-confirmed correction. Historical practice remains attached to this learner and does not become evidence for the new level.</p>
          <label>Confirmed learning level<select required value={correction.level} onChange={e => setCorrection(v => ({ ...v, level: e.target.value, confirmed: false }))}><option value="">Choose the confirmed level</option><option value="nursery">Nursery</option><option value="lkg">LKG</option><option value="ukg">UKG</option>{Array.from({ length: 13 }, (_, i) => <option key={i} value={`school:${i + 1}`}>Grade {i + 1}</option>)}</select></label>
          {correction.level.startsWith("school:") && <label>Confirmed school board<select required value={correction.board} onChange={e => setCorrection(v => ({ ...v, board: e.target.value, confirmed: false }))}><option value="">Choose the confirmed board</option><option value="cbse">CBSE</option><option value="icse">ICSE</option><option value="cambridge-primary">Cambridge Primary</option><option value="cambridge-lower-secondary">Cambridge Lower Secondary</option><option value="cambridge-igcse">Cambridge IGCSE</option></select></label>}
          <label className="admin-check"><input type="checkbox" checked={correction.confirmed} onChange={e => setCorrection(v => ({ ...v, confirmed: e.target.checked }))} />I confirmed this correction with the owning family.</label>
          <button type="submit" disabled={busy || !correction.confirmed || !correction.level || (correction.level.startsWith("school:") && !correction.board)}>Confirm placement correction</button>
        </form>
      </article>}
    </>}
    {section === "Quality & Safety" && <>
      <article className="admin-panel"><h2>Published activity coverage</h2><p>Counts represent distinct published IDs, not a complete curriculum or evidence of learning. School release gates still apply.</p><div className="admin-coverage">{report.placements.map(p => <div key={p.placement}><strong>{p.placement}</strong><span>{p.activities} activities</span></div>)}</div></article>
      <article className="admin-panel"><h2>Potential duplicate titles</h2>{report.duplicates.length ? report.duplicates.map(d => <p key={d.title}>{d.title}: {d.ids.join(", ")}</p>) : <p>No repeated titles among different published activity IDs.</p>}<p>Matching titles indicate a review candidate, not proof that content is duplicated.</p></article>
      <article className="admin-panel"><h2>Safeguarding boundaries</h2><p>No routine browsing of private child messages or reflection bodies. Parent-facing safeguarding reports stay scoped to the owning family. Content review records explicitly state their limitations.</p></article>
    </>}
    {section === "AI & Costs" && <article className="admin-panel"><h2>Generation jobs are disabled</h2><p>No paid generation endpoint is enabled by this release. A documented funded allowance, configured provider, spending limit and safeguarding review are required before jobs can be enabled.</p><p>Existing parent-owned credentials stay in the encrypted connection vault. This workspace never reads or reveals them. ChatGPT subscriptions do not fund API calls.</p><h3>Draft workflow</h3><p>Prepared content can be imported as a draft in Content. Every generated draft needs the same five review dimensions before publication. Existing editorial limitations remain visible.</p></article>}
    {section === "Support" && <>
      <button disabled={busy} onClick={() => action(() => api("support", { action: "import-verified-snapshot" }), "Verified snapshot through 8 October imported: four sent emails, three form receipts, zero approved awards")}>Import verified outreach snapshot</button>
      <p>Receipts describe what was sent, submitted, replied to or approved. A request is not an award. Entries stay private to the owner.</p>
      <div className="admin-table-wrap"><table><thead><tr><th>Organization</th><th>Status</th><th>Request / contribution</th><th>Evidence</th><th>Next step</th></tr></thead><tbody>{receipts.map(r => <tr key={r.id}><td>{r.organization}<small>{r.channel} · {String(r.occurred_on).slice(0, 10)}</small></td><td>{r.status}</td><td>{r.contribution}{r.amount !== null && <small>{r.amount} {r.currency}</small>}</td><td>{r.evidence}</td><td>{r.next_action}{r.expiry && <small>Expires {String(r.expiry).slice(0, 10)}</small>}</td></tr>)}</tbody></table></div>
      {!receipts.length && <p>No receipt records imported yet. This does not imply outreach never happened.</p>}
      <form className="admin-panel admin-form" onSubmit={e => { e.preventDefault(); action(() => api("support", { ...receipt, expiry: receipt.expiry || null, amount: receipt.amount ? Number(receipt.amount) : null, currency: receipt.amount ? receipt.currency : null }), "Receipt recorded. No message was sent."); }}>
        <h2>Add a documented receipt</h2>
        <label>Organization<input required maxLength={120} value={receipt.organization} onChange={e => setReceipt(v => ({ ...v, organization: e.target.value }))} /></label>
        <label>Channel<select value={receipt.channel} onChange={e => setReceipt(v => ({ ...v, channel: e.target.value }))}>{["email", "form", "conversation"].map(v => <option key={v}>{v}</option>)}</select></label>
        <label>Status<select value={receipt.status} onChange={e => setReceipt(v => ({ ...v, status: e.target.value }))}>{["prepared", "sent", "submitted", "reply-received", "approved", "declined"].map(v => <option key={v}>{v}</option>)}</select></label>
        <label>Contribution requested or confirmed<input required maxLength={500} value={receipt.contribution} onChange={e => setReceipt(v => ({ ...v, contribution: e.target.value }))} /></label>
        <label>Receipt reference or documented evidence<textarea required maxLength={1000} value={receipt.evidence} onChange={e => setReceipt(v => ({ ...v, evidence: e.target.value }))} /></label>
        <label>Receipt date<input required type="date" value={receipt.occurredOn} onChange={e => setReceipt(v => ({ ...v, occurredOn: e.target.value }))} /></label>
        <label>Next action<input maxLength={500} value={receipt.nextAction} onChange={e => setReceipt(v => ({ ...v, nextAction: e.target.value }))} /></label>
        <label>Expiry, if documented<input type="date" value={receipt.expiry} onChange={e => setReceipt(v => ({ ...v, expiry: e.target.value }))} /></label>
        <label>Confirmed amount, optional<input type="number" min="0" value={receipt.amount} onChange={e => setReceipt(v => ({ ...v, amount: e.target.value }))} /></label>
        <label>Currency<select value={receipt.currency} onChange={e => setReceipt(v => ({ ...v, currency: e.target.value }))}><option>USD</option><option>INR</option></select></label>
        <button disabled={busy} type="submit">Record receipt</button>
      </form>
    </>}
    {section === "Settings" && <>
      <article className="admin-panel"><h2>Access and configuration</h2><p>Owner access is defined by exact verified Clerk user IDs in the server-only VIDYA_ADMIN_CLERK_USER_IDS configuration. Parent status and email domains never grant access.</p><p>Content changes use immutable revisions and additive storage. Runtime deployments, owner permissions and provider credentials are managed separately with release checks.</p></article>
      <article className="admin-panel"><h2>Recent owner operations</h2><p>Audit records contain actor, action and resource identity. Private note bodies are excluded.</p>{audit.map(a => <p key={a.id}><strong>{a.event}</strong> · {a.resource_id}<small>{a.actor} · {String(a.created_at)}</small></p>)}</article>
    </>}
    </div>
  </main>;
}
