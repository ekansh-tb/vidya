// AI peer personas seeded into each learner's class roster.
// Names span common Indian backgrounds; vibes are age-appropriate.

import type { ClassMember, ClassNote } from "../types";

type PeerSeed = Omit<ClassMember, "id" | "createdAt" | "kind">;

const PEERS_PRIMARY: PeerSeed[] = [
  { name: "Diya",   avatarEmoji: "🦄", vibe: "Loves rainbows and Maths.",       seedXp: 240, weeklyXpRate: 28 },
  { name: "Kabir",  avatarEmoji: "🐯", vibe: "Always has a curious question.",   seedXp: 180, weeklyXpRate: 22 },
  { name: "Meera",  avatarEmoji: "🦚", vibe: "Reading champion of the class.",   seedXp: 300, weeklyXpRate: 30 },
  { name: "Aarav",  avatarEmoji: "🐢", vibe: "Slow and steady — never gives up.", seedXp: 150, weeklyXpRate: 20 },
  { name: "Zara",   avatarEmoji: "🦋", vibe: "First to finish, last to leave.",   seedXp: 270, weeklyXpRate: 26 },
];

const PEERS_MIDDLE: PeerSeed[] = [
  { name: "Riya",    avatarEmoji: "🌸", vibe: "Science fair regular.",            seedXp: 480, weeklyXpRate: 34 },
  { name: "Aditya",  avatarEmoji: "🦊", vibe: "Crushes geometry, hates spelling.", seedXp: 410, weeklyXpRate: 30 },
  { name: "Maya",    avatarEmoji: "🌙", vibe: "Quiet, but always tops literature.", seedXp: 520, weeklyXpRate: 36 },
  { name: "Karan",   avatarEmoji: "⚡", vibe: "Captain of the football team.",     seedXp: 360, weeklyXpRate: 24 },
  { name: "Saanvi",  avatarEmoji: "🎨", vibe: "Doodles in every margin.",          seedXp: 440, weeklyXpRate: 32 },
];

const PEERS_SENIOR: PeerSeed[] = [
  { name: "Anika",   avatarEmoji: "🦉", vibe: "Codes in three languages.",          seedXp: 680, weeklyXpRate: 38 },
  { name: "Rohan",   avatarEmoji: "🛸", vibe: "Wants to study astrophysics.",       seedXp: 590, weeklyXpRate: 32 },
  { name: "Pooja",   avatarEmoji: "🪐", vibe: "Debate club captain.",                seedXp: 720, weeklyXpRate: 40 },
  { name: "Vivaan",  avatarEmoji: "🎧", vibe: "Music producer in spare time.",        seedXp: 470, weeklyXpRate: 28 },
  { name: "Tara",    avatarEmoji: "🦅", vibe: "School topper. Also bakes brilliantly.", seedXp: 810, weeklyXpRate: 44 },
];

function pickSeeds(grade: number): PeerSeed[] {
  if (grade <= 5) return PEERS_PRIMARY;
  if (grade <= 8) return PEERS_MIDDLE;
  return PEERS_SENIOR;
}

export function seedClassRoster(grade: number, count = 5): ClassMember[] {
  const seeds = pickSeeds(grade);
  const now = new Date().toISOString();
  return seeds.slice(0, count).map((s, i) => ({
    ...s,
    id: `cm-${grade}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "ai" as const,
    createdAt: now,
  }));
}

export function seedClassNotes(grade: number, learnerFirstName: string): ClassNote[] {
  const today = new Date().toISOString();
  const board =
    grade <= 5 ? "Cambridge Primary" : grade <= 8 ? "ICSE / Cambridge" : "Cambridge IGCSE";
  return [
    {
      id: "n-1",
      authorId: "principal",
      authorName: "Principal Vidya",
      text: `Welcome to your new classroom, ${learnerFirstName || "scholar"}! Try the daily quest, take a field trip, and say hi to your classmates.`,
      createdAt: today,
      kind: "announcement",
    },
    {
      id: "n-2",
      authorId: "principal",
      authorName: "Principal Vidya",
      text: grade <= 5
        ? "This week's class goal: 500 questions across the whole class. Every question you answer counts."
        : grade <= 8
        ? "This week's class goal: 1000 XP total. Solve practice questions in Exam Prep to push the bar."
        : "This week's class goal: 5 exam-prep sessions completed. Use the syllabus tracker to mark weak chapters first.",
      createdAt: today,
      kind: "announcement",
    },
    {
      id: "n-3",
      authorId: "principal",
      authorName: "Principal Vidya",
      text: `Reminder: aligned to ${board}. Your school is what we built around. Have fun in there.`,
      createdAt: today,
      kind: "announcement",
    },
  ];
}

/** Live XP estimate for an AI peer — seed + (days since creation × daily rate). */
export function liveXpForPeer(peer: ClassMember, now: Date = new Date()): number {
  const created = new Date(peer.createdAt).getTime();
  const days = Math.max(0, (now.getTime() - created) / (1000 * 60 * 60 * 24));
  return Math.round(peer.seedXp + days * peer.weeklyXpRate);
}

/** Weekly XP — used for the rolling leaderboard. */
export function weeklyXpForPeer(peer: ClassMember): number {
  return Math.round(peer.weeklyXpRate * 7);
}

const ENCOURAGEMENTS: Record<string, string[]> = {
  ai: [
    "Want to do a Match Quest together?",
    "I'm stuck on this chapter too — let's revise.",
    "You're ahead of me on the leaderboard, well done!",
    "Anyone up for a quick quiz race?",
    "Found a cool fact in Library today.",
    "Field-trip stamp unlocked!",
    "Tomorrow's test — I'm flipping flashcards.",
    "Saw your composition in Music. Catchy!",
  ],
};

export function randomEncouragement(): string {
  const pool = ENCOURAGEMENTS.ai;
  return pool[Math.floor(Math.random() * pool.length)];
}
