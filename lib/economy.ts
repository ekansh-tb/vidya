export const XP_PER_LEVEL = (level: number) => 150 + level * 50;

export type LevelInfo = { level: number; xpInLevel: number; xpNeeded: number };

export function xpToLevel(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= XP_PER_LEVEL(level)) {
    remaining -= XP_PER_LEVEL(level);
    level++;
  }
  return { level, xpInLevel: remaining, xpNeeded: XP_PER_LEVEL(level) };
}

export const POWER_UPS = {
  hint: { name: "Hint", cost: 50 },
  fiftyFifty: { name: "50:50", cost: 75 },
  freeze: { name: "Streak Freeze", cost: 200 },
  doubleXp: { name: "Double XP", cost: 150 },
};

export function calcQuizRewards(opts: {
  correct: number;
  total: number;
  isDaily: boolean;
  doubleXp: boolean;
}) {
  const { correct, total, isDaily, doubleXp } = opts;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const baseXp = correct * 10 + (accuracy === 100 ? 50 : 0) + (isDaily ? 50 : 0);
  const xpEarned = doubleXp ? baseXp * 2 : baseXp;
  const coinsEarned = correct * 5 + (isDaily ? 25 : 0);
  return { accuracy, xpEarned, coinsEarned };
}
