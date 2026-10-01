import { describe, expect, it } from "vitest";
import { CLS7_SCIENCE_PACK } from "./cls7-science";
import { CLS7_ENGLISH_PACK } from "./cls7-english";

describe("Stage 7 evidence reasoning corrections", () => {
  it("rewards investigation, not automatic removal of an unusual reading", () => {
    const question = CLS7_SCIENCE_PACK.questions.find(q => q.id === "cs7-3")!;
    expect(question.topic).toBe("twsc");
    expect(question.opts?.filter(option => option === question.a)).toHaveLength(1);
    expect(question.a).toMatch(/keep the record.*investigate.*repeat/i);
    expect(question.a).not.toMatch(/leave it out|delete|exclude/i);
    expect(question.model).toMatch(/numbers alone do not show a timing error/i);
    expect(question.model).toMatch(/if an error is confirmed.*explain any correction or exclusion/i);
    expect(question.model).toMatch(/otherwise.*do not discard.*report the uncertainty/i);
  });

  it("keeps summary teaching consistent with the answer's evidence requirement", () => {
    const syllabus = CLS7_SCIENCE_PACK.topics.find(t => t.id === "twsc")!.syllabus;
    const cheat = CLS7_SCIENCE_PACK.cheat.flatMap(section => section.bullets);
    for (const teaching of [syllabus, cheat]) {
      const relevant = teaching.filter(line => /unusual readings/i.test(line));
      expect(relevant).toHaveLength(1);
      expect(relevant[0]).toMatch(/keep.*record.*investigate/i);
      expect(relevant[0]).toMatch(/evidence for any.*exclusion/i);
      expect(teaching.join(" ")).not.toMatch(/leave them out of the mean|spot anomalies → exclude/);
    }
  });

  it("grounds every model quotation in the supplied original extract", () => {
    const question = CLS7_ENGLISH_PACK.questions.find(q => q.id === "cls7e-4")!;
    expect(question.topic).toBe("read-evidence");
    expect(question.q).toContain("Original practice extract (written for this exercise)");
    const extract = question.q.match(/\n"([\s\S]+?)"\n/)?.[1];
    expect(extract).toBeTruthy();
    const quotations = [...question.model.matchAll(/'([^']+)'/g)].map(match => match[1]);
    expect(quotations.length).toBeGreaterThan(0);
    for (const quotation of quotations) expect(extract).toContain(quotation);
    expect(question.model).toMatch(/suggests/);
    expect(question.model).toMatch(/does not tell us why.*absent.*whether.*permanent/);
    expect(question.model).not.toMatch(/loss is not fresh but permanent|scene of grief/);
  });
});
