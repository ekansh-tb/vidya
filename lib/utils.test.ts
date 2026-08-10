import { describe, it, expect, vi, afterEach } from "vitest";
import { todayKey, daysBetween } from "./utils";

/** Freezes the clock at a UTC instant; the local reading depends on TZ. */
function at(iso: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("todayKey", () => {
  it("returns the local calendar date, not the UTC one", () => {
    at("2026-08-11T10:30:00Z");
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
    expect(todayKey()).toBe(expected);
  });

  it("is zero-padded and matches YYYY-MM-DD", () => {
    at("2026-01-05T12:00:00Z");
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  // The bug this file exists for: the learners are in India, and between 00:00
  // and 05:30 IST the UTC date is still the previous day. Running the same
  // assertion under TZ=Asia/Kolkata is what actually pins the regression, so
  // the check is skipped when the suite runs in another zone.
  it("reports the new day during the IST midnight window", () => {
    const istOffsetMinutes = -new Date("2026-08-11T00:00:00Z").getTimezoneOffset();
    if (istOffsetMinutes !== 330) return; // not running under IST
    // 19:00Z on the 10th is 00:30 IST on the 11th.
    at("2026-08-10T19:00:00Z");
    expect(todayKey()).toBe("2026-08-11");
    expect(new Date().toISOString().slice(0, 10)).toBe("2026-08-10");
  });

  it("advances by exactly one day across a local midnight", () => {
    at("2026-08-11T12:00:00Z");
    const before = todayKey();
    at("2026-08-12T12:00:00Z");
    const after = todayKey();
    expect(daysBetween(before, after)).toBe(1);
  });
});

describe("daysBetween", () => {
  it("counts whole days forward", () => {
    expect(daysBetween("2026-08-11", "2026-08-12")).toBe(1);
    expect(daysBetween("2026-08-11", "2026-08-11")).toBe(0);
    expect(daysBetween("2026-08-11", "2026-08-18")).toBe(7);
  });

  it("goes negative when the second key is earlier", () => {
    expect(daysBetween("2026-08-12", "2026-08-11")).toBe(-1);
  });

  it("crosses a month boundary", () => {
    expect(daysBetween("2026-08-31", "2026-09-01")).toBe(1);
    expect(daysBetween("2026-01-31", "2026-02-01")).toBe(1);
    // 2028 is a leap year, so February has 29 days.
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(daysBetween("2026-02-28", "2026-03-01")).toBe(1);
  });

  it("crosses a year boundary", () => {
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetween("2025-12-30", "2026-01-02")).toBe(3);
  });

  it("stays exact across a DST shift", () => {
    // US spring-forward (2026-03-08) and fall-back (2026-11-01): local
    // midnights are 23h and 25h apart, which would round wrong if the keys
    // were compared as local times.
    expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2);
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
  });

  it("still reads a key left over from the old UTC behaviour", () => {
    // Worst case east of UTC: the stored key is the previous local day.
    expect(daysBetween("2026-08-10", "2026-08-11")).toBe(1);
    // Worst case west of UTC: the stored key is one day ahead. It must not
    // throw; a negative result simply means "not a missed day".
    expect(daysBetween("2026-08-12", "2026-08-11")).toBe(-1);
  });

  it("falls back to 0 on an unreadable key rather than NaN", () => {
    expect(daysBetween("", "2026-08-11")).toBe(0);
    expect(daysBetween("2026-08-11", "not-a-date")).toBe(0);
  });

  it("accepts a full ISO timestamp as a key", () => {
    expect(daysBetween("2026-08-11T00:00:00.000Z", "2026-08-12")).toBe(1);
  });
});
