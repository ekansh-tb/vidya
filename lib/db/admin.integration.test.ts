import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { getSql } from "./client";
import { createDraft, reviewContent, publishContent, archiveContent, publishedActivity, revokeAdminDevice, adminDevices, correctAdminPlacement } from "./admin";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
import { randomUUID } from "node:crypto";
const suite = integrationDatabaseConfigured() ? describe : describe.skip;
const run = `admin-it-${Date.now()}`;
const actor = `user_admin${Date.now()}`;
const parentA = `${actor}a`, parentB = `${actor}b`, learnerA = randomUUID(), device = randomUUID();
suite("owner CMS database invariants", { timeout: 60000 }, () => {
  beforeAll(async () => { const sql = getSql(); await sql`insert into parents(id) values(${parentA}),(${parentB})`; await sql`insert into learners(id,parent_id,name,grade,board) values(${learnerA}::uuid,${parentA},'Synthetic admin fixture',1,'cbse')`; await sql`insert into learner_devices(id,learner_id,token_hash,label) values(${device}::uuid,${learnerA}::uuid,${run},'Synthetic device')`; }, 60000);
  afterAll(async () => { const sql = getSql(); await sql`delete from parents where id in (${parentA},${parentB})`; await sql`delete from admin_audit where actor=${actor}`; await sql`delete from admin_content_revisions where content_id=${run} and published_at is null`; /* Immutable published fixtures stay in the dedicated disposable integration DB. */ }, 60000);
  it("retains immutable published revisions through replacement and archive", async () => {
    const first = await createDraft(actor, { ...ACTIVITY_CATALOG[0], id: run }); expect(first?.revision).toBe(1);
    expect(await publishContent(actor, run, 1)).toBe(false);
    const sql = getSql();
    await expect(sql`update admin_content_revisions set status='review',reviewed_by=${actor},reviewed_at=now(),review_record='{}'::jsonb where content_id=${run} and revision=1`).rejects.toThrow();
    await reviewContent(actor, run, 1, { checks: ["factual", "developmental", "language", "accessibility", "rights"], limitations: "Editorial fixture only; no independent expert or child usability validation." });
    expect(await publishContent(actor, run, 1)).toBe(true);
    await expect(sql`update admin_content_revisions set payload=payload || '{"source":"tampered"}'::jsonb where content_id=${run} and revision=1`).rejects.toThrow();
    const second = await createDraft(actor, { ...ACTIVITY_CATALOG[0], id: run, title: { en: "Updated fixture", hi: "बदला नमूना" } }); expect(second?.revision).toBe(2);
    await reviewContent(actor, run, 2, { checks: ["factual", "developmental", "language", "accessibility", "rights"], limitations: "Editorial fixture only; no independent expert or child usability validation." });
    expect(await publishContent(actor, run, 2)).toBe(true);
    expect((await publishedActivity(run))?.revision).toBe(2);
    expect((await publishedActivity(run, 1))?.title.en).toBe(ACTIVITY_CATALOG[0].title.en);
    await archiveContent(actor, run, 2); expect(await publishedActivity(run)).toBeNull(); expect((await publishedActivity(run, 2))?.title.en).toBe("Updated fixture");
  });
  it("keeps placement correction scoped and preserves the learner identity", async () => {
    expect(await correctAdminPlacement(actor, parentB, learnerA, { version: 1, kind: "school", grade: 2, board: "cbse" })).toBe(false);
    expect(await correctAdminPlacement(actor, parentA, learnerA, { version: 1, kind: "school", grade: 13, board: "cambridge-igcse" })).toBe(true);
    const sql = getSql(); const row = (await sql`select id,parent_id,grade,learning_placement from learners where id=${learnerA}::uuid`)[0];
    expect(row.id).toBe(learnerA); expect(row.parent_id).toBe(parentA); expect(row.grade).toBe(13);
  });
  it("cannot revoke a device using another family identity", async () => {
    expect(await adminDevices(parentB, learnerA)).toEqual([]);
    expect(await revokeAdminDevice(actor, parentB, learnerA, device)).toBe(false);
    expect((await adminDevices(parentA, learnerA))[0].revoked_at).toBeNull();
    expect(await revokeAdminDevice(actor, parentA, learnerA, device)).toBe(true);
    expect((await adminDevices(parentA, learnerA))[0].revoked_at).not.toBeNull();
  });
});
