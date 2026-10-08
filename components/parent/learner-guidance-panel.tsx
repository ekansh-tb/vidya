"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import type { GuidanceVersion } from "@/lib/db/parent-guidance";

/** Mount with the server-owned learner id. Keying prevents drafts crossing learners. */
export function LearnerGuidancePanel({ learnerId }: { learnerId: string }) {
  return <GuidanceEditor key={learnerId} learnerId={learnerId} />;
}

function GuidanceEditor({ learnerId }: { learnerId: string }) {
  const fieldId = useId();
  const [versions, setVersions] = useState<GuidanceVersion[] | null>(null);
  // Only the newest page sets current. Older history must never drive writes.
  const [current, setCurrent] = useState<GuidanceVersion | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const olderRequest = useRef<AbortController | null>(null);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const endpoint = `/api/parent/learners/${encodeURIComponent(learnerId)}/guidance`;

  useEffect(() => {
    const controller = new AbortController();
    olderRequest.current?.abort();
    setVersions(null);
    setCurrent(null);
    setNextCursor(null);
    setLoadingOlder(false);
    void (async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.versions) ||
            (data.nextCursor !== null && typeof data.nextCursor !== "string")) throw new Error("Could not load guidance.");
        if (!controller.signal.aborted) {
          setVersions(data.versions);
          setCurrent(data.versions[0] ?? null);
          setNextCursor(data.nextCursor);
          setContent(data.versions[0]?.content ?? "");
        }
      } catch {
        if (!controller.signal.aborted) setNotice("Could not load guidance. Try reloading.");
      }
    })();
    return () => { controller.abort(); olderRequest.current?.abort(); };
  }, [endpoint, refresh]);

  async function loadOlder() {
    if (!nextCursor || loadingOlder || busy || !versions) return;
    const controller = new AbortController();
    olderRequest.current = controller;
    setLoadingOlder(true);
    setNotice("");
    try {
      const response = await fetch(`${endpoint}?cursor=${encodeURIComponent(nextCursor)}`, {
        cache: "no-store", signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.versions) ||
          (data.nextCursor !== null && typeof data.nextCursor !== "string")) throw new Error("Could not load older guidance.");
      if (!controller.signal.aborted) {
        setVersions((previous) => {
          if (!previous) return previous;
          const seen = new Set(previous.map((version) => version.version));
          const older = (data.versions as GuidanceVersion[]).filter((version) => {
            if (seen.has(version.version)) return false;
            seen.add(version.version);
            return true;
          });
          return [...previous, ...older];
        });
        setNextCursor(data.nextCursor);
      }
    } catch {
      if (!controller.signal.aborted) setNotice("Could not load older history. Try again.");
    } finally {
      if (!controller.signal.aborted) setLoadingOlder(false);
    }
  }

  const write = useReverification(async (input: {
    status: GuidanceVersion["status"]; content: string; expectedVersion: number;
  }) => {
    const response = await fetch(endpoint, {
      method: "PUT", cache: "no-store", headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    return { ...(await response.json()), httpStatus: response.status };
  });

  async function save(status: GuidanceVersion["status"]) {
    if (!versions || loadingOlder || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const result = await write({ status, content: status === "withdrawn" ? "" : content.trim(), expectedVersion: current?.version ?? 0 });
      if (!result.saved) {
        setNotice(result.httpStatus === 409 ? "Another edit was saved. Copy your draft, then reload before saving." : "Could not save guidance. Try again.");
        return;
      }
      setNotice(status === "approved" ? "Approved for the next tutor request." : status === "withdrawn" ? "Withdrawn from the next tutor request." : "Draft saved. No guidance is currently active.");
      setVersions(null);
      setNextCursor(null);
      setRefresh((value) => value + 1);
    } catch (error) {
      setNotice(isReverificationCancelledError(error) ? "Verification cancelled. Nothing changed." : "Could not save guidance.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby={`${fieldId}-heading`} className="parent-card">
      <h2 id={`${fieldId}-heading`} className="text-xl font-bold">Teaching guidance and corrections</h2>
      <p>Only the latest approved text is sent to the AI provider configured for this learner on subsequent tutor requests. Use it for teaching preferences, not secrets or sensitive personal details. Model responses are not guaranteed to keep this text confidential. Guidance cannot grant authority to override safety, curriculum or identity rules. It is not added to shared training by Vidya.</p>
      <p>Saving a draft replaces any active approval. Withdrawal stops future use; it cannot recall a reply already in progress. Versions remain in your private history.</p>
      <p className="mt-3 text-sm">Current status: {versions === null ? "Loading or unavailable" : current ? `${current.status}, version ${current.version}` : "No guidance"}</p>
      <label htmlFor={fieldId} className="mt-4 block font-medium">Teaching preferences or factual corrections</label>
      <textarea id={fieldId} value={content} maxLength={2000} rows={5} disabled={busy || versions === null}
        onChange={(event) => setContent(event.target.value)} aria-describedby={`${fieldId}-help`}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]" />
      <p id={`${fieldId}-help`} className="parent-small">{content.length}/2000 characters. Include only teaching context needed by the tutor. Do not include secrets or sensitive family details.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {([ ["draft", "Save draft"], ["approved", "Approve for tutoring"], ["withdrawn", "Withdraw guidance"] ] as const).map(([status, label]) => (
          <button key={status} type="button" onClick={() => void save(status)}
            disabled={busy || loadingOlder || versions === null || (status === "withdrawn" ? !current || current.status === "withdrawn" : !content.trim())}
            className="parent-secondary min-h-11 disabled:opacity-40">{label}</button>
        ))}
        <button type="button" disabled={busy || loadingOlder} onClick={() => setRefresh((value) => value + 1)} className="min-h-11 px-3 underline">Reload</button>
      </div>
      <p role="status" className="mt-3 text-sm">{notice}</p>
      {versions && versions.length > 0 && <details className="mt-4">
        <summary className="cursor-pointer">Private version history ({versions.length} loaded)</summary>
        <ol className="mt-3 space-y-3">{versions.map((version) => <li key={version.version} className="border-t border-[var(--border)] pt-3">
          <p className="text-sm">Version {version.version}: {version.status} · {version.createdAt}</p>
          <p className="whitespace-pre-wrap text-sm text-[var(--text-muted)]">{version.content || "Guidance withdrawn"}</p>
          {version.content && <button type="button" disabled={busy} onClick={() => setContent(version.content)} className="min-h-11 underline">Use as new draft</button>}
        </li>)}</ol>
        {nextCursor && <button type="button" disabled={busy || loadingOlder} onClick={() => void loadOlder()}
          className="mt-3 min-h-11 px-3 underline">{loadingOlder ? "Loading older history..." : "Load older history"}</button>}
      </details>}
    </section>
  );
}
