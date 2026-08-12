"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp, FileText, Check, AlertTriangle, Trash2, Loader2, X } from "lucide-react";
import { subjectsForLearner } from "@/lib/content/subjects";
import type { LearnerProfile, LearnerSyllabus, SubjectId } from "@/lib/types";

/**
 * Upload the school's own syllabus.
 *
 * WHY THIS IS A PARENT SURFACE
 * ----------------------------
 * The document is a PDF from a portal, a photo of a printed circular, or text
 * off a school email — all things an adult has and a child does not. It also
 * changes what the app tells a child their course is, which is a stewardship
 * decision. So it lives behind Clerk on /parent, and writes to exactly one
 * learner.
 *
 * EXTRACTION IS A PROPOSAL, NOT A FACT
 * ------------------------------------
 * The model's reading is shown back in full and saved only when the parent
 * presses Use this. A misread photo that silently became a child's curriculum
 * would be the worst failure this feature could have, so there is no path that
 * skips the review step — including the happy path.
 */

type ExtractedTopic = { title: string; blurb: string; syllabus: string[]; term?: string };
type ExtractedSubject = {
  subjectId: string;
  subjectLabel: string;
  textbooks: string[];
  topics: ExtractedTopic[];
};
type Extraction = {
  academicYear: string;
  documentKind: string;
  subjects: ExtractedSubject[];
  dropped: string[];
  notes: string;
};

const KIND_COPY: Record<string, string> = {
  "scheme-of-work": "Scheme of work",
  "syllabus-list": "Syllabus list",
  timetable: "Timetable",
  "book-list": "Book list",
  other: "Not clearly a syllabus",
  unreadable: "Could not be read",
};

