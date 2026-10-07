import "server-only";
import { getSql } from "./client";
import type { LearnerRow } from "./queries";
import { placementSchema, type LearningPlacement } from "@/lib/learning/placement";
import { EMPTY_LEARNING_PLAN, learningPlanSchema, type LearningPlan } from "@/lib/planning/contracts";
import { PUBLISHED_SCHOOL_GRADES } from "@/lib/learning/release";

export function databasePlacement(learner: LearnerRow): LearningPlacement | null {
  const parsed = placementSchema.safeParse(learner.placement ?? { version: 1, kind: "school", board: learner.board, grade: learner.grade });
  if (!parsed.success) return null;
  const p = parsed.data;
  return p.kind === "early-years" ? (learner.grade === null && learner.board === null ? p : null) : (learner.grade === p.grade && learner.board === p.board ? p : null);
}
export async function readLearningPlan(learner: LearnerRow) {
  const rows = await getSql()`select p.plan,p.revision from learner_learning_plans p join learners l on l.id=p.learner_id where l.id=${learner.id}::uuid and l.parent_id is not distinct from ${learner.parentId}`;
  if (!rows[0]) return { plan: structuredClone(EMPTY_LEARNING_PLAN), revision: 0 };
  return { plan: learningPlanSchema.parse(rows[0].plan), revision: Number(rows[0].revision) };
}
/** Compare revision, ownership, placement and immutable published identities in the same write. */
export async function saveLearningPlan(learner: LearnerRow, plan: LearningPlan, expectedRevision: number) {
  learningPlanSchema.parse(plan);
  const placement = databasePlacement(learner);
  if (!placement) return false;
  const key = placement.kind === "early-years" ? placement.level : `school:${placement.grade}`;
  const releaseReady = placement.kind === "early-years" || PUBLISHED_SCHOOL_GRADES.includes(placement.grade);
  const rows = await getSql()`with eligible as materialized (
    select l.id from learners l where l.id=${learner.id}::uuid and l.parent_id is not distinct from ${learner.parentId}
      and l.grade is not distinct from ${learner.grade} and l.board is not distinct from ${learner.board}
      and l.learning_placement is not distinct from ${learner.placement ? JSON.stringify(learner.placement) : null}::jsonb
      and not exists (
        select 1 from jsonb_array_elements(${JSON.stringify(plan.sessions)}::jsonb) s
        where not exists (
          select 1 from admin_content_revisions c where c.content_id=s->>'activityId' and c.revision=(s->>'revision')::integer
            and ${releaseReady} and c.published_at is not null and c.reviewed_at is not null and c.reviewed_by is not null
            and c.review_record->'checks' @> '["factual","developmental","language","accessibility","rights"]'::jsonb
            and jsonb_array_length(c.review_record->'checks')=5 and char_length(c.review_record->>'limitations')>=20
            and c.payload->'placements' @> to_jsonb(array[${key}]::text[])
            and (c.status='published' or (c.status='archived' and exists (
              select 1 from learner_learning_plans old, jsonb_array_elements(old.plan->'sessions') previous
              where old.learner_id=l.id and previous->>'id'=s->>'id' and previous->>'activityId'=s->>'activityId' and previous->>'revision'=s->>'revision'
            )))
        )
      ) for update of l
  ), saved as (
    insert into learner_learning_plans(learner_id,revision,plan)
    select id,1,${JSON.stringify(plan)}::jsonb from eligible where ${expectedRevision}=0 or exists(select 1 from learner_learning_plans p where p.learner_id=eligible.id and p.revision=${expectedRevision})
    on conflict(learner_id) do update set revision=learner_learning_plans.revision+1,plan=excluded.plan,updated_at=now()
      where learner_learning_plans.revision=${expectedRevision}
    returning revision
  ) select revision from saved`;
  return rows[0] ? Number(rows[0].revision) : false;
}
