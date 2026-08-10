"use client";

import { useRef, useState } from "react";
import { Download, Upload, ShieldCheck, AlertTriangle } from "lucide-react";
import { useGameStore } from "@/lib/game-store";
import { serializeBackup, backupFilename, parseBackup, mergeProfiles } from "@/lib/backup";
import { sfx } from "@/lib/audio";

type Status =
  | { kind: "idle" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

/**
 * Backup & restore for the whole learner archive.
 *
 * All progress lives in one localStorage key, so clearing site data or moving
 * device loses everything permanently. Until a server database exists, a file
 * the family keeps is the only real backup — and the only way to move a
 * learner from one device to another.
 *
 * Restore MERGES rather than replaces: a learner who exists on this device but
 * not in the file is never dropped, because a restore should not be able to
 * turn one loss into two.
 */
export function BackupPanel() {
  const profiles = useGameStore((s) => s.profiles);
  const restoreProfiles = useGameStore((s) => s.restoreProfiles);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const fileRef = useRef<HTMLInputElement | null>(null);

  const learnerCount = Object.keys(profiles.learners).length;

  const doExport = () => {
    sfx.click();
    try {
      const blob = new Blob([serializeBackup(profiles)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFilename(profiles);
      a.click();
      URL.revokeObjectURL(url);
      setStatus({
        kind: "ok",
        message: `Saved a backup of ${learnerCount} learner${learnerCount === 1 ? "" : "s"}. Keep it somewhere safe.`,
      });
    } catch {
      setStatus({ kind: "error", message: "Couldn't create the file. Try a different browser." });
    }
  };

  const doImport = async (file: File) => {
    const text = await file.text();
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setStatus({ kind: "error", message: parsed.error });
      return;
    }
    const { profiles: merged, added, replaced } = mergeProfiles(profiles, parsed.profiles);
    restoreProfiles(merged);
    sfx.coin();

    const parts: string[] = [];
    if (added.length) parts.push(`${added.length} added`);
    if (replaced.length) parts.push(`${replaced.length} updated`);
    setStatus({
      kind: "ok",
      message: parts.length
        ? `Restored — ${parts.join(", ")}. Nothing already on this device was removed.`
        : "That backup matched what's already here. Nothing changed.",
    });
  };

  return (
    <div className="glass-card p-5 mb-5">
      <div className="flex items-center gap-1.5 mb-2">
        <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Backup &amp; restore
        </span>
      </div>

      <p className="text-sm mb-1" style={{ color: "var(--text)" }}>
        All progress is stored in this browser only.
      </p>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Clearing site data, switching browsers or changing device loses it permanently — there is no
        server copy. Download a backup now and again, and use it to move a learner to a new device.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={doExport}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold active:scale-95"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Download className="w-4 h-4" />
          Download backup
        </button>

        <button
          onClick={() => { sfx.click(); fileRef.current?.click(); }}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold active:scale-95"
          style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          <Upload className="w-4 h-4" />
          Restore from file
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a Vidya backup file to restore"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset first so picking the same file twice still fires onChange.
            e.target.value = "";
            if (file) void doImport(file);
          }}
        />
      </div>

      {status.kind !== "idle" && (
        <div
          role="status"
          className="mt-3 pt-3 text-xs leading-relaxed flex items-start gap-2"
          style={{ borderTop: "1px dashed var(--border)", color: "var(--text-muted)" }}
        >
          {status.kind === "error" && (
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--error)" }} />
          )}
          <span style={status.kind === "error" ? { color: "var(--error)" } : undefined}>
            {status.message}
          </span>
        </div>
      )}
    </div>
  );
}
