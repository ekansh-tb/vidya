"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookMarked,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  List,
  LoaderCircle,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Settings2,
  Sun,
  X,
} from "lucide-react";
import type { Book } from "@/lib/content/library";
import type { ReadingProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

type ReaderChapter = {
  id: string;
  title: string;
  paragraphs: string[];
};

type ReaderBookContent = {
  title: string;
  author: string;
  language: string;
  sourceLabel: string;
  sourceUrl: string;
  rights: string;
  chapters: ReaderChapter[];
};

type ReaderTheme = "paper" | "night" | "mist";

const themeClasses: Record<ReaderTheme, string> = {
  paper: "bg-[#f6efdc] text-[#30291f] selection:bg-amber-200",
  night: "bg-[#171927] text-[#e8e9f1] selection:bg-violet-500/50",
  mist: "bg-[#e8f2f1] text-[#18363a] selection:bg-cyan-200",
};

function validReaderBook(value: unknown): value is ReaderBookContent {
  if (!value || typeof value !== "object") return false;
  const book = value as Partial<ReaderBookContent>;
  return (
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.sourceUrl === "string" &&
    Array.isArray(book.chapters) &&
    book.chapters.length > 0 &&
    book.chapters.every((chapter) => (
      chapter &&
      typeof chapter.id === "string" &&
      typeof chapter.title === "string" &&
      Array.isArray(chapter.paragraphs) &&
      chapter.paragraphs.every((paragraph) => typeof paragraph === "string")
    ))
  );
}

export function BookReader({
  book,
  initialProgress,
  read,
  onExit,
  onSaveProgress,
  onComplete,
}: {
  book: Book;
  initialProgress?: ReadingProgress;
  read: boolean;
  onExit: () => void;
  onSaveProgress: (progress: ReadingProgress) => void;
  onComplete: () => void;
}) {
  const initialProgressRef = useRef(initialProgress);
  const viewportRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPositionRef = useRef({ chapterIndex: initialProgress?.chapterIndex ?? 0, scrollProgress: initialProgress?.scrollProgress ?? 0 });
  const [content, setContent] = useState<ReaderBookContent | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(initialProgress?.chapterIndex ?? 0);
  const [scrollProgress, setScrollProgress] = useState(initialProgress?.scrollProgress ?? 0);
  const [theme, setTheme] = useState<ReaderTheme>("paper");
  const [fontSize, setFontSize] = useState(19);
  const [showContents, setShowContents] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setContent(null);
    setLoadError(false);

    fetch(book.readerPath!, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Book request failed with ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (!validReaderBook(value)) throw new Error("Book data is not valid");
        setContent(value);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });

    return () => controller.abort();
  }, [book.readerPath, retryKey]);

  useEffect(() => {
    if (!content) return;
    const saved = initialProgressRef.current;
    const nextChapter = Math.min(Math.max(saved?.chapterIndex ?? 0, 0), content.chapters.length - 1);
    const nextScroll = Math.min(Math.max(saved?.scrollProgress ?? 0, 0), 1);
    setChapterIndex(nextChapter);
    setScrollProgress(nextScroll);
    latestPositionRef.current = { chapterIndex: nextChapter, scrollProgress: nextScroll };

    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const maxScroll = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);
      viewport.scrollTop = maxScroll * nextScroll;
    });
    return () => cancelAnimationFrame(frame);
  }, [content]);

  useEffect(() => {
    const closePanels = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showContents) setShowContents(false);
      else if (showSettings) setShowSettings(false);
      else exitReader();
    };
    window.addEventListener("keydown", closePanels);
    return () => window.removeEventListener("keydown", closePanels);
  });

  const savePosition = (nextChapter: number, nextScroll: number) => {
    latestPositionRef.current = { chapterIndex: nextChapter, scrollProgress: nextScroll };
    onSaveProgress({
      chapterIndex: nextChapter,
      scrollProgress: nextScroll,
      updatedAt: new Date().toISOString(),
    });
  };

  const exitReader = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    savePosition(latestPositionRef.current.chapterIndex, latestPositionRef.current.scrollProgress);
    onExit();
  };

  const onScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const nextScroll = maxScroll > 0 ? Math.min(Math.max(viewport.scrollTop / maxScroll, 0), 1) : 1;
    setScrollProgress(nextScroll);
    latestPositionRef.current = { chapterIndex, scrollProgress: nextScroll };
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePosition(chapterIndex, nextScroll), 600);
  };

  const openChapter = (nextChapter: number) => {
    if (!content) return;
    const safeChapter = Math.min(Math.max(nextChapter, 0), content.chapters.length - 1);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setChapterIndex(safeChapter);
    setScrollProgress(0);
    latestPositionRef.current = { chapterIndex: safeChapter, scrollProgress: 0 };
    requestAnimationFrame(() => viewportRef.current?.scrollTo({ top: 0, behavior: "auto" }));
    savePosition(safeChapter, 0);
    setShowContents(false);
  };

  if (!content) {
    return (
      <div className="fixed inset-0 z-[90] min-h-[100dvh] bg-[#090b18] text-white flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-white/10">
          <button onClick={exitReader} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10" aria-label="Back to library">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="ml-2 font-display font-bold truncate">{book.title}</div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          {loadError ? (
            <div className="max-w-sm text-center">
              <BookMarked className="w-12 h-12 mx-auto text-amber-300 mb-4" />
              <h2 className="font-display text-2xl font-bold">The book could not open</h2>
              <p className="text-sm text-white/60 mt-2 mb-5">Check the connection and try loading the book again.</p>
              <button onClick={() => setRetryKey((value) => value + 1)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-300 text-slate-950 font-bold">
                <RotateCcw className="w-4 h-4" /> Try again
              </button>
            </div>
          ) : (
            <div className="text-center text-white/70">
              <LoaderCircle className="w-9 h-9 animate-spin mx-auto text-amber-300 mb-3" />
              <div className="font-display text-lg font-bold text-white">Opening the book</div>
              <div className="text-sm mt-1">Preparing your saved place...</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const chapter = content.chapters[chapterIndex];
  const overallProgress = ((chapterIndex + scrollProgress) / content.chapters.length) * 100;
  const isLastChapter = chapterIndex === content.chapters.length - 1;

  return (
    <div className="fixed inset-0 z-[90] h-[100dvh] overflow-hidden bg-[#090b18] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 left-[8%] w-72 h-72 rounded-full bg-violet-600/15 blur-[90px]" />
        <div className="absolute bottom-[-8rem] right-[5%] w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <header className="relative h-[72px] px-3 sm:px-5 flex items-center gap-2 border-b border-white/10 bg-[#090b18]/90 backdrop-blur-xl">
        <button onClick={exitReader} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 active:scale-95" aria-label="Back to library">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-amber-300 font-bold">
            Chapter {chapterIndex + 1} of {content.chapters.length}
          </div>
          <div className="font-display font-bold truncate text-sm sm:text-base">{content.title}</div>
        </div>
        <button onClick={() => setShowContents(true)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/10" aria-label="Table of contents">
          <List className="w-5 h-5" />
        </button>
        <button onClick={() => setShowSettings((value) => !value)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/10" aria-label="Reading settings" aria-expanded={showSettings}>
          <Settings2 className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/5">
          <div className="h-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 transition-[width] duration-150" style={{ width: `${overallProgress}%` }} />
        </div>
      </header>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-20 top-[82px] right-3 sm:right-5 w-[min(22rem,calc(100vw-1.5rem))] p-4 rounded-2xl border border-white/10 bg-[#14172a]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold">Text size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize((value) => Math.max(value - 2, 15))} disabled={fontSize <= 15} className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center disabled:opacity-30" aria-label="Decrease text size">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{fontSize}</span>
                <button onClick={() => setFontSize((value) => Math.min(value + 2, 25))} disabled={fontSize >= 25} className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center disabled:opacity-30" aria-label="Increase text size">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm font-bold mb-2">Reading light</div>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["paper", "Paper", Sun],
                ["night", "Night", Moon],
                ["mist", "Mist", BookMarked],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "h-14 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold",
                    theme === value ? "border-amber-300 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-white/65",
                  )}
                  aria-pressed={theme === value}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        ref={viewportRef}
        onScroll={onScroll}
        className="relative h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain px-3 sm:px-6 py-5 sm:py-9"
      >
        <article className={cn("relative max-w-3xl mx-auto rounded-[1.75rem] sm:rounded-[2.25rem] shadow-2xl overflow-hidden", themeClasses[theme])}>
          <div className="absolute top-0 left-7 w-8 h-20 bg-amber-400 shadow-md" aria-hidden="true">
            <div className="absolute -bottom-1 left-0 border-l-[16px] border-r-[16px] border-t-[9px] border-l-transparent border-r-transparent border-t-amber-400" />
          </div>
          <div className="px-6 pt-24 pb-7 sm:px-14 sm:pt-28 sm:pb-10 border-b border-current/10">
            <div className="text-xs uppercase tracking-[0.2em] font-bold opacity-55 mb-3">Chapter {chapterIndex + 1}</div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-balance">{chapter.title}</h1>
            <div className="mt-4 text-sm opacity-60">{content.author}</div>
          </div>

          <div className="px-6 py-8 sm:px-14 sm:py-12 font-serif leading-[1.85]" style={{ fontSize: `${fontSize}px` }}>
            {chapter.paragraphs.map((paragraph, index) => (
              <p key={`${chapter.id}-${index}`} className="mb-[1.35em] whitespace-pre-line text-pretty">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="px-6 sm:px-14 pb-9 sm:pb-12">
            <div className="h-px bg-current/10 mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                onClick={() => openChapter(chapterIndex - 1)}
                disabled={chapterIndex === 0}
                className="h-12 px-4 rounded-xl border border-current/20 inline-flex items-center justify-center gap-2 font-sans text-sm font-bold disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              {isLastChapter ? (
                <button
                  onClick={onComplete}
                  disabled={read}
                  className="h-12 px-5 rounded-xl bg-amber-400 text-slate-950 inline-flex items-center justify-center gap-2 font-sans text-sm font-bold disabled:bg-emerald-500 disabled:text-white"
                >
                  <Check className="w-4 h-4" /> {read ? "Book finished" : "Finish book and earn 20 XP"}
                </button>
              ) : (
                <button onClick={() => openChapter(chapterIndex + 1)} className="h-12 px-5 rounded-xl bg-amber-400 text-slate-950 inline-flex items-center justify-center gap-2 font-sans text-sm font-bold">
                  Next chapter <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
            {isLastChapter && (
              <div className="mt-8 text-center text-xs leading-relaxed opacity-55 font-sans">
                <div>{content.rights}</div>
                <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 underline underline-offset-4">
                  {content.sourceLabel} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </article>
      </main>

      <AnimatePresence>
        {showContents && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContents(false)}
              aria-label="Close table of contents"
              className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute z-40 inset-y-0 right-0 w-[min(25rem,92vw)] bg-[#101326] border-l border-white/10 shadow-2xl flex flex-col"
              aria-label="Table of contents"
            >
              <div className="p-5 border-b border-white/10 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-300 font-bold">Table of contents</div>
                  <div className="font-display text-xl font-bold mt-1 truncate">{content.title}</div>
                </div>
                <button onClick={() => setShowContents(false)} className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {content.chapters.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openChapter(index)}
                    className={cn(
                      "w-full min-h-14 px-3 py-3 rounded-xl flex items-center gap-3 text-left mb-1",
                      index === chapterIndex ? "bg-amber-300 text-slate-950" : "text-white/70 hover:bg-white/[0.06]",
                    )}
                    aria-current={index === chapterIndex ? "page" : undefined}
                  >
                    <span className="w-8 text-xs tabular-nums font-bold opacity-60">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display font-bold leading-tight flex-1">{item.title}</span>
                    {index < chapterIndex && <Check className="w-4 h-4 opacity-60" />}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
