import { describe,it,expect } from 'vitest';
import { SCIENCE_LESSONS,SCIENCE_QUESTIONS,SCIENCE_MOCK_IDS,SCIENCE_UNITS } from './science-term-one';
import { scienceCourseAvailable } from './availability';
import { initialScienceRevision,mergeScienceRevision,readScienceRevision } from './progress';
import { mergeGameState } from '../sync/merge';
import { DEFAULT_STATE } from '../game-store';
import { buildParentReportResponse } from '../parent-report';
describe('Term 1 science scope',()=>{
 it('offers only the exact eligible school placement',()=>{expect(scienceCourseAvailable('cambridge-lower-secondary',6)).toBe(true);for(const [board,grade] of [['cambridge-primary',6],['cbse',6],['cambridge-lower-secondary',7],[null,null]] as const)expect(scienceCourseAvailable(board,grade)).toBe(false);});
 it('covers all three units with distinct questions and the complete 18-topic sequence',()=>{expect(SCIENCE_LESSONS).toHaveLength(18);expect(new Set(SCIENCE_QUESTIONS.map(q=>q.id)).size).toBe(36);for(const u of SCIENCE_UNITS)expect(SCIENCE_QUESTIONS.filter(q=>q.unit===u.id)).toHaveLength(12);expect(SCIENCE_LESSONS.map(l=>l.id)).toEqual(expect.arrayContaining(['water-cycle','solar-formation','orbits','tides','formulae']));});
 it('has one valid MCQ answer and a fixed balanced 30-mark mock',()=>{for(const q of SCIENCE_QUESTIONS){expect(q.points.length).toBe(q.marks);if(q.options){expect(q.options.filter(o=>o===q.correct)).toHaveLength(1);expect(new Set(q.options).size).toBe(q.options.length);}}const mock=SCIENCE_MOCK_IDS.map(id=>SCIENCE_QUESTIONS.find(q=>q.id===id)!);expect(mock.every(Boolean)).toBe(true);expect(new Set(SCIENCE_MOCK_IDS).size).toBe(15);expect(mock.reduce((sum,q)=>sum+q.marks,0)).toBe(30);for(const u of SCIENCE_UNITS)expect(mock.filter(q=>q.unit===u.id)).toHaveLength(5);});
});
describe('revision save and resume',()=>{
 const a={...initialScienceRevision(),updatedAt:10,answers:{'practice:c1':{text:'Cell membrane',revealed:true,updatedAt:10}}};
 const b={...initialScienceRevision(),mode:'mock' as const,index:3,updatedAt:20,answers:{'mock:f1':{text:'40 N',revealed:false,updatedAt:20}}};
 it('preserves independent answers and resumes latest navigation',()=>{const result=mergeScienceRevision(a,b)!;expect(result.answers).toEqual({...a.answers,...b.answers});expect(result.index).toBe(3);expect(mergeScienceRevision(b,a)).toEqual(result);});
 it('ignores corrupt data and preserves progress through older clients',()=>{expect(readScienceRevision({...a,index:-1})).toBeUndefined();expect(readScienceRevision({...a,answers:{'mock:invalid':{text:'x',revealed:false,updatedAt:1}}})).toBeUndefined();expect(mergeGameState({...DEFAULT_STATE,scienceRevision:a},DEFAULT_STATE).scienceRevision).toEqual(a);expect(mergeGameState(DEFAULT_STATE,{...DEFAULT_STATE,scienceRevision:a}).scienceRevision).toEqual(a);});
 it('does not leak typed revision answers into parent reports',()=>{const r=buildParentReportResponse({state:{...DEFAULT_STATE,scienceRevision:b},revision:1,updatedAt:new Date().toISOString()});expect(JSON.stringify(r)).not.toContain('40 N');expect(JSON.stringify(r)).not.toContain('scienceRevision');});
 it('does not undo submission on a stale-device merge',()=>{expect(mergeScienceRevision({...a,submittedAt:20},{...b,updatedAt:30})?.submittedAt).toBe(20);});
});
