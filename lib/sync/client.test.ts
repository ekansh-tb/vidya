import { expect, it } from "vitest";
import { canSync } from "./client";
import type { LearnerProfile } from "../types";
it("legacy local records and claimed records without a device credential cannot open account learning",()=>{
  const profile={id:"legacy",remoteId:"owned",verifiedLevel:2} as LearnerProfile;
  expect(canSync(profile)).toBe(false);
  expect(canSync({...profile,deviceToken:"revocable-device"})).toBe(true);
  expect(canSync({...profile,deviceToken:"revocable-device",verifiedLevel:0})).toBe(false);
  expect(canSync({...profile,remoteId:undefined,deviceToken:"revocable-device"})).toBe(false);
});


import { afterEach, vi, describe } from "vitest";
import { pushWithMerge } from "./client";
import { DEFAULT_STATE } from "../game-store";
afterEach(() => vi.unstubAllGlobals());
describe("conflict retry transport", () => {
  const learner = { id: "synthetic", remoteId: "owned", verifiedLevel: 2, deviceToken: "synthetic-token" } as LearnerProfile;
  const state = { ...DEFAULT_STATE, badges: ["local"] };
  it("reports a revocation that arrives on the conflict retry", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(Response.json({ serverState: { ...DEFAULT_STATE, badges: ["remote"] }, serverRevision: 3 }, { status: 409 })).mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetcher);
    const result = await pushWithMerge(state, 1, "Test", learner);
    expect(result.unauthorized).toBe(true);
    expect(result.retryable).toBe(false);
    expect(result.state.badges).toEqual(expect.arrayContaining(["local", "remote"]));
  });
  it("preserves the newest remote work if a second device wins both races", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(Response.json({ serverState: { ...DEFAULT_STATE, badges: ["remote-one"] }, serverRevision: 3 }, { status: 409 })).mockResolvedValueOnce(Response.json({ serverState: { ...DEFAULT_STATE, badges: ["remote-two"] }, serverRevision: 4 }, { status: 409 }));
    vi.stubGlobal("fetch", fetcher);
    const result = await pushWithMerge(state, 1, "Test", learner);
    expect(result.revision).toBe(4);
    expect(result.state.badges).toEqual(expect.arrayContaining(["local", "remote-one", "remote-two"]));
    expect(result.retryable).toBe(true);
  });
  it("passes the same abort signal and identity to both writes", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(Response.json({ serverState: DEFAULT_STATE, serverRevision: 2 }, { status: 409 })).mockResolvedValueOnce(Response.json({ revision: 3 }));
    vi.stubGlobal("fetch", fetcher);
    const controller = new AbortController();
    await pushWithMerge(state, 1, "Test", learner, controller.signal);
    for (const [, options] of fetcher.mock.calls) {
      expect(options.signal).toBe(controller.signal);
      expect(options.headers["x-vidya-device"]).toBe("synthetic-token");
    }
  });
});
