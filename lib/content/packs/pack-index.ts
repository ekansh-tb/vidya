// Lightweight index of every exam pack: identity only, no content.
//
// WHY THIS EXISTS
// ---------------
// Exam packs are large static data — the full set is well over 500 kB of
// TypeScript. Three surfaces (the router, the home lobby, the subject screen)
// only ever ask "does a pack exist for this subject and grade?", yet importing
// `ALL_PACKS` to answer that pulled every pack body into the initial client
// bundle. A Grade 6 learner was downloading IGCSE Biology to render a banner.
//
// This module answers the existence question from a tiny table, and hands back
// a `load()` thunk so the pack body is fetched as its own chunk only when a
// learner actually opens it.
//
// DRIFT IS GUARDED, NOT ASSUMED: `pack-index.test.ts` imports the real
// ALL_PACKS and asserts this table matches it exactly, both ways. Adding a pack
// without adding a row here fails CI.

import type { ExamPack } from "../exam-pack";
import type { SubjectId } from "../../types";

export type PackEntry = {
  subjectId: SubjectId;
  /** Learner grade this pack targets. For Cambridge Lower Secondary this is
   *  the GRADE (6), not the Cambridge stage (7) — see the note in index.ts. */
  grade?: number;
  /** Dynamic import of just this pack. Each becomes its own chunk. */
  load: () => Promise<ExamPack>;
};

export const PACK_INDEX: PackEntry[] = [
  // ── Cambridge IGCSE (Grades 9–10) ─────────────────────────────────
  { subjectId: "igcse-cs", grade: 10, load: () => import("./igcse-cs").then((m) => m.IGCSE_CS_PACK) },
  { subjectId: "igcse-physics", grade: 10, load: () => import("./igcse-physics").then((m) => m.IGCSE_PHYSICS_PACK) },
  { subjectId: "igcse-maths", grade: 10, load: () => import("./igcse-maths").then((m) => m.IGCSE_MATHS_PACK) },
  { subjectId: "igcse-chemistry", grade: 10, load: () => import("./igcse-chemistry").then((m) => m.IGCSE_CHEMISTRY_PACK) },
  { subjectId: "igcse-biology", grade: 10, load: () => import("./igcse-biology").then((m) => m.IGCSE_BIOLOGY_PACK) },
  { subjectId: "igcse-english", grade: 10, load: () => import("./igcse-english").then((m) => m.IGCSE_ENGLISH_PACK) },
  { subjectId: "igcse-french", grade: 10, load: () => import("./igcse-french").then((m) => m.IGCSE_FRENCH_PACK) },

  // ── Cambridge Lower Secondary (Grade 6 = Stage 7) ─────────────────
  { subjectId: "cls-maths", grade: 6, load: () => import("./cls7-maths").then((m) => m.CLS7_MATHS_PACK) },
  { subjectId: "cls-science", grade: 6, load: () => import("./cls7-science").then((m) => m.CLS7_SCIENCE_PACK) },
  { subjectId: "cls-english", grade: 6, load: () => import("./cls7-english").then((m) => m.CLS7_ENGLISH_PACK) },

  // ── ICSE Class 7 ──────────────────────────────────────────────────
  { subjectId: "icse-maths", grade: 7, load: () => import("./icse7-maths").then((m) => m.ICSE7_MATHS) },
  { subjectId: "icse-physics", grade: 7, load: () => import("./icse7-physics").then((m) => m.ICSE7_PHYSICS) },
  { subjectId: "icse-chemistry", grade: 7, load: () => pickIcse7("icse-chemistry") },
  { subjectId: "icse-biology", grade: 7, load: () => pickIcse7("icse-biology") },
  { subjectId: "icse-history-civics", grade: 7, load: () => pickIcse7("icse-history-civics") },
  { subjectId: "icse-geography", grade: 7, load: () => pickIcse7("icse-geography") },
  { subjectId: "icse-computer", grade: 7, load: () => pickIcse7("icse-computer") },

  // ── ICSE Class 6 ──────────────────────────────────────────────────
  { subjectId: "icse-maths", grade: 6, load: () => pickIcse6("icse-maths") },
  { subjectId: "icse-physics", grade: 6, load: () => pickIcse6("icse-physics") },
  { subjectId: "icse-chemistry", grade: 6, load: () => pickIcse6("icse-chemistry") },
  { subjectId: "icse-biology", grade: 6, load: () => pickIcse6("icse-biology") },
  { subjectId: "icse-history-civics", grade: 6, load: () => pickIcse6("icse-history-civics") },
  { subjectId: "icse-geography", grade: 6, load: () => pickIcse6("icse-geography") },
  { subjectId: "icse-computer", grade: 6, load: () => pickIcse6("icse-computer") },

  // ── ICSE languages (Classes 6 & 7) ────────────────────────────────
  { subjectId: "icse-english-lang", grade: 6, load: () => pickLang("icse-english-lang", 6) },
  { subjectId: "icse-english-lit", grade: 6, load: () => pickLang("icse-english-lit", 6) },
  { subjectId: "icse-hindi", grade: 6, load: () => pickLang("icse-hindi", 6) },
  { subjectId: "icse-marathi", grade: 6, load: () => pickLang("icse-marathi", 6) },
  { subjectId: "icse-english-lang", grade: 7, load: () => pickLang("icse-english-lang", 7) },
  { subjectId: "icse-english-lit", grade: 7, load: () => pickLang("icse-english-lit", 7) },
  { subjectId: "icse-hindi", grade: 7, load: () => pickLang("icse-hindi", 7) },
  { subjectId: "icse-marathi", grade: 7, load: () => pickLang("icse-marathi", 7) },

  // ── CBSE Class 7 ──────────────────────────────────────────────────
  { subjectId: "cbse-maths", grade: 7, load: () => import("./cbse7-maths").then((m) => m.CBSE7_MATHS) },
  { subjectId: "cbse-science", grade: 7, load: () => import("./cbse7-science").then((m) => m.CBSE7_SCIENCE) },
  { subjectId: "cbse-english", grade: 7, load: () => import("./cbse7-english").then((m) => m.CBSE7_ENGLISH) },
  { subjectId: "cbse-hindi", grade: 7, load: () => import("./cbse7-hindi").then((m) => m.CBSE7_HINDI) },
  { subjectId: "cbse-sanskrit", grade: 7, load: () => import("./cbse7-sanskrit").then((m) => m.CBSE7_SANSKRIT) },
  { subjectId: "cbse-socialscience", grade: 7, load: () => import("./cbse7-sst").then((m) => m.CBSE7_SST) },
];

