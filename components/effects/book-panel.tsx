"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import { BOOKS } from "@/lib/content/books";
import { QUESTIONS } from "@/lib/content/questions";
import type { SubjectId } from "@/lib/types";

export function BookPanel({
  open,
  subjectId,
  topicId,
  onClose,
}: {
  open: boolean;
  subjectId: SubjectId;
  topicId?: string;
  onClose: () => void;
}) {
  const subject = SUBJECT_MAP[subjectId];
  const book = BOOKS[subjectId];
  // This panel is mounted only for a question already admitted by QuizView's
  // learner-aware gate, so this read cannot expose a bank to another grade.
  const topic = topicId ? QUESTIONS[subjectId]?.[topicId] : undefined;
  const isDeva = subject?.isDeva;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 z-[81] h-full w-full sm:max-w-md bg-[#0A0420] border-l border-white/10 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`${book?.title || "Book"} reference`}
          >
            <div
              className="px-5 py-4 border-b border-white/10 flex items-center justify-between"
              style={{ background: `linear-gradient(180deg, ${subject?.soft || "transparent"}, transparent)` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: subject?.soft }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: subject?.accent }} />
                </div>
                <div>
                  <div className={`font-display text-base font-bold text-white leading-tight ${isDeva ? "font-deva" : ""}`}>
                    {book?.title}
                  </div>
                  {topic && (
                    <div className={`text-[11px] text-white/50 ${isDeva ? "font-deva" : ""}`}>{topic.title}</div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 active:scale-95"
                aria-label="Close book"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-32">
              {book && book.pages.length > 0 ? (
                <div className="space-y-4">
                  {book.pages.map((src, i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={src + i}
                      src={src}
                      alt={`Page ${i + 1}`}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02]"
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : topic ? (
                <CheatSheet topic={topic} isDeva={!!isDeva} accent={subject?.accent || "#22D3EE"} />
              ) : (
                <EmptyState />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CheatSheet({
  topic,
  isDeva,
  accent,
}: {
  topic: { title: string; items: { q: string; a: string; ex: string }[] };
  isDeva: boolean;
  accent: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">
        Quick Cheat Sheet
      </div>
      <div className={`text-xs text-white/60 mb-4 leading-relaxed ${isDeva ? "font-deva" : ""}`}>
        No textbook pages uploaded yet for this topic. Here&apos;s a quick study sheet from your questions.
      </div>
      <div className="space-y-3">
        {topic.items.map((it, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
            <div
              className="text-[10px] uppercase tracking-widest font-bold mb-1"
              style={{ color: accent }}
            >
              Q {i + 1}
            </div>
            <div className={`text-sm font-semibold text-white leading-snug ${isDeva ? "font-deva" : ""}`}>
              {it.q}
            </div>
            <div className={`text-sm text-emerald-300 mt-2 font-semibold ${isDeva ? "font-deva" : ""}`}>
              {it.a}
            </div>
            <div className={`text-xs text-white/55 mt-1.5 ${isDeva ? "font-deva" : ""}`}>{it.ex}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-white/50 mt-12 text-sm">
      No book content available for this subject yet.
    </div>
  );
}
