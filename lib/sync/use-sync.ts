"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "../game-store";
import { canSync, pullState, pushWithMerge, deviceLabel, type SyncState } from "./client";
import { SyncSession } from "./session";

/** Mirror pending device work to its owned account without blocking learning. */
export function useSync(): { status: SyncState; lastSyncedAt: number | null } {
  const learner = useGameStore((s) => s.learner);
  const hydrated = useGameStore((s) => s.hydrated);
  const [status, setStatus] = useState<SyncState>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const enabled = hydrated && canSync(learner);

  useEffect(() => {
    setLastSyncedAt(null);
    if (!enabled) { setStatus("idle"); return; }
    // These credentials belong to this session. Token rotation creates a new
    // session even when the local learner ID stays the same.
    const identity = learner;
    const currentIdentity = () => {
      const active = useGameStore.getState().learner;
      return active.id === identity.id && active.remoteId === identity.remoteId && active.deviceToken === identity.deviceToken;
    };
    const session = new SyncSession({
      read: () => useGameStore.getState().state,
      apply: state => { if (currentIdentity()) useGameStore.getState().set(() => state); },
      pull: signal => pullState(identity, signal),
      push: (state, revision, signal) => pushWithMerge(state, revision, deviceLabel(), identity, signal),
      profile: profile => { if (currentIdentity()) useGameStore.getState().updateLearnerMeta(identity.id, profile); },
      revoked: () => { if (currentIdentity()) useGameStore.getState().updateLearnerMeta(identity.id, { deviceToken: undefined, verifiedLevel: 0 }); },
      status: (next, savedAt) => {
        if (!currentIdentity()) return;
        setStatus(next);
        if (savedAt !== undefined) setLastSyncedAt(savedAt);
      },
      available: () => navigator.onLine && document.visibilityState !== "hidden",
    });
    const unsubscribe = useGameStore.subscribe((next, previous) => {
      if (!currentIdentity()) { session.dispose(); return; }
      if (next.state !== previous.state) session.changed();
    });
    const wake = () => { if (currentIdentity()) session.wake(); };
    const offline = () => session.offline();
    const visibility = () => {
      if (document.visibilityState === "visible") { wake(); return; }
      const pending = currentIdentity() ? session.pendingForExit() : null;
      if (!pending) return;
      try {
        navigator.sendBeacon?.("/api/learner/state", new Blob([JSON.stringify({
          ...pending, deviceLabel: deviceLabel(), deviceToken: identity.deviceToken,
        })], { type: "application/json" }));
      } catch { /* The linked cache remains available for the next revisit. */ }
    };
    window.addEventListener("online", wake);
    window.addEventListener("offline", offline);
    document.addEventListener("visibilitychange", visibility);
    session.start();
    return () => {
      unsubscribe(); session.dispose();
      window.removeEventListener("online", wake);
      window.removeEventListener("offline", offline);
      document.removeEventListener("visibilitychange", visibility);
    };
    // Only authority changes retire a session; gameplay is handled by subscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, learner.id, learner.remoteId, learner.deviceToken]);

  return { status, lastSyncedAt };
}
