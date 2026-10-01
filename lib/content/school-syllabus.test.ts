import { describe, expect, it, vi } from "vitest";
import type { ExamPack } from "./exam-pack";
import type { LearnerSyllabus } from "../types";
import type { SchoolSyllabus } from "./school-syllabus";
import { applySchoolSyllabus, confidenceStorageKey, isGenericSyllabus, readTopicConfidence, saveTopicConfidence, SCHOOL_SYLLABI, topicConfidenceIdentity } from "./school-syllabus";
import { pickerGroupsForBoard, subjectsForLearner } from "./subjects";

const BASE: ExamPack = {
  subjectId: "cls-history",
  grade: 6,
  title: "History — Stage 7",
  context: "Humanities 0839 · Past strand",
  highlights: [
    { label: "Framework", value: "0839" },
    { label: "Syllabus", value: "Framework-level · school scheme not loaded" },
  ],
  plan: [],
  topics: [
    { id: "sources", num: 1, title: "Sources & Evidence", blurb: "", syllabus: ["a"], skill: true },
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
      expect(out.context).toBe(BASE.context);
      expect(out.highlights).toContainEqual({
        label: "Syllabus topics",
        value: "School source: test, 2026-27. Retained topics come from the original pack.",
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

describe("parent-uploaded syllabus", () => {
  const uploaded: LearnerSyllabus = {
    academicYear: "2026-27",
    sourceLabel: "cns-grade6.pdf",
    uploadedAt: "2026-08-12T00:00:00.000Z",
    subjects: {
      "cls-history": {
        topics: [
          { id: "sch-1", title: "Mughal India", blurb: "Term 1 unit", syllabus: ["Akbar"], term: "Term 1" },
        ],
      },
    },
  };
  const ctx = { school: "CNS Amanora", board: "cambridge-lower-secondary" as const, grade: 6 };

  it("keeps skills topics and replaces the generic content ones", () => {
    const out = applySchoolSyllabus(BASE, { ...ctx, uploaded });
    expect(out.topics.map((t) => t.id)).toEqual(["sources", "sch-1"]);
    expect(out.topics[1].title).toBe("Mughal India");
  });

  it("prefixes the term onto the unit blurb", () => {
    const out = applySchoolSyllabus(BASE, { ...ctx, uploaded });
    expect(out.topics[1].blurb).toBe("Term 1 · Term 1 unit");
  });

  it("replaces the 'not loaded' caveat rather than stacking a second one", () => {
    const out = applySchoolSyllabus(BASE, { ...ctx, uploaded });
    expect(out.context).toBe(BASE.context);
    expect(out.highlights!.some((h) => h.label === "Syllabus")).toBe(false);
    expect(out.highlights!.filter((h) => h.label === "Syllabus topics")).toEqual([{
      label: "Syllabus topics",
      value: "Parent upload: cns-grade6.pdf, 2026-27; curriculum and grade not verified. Retained topics come from the original pack.",
    }]);
  });

  it("leaves a subject the upload says nothing about alone", () => {
    const geo: ExamPack = { ...BASE, subjectId: "cls-geography" };
    expect(applySchoolSyllabus(geo, { ...ctx, uploaded })).toBe(geo);
  });

  it("ignores an upload whose subject has no topics", () => {
    const empty: LearnerSyllabus = { ...uploaded, subjects: { "cls-history": { topics: [] } } };
    expect(applySchoolSyllabus(BASE, { ...ctx, uploaded: empty })).toBe(BASE);
  });

  it("beats a syllabus committed to the registry", () => {
    withSyllabus(CNS, () => {
      const out = applySchoolSyllabus(BASE, { ...ctx, uploaded });
      expect(out.topics.map((t) => t.id)).toEqual(["sources", "sch-1"]);
    });
  });

  it("reports the subject as no longer generic", () => {
    expect(isGenericSyllabus({ ...ctx, uploaded, subjectId: "cls-history" })).toBe(false);
    expect(isGenericSyllabus({ ...ctx, uploaded, subjectId: "cls-geography" })).toBe(true);
  });

  it("labels all retained practice as supplemental even when question topics are orphaned", () => {
    const original: ExamPack = {
      ...BASE,
      questions: [{ id: "q1", topic: "empires", q: "Original question", model: "Original answer" }],
      flashcards: [{ term: "Original term", def: "Original definition" }],
      mistakes: [{ mistake: "Original mistake", fix: "Original fix" }],
      cheat: [{ heading: "Original notes", bullets: ["Original fact"] }],
    };
    for (const source of ["upload", "registry"] as const) {
      withSyllabus(CNS, () => {
        const out = applySchoolSyllabus(original, { ...ctx, uploaded: source === "upload" ? uploaded : undefined });
        for (const key of ["questions", "flashcards", "mistakes", "cheat", "plan"] as const) {
          expect(out[key]).toBe(original[key]);
        }
        expect(out.topics.some((t) => t.id === out.questions[0].topic)).toBe(false);
        expect(out.highlights).toContainEqual({
          label: "Practice provenance",
          value: "Original pack material: supplemental and unmapped to school topics; school approval not verified.",
        });
      });
    }
  });

  const overlay = (changes: Partial<LearnerSyllabus> = {}) => applySchoolSyllabus(BASE, { ...ctx, uploaded: { ...uploaded, ...changes } });
  const identity = (pack: ExamPack, index = 1) => topicConfidenceIdentity(pack, pack.topics[index], ctx);

  it("keeps legacy progress verbatim without guessing a match to a positional ID", () => {
    const pack = overlay();
    const legacyKey = `__cs-confidence-${BASE.subjectId}`;
    const old = { [legacyKey]: JSON.stringify({ "sch-1": "strong", sources: "ok" }), notes: "Keep my notes" };
    expect(readTopicConfidence(old[confidenceStorageKey(pack)])[identity(pack)]).toBeUndefined();
    const saved = saveTopicConfidence(old, pack, identity(pack), "weak");
    expect(saved[legacyKey]).toBe(old[legacyKey]);
    expect(saved.notes).toBe(old.notes);
    expect(readTopicConfidence(saved[confidenceStorageKey(pack)])[identity(pack)]).toBe("weak");
    expect(old).not.toHaveProperty(confidenceStorageKey(pack));
  });

  it("preserves confidence across pack display copy changes but isolates topic and revision changes", () => {
    const before = overlay();
    const legacyKey = `__cs-confidence-${BASE.subjectId}`;
    const legacy = JSON.stringify({ "sch-1": "ok" });
    const saved = saveTopicConfidence({ [legacyKey]: legacy }, before, identity(before), "strong");
    const copyChanged = { ...before, title: "Updated display headline", context: "Reworded provenance label" };
    expect(identity(copyChanged)).toBe(identity(before));
    const map = readTopicConfidence(saved[confidenceStorageKey(copyChanged)]);
    expect(map[identity(copyChanged)]).toBe("strong");

    const topicChanged = {
      ...copyChanged,
      topics: copyChanged.topics.map((t) => ({ ...t, syllabus: ["A different learning objective"] })),
    };
    const revisionChanged = { ...overlay({ uploadedAt: "2026-09-01T00:00:00.000Z" }), title: copyChanged.title, context: copyChanged.context };
    for (const changed of [topicChanged, revisionChanged]) {
      expect(identity(changed)).not.toBe(identity(before));
      expect(map[identity(changed)]).toBeUndefined();
    }
    const updated = saveTopicConfidence(saved, copyChanged, identity(copyChanged), "weak");
    expect(updated[legacyKey]).toBe(legacy);
    expect(Object.keys(readTopicConfidence(updated[confidenceStorageKey(copyChanged)]))).toEqual([identity(before)]);

    // Original pack topics also survive editorial changes without an overlay.
    expect(identity({ ...BASE, title: copyChanged.title, context: copyChanged.context }, 0)).toBe(identity(BASE, 0));
  });

  it("never transfers confidence to different content at the same positional ID", () => {
    const before = overlay();
    const saved = saveTopicConfidence({}, before, identity(before), "strong");
    const topic = uploaded.subjects["cls-history"]!.topics[0];
    for (const change of [
      { title: "Ancient Greece" }, { syllabus: ["Different learning objective"] },
      { blurb: "Revised scope" }, { term: "Term 2" },
    ]) {
      const after = overlay({ subjects: { "cls-history": { topics: [{ ...topic, ...change }] } } });
      expect(identity(after)).not.toBe(identity(before));
      const map = readTopicConfidence(saved[confidenceStorageKey(after)]);
      expect(map[identity(after)]).toBeUndefined();
      expect(map[identity(before)]).toBe("strong");
    }
  });

  it("separates reaccepted uploads, years and sources while retaining earlier ratings", () => {
    const before = overlay();
    let saved = saveTopicConfidence({}, before, identity(before), "strong");
    for (const change of [
      { academicYear: "2027-28" }, { uploadedAt: "2026-09-01T00:00:00.000Z" }, { sourceLabel: "revised.pdf" },
    ]) {
      const after = overlay(change);
      expect(identity(after)).not.toBe(identity(before));
      expect(readTopicConfidence(saved[confidenceStorageKey(after)])[identity(after)]).toBeUndefined();
      saved = saveTopicConfidence(saved, after, identity(after), "weak");
    }
    expect(readTopicConfidence(saved[confidenceStorageKey(before)])[identity(before)]).toBe("strong");
    expect(Object.keys(readTopicConfidence(saved[confidenceStorageKey(before)]))).toHaveLength(4);
  });

  it("does not reuse a rating when reordering regenerates positional IDs", () => {
    const a = uploaded.subjects["cls-history"]!.topics[0];
    const b = { ...a, id: "sch-2", title: "Ancient Greece" };
    const before = overlay({ subjects: { "cls-history": { topics: [a, b] } } });
    const after = overlay({ subjects: { "cls-history": { topics: [{ ...b, id: a.id }, { ...a, id: b.id }] } } });
    const saved = saveTopicConfidence({}, before, identity(before), "strong");
    const map = readTopicConfidence(saved[confidenceStorageKey(after)]);
    expect(map[identity(after, 1)]).toBeUndefined();
    expect(map[identity(after, 2)]).toBeUndefined();
    expect(map[identity(before)]).toBe("strong");
  });

  it("survives JSON reload and keeps unchanged original skills stable across uploads", () => {
    const before = overlay();
    expect(identity(JSON.parse(JSON.stringify(before)))).toBe(identity(before));
    expect(identity(overlay({ uploadedAt: "later" }), 0)).toBe(identity(before, 0));
    const changedNumber = { ...before, topics: before.topics.map((t) => ({ ...t, num: 99 })) };
    expect(identity(changedNumber)).toBe(identity(before));
  });

  it("separates board, learner grade, pack grade, school and original topic content", () => {
    const topic = BASE.topics[0];
    const key = topicConfidenceIdentity(BASE, topic, ctx);
    for (const change of [{ board: "icse" as const }, { grade: 7 }, { school: "Other school" }]) {
      expect(topicConfidenceIdentity(BASE, topic, { ...ctx, ...change })).not.toBe(key);
    }
    expect(topicConfidenceIdentity({ ...BASE, grade: 7 }, topic, ctx)).not.toBe(key);
    expect(topicConfidenceIdentity(BASE, { ...topic, syllabus: ["New scope"] }, ctx)).not.toBe(key);
  });

  it("rejects corrupt confidence maps and invalid ratings", () => {
    for (const raw of ["null", "[]", "true", "42", "broken", '"text"']) {
      expect(readTopicConfidence(raw)).toEqual({});
    }
    expect(readTopicConfidence('{"valid":"strong","invalid":"expert","object":{}}')).toEqual({ valid: "strong" });
  });

  it("records actual save time only for the edited identity, preserving undated and legacy entries", () => {
    const pack = overlay();
    const key = confidenceStorageKey(pack);
    const old = { [key]: '{"undated":"weak"}', "__cs-confidence-cls-history": ' {"sch-1":"strong"} ' };
    const clock = vi.spyOn(Date, "now").mockReturnValue(1234);
    try {
      const saved = saveTopicConfidence(old, pack, identity(pack), "strong");
      expect(JSON.parse(saved[key])).toEqual({ undated: "weak", [identity(pack)]: { rating: "strong", editedAt: 1234 } });
      expect(saved["__cs-confidence-cls-history"]).toBe(old["__cs-confidence-cls-history"]);
      const second = saveTopicConfidence(saved, pack, identity(pack, 0), "ok", 2345);
      expect(JSON.parse(second[key])[identity(pack)]).toEqual({ rating: "strong", editedAt: 1234 });
      expect(JSON.parse(second[key])[identity(pack, 0)]).toEqual({ rating: "ok", editedAt: 2345 });
      expect(JSON.parse(second[key]).undated).toBe("weak");
    } finally { clock.mockRestore(); }
  });

  it("rejects invalid timestamps without treating them as undated ratings or changing saved data", () => {
    const pack = overlay();
    const original = { notes: "Keep this" };
    for (const editedAt of [-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER]) {
      expect(() => saveTopicConfidence(original, pack, identity(pack), "ok", editedAt)).toThrow("Invalid confidence edit time");
      expect(readTopicConfidence(JSON.stringify({ bad: { rating: "strong", editedAt } }))).toEqual({});
    }
    expect(readTopicConfidence('{"bad":{"rating":"strong"},"alsoBad":{"rating":"strong","editedAt":"1234"}}')).toEqual({});
    expect(original).toEqual({ notes: "Keep this" });
  });

  it("version-scopes registry topics and does not claim missing subjects are school-specific", () => {
    withSyllabus(CNS, () => {
      const before = applySchoolSyllabus(BASE, ctx);
      expect(isGenericSyllabus({ ...ctx, subjectId: "cls-geography" })).toBe(true);
      withSyllabus({ ...CNS, academicYear: "2027-28" }, () => {
        const after = applySchoolSyllabus(BASE, { ...ctx, academicYear: "2027-28" });
        expect(identity(after)).not.toBe(identity(before));
      });
    });
  });
});

describe("Grade 6 Cambridge Lower Secondary subjects", () => {
  const ids = () => subjectsForLearner("cambridge-lower-secondary", [], 6).map((s) => s.id);

  it("does not infer compulsory subjects from a school timetable", () => {
    expect(ids()).toEqual([]);
  });

  it("retains explicitly selected PE and performing arts", () => {
    expect(subjectsForLearner("cambridge-lower-secondary", ["cls-pe", "cls-music"], 6).map((s) => s.id))
      .toEqual(expect.arrayContaining(["cls-pe", "cls-music"]));
  });

  it("offers Hobby in the picker but does not force it", () => {
    const groups = pickerGroupsForBoard("cambridge-lower-secondary", 6);
    const wellbeing = groups.find((g) => g.id === "wellbeing");
    expect(wellbeing?.subjects).toContain("cls-hobby");
    expect(wellbeing?.compulsoryIds || []).not.toContain("cls-hobby");
    expect(ids()).not.toContain("cls-hobby");
    expect(subjectsForLearner("cambridge-lower-secondary", ["cls-hobby"], 6).map((s) => s.id))
      .toContain("cls-hobby");
  });

  it("keeps chosen activities visible when the learner reaches Grade 8", () => {
    const g8 = subjectsForLearner("cambridge-lower-secondary", ["cls-pe", "cls-hobby"], 8).map((s) => s.id);
    expect(g8).toEqual(expect.arrayContaining(["cls-pe", "cls-hobby"]));
  });
});
