import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "./destinations";
import { LIBRARY, LIBRARY_REGIONS } from "./library";
import { isValidReaderBook, GUTENBERG_REQUIRED_NOTICE, type ReaderBookContent } from "./library-utils";

describe("field-trip media", () => {
  it("uses attributed local artwork for every destination", () => {
    for (const destination of DESTINATIONS) {
      expect(destination.imageUrl, destination.name).toMatch(/^\/field-trips\//);
      expect(
        existsSync(join(process.cwd(), "public", destination.imageUrl.slice(1))),
        `${destination.name} image is missing from public`,
      ).toBe(true);
      expect(destination.imageCredit, `${destination.name} credit`).toBeTruthy();
      expect(destination.imageSourceUrl, `${destination.name} source`).toMatch(
        /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
      );
    }
  });
});

describe("library shelves", () => {
  it("fills every two-column shelf with complete rows", () => {
    for (const region of LIBRARY_REGIONS) {
      const books = LIBRARY.filter((book) => book.region === region.id);
      expect(books.length, `${region.label} needs at least one full row`).toBeGreaterThanOrEqual(2);
      expect(books.length, `${region.label} has an empty grid slot`).toBe(2 * Math.floor(books.length / 2));
    }
  });

  it("keeps book ids unique so reading progress remains stable", () => {
    expect(new Set(LIBRARY.map((book) => book.id)).size).toBe(LIBRARY.length);
  });

  it("ships complete, sourced chapter data for every in-app book", () => {
    const readableBooks = LIBRARY.filter((book) => book.readerPath);
    const minimumWords: Record<string, number> = {
      panchatantra: 65_000,
      "wind-willows": 55_000,
      "childs-garden-verses": 7_000,
    };
    expect(readableBooks.length).toBe(27);
    const originals = readableBooks.filter(book => book.readerPath?.startsWith("/books/vidya/"));
    expect(originals).toHaveLength(24);
    for (const level of [1, 2, 3, 4]) expect(originals.filter(book => book.readingLevel === level)).toHaveLength(6);
    expect(originals.filter(book => book.earlyYearsEligible === true)).toHaveLength(6);

    for (const book of readableBooks) {
      const assetPath = join(process.cwd(), "public", book.readerPath!.slice(1));
      expect(existsSync(assetPath), `${book.title} reader file is missing`).toBe(true);

      const content = JSON.parse(readFileSync(assetPath, "utf8")) as ReaderBookContent;
      expect(isValidReaderBook(content), `${book.title} reader contract`).toBe(true);
      expect(content.title).toBe(book.title);
      expect(content.author).toBe(book.author);
      if (content.sourceKind === "vidya-original") {
        expect(content.sourceUrl).toBe("https://vidyagyan.study/mission");
        expect(content.rights).toContain("Original AI-authored text");
        expect(content.publicationStatus).toBe("published");
        expect(content.review?.authorship).toContain("AI-authored");
        for (const check of ["factual", "developmental", "language", "accessibility", "rights"] as const) expect(content.review?.[check]).toBeTruthy();
        expect(content.review?.limitations).toContain("No independent");
        expect(book.languages).toEqual(["en", "hi"]);
        expect(book.readingLevel).toBeGreaterThanOrEqual(1);
        expect(book.readingLevel).toBeLessThanOrEqual(4);
        expect(content.translations?.hi.chapters.map(chapter => [chapter.id, chapter.paragraphs.length])).toEqual(content.chapters.map(chapter => [chapter.id, chapter.paragraphs.length]));
        expect(existsSync(join(process.cwd(), "public", book.coverImage!.slice(1)))).toBe(true);
      } else {
        expect(content.sourceUrl).toMatch(/^https:\/\/www\.gutenberg\.org\/ebooks\/\d+$/);
        expect(content.rights).toContain("Public domain");
        expect(content.gutenbergLicense?.requiredNotice).toBe(GUTENBERG_REQUIRED_NOTICE);
        expect(content.gutenbergLicense?.fullText.length).toBeGreaterThan(10_000);
        expect(content.chapters?.length, `${book.title} needs navigable chapters`).toBeGreaterThan(5);
      }
      expect(content.chapters?.length, `${book.title} chapter count is stale`).toBe(book.chapterCount);
      expect(
        new Set(content.chapters?.map((chapter) => chapter.id)).size,
        `${book.title} chapter ids must be unique`,
      ).toBe(content.chapters?.length);
      expect(
        content.chapters?.every((chapter) => chapter.title && chapter.paragraphs?.length),
        `${book.title} has an empty chapter`,
      ).toBe(true);
      const wordCount = content.chapters
        ?.flatMap((chapter) => chapter.paragraphs || [])
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length || 0;
      if (content.sourceKind !== "vidya-original") expect(wordCount, `${book.title} appears to be truncated`).toBeGreaterThan(minimumWords[book.id]);
      else expect(wordCount).toBeGreaterThan(20);
    }
  });
});
