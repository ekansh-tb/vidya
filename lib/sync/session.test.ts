import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SyncSession } from "./session";
import { DEFAULT_STATE } from "../game-store";
import type { GameState } from "../types";
import type { PullResult, SyncResult } from "./client";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

function fixture() {
  let state: GameState = { ...DEFAULT_STATE, badges: [], activities: { completions: [] } };
  let available = true;
  const status = vi.fn();
  const revoked = vi.fn();
  const profile = vi.fn();
  const restored = vi.fn();
  const pull = vi.fn(async (signal: AbortSignal): Promise<PullResult> => { void signal; return { ok: true, state: null, revision: 0 }; });
  const push = vi.fn(async (snapshot: GameState, revision: number): Promise<SyncResult> => ({ state: snapshot, revision: revision + 1, status: "synced" }));
  const session = new SyncSession({ read: () => state, apply: next => { state = next; session.changed(); }, pull, push, profile, restored, revoked, status, available: () => available });
  sessions.push(session);
  return { session, pull, push, status, restored, revoked, get state() { return state; }, edit: (next: GameState) => { state = next; session.changed(); }, offline: () => { available = false; session.offline(); }, online: () => { available = true; session.wake(); } };
}
let sessions: SyncSession[];
beforeEach(() => { sessions = []; vi.useFakeTimers(); });
afterEach(() => { sessions.forEach(s => s.dispose()); vi.useRealTimers(); });
const tick = () => vi.advanceTimersByTimeAsync(0);

