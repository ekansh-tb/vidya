import { describe, it, expect, vi, afterEach } from "vitest";
import { ACTIVITY_CATALOG } from "./catalog";
import { parsePublicActivities, readPublicActivities, writePublicActivities } from "./published-content-cache";
afterEach(() => vi.unstubAllGlobals());
describe("public activity offline cache", () => {
  it("rejects wrong-placement and partial invalid collections", () => { expect(parsePublicActivities([ACTIVITY_CATALOG[0]], "lkg")).toBeNull(); expect(parsePublicActivities([ACTIVITY_CATALOG[0], { id: "invalid" }], "nursery")).toBeNull(); });
  it("retains an authoritative empty collection after archive", () => { expect(parsePublicActivities([], "nursery")).toEqual([]); });
  it("keeps public historical revisions isolated from the current collection", () => {
    const values = new Map<string, string>(); vi.stubGlobal("localStorage", { setItem: (key: string, value: string) => values.set(key, value), getItem: (key: string) => values.get(key) ?? null });
    writePublicActivities("nursery:en", []); writePublicActivities("nursery:en:saved@1", [ACTIVITY_CATALOG[0]]);
    expect(readPublicActivities("nursery:en", "nursery")).toEqual([]); expect(readPublicActivities("nursery:en:saved@1", "nursery")?.[0].revision).toBe(1); expect(readPublicActivities("nursery:en:saved@1", "lkg")).toBeNull();
  });
  it("degrades cleanly when browser storage is disabled or full", () => { vi.stubGlobal("localStorage", { getItem: () => { throw new Error("Disabled"); }, setItem: () => { throw new Error("Quota"); } }); expect(readPublicActivities("nursery:en", "nursery")).toBeNull(); expect(() => writePublicActivities("nursery:en", [ACTIVITY_CATALOG[0]])).not.toThrow(); });
});
