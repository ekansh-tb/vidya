// School scheme-of-work overlays.
//
// WHY THIS EXISTS
// ---------------
// Cambridge does not prescribe content for Lower Secondary Humanities. The 0839
// framework groups its learning objectives across Stages 7–9 and lets each
// centre choose its own periods, case studies and order — so there is no such
// thing as "the Stage 7 History syllabus" that can be looked up. What a Grade 6
// learner at CNS Amanora is actually taught in 2026–27 lives in the school's own
// scheme of work, which the school does not publish. Cambridge's framework PDF
// sits behind the school support site; the endorsed course material is a
// Stages 7–9 digital teacher's resource, not a Stage 7 learner's book.
//
// So the exam packs carry the parts that are true everywhere (the skills — the
// framework's own emphasis, and where the marks live) and mark their content
// topics as generic. This module is where a real school syllabus gets layered on
// top of that once someone has the document in hand.
//
// HOW TO ADD ONE
// --------------
// Type up the school's scheme of work — a circular, a portal page, the textbook
// contents pages, or photographs of them — into a SchoolSyllabus below. Cite
// exactly where it came from in `source` so the next reader can tell school fact
// from framework inference. Topics listed in `supersedes` are dropped from the
// pack, so the school's units replace the generic ones while the skills topics
// survive.
//
// NOTHING IS INVENTED HERE. If a school's syllabus is not in this file, the app
// shows the framework-level pack and says so, rather than guessing at a topic
// list and presenting it as the child's actual course.

import type { ExamPack, SyllabusTopic } from "./exam-pack";
import type { Board, LearnerSyllabus, SubjectId } from "../types";

/** Where a syllabus came from — shown to parents so they can judge it. */
export type SyllabusSource = {
  /** Human label, e.g. "CNS Amanora Grade 6 scheme of work, issued June 2026". */
  label: string;
  kind: "school-circular" | "school-portal" | "textbook-contents" | "photo" | "teacher";
  /** ISO date the document was read/transcribed. */
  notedOn: string;
  url?: string;
};

export type SchoolSubjectSyllabus = {
  /** The school's own units, in the order the school teaches them. */
  topics: SyllabusTopic[];
  /** Ids of the pack's generic topics this replaces. Skills topics are normally
   *  left out of this list, since schools don't replace those. */
  supersedes?: string[];
  /** Textbooks the school actually issues for this subject. */
  textbooks?: string[];
};

export type SchoolSyllabus = {
  /** Matched case-insensitively against LearnerProfile.school, loosely — see
   *  `schoolMatches`. A learner typing "CNS Amanora" or "Chatrabhuj Narsee
   *  School, Amanora" should both hit the same entry. */
  schoolKeys: string[];
  board: Board;
  grade: number;
  /** e.g. "2026-27". */
  academicYear: string;
  source: SyllabusSource;
  subjects: Partial<Record<SubjectId, SchoolSubjectSyllabus>>;
};

// ---------------------------------------------------------------------------
// THE REGISTRY
//
// Empty on purpose. CNS Amanora publishes no Grade 6 syllabus, and the AY
// 2026–27 scheme of work has not been supplied yet. When it is, add an entry
// shaped like this — and delete this comment, not the honesty:
//
//   {
//     schoolKeys: ["cns", "chatrabhuj narsee", "amanora"],
//     board: "cambridge-lower-secondary",
//     grade: 6,
//     academicYear: "2026-27",
//     source: {
//       label: "CNS Amanora Grade 6 scheme of work 2026-27 (parent portal PDF)",
//       kind: "school-portal",
//       notedOn: "2026-08-12",
//     },
//     subjects: {
//       "cls-history": {
//         supersedes: ["early-civ", "empires", "life-trade", "medieval"],
//         textbooks: ["<as issued by the school>"],
//         topics: [
//           { id: "t1", num: 6, title: "<Term 1 unit exactly as the school names it>",
//             blurb: "<one line>", syllabus: ["<sub-topic>", "<sub-topic>"] },
//         ],
//       },
//     },
//   },
// ---------------------------------------------------------------------------
export const SCHOOL_SYLLABI: SchoolSyllabus[] = [];

