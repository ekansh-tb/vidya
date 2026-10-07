import type { Book } from "@/lib/content/library";
import type { ReadingProgress } from "@/lib/types";

export type LibraryDifficultyFilter = "all" | Book["difficulty"];
export type LibraryAvailabilityFilter = "all" | "in-app" | "online" | "catalog";

export type LibraryFilters = {
  query: string;
  difficulty: LibraryDifficultyFilter;
  availability: LibraryAvailabilityFilter;
  readingLevel?: "all" | 1 | 2 | 3 | 4;
  language?: "all" | "en" | "hi";
};

export type ReaderTheme = "paper" | "night" | "mist";

export type ReaderPreferences = {
  theme: ReaderTheme;
  fontSize: number;
  mode?: "pages" | "scroll";
};

export type ReaderChapter = {
  id: string;
  title: string;
  paragraphs: string[];
  illustration?: string;
};

export type GutenbergLicense = {
  requiredNotice: string;
  fullText: string;
  licenseUrl: string;
  originalFormatUrl: string;
};

export type ReaderBookContent = {
  title: string;
  author: string;
  language: string;
  sourceLabel: string;
  sourceUrl: string;
  rights: string;
  gutenbergLicense?: GutenbergLicense;
  sourceKind?: "gutenberg" | "vidya-original";
  titleHindi?: string;
  publicationStatus?: "draft" | "published";
  review?: Record<string, string>;
  translations?: { hi: { title: string; chapters: ReaderChapter[] } };
  chapters: ReaderChapter[];
};

export type SafeReaderPosition = Pick<ReadingProgress, "chapterIndex" | "scrollProgress">;

export const GUTENBERG_LICENSE_URL = "https://www.gutenberg.org/policy/license.html";
export const GUTENBERG_REQUIRED_NOTICE = "This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg License included with this eBook or online at www.gutenberg.org. If you are not located in the United States, you will have to check the laws of the country where you are located before using this eBook.";

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  theme: "paper",
  fontSize: 19,
};

export const READER_PREFERENCES_STORAGE_KEY = "vidya-reader-preferences-v1";

const READER_THEMES = new Set<ReaderTheme>(["paper", "night", "mist"]);
const MIN_READER_FONT_SIZE = 15;
const MAX_READER_FONT_SIZE = 25;

function searchableText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();
}

export function bookAvailability(book: Book): Exclude<LibraryAvailabilityFilter, "all"> {
  if (book.readerPath) return "in-app";
  if (book.link) return "online";
  return "catalog";
}

export function filterLibrary(books: readonly Book[], filters: LibraryFilters): Book[] {
  const query = searchableText(filters.query);

  return books.filter((book) => {
    if (book.publicationStatus === "draft") return false;
    if (filters.readingLevel && filters.readingLevel !== "all" && book.readingLevel !== filters.readingLevel) return false;
    if (filters.language && filters.language !== "all" && !(book.languages ?? [book.region === "hindi" ? "hi" : "en"]).includes(filters.language)) return false;
    if (filters.difficulty !== "all" && book.difficulty !== filters.difficulty) return false;
    if (filters.availability !== "all" && bookAvailability(book) !== filters.availability) return false;
    if (!query) return true;

    return searchableText(`${book.title} ${book.titleHindi ?? ""} ${book.author} ${book.blurb}`).includes(query);
  });
}

function clampFontSize(value: number): number {
  return Math.min(Math.max(value, MIN_READER_FONT_SIZE), MAX_READER_FONT_SIZE);
}

export function parseReaderPreferences(raw: string | null): ReaderPreferences {
  if (!raw) return DEFAULT_READER_PREFERENCES;

  try {
    const value = JSON.parse(raw) as Partial<ReaderPreferences>;
    const theme = typeof value.theme === "string" && READER_THEMES.has(value.theme as ReaderTheme)
      ? value.theme as ReaderTheme
      : DEFAULT_READER_PREFERENCES.theme;
    const fontSize = typeof value.fontSize === "number" && Number.isFinite(value.fontSize)
      ? clampFontSize(value.fontSize)
      : DEFAULT_READER_PREFERENCES.fontSize;

    return { theme, fontSize, ...(value.mode === "pages" || value.mode === "scroll" ? { mode: value.mode } : {}) };
  } catch {
    return DEFAULT_READER_PREFERENCES;
  }
}

export function safeReaderPosition(progress: unknown, chapterCount: number): SafeReaderPosition {
  const value = progress && typeof progress === "object"
    ? progress as Record<string, unknown>
    : {};
  const safeChapterCount = Number.isInteger(chapterCount) && chapterCount > 0 ? chapterCount : 1;
  const rawChapterIndex = Number.isInteger(value.chapterIndex) ? value.chapterIndex as number : 0;
  const rawScrollProgress = typeof value.scrollProgress === "number" && Number.isFinite(value.scrollProgress)
    ? value.scrollProgress
    : 0;

  return {
    chapterIndex: Math.min(Math.max(rawChapterIndex, 0), safeChapterCount - 1),
    scrollProgress: Math.min(Math.max(rawScrollProgress, 0), 1),
  };
}

function isGutenbergHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.gutenberg.org";
  } catch {
    return false;
  }
}

export function isValidReaderBook(value: unknown): value is ReaderBookContent {
  if (!value || typeof value !== "object") return false;
  const book = value as Partial<ReaderBookContent>;
  const chapters = book.chapters;
  if (![book.title, book.author, book.language, book.sourceLabel, book.rights].every(text => typeof text === "string" && text.trim()) || !Array.isArray(chapters) || !chapters.length) return false;
  const ids = new Set<string>();
  const validChapters = (items: ReaderChapter[]) => items.every(chapter => {
    if (!chapter || typeof chapter.id !== "string" || !chapter.id || ids.has(chapter.id) || typeof chapter.title !== "string" || !chapter.title.trim() || !Array.isArray(chapter.paragraphs) || !chapter.paragraphs.length || !chapter.paragraphs.every(text => typeof text === "string" && text.trim())) return false;
    if (chapter.illustration && !/^\/books\/vidya\/[a-z0-9-]+\.svg$/.test(chapter.illustration)) return false;
    ids.add(chapter.id); return true;
  });
  if (!validChapters(chapters)) return false;
  if (book.sourceKind === "vidya-original") {
    if (book.sourceUrl !== "https://vidyagyan.study/mission" || !book.review || !["draft", "published"].includes(book.publicationStatus ?? "") ||
      !["authorship", "factual", "developmental", "language", "accessibility", "rights", "limitations"].every(key => typeof book.review?.[key] === "string" && book.review[key].trim())) return false;
    const hindi = book.translations?.hi;
    if (!hindi || typeof hindi.title !== "string" || !hindi.title.trim() || !Array.isArray(hindi.chapters) || hindi.chapters.length !== chapters.length) return false;
    ids.clear();
    return validChapters(hindi.chapters) && hindi.chapters.every((chapter, index) => chapter.id === chapters[index].id && chapter.paragraphs.length === chapters[index].paragraphs.length);
  }
  const license = book.gutenbergLicense;
  return !!(book.sourceLabel!.includes("Project Gutenberg") && isGutenbergHttpsUrl(book.sourceUrl) && license &&
    license.requiredNotice === GUTENBERG_REQUIRED_NOTICE && license.licenseUrl === GUTENBERG_LICENSE_URL &&
    isGutenbergHttpsUrl(license.originalFormatUrl) && typeof license.fullText === "string" &&
    license.fullText.startsWith("START: FULL LICENSE") && license.fullText.includes("THE FULL PROJECT GUTENBERG"));
}

export function speechLanguageTag(language: string): string {
  const normalized = language.trim().toLocaleLowerCase();
  if (normalized === "hindi" || normalized.startsWith("hi")) return "hi-IN";
  if (normalized === "marathi" || normalized.startsWith("mr")) return "mr-IN";
  if (normalized === "english" || normalized.startsWith("en")) return "en-IN";
  return "en-IN";
}

export function speechErrorMessage(error: string): string {
  return error === "canceled" || error === "interrupted"
    ? "Read aloud stopped"
    : "Read aloud could not continue on this device";
}

export function speechChunks(texts: readonly string[], maxLength = 260): string[] {
  const safeLimit = Math.max(80, Math.floor(maxLength));
  const chunks: string[] = [];

  texts.forEach((text) => {
    let remaining = text.replace(/\s+/g, " ").trim();
    while (remaining.length > safeLimit) {
      const window = remaining.slice(0, safeLimit + 1);
      const sentenceBreak = Math.max(
        window.lastIndexOf(". "),
        window.lastIndexOf("? "),
        window.lastIndexOf("! "),
      );
      const wordBreak = window.lastIndexOf(" ");
      const cutAt = sentenceBreak >= safeLimit * 0.45
        ? sentenceBreak + 1
        : wordBreak > 0
          ? wordBreak
          : safeLimit;
      chunks.push(remaining.slice(0, cutAt).trim());
      remaining = remaining.slice(cutAt).trim();
    }
    if (remaining) chunks.push(remaining);
  });

  return chunks;
}

/** Stable paragraph anchors survive font size, language and layout changes. */
export function safeParagraphPosition(progress: unknown, paragraphCount: number) {
  const value = progress && typeof progress === "object" ? progress as Record<string, unknown> : {};
  const count = Math.max(1, Math.floor(paragraphCount));
  const legacy = typeof value.scrollProgress === "number" && Number.isFinite(value.scrollProgress) ? Math.min(1, Math.max(0, value.scrollProgress)) : 0;
  const raw = Number.isInteger(value.paragraphIndex) ? value.paragraphIndex as number : Math.floor(legacy * Math.max(0, count - 1));
  return { paragraphIndex: Math.min(count - 1, Math.max(0, raw)), paragraphOffset: typeof value.paragraphOffset === "number" && Number.isFinite(value.paragraphOffset) ? Math.min(1, Math.max(0, value.paragraphOffset)) : 0 };
}