// Three source files export ARRAYS of packs rather than one pack each, so the
// whole array's chunk loads when any of its members is requested. That is
// acceptable — they are grouped by board and grade, so a learner who wants one
// almost always has access to its siblings too.

function pickIcse7(subjectId: SubjectId): Promise<ExamPack> {
  return import("./icse7-rest").then((m) => must(m.ICSE7_PACKS, subjectId, 7));
}
function pickIcse6(subjectId: SubjectId): Promise<ExamPack> {
  return import("./icse6").then((m) => must(m.ICSE6_PACKS, subjectId, 6));
}
function pickLang(subjectId: SubjectId, grade: number): Promise<ExamPack> {
  return import("./icse-languages").then((m) => must(m.ICSE_LANGUAGE_PACKS, subjectId, grade));
}

function must(packs: ExamPack[], subjectId: SubjectId, grade: number): ExamPack {
  const found = packs.find((p) => p.subjectId === subjectId && (p.grade ?? grade) === grade);
  if (!found) {
    // Only reachable if PACK_INDEX and the pack files disagree, which
    // pack-index.test.ts exists to prevent.
    throw new Error(`Pack index out of sync: no pack for ${subjectId} grade ${grade}`);
  }
  return found;
}

// ---------------------------------------------------------------- lookups

/** Best index entry for a (subjectId, grade): exact grade wins, else any. */
export function packEntryFor(subjectId: SubjectId, grade?: number): PackEntry | undefined {
  if (grade != null) {
    const exact = PACK_INDEX.find((p) => p.subjectId === subjectId && p.grade === grade);
    if (exact) return exact;
  }
  return PACK_INDEX.find((p) => p.subjectId === subjectId);
}

/** Synchronous existence check — the hot path, and the whole point of this file. */
export function hasPack(subjectId: SubjectId, grade?: number): boolean {
  return packEntryFor(subjectId, grade) !== undefined;
}

/** Loads the pack body on demand. Resolves undefined when none is indexed. */
export function loadPack(subjectId: SubjectId, grade?: number): Promise<ExamPack | undefined> {
  const entry = packEntryFor(subjectId, grade);
  return entry ? entry.load() : Promise.resolve(undefined);
}
