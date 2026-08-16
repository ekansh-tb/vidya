"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { isReverificationCancelledError } from "@clerk/nextjs/errors";
import {
  AlertTriangle,
  BrainCircuit,
  ExternalLink,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  apiErrorMessage,
  isDeletedAiConnection,
  isOpenRouterAuthorizationUrl,
  parseAiConnectionsResponse,
  parseAuthorizationUrl,
  parseCreatedAiConnection,
  type AiConnectionSummary,
} from "@/lib/ai/connection-summary";
import {
  AI_PROVIDER_IDS,
  AI_PROVIDER_LABELS,
  isAiProviderId,
  type AiProviderId,
} from "@/lib/ai/providers";

type Notice = { kind: "success" | "error" | "neutral"; text: string };
type DirectConnectionInput = {
  provider: AiProviderId;
  label: string;
  credential: string;
};

const fieldClass = "min-h-11 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50";

async function responseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function friendlyDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

export function AiConnectionsPanel({
  onConnectionsChanged,
}: {
  onConnectionsChanged?: () => void;
}) {
  const providerId = useId();
  const directLabelId = useId();
  const credentialId = useId();
  const oauthLabelId = useId();
  const [connections, setConnections] = useState<AiConnectionSummary[] | null>(null);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [provider, setProvider] = useState<AiProviderId>("openai");
  const [directLabel, setDirectLabel] = useState("");
  const [credential, setCredential] = useState("");
  const [oauthLabel, setOauthLabel] = useState("Family OpenRouter");

  const loadConnections = useCallback(async () => {
    setLoadingConnections(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/parent/ai-connections", { cache: "no-store" });
      const payload = await responseJson(response);
      if (!response.ok) {
        setLoadError(apiErrorMessage(payload, "Could not load AI connections."));
        return;
      }
      const parsed = parseAiConnectionsResponse(payload);
      if (!parsed) {
        setLoadError("The server returned an invalid AI connection list.");
        return;
      }
      setConnections(parsed);
    } catch {
      setLoadError("Could not reach Vidya. Check your connection and try again.");
    } finally {
      setLoadingConnections(false);
    }
  }, []);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const outcome = url.searchParams.get("ai");
    if (!outcome) return;

    const messages: Record<string, Notice> = {
      connected: { kind: "success", text: "OpenRouter is connected. No learner can use it until you assign it." },
      duplicate: { kind: "error", text: "That OpenRouter account or label is already connected." },
      connection_failed: { kind: "error", text: "OpenRouter could not be connected. Please try again." },
      sign_in_required: { kind: "error", text: "Sign in again before connecting OpenRouter." },
    };
    setNotice(messages[outcome] ?? {
      kind: "neutral",
      text: "The OpenRouter connection flow ended without changing your settings.",
    });
    url.searchParams.delete("ai");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const createRequest = useCallback(async (input: DirectConnectionInput): Promise<unknown> => {
    const response = await fetch("/api/parent/ai-connections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    return responseJson(response);
  }, []);

  const startOpenRouterRequest = useCallback(async (label: string): Promise<unknown> => {
    const response = await fetch("/api/parent/ai-connections/openrouter/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ label }),
    });
    return responseJson(response);
  }, []);

  const deleteRequest = useCallback(async (id: string): Promise<unknown> => {
    const response = await fetch(`/api/parent/ai-connections/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return responseJson(response);
  }, []);

  const validateRequest = useCallback(async (id: string): Promise<unknown> => {
    const response = await fetch(
      `/api/parent/ai-connections/${encodeURIComponent(id)}/validate`,
      { method: "POST" },
    );
    return responseJson(response);
  }, []);

  const createWithReverification = useReverification(createRequest);
  const startOpenRouterWithReverification = useReverification(startOpenRouterRequest);
  const deleteWithReverification = useReverification(deleteRequest);

  const cancelledNotice = (error: unknown): boolean => {
    if (!isReverificationCancelledError(error)) return false;
    setNotice({ kind: "neutral", text: "Verification was cancelled. Nothing changed." });
    return true;
  };

  const connectOpenRouter = async () => {
    const label = oauthLabel.trim();
    if (!label) {
      setNotice({ kind: "error", text: "Give this OpenRouter connection a label." });
      return;
    }
    setBusyAction("openrouter");
    setNotice(null);
    try {
      const payload = await startOpenRouterWithReverification(label);
      const authorizationUrl = parseAuthorizationUrl(payload);
      if (!authorizationUrl || !isOpenRouterAuthorizationUrl(authorizationUrl)) {
        setNotice({
          kind: "error",
          text: apiErrorMessage(payload, "OpenRouter returned an invalid connection link."),
        });
        return;
      }
      setNotice({ kind: "neutral", text: "Opening OpenRouter so you can approve the connection." });
      window.location.assign(authorizationUrl);
    } catch (error) {
      if (!cancelledNotice(error)) {
        setNotice({ kind: "error", text: "Could not start the OpenRouter connection." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const saveDirectConnection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = directLabel.trim();
    const secret = credential.trim();
    if (!label || !secret) {
      setNotice({ kind: "error", text: "Enter a label and provider key." });
      return;
    }
    setBusyAction("direct");
    setNotice(null);
    try {
      const payload = await createWithReverification({ provider, label, credential: secret });
      const created = parseCreatedAiConnection(payload);
      if (!created) {
        setNotice({ kind: "error", text: apiErrorMessage(payload, "Could not save this provider key.") });
        return;
      }
      setConnections((current) => [created, ...(current ?? []).filter((item) => item.id !== created.id)]);
      setDirectLabel("");
      setCredential("");
      onConnectionsChanged?.();
      setNotice({
        kind: "success",
        text: `${AI_PROVIDER_LABELS[created.provider]} is connected. No learner can use it until you assign it.`,
      });
    } catch (error) {
      if (!cancelledNotice(error)) {
        setNotice({ kind: "error", text: "Could not save this provider key." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const deleteConnection = async (connection: AiConnectionSummary) => {
    setBusyAction(connection.id);
    setNotice(null);
    try {
      const payload = await deleteWithReverification(connection.id);
      if (!isDeletedAiConnection(payload)) {
        setNotice({ kind: "error", text: apiErrorMessage(payload, "Could not remove this connection.") });
        return;
      }
      setConnections((current) => current?.filter((item) => item.id !== connection.id) ?? []);
      setConfirmDeleteId(null);
      onConnectionsChanged?.();
      setNotice({ kind: "success", text: `${connection.label} was removed.` });
    } catch (error) {
      if (!cancelledNotice(error)) {
        setNotice({ kind: "error", text: "Could not remove this connection." });
      }
    } finally {
      setBusyAction(null);
    }
  };

  const validateConnection = async (connection: AiConnectionSummary) => {
    setBusyAction(`validate:${connection.id}`);
    setNotice(null);
    try {
      const payload = await validateRequest(connection.id);
      const updated = parseCreatedAiConnection(payload);
      if (!updated) {
        setNotice({
          kind: "error",
          text: apiErrorMessage(payload, "Could not recheck this connection."),
        });
        return;
      }
      setConnections((current) => current?.map((item) => (
        item.id === updated.id ? updated : item
      )) ?? [updated]);
      onConnectionsChanged?.();
      setNotice(updated.status === "active"
        ? { kind: "success", text: `${updated.label} is active.` }
        : {
            kind: "error",
            text: `${updated.label} still needs attention in the provider account.`,
          });
    } catch {
      setNotice({ kind: "error", text: "Could not recheck this connection." });
    } finally {
      setBusyAction(null);
    }
  };

  const busy = busyAction !== null;

  return (
    <section
      aria-labelledby="parent-ai-heading"
      className="rounded-xl border border-violet-900/60 bg-neutral-900/60 px-5 py-5 shadow-lg shadow-violet-950/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-violet-300">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em]">AI control centre</span>
          </div>
          <h2 id="parent-ai-heading" className="font-display text-2xl font-bold text-white">
            Parent-controlled AI
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Connect one or more AI accounts that you control. Vidya encrypts credentials on the server
            and never returns them to this browser after saving.
          </p>
        </div>
        <div className="flex max-w-xs items-start gap-2 rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-3 py-3 text-xs leading-relaxed text-emerald-100">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
          <span>Connection alone does not give a learner access. Assignments, model choices, and budgets are the next control layer.</span>
        </div>
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-violet-800/60 bg-violet-950/25 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Connect OpenRouter</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                Recommended for the simplest setup. Approve access on OpenRouter without copying a key into Vidya.
              </p>
            </div>
            <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200">
              Recommended
            </span>
          </div>
          <label htmlFor={oauthLabelId} className="mt-4 block text-xs font-semibold text-neutral-200">
            Connection label
          </label>
          <input
            id={oauthLabelId}
            value={oauthLabel}
            onChange={(event) => setOauthLabel(event.target.value)}
            maxLength={80}
            disabled={busy}
            className={`${fieldClass} mt-1.5`}
          />
          <button
            type="button"
            onClick={() => void connectOpenRouter()}
            disabled={busy || !oauthLabel.trim()}
            className={`${primaryButtonClass} mt-3 w-full sm:w-auto`}
          >
            {busyAction === "openrouter" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            )}
            {busyAction === "openrouter" ? "Connecting" : "Connect OpenRouter"}
          </button>
        </div>

        <form onSubmit={saveDirectConnection} className="rounded-lg border border-neutral-800 bg-neutral-950/35 p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-white">Use a provider key</h3>
          </div>
          <p id={`${credentialId}-help`} className="mt-1 text-xs leading-relaxed text-neutral-400">
            For OpenAI, Anthropic, Google Gemini, xAI, or an existing OpenRouter key. The key stays in memory only until this form is submitted.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={providerId} className="block text-xs font-semibold text-neutral-200">Provider</label>
              <select
                id={providerId}
                value={provider}
                onChange={(event) => {
                  if (isAiProviderId(event.target.value)) setProvider(event.target.value);
                }}
                disabled={busy}
                className={`${fieldClass} mt-1.5`}
              >
                {AI_PROVIDER_IDS.map((id) => (
                  <option key={id} value={id}>{AI_PROVIDER_LABELS[id]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={directLabelId} className="block text-xs font-semibold text-neutral-200">Connection label</label>
              <input
                id={directLabelId}
                value={directLabel}
                onChange={(event) => setDirectLabel(event.target.value)}
                placeholder="Example: Family OpenAI"
                maxLength={80}
                disabled={busy}
                className={`${fieldClass} mt-1.5`}
              />
            </div>
          </div>
          <label htmlFor={credentialId} className="mt-3 block text-xs font-semibold text-neutral-200">Provider key</label>
          <input
            id={credentialId}
            type="password"
            value={credential}
            onChange={(event) => setCredential(event.target.value)}
            placeholder="Paste the provider key"
            minLength={12}
            maxLength={512}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${credentialId}-help`}
            disabled={busy}
            className={`${fieldClass} mt-1.5 font-mono`}
          />
          <button
            type="submit"
            disabled={busy || !directLabel.trim() || !credential.trim()}
            className={`${secondaryButtonClass} mt-3 w-full sm:w-auto`}
          >
            {busyAction === "direct" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            )}
            {busyAction === "direct" ? "Validating and saving" : "Save provider key"}
          </button>
        </form>
      </div>

      <div className="mt-6 border-t border-neutral-800 pt-5" aria-busy={loadingConnections}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Your connections</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Provider billing and model availability remain under your provider account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadConnections()}
            disabled={busy || loadingConnections}
            className={secondaryButtonClass}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </div>

        {loadingConnections && connections === null && !loadError && (
          <div role="status" className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading connections
          </div>
        )}

        {loadError && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/25 px-3 py-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <div>
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => void loadConnections()}
                className="mt-2 min-h-11 rounded-md px-2 text-xs font-bold underline decoration-red-500 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {connections?.length === 0 && !loadError && (
          <p className="mt-4 rounded-md border border-dashed border-neutral-700 px-4 py-5 text-sm text-neutral-400">
            No AI account is connected yet. Connecting one does not enable AI for any learner.
          </p>
        )}

        {connections && connections.length > 0 && (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {connections.map((connection) => (
              <li key={connection.id} className="rounded-lg border border-neutral-800 bg-neutral-950/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-white">{connection.label}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        connection.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}>
                        {connection.status === "active" ? "Active" : "Needs attention"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      {AI_PROVIDER_LABELS[connection.provider]} via {connection.source === "oauth" ? "linked account" : "provider key"}
                      {connection.credentialHint ? ` ending ${connection.credentialHint}` : ""}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      Checked {friendlyDate(connection.lastValidatedAt)}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      {connection.lastUsedAt
                        ? `Last successful tutor use ${friendlyDate(connection.lastUsedAt)}`
                        : "No successful tutor use yet"}
                    </p>
                    <button
                      type="button"
                      onClick={() => void validateConnection(connection)}
                      disabled={busy}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-200 transition hover:border-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-50"
                    >
                      {busyAction === `validate:${connection.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      )}
                      {busyAction === `validate:${connection.id}` ? "Checking" : "Recheck connection"}
                    </button>
                  </div>
                  {confirmDeleteId !== connection.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(connection.id)}
                      disabled={busy}
                      aria-label={`Remove ${connection.label}`}
                      className="inline-flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-950/50 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {confirmDeleteId === connection.id && (
                  <div className="mt-4 rounded-md border border-red-900/60 bg-red-950/25 p-3">
                    <p className="text-xs leading-relaxed text-red-100">
                      Remove {connection.label}? This also removes AI tutor profiles and learner assignments that use it.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void deleteConnection(connection)}
                        disabled={busy}
                        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                      >
                        {busyAction === connection.id && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        {busyAction === connection.id ? "Removing" : "Yes, remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={busy}
                        className={secondaryButtonClass}
                      >
                        Keep connection
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-neutral-500">
        When learner assignment is added, the child&apos;s prompt and parent-approved learning context will be sent to the chosen provider only during an AI request. This connection screen does not send learner data.
      </p>
    </section>
  );
}
