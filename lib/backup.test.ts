import { describe, it, expect } from "vitest";
import {
  serializeBackup, parseBackup, mergeProfiles, backupFilename,
  BACKUP_FORMAT, BACKUP_VERSION,
} from "./backup";
import type { ProfilesV2 } from "./storage";
import type { LearnerProfile } from "./types";

function learner(id: string, name = id, xp = 0): LearnerProfile {
  return {
    id,
    name,
    grade: 6,
    board: "cambridge-lower-secondary",
    createdAt: "2026-08-01T00:00:00.000Z",
    // Only the fields the schema actually inspects need to be real.
    state: { xp, name } as unknown as LearnerProfile["state"],
  };
}

function profiles(...ids: string[]): ProfilesV2 {
  return {
    version: 2,
    currentLearnerId: ids[0]!,
    learners: Object.fromEntries(ids.map((id) => [id, learner(id)])),
  };
}

describe("round trip", () => {
  it("survives serialize → parse unchanged", () => {
    const p = profiles("a", "b");
    const out = parseBackup(serializeBackup(p));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(Object.keys(out.profiles.learners).sort()).toEqual(["a", "b"]);
    expect(out.profiles.currentLearnerId).toBe("a");
    expect(out.learnerCount).toBe(2);
  });

  it("writes an envelope with format and version", () => {
    const parsed = JSON.parse(serializeBackup(profiles("a")));
    expect(parsed.format).toBe(BACKUP_FORMAT);
    expect(parsed.version).toBe(BACKUP_VERSION);
    expect(parsed.exportedAt).toBeTruthy();
  });

  it("preserves per-learner state rather than just the roster", () => {
    const p = profiles("a");
    p.learners.a = learner("a", "A", 4321);
    const out = parseBackup(serializeBackup(p));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect((out.profiles.learners.a.state as unknown as { xp: number }).xp).toBe(4321);
  });
});

describe("parseBackup rejects bad input helpfully", () => {
  it("rejects non-JSON", () => {
    const out = parseBackup("this is not json");
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error).toMatch(/JSON/i);
  });

  it("rejects an unrelated JSON document", () => {
    const out = parseBackup(JSON.stringify({ hello: "world" }));
    expect(out.ok).toBe(false);
  });

  it("rejects a backup with no learners", () => {
    const out = parseBackup(JSON.stringify({
      format: BACKUP_FORMAT, version: 1,
      profiles: { version: 2, currentLearnerId: "a", learners: {} },
    }));
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error).toMatch(/no learners/i);
  });

  it("accepts a bare localStorage blob without the envelope", () => {
    // Someone recovering by hand should not be blocked on cosmetics.
    const out = parseBackup(JSON.stringify(profiles("a", "b")));
    expect(out.ok).toBe(true);
  });

  it("repairs a currentLearnerId pointing at a missing learner", () => {
    const p = profiles("a", "b");
    p.currentLearnerId = "ghost";
    const out = parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, profiles: p }));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(Object.keys(out.profiles.learners)).toContain(out.profiles.currentLearnerId);
  });

  it("tolerates unknown fields from a newer build", () => {
    const p = profiles("a") as unknown as Record<string, unknown>;
    (p.learners as Record<string, Record<string, unknown>>).a.futureField = { nested: true };
    const out = parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, profiles: p }));
    expect(out.ok, "a newer backup must still restore into an older build").toBe(true);
  });
});

describe("mergeProfiles never destroys a local learner", () => {
  it("keeps learners that exist only on this device", () => {
    const local = profiles("local-only");
    const incoming = profiles("from-file");
    const { profiles: merged, added } = mergeProfiles(local, incoming);
    expect(Object.keys(merged.learners).sort()).toEqual(["from-file", "local-only"]);
    expect(added).toEqual(["from-file"]);
  });

  it("prefers the imported copy on a collision by default", () => {
    const local = profiles("a");
    local.learners.a = learner("a", "Local", 1);
    const incoming = profiles("a");
    incoming.learners.a = learner("a", "Imported", 999);
    const { profiles: merged, replaced } = mergeProfiles(local, incoming);
    expect(merged.learners.a.name).toBe("Imported");
    expect(replaced).toEqual(["a"]);
  });

  it("can keep the local copy on a collision", () => {
    const local = profiles("a");
    local.learners.a = learner("a", "Local", 1);
    const incoming = profiles("a");
    incoming.learners.a = learner("a", "Imported", 999);
    const { profiles: merged, kept } = mergeProfiles(local, incoming, "keep-local");
    expect(merged.learners.a.name).toBe("Local");
    expect(kept).toEqual(["a"]);
  });

  it("always lands on a currentLearnerId that exists", () => {
    const local = profiles("a");
    const incoming = profiles("b");
    incoming.currentLearnerId = "nope";
    const { profiles: merged } = mergeProfiles(local, incoming);
    expect(Object.keys(merged.learners)).toContain(merged.currentLearnerId);
  });
});

describe("backupFilename", () => {
  it("names the file by date and learner count", () => {
    const name = backupFilename(profiles("a", "b"), new Date("2026-08-11T10:00:00Z"));
    expect(name).toBe("vidya-backup-2026-08-11-2-learners.json");
  });

  it("uses the singular for one learner", () => {
    const name = backupFilename(profiles("a"), new Date("2026-08-11T10:00:00Z"));
    expect(name).toBe("vidya-backup-2026-08-11-1-learner.json");
  });
});
