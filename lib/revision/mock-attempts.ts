import {z} from 'zod';
import {SCIENCE_MOCK_IDS} from './outline';

export const revisionTimestamp=z.number().int().nonnegative().max(8_640_000_000_000_000);
export const revisionAnswerSchema=z.object({text:z.string().max(2000),revealed:z.boolean(),selfScore:z.number().int().min(0).max(2).optional(),updatedAt:revisionTimestamp});
/** Only two-mark written questions belong in this balanced 30-mark paper. */
export const MOCK_POOLS=[['c2','c3','c5','c6','c8','c9','c11','c12'],['m1','m3','m4','m5','m7','m8','m10','m11'],['f1','f2','f4','f5','f7','f8','f9','f11','f12']];
const questionId=z.enum(MOCK_POOLS.flat() as [string,...string[]]);
export const scienceMockSchema=z.object({
 id:z.string().uuid(),createdAt:revisionTimestamp,updatedAt:revisionTimestamp,
 questionIds:z.array(questionId).length(15).refine(ids=>new Set(ids).size===15&&MOCK_POOLS.every(pool=>ids.filter(id=>pool.includes(id)).length===5)),
 index:z.number().int().min(0).max(14),submittedAt:revisionTimestamp.optional(),
 answers:z.partialRecord(questionId,revisionAnswerSchema),
}).refine(p=>Object.keys(p.answers).every(id=>p.questionIds.includes(id)));
export type ScienceMock=z.infer<typeof scienceMockSchema>;
export const MAX_SAVED_MOCKS=20;
export const scienceMocksSchema=z.record(z.string().uuid(),scienceMockSchema).refine(items=>Object.entries(items).every(([id,paper])=>id===paper.id));

/** Prefer less-seen questions. IDs are saved once; renders and resumes never reshuffle. */
export function newScienceMock(history:ScienceMock[],id:string,now:number,random:()=>number=Math.random):ScienceMock|null{
 if(history.length>=MAX_SAVED_MOCKS)return null;
 const previous=history.at(-1)?.questionIds??SCIENCE_MOCK_IDS;
 const papers=[SCIENCE_MOCK_IDS,...history.map(p=>p.questionIds)];
 const questionIds=MOCK_POOLS.flatMap(pool=>pool.map(id=>({id,uses:papers.filter(p=>p.includes(id)).length,tie:random()})).sort((a,b)=>a.uses-b.uses||a.tie-b.tie).slice(0,5).map(q=>q.id));
 // A finite bank necessarily repeats questions. Avoid an identical consecutive selection.
 if(questionIds.every(id=>previous.includes(id))){
  const replacement=MOCK_POOLS[0].find(id=>!questionIds.includes(id))!;
  questionIds[0]=replacement;
 }
 return scienceMockSchema.parse({id,createdAt:now,updatedAt:now,questionIds,index:0,answers:{}});
}

export function mergeScienceMocks(a:Record<string,ScienceMock>={},b:Record<string,ScienceMock>={}):Record<string,ScienceMock>{
 const merged={...a};
 for(const [id,paper] of Object.entries(b)){
  const local=merged[id];if(!local){merged[id]=paper;continue;}
  const latest=paper.updatedAt>local.updatedAt?paper:local;
  const answers={...local.answers};
  for(const [key,value] of Object.entries(paper.answers))if(value&&latest.questionIds.includes(key)&&(!answers[key]||value.updatedAt>answers[key].updatedAt))answers[key]=value;
  merged[id]={...latest,answers,submittedAt:Math.max(local.submittedAt??0,paper.submittedAt??0)||undefined};
 }
 // Concurrent devices may both create near the limit. Preserve every attempt on merge.
 return merged;
}
