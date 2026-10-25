import {z} from 'zod';
import {placementSchema,samePlacement,type LearningPlacement} from '../learning/placement';
export const preparationQuestionSchema=z.object({
 choices:z.array(z.string().trim().min(1).max(300)).min(2).max(6).optional(),correctChoice:z.string().max(300).optional(),
 id:z.string().regex(/^[a-z0-9-]{1,100}$/),topic:z.string().trim().min(1).max(60),
 prompt:z.string().trim().min(1).max(800),guide:z.string().trim().min(1).max(1200),hint:z.string().trim().max(300),marks:z.number().int().min(1).max(5),
}).refine(q=>q.choices?new Set(q.choices).size===q.choices.length&&q.correctChoice!==undefined&&q.choices.includes(q.correctChoice):q.correctChoice===undefined);
export const preparationSetSchema=z.object({
 version:z.literal(1),id:z.string().uuid(),placement:placementSchema,title:z.string().trim().min(1).max(100),subject:z.string().trim().min(1).max(60),language:z.enum(['en','hi']),
 questions:z.array(preparationQuestionSchema).min(1).max(40).refine(q=>new Set(q.map(q=>q.id)).size===q.length),
 rightsConfirmed:z.literal(true),archived:z.boolean(),
});
export const preparationSaveSchema=z.object({expectedRevision:z.number().int().min(0).max(100000),set:preparationSetSchema});
export type PreparationQuestion=z.infer<typeof preparationQuestionSchema>;
export type PreparationSet=z.infer<typeof preparationSetSchema>;
export type SavedPreparationSet={set:PreparationSet;revision:number};
export const savedPreparationSetsSchema=z.array(z.object({set:preparationSetSchema,revision:z.number().int().positive()})).max(20);

const timestamp=z.number().int().nonnegative().max(8_640_000_000_000_000);
const response=z.object({text:z.string().max(1000),revealed:z.boolean(),selfScore:z.number().int().min(0).max(5).optional(),updatedAt:timestamp});
const attemptSchema=z.object({
 version:z.literal(1),id:z.string().uuid(),setId:z.string().max(120),revision:z.number().int().positive(),title:z.string().max(100),subject:z.string().max(60),language:z.enum(['en','hi']),placement:placementSchema,
 source:z.enum(['family','starter','study-pack']),mode:z.enum(['practice','mock','play']),questions:z.array(preparationQuestionSchema).min(1).max(20),
 createdAt:timestamp,updatedAt:timestamp,index:z.number().int().min(0).max(19),submittedAt:timestamp.optional(),
 answers:z.record(z.string().regex(/^[a-z0-9-]{1,100}$/),response),
}).refine(a=>a.index<a.questions.length&&new Set(a.questions.map(q=>q.id)).size===a.questions.length&&Object.entries(a.answers).every(([id,r])=>{const q=a.questions.find(q=>q.id===id);return q&&(r.selfScore===undefined||r.selfScore<=q.marks);})&&(a.placement.kind!=='early-years'||a.mode==='play'));
export type PreparationAttempt=z.infer<typeof attemptSchema>;
export const preparationProgressSchema=z.object({version:z.literal(1),activeId:z.string().uuid().optional(),updatedAt:timestamp,attempts:z.record(z.string().uuid(),attemptSchema).refine(p=>Object.entries(p).every(([id,a])=>a.id===id))});
export type PreparationProgress=z.infer<typeof preparationProgressSchema>;
export const emptyPreparation=():PreparationProgress=>({version:1,updatedAt:0,attempts:{}});
export function readPreparation(value:unknown):PreparationProgress|undefined{const p=preparationProgressSchema.safeParse(value);return p.success?p.data:undefined;}
export function mergePreparation(a:unknown,b:unknown):PreparationProgress|undefined{
 const left=readPreparation(a),right=readPreparation(b);if(!left)return right;if(!right)return left;
 const attempts={...left.attempts};
 for(const [id,r] of Object.entries(right.attempts)){
  const l=attempts[id];if(!l){attempts[id]=r;continue;}
  const latest=r.updatedAt>l.updatedAt?r:l,answers={...l.answers};
  for(const [id,value] of Object.entries(r.answers))if(latest.questions.some(q=>q.id===id)&&(!answers[id]||value.updatedAt>answers[id].updatedAt))answers[id]=value;
  attempts[id]={...latest,answers,submittedAt:Math.max(l.submittedAt??0,r.submittedAt??0)||undefined};
 }
 return {...(right.updatedAt>left.updatedAt?right:left),attempts};
}
export function preparationEligible(placement:LearningPlacement|null,setPlacement:LearningPlacement){return samePlacement(placement,setPlacement);}

/** Store immutable snapshots so later family edits cannot rewrite a saved paper. */
export function createPreparationAttempt(input:Omit<PreparationAttempt,'version'|'questions'|'index'|'answers'> & {questions:PreparationQuestion[]},history:PreparationAttempt[],count:number,random:()=>number=Math.random):PreparationAttempt{
 const previous=history.filter(a=>a.setId===input.setId&&a.revision===input.revision);
 const pool=input.questions.map(q=>({q,uses:previous.filter(a=>a.questions.some(p=>p.id===q.id)).length,tie:random()})).sort((a,b)=>a.uses-b.uses||a.tie-b.tie);
 const selected=pool.slice(0,Math.max(1,Math.min(20,count))).map(p=>p.q);
 // Shuffle the selected questions once, including when a small pool is exhausted.
 for(let i=selected.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[selected[i],selected[j]]=[selected[j],selected[i]];}
 return attemptSchema.parse({...input,version:1,questions:selected,index:0,answers:{}});
}
export function preparationObservation(attempt:PreparationAttempt){
 const answers=attempt.questions.map(q=>attempt.answers[q.id]);
 return {id:attempt.id,title:attempt.title,subject:attempt.subject,source:attempt.source,mode:attempt.mode,createdAt:attempt.createdAt,submitted:!!attempt.submittedAt,total:attempt.questions.length,answered:answers.filter(a=>a?.text.trim()).length,marked:answers.filter(a=>a?.selfScore!==undefined).length,marks:answers.reduce((n,a)=>n+(a?.selfScore??0),0),possibleMarked:attempt.questions.reduce((n,q)=>n+(attempt.answers[q.id]?.selfScore!==undefined?q.marks:0),0)};
}
