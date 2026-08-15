export const PENDING_UPDATE_KEY = "vidya-pwa-pending-update";
export const APPLIED_UPDATE_KEY = "vidya-pwa-applied-update";

export const UPDATE_MESSAGES = {
  activate: "VIDYA_ACTIVATE_UPDATE",
  prepare: "VIDYA_UPDATE_PREPARE",
  ready: "VIDYA_UPDATE_READY",
  failed: "VIDYA_UPDATE_FAILED",
} as const;

export function validUpdateId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,128}$/.test(value);
}

export function updateReloadDecision({
  hasController,
  hasReloaded,
  pendingUpdateId,
  appliedUpdateId,
}: {
  hasController: boolean;
  hasReloaded: boolean;
  pendingUpdateId: string | null;
  appliedUpdateId: string | null;
}): "claim-only" | "reload" | "ignore" {
  if (!hasController) return "claim-only";
  if (hasReloaded || !validUpdateId(pendingUpdateId) || appliedUpdateId === pendingUpdateId) return "ignore";
  return "reload";
}
