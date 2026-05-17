// School-day rhythm — maps a wall-clock time to a current "period".
// All times are local. Weekend = free-explore mode.

export type Period = {
  id: string;
  name: string;
  emoji: string;
  start: string; // HH:MM
  end: string;   // HH:MM
  kind: "homeroom" | "subject" | "break" | "library" | "art" | "music" | "sports" | "assembly" | "prep" | "free";
  subjectId?: string; // when kind === "subject"
  cta?: string;
};

export const TIMETABLE: Period[] = [
  { id: "morning",    name: "Good morning",      emoji: "🌅", start: "06:00", end: "07:30", kind: "free",      cta: "Stretch · breakfast · read" },
  { id: "assembly",   name: "Morning assembly",  emoji: "🎙️", start: "07:30", end: "08:00", kind: "assembly",  cta: "Thought for the day" },
  { id: "p1-maths",   name: "Maths",             emoji: "🔢", start: "08:00", end: "08:45", kind: "subject", subjectId: "maths",   cta: "Today's Maths quest" },
  { id: "p2-eng",     name: "English",           emoji: "📚", start: "08:45", end: "09:30", kind: "subject", subjectId: "english", cta: "Read & write" },
  { id: "recess1",    name: "Short break",       emoji: "🥤", start: "09:30", end: "09:45", kind: "break",     cta: "Water · stretch" },
  { id: "p3-sci",     name: "Science",           emoji: "🔬", start: "09:45", end: "10:30", kind: "subject", subjectId: "science", cta: "Today's experiment" },
  { id: "p4-hin",     name: "हिंदी",             emoji: "📜", start: "10:30", end: "11:15", kind: "subject", subjectId: "hindi",   cta: "Hindi paath" },
  { id: "lunch",      name: "Lunch break",       emoji: "🍱", start: "11:15", end: "12:00", kind: "break",     cta: "Eat well · meet Diya" },
  { id: "p5-mar",     name: "मराठी",             emoji: "📖", start: "12:00", end: "12:45", kind: "subject", subjectId: "marathi", cta: "मराठीचा अभ्यास" },
  { id: "p6-gk",      name: "GK & World",        emoji: "🌍", start: "12:45", end: "13:30", kind: "subject", subjectId: "gk",      cta: "Discover the world" },
  { id: "library",    name: "Library hour",      emoji: "📚", start: "13:30", end: "14:00", kind: "library",   cta: "Pick a story" },
  { id: "art",        name: "Art studio",        emoji: "🎨", start: "14:00", end: "14:30", kind: "art",       cta: "Draw something" },
  { id: "music",      name: "Music room",        emoji: "🎵", start: "14:30", end: "15:00", kind: "music",     cta: "Make a melody" },
  { id: "sports",     name: "Sports & PE",       emoji: "⚽", start: "15:00", end: "15:30", kind: "sports",    cta: "Move your body" },
  { id: "prep",       name: "Prep hour",         emoji: "✏️", start: "15:30", end: "17:00", kind: "prep",      cta: "Revise tricky bits" },
  { id: "evening",    name: "Free hour",         emoji: "🌙", start: "17:00", end: "20:00", kind: "free",      cta: "Field trip · Match Quest" },
  { id: "wind-down",  name: "Wind-down",         emoji: "🛌", start: "20:00", end: "22:00", kind: "free",      cta: "Re-read · prepare tomorrow" },
];

function minutesFromHHMM(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

export function currentPeriod(now: Date = new Date()): Period {
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  if (isWeekend) {
    return {
      id: "weekend",
      name: "Weekend mode",
      emoji: "🌈",
      start: "00:00",
      end: "23:59",
      kind: "free",
      cta: "Pick anything — field trips & match",
    };
  }
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const p of TIMETABLE) {
    const start = minutesFromHHMM(p.start);
    const end = minutesFromHHMM(p.end);
    if (mins >= start && mins < end) return p;
  }
  return TIMETABLE[0]; // pre-dawn fallback
}

export function nextPeriod(now: Date = new Date()): Period | null {
  const cur = currentPeriod(now);
  const idx = TIMETABLE.findIndex((p) => p.id === cur.id);
  if (idx < 0 || idx >= TIMETABLE.length - 1) return null;
  return TIMETABLE[idx + 1];
}

export function periodProgress(now: Date = new Date()): number {
  const p = currentPeriod(now);
  if (p.id === "weekend") return 0;
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const start = minutesFromHHMM(p.start);
  const end = minutesFromHHMM(p.end);
  if (end <= start) return 0;
  return Math.max(0, Math.min(1, (mins - start) / (end - start)));
}
