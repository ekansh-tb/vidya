import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "./destinations";
import { LIBRARY, LIBRARY_REGIONS } from "./library";

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
    expect(readableBooks.length).toBeGreaterThanOrEqual(3);

    for (const book of readableBooks) {
      const assetPath = join(process.cwd(), "public", book.readerPath!.slice(1));
      expect(existsSync(assetPath), `${book.title} reader file is missing`).toBe(true);

      const content = JSON.parse(readFileSync(assetPath, "utf8")) as {
        title?: string;
        author?: string;
        sourceUrl?: string;
        rights?: string;
        chapters?: Array<{ id?: string; title?: string; paragraphs?: string[] }>;
      };
      expect(content.title).toBe(book.title);
      expect(content.author).toBe(book.author);
      expect(content.sourceUrl).toMatch(/^https:\/\/www\.gutenberg\.org\/ebooks\/\d+$/);
      expect(content.rights).toContain("Public domain");
      expect(content.chapters?.length, `${book.title} needs navigable chapters`).toBeGreaterThan(5);
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
      expect(wordCount, `${book.title} appears to be truncated`).toBeGreaterThan(minimumWords[book.id]);
    }
  });
});
