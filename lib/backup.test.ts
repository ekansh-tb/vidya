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

describe("credentials never leave the device", () => {
  it("strips parentPin from an exported backup", () => {
    const p = profiles("a", "b");
    p.learners.a.parentPin = "1234";
    p.learners.b.parentPin = "9999";
    const text = serializeBackup(p);
    // The whole point: a backup gets emailed and copied around. It must not
    // double as a credential dump for every learner on the device.
    expect(text).not.toContain("parentPin");
    expect(text).not.toContain("1234");
    expect(text).not.toContain("9999");
  });

  it("does not mutate the live profiles while exporting", () => {
    const p = profiles("a");
    p.learners.a.parentPin = "4321";
    serializeBackup(p);
    expect(p.learners.a.parentPin, "export must not strip the in-memory copy").toBe("4321");
  });

  it("restores a stripped backup without a PIN rather than failing", () => {
    const p = profiles("a");
    p.learners.a.parentPin = "1234";
    const out = parseBackup(serializeBackup(p));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.profiles.learners.a.parentPin).toBeUndefined();
  });

  it("strips the device token — it authenticates sync and opens the tutor", () => {
    const p = profiles("a");
    p.learners.a.deviceToken = "tok_thisIsARealCredential";
    const text = serializeBackup(p);
    expect(text).not.toContain("deviceToken");
    expect(text).not.toContain("tok_thisIsARealCredential");
    expect(p.learners.a.deviceToken, "export must not mutate the live profile")
      .toBe("tok_thisIsARealCredential");
  });

  it("STRIPS ON IMPORT — a hand-edited backup cannot grant rung 2", () => {
    // The attack this closes: export a backup, open the .json in a text
    // editor, add verifiedLevel and a token, re-import. Stripping only on
    // export defended the file and not the app, and import is the direction
    // an attacker actually controls.
    const tampered = profiles("a");
    Object.assign(tampered.learners.a, {
      verifiedLevel: 2,
      deviceToken: "stolen-token-from-a-sibling",
      remoteId: "00000000-0000-0000-0000-0000000000ff",
      parentPin: "1234",
    });
    // Hand-built rather than via serializeBackup, because the export strip
    // would remove the very fields this test is about.
    const forged = JSON.stringify({
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      profiles: tampered,
    });
    const out = parseBackup(forged);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    const restored = out.profiles.learners.a;
    expect(restored.verifiedLevel, "rung must not survive an import").toBeUndefined();
    expect(restored.deviceToken).toBeUndefined();
    expect(restored.parentPin).toBeUndefined();
    expect(restored.remoteId, "or it can be paired with a sibling's token").toBeUndefined();
  });

  it("keeps the child's own work across an import", () => {
    // The strip must not turn into "restore loses your progress".
    const p = profiles("a");
    (p.learners.a.state as unknown as { xp: number }).xp = 777;
    p.learners.a.careNote = "Prefers worked examples.";
    const out = parseBackup(serializeBackup(p));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect((out.profiles.learners.a.state as unknown as { xp: number }).xp).toBe(777);
    expect(out.profiles.learners.a.careNote).toBe("Prefers worked examples.");
  });

  it("strips verifiedLevel, so a backup file cannot grant rung 2", () => {
    // A backup is JSON a child can open. If it carried the rung, restoring it
    // would reopen exactly the self-promotion hole claim codes closed.
    const p = profiles("a");
    p.learners.a.verifiedLevel = 2;
    const out = parseBackup(serializeBackup(p));
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.profiles.learners.a.verifiedLevel).toBeUndefined();
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
