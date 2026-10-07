/**
 * Opt-in only. Requires migration 0010 already applied by the operator to the
 * isolated vidya_integration database with role vidya_test_runner.
 * Run vitest directly with VIDYA_REQUIRE_TEST_DB=1 and DATABASE_URL pointing
 * only at that isolated database. This file never runs migrations or providers.
 * Registered in scripts/test-integration.mjs for isolated CI runs.
 */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { getSql } from "./client";
import { createLearner, upsertParent } from "./queries";
import { appendParentGuidance, getActiveParentGuidance, listParentGuidance, parentGuidancePrompt } from "./parent-guidance";
const enabled = integrationDatabaseConfigured();
const parentA = `guidance-test-a-${randomUUID()}`;
const parentB = `guidance-test-b-${randomUUID()}`;
let learnerA: string;
let learnerB: string;
let databaseVerified = false;

describe.skipIf(!enabled)("isolated parent guidance lifecycle", { timeout: 60000 }, () => {
  beforeAll(async () => {
    const sql = getSql();
    const [identity] = await sql`select current_database() as database, current_user as role, session_user as session_role`;
    const expected = new URL(process.env.DATABASE_URL!);
    expect(identity).toEqual({ database: expected.pathname.slice(1), role: expected.username, session_role: expected.username });
    databaseVerified = true;
    await upsertParent({ id: parentA });
    await upsertParent({ id: parentB });
    learnerA = (await createLearner({ parentId: parentA, name: "Guidance A", grade: 5, board: "cambridge-primary" })).id;
    learnerB = (await createLearner({ parentId: parentB, name: "Guidance B", grade: 5, board: "cambridge-primary" })).id;
  }, 60000);
  afterAll(async () => {
    if (!databaseVerified) return;
    const sql = getSql();
    await sql`delete from parents where id in (${parentA}, ${parentB})`;
  }, 60000);

  it("applies approval, revision and withdrawal only to the owned learner runtime", async () => {
    expect(await appendParentGuidance(parentA, learnerA, { expectedVersion: 0, status: "draft", content: "Use fraction bars." })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learnerA)).toBeNull();
    expect(await appendParentGuidance(parentA, learnerA, { expectedVersion: 1, status: "approved", content: "Use fraction bars." })).toBe(true);
    expect(parentGuidancePrompt(await getActiveParentGuidance(parentA, learnerA))).toContain('"Use fraction bars."');
    expect(await getActiveParentGuidance(parentB, learnerB)).toBeNull();
    expect(await getActiveParentGuidance(parentB, learnerA)).toBeNull();
    expect(await listParentGuidance(parentB, learnerA)).toEqual({ versions: [], nextCursor: null });
    expect(await appendParentGuidance(parentB, learnerA, { expectedVersion: 2, status: "approved", content: "Wrong family" })).toBe(false);
    expect(await appendParentGuidance(parentA, learnerB, { expectedVersion: 0, status: "approved", content: "Wrong learner" })).toBe(false);
    expect(await appendParentGuidance(parentA, learnerA, { expectedVersion: 2, status: "approved", content: "Correction: use equal-sized bars." })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learnerA)).toBe("Correction: use equal-sized bars.");
    expect(await appendParentGuidance(parentA, learnerA, { expectedVersion: 3, status: "withdrawn", content: "" })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learnerA)).toBeNull();
    expect(await getActiveParentGuidance(parentB, learnerB)).toBeNull();
    expect((await listParentGuidance(parentA, learnerA)).versions.map((row) => row.status)).toEqual(["withdrawn", "approved", "approved", "draft"]);
  });

  it("prevents lost updates when two revisions race", async () => {
    const expectedVersion = (await listParentGuidance(parentA, learnerA)).versions[0].version;
    const results = await Promise.all([
      appendParentGuidance(parentA, learnerA, { expectedVersion, status: "approved", content: "First concurrent edit" }),
      appendParentGuidance(parentA, learnerA, { expectedVersion, status: "draft", content: "Second concurrent edit" }),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await appendParentGuidance(parentA, learnerA, { expectedVersion, status: "approved", content: "Stale overwrite" })).toBe(false);
  });

  it("a new draft immediately supersedes approval and can be approved again", async () => {
    const learner = (await createLearner({ parentId: parentA, name: "Draft lifecycle", grade: 5, board: "cambridge-primary" })).id;
    expect(await appendParentGuidance(parentA, learner, { expectedVersion: 0, status: "approved", content: "Original preference" })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learner)).toBe("Original preference");
    expect(await appendParentGuidance(parentA, learner, { expectedVersion: 1, status: "draft", content: "Revised preference" })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learner)).toBeNull();
    expect(await appendParentGuidance(parentA, learner, { expectedVersion: 2, status: "approved", content: "Revised preference" })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learner)).toBe("Revised preference");
    expect(await getActiveParentGuidance(parentB, learner)).toBeNull();
  });

  it("pages real history without gaps or duplicates while new versions arrive", async () => {
    const learner = (await createLearner({ parentId: parentA, name: "Paged history", grade: 5, board: "cambridge-primary" })).id;
    for (let version = 1; version <= 7; version++) {
      expect(await appendParentGuidance(parentA, learner, { expectedVersion: version - 1, status: "approved", content: `Preference ${version}` })).toBe(true);
    }
    const first = await listParentGuidance(parentA, learner, { limit: 2 });
    expect(first.versions.map((row) => row.version)).toEqual([7, 6]);
    expect(first.nextCursor).toBe("6");
    expect(await appendParentGuidance(parentA, learner, { expectedVersion: 7, status: "withdrawn", content: "" })).toBe(true);
    expect(await getActiveParentGuidance(parentA, learner)).toBeNull();
    const versions = [...first.versions];
    let cursor = first.nextCursor;
    while (cursor) {
      expect(await listParentGuidance(parentB, learner, { cursor, limit: 2 })).toEqual({ versions: [], nextCursor: null });
      expect(await listParentGuidance(parentA, learnerB, { cursor, limit: 2 })).toEqual({ versions: [], nextCursor: null });
      const page = await listParentGuidance(parentA, learner, { cursor, limit: 2 });
      expect(page.versions.length).toBeGreaterThan(0);
      expect(page.versions.length).toBeLessThanOrEqual(2);
      expect(page.versions.every((row) => row.version < Number(cursor))).toBe(true);
      versions.push(...page.versions);
      cursor = page.nextCursor;
    }
    expect(versions.map((row) => row.version)).toEqual([7, 6, 5, 4, 3, 2, 1]);
    expect(await listParentGuidance(parentA, learner, { cursor: "1" })).toEqual({ versions: [], nextCursor: null });
    expect((await listParentGuidance(parentA, learner)).versions[0]).toMatchObject({ version: 8, status: "withdrawn", content: "" });
  });

  it("database rejects history mutation and cross-family references", async () => {
    const sql = getSql();
    await expect(sql`update parent_guidance_versions set content = 'overwrite' where learner_id = ${learnerA}`).rejects.toMatchObject({ code: "P0001" });
    await expect(sql`delete from parent_guidance_versions where learner_id = ${learnerA}`).rejects.toMatchObject({ code: "P0001" });
    await expect(sql`insert into parent_guidance_versions (learner_id, parent_id, version, status, content) values (${learnerA}, ${parentB}, 999, 'approved', 'wrong family')`).rejects.toMatchObject({ code: "23503" });
  });
});
