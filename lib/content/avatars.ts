import type { Avatar } from "../types";

export const AVATARS: Avatar[] = [
  { id: "peacock", emoji: "🦚", name: "Mor", vibe: "Royal & wise" },
  { id: "owl", emoji: "🦉", name: "Hoots", vibe: "Smart & curious" },
  { id: "elephant", emoji: "🐘", name: "Gajju", vibe: "Strong memory" },
  { id: "tiger", emoji: "🐯", name: "Sher", vibe: "Bold & fierce" },
  { id: "fox", emoji: "🦊", name: "Foxy", vibe: "Quick thinker" },
  { id: "panda", emoji: "🐼", name: "Bao", vibe: "Calm & focused" },
  { id: "unicorn", emoji: "🦄", name: "Sparkle", vibe: "Magic & dreams" },
  { id: "dragon", emoji: "🐲", name: "Drago", vibe: "Brave & powerful" },
  { id: "cat", emoji: "🐱", name: "Mimi", vibe: "Curious & playful" },
  { id: "monkey", emoji: "🐵", name: "Bandar", vibe: "Clever & quick" },
  { id: "lion", emoji: "🦁", name: "Simba", vibe: "Confident leader" },
  { id: "rabbit", emoji: "🐰", name: "Bunny", vibe: "Speedy learner" },
];

export const AVATAR_MAP = Object.fromEntries(AVATARS.map((a) => [a.id, a])) as Record<string, Avatar>;
