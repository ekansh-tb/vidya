export const TUTOR_POLICY_LIMITS = {
  dailyTurns: { min: 1, max: 60, default: 60 },
  maxOutputTokens: { min: 128, max: 900, default: 900 },
} as const;

export function isTutorDailyTurnLimit(value: unknown): value is number {
  return Number.isInteger(value)
    && Number(value) >= TUTOR_POLICY_LIMITS.dailyTurns.min
    && Number(value) <= TUTOR_POLICY_LIMITS.dailyTurns.max;
}

export function isTutorMaxOutputTokens(value: unknown): value is number {
  return Number.isInteger(value)
    && Number(value) >= TUTOR_POLICY_LIMITS.maxOutputTokens.min
    && Number(value) <= TUTOR_POLICY_LIMITS.maxOutputTokens.max;
}

export function isTutorModelId(value: unknown): value is string {
  return typeof value === "string"
    && !value.includes("://")
    && /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,159}$/.test(value);
}
