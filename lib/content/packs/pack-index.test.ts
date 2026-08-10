// Guards the hand-maintained PACK_INDEX against the real pack registry.
//
// PACK_INDEX exists so the client can answer "is there a pack for this subject
// and grade?" without pulling every pack body into the initial bundle. That
// only stays safe while the two agree — so this test imports BOTH and asserts
// they describe exactly the same set, in both directions.
//
// If you added a pack and this test failed: add a row to PACK_INDEX.

import { describe, it, expect } from "vitest";
import { ALL_PACKS } from "./index";
import { PACK_INDEX, hasPack, loadPack, packEntryFor } from "./pack-index";

const key = (p: { subjectId: string; grade?: number | null }) =>
  `${p.subjectId}@${p.grade ?? "any"}`;

describe("PACK_INDEX ↔ ALL_PACKS", () => {
  it("indexes every pack that exists", () => {
    const indexed = new Set(PACK_INDEX.map(key));
    const missing = ALL_PACKS.filter((p) => !indexed.has(key(p))).map(key);
    expect(missing, "packs present in ALL_PACKS but absent from PACK_INDEX").toEqual([]);
  });

  it("does not index packs that do not exist", () => {
    const real = new Set(ALL_PACKS.map(key));
    const phantom = PACK_INDEX.filter((p) => !real.has(key(p))).map(key);
    expect(phantom, "rows in PACK_INDEX with no matching pack").toEqual([]);
  });

  it("has the same number of entries", () => {
    expect(PACK_INDEX.length).toBe(ALL_PACKS.length);
  });

  it("contains no duplicate subject+grade rows", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const p of PACK_INDEX) {
      const k = key(p);
      if (seen.has(k)) dupes.push(k);
      seen.add(k);
    }
    expect(dupes).toEqual([]);
  });
});

describe("every indexed pack actually loads", () => {
  // Catches a wrong export name or a bad path in a loader thunk — the failure
  // mode a type-check alone would not surface until runtime.
  it.each(PACK_INDEX.map((p) => [key(p), p] as const))("%s", async (_label, entry) => {
    const pack = await entry.load();
    expect(pack, "loader resolved nothing").toBeTruthy();
    expect(pack.subjectId).toBe(entry.subjectId);
    if (entry.grade != null) expect(pack.grade).toBe(entry.grade);
    // A pack with no topics would render an empty exam-prep screen.
    expect(pack.topics.length).toBeGreaterThan(0);
  });
});

describe("lookup semantics match the old packFor()", () => {
  it("prefers an exact grade match", () => {
    // icse-maths exists for both Class 6 and Class 7.
    expect(packEntryFor("icse-maths", 6)?.grade).toBe(6);
    expect(packEntryFor("icse-maths", 7)?.grade).toBe(7);
  });

  it("falls back to any pack for the subject when the grade has none", () => {
    expect(hasPack("icse-maths", 11)).toBe(true);
  });

  it("reports absence for a subject with no pack at all", () => {
    expect(hasPack("cbse-pe")).toBe(false);
    expect(packEntryFor("cbse-pe")).toBeUndefined();
  });

  it("resolves undefined rather than throwing for an unknown subject", async () => {
    await expect(loadPack("cbse-pe", 7)).resolves.toBeUndefined();
  });

  it("keeps Cambridge Lower Secondary on grade 6, not stage 7", () => {
    // The stage/grade offset is the single easiest thing to get wrong here.
    expect(hasPack("cls-maths", 6)).toBe(true);
    expect(packEntryFor("cls-maths", 6)?.grade).toBe(6);
  });
});
