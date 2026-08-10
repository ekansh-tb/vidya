"use client";

import { useEffect, useState } from "react";
import type { ExamPack } from "../exam-pack";
import type { SubjectId } from "../../types";
import { hasPack, loadPack } from "./pack-index";

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
export function usePack(subjectId: SubjectId | undefined, grade?: number): UsePackResult {
  const exists = subjectId ? hasPack(subjectId, grade) : false;
  const [pack, setPack] = useState<ExamPack | undefined>(undefined);

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
      .then((p) => { if (!cancelled) setPack(p); })
      .catch((e) => {
        if (!cancelled) {
          console.error(`[usePack] failed to load ${subjectId} (grade ${grade}):`, e);
          setPack(undefined);
        }
      });
    return () => { cancelled = true; };
  }, [subjectId, grade, exists]);

  return { exists, pack, loading: exists && pack === undefined };
}
