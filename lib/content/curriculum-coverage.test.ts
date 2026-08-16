import { describe, expect, it } from "vitest";
import {
  coverageForBoardGrade,
  coverageForSubject,
  curriculumCoverageMatrix,
} from "./curriculum-coverage";

describe("curriculum coverage truth", () => {
  it("marks Cambridge Primary Grade 5 supported from its six question banks", () => {
    const coverage = coverageForBoardGrade("cambridge-primary", 5);

    expect(coverage.status).toBe("supported");
    expect(coverage.availableSubjectCount).toBe(6);
    expect(coverage.subjectCount).toBe(6);
    expect(coverage.subjects.every((subject) => subject.status === "supported")).toBe(true);
    expect(coverageForSubject("cambridge-primary", 5, "maths")?.sources).toEqual([
      "question-bank",
    ]);
  });

  it("marks Cambridge Lower Secondary Grade 6 partial without hiding gaps", () => {
    const coverage = coverageForBoardGrade("cambridge-lower-secondary", 6);

    expect(coverage.status).toBe("partial");
    expect(coverageForSubject("cambridge-lower-secondary", 6, "cls-maths")?.sources).toEqual([
      "exam-pack",
    ]);
    expect(coverageForSubject("cambridge-lower-secondary", 6, "cls-art")?.status).toBe(
      "unavailable",
    );
    expect(coverage.unavailableSubjectIds).toContain("cls-marathi");
  });

  it("marks IGCSE Grade 9 unavailable instead of borrowing Grade 10 packs", () => {
    const coverage = coverageForBoardGrade("cambridge-igcse", 9);

    expect(coverage.status).toBe("unavailable");
    expect(coverage.availableSubjectCount).toBe(0);
    expect(coverageForSubject("cambridge-igcse", 9, "igcse-maths")?.sources).toEqual([]);
  });

  it("exposes exact-grade partial and unavailable CBSE subjects", () => {
    const grade7 = coverageForBoardGrade("cbse", 7);

    expect(grade7.status).toBe("partial");
    expect(coverageForSubject("cbse", 7, "cbse-maths")?.status).toBe("supported");
    expect(coverageForSubject("cbse", 7, "cbse-pe")?.status).toBe("unavailable");
    expect(coverageForBoardGrade("cbse", 6).status).toBe("unavailable");
  });

  it("keeps ICSE coverage exact across its broad catalog range", () => {
    expect(coverageForBoardGrade("icse", 6).status).toBe("partial");
    expect(coverageForBoardGrade("icse", 7).status).toBe("partial");
    expect(coverageForSubject("icse", 7, "icse-sanskrit")?.status).toBe("unavailable");
    expect(coverageForBoardGrade("icse", 8).status).toBe("unavailable");
  });

  it("does not claim subjects outside a board and grade catalog", () => {
    expect(coverageForSubject("cambridge-primary", 5, "igcse-maths")).toBeUndefined();
  });

  it("enumerates every declared board grade once in stable order", () => {
    const matrix = curriculumCoverageMatrix();
    const keys = matrix.map((coverage) => `${coverage.board}@${coverage.grade}`);

    expect(matrix).toHaveLength(32);
    expect(new Set(keys).size).toBe(matrix.length);
    expect(keys.slice(0, 6)).toEqual([
      "cambridge-primary@1",
      "cambridge-primary@2",
      "cambridge-primary@3",
      "cambridge-primary@4",
      "cambridge-primary@5",
      "cambridge-lower-secondary@6",
    ]);
  });

  it("rejects combinations outside the board's declared grade range", () => {
    expect(() => coverageForBoardGrade("cambridge-primary", 6)).toThrow(RangeError);
  });
});
