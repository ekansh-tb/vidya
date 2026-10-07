import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { integrationDatabaseConfigured } from "@/test/integration-database";
import { getSql } from "./client";
import { getLearnerForParent } from "./queries";
import { createDraft, reviewContent, publishContent, archiveContent, correctAdminPlacement } from "./admin";
import { readLearningPlan, saveLearningPlan } from "./learning-plans";
import { EMPTY_LEARNING_PLAN } from "@/lib/planning/contracts";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
const suite = integrationDatabaseConfigured() ? describe : describe.skip;
const parent = `plan-parent-${Date.now()}`, stranger=`${parent}-other`, learnerId=randomUUID(), actor=`plan-editor-${Date.now()}`, contentId=`plan-fixture-${Date.now()}`;
const base = ACTIVITY_CATALOG.find(item=>item.placements.includes("school:1"))!;
const window={id:randomUUID(),label:"Chosen time",day:1,start:"16:00",end:"17:00"};
const session={id:randomUUID(),activityId:contentId,revision:1,date:"2026-10-12",start:"16:00",end:"16:10"};
const empty={...EMPTY_LEARNING_PLAN,windows:[window]};
const assigned={...empty,sessions:[session]};
suite("learning plan storage",{timeout:60000},()=>{
 beforeAll(async()=>{const sql=getSql();await sql`insert into parents(id) values(${parent}),(${stranger})`;await sql`insert into learners(id,parent_id,name,grade,board) values(${learnerId}::uuid,${parent},'Synthetic plan learner',1,'cbse')`;},60000);
 afterAll(async()=>{const sql=getSql();await sql`delete from parents where id in (${parent},${stranger})`;await sql`delete from admin_audit where actor=${actor}`;await sql`delete from admin_content_revisions where content_id=${contentId} and published_at is null`;},60000);
 it("does not expose another family's learner",async()=>expect(await getLearnerForParent(stranger,learnerId)).toBeNull());
 it("starts with empty commitments and preserves optimistic revision",async()=>{
  const learner=(await getLearnerForParent(parent,learnerId))!;
  expect((await readLearningPlan(learner)).revision).toBe(0);
  expect(await saveLearningPlan(learner,empty,0)).toBe(1);
  expect(await saveLearningPlan(learner,{...empty,commitments:[{...window,id:randomUUID(),label:"Stale change"}]},0)).toBe(false);
  expect((await readLearningPlan(learner)).plan.commitments).toEqual([]);
  expect(await saveLearningPlan({...learner,parentId:stranger},empty,1)).toBe(false);
 });
 it("rejects drafts and wrong-level activity identities, accepting actual reviewed publication",async()=>{
  const learner=(await getLearnerForParent(parent,learnerId))!;
  await createDraft(actor,{...base,id:contentId});
  expect(await saveLearningPlan(learner,assigned,1)).toBe(false);
  await reviewContent(actor,contentId,1,{checks:["factual","developmental","language","accessibility","rights"],limitations:"Synthetic bounded test editorial record; no independent child research."});
  await publishContent(actor,contentId,1);
  expect(await saveLearningPlan(learner,assigned,1)).toBe(2);
  await correctAdminPlacement(actor,parent,learnerId,{version:1,kind:"early-years",level:"nursery"});
  expect(await saveLearningPlan(learner,assigned,2)).toBe(false);
  const nursery=(await getLearnerForParent(parent,learnerId))!;
  expect(await saveLearningPlan(nursery,assigned,2)).toBe(false);
  await correctAdminPlacement(actor,parent,learnerId,{version:1,kind:"school",board:"cbse",grade:1});
 });
 it("retains an archived immutable assignment but prevents new archived assignments",async()=>{
  const learner=(await getLearnerForParent(parent,learnerId))!;
  await archiveContent(actor,contentId,1);
  expect(await saveLearningPlan(learner,assigned,2)).toBe(3);
  expect(await saveLearningPlan(learner,{...assigned,sessions:[session,{...session,id:randomUUID(),date:"2026-10-19"}]},3)).toBe(false);
  expect(await saveLearningPlan(learner,empty,3)).toBe(4);
 });
});
