import { describe, expect, it } from "vitest";
import { EMPTY_LEARNING_PLAN, learningPlanSchema, planConflicts, proposeSession } from "./contracts";
const a="00000000-0000-4000-8000-000000000001", b="00000000-0000-4000-8000-000000000002", c="00000000-0000-4000-8000-000000000003";
const window={id:a,label:"Time I chose",day:1,start:"16:00",end:"17:00"};
const session={id:c,activityId:"reviewed-activity",revision:1,date:"2026-10-12",start:"16:10",end:"16:25"};
describe("real learning plans",()=>{
 it("starts empty without fabricated school hours",()=>{expect(EMPTY_LEARNING_PLAN.commitments).toEqual([]);expect(proposeSession(EMPTY_LEARNING_PLAN,"2026-10-12",10)).toBeNull();});
 it("keeps a proposal inside entered availability",()=>{expect(proposeSession({...EMPTY_LEARNING_PLAN,windows:[window]},"2026-10-12",15)).toEqual({start:"16:00",end:"16:15"});});
 it("subtracts actual commitments and scheduled sessions",()=>{expect(proposeSession({...EMPTY_LEARNING_PLAN,windows:[window],commitments:[{id:b,label:"Music",day:1,start:"16:00",end:"16:20"}],sessions:[{...session,start:"16:20",end:"16:35"}]},"2026-10-12",15)).toEqual({start:"16:35",end:"16:50"});});
 it("does not squeeze an activity into a shorter gap",()=>{expect(proposeSession({...EMPTY_LEARNING_PLAN,windows:[{...window,end:"16:10"}]},"2026-10-12",15)).toBeNull();});
 it("does not treat the end of one interval as an overlap",()=>{expect(planConflicts({...EMPTY_LEARNING_PLAN,windows:[window],commitments:[{id:b,label:"Music",day:1,start:"15:00",end:"16:10"}],sessions:[session]})).toEqual([]);});
 it("finds actual commitment clashes without rejecting the record of them",()=>{expect(planConflicts({...EMPTY_LEARNING_PLAN,commitments:[{...window,label:"School"},{id:b,label:"Music",day:1,start:"16:30",end:"17:30"}]})).toMatchObject([{blocking:false}]);});
 it("blocks an activity outside entered windows",()=>{expect(planConflicts({...EMPTY_LEARNING_PLAN,sessions:[session]})).toMatchObject([{blocking:true}]);});
 it("detects session and commitment conflicts",()=>{expect(planConflicts({...EMPTY_LEARNING_PLAN,windows:[window],commitments:[{id:b,label:"School",day:1,start:"16:00",end:"16:30"}],sessions:[session]}).some(item=>item.blocking)).toBe(true);});
 it("checks overlap only on the same actual date",()=>{expect(planConflicts({...EMPTY_LEARNING_PLAN,windows:[window],sessions:[session,{...session,id:b,date:"2026-10-19"}]})).toEqual([]);});
 it("rejects duplicate item identities and malformed wall times",()=>{expect(learningPlanSchema.safeParse({...EMPTY_LEARNING_PLAN,windows:[window,window]}).success).toBe(false);expect(learningPlanSchema.safeParse({...EMPTY_LEARNING_PLAN,windows:[{...window,start:"25:00"}]}).success).toBe(false);});
 it("rejects unentered overnight intervals and invalid timezones",()=>{expect(learningPlanSchema.safeParse({...EMPTY_LEARNING_PLAN,windows:[{...window,start:"23:00",end:"01:00"}]}).success).toBe(false);expect(learningPlanSchema.safeParse({...EMPTY_LEARNING_PLAN,timezone:"MadeUp/Place"}).success).toBe(false);});
 it("keeps date weekday independent of the execution timezone",()=>{expect(proposeSession({...EMPTY_LEARNING_PLAN,windows:[window]},"2026-10-12",10)).not.toBeNull();expect(proposeSession({...EMPTY_LEARNING_PLAN,windows:[window]},"2026-10-13",10)).toBeNull();});
});
