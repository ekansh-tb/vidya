import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { Book } from "@/lib/content/library";
import {
  DEFAULT_READER_PREFERENCES,
  GUTENBERG_REQUIRED_NOTICE,
  bookAvailability,
  filterLibrary,
  isValidReaderBook,
  parseReaderPreferences,
  safeReaderPosition,
  speechChunks,
  speechErrorMessage,
  speechLanguageTag,
} from "@/lib/content/library-utils";

const books: Book[] = [
  {
    id: "reader",
    title: "A Garden of Stories",
    author: "Anita Writer",
    region: "indian",
    blurb: "A gentle journey through a magical garden.",
    readMinutes: 20,
    cover: "🌱",
    difficulty: "easy",
    readerPath: "/books/garden.json",
  },
  {
    id: "online",
    title: "नदी की कहानी",
    author: "कविता शर्मा",
    region: "hindi",
    blurb: "एक नदी और उसके मित्रों की कहानी।",
    readMinutes: 30,
    cover: "🌊",
    difficulty: "medium",
    link: "https://example.com/river",
  },
  {
    id: "catalog",
    title: "Space Detectives",
    author: "Sam Star",
    region: "world",
    blurb: "Solve mysteries among the planets.",
    readMinutes: 45,
    cover: "🔭",
    difficulty: "stretch",
  },
];

describe("library discovery", () => {
  it("searches title, author, and blurb without case sensitivity", () => {
    expect(filterLibrary(books, { query: "garden", difficulty: "all", availability: "all" }).map((book) => book.id)).toEqual(["reader"]);
    expect(filterLibrary(books, { query: "SAM STAR", difficulty: "all", availability: "all" }).map((book) => book.id)).toEqual(["catalog"]);
    expect(filterLibrary(books, { query: "planets", difficulty: "all", availability: "all" }).map((book) => book.id)).toEqual(["catalog"]);
  });

  it("searches scripts other than Latin", () => {
    expect(filterLibrary(books, { query: "कविता", difficulty: "all", availability: "all" }).map((book) => book.id)).toEqual(["online"]);
  });

  it("combines difficulty and availability filters", () => {
    expect(filterLibrary(books, { query: "", difficulty: "medium", availability: "online" }).map((book) => book.id)).toEqual(["online"]);
    expect(filterLibrary(books, { query: "story", difficulty: "easy", availability: "catalog" })).toEqual([]);
  });

  it("classifies availability using the action a learner can take", () => {
    expect(books.map(bookAvailability)).toEqual(["in-app", "online", "catalog"]);
  });
});

describe("reader preferences", () => {
  it("accepts valid saved preferences", () => {
    expect(parseReaderPreferences('{"theme":"mist","fontSize":23}')).toEqual({ theme: "mist", fontSize: 23 });
  });

  it("recovers safely from missing or malformed preferences", () => {
    expect(parseReaderPreferences(null)).toEqual(DEFAULT_READER_PREFERENCES);
    expect(parseReaderPreferences("not json")).toEqual(DEFAULT_READER_PREFERENCES);
  });

  it("clamps unsafe font sizes and replaces unknown themes", () => {
    expect(parseReaderPreferences('{"theme":"bright","fontSize":100}')).toEqual({ theme: "paper", fontSize: 25 });
    expect(parseReaderPreferences('{"theme":"night","fontSize":5}')).toEqual({ theme: "night", fontSize: 15 });
  });
});

describe("reader position safety", () => {
  it("clamps stale chapter and scroll positions before the reader uses them", () => {
    expect(safeReaderPosition({ chapterIndex: 99, scrollProgress: 4 }, 12)).toEqual({
      chapterIndex: 11,
      scrollProgress: 1,
    });
    expect(safeReaderPosition({ chapterIndex: -3, scrollProgress: -0.4 }, 12)).toEqual({
      chapterIndex: 0,
      scrollProgress: 0,
    });
  });

  it("replaces malformed persisted values with a safe first-page position", () => {
    expect(safeReaderPosition({ chapterIndex: 1.5, scrollProgress: Number.NaN }, 12)).toEqual({
      chapterIndex: 0,
      scrollProgress: 0,
    });
    expect(safeReaderPosition({ chapterIndex: "2", scrollProgress: "0.5" }, 12)).toEqual({
      chapterIndex: 0,
      scrollProgress: 0,
    });
    expect(safeReaderPosition(null, 0)).toEqual({ chapterIndex: 0, scrollProgress: 0 });
  });
});

describe("reader source integrity", () => {
  const readerFiles = [
    "indian-fairy-tales.json",
    "a-childs-garden-of-verses.json",
    "the-wind-in-the-willows.json",
  ];

  it.each(readerFiles)("validates source, license, chapters, and original format in %s", (fileName) => {
    const book = JSON.parse(readFileSync(resolve(process.cwd(), "public", "books", fileName), "utf8")) as unknown;
    expect(isValidReaderBook(book)).toBe(true);
    if (!isValidReaderBook(book)) return;
    expect(book.gutenbergLicense.requiredNotice).toBe(GUTENBERG_REQUIRED_NOTICE);
    expect(book.gutenbergLicense.fullText.length).toBeGreaterThan(10_000);
    expect(book.gutenbergLicense.originalFormatUrl).toMatch(/^https:\/\/www\.gutenberg\.org\/cache\/epub\//);
  });

  it("rejects a payload that detaches the required license information", () => {
    expect(isValidReaderBook({
      title: "Unlicensed copy",
      author: "Writer",
      language: "English",
      sourceLabel: "Project Gutenberg ebook #1",
      sourceUrl: "https://www.gutenberg.org/ebooks/1",
      rights: "Public domain in the USA.",
      chapters: [{ id: "one", title: "One", paragraphs: ["Text"] }],
    })).toBe(false);
  });
});

describe("reader speech helpers", () => {
  it("uses valid language tags for available reader languages", () => {
    expect(speechLanguageTag("English")).toBe("en-IN");
    expect(speechLanguageTag("Hindi")).toBe("hi-IN");
    expect(speechLanguageTag("mr")).toBe("mr-IN");
  });

  it("splits long paragraphs into short, ordered speech chunks", () => {
    const text = "The first sentence explains the setting. The second sentence introduces the learner and their question. The final sentence gives everyone time to think.";
    const chunks = speechChunks([text], 80);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 80)).toBe(true);
    expect(chunks.join(" ")).toBe(text);
  });

  it("removes empty speech chunks", () => {
    expect(speechChunks(["  ", "Ready to read? "])).toEqual(["Ready to read?"]);
  });

  it("turns current-session cancellation and interruption into an honest stopped state", () => {
    expect(speechErrorMessage("canceled")).toBe("Read aloud stopped");
    expect(speechErrorMessage("interrupted")).toBe("Read aloud stopped");
    expect(speechErrorMessage("audio-busy")).toBe("Read aloud could not continue on this device");
  });
});
