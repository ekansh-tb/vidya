import { describe, expect, it } from "vitest";
import { packFor, packsForSubjects } from "./index";

describe("grade-safe full pack registry", () => {
  it("finds exact-grade packs", () => {
    expect(packFor("igcse-maths", 10)?.grade).toBe(10);
    expect(packFor("icse-maths", 6)?.grade).toBe(6);
    expect(packFor("icse-maths", 7)?.grade).toBe(7);
    expect(packFor("cbse-maths", 7)?.grade).toBe(7);
  });

  it("does not fall back across grades", () => {
    expect(packFor("igcse-maths", 9)).toBeUndefined();
    expect(packFor("icse-maths", 8)).toBeUndefined();
    expect(packFor("cbse-maths", 6)).toBeUndefined();
  });

  it("filters subject lists to exact-grade packs", () => {
    expect(packsForSubjects(["igcse-maths"], 9)).toEqual([]);
    expect(packsForSubjects(["icse-maths"], 8)).toEqual([]);
    expect(packsForSubjects(["cbse-maths"], 6)).toEqual([]);
    expect(packsForSubjects(["cbse-maths"], 7).map((pack) => pack.grade)).toEqual([7]);
  });

  it("preserves subject-only lookup when grade is omitted", () => {
    expect(packFor("icse-maths")?.subjectId).toBe("icse-maths");
    expect(packsForSubjects(["icse-maths"])).toHaveLength(1);
  });
});
