"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { apiErrorMessage } from "@/lib/ai/connection-summary";
import {
  parseAiTutorProfilesResponse,
  parseLearnerAiAssignmentDeletion,
  parseLearnerAiAssignmentResponse,
  type AiTutorProfileSummary,
  type LearnerAiAssignmentSummary,
} from "@/lib/ai/tutor-profile-summary";
import {
  isTutorDailyTurnLimit,
  isTutorMaxOutputTokens,
  TUTOR_POLICY_LIMITS,
} from "@/lib/ai/tutor-policy";
import type { LearnerProfile } from "@/lib/types";

type LearnerIdentity = Pick<LearnerProfile, "name" | "remoteId">;
type Notice = { kind: "success" | "error" | "neutral"; text: string };
type SaveAssignmentInput = {
  learnerId: string;
  tutorProfileId: string;
  enabled: boolean;
  dailyTurnLimit: number;
  maxOutputTokens: number;
};

const fieldClass = "min-h-11 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";

async function responseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export function LearnerAiTutorAccessPanel({
  learner,
  refreshToken,
}: {
  learner: LearnerIdentity | null;
  refreshToken: number;
}) {
  const headingId = useId();
  const profileId = useId();
  const enabledId = useId();
  const dailyLimitId = useId();
  const outputLimitId = useId();
  const [profiles, setProfiles] = useState<AiTutorProfileSummary[] | null>(null);
  const [assignment, setAssignment] = useState<LearnerAiAssignmentSummary | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [dailyLimitInput, setDailyLimitInput] = useState(
    String(TUTOR_POLICY_LIMITS.dailyTurns.default),
  );
  const [outputLimitInput, setOutputLimitInput] = useState(
    String(TUTOR_POLICY_LIMITS.maxOutputTokens.default),
  );
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const remoteId = learner?.remoteId;

  const loadSettings = useCallback(async (signal?: AbortSignal) => {
    if (!remoteId) {
      setProfiles(null);
      setAssignment(null);
      setLoadError(null);
      setLoading(false);
      setSelectedProfileId("");
      setEnabled(false);
      setDailyLimitInput(String(TUTOR_POLICY_LIMITS.dailyTurns.default));
      setOutputLimitInput(String(TUTOR_POLICY_LIMITS.maxOutputTokens.default));
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const [profilesResponse, assignmentResponse] = await Promise.all([
        fetch("/api/parent/ai-tutors", { cache: "no-store", signal }),
        fetch(`/api/parent/learners/${encodeURIComponent(remoteId)}/ai-tutor`, {
          cache: "no-store",
          signal,
        }),
      ]);
      const [profilesPayload, assignmentPayload] = await Promise.all([
        responseJson(profilesResponse),
        responseJson(assignmentResponse),
      ]);
      if (signal?.aborted) return;
      if (!profilesResponse.ok) {
        setLoadError(apiErrorMessage(profilesPayload, "Could not load AI tutor profiles."));
        return;
      }
      if (!assignmentResponse.ok) {
        setLoadError(apiErrorMessage(assignmentPayload, "Could not load learner AI access."));
        return;
      }

      const parsedProfiles = parseAiTutorProfilesResponse(profilesPayload);
      const parsedAssignment = parseLearnerAiAssignmentResponse(assignmentPayload);
      if (!parsedProfiles || parsedAssignment === undefined) {
        setLoadError("The server returned invalid learner AI settings.");
        return;
      }

      setProfiles(parsedProfiles);
      setAssignment(parsedAssignment);
      if (parsedAssignment) {
        setSelectedProfileId(parsedAssignment.tutorProfileId);
        setEnabled(parsedAssignment.enabled);
        setDailyLimitInput(String(parsedAssignment.dailyTurnLimit));
        setOutputLimitInput(String(parsedAssignment.maxOutputTokens));
      } else {
        setSelectedProfileId(
          parsedProfiles.find((profile) => profile.connectionStatus === "active")?.id
            ?? parsedProfiles[0]?.id
            ?? "",
        );
        setEnabled(false);
        setDailyLimitInput(String(TUTOR_POLICY_LIMITS.dailyTurns.default));
        setOutputLimitInput(String(TUTOR_POLICY_LIMITS.maxOutputTokens.default));
      }
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
      setLoadError("Could not reach Vidya. Check your connection and try again.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [remoteId]);

  useEffect(() => {
    const controller = new AbortController();
    setNotice(null);
    setConfirmRemove(false);
    void loadSettings(controller.signal);
    return () => controller.abort();
  }, [loadSettings, refreshToken]);

  const saveRequest = useCallback(async (input: SaveAssignmentInput): Promise<unknown> => {
    const response = await fetch(
      `/api/parent/learners/${encodeURIComponent(input.learnerId)}/ai-tutor`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tutorProfileId: input.tutorProfileId,
          enabled: input.enabled,
          dailyTurnLimit: input.dailyTurnLimit,
          maxOutputTokens: input.maxOutputTokens,
        }),
      },
    );
    return responseJson(response);
  }, []);

  const removeRequest = useCallback(async (learnerId: string): Promise<unknown> => {
    const response = await fetch(
      `/api/parent/learners/${encodeURIComponent(learnerId)}/ai-tutor`,
      { method: "DELETE" },
    );
    return responseJson(response);
  }, []);

  const saveWithReverification = useReverification(saveRequest);
  const removeWithReverification = useReverification(removeRequest);

  const handleCancelledReverification = (error: unknown): boolean => {
    if (!isReverificationCancelledError(error)) return false;
    setNotice({ kind: "neutral", text: "Verification was cancelled. Nothing changed." });
    return true;
  };

  const dailyTurnLimit = Number(dailyLimitInput);
  const maxOutputTokens = Number(outputLimitInput);
  const selectedProfile = useMemo(
    () => profiles?.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  );
  const savedProfile = useMemo(
    () => profiles?.find((profile) => profile.id === assignment?.tutorProfileId) ?? null,
    [assignment?.tutorProfileId, profiles],
  );
  const savedAssignmentBlocked = Boolean(
    assignment?.enabled && savedProfile?.connectionStatus !== "active",
  );
  const limitsValid = isTutorDailyTurnLimit(dailyTurnLimit)
    && isTutorMaxOutputTokens(maxOutputTokens);
  const canSave = Boolean(
    remoteId
    && selectedProfile
    && limitsValid
    && (!enabled || selectedProfile.connectionStatus === "active"),
  );
  const busy = busyAction !== null;

  const saveAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!remoteId || !selectedProfile || !canSave) {
      setNotice({ kind: "error", text: "Check the tutor, provider connection, and limits before saving." });
      return;
    }

    setBusyAction("save");
    setNotice(null);
    try {
      const payload = await saveWithReverification({
        learnerId: remoteId,
        tutorProfileId: selectedProfile.id,
        enabled,
        dailyTurnLimit,
        maxOutputTokens,
      });
      const saved = parseLearnerAiAssignmentResponse(payload);
      if (!saved) {
        setNotice({
          kind: "error",
          text: apiErrorMessage(payload, "Could not save learner AI access."),
        });
        return;
      }
      setAssignment(saved);
      setConfirmRemove(false);
      setNotice({
        kind: "success",
        text: enabled
          ? `${selectedProfile.name} is approved for ${learner?.name || "this learner"}.`
          : `AI tutor access is paused for ${learner?.name || "this learner"}.`,
      });
    } catch (error) {
      if (!handleCancelledReverification(error)) {
        setNotice({ kind: "error", text: "Could not save learner AI access." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const removeAssignment = async () => {
    if (!remoteId) return;
    setBusyAction("remove");
    setNotice(null);
    try {
      const payload = await removeWithReverification(remoteId);
      const deleted = parseLearnerAiAssignmentDeletion(payload);
      if (deleted === null) {
        setNotice({
          kind: "error",
          text: apiErrorMessage(payload, "Could not remove learner AI access."),
        });
        return;
      }
      setAssignment(null);
      setEnabled(false);
      setConfirmRemove(false);
      setNotice({
        kind: "success",
        text: `The AI tutor assignment was removed for ${learner?.name || "this learner"}.`,
      });
    } catch (error) {
      if (!handleCancelledReverification(error)) {
        setNotice({ kind: "error", text: "Could not remove learner AI access." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-cyan-900/60 bg-neutral-900/60 px-5 py-5 shadow-lg shadow-cyan-950/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em]">Learner access</span>
          </div>
          <h2 id={headingId} className="font-display text-2xl font-bold text-white">
            Assign an AI tutor
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Select one tutor for the learner currently shown in this dashboard. You control whether
            it is enabled, how many messages may be sent each day, and the maximum reply size.
          </p>
        </div>
        {remoteId && (
          <button
            type="button"
            onClick={() => void loadSettings()}
            disabled={busy || loading}
            className={secondaryButtonClass}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        )}
      </div>

      {notice && (
        <div
          role={notice.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            notice.kind === "error"
              ? "border-red-900/70 bg-red-950/30 text-red-200"
              : notice.kind === "success"
                ? "border-emerald-900/70 bg-emerald-950/30 text-emerald-200"
                : "border-neutral-700 bg-neutral-950/60 text-neutral-300"
          }`}
        >
          {notice.text}
        </div>
      )}

      {!learner ? (
        <p className="mt-5 rounded-md border border-dashed border-neutral-700 px-4 py-5 text-sm text-neutral-400">
          Add or select a learner before configuring AI tutor access.
        </p>
      ) : !remoteId ? (
        <p className="mt-5 rounded-md border border-dashed border-neutral-700 px-4 py-5 text-sm text-neutral-400">
          Link {learner.name || "this learner"} to this parent account before assigning an AI tutor.
        </p>
      ) : loading ? (
        <div role="status" className="mt-5 flex min-h-11 items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading learner AI access
        </div>
      ) : loadError ? (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/25 px-4 py-4 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <div>
            <p>{loadError}</p>
            <button
              type="button"
              onClick={() => void loadSettings()}
              className="mt-2 min-h-11 rounded-md px-2 text-xs font-bold underline decoration-red-500 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Try again
            </button>
          </div>
        </div>
      ) : profiles?.length === 0 ? (
        <p className="mt-5 rounded-md border border-dashed border-neutral-700 px-4 py-5 text-sm text-neutral-400">
          Create a tutor profile above before assigning one to {learner.name || "this learner"}.
        </p>
      ) : (
        <form onSubmit={saveAssignment} className="mt-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white">{learner.name || "Selected learner"}</span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              savedAssignmentBlocked
                ? "bg-amber-500/15 text-amber-300"
                : assignment?.enabled
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-neutral-700/60 text-neutral-300"
            }`}>
              {assignment
                ? savedAssignmentBlocked
                  ? "Saved, connection blocked"
                  : assignment.enabled
                    ? "Saved and enabled"
                    : "Saved and paused"
                : "No assignment"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <label htmlFor={profileId} className="block text-xs font-semibold text-neutral-200">
                Tutor profile
              </label>
              <select
                id={profileId}
                value={selectedProfileId}
                onChange={(event) => {
                  const nextId = event.target.value;
                  setSelectedProfileId(nextId);
                  if (profiles?.find((profile) => profile.id === nextId)?.connectionStatus !== "active") {
                    setEnabled(false);
                  }
                }}
                disabled={busy}
                className={`${fieldClass} mt-1.5`}
              >
                {profiles?.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} · {profile.connectionLabel}
                    {profile.connectionStatus === "active" ? "" : " · needs attention"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={dailyLimitId} className="block text-xs font-semibold text-neutral-200">
                Daily messages
              </label>
              <input
                id={dailyLimitId}
                type="number"
                inputMode="numeric"
                step="1"
                min={TUTOR_POLICY_LIMITS.dailyTurns.min}
                max={TUTOR_POLICY_LIMITS.dailyTurns.max}
                value={dailyLimitInput}
                onChange={(event) => setDailyLimitInput(event.target.value)}
                disabled={busy}
                aria-describedby={`${dailyLimitId}-help`}
                className={`${fieldClass} mt-1.5`}
              />
              <p id={`${dailyLimitId}-help`} className="mt-1 text-[11px] text-neutral-500">
                Choose {TUTOR_POLICY_LIMITS.dailyTurns.min} to {TUTOR_POLICY_LIMITS.dailyTurns.max} learner messages per day.
              </p>
            </div>

            <div>
              <label htmlFor={outputLimitId} className="block text-xs font-semibold text-neutral-200">
                Maximum reply tokens
              </label>
              <input
                id={outputLimitId}
                type="number"
                inputMode="numeric"
                step="1"
                min={TUTOR_POLICY_LIMITS.maxOutputTokens.min}
                max={TUTOR_POLICY_LIMITS.maxOutputTokens.max}
                value={outputLimitInput}
                onChange={(event) => setOutputLimitInput(event.target.value)}
                disabled={busy}
                aria-describedby={`${outputLimitId}-help`}
                className={`${fieldClass} mt-1.5`}
              />
              <p id={`${outputLimitId}-help`} className="mt-1 text-[11px] text-neutral-500">
                Choose {TUTOR_POLICY_LIMITS.maxOutputTokens.min} to {TUTOR_POLICY_LIMITS.maxOutputTokens.max}. Provider token sizes vary.
              </p>
            </div>

            <div className="flex items-start rounded-md border border-neutral-800 bg-neutral-950/50 px-3 py-3">
              <input
                id={enabledId}
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                disabled={busy || (!enabled && selectedProfile?.connectionStatus !== "active")}
                className="mt-1 h-5 w-5 rounded border-neutral-600 bg-neutral-900 text-cyan-500 focus:ring-cyan-300 focus:ring-offset-neutral-950"
              />
              <label htmlFor={enabledId} className="ml-3 text-xs leading-relaxed text-neutral-200">
                <span className="block font-bold">Enable tutor access</span>
                <span className="text-neutral-500">Unchecked keeps the settings saved but paused.</span>
              </label>
            </div>
          </div>

          {selectedProfile?.connectionStatus !== "active" && (
            <div role="status" className="mt-3 flex items-start gap-2 rounded-md border border-amber-900/60 bg-amber-950/20 px-3 py-3 text-xs text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              This tutor cannot be enabled until its provider connection is active again.
            </div>
          )}

          {!limitsValid && (
            <p role="alert" className="mt-3 text-xs font-semibold text-red-300">
              Enter whole-number limits within the ranges shown above.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" disabled={busy || !canSave} className={primaryButtonClass}>
              {busyAction === "save" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              )}
              {busyAction === "save" ? "Saving access" : "Save learner access"}
            </button>
            {assignment && !confirmRemove && (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                disabled={busy}
                className={secondaryButtonClass}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove assignment
              </button>
            )}
          </div>
          {assignment && confirmRemove && (
            <div className="mt-3 rounded-md border border-red-900/60 bg-red-950/25 p-3">
              <p className="text-xs leading-relaxed text-red-100">
                Remove the saved AI tutor assignment for {learner.name || "this learner"}?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void removeAssignment()}
                  disabled={busy}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                >
                  {busyAction === "remove" && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {busyAction === "remove" ? "Removing assignment" : "Yes, remove"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  disabled={busy}
                  className={secondaryButtonClass}
                >
                  Keep assignment
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <p className="mt-5 text-xs leading-relaxed text-neutral-500">
        This saves the parent policy. The learner tutor will enforce it after the child-runtime integration is released.
      </p>
    </section>
  );
}
