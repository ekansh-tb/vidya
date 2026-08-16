"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import {
  AlertTriangle,
  Bot,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  apiErrorMessage,
  parseAiConnectionsResponse,
  type AiConnectionSummary,
} from "@/lib/ai/connection-summary";
import { AI_PROVIDER_LABELS } from "@/lib/ai/providers";
import {
  isDeletedAiTutorProfile,
  parseAiTutorModelsResponse,
  parseAiTutorProfilesResponse,
  parseCreatedAiTutorProfile,
  type AiTutorModelsResponse,
  type AiTutorProfileSummary,
} from "@/lib/ai/tutor-profile-summary";

type Notice = { kind: "success" | "error" | "neutral"; text: string };
type CreateProfileInput = { name: string; connectionId: string; modelId: string };

const fieldClass = "min-h-11 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";

async function responseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function unavailableMessage(payload: unknown, fallback: string): string {
  return apiErrorMessage(payload, fallback);
}

export function AiTutorControlsPanel({
  onProfilesChanged,
  refreshToken,
}: {
  onProfilesChanged?: () => void;
  refreshToken: number;
}) {
  const headingId = useId();
  const profileNameId = useId();
  const connectionId = useId();
  const modelId = useId();

  const [connections, setConnections] = useState<AiConnectionSummary[] | null>(null);
  const [profiles, setProfiles] = useState<AiTutorProfileSummary[] | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [modelCatalog, setModelCatalog] = useState<{
    connectionId: string;
    response: AiTutorModelsResponse;
  } | null>(null);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmDeleteProfileId, setConfirmDeleteProfileId] = useState<string | null>(null);

  const loadCatalog = useCallback(async (signal?: AbortSignal) => {
    setCatalogLoading(true);
    setCatalogError(null);
    setModelCatalog(null);
    setModelsError(null);
    setSelectedModelId("");
    try {
      const [connectionResponse, profileResponse] = await Promise.all([
        fetch("/api/parent/ai-connections", { cache: "no-store", signal }),
        fetch("/api/parent/ai-tutors", { cache: "no-store", signal }),
      ]);
      const [connectionPayload, profilePayload] = await Promise.all([
        responseJson(connectionResponse),
        responseJson(profileResponse),
      ]);
      if (signal?.aborted) return;
      if (!connectionResponse.ok) {
        setCatalogError(unavailableMessage(connectionPayload, "Could not load AI connections."));
        return;
      }
      if (!profileResponse.ok) {
        setCatalogError(unavailableMessage(profilePayload, "Could not load AI tutor profiles."));
        return;
      }
      const parsedConnections = parseAiConnectionsResponse(connectionPayload);
      const parsedProfiles = parseAiTutorProfilesResponse(profilePayload);
      if (!parsedConnections || !parsedProfiles) {
        setCatalogError("The server returned invalid AI tutor settings.");
        return;
      }
      setConnections(parsedConnections);
      setProfiles(parsedProfiles);
      setSelectedConnectionId((current) => {
        const active = parsedConnections.filter((item) => item.status === "active");
        return active.some((item) => item.id === current) ? current : active[0]?.id ?? "";
      });
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
      setCatalogError("Could not reach Vidya. Check your connection and try again.");
    } finally {
      if (!signal?.aborted) setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadCatalog(controller.signal);
    return () => controller.abort();
  }, [loadCatalog, refreshToken]);

  const selectedConnection = useMemo(
    () => connections?.find((item) => item.id === selectedConnectionId) ?? null,
    [connections, selectedConnectionId],
  );

  const loadModels = async () => {
    if (!selectedConnection || selectedConnection.status !== "active") return;
    setModelsLoading(true);
    setModelsError(null);
    setModelCatalog(null);
    setSelectedModelId("");
    try {
      const response = await fetch(
        `/api/parent/ai-connections/${encodeURIComponent(selectedConnection.id)}/models`,
        { cache: "no-store" },
      );
      const payload = await responseJson(response);
      if (!response.ok) {
        setModelsError(unavailableMessage(payload, "Could not load models for this connection."));
        return;
      }
      const parsed = parseAiTutorModelsResponse(payload);
      if (!parsed || parsed.provider !== selectedConnection.provider) {
        setModelsError("The server returned an invalid model list.");
        return;
      }
      setModelCatalog({ connectionId: selectedConnection.id, response: parsed });
      setSelectedModelId(parsed.models[0]?.id ?? "");
    } catch {
      setModelsError("Could not reach the provider model catalog.");
    } finally {
      setModelsLoading(false);
    }
  };

  const createProfileRequest = useCallback(async (input: CreateProfileInput): Promise<unknown> => {
    const response = await fetch("/api/parent/ai-tutors", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    return responseJson(response);
  }, []);

  const deleteProfileRequest = useCallback(async (id: string): Promise<unknown> => {
    const response = await fetch(`/api/parent/ai-tutors/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return responseJson(response);
  }, []);

  const createProfileWithReverification = useReverification(createProfileRequest);
  const deleteProfileWithReverification = useReverification(deleteProfileRequest);

  const handleCancelledReverification = (error: unknown): boolean => {
    if (!isReverificationCancelledError(error)) return false;
    setNotice({ kind: "neutral", text: "Verification was cancelled. Nothing changed." });
    return true;
  };

  const createProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = profileName.trim();
    if (!name || !selectedConnection || !selectedModelId) {
      setNotice({ kind: "error", text: "Choose an active connection and model, then name the tutor." });
      return;
    }
    setBusyAction("create-profile");
    setNotice(null);
    try {
      const payload = await createProfileWithReverification({
        name,
        connectionId: selectedConnection.id,
        modelId: selectedModelId,
      });
      const created = parseCreatedAiTutorProfile(payload);
      if (!created) {
        setNotice({ kind: "error", text: unavailableMessage(payload, "Could not create this AI tutor.") });
        return;
      }
      setProfiles((current) => [created, ...(current ?? []).filter((item) => item.id !== created.id)]);
      setProfileName("");
      onProfilesChanged?.();
      setNotice({
        kind: "success",
        text: `${created.name} was created. It remains unavailable to learners until you save an assignment below.`,
      });
    } catch (error) {
      if (!handleCancelledReverification(error)) {
        setNotice({ kind: "error", text: "Could not create this AI tutor." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const deleteProfile = async (profile: AiTutorProfileSummary) => {
    setBusyAction(`delete-profile-${profile.id}`);
    setNotice(null);
    try {
      const payload = await deleteProfileWithReverification(profile.id);
      if (!isDeletedAiTutorProfile(payload)) {
        setNotice({ kind: "error", text: unavailableMessage(payload, "Could not delete this AI tutor.") });
        return;
      }
      const remaining = (profiles ?? []).filter((item) => item.id !== profile.id);
      setProfiles(remaining);
      setConfirmDeleteProfileId(null);
      onProfilesChanged?.();
      setNotice({ kind: "success", text: `${profile.name} was deleted.` });
    } catch (error) {
      if (!handleCancelledReverification(error)) {
        setNotice({ kind: "error", text: "Could not delete this AI tutor." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const activeConnections = connections?.filter((item) => item.status === "active") ?? [];
  const availableModels = modelCatalog?.connectionId === selectedConnectionId
    ? modelCatalog.response.models
    : [];
  const busy = busyAction !== null;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-cyan-900/60 bg-neutral-900/60 px-5 py-5 shadow-lg shadow-cyan-950/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <Bot className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em]">Tutor controls</span>
          </div>
          <h2 id={headingId} className="font-display text-2xl font-bold text-white">
            Build AI tutor profiles
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Choose a model from a connection you control and create a named tutor profile. A profile
            fixes the provider and model without granting any learner access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadCatalog()}
          disabled={busy || catalogLoading}
          className={secondaryButtonClass}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
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

      {catalogError && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/25 px-3 py-3 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <div>
            <p>{catalogError}</p>
            <button
              type="button"
              onClick={() => void loadCatalog()}
              className="mt-2 min-h-11 rounded-md px-2 text-xs font-bold underline decoration-red-500 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <form onSubmit={createProfile} className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
          <h3 className="text-base font-bold text-white">Create a tutor profile</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">
            Model choices come directly from the selected provider account.
          </p>

          {catalogLoading && connections === null ? (
            <div role="status" className="mt-4 flex min-h-11 items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading parent AI settings
            </div>
          ) : activeConnections.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed border-neutral-700 px-3 py-4 text-sm text-neutral-400">
              Connect an AI provider above before creating a tutor profile.
            </p>
          ) : (
            <>
              <label htmlFor={profileNameId} className="mt-4 block text-xs font-semibold text-neutral-200">
                Tutor name
              </label>
              <input
                id={profileNameId}
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                placeholder="Example: Science Guide"
                maxLength={80}
                disabled={busy}
                className={`${fieldClass} mt-1.5`}
              />

              <label htmlFor={connectionId} className="mt-3 block text-xs font-semibold text-neutral-200">
                Provider connection
              </label>
              <select
                id={connectionId}
                value={selectedConnectionId}
                onChange={(event) => {
                  setSelectedConnectionId(event.target.value);
                  setSelectedModelId("");
                  setModelCatalog(null);
                  setModelsError(null);
                }}
                disabled={busy || modelsLoading}
                className={`${fieldClass} mt-1.5`}
              >
                {activeConnections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.label} ({AI_PROVIDER_LABELS[connection.provider]})
                  </option>
                ))}
              </select>

              <span id={`${modelId}-label`} className="mt-3 block text-xs font-semibold text-neutral-200">
                Model
              </span>
              {modelsLoading ? (
                <div role="status" aria-labelledby={`${modelId}-label`} className="mt-1.5 flex min-h-11 items-center gap-2 rounded-md border border-neutral-800 px-3 text-sm text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading models from provider
                </div>
              ) : modelsError ? (
                <div role="alert" aria-labelledby={`${modelId}-label`} className="mt-1.5 rounded-md border border-amber-900/60 bg-amber-950/20 px-3 py-3 text-xs text-amber-200">
                  <p>{modelsError}</p>
                  <button
                    type="button"
                    onClick={() => void loadModels()}
                    className="mt-2 min-h-11 rounded-md px-2 font-bold underline decoration-amber-500 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    Try loading models again
                  </button>
                </div>
              ) : modelCatalog?.connectionId === selectedConnectionId ? (
                <select
                  id={modelId}
                  aria-labelledby={`${modelId}-label`}
                  value={selectedModelId}
                  onChange={(event) => setSelectedModelId(event.target.value)}
                  disabled={busy || availableModels.length === 0}
                  className={`${fieldClass} mt-1.5`}
                >
                  {availableModels.length === 0 && <option value="">No text models available</option>}
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>{model.name} ({model.id})</option>
                  ))}
                </select>
              ) : (
                <button
                  id={modelId}
                  type="button"
                  aria-labelledby={`${modelId}-label ${modelId}-action`}
                  onClick={() => void loadModels()}
                  disabled={busy || !selectedConnection}
                  className={`${secondaryButtonClass} mt-1.5 w-full sm:w-auto`}
                >
                  <span id={`${modelId}-action`}>Load models from provider</span>
                </button>
              )}
              {modelCatalog?.connectionId === selectedConnectionId
                && modelCatalog.response.truncated && (
                <p className="mt-1.5 text-[11px] text-amber-300">
                  The provider returned more than 500 models. This list shows the first 500 valid text models.
                </p>
              )}

              <button
                type="submit"
                disabled={busy || modelsLoading || !profileName.trim() || !selectedModelId}
                className={`${primaryButtonClass} mt-4 w-full sm:w-auto`}
              >
                {busyAction === "create-profile" && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {busyAction === "create-profile" ? "Creating tutor" : "Create tutor profile"}
              </button>
            </>
          )}
        </form>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
          <h3 className="text-base font-bold text-white">Your tutor profiles</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">
            A profile fixes one provider connection and model. It does not grant learner access by itself.
          </p>

          {catalogLoading && profiles === null ? (
            <div role="status" className="mt-4 flex min-h-11 items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading tutor profiles
            </div>
          ) : profiles?.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed border-neutral-700 px-3 py-4 text-sm text-neutral-400">
              No tutor profile has been created yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {profiles?.map((profile) => (
                <li key={profile.id} className="rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white">{profile.name}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          profile.connectionStatus === "active"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}>
                          {profile.connectionStatus === "active" ? "Ready" : "Connection needs attention"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {profile.connectionLabel} · {AI_PROVIDER_LABELS[profile.provider]}
                      </p>
                      <p className="mt-1 break-all font-mono text-[11px] text-neutral-500">{profile.modelId}</p>
                    </div>
                    {confirmDeleteProfileId !== profile.id && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteProfileId(profile.id)}
                        disabled={busy}
                        aria-label={`Delete ${profile.name}`}
                        className="inline-flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-950/50 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {confirmDeleteProfileId === profile.id && (
                    <div className="mt-3 rounded-md border border-red-900/60 bg-red-950/25 p-3">
                      <p className="text-xs leading-relaxed text-red-100">
                        Delete {profile.name}? Any learner assignment using it will also be removed.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void deleteProfile(profile)}
                          disabled={busy}
                          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                        >
                          {busyAction === `delete-profile-${profile.id}` && (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          )}
                          {busyAction === `delete-profile-${profile.id}` ? "Deleting" : "Yes, delete"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteProfileId(null)}
                          disabled={busy}
                          className={secondaryButtonClass}
                        >
                          Keep tutor
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-neutral-500">
        Tutor profiles remain unavailable to learners until a parent saves a learner assignment.
      </p>
    </section>
  );
}
