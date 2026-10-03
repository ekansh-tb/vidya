import { useGameStore } from "../game-store";
/** Optional, brief feedback. Unsupported browsers simply do nothing. */
export function learningHaptic() {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function" || !useGameStore.getState().state.settings.haptics) return;
  try { navigator.vibrate(12); } catch { /* no hardware support */ }
}
