"use client";

import { useEffect, useState } from "react";
import type { ExamPack } from "../exam-pack";
import type { Board, LearnerSyllabus, SubjectId } from "../../types";
import { hasPack, loadPack } from "./pack-index";
import { applySchoolSyllabus } from "../school-syllabus";

export type UsePackResult = {
  /** Known synchronously on first render — safe to branch layout on, so the
   *  screen never flashes an empty state before the pack arrives. */
  exists: boolean;
  /** The pack body once its chunk has downloaded. */
  pack: ExamPack | undefined;
  /** A pack exists but hasn't arrived yet — render a skeleton. */
  loading: boolean;
};

/**
 * Loads an exam pack on demand.
 *
 * Existence resolves synchronously from the lightweight PACK_INDEX; the body
 * arrives from a dynamically imported chunk. This keeps hundreds of kilobytes
 * of curriculum data out of the initial bundle — see pack-index.ts.
 */
export function usePack(
  subjectId: SubjectId | undefined,
  grade?: number,
  /** Learner's school + board, and any scheme of work a parent uploaded for
   *  them. When either source has topics for this subject, the school's own
   *  units replace the pack's generic content ones (skills topics survive).
   *  Omit and the framework-level pack is used as-is. */
  schoolCtx?: { school?: string; board: Board; uploaded?: LearnerSyllabus },
): UsePackResult {
  const exists = subjectId ? hasPack(subjectId, grade) : false;
  const [pack, setPack] = useState<ExamPack | undefined>(undefined);
  const school = schoolCtx?.school;
  const board = schoolCtx?.board;
  const uploaded = schoolCtx?.uploaded;

  useEffect(() => {
    if (!subjectId || !exists) {
      setPack(undefined);
      return;
    }
    let cancelled = false;
    // Clear first so switching subjects shows a skeleton rather than the
    // previous subject's chapters.
    setPack(undefined);
    loadPack(subjectId, grade)
      .then((p) => {
        if (cancelled) return;
        setPack(p && board ? applySchoolSyllabus(p, { school, board, grade, uploaded }) : p);
      })
      .catch((e) => {
        if (!cancelled) {
          console.error(`[usePack] failed to load ${subjectId} (grade ${grade}):`, e);
          setPack(undefined);
        }
      });
    return () => { cancelled = true; };
  }, [subjectId, grade, exists, school, board, uploaded]);

  return { exists, pack, loading: exists && pack === undefined };
}
