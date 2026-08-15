import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "public", "books");

const sources = {
  indian: {
    title: "Indian Fairy Tales",
    author: "Joseph Jacobs",
    textUrl: "https://www.gutenberg.org/cache/epub/7128/pg7128.txt",
    sourceUrl: "https://www.gutenberg.org/ebooks/7128",
    sourceLabel: "Project Gutenberg ebook #7128",
    output: "indian-fairy-tales.json",
  },
  verses: {
    title: "A Child's Garden of Verses",
    author: "Robert Louis Stevenson",
    textUrl: "https://www.gutenberg.org/cache/epub/25609/pg25609.txt",
    sourceUrl: "https://www.gutenberg.org/ebooks/25609",
    sourceLabel: "Project Gutenberg ebook #25609",
    output: "a-childs-garden-of-verses.json",
  },
  wind: {
    title: "The Wind in the Willows",
    author: "Kenneth Grahame",
    textUrl: "https://www.gutenberg.org/cache/epub/27805/pg27805.txt",
    sourceUrl: "https://www.gutenberg.org/ebooks/27805",
    sourceLabel: "Project Gutenberg ebook #27805",
    output: "the-wind-in-the-willows.json",
  },
};

const rights = "Public domain in the USA. Readers elsewhere should check local law.";

function normaliseSource(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .replaceAll("\u2014", "--")
    .replaceAll("\u00a0", " ");
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toParagraphs(text) {
  return text
    .split(/\n\s*\n+/)
    .map((block) => block.split("\n").filter((line) => !/^\s*\[Illustration/i.test(line)))
    .filter((lines) => lines.length && !lines.some((line) => /^\s*\*\s*\*\s*\*/.test(line)))
    .map((lines) => {
      const verse = lines.every((line) => !line.trim() || /^\s{2,}\S/.test(line));
      const value = verse
        ? lines.map((line) => line.trimEnd()).join("\n").trim()
        : lines.map((line) => line.trim()).join(" ");
      return value.replaceAll("_", "").replace(/\s+\[Pg\s+\d+\]/g, "").trim();
    })
    .filter(Boolean);
}

function lineOffsets(text) {
  const lines = text.split("\n");
  const offsets = [];
  let offset = 0;
  for (const line of lines) {
    offsets.push(offset);
    offset += line.length + 1;
  }
  return { lines, offsets };
}

function normaliseHeading(value) {
  return value.trim().replace(/[.]$/, "").replace(/\s+/g, " ").toLowerCase();
}

function chaptersFromNamedHeadings(text, titles, startAt = 0) {
  const { lines, offsets } = lineOffsets(text);
  const matches = [];
  let lineIndex = 0;

  for (const title of titles) {
    const target = normaliseHeading(title);
    let found = -1;
    for (; lineIndex < lines.length; lineIndex += 1) {
      if (offsets[lineIndex] < startAt) continue;
      if (normaliseHeading(lines[lineIndex]) === target) {
        found = lineIndex;
        lineIndex += 1;
        break;
      }
    }
    if (found === -1) throw new Error(`Could not find chapter heading: ${title}`);
    matches.push({ title, line: found });
  }

  return matches.map((match, index) => {
    const bodyStart = offsets[match.line] + lines[match.line].length + 1;
    const bodyEnd = index + 1 < matches.length
      ? offsets[matches[index + 1].line]
      : text.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK", bodyStart);
    return {
      id: `${String(index + 1).padStart(2, "0")}-${slug(match.title)}`,
      title: match.title,
      paragraphs: toParagraphs(text.slice(bodyStart, bodyEnd)),
    };
  });
}

function parseIndianFairyTales(text) {
  const titles = [
    "The Lion and the Crane",
    "How the Raja's Son won the Princess Labam",
    "The Lambikin",
    "Punchkin",
    "The Broken Pot",
    "The Magic Fiddle",
    "The Cruel Crane Outwitted",
    "Loving Laili",
    "The Tiger, the Brahman, and the Jackal",
    "The Soothsayer's Son",
    "Harisarman",
    "The Charmed Ring",
    "The Talkative Tortoise",
    "A Lac of Rupees for a Bit of Advice",
    "The Gold-Giving Serpent",
    "The Son of Seven Queens",
    "A Lesson for Kings",
    "Pride Goeth Before a Fall",
    "Raja Rasalu",
    "The Ass in the Lion's Skin",
    "The Farmer and the Money-Lender",
    "The Boy Who Had a Moon on his Forehead and a Star on his Chin",
    "The Prince and the Fakir",
    "Why the Fish Laughed",
    "The Demon with the Matted Hair",
    "The Ivory City and its Fairy Princess",
    "How Sun, Moon, and Wind went out to Dinner",
    "How the Wicked Sons were Duped",
    "The Pigeon and the Crow",
    "Notes and References",
  ];
  const startAt = text.indexOf("The Lion and the Crane", text.indexOf("Contents") + 1);
  const chapters = chaptersFromNamedHeadings(text, titles, startAt);
  const prefaceHeading = text.indexOf("\nPreface\n");
  const prefaceStart = prefaceHeading + "\nPreface\n".length;
  const prefaceEnd = text.indexOf("\nContents\n", prefaceStart);
  return [{
    id: "00-preface",
    title: "Preface",
    paragraphs: toParagraphs(text.slice(prefaceStart, prefaceEnd)),
  }, ...chapters];
}

function parseWindInTheWillows(text) {
  const titles = [
    "The River Bank",
    "The Open Road",
    "The Wild Wood",
    "Mr. Badger",
    "Dulce Domum",
    "Mr. Toad",
    "The Piper at the Gates of Dawn",
    "Toad's Adventures",
    "Wayfarers All",
    "The Further Adventures of Toad",
    '"Like Summer Tempests Came His Tears"',
    "The Return of Ulysses",
  ];
  const startAt = text.indexOf("\nI\n\nTHE RIVER BANK");
  return chaptersFromNamedHeadings(text, titles, startAt);
}

function parseVerses(text) {
  const start = text.indexOf("\nBED IN SUMMER\n", text.indexOf("CONTENTS"));
  const end = text.indexOf("\nTHE SCRIBNER ILLUSTRATED CLASSICS\n", start);
  const sectionTitles = new Set(["THE CHILD ALONE", "GARDEN DAYS", "ENVOYS"]);
  const excerpt = text.slice(start, end);
  const { lines, offsets } = lineOffsets(excerpt);
  const headings = [];

  for (let index = 0; index < lines.length; index += 1) {
    const title = lines[index].trim();
    if (!title || title.length > 70 || !/^[A-Z][A-Z0-9 ',?-]+$/.test(title)) continue;
    const previousBlank = index === 0 || !lines[index - 1].trim();
    const nextBlank = index === lines.length - 1 || !lines[index + 1].trim();
    if (previousBlank && nextBlank) headings.push({ title, line: index, offset: offsets[index] });
  }

  const chapters = headings
    .map((heading, index) => {
      const next = headings[index + 1];
      const bodyStart = heading.offset + lines[heading.line].length + 1;
      const bodyEnd = next?.offset ?? excerpt.length;
      return {
        id: `${String(index + 1).padStart(2, "0")}-${slug(heading.title)}`,
        title: heading.title.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bAnd\b/g, "and"),
        paragraphs: toParagraphs(excerpt.slice(bodyStart, bodyEnd)),
      };
    })
    .filter((chapter) => !sectionTitles.has(chapter.title.toUpperCase()) && chapter.paragraphs.length);
  const dedicationHeading = text.indexOf("\nTO ALISON CUNNINGHAM\n");
  const dedicationStart = text.indexOf("\n", text.indexOf("FROM HER BOY", dedicationHeading)) + 1;
  const dedicationEnd = text.indexOf("\nTHE ORIGINAL\n", dedicationStart);
  return [{
    id: "00-to-alison-cunningham",
    title: "To Alison Cunningham",
    paragraphs: toParagraphs(text.slice(dedicationStart, dedicationEnd)),
  }, ...chapters];
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${url}: ${response.status}`);
  return normaliseSource(await response.text());
}

async function writeBook(source, chapters) {
  const book = {
    title: source.title,
    author: source.author,
    language: "English",
    sourceLabel: source.sourceLabel,
    sourceUrl: source.sourceUrl,
    rights,
    chapters,
  };
  await writeFile(join(outputDirectory, source.output), `${JSON.stringify(book)}\n`, "utf8");
}

await mkdir(outputDirectory, { recursive: true });

const [indianText, versesText, windText] = await Promise.all([
  fetchText(sources.indian.textUrl),
  fetchText(sources.verses.textUrl),
  fetchText(sources.wind.textUrl),
]);

await Promise.all([
  writeBook(sources.indian, parseIndianFairyTales(indianText)),
  writeBook(sources.verses, parseVerses(versesText)),
  writeBook(sources.wind, parseWindInTheWillows(windText)),
]);

console.log("Built 3 complete library books in public/books.");