export function SyllabusPanel({
  learner, onSave,
}: {
  learner: LearnerProfile;
  onSave: (patch: { schoolSyllabus?: LearnerSyllabus }) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extraction | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const saved = learner.schoolSyllabus;

  const subjects = useMemo(
    () => subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade),
    [learner.board, learner.pickedSubjects, learner.grade],
  );
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name || id;

  const upload = async () => {
    if (files.length === 0 && text.trim().length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      for (const f of files) form.append("file", f);
      if (text.trim()) form.append("text", text.trim());
      form.append(
        "subjects",
        JSON.stringify(subjects.map((s) => ({ id: s.id, name: s.name }))),
      );

      const res = await fetch("/api/syllabus", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (res.status === 401) { setError("Your session expired. Sign in again."); return; }
      if (res.status === 429) { setError("Too many uploads just now. Try again in a bit."); return; }
      if (!res.ok) { setError(data?.error || "Could not read that document."); return; }
      setResult(data as Extraction);
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };

  const accept = () => {
    if (!result) return;
    const subjectsOut: LearnerSyllabus["subjects"] = {};
    for (const s of result.subjects) {
      subjectsOut[s.subjectId as SubjectId] = {
        topics: s.topics.map((t, i) => ({
          id: `sch-${s.subjectId}-${i + 1}`,
          title: t.title,
          blurb: t.blurb,
          syllabus: t.syllabus,
          ...(t.term ? { term: t.term } : {}),
        })),
        ...(s.textbooks.length ? { textbooks: s.textbooks } : {}),
      };
    }
    onSave({
      schoolSyllabus: {
        academicYear: result.academicYear || "",
        sourceLabel:
          files.length > 0
            ? files.map((f) => f.name).join(", ")
            : "Pasted text",
        uploadedAt: new Date().toISOString(),
        subjects: subjectsOut,
      },
    });
    setResult(null);
    setFiles([]);
    setText("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = () => {
    onSave({ schoolSyllabus: undefined });
  };

  return (
    <section className="glass-card p-5 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <FileUp className="w-4 h-4 text-white/70" />
        <h3 className="font-display text-lg font-bold text-white">School syllabus</h3>
      </div>
      <p className="text-sm text-white/60 mb-4">
        Cambridge publishes its Lower Secondary objectives across Stages 7–9 and lets each school
        choose its own units, so there is no exact syllabus to look up. Upload {learner.name}&apos;s
        school document and their subjects will follow it instead of the generic one.
      </p>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-sm">
                <Check className="w-4 h-4" /> In use
                {saved.academicYear && <span className="text-white/60 font-medium">· {saved.academicYear}</span>}
              </div>
              <div className="text-xs text-white/60 mt-1 truncate">{saved.sourceLabel}</div>
              <div className="text-xs text-white/50 mt-1">
                {Object.entries(saved.subjects)
                  .map(([id, v]) => `${subjectName(id)} (${v?.topics.length ?? 0})`)
                  .join(" · ")}
              </div>
            </div>
            <button
              onClick={remove}
              className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-white/60 hover:text-rose-300 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- input */}
      {!result && (
        <>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">
              PDF or photos
            </span>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="application/pdf,image/png,image/jpeg,image/webp,image/heic"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="mt-1 block w-full text-sm text-white/70 file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-white/15"
            />
          </label>

          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f) => (
                <li key={f.name} className="flex items-center gap-2 text-xs text-white/60">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{f.name}</span>
                  <span className="ml-auto shrink-0 tabular-nums">{Math.round(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}

          <label className="block mt-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">
              …or paste the text
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Paste the syllabus from a school email or portal page."
              className="mt-1 w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 text-sm text-white placeholder:text-white/30 focus:ring-white/25 focus:outline-none resize-y"
            />
          </label>

          <button
            onClick={upload}
            disabled={busy || (files.length === 0 && text.trim().length === 0)}
            className="mt-3 w-full rounded-2xl bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 py-2.5 font-bold text-white text-sm inline-flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Reading the document…</> : "Read it"}
          </button>
          <p className="text-[11px] text-white/40 mt-2">
            The file is read once and not stored. Nothing is saved until you approve what it found.
          </p>
        </>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-rose-300">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* --------------------------------------------------------- review */}
      {result && (
        <div className="mt-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-base font-bold text-white">
                Check this before it goes live
              </div>
              <div className="text-xs text-white/55">
                {KIND_COPY[result.documentKind] || result.documentKind}
                {result.academicYear && ` · ${result.academicYear}`}
              </div>
            </div>
            <button
              onClick={() => setResult(null)}
              aria-label="Discard"
              className="text-white/50 hover:text-white active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {result.subjects.length === 0 ? (
            <div className="flex items-start gap-2 text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Nothing usable came out of that. It may not be a syllabus, or the photo may be too
                blurry to read — try a clearer shot or paste the text instead.
              </span>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {result.subjects.map((s) => (
                <div key={s.subjectId} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
                  <div className="font-bold text-white text-sm">
                    {subjectName(s.subjectId)}
                    <span className="text-white/40 font-medium"> · read as “{s.subjectLabel}”</span>
                  </div>
                  {s.textbooks.length > 0 && (
                    <div className="text-xs text-white/50 mt-1">Books: {s.textbooks.join(", ")}</div>
                  )}
                  <ol className="mt-2 space-y-1.5">
                    {s.topics.map((t, i) => (
                      <li key={i} className="text-xs">
                        <div className="text-white/85 font-medium">
                          {t.term && <span className="text-white/40">{t.term} · </span>}
                          {t.title}
                        </div>
                        {t.syllabus.length > 0 && (
                          <div className="text-white/45 mt-0.5">{t.syllabus.join(" · ")}</div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {result.dropped.length > 0 && (
            <p className="text-xs text-amber-300/80 mt-3">
              Not matched to a subject {learner.name} takes, so left out: {result.dropped.join(", ")}
            </p>
          )}
          {result.notes && (
            <p className="text-xs text-white/50 mt-2">{result.notes}</p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setResult(null)}
              className="rounded-2xl bg-white/5 hover:bg-white/10 py-2.5 font-bold text-white/70 text-sm active:scale-[0.99] transition"
            >
              Discard
            </button>
            <button
              onClick={accept}
              disabled={result.subjects.length === 0}
              className="rounded-2xl bg-emerald-500/25 ring-1 ring-emerald-400/40 hover:bg-emerald-500/35 disabled:opacity-40 py-2.5 font-bold text-emerald-100 text-sm active:scale-[0.99] transition"
            >
              Use this
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
