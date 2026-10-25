import {describe,it,expect} from 'vitest';
import {sciencePreparationSummary} from './parent-summary';
import {initialScienceRevision} from './progress';
import {buildParentReportResponse,parseParentReportResponse,chooseParentReportState} from '../parent-report';
import {DEFAULT_STATE} from '../game-store';
describe('parent exam observations',()=>{
 const session={...initialScienceRevision(),submittedAt:1234,answers:{
  'practice:c1':{text:'PRIVATE WRITTEN RESPONSE',revealed:true,updatedAt:1},
  'practice:c2':{text:'   ',revealed:false,updatedAt:2},
  'mock:c2':{text:'PRIVATE MOCK RESPONSE',revealed:true,selfScore:1,updatedAt:3},
  'mock:m1':{text:'another private answer',revealed:false,updatedAt:4},
  'mock:c1':{text:'not a mock question in this paper',revealed:true,selfScore:2,updatedAt:5},
 }};
 it('counts actual paper identities and keeps unmarked answers distinct',()=>{
  const summary=sciencePreparationSummary(session)!;
  expect(summary).toMatchObject({practiceAnswered:1,mockAnswered:2,mockMarked:1,selfAssessedMarks:1,mockSubmitted:true});
  expect(summary.units[0]).toMatchObject({unit:'cells',practiceAnswered:1,mockAnswered:1,mockMarked:1});
  expect(summary.units[1]).toMatchObject({unit:'materials',mockAnswered:1,mockMarked:0});
  expect(JSON.stringify(summary)).not.toContain('PRIVATE');
 });
 it('does not infer revision completion from navigation or submission',()=>{const summary=sciencePreparationSummary({...initialScienceRevision(),mode:'mock',index:14,submittedAt:1})!;expect(summary.mockSubmitted).toBe(true);expect(summary.mockAnswered).toBe(0);expect(summary).not.toHaveProperty('revisionCompleted');});
 it('omits corrupt or absent preparation without invalidating general reports',()=>{expect(sciencePreparationSummary(undefined)).toBeUndefined();const response=buildParentReportResponse({state:{...DEFAULT_STATE,scienceRevision:{bad:true}},revision:2,updatedAt:'2026-10-25T17:00:00Z'});expect(response.status).toBe('ready');if(response.status==='ready')expect(response.state.sciencePreparation).toBeUndefined();});
 it('server and client whitelist summaries without sharing typed answers',()=>{
  const response=buildParentReportResponse({state:{...DEFAULT_STATE,scienceRevision:session},revision:2,updatedAt:'2026-10-25T17:00:00Z'});
  expect(response.status).toBe('ready');expect(JSON.stringify(response)).not.toContain('PRIVATE');expect(JSON.stringify(response)).not.toContain('another private answer');expect(JSON.stringify(response)).not.toContain('scienceRevision');
  if(response.status!=='ready')return;
  expect(response.state.sciencePreparation?.mockMarked).toBe(1);
  const network=parseParentReportResponse({...response,state:{...response.state,sciencePreparation:{...response.state.sciencePreparation,answers:'PRIVATE EXTRA'}}});
  expect(JSON.stringify(network)).not.toContain('PRIVATE EXTRA');
  const decision=chooseParentReportState(DEFAULT_STATE,{status:'ready',state:response.state,revision:2,updatedAt:response.updatedAt});expect(decision.sciencePreparation).toEqual(response.state.sciencePreparation);
 });
});
