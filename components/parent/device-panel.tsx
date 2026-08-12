"use client";

import { useCallback, useEffect, useState } from "react";
import { Smartphone, Unlink, AlertTriangle, Loader2 } from "lucide-react";
import type { LearnerProfile } from "@/lib/types";

type Device = {
  id: string;
  label: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  revokedAt: string | null;
};

/**
 * The devices a learner is linked on, and the button that cuts one off.
 *
 * WHY THIS IS ONLY ON THE CLERK-GATED DASHBOARD
 * ---------------------------------------------
 * The in-kid-app parent room is guarded by a 4-digit PIN typed on the child's
 * own device — a speed bump, honestly labelled as one. Revoking access is a
 * security action, so it lives behind a real sign-in and nowhere else.
 *
 * WHY IT EXISTS AT ALL
 * --------------------
 * Linking used to be irreversible. Nothing in the app or the database could
 * undo a redeemed claim code, so a code typed on the wrong child's profile, or
 * on a device that later left the house, was permanent. An adult who can grant
 * access has to be able to withdraw it.
 */
export function DevicePanel({ learner }: { learner: LearnerProfile }) {
  const remoteId = learner.remoteId;
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!remoteId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/devices`);
      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (res.status === 503) { setError("Account linking isn't switched on for this deployment yet."); return; }
      if (res.status === 404) { setDevices([]); return; }
      if (!res.ok) { setError("Could not read the device list."); return; }
      const data = await res.json();
      setDevices(Array.isArray(data?.devices) ? data.devices : []);
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [remoteId]);

  useEffect(() => { void load(); }, [load]);

  const revoke = async (deviceId: string) => {
    if (!remoteId) return;
    setBusyId(deviceId);
    setError(null);
    try {
      const res = await fetch(`/api/parent/learners/${remoteId}/devices`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      if (!res.ok) { setError("Could not unlink that device."); return; }
      await load();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusyId(null);
    }
  };

  if (!remoteId) return null;

  const active = (devices ?? []).filter((d) => !d.revokedAt);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-5 py-4 mb-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-violet-400">
            Linked devices
          </span>
        </div>
        {active.length > 1 && (
          <button
            onClick={() => void revoke("all")}
            disabled={busyId !== null}
            className="text-[11px] font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Unlink all
          </button>
        )}
      </div>

      <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
        Each device where {learner.name || "this learner"} typed a code. Unlinking one stops
        it syncing and closes the AI tutor there. Their progress on that device stays put —
        nothing is deleted.
      </p>

      {loading && devices === null ? (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…
        </div>
      ) : active.length === 0 ? (
        <p className="text-xs text-neutral-500">
          No devices linked yet. Create a code below and have them type it into Vidya.
        </p>
      ) : (
        <ul className="space-y-2">
          {active.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-800 bg-neutral-950/40 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-200 truncate">
                  {d.label || "Unnamed device"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Linked {new Date(d.createdAt).toLocaleDateString()}
                  {d.lastSeenAt ? ` · last synced ${new Date(d.lastSeenAt).toLocaleString()}` : " · never synced"}
                </div>
              </div>
              <button
                onClick={() => void revoke(d.id)}
                disabled={busyId !== null}
                className="inline-flex items-center gap-1 rounded-md border border-neutral-700 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-300 hover:border-red-800 hover:text-red-300 disabled:opacity-50 flex-shrink-0"
              >
                <Unlink className="w-3 h-3" />
                {busyId === d.id ? "Unlinking…" : "Unlink"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div role="alert" className="mt-3 flex items-start gap-2 text-xs text-red-400">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
