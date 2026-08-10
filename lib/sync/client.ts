"use client";

import type { GameState, LearnerProfile } from "../types";
import { mergeGameState } from "./merge";

/**
 * Client half of state sync.
 *
 * LOCAL-FIRST, DELIBERATELY. localStorage remains the source of truth for the
 * running session: every write lands there first and the UI never waits on the
 * network. The server is a durable mirror, so clearing site data or moving
 * device stops being permanent data loss.
 *
 * Consequences of that choice, all intentional:
 *   - Sync failures are never surfaced as errors that block play. A child on a
 *     patchy school connection should not see a sync warning mid-quiz.
 *   - Conflicts are resolved by merging (see ./merge.ts), not by picking a
 *     winner, so two devices cannot erase each other.
 *   - Nothing syncs at all until the learner is linked to an account. An
 *     anonymous device-local profile has no server row and no owner, and
 *     uploading a child's progress without an adult having claimed them would
 *     be exactly the wrong default.
 */

export type SyncState = "idle" | "syncing" | "synced" | "offline" | "error";

export function canSync(learner: LearnerProfile): boolean {
  return Boolean(learner.remoteId) && (learner.verifiedLevel ?? 0) >= 2;
}

type PullResult =
  | { ok: true; state: GameState | null; revision: number }
  | { ok: false; reason: "unauthorized" | "unavailable" | "network" };

export async function pullState(signal?: AbortSignal): Promise<PullResult> {
  try {
    const res = await fetch("/api/learner/state", { signal });
    if (res.status === 401) return { ok: false, reason: "unauthorized" };
    if (res.status === 503) return { ok: false, reason: "unavailable" };
    if (!res.ok) return { ok: false, reason: "network" };
    const data = await res.json();
    return { ok: true, state: (data?.state ?? null) as GameState | null, revision: Number(data?.revision ?? 0) };
  } catch {
    return { ok: false, reason: "network" };
  }
}

type PushResult =
  | { ok: true; revision: number }
  | { ok: false; reason: "conflict"; serverState: GameState; serverRevision: number }
  | { ok: false; reason: "unauthorized" | "unavailable" | "network" | "too_large" };

export async function pushState(
  state: GameState,
  expectedRevision: number,
  deviceLabel?: string,
  signal?: AbortSignal,
): Promise<PushResult> {
  try {
    const res = await fetch("/api/learner/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state, expectedRevision, deviceLabel }),
      signal,
    });
    if (res.status === 401) return { ok: false, reason: "unauthorized" };
    if (res.status === 503) return { ok: false, reason: "unavailable" };
    if (res.status === 413) return { ok: false, reason: "too_large" };
    if (res.status === 409) {
      const data = await res.json().catch(() => null);
      return {
        ok: false,
        reason: "conflict",
        serverState: data?.serverState as GameState,
        serverRevision: Number(data?.serverRevision ?? 0),
      };
    }
    if (!res.ok) return { ok: false, reason: "network" };
    const data = await res.json();
    return { ok: true, revision: Number(data?.revision ?? 0) };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/**
 * Pushes, and on a version conflict merges the server's copy in and retries.
 *
 * One retry only. A second conflict means another device is actively writing;
 * the next debounced push will pick it up, and looping here would just burn
 * battery on a device that is losing the race anyway.
 *
 * Returns the state that is now authoritative locally — the caller must adopt
 * it, otherwise the merge result is discarded and the conflict repeats forever.
 */
export async function pushWithMerge(
  local: GameState,
  expectedRevision: number,
  deviceLabel?: string,
): Promise<{ state: GameState; revision: number; status: SyncState }> {
  const first = await pushState(local, expectedRevision, deviceLabel);
  if (first.ok) return { state: local, revision: first.revision, status: "synced" };

  if (first.reason === "conflict") {
    const merged = mergeGameState(local, first.serverState);
    const second = await pushState(merged, first.serverRevision, deviceLabel);
    if (second.ok) return { state: merged, revision: second.revision, status: "synced" };
    // Still contended — keep the merged state locally so nothing is lost, and
    // let the next push settle it.
    return {
      state: merged,
      revision: second.ok ? 0 : first.serverRevision,
      status: second.reason === "network" ? "offline" : "error",
    };
  }

  return {
    state: local,
    revision: expectedRevision,
    status: first.reason === "network" ? "offline" : "error",
  };
}

/** A short, human label so a parent can tell which device wrote last. */
export function deviceLabel(): string {
  if (typeof navigator === "undefined") return "device";
  const ua = navigator.userAgent;
  if (/iPad/i.test(ua)) return "iPad";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? "Android phone" : "Android tablet";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows PC";
  return "device";
}
