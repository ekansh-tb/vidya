import {describe,it,expect} from 'vitest';
import {randomUUID} from 'node:crypto';
import {preparationQuestionSchema,preparationSetSchema,createPreparationAttempt,emptyPreparation,mergePreparation,readPreparation} from './contracts';
import {starterFor} from './starters';
import {preparationObservations} from './observations';
import {PACK_INDEX} from '../content/packs/pack-index';
import {preparationQuestionsForPack,preparationBankRevision,questionWithChoices} from './study-bank';
import {buildParentReportResponse,parseParentReportResponse} from '../parent-report';
import {DEFAULT_STATE} from '../game-store';
const placement={version:1,kind:'school',board:'cbse',grade:6} as const;
const questions=starterFor(placement)!.questions;
const create=(overrides={})=>createPreparationAttempt({id:randomUUID(),setId:'starter',revision:1,title:'Test collection',subject:'Maths',language:'en',placement,source:'starter',mode:'mock',questions,createdAt:1,updatedAt:1,...overrides},[],5);
describe('private preparation contracts',()=>{
 it('validates every grade starter without substituting a neighbouring grade',()=>{
  const all=[];for(let grade=1;grade<=13;grade++){const bank=starterFor({...placement,grade})!;expect(bank.questions).toHaveLength(6);expect(new Set(bank.questions.map(q=>q.topic)).size).toBe(6);for(const q of bank.questions){expect(preparationQuestionSchema.safeParse(q).success).toBe(true);expect(q.id).toMatch(new RegExp(`^maths-${grade}-`));all.push(q.id);}}
  expect(new Set(all).size).toBe(78);expect(starterFor({version:1,kind:'early-years',level:'nursery'})).toBeUndefined();
 });
 it('binds independent immutable snapshots and keeps order through reload',()=>{
  const a=create(),selected=questions.find(q=>q.id===a.questions[0].id)!;const original=selected.guide;selected.guide='changed draft guide';try{expect(a.questions[0].guide).toBe(original);}finally{selected.guide=original;}
  const p={...emptyPreparation(),activeId:a.id,attempts:{[a.id]:a}};expect(readPreparation(JSON.parse(JSON.stringify(p)))).toEqual(p);expect(new Set(a.questions.map(q=>q.id)).size).toBe(5);
 });
 it('prefers unpractised questions from finite pools',()=>{const a=create({questions:questions.slice(0,5)});const b=createPreparationAttempt({...a,id:randomUUID(),questions,createdAt:2,updatedAt:2},[a],3,()=>.5);expect(b.questions.some(q=>!a.questions.some(p=>p.id===q.id))).toBe(true);});
 it('merges independent papers and responses without reopening submitted papers',()=>{
  const a=create(),b=create(),q=a.questions[0],q2=a.questions[1];
  const left={...emptyPreparation(),updatedAt:2,attempts:{[a.id]:{...a,answers:{[q.id]:{text:'PRIVATE FIRST',revealed:false,updatedAt:2}}}}};
  const right={...emptyPreparation(),updatedAt:3,attempts:{[a.id]:{...a,index:2,updatedAt:3,submittedAt:3,answers:{[q2.id]:{text:'PRIVATE SECOND',revealed:true,selfScore:1,updatedAt:3}}},[b.id]:b}};
  const merged=mergePreparation(left,right)!;expect(Object.keys(merged.attempts)).toHaveLength(2);expect(Object.keys(merged.attempts[a.id].answers)).toHaveLength(2);expect(mergePreparation(right,left)).toEqual(merged);expect(mergePreparation(merged,left)?.attempts[a.id].submittedAt).toBe(3);
 });
 it('rejects out-of-paper marks and formal preschool mocks',()=>{
  const a=create();expect(readPreparation({...emptyPreparation(),attempts:{[a.id]:{...a,answers:{wrong:{text:'x',revealed:false,updatedAt:1}}}}})).toBeUndefined();
  expect(()=>create({placement:{version:1,kind:'early-years',level:'lkg'}})).toThrow();
  expect(()=>create({mode:'play',placement:{version:1,kind:'early-years',level:'lkg'}})).not.toThrow();
  expect(preparationSetSchema.safeParse({version:1,id:randomUUID(),title:'Set',subject:'Science',placement,language:'en',questions,rightsConfirmed:false,archived:false}).success).toBe(false);
 });
 it('projects observations without typed answers, question snapshots, guides or hints',()=>{
  const a=create(),q=a.questions[0];const progress={...emptyPreparation(),attempts:{[a.id]:{...a,submittedAt:2,answers:{[q.id]:{text:'PRIVATE RESPONSE',revealed:true,selfScore:2,updatedAt:2}}}}};
  expect(preparationObservations(progress)[0]).toMatchObject({answered:1,marked:1,marks:2,possibleMarked:2,total:5});
  const response=buildParentReportResponse({state:{...DEFAULT_STATE,preparation:progress},revision:1,updatedAt:'2026-10-25T18:00:00Z'});expect(response.status).toBe('ready');const json=JSON.stringify(response);expect(json).not.toContain('PRIVATE RESPONSE');expect(json).not.toContain(q.prompt);expect(json).not.toContain(q.guide);expect(json).not.toContain(q.hint);
  if(response.status==='ready'){expect(response.state.preparationSessions?.[0].marks).toBe(2);expect(JSON.stringify(parseParentReportResponse({...response,state:{...response.state,preparationSessions:[{...response.state.preparationSessions![0],answers:'PRIVATE RESPONSE'}]}}))).not.toContain('PRIVATE RESPONSE');}
 });
 it('retains legacy progress when merging an older client with no preparation field',()=>{const a=create(),progress={...emptyPreparation(),attempts:{[a.id]:a}};expect(mergePreparation(progress,undefined)).toEqual(progress);});
 it('validates choice correctness and preserves authored options separately from prompts',()=>{const q=questions[0];expect(preparationQuestionSchema.safeParse({...q,choices:['one','two'],correctChoice:'three'}).success).toBe(false);expect(preparationQuestionSchema.safeParse({...q,choices:['one','one'],correctChoice:'one'}).success).toBe(false);expect(preparationQuestionSchema.safeParse({...q,choices:['one','two'],correctChoice:'two'}).success).toBe(true);});
 it('adapts every exact-grade study pack with answer options and valid bounded snapshots',async()=>{
  for(const entry of PACK_INDEX){const pack=await entry.load();const qs=preparationQuestionsForPack(pack);expect(qs.length,pack.title).toBeGreaterThan(0);expect(qs.length).toBeLessThanOrEqual(pack.questions.length);for(const q of qs)expect(preparationQuestionSchema.safeParse(q).success).toBe(true);expect(preparationBankRevision(qs)).toBe(preparationBankRevision(structuredClone(qs)));}
  expect(questionWithChoices('Which?', ['one','two'])).toBe('Which?\nA. one\nB. two');
 });
});
