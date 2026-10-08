import type { GameState } from "../types";
import { mergeGameState } from "./merge";
import type { PullResult, SyncResult, SyncState } from "./client";

const DEBOUNCE_MS = 4000;
const REQUEST_TIMEOUT_MS = 15000;

type SessionOptions = {
  read: () => GameState;
  apply: (state: GameState) => void;
  pull: (signal: AbortSignal) => Promise<PullResult>;
  push: (state: GameState, revision: number, signal: AbortSignal) => Promise<SyncResult>;
  profile: (profile: NonNullable<Extract<PullResult, { ok: true }>["profile"]>) => void;
  revoked: () => void;
  restored?: () => void;
  status: (status: SyncState, savedAt?: number) => void;
  available: () => boolean;
};

/** One linked identity, one request at a time. Disposing retires its responses. */
export class SyncSession {
  private active = true;
  private ready = false;
  private busy = false;
  private dirty = true;
  private generation = 0;
  private revision = 0;
  private reconcile = true;
  private failures = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private request?: AbortController;
  private applying = false;

  constructor(private options: SessionOptions) {}

  start() { this.wake(); }

  changed() {
    if (!this.active || this.applying) return;
    this.dirty = true;
    this.generation++;
    this.options.status(this.options.available() ? "syncing" : "offline");
    if (!this.busy) this.schedule(DEBOUNCE_MS);
  }

  /** Recheck authority and reconcile other-device work on return or reconnect. */
  wake() {
    if (!this.active) return;
    this.reconcile = true;
    this.failures = 0;
    this.clearTimer();
    if (!this.busy) void this.run();
  }

  offline() {
    if (!this.active) return;
    this.clearTimer();
    this.options.status("offline");
  }

  dispose() {
    this.active = false;
    this.clearTimer();
    this.request?.abort();
  }

  pendingForExit() {
    if (!this.active || !this.ready || !this.dirty || this.busy) return null;
    return { state: this.options.read(), expectedRevision: this.revision };
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private schedule(delay: number) {
    this.clearTimer();
    if (!this.active || !this.options.available()) return;
    this.timer = setTimeout(() => { this.timer = undefined; void this.run(); }, delay);
  }

  private adopt(state: GameState) {
    this.applying = true;
    try { this.options.apply(state); } finally { this.applying = false; }
  }

  private async run() {
    if (!this.active || this.busy) return;
    if (!this.options.available()) { this.options.status("offline"); return; }
    this.busy = true;
    this.options.status("syncing");
    const controller = new AbortController();
    this.request = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let retry = false;
    let succeeded = false;
    try {
      if (this.reconcile || !this.ready) {
        this.reconcile = false;
        const pulled = await this.options.pull(controller.signal);
        if (!this.active) return;
        if (!pulled.ok) {
          if (pulled.reason === "unauthorized") { this.revoke(); return; }
          this.reconcile = true;
          retry = true;
          this.options.status(pulled.reason === "network" ? "offline" : "error");
          return;
        }
        if (pulled.profile) this.options.profile(pulled.profile);
        this.revision = pulled.revision;
        const firstPull = !this.ready;
        this.ready = true;
        if (pulled.state) this.adopt(mergeGameState(this.options.read(), pulled.state));
        if (firstPull) this.options.restored?.();
        // A pull is not acknowledgement of pending device work.
        this.dirty = true;
      }
      const snapshot = this.options.read();
      const sentGeneration = this.generation;
      const result = await this.options.push(snapshot, this.revision, controller.signal);
      if (!this.active) return;
      if (result.unauthorized) { this.revoke(); return; }
      this.revision = result.revision;
      // Keep changes made while the request was running. Never install its
      // old snapshot over the state currently in the child's hands.
      if (result.state !== snapshot) this.adopt(mergeGameState(this.options.read(), result.state));
      if (result.status === "synced") {
        this.failures = 0;
        succeeded = true;
        this.dirty = this.generation !== sentGeneration;
        this.options.status(this.dirty || this.reconcile ? "syncing" : "synced", Date.now());
      } else {
        this.dirty = true;
        retry = result.retryable === true;
        this.options.status(result.status);
      }
    } catch {
      if (!this.active) return;
      this.dirty = true;
      retry = true;
      this.options.status("error");
    } finally {
      clearTimeout(timeout);
      this.request = undefined;
      this.busy = false;
      if (this.active) {
        if (retry) {
          this.failures++;
          this.schedule(Math.min(60000, 2000 * 2 ** Math.min(this.failures - 1, 5)));
        } else if (succeeded && (this.dirty || this.reconcile)) {
          this.schedule(this.reconcile ? 0 : DEBOUNCE_MS);
        }
      }
    }
  }

  private revoke() {
    this.active = false;
    this.clearTimer();
    this.options.revoked();
    this.options.status("idle");
  }
}
