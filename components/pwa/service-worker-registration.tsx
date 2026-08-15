"use client";

import { useEffect, useRef, useState } from "react";
import {
  APPLIED_UPDATE_KEY,
  PENDING_UPDATE_KEY,
  UPDATE_MESSAGES,
  updateReloadDecision,
  validUpdateId,
} from "@/components/pwa/update-protocol";

const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1_000;

function readSessionValue(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionValue(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // The in-memory ref still prevents a duplicate reload in this page.
  }
}

function createUpdateId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

export function ServiceWorkerRegistration() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const pendingUpdateRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;
    let registration: ServiceWorkerRegistration | null = null;
    let updateInterval: ReturnType<typeof setInterval> | null = null;
    let hasReloaded = false;
    let hasController = Boolean(navigator.serviceWorker.controller);

    const savedPendingUpdate = readSessionValue(PENDING_UPDATE_KEY);
    if (validUpdateId(savedPendingUpdate)) pendingUpdateRef.current = savedPendingUpdate;

    const showWaitingWorker = (worker: ServiceWorker | null) => {
      if (!cancelled && worker && navigator.serviceWorker.controller) {
        setNoticeDismissed(false);
        setWaitingWorker(worker);
      }
    };

    const handleControllerChange = () => {
      const updateId = pendingUpdateRef.current ?? readSessionValue(PENDING_UPDATE_KEY);
      const decision = updateReloadDecision({
        hasController,
        hasReloaded,
        pendingUpdateId: updateId,
        appliedUpdateId: readSessionValue(APPLIED_UPDATE_KEY),
      });
      if (decision === "claim-only") {
        hasController = true;
        return;
      }
      if (decision === "ignore" || !updateId) return;

      hasReloaded = true;
      writeSessionValue(APPLIED_UPDATE_KEY, updateId);
      writeSessionValue(PENDING_UPDATE_KEY, null);
      window.location.reload();
    };

    const handleWorkerMessage = (event: MessageEvent) => {
      const message = event.data as { type?: unknown; updateId?: unknown } | null;
      if (!message || !validUpdateId(message.updateId)) return;

      if (message.type === UPDATE_MESSAGES.prepare) {
        pendingUpdateRef.current = message.updateId;
        writeSessionValue(PENDING_UPDATE_KEY, message.updateId);
        setUpdateError(false);
        setUpdateInProgress(true);
        event.ports[0]?.postMessage({ type: UPDATE_MESSAGES.ready, updateId: message.updateId });
      } else if (message.type === UPDATE_MESSAGES.failed) {
        if (pendingUpdateRef.current === message.updateId) {
          pendingUpdateRef.current = null;
          writeSessionValue(PENDING_UPDATE_KEY, null);
        }
        setUpdateInProgress(false);
        setUpdateError(true);
      }
    };

    const handleOnline = () => {
      void registration?.update().catch(() => {
        // The currently installed app remains usable if an update check fails.
      });
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    navigator.serviceWorker.addEventListener("message", handleWorkerMessage);
    window.addEventListener("online", handleOnline);

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registeredWorker) => {
        if (cancelled) return;

        registration = registeredWorker;
        showWaitingWorker(registeredWorker.waiting);

        registeredWorker.addEventListener("updatefound", () => {
          const installingWorker = registeredWorker.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed") {
              showWaitingWorker(registeredWorker.waiting ?? installingWorker);
            }
          });
        });

        void registeredWorker.update().catch(() => {
          // Registration succeeded, so a temporary update failure needs no UI.
        });

        updateInterval = setInterval(() => {
          if (document.visibilityState === "visible" && navigator.onLine) {
            void registeredWorker.update().catch(() => {
              // Keep using the active version until the network is available.
            });
          }
        }, UPDATE_CHECK_INTERVAL_MS);
      })
      .catch(() => {
        // Service workers are an enhancement. The web app remains fully usable.
      });

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      navigator.serviceWorker.removeEventListener("message", handleWorkerMessage);
      window.removeEventListener("online", handleOnline);
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);

  if (!waitingWorker || noticeDismissed) return null;

  return (
    <section
      aria-labelledby="vidya-update-title"
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[120] mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-violet-300/40 bg-[#121629] p-4 text-white shadow-2xl"
      role="status"
    >
      <div className="min-w-0 flex-1">
        <h2 id="vidya-update-title" className="text-sm font-bold">
          {updateInProgress ? "Updating every open Vidya tab" : updateError ? "The update did not start" : "A Vidya update is ready"}
        </h2>
        <p className="mt-1 text-xs text-white/75">
          {updateInProgress
            ? "Keep this tab open for a moment. Each open Vidya tab will refresh once."
            : updateError
              ? "Your current version is still safe to use. Try the update again when you are ready."
              : "Update when you are ready. Your saved learning progress will stay on this device."}
        </p>
      </div>
      {!updateInProgress && (
        <>
          <button
            type="button"
            className="min-h-11 rounded-xl bg-violet-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#121629]"
            onClick={() => {
              const updateId = createUpdateId();
              setUpdateError(false);
              setUpdateInProgress(true);
              waitingWorker.postMessage({ type: UPDATE_MESSAGES.activate, updateId });
            }}
          >
            {updateError ? "Try update again" : "Update now"}
          </button>
          <button
            type="button"
            aria-label="Dismiss update notice"
            className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setNoticeDismissed(true)}
          >
            Later
          </button>
        </>
      )}
    </section>
  );
}
