"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  Square,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import type { Book } from "@/lib/content/library";
import {
  DEFAULT_READER_PREFERENCES,
  READER_PREFERENCES_STORAGE_KEY,
  isValidReaderBook,
  parseReaderPreferences,
  safeReaderPosition,
  speechChunks,
  speechErrorMessage,
  speechLanguageTag,
  type ReaderBookContent,
  type ReaderTheme,
} from "@/lib/content/library-utils";
import type { ReadingProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

type SpeechState = "idle" | "speaking" | "paused";

const themeClasses: Record<ReaderTheme, string> = {
  paper: "bg-[#f6efdc] text-[#30291f] selection:bg-amber-200",
  night: "bg-[#171927] text-[#e8e9f1] selection:bg-violet-500/50",
  mist: "bg-[#e8f2f1] text-[#18363a] selection:bg-cyan-200",
};

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
  const initialPositionRef = useRef(safeReaderPosition(initialProgress, book.chapterCount ?? 1));
  const viewportRef = useRef<HTMLDivElement>(null);
  const readerHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorHeadingRef = useRef<HTMLHeadingElement>(null);
  const contentsRef = useRef<HTMLElement>(null);
  const contentsCloseRef = useRef<HTMLButtonElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPositionRef = useRef(initialPositionRef.current);
  const speechSessionRef = useRef(0);
  const readingAloudRef = useRef(false);
  const [content, setContent] = useState<ReaderBookContent | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(initialPositionRef.current.chapterIndex);
  const [scrollProgress, setScrollProgress] = useState(initialPositionRef.current.scrollProgress);
  const [theme, setTheme] = useState<ReaderTheme>(DEFAULT_READER_PREFERENCES.theme);
  const [fontSize, setFontSize] = useState(DEFAULT_READER_PREFERENCES.fontSize);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [speechMessage, setSpeechMessage] = useState("");
  const [showContents, setShowContents] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const contentsTitleId = useId();
  const licenseTitleId = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => readerHeadingRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    try {
      const preferences = parseReaderPreferences(window.localStorage.getItem(READER_PREFERENCES_STORAGE_KEY));
      setTheme(preferences.theme);
      setFontSize(preferences.fontSize);
    } catch {
      // Private browsing and device policies can make storage unavailable.
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    try {
      window.localStorage.setItem(READER_PREFERENCES_STORAGE_KEY, JSON.stringify({ theme, fontSize }));
    } catch {
      // Reading still works when a browser refuses preference storage.
    }
  }, [fontSize, preferencesLoaded, theme]);

  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => {
      if (!readingAloudRef.current || !("speechSynthesis" in window)) return;
      speechSessionRef.current += 1;
      readingAloudRef.current = false;
      window.speechSynthesis.cancel();
    };
  }, []);

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
        if (!isValidReaderBook(value)) throw new Error("Book data is not valid");
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
    const { chapterIndex: nextChapter, scrollProgress: nextScroll } = safeReaderPosition(
      initialProgressRef.current,
      content.chapters.length,
    );
    setChapterIndex(nextChapter);
    setScrollProgress(nextScroll);
    latestPositionRef.current = { chapterIndex: nextChapter, scrollProgress: nextScroll };

    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const maxScroll = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);
      viewport.scrollTop = maxScroll * nextScroll;
      readerHeadingRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [content]);

  useEffect(() => {
    if (!loadError) return;
    const frame = requestAnimationFrame(() => errorHeadingRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [loadError]);

  useEffect(() => {
    if (!readingAloudRef.current || !("speechSynthesis" in window)) return;
    speechSessionRef.current += 1;
    readingAloudRef.current = false;
    window.speechSynthesis.cancel();
    setSpeechState("idle");
    setSpeechMessage("Read aloud stopped");
  }, [chapterIndex]);

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

  useEffect(() => {
    if (!showContents) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    contentsCloseRef.current?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = contentsRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", trapFocus);
    return () => {
      window.removeEventListener("keydown", trapFocus);
      previouslyFocused?.focus();
    };
  }, [showContents]);

  const currentPosition = safeReaderPosition(
    { chapterIndex, scrollProgress },
    content?.chapters.length ?? book.chapterCount ?? 1,
  );
  const currentChapterIndex = currentPosition.chapterIndex;

  const savePosition = (nextChapter: number, nextScroll: number) => {
    latestPositionRef.current = { chapterIndex: nextChapter, scrollProgress: nextScroll };
    onSaveProgress({
      chapterIndex: nextChapter,
      scrollProgress: nextScroll,
      updatedAt: new Date().toISOString(),
    });
  };

  const stopReadAloud = () => {
    const wasActive = readingAloudRef.current || speechState !== "idle";
    speechSessionRef.current += 1;
    readingAloudRef.current = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechState("idle");
    if (wasActive) setSpeechMessage("Read aloud stopped");
  };

  const startReadAloud = () => {
    if (!content || !speechSupported || !("speechSynthesis" in window)) return;
    const speechChapter = content.chapters[currentChapterIndex];
    const chunks = speechChunks([speechChapter.title, ...speechChapter.paragraphs]);
    if (!chunks.length) return;

    const synthesis = window.speechSynthesis;
    const session = speechSessionRef.current + 1;
    speechSessionRef.current = session;
    readingAloudRef.current = true;
    synthesis.cancel();
    setSpeechState("speaking");
    setSpeechMessage("Reading chapter aloud");

    const finish = (message = "Chapter read aloud finished") => {
      if (speechSessionRef.current !== session) return;
      readingAloudRef.current = false;
      setSpeechState("idle");
      setSpeechMessage(message);
    };

    const speakChunk = (index: number) => {
      if (speechSessionRef.current !== session) return;
      if (index >= chunks.length) {
        finish();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = speechLanguageTag(content.language);
      utterance.rate = 0.9;
      utterance.onend = () => speakChunk(index + 1);
      utterance.onerror = (event) => {
        finish(speechErrorMessage(event.error));
      };
      synthesis.speak(utterance);
    };

    speakChunk(0);
  };

  const toggleReadAloud = () => {
    if (!("speechSynthesis" in window)) return;
    if (speechState === "idle") {
      startReadAloud();
    } else if (speechState === "speaking") {
      window.speechSynthesis.pause();
      setSpeechState("paused");
      setSpeechMessage("Read aloud paused");
    } else {
      window.speechSynthesis.resume();
      setSpeechState("speaking");
      setSpeechMessage("Reading chapter aloud");
    }
  };

  const exitReader = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    stopReadAloud();
    savePosition(latestPositionRef.current.chapterIndex, latestPositionRef.current.scrollProgress);
    onExit();
  };

  const onScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const nextScroll = maxScroll > 0 ? Math.min(Math.max(viewport.scrollTop / maxScroll, 0), 1) : 1;
    setScrollProgress(nextScroll);
    latestPositionRef.current = { chapterIndex: currentChapterIndex, scrollProgress: nextScroll };
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePosition(currentChapterIndex, nextScroll), 600);
  };

  const openChapter = (nextChapter: number) => {
    if (!content) return;
    stopReadAloud();
    const safeChapter = safeReaderPosition({ chapterIndex: nextChapter, scrollProgress: 0 }, content.chapters.length).chapterIndex;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setChapterIndex(safeChapter);
    setScrollProgress(0);
    latestPositionRef.current = { chapterIndex: safeChapter, scrollProgress: 0 };
    requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({ top: 0, behavior: "auto" });
      readerHeadingRef.current?.focus({ preventScroll: true });
    });
    savePosition(safeChapter, 0);
    setShowContents(false);
  };

  if (!content) {
    return (
      <div className="fixed inset-0 z-[90] min-h-[100dvh] bg-[#090b18] text-white flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-white/10">
          <button onClick={exitReader} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Back to library">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 ref={readerHeadingRef} tabIndex={-1} className="ml-2 font-display font-bold truncate focus:outline-none">{book.title}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          {loadError ? (
            <div className="max-w-sm text-center">
              <BookMarked className="w-12 h-12 mx-auto text-amber-300 mb-4" />
              <h2 ref={errorHeadingRef} tabIndex={-1} className="font-display text-2xl font-bold focus:outline-none">The book could not open</h2>
              <p className="text-sm text-white/60 mt-2 mb-5">Check the connection and try loading the book again.</p>
              <button onClick={() => setRetryKey((value) => value + 1)} className="min-h-11 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-300 text-slate-950 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <RotateCcw className="w-4 h-4" /> Try again
              </button>
            </div>
          ) : (
            <div className="text-center text-white/70" role="status" aria-live="polite">
              <LoaderCircle className="w-9 h-9 animate-spin mx-auto text-amber-300 mb-3" />
              <div className="font-display text-lg font-bold text-white">Opening the book</div>
              <div className="text-sm mt-1">Preparing your saved place...</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const chapter = content.chapters[currentChapterIndex];
  const overallProgress = ((currentChapterIndex + currentPosition.scrollProgress) / content.chapters.length) * 100;
  const isLastChapter = currentChapterIndex === content.chapters.length - 1;
  const speechActionLabel = speechState === "idle"
    ? "Read this chapter aloud"
    : speechState === "speaking"
      ? "Pause read aloud"
      : "Resume read aloud";

  return (
    <div className="fixed inset-0 z-[90] h-[100dvh] overflow-hidden bg-[#090b18] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 left-[8%] w-72 h-72 rounded-full bg-violet-600/15 blur-[90px]" />
        <div className="absolute bottom-[-8rem] right-[5%] w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <header className="relative h-[72px] px-3 sm:px-5 flex items-center gap-2 border-b border-white/10 bg-[#090b18]/90 backdrop-blur-xl">
        <button onClick={exitReader} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Back to library">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-amber-300 font-bold">
            Chapter {currentChapterIndex + 1} of {content.chapters.length}
          </div>
          <div className="font-display font-bold truncate text-sm sm:text-base">{content.title}</div>
        </div>
        {speechSupported && (
          <button
            type="button"
            onClick={toggleReadAloud}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
              speechState === "idle" ? "bg-white/[0.06] hover:bg-white/10" : "bg-amber-300/15 text-amber-200",
            )}
            aria-label={speechActionLabel}
            title={speechActionLabel}
          >
            {speechState === "speaking" ? <Pause className="w-5 h-5" /> : speechState === "paused" ? <Play className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
        <button onClick={() => setShowContents(true)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Table of contents">
          <List className="w-5 h-5" />
        </button>
        <button onClick={() => setShowSettings((value) => !value)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Reading settings" aria-expanded={showSettings} aria-controls="reading-settings-panel">
          <Settings2 className="w-5 h-5" />
        </button>
        <div
          className="absolute bottom-0 inset-x-0 h-0.5 bg-white/5"
          role="progressbar"
          aria-label="Book progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(overallProgress)}
        >
          <div className="h-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 transition-[width] duration-150" style={{ width: `${overallProgress}%` }} />
        </div>
      </header>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{speechMessage}</div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            id="reading-settings-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-20 top-[82px] right-3 sm:right-5 w-[min(22rem,calc(100vw-1.5rem))] p-4 rounded-2xl border border-white/10 bg-[#14172a]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold">Text size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize((value) => Math.max(value - 2, 15))} disabled={fontSize <= 15} className="w-11 h-11 rounded-xl bg-white/[0.07] flex items-center justify-center disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Decrease text size">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{fontSize}</span>
                <button onClick={() => setFontSize((value) => Math.min(value + 2, 25))} disabled={fontSize >= 25} className="w-11 h-11 rounded-xl bg-white/[0.07] flex items-center justify-center disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Increase text size">
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
                    "min-h-14 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
                    theme === value ? "border-amber-300 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-white/65",
                  )}
                  aria-pressed={theme === value}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
            {speechSupported && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm font-bold">Read aloud</div>
                <p className="text-xs text-white/50 mt-1">Uses the voice available on this device.</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={toggleReadAloud}
                    className="min-h-11 px-3 rounded-xl bg-amber-300 text-slate-950 inline-flex items-center justify-center gap-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {speechState === "speaking" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {speechState === "idle" ? "Start" : speechState === "speaking" ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={stopReadAloud}
                    disabled={speechState === "idle"}
                    className="min-h-11 px-3 rounded-xl bg-white/[0.07] inline-flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <Square className="w-4 h-4" /> Stop
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main
        ref={viewportRef}
        onScroll={onScroll}
        className="relative h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain px-3 sm:px-6 py-5 sm:py-9"
      >
        <article className={cn("relative max-w-3xl mx-auto rounded-[1.75rem] sm:rounded-[2.25rem] shadow-2xl overflow-hidden select-text", themeClasses[theme])}>
          <div className="absolute top-0 left-7 w-8 h-20 bg-amber-400 shadow-md" aria-hidden="true">
            <div className="absolute -bottom-1 left-0 border-l-[16px] border-r-[16px] border-t-[9px] border-l-transparent border-r-transparent border-t-amber-400" />
          </div>
          <div className="px-6 pt-24 pb-7 sm:px-14 sm:pt-28 sm:pb-10 border-b border-current/10">
            <div className="text-xs uppercase tracking-[0.2em] font-bold opacity-55 mb-3">Chapter {currentChapterIndex + 1}</div>
            <h1 ref={readerHeadingRef} tabIndex={-1} className="font-display text-3xl sm:text-5xl font-bold leading-tight text-balance select-text focus:outline-none">{chapter.title}</h1>
            <div className="mt-4 text-sm opacity-60">{content.author}</div>
            <aside aria-labelledby={licenseTitleId} className="mt-7 rounded-2xl border-2 border-current/25 bg-current/[0.06] p-4 text-left font-sans">
              <h2 id={licenseTitleId} className="text-base font-bold select-text">Project Gutenberg access notice</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed select-text">{content.gutenbergLicense.requiredNotice}</p>
              <p className="mt-3 text-xs leading-relaxed select-text"><strong>Rights:</strong> {content.rights}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold">
                <a href={content.gutenbergLicense.licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md">
                  Full license online <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a href={content.gutenbergLicense.originalFormatUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md">
                  Original plain-text book <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md">
                  {content.sourceLabel} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
              <details className="mt-3 rounded-xl border border-current/20 p-3">
                <summary className="min-h-11 cursor-pointer py-2 text-xs font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md">
                  Read the full license in Vidya
                </summary>
                <div tabIndex={0} aria-label="Full Project Gutenberg license text" className="mt-3 max-h-80 overflow-y-auto overscroll-contain rounded-lg border border-current/15 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current">
                  <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed select-text">{content.gutenbergLicense.fullText}</pre>
                </div>
              </details>
            </aside>
          </div>

          <div className="px-6 py-8 sm:px-14 sm:py-12 font-serif leading-[1.85]" style={{ fontSize: `${fontSize}px` }}>
            {chapter.paragraphs.map((paragraph, index) => (
              <p key={`${chapter.id}-${index}`} className="mb-[1.35em] whitespace-pre-line text-pretty select-text">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="px-6 sm:px-14 pb-9 sm:pb-12">
            <div className="h-px bg-current/10 mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                onClick={() => openChapter(currentChapterIndex - 1)}
                disabled={currentChapterIndex === 0}
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
                <button onClick={() => openChapter(currentChapterIndex + 1)} className="h-12 px-5 rounded-xl bg-amber-400 text-slate-950 inline-flex items-center justify-center gap-2 font-sans text-sm font-bold">
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
              ref={contentsRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={contentsTitleId}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute z-40 inset-y-0 right-0 w-[min(25rem,92vw)] bg-[#101326] border-l border-white/10 shadow-2xl flex flex-col"
              aria-label="Table of contents"
            >
              <div className="p-5 border-b border-white/10 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div id={contentsTitleId} className="text-xs uppercase tracking-[0.18em] text-amber-300 font-bold">Table of contents</div>
                  <div className="font-display text-xl font-bold mt-1 truncate">{content.title}</div>
                </div>
                <button ref={contentsCloseRef} onClick={() => setShowContents(false)} className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Close table of contents">
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
                      index === currentChapterIndex ? "bg-amber-300 text-slate-950" : "text-white/70 hover:bg-white/[0.06]",
                    )}
                    aria-current={index === currentChapterIndex ? "page" : undefined}
                  >
                    <span className="w-8 text-xs tabular-nums font-bold opacity-60">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display font-bold leading-tight flex-1">{item.title}</span>
                    {index < currentChapterIndex && <Check className="w-4 h-4 opacity-60" />}
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
