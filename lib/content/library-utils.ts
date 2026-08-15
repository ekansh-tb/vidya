import type { Book } from "@/lib/content/library";
import type { ReadingProgress } from "@/lib/types";

export type LibraryDifficultyFilter = "all" | Book["difficulty"];
export type LibraryAvailabilityFilter = "all" | "in-app" | "online" | "catalog";

export type LibraryFilters = {
  query: string;
  difficulty: LibraryDifficultyFilter;
  availability: LibraryAvailabilityFilter;
};

export type ReaderTheme = "paper" | "night" | "mist";

export type ReaderPreferences = {
  theme: ReaderTheme;
  fontSize: number;
};

export type ReaderChapter = {
  id: string;
  title: string;
  paragraphs: string[];
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
  gutenbergLicense: GutenbergLicense;
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
    if (filters.difficulty !== "all" && book.difficulty !== filters.difficulty) return false;
    if (filters.availability !== "all" && bookAvailability(book) !== filters.availability) return false;
    if (!query) return true;

    return searchableText(`${book.title} ${book.author} ${book.blurb}`).includes(query);
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

    return { theme, fontSize };
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
  const license = book.gutenbergLicense as Partial<GutenbergLicense> | undefined;
  const chapters = book.chapters;
  if (
    typeof book.title !== "string" || !book.title.trim() ||
    typeof book.author !== "string" || !book.author.trim() ||
    typeof book.language !== "string" || !book.language.trim() ||
    typeof book.sourceLabel !== "string" || !book.sourceLabel.includes("Project Gutenberg") ||
    !isGutenbergHttpsUrl(book.sourceUrl) ||
    typeof book.rights !== "string" || !book.rights.trim() ||
    !license ||
    license.requiredNotice !== GUTENBERG_REQUIRED_NOTICE ||
    license.licenseUrl !== GUTENBERG_LICENSE_URL ||
    !isGutenbergHttpsUrl(license.originalFormatUrl) ||
    typeof license.fullText !== "string" ||
    !license.fullText.startsWith("START: FULL LICENSE") ||
    !license.fullText.includes("THE FULL PROJECT GUTENBERG") ||
    !Array.isArray(chapters) || chapters.length === 0
  ) {
    return false;
  }

  const chapterIds = new Set<string>();
  return chapters.every((chapter) => {
    if (
      !chapter ||
      typeof chapter.id !== "string" || !chapter.id || chapterIds.has(chapter.id) ||
      typeof chapter.title !== "string" || !chapter.title.trim() ||
      !Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0 ||
      !chapter.paragraphs.every((paragraph) => typeof paragraph === "string" && paragraph.trim().length > 0)
    ) {
      return false;
    }
    chapterIds.add(chapter.id);
    return true;
  });
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
