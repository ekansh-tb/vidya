import { describe, it, expect, afterAll } from "vitest";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { getSql } from "./client";
import { upsertParent, createLearner, getLearnerForParent, updateLearnerForParent } from "./queries";
const suite = integrationDatabaseConfigured() ? describe : describe.skip;
const parent = `placement-itest-${Date.now()}`;
suite("database placement floor", () => {
  afterAll(async () => { await getSql()`delete from parents where id = ${parent}`; });
  it("preserves early placement, rejects legacy overwrites, and isolates families", async () => {
    await upsertParent({ id: parent });
    const child = await createLearner({ parentId: parent, name: "Synthetic UKG", board: null, grade: null, placement: { version: 1, kind: "early-years", level: "ukg" } });
    expect(child.placement?.kind).toBe("early-years");
    expect(await getLearnerForParent(`${parent}-other`, child.id)).toBeNull();
    await expect(updateLearnerForParent(parent, child.id, { grade: 5, board: "cbse" })).rejects.toThrow("placement");
    await expect(getSql()`update learners set grade = 5, board = 'cbse' where id = ${child.id}`).rejects.toThrow();
    const unchanged = await getLearnerForParent(parent, child.id);
    expect(unchanged?.grade).toBeNull();
    const school = await updateLearnerForParent(parent, child.id, { grade: 1, board: "cbse", placement: { version: 1, kind: "school", board: "cbse", grade: 1 } });
    expect(school?.id).toBe(child.id);
    expect(school?.grade).toBe(1);
  });
});
