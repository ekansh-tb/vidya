import {describe,it,expect} from 'vitest';
import {MAX_SAVED_MOCKS,MOCK_POOLS,newScienceMock,scienceMockSchema} from './mock-attempts';
import {SCIENCE_QUESTIONS,SCIENCE_MOCK_IDS} from './science-term-one';
import {initialScienceRevision,readScienceRevision,mergeScienceRevision,navigateScienceRevision} from './progress';
import {sciencePreparationSummary} from './parent-summary';
const id='11111111-1111-4111-8111-111111111111';
const second='22222222-2222-4222-8222-222222222222';
describe('repeatable Science mock papers',()=>{
 it('uses eligible written two-mark content and balances all three units',()=>{
  for(const pool of MOCK_POOLS)for(const id of pool){const q=SCIENCE_QUESTIONS.find(q=>q.id===id)!;expect(q.marks).toBe(2);expect(q.options).toBeUndefined();}
  for(let i=0;i<100;i++){const p=newScienceMock([],id,100)!;expect(p.questionIds).toHaveLength(15);expect(new Set(p.questionIds).size).toBe(15);expect(p.questionIds.every(q=>SCIENCE_MOCK_IDS.includes(q))).toBe(false);for(const pool of MOCK_POOLS)expect(p.questionIds.filter(q=>pool.includes(q))).toHaveLength(5);}
 });
 it('persists selection and resumes without changing the original paper',()=>{
  const legacy={...initialScienceRevision(),submittedAt:10,answers:{'mock:c2':{text:'original private answer',revealed:true,selfScore:2,updatedAt:10}}};
  const mock=newScienceMock([],id,20)!;const next={...legacy,activeMockId:id,mockAttempts:{[id]:mock},updatedAt:20};
  expect(readScienceRevision(JSON.parse(JSON.stringify(next)))).toEqual(next);
  const oldClient={...legacy,updatedAt:30};expect(mergeScienceRevision(next,oldClient)?.mockAttempts?.[id]).toEqual(mock);expect(mergeScienceRevision(oldClient,next)?.answers).toEqual(legacy.answers);
 });
 it('merges separate attempts and per-question edits from both devices',()=>{
  const paper=newScienceMock([],id,1)!;const q1=paper.questionIds[0],q2=paper.questionIds[1];
  const a={...initialScienceRevision(),updatedAt:2,mockAttempts:{[id]:{...paper,updatedAt:2,answers:{[q1]:{text:'first',revealed:false,updatedAt:2}}}}};
  const b={...initialScienceRevision(),updatedAt:3,mockAttempts:{[id]:{...paper,updatedAt:3,index:2,submittedAt:3,answers:{[q2]:{text:'second',revealed:true,selfScore:1,updatedAt:3}}},[second]:newScienceMock([paper],second,3)!}};
  const merged=mergeScienceRevision(a,b)!;expect(merged.mockAttempts?.[id].answers).toMatchObject({...a.mockAttempts[id].answers,...b.mockAttempts[id].answers});expect(merged.mockAttempts?.[id].index).toBe(2);expect(mergeScienceRevision(b,a)).toEqual(merged);expect(mergeScienceRevision(merged,a)?.mockAttempts?.[id].submittedAt).toBe(3);
 });
 it('switches and resumes distinct saved cursors without overwriting either paper',()=>{
  const first=newScienceMock([],id,1)!,other=newScienceMock([first],second,2)!;
  let p={...initialScienceRevision(),mode:'mock' as const,activeMockId:id,originalMockIndex:4,mockAttempts:{[id]:{...first,index:7},[second]:{...other,index:2}}};
  p=navigateScienceRevision(p,{activeMockId:second,index:2},3) as typeof p;
  expect(p.mockAttempts[id].index).toBe(7);
  p=navigateScienceRevision(p,{index:5},4) as typeof p;
  p=navigateScienceRevision(p,{activeMockId:id,index:p.mockAttempts[id].index},5) as typeof p;
  expect(p.mockAttempts[id].index).toBe(7);expect(p.mockAttempts[second].index).toBe(5);
  p=navigateScienceRevision(p,{activeMockId:undefined,index:4},6) as typeof p;
  expect(p.mockAttempts[id].index).toBe(7);expect(p.originalMockIndex).toBe(4);
  expect(navigateScienceRevision(p,{index:8},7).originalMockIndex).toBe(8);
 });
 it('rejects malformed paper identities, duplicate questions and answers outside a paper',()=>{
  const p=newScienceMock([],id,1)!;expect(scienceMockSchema.safeParse({...p,questionIds:Array(15).fill('c2')}).success).toBe(false);
  const other=MOCK_POOLS.flat().find(q=>!p.questionIds.includes(q))!;expect(scienceMockSchema.safeParse({...p,answers:{[other]:{text:'x',revealed:false,updatedAt:1}}}).success).toBe(false);
  expect(readScienceRevision({...initialScienceRevision(),mockAttempts:{[second]:p}})).toBeUndefined();
 });
 it('keeps the finite-bank limit explicit and does not discard histories on merge',()=>{const p=newScienceMock([],id,1)!;expect(newScienceMock(Array(MAX_SAVED_MOCKS).fill(p),second,2)).toBeNull();});
 it('projects new papers without disclosing private answer text',()=>{const paper=newScienceMock([],id,1)!;const q=paper.questionIds[0];const summary=sciencePreparationSummary({...initialScienceRevision(),mockAttempts:{[id]:{...paper,submittedAt:2,answers:{[q]:{text:'PRIVATE NEW ANSWER',revealed:true,selfScore:2,updatedAt:2}}}}});expect(JSON.stringify(summary)).not.toContain('PRIVATE');expect(summary?.papers?.[0]).toMatchObject({id,answered:1,marked:1,marks:2,submitted:true});});
});
