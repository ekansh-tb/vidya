import type { Badge } from "../types";

export const BADGES: Badge[] = [
  { id: "first-steps", name: "First Steps", desc: "Complete your first quiz", icon: "🌱", tier: "bronze" },
  { id: "perfect-score", name: "Flawless", desc: "Get 100% on any quiz", icon: "💯", tier: "gold" },
  { id: "streak-7", name: "Week Warrior", desc: "7-day learning streak", icon: "🔥", tier: "silver" },
  { id: "streak-30", name: "Month Master", desc: "30-day learning streak", icon: "🏔️", tier: "gold" },
  { id: "questions-50", name: "Curious", desc: "Answer 50 questions", icon: "🤔", tier: "bronze" },
  { id: "questions-250", name: "Knowledge Seeker", desc: "Answer 250 questions", icon: "📚", tier: "silver" },
  { id: "questions-500", name: "Brain Power", desc: "Answer 500 questions", icon: "🧠", tier: "gold" },
  { id: "maths-master", name: "Maths Master", desc: "Master all Maths topics", icon: "🔢", tier: "gold" },
  { id: "science-star", name: "Science Star", desc: "Master all Science topics", icon: "🔬", tier: "gold" },
  { id: "wordsmith", name: "Wordsmith", desc: "Master all English topics", icon: "✒️", tier: "gold" },
  { id: "bhasha-premi", name: "भाषा प्रेमी", desc: "Master all Hindi topics", icon: "🪔", tier: "gold" },
  { id: "marathi-mitra", name: "मराठी मित्र", desc: "Master all Marathi topics", icon: "🚩", tier: "gold" },
  { id: "world-explorer", name: "World Explorer", desc: "Master all GK topics", icon: "🌍", tier: "gold" },
  { id: "speed-demon", name: "Speed Demon", desc: "Complete a quiz under 60s", icon: "⚡", tier: "silver" },
  { id: "comeback", name: "Comeback Kid", desc: "Get 5 right after a wrong answer", icon: "🔄", tier: "bronze" },
  { id: "daily-hero", name: "Daily Hero", desc: "Complete 7 daily quests", icon: "🌟", tier: "silver" },
  { id: "level-10", name: "Rising Star", desc: "Reach Level 10", icon: "⭐", tier: "silver" },
  { id: "level-25", name: "Scholar", desc: "Reach Level 25", icon: "🎓", tier: "gold" },
  // Move Break — earned by finishing a guided activity, never by opening one.
  { id: "first-move", name: "Off the Chair", desc: "Finish your first Move Break", icon: "⚡", tier: "bronze" },
  { id: "tumbler", name: "Tumbler", desc: "Finish a gymnastics activity", icon: "🤸", tier: "silver" },
  { id: "steady", name: "Steady", desc: "Finish a balance activity without stopping", icon: "🩰", tier: "silver" },
  { id: "move-10", name: "Never Still", desc: "Finish 10 Move Breaks", icon: "🔥", tier: "gold" },
];

export const BADGE_MAP: Record<string, Badge> = Object.fromEntries(
  BADGES.map((b) => [b.id, b]),
);

export const TIER_STYLES = {
  bronze: { gradient: "from-orange-300 to-amber-500", ring: "ring-amber-400", glow: "shadow-amber-500/40" },
  silver: { gradient: "from-slate-200 to-slate-400", ring: "ring-slate-300", glow: "shadow-slate-300/40" },
  gold: { gradient: "from-amber-300 via-yellow-400 to-orange-500", ring: "ring-yellow-400", glow: "shadow-yellow-500/50" },
};
