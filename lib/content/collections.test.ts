import { existsSync } from "node:fs";
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
});
