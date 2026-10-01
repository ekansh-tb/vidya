import { describe, expect, it, vi } from "vitest";
import { loadOwnedRoster, loadOwnedReport, parseOwnedRoster, visibleRoster } from "./owned-roster";

const id = "11111111-1111-4111-8111-111111111111";
const row = { id, name: "Remote only", grade: 5, board: "cbse", school: null, city: null, verificationLevel: 2, pickedSubjects: null, subjectsLocked: false, disabledCapabilities: [], createdAt: "2026-10-01T00:00:00Z" };
const payload = { parentId: "owner", learners: [row] };
const signal = () => new AbortController().signal;
describe("owned parent roster", () => {
  it("shows remote-only learners without any local profiles", () => {
    const learners = parseOwnedRoster(payload, "owner")!;
    expect(learners).toHaveLength(1);
    expect(learners[0]).toMatchObject({ id, remoteId: id, name: "Remote only" });
  });
  it("does not merge local profile state, identifiers or credentials into the roster", () => {
    const learners = parseOwnedRoster({ ...payload, localProfiles: [{ name: "Other child" }], learners: [{ ...row, localId: "shared-profile", deviceToken: "secret", state: { xp: 999 }, careNote: "private" }] }, "owner")!;
    expect(learners[0].state.xp).toBe(0);
    expect(learners[0].careNote).toBeUndefined();
    expect(learners[0].deviceToken).toBeUndefined();
    expect(JSON.stringify(learners)).not.toMatch(/Other child|shared-profile|secret|private/);
  });
  it("rejects other-account responses and duplicate ids", () => {
    expect(parseOwnedRoster(payload, "different-owner")).toBeNull();
    expect(parseOwnedRoster({ ...payload, learners: [row, row] }, "owner")).toBeNull();
  });
  it("hides previous-account and previous-retry snapshots synchronously", () => {
    const snapshot = { parentId: "owner", generation: 1, result: { status: "ready" as const, learners: parseOwnedRoster(payload, "owner")! } };
    expect(visibleRoster(snapshot, "other-owner", 1)).toEqual([]);
    expect(visibleRoster(snapshot, "owner", 2)).toEqual([]);
    expect(visibleRoster(snapshot, "owner", 1)).toHaveLength(1);
  });
  it.each([401, 403, 500, 503])("clears visible learners on HTTP %s", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(payload, { status }));
    expect((await loadOwnedRoster("owner", signal(), fetcher)).learners).toEqual([]);
  });
  it("recovers from a failure only through a fresh successful owned response", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(Response.json(payload));
    expect(await loadOwnedRoster("owner", signal(), fetcher)).toEqual({ status: "unavailable", learners: [] });
    expect((await loadOwnedRoster("owner", signal(), fetcher)).learners).toHaveLength(1);
    expect(fetcher.mock.calls[0][1]?.cache).toBe("no-store");
  });
  it("keeps an empty owned family empty instead of filling it from the device", () => {
    expect(parseOwnedRoster({ parentId: "owner", learners: [] }, "owner")).toEqual([]);
  });
  it("fails closed on malformed responses", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ parentId: "owner", learners: [{ id: "local-profile" }] }));
    expect(await loadOwnedRoster("owner", signal(), fetcher)).toEqual({ status: "unavailable", learners: [] });
  });
});
describe("owned reports without a local fallback", () => {
  it.each([401, 403, 404, 500])("never manufactures report data on HTTP %s", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({}, { status }));
    expect(await loadOwnedReport(id, signal(), fetcher)).not.toHaveProperty("report");
  });
  it("leaves absent reports absent", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: "absent", state: null, revision: 0, updatedAt: null }));
    expect(await loadOwnedReport(id, signal(), fetcher)).toEqual({ status: "absent" });
  });
  it("recovers to validated remote reporting fields and strips private reflection bodies", async () => {
    const state = { progress: {}, stats: { totalAnswered: 3, totalCorrect: 2, quizzesCompleted: 1, dailyQuestsCompleted: 0 }, streak: 2, longestStreak: 2, missedQuestions: [], dailyReflections: [{ date: "2026-10-01", savedAt: "2026-10-01T00:00:00Z", private: true, body: "not-for-parent" }] };
    const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(Response.json({ status: "ready", state, revision: 1, updatedAt: "2026-10-01T00:00:00Z" }));
    expect(await loadOwnedReport(id, signal(), fetcher)).toEqual({ status: "unavailable" });
    const result = await loadOwnedReport(id, signal(), fetcher);
    expect(result.status).toBe("ready");
    expect(JSON.stringify(result)).not.toContain("not-for-parent");
    if (result.status === "ready") expect(result.report).toMatchObject({ source: "remote", state: { stats: { totalAnswered: 3 } } });
  });
});
