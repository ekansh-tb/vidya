import {beforeEach,describe,it,expect,vi} from 'vitest';
import {starterFor} from '@/lib/preparation/starters';
const m=vi.hoisted(()=>({parent:vi.fn(),configured:vi.fn(),owned:vi.fn(),origin:vi.fn(),rate:vi.fn(),load:vi.fn(),save:vi.fn()}));
vi.mock('@/lib/auth/session',()=>({requireParent:m.parent}));vi.mock('@/lib/db/client',()=>({dbConfigured:m.configured}));vi.mock('@/lib/db/queries',()=>({getLearnerForParent:m.owned}));vi.mock('@/lib/api/guard',()=>({isSameOrigin:m.origin,rateLimit:m.rate}));vi.mock('@/lib/db/preparation-sets',()=>({preparationSetsForParent:m.load,savePreparationSet:m.save}));
import {GET,PUT} from './route';
const id='00000000-0000-4000-8000-000000000001',placement={version:1,kind:'school',board:'cbse',grade:1} as const;
const set={version:1,id,placement,title:'Parent material',subject:'Maths',language:'en',questions:starterFor(placement)!.questions,rightsConfirmed:true,archived:false};
const context=()=>({params:Promise.resolve({id})});const request=(body:unknown={expectedRevision:0,set})=>new Request('https://vidya.example/api/parent/preparation',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{vi.clearAllMocks();m.configured.mockReturnValue(true);m.parent.mockResolvedValue({userId:'actual-parent'});m.owned.mockResolvedValue({id});m.origin.mockReturnValue(true);m.rate.mockResolvedValue({ok:true});m.load.mockResolvedValue([]);m.save.mockResolvedValue(1);});
describe('preparation endpoint authority',()=>{
 it('blocks foreign origins and unauthenticated or other-family parents',async()=>{
  m.origin.mockReturnValue(false);expect((await PUT(request(),context())).status).toBe(403);expect(m.parent).not.toHaveBeenCalled();m.origin.mockReturnValue(true);m.parent.mockResolvedValue(null);expect((await PUT(request(),context())).status).toBe(401);m.parent.mockResolvedValue({userId:'actual-parent'});m.owned.mockResolvedValue(null);expect((await GET(new Request('https://vidya.example'),context())).status).toBe(404);expect(m.save).not.toHaveBeenCalled();expect(m.load).not.toHaveBeenCalled();
 });
 it('uses authenticated parent and route learner, not body claims, with private responses',async()=>{
  const response=await PUT(request({expectedRevision:0,set,parentId:'forged',learnerId:'forged'}),context());expect(response.status).toBe(200);expect(m.owned).toHaveBeenCalledWith('actual-parent',id);expect(m.save).toHaveBeenCalledWith('actual-parent',id,set,0);expect(response.headers.get('cache-control')).toContain('no-store');
 });
 it('rejects bad, oversized, unpermitted or conflicting edits without losing saved material',async()=>{
  expect((await PUT(request({expectedRevision:0,set:{...set,rightsConfirmed:false}}),context())).status).toBe(400);
  expect((await PUT(request({padding:'x'.repeat(129000)}),context())).status).toBe(413);expect(m.save).not.toHaveBeenCalled();m.save.mockResolvedValue(false);expect((await PUT(request(),context())).status).toBe(409);
 });
});
