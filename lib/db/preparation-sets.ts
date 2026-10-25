import 'server-only';
import {getSql} from './client';
import {savedPreparationSetsSchema,preparationSetSchema,type PreparationSet} from '../preparation/contracts';
import type {LearnerRow} from './queries';
/** Parent reads recheck current shared authority inside the query. */
export async function preparationSetsForParent(parentId:string,learnerId:string){
 const rows=await getSql()`select p.payload as set,p.revision from learner_preparation_sets p where p.learner_id=${learnerId}::uuid and vidya_can_manage_learner(${parentId},p.learner_id) order by p.updated_at desc limit 20`;
 return savedPreparationSetsSchema.parse(rows);
}
export async function preparationSetsForLearner(learner:LearnerRow){
 const rows=await getSql()`select p.payload as set,p.revision from learner_preparation_sets p join learners l on l.id=p.learner_id where l.id=${learner.id}::uuid and l.parent_id is not distinct from ${learner.parentId} and p.payload->>'archived'='false' and p.payload->'placement'=coalesce(l.learning_placement,jsonb_build_object('version',1,'kind','school','board',l.board,'grade',l.grade)) order by p.updated_at desc limit 20`;
 return savedPreparationSetsSchema.parse(rows);
}
export async function savePreparationSet(parentId:string,learnerId:string,set:PreparationSet,expectedRevision:number){
 const payload=preparationSetSchema.parse(set);
 const rows=await getSql()`select vidya_save_preparation_set(${parentId},${learnerId}::uuid,${JSON.stringify(payload)}::jsonb,${expectedRevision}) as revision`;
 return rows[0]?.revision?Number(rows[0].revision):false;
}
