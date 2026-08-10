import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The learner's LOCAL calendar date as `YYYY-MM-DD`.
 *
 * Deliberately not `toISOString().slice(0, 10)`: that is the UTC date, so a
 * learner in IST (UTC+5:30) would still be reported as "yesterday" between
 * 00:00 and 05:30 local time. Streaks, the daily quest, the daily reflection
 * and the assembly all reason about the learner's own day, so the key has to
 * follow the local calendar or those roll over at the wrong moment.
 */
export const todayKey = () => dayKeyOf(new Date());

/**
 * The local calendar date of an arbitrary instant, in the same `YYYY-MM-DD`
 * shape as todayKey(). Anything comparing a stored timestamp against todayKey()
 * has to derive its key this way — mixing in `toISOString().slice(0, 10)` puts
 * a UTC date next to a local one and the two disagree for part of every day.
 */
export function dayKeyOf(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Reads a `YYYY-MM-DD` day key as a fixed UTC instant. Anchoring both ends of a
 * comparison to UTC keeps the difference an exact whole number of days even
 * across a DST shift, where local midnights are 23 or 25 hours apart.
 */
function parseDayKey(key: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(key);
  if (!m) return NaN;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function daysBetween(a: string, b: string): number {
  const from = parseDayKey(a);
  const to = parseDayKey(b);
  // A key stored while todayKey() was still UTC-based can be a day off from the
  // local one (behind east of UTC, ahead west of it). That parses fine and just
  // yields ±1. An unreadable key falls back to 0 — callers read that as "same
  // day" and leave the streak alone, which is the safe direction to fail.
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.round((to - from) / 86400000);
}

export function resizeImageFile(file: File, maxSide = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unsupported"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
