import { expect, it } from "vitest";
import { databaseTimestamp } from "./timestamp";
it("normalizes driver Date and offset timestamps for strict API contracts", () => {
  expect(databaseTimestamp(new Date("2026-10-04T03:17:18+05:30"))).toBe("2026-10-03T21:47:18.000Z");
  expect(databaseTimestamp("2026-10-04 03:17:18+05:30")).toBe("2026-10-03T21:47:18.000Z");
  for (const value of [null, undefined, 0, "garbage", new Date(NaN)]) expect(() => databaseTimestamp(value)).toThrow();
});
