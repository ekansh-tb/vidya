import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { getSql } from "./client";
import { createLearner, pushLearnerState, upsertParent } from "./queries";
import { DEFAULT_STATE } from "../game-store";
import { newProject } from "../creation/project";
import { acceptCircleInvite, cardsForLearner, circlesForLearner, closeCircleForLearner, closeCircleForParent, createCircleInvite, reactToCircleCard, reportCircle, requestCircleCard, reviewCircleCard, unshareCircleCard } from "./circles";
const hasDb = integrationDatabaseConfigured(); const suite = hasDb ? describe : describe.skip;
const RUN = `circle-itest-${Date.now()}`; const A = `${RUN}-a`; const B = `${RUN}-b`; const C = `${RUN}-c`;
let a: string; let b: string; let c: string; let circleId: string; let code: string;
const creation = { ...newProject("drawing", "original-project", "2026-10-08T00:00:00.000Z"), title: "My shape garden" };
suite("private circles ownership and moderation", { timeout: 60000 }, () => {
  beforeAll(async () => {
    for (const parentId of [A, B, C]) await upsertParent({ id: parentId });
    a = (await createLearner({ parentId: A, name: "Synthetic Private Name A", grade: 4, board: "cbse" })).id;
    b = (await createLearner({ parentId: B, name: "Synthetic Private Name B", grade: 4, board: "cbse" })).id;
    c = (await createLearner({ parentId: C, name: "Synthetic Private Name C", grade: 4, board: "cbse" })).id;
    await pushLearnerState({ learnerId: a, state: { ...DEFAULT_STATE, creativeStudio: { version: 1, projects: [creation] } }, expectedRevision: 0 });
    code = (await createCircleInvite(A, a, "Curious Crane"))!;
  });
  afterAll(async () => { if (hasDb) await getSql()`delete from parents where id in (${A},${B},${C})`; });
  it("requires both actual owners and consumes an invitation once", async () => {
    expect(await createCircleInvite(B, a, "Bright Maple")).toBeNull();
    expect(await acceptCircleInvite(C, b, "Gentle Dolphin", code)).toBe(false);
    expect(await acceptCircleInvite(A, a, "Gentle Dolphin", code)).toBe(false);
    expect(await acceptCircleInvite(B, b, "Bright Maple", code)).toBe(true);
    expect(await acceptCircleInvite(C, c, "Gentle Dolphin", code)).toBe(false);
    circleId = (await circlesForLearner(a)).find((circle) => circle.status === "active")!.id;
    expect((await circlesForLearner(c))).toEqual([]);
    const summary = await circlesForLearner(b);
    expect(summary[0]).toMatchObject({ alias: "Bright Maple", friendAlias: "Curious Crane" });
    expect(JSON.stringify(summary)).not.toContain("Synthetic Private Name");
  });
  it("reveals no card until the posting learner's own parent approves", async () => {
    expect(await requestCircleCard(c, circleId, creation.id)).toBe(false);
    expect(await requestCircleCard(a, circleId, "missing")).toBe(false);
    expect(await requestCircleCard(a, circleId, creation.id)).toBe(true);
    expect(await requestCircleCard(a, circleId, creation.id)).toBe(true);
    expect(await cardsForLearner(b)).toEqual([]);
    const pending = await cardsForLearner(a, true); expect(pending).toHaveLength(1);
    expect(await reviewCircleCard(B, pending[0].id, true)).toBe(false);
    expect(await reactToCircleCard(b, pending[0].id, "creative")).toBe(false);
    expect(await reviewCircleCard(A, pending[0].id, true)).toBe(true);
    const approved = await cardsForLearner(b); expect(approved).toHaveLength(1);
    expect(approved[0]).toMatchObject({ title: creation.title, alias: "Curious Crane", status: "approved" });
    expect(await reactToCircleCard(c, approved[0].id, "creative")).toBe(false);
    expect(await reactToCircleCard(b, approved[0].id, "creative")).toBe(true);
    expect(await reactToCircleCard(b, approved[0].id, "creative")).toBe(true);
    expect((await cardsForLearner(a))[0].reactions).toEqual([{ reaction: "creative", count: 1 }]);
    const rows = await getSql()`select snapshot from private_circle_cards where id=${approved[0].id}`;
    expect(Object.keys(rows[0].snapshot).sort()).toEqual(["frame", "title"]);
  });
  it("allows either child to leave and removes cards/reactions immediately", async () => {
    expect(await closeCircleForParent(C, circleId, "blocked")).toBe(false);
    expect(await closeCircleForLearner(c, circleId, "left")).toBe(false);
    expect(await closeCircleForLearner(b, circleId, "left")).toBe(true);
    expect(await cardsForLearner(a)).toEqual([]);
    expect(await requestCircleCard(a, circleId, creation.id)).toBe(false);
  });
  it("a report atomically blocks the connection and records a bounded reason", async () => {
    const next = (await createCircleInvite(A, a, "Curious Crane"))!;
    expect(await acceptCircleInvite(B, b, "Bright Maple", next)).toBe(true);
    const active = (await circlesForLearner(a)).find((circle) => circle.status === "active")!;
    expect(await reportCircle(c, active.id, "pressure")).toBe(false);
    expect(await reportCircle(b, active.id, "pressure")).toBe(true);
    expect((await circlesForLearner(a)).find((circle) => circle.id === active.id)?.status).toBe("blocked");
    const rows = await getSql()`select reason from private_circle_reports where circle_id=${active.id}`; expect(rows).toEqual([{ reason: "pressure" }]);
  });
  it("two parents cannot claim the same code concurrently", async () => {
    const next = (await createCircleInvite(A, a, "Curious Crane"))!;
    const results = await Promise.all([acceptCircleInvite(B, b, "Bright Maple", next), acceptCircleInvite(C, c, "Gentle Dolphin", next)]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });
  it("concurrent invitation creation cannot exceed five occupied slots", async () => {
    const source = (await createLearner({ parentId: A, name: "Synthetic capacity source", grade: 4, board: "cbse" })).id;
    const results = await Promise.all(Array.from({ length: 12 }, () => createCircleInvite(A, source, "Curious Crane")));
    expect(results.filter(Boolean)).toHaveLength(5);
    expect(await circlesForLearner(source)).toHaveLength(5);
  });
  it("concurrent acceptances count both active and pending learner slots", async () => {
    const target = (await createLearner({ parentId: B, name: "Synthetic acceptance target", grade: 4, board: "cbse" })).id;
    // Four own invitations consume slots even before another family accepts.
    await Promise.all(Array.from({ length: 4 }, () => createCircleInvite(B, target, "Bright Maple")));
    const sources = await Promise.all(Array.from({ length: 6 }, () => createLearner({ parentId: A, name: "Synthetic acceptance source", grade: 4, board: "cbse" })));
    const codes = await Promise.all(sources.map(source => createCircleInvite(A, source.id, "Curious Crane")));
    const results = await Promise.all(codes.map(code => acceptCircleInvite(B, target, "Bright Maple", code!)));
    expect(results.filter(Boolean)).toHaveLength(1);
    const rows = await getSql()`select count(*)::int as count from private_circles where (source_learner=${target} or target_learner=${target}) and status in ('active','pending')`;
    expect(rows[0].count).toBe(5);
  });
  it("deduplicates timestamp edits, reapproves changed artwork and bounds concurrent pending cards", async () => {
    const source = (await createLearner({ parentId: A, name: "Synthetic card source", grade: 4, board: "cbse" })).id;
    const target = (await createLearner({ parentId: B, name: "Synthetic card target", grade: 4, board: "cbse" })).id;
    const invite = (await createCircleInvite(A, source, "Curious Crane"))!;
    expect(await acceptCircleInvite(B, target, "Bright Maple", invite)).toBe(true);
    const circle = (await circlesForLearner(source))[0].id;
    const projects = Array.from({ length: 8 }, (_, index) => ({ ...creation, id: `bounded-project-${index}` }));
    expect((await pushLearnerState({ learnerId: source, state: { ...DEFAULT_STATE, creativeStudio: { version: 1, projects } }, expectedRevision: 0 })).ok).toBe(true);
    expect(await requestCircleCard(source, circle, projects[0].id)).toBe(true);
    let card = (await cardsForLearner(source))[0];
    expect(await reviewCircleCard(A, card.id, true)).toBe(true);
    expect(await reactToCircleCard(target, card.id, "creative")).toBe(true);
    projects[0] = { ...projects[0], updatedAt: "2026-10-08T00:01:00.000Z" };
    expect((await pushLearnerState({ learnerId: source, state: { ...DEFAULT_STATE, creativeStudio: { version: 1, projects } }, expectedRevision: 1 })).ok).toBe(true);
    expect(await requestCircleCard(source, circle, projects[0].id)).toBe(true);
    expect((await cardsForLearner(target))[0]).toMatchObject({ id: card.id, status: "approved", reactions: [{ reaction: "creative", count: 1 }] });
    projects[0] = { ...projects[0], title: "A newly revised garden", updatedAt: "2026-10-08T00:02:00.000Z" };
    expect((await pushLearnerState({ learnerId: source, state: { ...DEFAULT_STATE, creativeStudio: { version: 1, projects } }, expectedRevision: 2 })).ok).toBe(true);
    expect(await requestCircleCard(source, circle, projects[0].id)).toBe(true);
    expect(await cardsForLearner(target)).toEqual([]);
    card = (await cardsForLearner(source))[0];
    expect(card).toMatchObject({ status: "pending", title: "A newly revised garden", reactions: [] });
    const requests = await Promise.all(projects.slice(1).map(project => requestCircleCard(source, circle, project.id)));
    expect(requests.filter(Boolean)).toHaveLength(4);
    expect(await cardsForLearner(source)).toHaveLength(5);
    const all = await getSql()`select count(*)::int as count from private_circle_cards where circle_id=${circle} and learner_id=${source}`;
    expect(all[0].count).toBe(5);
    expect(await unshareCircleCard(target, card.id)).toBe(false);
    expect(await unshareCircleCard(source, card.id)).toBe(true);
    expect((await cardsForLearner(source)).some(item => item.id === card.id)).toBe(false);
    expect(await reviewCircleCard(A, card.id, true)).toBe(false);
  });
  it("bounds approved-card history too and lets the child free a slot by unsharing", async () => {
    const source = (await createLearner({ parentId: A, name: "Synthetic history source", grade: 4, board: "cbse" })).id;
    const target = (await createLearner({ parentId: B, name: "Synthetic history target", grade: 4, board: "cbse" })).id;
    const invite = (await createCircleInvite(A, source, "Curious Crane"))!;
    expect(await acceptCircleInvite(B, target, "Bright Maple", invite)).toBe(true);
    const circle = (await circlesForLearner(source))[0].id;
    // Set up twenty previously reviewed snapshots; no pending limit involved.
    const history = Array.from({ length: 20 }, (_, index) => ({ ...creation, id: `history-project-${index}` }));
    await getSql()`insert into private_circle_cards(circle_id,learner_id,project_id,project_revision,snapshot,status,reviewed_by,reviewed_at)
      select ${circle}::uuid,${source}::uuid,project->>'id',(project->>'updatedAt')::timestamptz,
      jsonb_build_object('title',project->'title','frame',project->'frames'->0),'approved',${A},now()
      from jsonb_array_elements(${JSON.stringify(history)}::jsonb) project`;
    const newest = { ...creation, id: "history-project-new" };
    expect((await pushLearnerState({ learnerId: source, state: { ...DEFAULT_STATE, creativeStudio: { version: 1, projects: [newest] } }, expectedRevision: 0 })).ok).toBe(true);
    expect(await requestCircleCard(source, circle, newest.id)).toBe(false);
    const existing = (await cardsForLearner(source))[0];
    expect(await unshareCircleCard(source, existing.id)).toBe(true);
    expect(await requestCircleCard(source, circle, newest.id)).toBe(true);
    const count = await getSql()`select count(*)::int as count from private_circle_cards where circle_id=${circle} and learner_id=${source}`;
    expect(count[0].count).toBe(20);
  });
});
