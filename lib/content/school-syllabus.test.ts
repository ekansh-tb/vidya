import { describe, expect, it } from "vitest";
import type { ExamPack } from "./exam-pack";
import type { SchoolSyllabus } from "./school-syllabus";
import { applySchoolSyllabus, isGenericSyllabus, SCHOOL_SYLLABI } from "./school-syllabus";
import { pickerGroupsForBoard, subjectsForLearner } from "./subjects";

const BASE: ExamPack = {
  subjectId: "cls-history",
  grade: 6,
  title: "History — Stage 7",
  context: "Humanities 0839 · Past strand",
  highlights: [{ label: "Framework", value: "0839" }],
  plan: [],
  topics: [
    { id: "sources", num: 1, title: "Sources & Evidence", blurb: "", syllabus: ["a"] },
    { id: "empires", num: 7, title: "Empires, Rulers & Power", blurb: "", syllabus: ["b"] },
  ],
  flashcards: [],
  questions: [],
  mistakes: [],
  cheat: [],
};

const CNS: SchoolSyllabus = {
  schoolKeys: ["cns", "chatrabhuj narsee"],
  board: "cambridge-lower-secondary",
  grade: 6,
  academicYear: "2026-27",
  source: { label: "test", kind: "school-circular", notedOn: "2026-08-12" },
  subjects: {
    "cls-history": {
      supersedes: ["empires"],
      topics: [{ id: "t1", num: 7, title: "Term 1 — Mughal India", blurb: "", syllabus: ["c"] }],
    },
  },
};

/** Registers an entry for the duration of one test. */
function withSyllabus(entry: SchoolSyllabus, fn: () => void) {
  SCHOOL_SYLLABI.push(entry);
  try { fn(); } finally { SCHOOL_SYLLABI.pop(); }
}

describe("school syllabus overlay", () => {
  it("ships empty — no school's scheme of work is invented", () => {
    expect(SCHOOL_SYLLABI).toHaveLength(0);
  });

  it("returns the pack untouched when no syllabus is registered", () => {
    const out = applySchoolSyllabus(BASE, {
      school: "CNS Amanora",
      board: "cambridge-lower-secondary",
      grade: 6,
    });
    expect(out).toBe(BASE);
  });

  it("replaces superseded topics and keeps the skills ones", () => {
    withSyllabus(CNS, () => {
      const out = applySchoolSyllabus(BASE, {
        school: "Chatrabhuj Narsee School, Amanora Park Town",
        board: "cambridge-lower-secondary",
        grade: 6,
      });
      expect(out.topics.map((t) => t.id)).toEqual(["sources", "t1"]);
      expect(out.context).toContain("2026-27");
      expect(out.highlights?.at(-1)).toEqual({
        label: "Syllabus",
        value: "School scheme of work, 2026-27",
      });
    });
  });

  it("does not leak one school's syllabus into another school", () => {
    withSyllabus(CNS, () => {
      const out = applySchoolSyllabus(BASE, {
        school: "Some Other School, Pune",
        board: "cambridge-lower-secondary",
        grade: 6,
      });
      expect(out).toBe(BASE);
    });
  });

  it("does not apply a Grade 6 syllabus to a Grade 8 learner", () => {
    withSyllabus(CNS, () => {
      const out = applySchoolSyllabus(BASE, {
        school: "CNS Amanora",
        board: "cambridge-lower-secondary",
        grade: 8,
      });
      expect(out).toBe(BASE);
    });
  });

  it("reports a generic syllabus until a school scheme is loaded", () => {
    const ctx = { school: "CNS Amanora", board: "cambridge-lower-secondary" as const, grade: 6 };
    expect(isGenericSyllabus(ctx)).toBe(true);
    withSyllabus(CNS, () => expect(isGenericSyllabus(ctx)).toBe(false));
  });
});

describe("Grade 6 Cambridge Lower Secondary subjects", () => {
  const ids = () => subjectsForLearner("cambridge-lower-secondary", [], 6).map((s) => s.id);

  it("offers History and Geography without the learner picking them", () => {
    expect(ids()).toEqual(expect.arrayContaining(["cls-history", "cls-geography"]));
  });

  it("offers PE and Music/Dance/Drama, which CNS timetables in Grade 6", () => {
    expect(ids()).toEqual(expect.arrayContaining(["cls-pe", "cls-music"]));
  });

  it("offers Hobby in the picker but does not force it", () => {
    const groups = pickerGroupsForBoard("cambridge-lower-secondary", 6);
    const wellbeing = groups.find((g) => g.id === "wellbeing");
    expect(wellbeing?.subjects).toContain("cls-hobby");
    expect(wellbeing?.compulsoryIds).not.toContain("cls-hobby");
    expect(ids()).not.toContain("cls-hobby");
    expect(subjectsForLearner("cambridge-lower-secondary", ["cls-hobby"], 6).map((s) => s.id))
      .toContain("cls-hobby");
  });

  it("keeps the new subjects out of Grade 8, which has its own lineup", () => {
    const g8 = subjectsForLearner("cambridge-lower-secondary", [], 8).map((s) => s.id);
    expect(g8).not.toContain("cls-pe");
    expect(g8).not.toContain("cls-hobby");
  });
});