describe("account sync under interrupted learning", () => {
  it("offers initial restoration after merging, only once per linked session", async () => {
    const f = fixture();
    const remote = { ...f.state, learningResume: { version: 2 as const, room: "music" as const, updatedAt: "2026-10-08T01:00:00Z" } };
    f.pull.mockResolvedValue({ ok: true, state: remote, revision: 3 });
    f.restored.mockImplementation(() => expect(f.state.learningResume).toEqual(remote.learningResume));
    f.session.start(); await tick();
    expect(f.restored).toHaveBeenCalledOnce();
    f.session.wake(); await tick();
    expect(f.pull).toHaveBeenCalledTimes(2);
    expect(f.restored).toHaveBeenCalledOnce();
  });

  it("does not restore a retired identity from a delayed pull", async () => {
    const f = fixture();
    const request = deferred<PullResult>();
    f.pull.mockImplementationOnce(() => request.promise);
    f.session.start();
    f.session.dispose();
    request.resolve({ ok: true, state: f.state, revision: 1 });
    await tick();
    expect(f.restored).not.toHaveBeenCalled();
    expect(f.push).not.toHaveBeenCalled();
  });

  it("never says saved after only a pull and before pending work is acknowledged", async () => {
    const f = fixture();
    const request = deferred<SyncResult>();
    f.push.mockImplementationOnce(() => request.promise);
    f.session.start(); await tick();
    expect(f.status.mock.calls.some(([value]) => value === "synced")).toBe(false);
    request.resolve({ state: f.state, revision: 1, status: "synced" }); await tick();
    expect(f.status).toHaveBeenLastCalledWith("synced", expect.any(Number));
  });

  it("keeps new local work during a conflict response and guarantees the next save", async () => {
    const f = fixture();
    f.session.start(); await tick();
    const request = deferred<SyncResult>();
    let sent!: GameState;
    f.push.mockImplementationOnce(snapshot => { sent = snapshot; return request.promise; });
    f.edit({ ...f.state, badges: ["first"] });
    await vi.advanceTimersByTimeAsync(4000);
    f.edit({ ...f.state, badges: ["first", "second"], settings: { ...f.state.settings, sound: false } });
    // The old hook dropped the second timer when its first request was busy.
    await vi.advanceTimersByTimeAsync(5000);
    request.resolve({ state: { ...sent, badges: ["first", "other-device"] }, revision: 2, status: "synced" });
    await tick();
    expect(f.state.badges).toEqual(expect.arrayContaining(["first", "second", "other-device"]));
    expect(f.state.settings.sound).toBe(false);
    expect(f.status).toHaveBeenLastCalledWith("syncing", expect.any(Number));
    await vi.advanceTimersByTimeAsync(4000);
    expect(f.push.mock.calls.at(-1)?.[0].badges).toContain("second");
    expect(f.push.mock.calls.at(-1)?.[1]).toBe(2);
    expect(f.status).toHaveBeenLastCalledWith("synced", expect.any(Number));
  });

  it("retries a transient failed save without requiring another answer", async () => {
    const f = fixture(); f.session.start(); await tick();
    f.push.mockResolvedValueOnce({ state: f.state, revision: 1, status: "offline", retryable: true });
    f.edit({ ...f.state, badges: ["offline-work"] });
    await vi.advanceTimersByTimeAsync(4000);
    expect(f.status).toHaveBeenLastCalledWith("offline");
    await vi.advanceTimersByTimeAsync(2000);
    expect(f.push.mock.calls.at(-1)?.[0].badges).toContain("offline-work");
    expect(f.status).toHaveBeenLastCalledWith("synced", expect.any(Number));
  });

  it("recovers an initial pull failure and offline changes on reconnect", async () => {
    const f = fixture();
    f.pull.mockResolvedValueOnce({ ok: false, reason: "network" });
    f.session.start(); await tick();
    expect(f.push).not.toHaveBeenCalled();
    f.offline(); f.edit({ ...f.state, badges: ["cached"] });
    await vi.advanceTimersByTimeAsync(100000);
    expect(f.pull).toHaveBeenCalledTimes(1);
    f.online(); await tick();
    expect(f.push.mock.calls.at(-1)?.[0].badges).toEqual(["cached"]);
    expect(f.status).toHaveBeenLastCalledWith("synced", expect.any(Number));
  });

  it("retired responses cannot enter the next learner or token session", async () => {
    const f = fixture(); const pending = deferred<SyncResult>();
    f.push.mockImplementationOnce(() => pending.promise);
    f.session.start(); await tick();
    f.session.dispose(); const calls = f.status.mock.calls.length;
    pending.resolve({ state: { ...f.state, badges: ["previous-child"] }, revision: 20, status: "synced" }); await tick();
    expect(f.state.badges).toEqual([]);
    expect(f.status.mock.calls).toHaveLength(calls);
  });

  it("rechecks authority on a foreground return and retires revoked devices", async () => {
    const f = fixture(); f.session.start(); await tick();
    f.pull.mockResolvedValueOnce({ ok: false, reason: "unauthorized" });
    f.session.wake(); await tick();
    expect(f.revoked).toHaveBeenCalledTimes(1);
    expect(f.status).toHaveBeenLastCalledWith("idle");
    f.edit({ ...f.state, badges: ["retained"] });
    await vi.advanceTimersByTimeAsync(120000);
    expect(f.push).toHaveBeenCalledTimes(1);
  });

  it("serializes foreground reconciliation behind an active save", async () => {
    const f = fixture(); const pending = deferred<SyncResult>();
    f.push.mockImplementationOnce(() => pending.promise);
    f.session.start(); await tick(); f.session.wake();
    expect(f.pull).toHaveBeenCalledTimes(1);
    pending.resolve({ state: f.state, revision: 1, status: "synced" });
    await vi.advanceTimersByTimeAsync(1);
    expect(f.pull).toHaveBeenCalledTimes(2);
    expect(f.push).toHaveBeenCalledTimes(2);
  });

  it("stops retrying an oversized payload while keeping its local work", async () => {
    const f = fixture();
    f.push.mockResolvedValue({ state: f.state, revision: 0, status: "error", retryable: false });
    f.session.start(); await tick(); await vi.advanceTimersByTimeAsync(120000);
    expect(f.push).toHaveBeenCalledTimes(1);
    expect(f.session.pendingForExit()?.state).toBe(f.state);
  });

  it("aborts a stalled request and retries instead of remaining stuck in Saving", async () => {
    const f = fixture();
    let signal!: AbortSignal;
    f.pull.mockImplementationOnce((requestSignal: AbortSignal) => {
      signal = requestSignal;
      return new Promise((_, reject) => signal.addEventListener("abort", () => reject(new Error("aborted"))));
    });
    // Supply the real transport signature while retaining an observable mock.
    const session = new SyncSession({ read: () => f.state, apply: () => {},
      pull: requestSignal => f.pull(requestSignal), push: f.push,
      profile: () => {}, revoked: f.revoked, status: f.status, available: () => true });
    sessions.push(session); session.start(); await tick();
    await vi.advanceTimersByTimeAsync(15000);
    expect(signal.aborted).toBe(true);
    expect(f.status).toHaveBeenLastCalledWith("error");
    await vi.advanceTimersByTimeAsync(2000);
    expect(f.push).toHaveBeenCalledTimes(1);
    expect(f.status).toHaveBeenLastCalledWith("synced", expect.any(Number));
  });

  it("bounds transient retries to a maximum one-minute backoff", async () => {
    const f = fixture();
    f.push.mockResolvedValue({ state: f.state, revision: 0, status: "error", retryable: true });
    f.session.start(); await tick();
    for (const delay of [2000, 4000, 8000, 16000, 32000, 60000]) await vi.advanceTimersByTimeAsync(delay);
    expect(f.push).toHaveBeenCalledTimes(7);
    await vi.advanceTimersByTimeAsync(59999); expect(f.push).toHaveBeenCalledTimes(7);
    await vi.advanceTimersByTimeAsync(1); expect(f.push).toHaveBeenCalledTimes(8);
  });
});