/** Loose school-name match — learners type their school freehand. */
function schoolMatches(entry: SchoolSyllabus, school: string | undefined): boolean {
  if (!school) return false;
  const hay = school.toLowerCase();
  return entry.schoolKeys.some((k) => hay.includes(k.toLowerCase()));
}

export function schoolSyllabusFor(opts: {
  school?: string;
  board: Board;
  grade?: number;
  academicYear?: string;
}): SchoolSyllabus | undefined {
  return SCHOOL_SYLLABI.find(
    (e) =>
      e.board === opts.board &&
      e.grade === opts.grade &&
      schoolMatches(e, opts.school) &&
      (opts.academicYear == null || e.academicYear === opts.academicYear),
  );
}

/** Swaps the "not loaded" caveat for a named source, without duplicating it. */
function stampSyllabus(pack: ExamPack, year: string): ExamPack["highlights"] {
  const value = `School scheme of work, ${year}`;
  const rest = (pack.highlights || []).filter((h) => h.label !== "Syllabus");
  return [...rest, { label: "Syllabus", value }];
}

/**
 * Layers a school's scheme of work over a framework-level pack.
 *
 * Two sources, checked in this order:
 *   1. `uploaded` — a document a parent put through /parent for THIS learner.
 *      A real document beats anything committed to the repo, so it wins.
 *   2. SCHOOL_SYLLABI — a scheme of work typed into this file.
 *
 * Skills topics survive either way. Schools choose their own content but not
 * their own skills, so replacing "how to read a source" with a school's list of
 * periods would throw away the part that actually earns marks — see the `skill`
 * flag on SyllabusTopic.
 *
 * Returns the pack unchanged when neither source has anything for this subject,
 * so callers can apply this unconditionally.
 */
export function applySchoolSyllabus(
  pack: ExamPack,
  opts: {
    school?: string;
    board: Board;
    grade?: number;
    academicYear?: string;
    /** This learner's uploaded scheme of work, if a parent has accepted one. */
    uploaded?: LearnerSyllabus;
  },
): ExamPack {
  const fromUpload = opts.uploaded?.subjects?.[pack.subjectId];
  if (fromUpload && fromUpload.topics.length > 0) {
    const year = opts.uploaded!.academicYear || "this year";
    return {
      ...pack,
      context: `${pack.context} · ${year} scheme of work`,
      highlights: stampSyllabus(pack, year),
      topics: [
        ...pack.topics.filter((t) => t.skill),
        ...fromUpload.topics.map((t, i) => ({
          id: t.id,
          num: i + 1,
          title: t.title,
          blurb: t.term ? `${t.term} · ${t.blurb}` : t.blurb,
          syllabus: t.syllabus,
        })),
      ],
    };
  }

  const entry = schoolSyllabusFor(opts);
  const subject = entry?.subjects[pack.subjectId];
  if (!entry || !subject) return pack;

  // An entry may name the topics it replaces; otherwise every non-skill topic
  // gives way, which is the same rule the upload path uses.
  const named = subject.supersedes;
  const kept = named
    ? pack.topics.filter((t) => !named.includes(t.id))
    : pack.topics.filter((t) => t.skill);

  return {
    ...pack,
    context: `${pack.context} · ${entry.academicYear} scheme of work`,
    highlights: stampSyllabus(pack, entry.academicYear),
    // School units follow the skills topics that survived.
    topics: [...kept, ...subject.topics],
  };
}

/** True when the pack's content topics are framework-level guesses rather than
 *  the learner's actual school course. Surfaces the caveat in the UI. */
export function isGenericSyllabus(opts: {
  school?: string;
  board: Board;
  grade?: number;
  uploaded?: LearnerSyllabus;
  subjectId?: SubjectId;
}): boolean {
  if (opts.subjectId && (opts.uploaded?.subjects?.[opts.subjectId]?.topics.length ?? 0) > 0) {
    return false;
  }
  return schoolSyllabusFor(opts) === undefined;
}
