"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../game-store";
import { mergeGameState } from "./merge";
import { canSync, pullState, pushWithMerge, deviceLabel, type SyncState } from "./client";

/** How long to wait after the last change before pushing. Long enough that a
 *  quiz's rapid-fire writes collapse into one request, short enough that a kid
 *  closing the tab loses at most a few seconds of progress. */
const DEBOUNCE_MS = 4000;

/**
 * Keeps the active learner's state mirrored to the server.
 *
 * Runs only for a learner who has been claimed by a parent and linked — an
 * anonymous device-local profile has no owner, and uploading a child's
 * progress before an adult has claimed them would be the wrong default.
 *
 * Never blocks or interrupts play: every failure path leaves localStorage as
 * the source of truth and simply reports a status the UI may choose to show.
 */
export function useSync(): { status: SyncState; lastSyncedAt: number | null } {
  const learner = useGameStore((s) => s.learner);
  const state = useGameStore((s) => s.state);
  const setState = useGameStore((s) => s.set);
  const hydrated = useGameStore((s) => s.hydrated);

  const [status, setStatus] = useState<SyncState>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const revisionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  // Which learner the current revision belongs to — switching profiles must
  // not push one child's state against another child's revision.
  const syncedLearnerRef = useRef<string | null>(null);

  const enabled = hydrated && canSync(learner);

  // ---- initial pull + reconcile -------------------------------------------
  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      setStatus("syncing");
      const pulled = await pullState(learner, controller.signal);
      if (cancelled) return;

      if (!pulled.ok) {
        setStatus(pulled.reason === "network" ? "offline" : "error");
        return;
      }

      revisionRef.current = pulled.revision;
      syncedLearnerRef.current = learner.id;

      if (pulled.state) {
        // Adopt the merge locally BEFORE pushing, so the server copy and this
        // device converge on the same value rather than ping-ponging.
        setState((current) => mergeGameState(current, pulled.state));
      }
      setStatus("synced");
      setLastSyncedAt(Date.now());
    })();

    return () => { cancelled = true; controller.abort(); };
    // Re-run when the learner changes or linking status flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, learner.id, learner.remoteId, learner.verifiedLevel]);

  // ---- debounced push on change -------------------------------------------
  useEffect(() => {
    if (!enabled) return;
    if (syncedLearnerRef.current !== learner.id) return; // initial pull not done

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      (async () => {
        try {
          const result = await pushWithMerge(state, revisionRef.current, deviceLabel(), learner);
          revisionRef.current = result.revision;
          // A conflict merge produces a state this device must adopt, or the
          // same conflict recurs on every push.
          if (result.state !== state) {
            setState(() => result.state);
          }
          setStatus(result.status);
          if (result.status === "synced") setLastSyncedAt(Date.now());
        } finally {
          inFlightRef.current = false;
        }
      })();
    }, DEBOUNCE_MS);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, state, learner.id]);

  // ---- best-effort flush when the tab goes away ----------------------------
  useEffect(() => {
    if (!enabled) return;
    const flush = () => {
      if (document.visibilityState !== "hidden") return;
      // keepalive lets the request outlive the page. Fire-and-forget: there is
      // no chance to handle a conflict on the way out, and the next session's
      // pull will merge anyway.
      //
      // The device token travels in the BODY here, not the usual header —
      // sendBeacon cannot set headers at all. Same-origin POST, so it is not
      // exposed anywhere a URL would be.
      try {
        navigator.sendBeacon?.(
          "/api/learner/state",
          new Blob(
            [JSON.stringify({
              state,
              expectedRevision: revisionRef.current,
              deviceLabel: deviceLabel(),
              deviceToken: learner.deviceToken,
            })],
            { type: "application/json" },
          ),
        );
      } catch {
        /* nothing useful to do while the tab is closing */
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [enabled, state, learner.deviceToken]);

  return { status, lastSyncedAt };
}
