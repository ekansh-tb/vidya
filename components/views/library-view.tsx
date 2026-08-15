"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, BookOpen, Clock, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookReader } from "@/components/views/book-reader";
import { LIBRARY, LIBRARY_REGIONS, type Book } from "@/lib/content/library";
import type { GameState, ReadingProgress } from "@/lib/types";
import { sfx } from "@/lib/audio";

function formatReadTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function LibraryView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [active, setActive] = useState<Book | null>(null);
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const readCount = state.readBooks?.length || 0;

  const toggleRead = (bookId: string) => {
    sfx.click();
    setState((p) => {
      const list = p.readBooks || [];
      const already = list.includes(bookId);
      const next = already ? list.filter((x) => x !== bookId) : [...list, bookId];

      // Pay out ONCE per book, ever — tracked separately from `readBooks` so
      // un-marking and re-marking cannot farm rewards. Previously un-marking
      // removed the book without deducting, and re-marking paid again, so
      // tap-tap was +20 XP / +5 coins on repeat. That inflates level, badges
      // and every parent-facing metric derived from XP.
      // Profiles created before `rewardedBooks` existed are grandfathered from
      // `readBooks`: anything already marked read has already been paid for, so
      // it must not become farmable by the upgrade itself.
      const rewarded = p.rewardedBooks ?? list;
      const alreadyRewarded = rewarded.includes(bookId);
      const earns = !already && !alreadyRewarded;

      return {
        ...p,
        readBooks: next,
        rewardedBooks: earns ? [...rewarded, bookId] : rewarded,
        xp: earns ? p.xp + 20 : p.xp,
        coins: earns ? p.coins + 5 : p.coins,
      };
    });
  };

  const completeBook = (bookId: string) => {
    sfx.coin();
    setState((p) => {
      const readBooks = p.readBooks || [];
      if (readBooks.includes(bookId)) return p;
      const rewarded = p.rewardedBooks ?? readBooks;
      const earns = !rewarded.includes(bookId);
      return {
        ...p,
        readBooks: [...readBooks, bookId],
        rewardedBooks: earns ? [...rewarded, bookId] : rewarded,
        xp: earns ? p.xp + 20 : p.xp,
        coins: earns ? p.coins + 5 : p.coins,
      };
    });
  };

  const saveReadingProgress = (bookId: string, progress: ReadingProgress) => {
    setState((p) => ({
      ...p,
      readingProgress: { ...(p.readingProgress || {}), [bookId]: progress },
    }));
  };

  if (readerBook) {
    return (
      <ReducedMotionProvider>
        <BookReader
          book={readerBook}
          initialProgress={state.readingProgress?.[readerBook.id]}
          read={!!state.readBooks?.includes(readerBook.id)}
          onExit={() => setReaderBook(null)}
          onSaveProgress={(progress) => saveReadingProgress(readerBook.id, progress)}
          onComplete={() => completeBook(readerBook.id)}
        />
      </ReducedMotionProvider>
    );
  }

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-6">
          <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
            <ChevronLeft className="w-5 h-5" /> Home
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#F59E0B" }} />
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(251,191,36,0.15)" }}>
                <BookOpen className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-amber-300">Library</div>
                <div className="font-display text-2xl font-bold text-white">Pick a story</div>
                <div className="text-sm text-white/60">
                  {readCount} of {LIBRARY.length} books read · {readCount * 20} reading XP
                </div>
              </div>
            </div>
          </motion.div>

          {LIBRARY_REGIONS.map((r) => {
            const books = LIBRARY.filter((b) => b.region === r.id);
            if (!books.length) return null;
            return (
              <div key={r.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: r.color }} />
                  <h3 className={`font-display text-xl font-bold text-white ${r.id === "marathi" || r.id === "hindi" ? "font-deva" : ""}`}>
                    {r.label}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {books.map((b, i) => {
                    const read = state.readBooks?.includes(b.id);
                    const isDeva = b.region === "marathi" || b.region === "hindi";
                    return (
                      <motion.button
                        key={b.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { sfx.click(); setActive(b); }}
                        className="glass-card p-4 text-left active:scale-[0.98] transition relative"
                      >
                        {read && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                          </div>
                        )}
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3" style={{ background: `${r.color}22` }}>
                          {b.cover}
                        </div>
                        <div className={`font-display font-bold text-white text-sm leading-tight ${isDeva ? "font-deva" : ""}`}>
                          {b.title}
                        </div>
                        <div className={`text-[11px] text-white/50 mt-0.5 ${isDeva ? "font-deva" : ""}`}>
                          {b.author}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatReadTime(b.readMinutes)}
                          </div>
                          <div className="px-1.5 py-0.5 rounded-full bg-white/[0.06]">
                            {b.difficulty}
                          </div>
                        </div>
                        {b.readerPath && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                            <BookOpen className="w-3 h-3" /> {b.chapterCount} chapters · Full book
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Book detail modal */}
        {active && (
          <BookSheet
            book={active}
            read={!!state.readBooks?.includes(active.id)}
            progress={state.readingProgress?.[active.id]}
            onClose={() => setActive(null)}
            onToggle={() => toggleRead(active.id)}
            onRead={() => {
              setActive(null);
              setReaderBook(active);
            }}
          />
        )}
      </div>
    </ReducedMotionProvider>
  );
}

function BookSheet({
  book, read, progress, onClose, onToggle, onRead,
}: {
  book: Book;
  read: boolean;
  progress?: ReadingProgress;
  onClose: () => void;
  onToggle: () => void;
  onRead: () => void;
}) {
  const isDeva = book.region === "marathi" || book.region === "hindi";
  const titleId = `${useId()}-book-title`;

  // The sheet could only be dismissed by tapping the backdrop, so a keyboard
  // user had no way out of it at all.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        // Decorative scrim: the same dismissal is on Escape, so it does not
        // need to be its own control in the accessibility tree.
        aria-hidden="true"
        className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed bottom-0 inset-x-0 z-[81] max-w-2xl mx-auto rounded-t-3xl glass-strong p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0" style={{ background: "rgba(251,191,36,0.18)" }}>
            {book.cover}
          </div>
          <div className="flex-1 min-w-0">
            <div id={titleId} className={`font-display text-2xl font-bold text-white leading-tight ${isDeva ? "font-deva" : ""}`}>
              {book.title}
            </div>
            <div className={`text-sm text-white/60 mt-0.5 ${isDeva ? "font-deva" : ""}`}>{book.author}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5" /> {book.readerPath ? `${book.chapterCount} chapters · Full text` : `~${formatReadTime(book.readMinutes)} · ${book.difficulty}`}
            </div>
          </div>
        </div>
        <div className={`text-sm text-white/80 leading-relaxed mb-5 ${isDeva ? "font-deva" : ""}`}>
          {book.blurb}
        </div>
        {book.readerPath && progress && (progress.chapterIndex > 0 || progress.scrollProgress > 0.02) && (
          <div className="text-xs text-amber-200 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Saved at chapter {progress.chapterIndex + 1}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {book.readerPath && (
            <Button size="lg" className="w-full" onClick={onRead}>
              {progress && (progress.chapterIndex > 0 || progress.scrollProgress > 0.02) ? "Continue reading" : "Start reading"}
            </Button>
          )}
          <div className="flex gap-2">
            <Button size={book.readerPath ? "md" : "lg"} variant={book.readerPath ? "secondary" : "primary"} className="flex-1" onClick={onToggle}>
              {read ? "Mark unread" : "Mark as finished · +20 XP"}
            </Button>
            {book.link && (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-cyan-300 active:scale-95"
                aria-label="Open"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
