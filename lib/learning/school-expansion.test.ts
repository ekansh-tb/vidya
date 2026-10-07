import { describe,it,expect } from "vitest";
import { SCHOOL_ACTIVITY_EXPANSION } from "./school-expansion";
import { ACTIVITY_CATALOG } from "./catalog";
import { activitySchema } from "@/lib/admin/contracts";
describe("bounded school exploration collection",() => {
  it("provides nine new distinct IDs per grade1..12 without rewriting existing grade13 or original revisions",() => {
    expect(SCHOOL_ACTIVITY_EXPANSION).toHaveLength(108);
    expect(new Set(SCHOOL_ACTIVITY_EXPANSION.map(a=>a.id)).size).toBe(108);
    for(let grade=1;grade<=12;grade++) { const newActivities=SCHOOL_ACTIVITY_EXPANSION.filter(a=>a.placements.includes(`school:${grade}`));expect(newActivities).toHaveLength(9);expect(newActivities.length+ACTIVITY_CATALOG.filter(a=>a.placements.includes(`school:${grade}`)).length).toBe(12); }
    expect(SCHOOL_ACTIVITY_EXPANSION.some(a=>a.placements.includes("school:13"))).toBe(false);
    expect(SCHOOL_ACTIVITY_EXPANSION.some(a=>ACTIVITY_CATALOG.some(existing=>existing.id===a.id))).toBe(false);
  });
  it("validates bilingual steps, usable answers, exact placement and explicit editorial limitations",() => {
    for(const a of SCHOOL_ACTIVITY_EXPANSION) {const parsed=activitySchema.safeParse(a);expect(parsed.success,`${a.id}:${JSON.stringify(parsed.error?.issues)}`).toBe(true);expect(a.steps.length).toBeGreaterThanOrEqual(2);expect(a.alignment).toBe("general-exploration");expect(a.review.limits).toContain("not a claim of independent educator");}
  });
  it("contains real saved-canvas and concrete counting/order activities rather than declaring new unsupported players",() => {
    expect(SCHOOL_ACTIVITY_EXPANSION.filter(a=>a.interaction==="creation")).toHaveLength(12);
    expect(SCHOOL_ACTIVITY_EXPANSION.filter(a=>a.interaction==="sequence")).toHaveLength(2);
    for(const a of SCHOOL_ACTIVITY_EXPANSION.filter(a=>a.interaction==="counting"))expect(a.steps[0].countingObjects?.length).toBe(Number(a.steps[0].answer));
    expect(SCHOOL_ACTIVITY_EXPANSION.some(a=>a.interaction==="simulation")).toBe(false);
  });
  it("arithmetic keys agree with independently calculated quantities",() => {
    const calculations: [string,number][]=[
      ["grade-1-studio-4",2+1],["grade-2-studio-1",4*2],["grade-2-studio-4",8/2],
      ["grade-3-studio-1",5*3],["grade-3-studio-4",12/4],["grade-3-studio-6",2*(4+2)],
      ["grade-4-studio-1",12*4],["grade-4-studio-4",300/2],["grade-4-studio-6",5*4],
      ["grade-5-studio-1",50-37.5],["grade-5-studio-4",2/8+3/8],
      ["grade-6-studio-1",8/2*3],["grade-6-studio-4",200*0.1],["grade-6-studio-8",45-30],
      ["grade-7-studio-1",24/3],["grade-7-studio-4",3/(3+2)],["grade-7-studio-5",3*4],
      ["grade-7-studio-6",3*2],["grade-7-studio-8",(2+4+6)/3],
      ["grade-8-studio-1",5*4+2],["grade-8-studio-4",(50-40)/40*100],["grade-8-studio-6",3*4*2],
      ["grade-9-studio-1",(3+1)**2],["grade-9-studio-6",(6-2)/(3-1)],["grade-9-studio-8",500-100],
      ["grade-10-studio-1",(7+1)/2],["grade-10-studio-4",0.5*0.5],["grade-10-studio-5",60/120*60],["grade-10-studio-8",40+35+10],
      ["grade-11-studio-1",2*3],["grade-11-studio-4",0.25*60+0.75*80],
      ["grade-11-studio-5",2*5],["grade-11-studio-6",12*2],
      ["grade-12-studio-1",4*3],["grade-12-studio-4",100*1.1**2],["grade-12-studio-5",1000*2*10],
    ];
    for(const [id,expected] of calculations){
      const step=SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id===id)!.steps[0];
      const labels=step.items.find(i=>i.id===step.answer)!.label;
      for(const language of ["en","hi"] as const){
        const token=labels[language].match(/\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?/)![0];
        const [numerator,denominator]=token.split("/").map(Number);
        expect(denominator ? numerator/denominator : numerator,`${id}:${language}`).toBeCloseTo(expected,8);
      }
    }
  });
  it("keeps phonics and rhyme instruction, hints and feedback in the selected language",() => {
    for(const id of ["grade-1-studio-3","grade-2-studio-3"]){
      const a=SCHOOL_ACTIVITY_EXPANSION.find(candidate=>candidate.id===id)!;
      for(const step of a.steps){
        for(const text of [step.instruction.en,step.hint.en,step.feedback.en])expect(text).not.toMatch(/[\u0900-\u097f]/);
        for(const text of [step.instruction.hi,step.hint.hi,step.feedback.hi])expect(text).not.toMatch(/moon|milk|cake|lake/i);
      }
    }
  });
  it("states the premises needed for coordinate, probability and evaporation answers",() => {
    const first=(id:string)=>SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id===id)!.steps[0];
    expect(first("grade-5-studio-6").instruction.en).toContain("origin (0,0)");
    expect(first("grade-5-studio-6").instruction.hi).toContain("धनात्मक y ऊपर");
    expect(first("grade-7-studio-4").instruction.en).toContain("each token is equally likely");
    expect(first("grade-7-studio-4").instruction.hi).toContain("संभावना समान");
    const evaporation=first("grade-6-studio-2");
    expect(evaporation.instruction.en).toContain("20 cm² and 40 cm²");
    expect(evaporation.instruction.hi).toContain("20 cm² और 40 cm²");
    expect(evaporation.feedback.en).toContain("depth alone does not establish");
  });
  it("checks equation roots, measurement bounds and repeating beat positions",() => {
    const answer=(id:string)=>{const step=SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id===id)!.steps[0];return step.items.find(i=>i.id===step.answer)!.label;};
    for(const language of ["en","hi"] as const){
      const roots=answer("grade-10-studio-6")[language].match(/-?\d+/g)!.map(Number);
      expect(roots).toHaveLength(2);
      for(const root of roots)expect(root**2-5*root+6).toBe(0);
      expect(roots.reduce((sum,root)=>sum+root,0)).toBe(5);
      const interval=answer("grade-11-studio-2")[language].match(/\d+(?:\.\d+)?/g)!.map(Number);
      expect(interval[0]).toBeCloseTo(10-0.2);expect(interval[1]).toBeCloseTo(10+0.2);
    }
    const repeating=["Clap","Tap","Rest"];
    expect(answer("grade-4-studio-5").en).toBe(repeating[(7-1)%repeating.length]);
  });
  it("distinguishes square cells from exposed edges and disjoint fractions",() => {
    const perimeter=SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id==="grade-4-studio-9")!;
    expect(perimeter.steps[0].hint.en).toContain(`Perimeter is 4+5+4+5=${2*(4+5)}`);
    expect(perimeter.steps[0].hint.hi).toContain("दो बाहरी किनारे");
    const fractions=SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id==="grade-5-studio-9")!;
    expect(fractions.steps[1].instruction.en).toContain("previously blank cells");
    expect(fractions.steps[1].instruction.hi).toContain("पहले खाली");
    expect(fractions.steps[1].instruction.en).toContain("leaving the 16 teal cells unchanged");
  });
  it("keeps editorial review distinct from publication and unresolved canvas access",() => {
    for(const activity of SCHOOL_ACTIVITY_EXPANSION){
      expect(activity.review.limits).toContain("unintegrated draft");
      if(activity.interaction==="creation")expect(activity.review.limits).toContain("per-cell colour and row/column announcements");
    }
    const feedback=SCHOOL_ACTIVITY_EXPANSION.find(a=>a.id==="grade-12-studio-6")!.steps[0].feedback;
    expect(feedback.en).toContain("does not guarantee stability");
    expect(feedback.hi).toContain("स्थिरता की गारंटी नहीं");
  });
});
