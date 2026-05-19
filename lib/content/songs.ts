// Curated public-domain / traditional song library for the Music Room.
//
// Notes map to the 8-tone scale in components/views/music-view.tsx:
//   0=C (सा), 1=D (रे), 2=E (ग), 3=F (म), 4=G (प), 5=A (ध), 6=B (नि), 7=C' (सां)
//
// Keyboard bindings:  0=A, 1=S, 2=D, 3=F, 4=G, 5=H, 6=J, 7=K
//
// HARD RULE: only traditional / folk / classical melodies in the public
// domain. No copyrighted modern songs. Every entry below has a citable
// melody — see the `source` field per song.

export type Song = {
  id: string;
  title: string;
  tradition: string;          // "English nursery", "German classical", etc.
  difficulty: "starter" | "easy" | "medium";
  notes: number[];            // NOTE IDs 0–7 from music-view.tsx
  /** Where the melody comes from — for verification, not user-facing. */
  source: string;
  /** Optional sargam preview shown in the chip strip (deva, short). */
  sargamHint?: string;
  tags?: string[];
};

export const SONGS: Song[] = [
  {
    id: "twinkle",
    title: "Twinkle, Twinkle, Little Star",
    tradition: "English nursery",
    difficulty: "starter",
    notes: [
      0,0,4,4,5,5,4,
      3,3,2,2,1,1,0,
      4,4,3,3,2,2,1,
      4,4,3,3,2,2,1,
      0,0,4,4,5,5,4,
      3,3,2,2,1,1,0,
    ],
    source: "Traditional, melody 'Ah! vous dirai-je, maman' (1761, public domain)",
    sargamHint: "सा सा प प ध ध प · म म ग ग रे रे सा",
    tags: ["nursery", "first-song", "english"],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    tradition: "English nursery",
    difficulty: "starter",
    notes: [
      2,1,0,1,2,2,2,
      1,1,1,
      2,4,4,
      2,1,0,1,2,2,2,2,
      1,1,2,1,0,
    ],
    source: "Traditional, lyrics Sarah Josepha Hale 1830 (public domain)",
    sargamHint: "ग रे सा रे ग ग ग",
    tags: ["nursery", "first-song"],
  },
  {
    id: "hotcross",
    title: "Hot Cross Buns",
    tradition: "English nursery",
    difficulty: "starter",
    notes: [
      2,1,0,
      2,1,0,
      0,0,0,0,
      1,1,1,1,
      2,1,0,
    ],
    source: "Traditional, c.1733 (public domain)",
    sargamHint: "ग रे सा · ग रे सा",
    tags: ["nursery", "shortest", "first-song"],
  },
  {
    id: "old-macdonald",
    title: "Old MacDonald Had a Farm",
    tradition: "English / American folk",
    difficulty: "easy",
    notes: [
      0,0,0,4,5,5,4,
      2,2,1,1,0,
      4,0,0,0,4,5,5,4,
      2,2,1,1,0,
    ],
    source: "Traditional, c.1917 (public domain)",
    sargamHint: "सा सा सा प ध ध प · ग ग रे रे सा",
    tags: ["folk", "english"],
  },
  {
    id: "frere",
    title: "Frère Jacques (Are You Sleeping)",
    tradition: "French nursery (round)",
    difficulty: "easy",
    notes: [
      0,1,2,0,
      0,1,2,0,
      2,3,4,
      2,3,4,
      4,5,4,3,2,0,
      4,5,4,3,2,0,
      0,4,0,
      0,4,0,
    ],
    source: "Traditional, 18th century (public domain)",
    sargamHint: "सा रे ग सा · सा रे ग सा",
    tags: ["round", "french", "nursery"],
  },
  {
    id: "row-row",
    title: "Row, Row, Row Your Boat",
    tradition: "English / American round",
    difficulty: "easy",
    notes: [
      0,0,0,1,2,
      2,1,2,3,4,
      7,7,7,4,4,4,2,2,2,0,0,0,
      4,3,2,1,0,
    ],
    source: "Traditional, 1852 (public domain)",
    sargamHint: "सा सा सा रे ग · ग रे ग म प",
    tags: ["round", "nursery"],
  },
  {
    id: "london-bridge",
    title: "London Bridge Is Falling Down",
    tradition: "English nursery",
    difficulty: "easy",
    notes: [
      4,5,4,3,2,3,4,
      1,2,3,
      2,3,4,
      4,5,4,3,2,3,4,
      1,4,2,0,
    ],
    source: "Traditional, c.1744 (public domain)",
    sargamHint: "प ध प म ग म प",
    tags: ["nursery"],
  },
  {
    id: "saints",
    title: "When the Saints Go Marching In",
    tradition: "American gospel / jazz standard",
    difficulty: "easy",
    notes: [
      0,2,3,4,
      0,2,3,4,
      0,2,3,4,2,0,2,1,
      2,2,1,0,2,4,4,3,
      2,3,4,3,2,0,1,0,
    ],
    source: "Traditional, pre-1900 melody (public domain)",
    sargamHint: "सा ग म प · सा ग म प",
    tags: ["gospel", "march"],
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    tradition: "Beethoven, 9th Symphony (1824)",
    difficulty: "medium",
    notes: [
      2,2,3,4,4,3,2,1,
      0,0,1,2,2,1,1,
      2,2,3,4,4,3,2,1,
      0,0,1,2,1,0,0,
    ],
    source: "Beethoven, 9th Symphony 4th movement — melody public domain",
    sargamHint: "ग ग म प प म ग रे",
    tags: ["classical", "german"],
  },
  {
    id: "jingle-chorus",
    title: "Jingle Bells (chorus)",
    tradition: "American / English carol",
    difficulty: "easy",
    notes: [
      2,2,2,
      2,2,2,
      2,4,0,1,2,
      3,3,3,3,3,2,2,2,
      2,1,1,2,1,4,
    ],
    source: "James Lord Pierpont, 1857 (public domain)",
    sargamHint: "ग ग ग · ग ग ग · ग प सा रे ग",
    tags: ["carol", "winter"],
  },
];

/** Case-insensitive prefix/substring search over title + tradition + tags. */
export function searchSongs(query: string): Song[] {
  const q = query.trim().toLowerCase();
  if (!q) return SONGS;
  return SONGS.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.tradition.toLowerCase().includes(q) ||
    (s.tags || []).some((t) => t.includes(q))
  );
}
