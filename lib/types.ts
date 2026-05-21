import type { LucideIcon } from "lucide-react";

export type SubjectId =
  // Cambridge Primary (Grade 5) — existing
  | "maths" | "science" | "english" | "hindi" | "marathi" | "gk"
  // Cambridge IGCSE (Grade 10) — added v2
  | "igcse-maths" | "igcse-english" | "igcse-physics" | "igcse-chemistry" | "igcse-biology"
  | "igcse-cs" | "igcse-ict" | "igcse-business" | "igcse-economics" | "igcse-geography"
  | "igcse-history" | "igcse-art" | "igcse-french" | "igcse-spanish"
  | "igcse-hindi" | "igcse-marathi" | "igcse-globalperspectives"
  // ICSE Class 7 (CISCE) — added v3
  | "icse-english-lang" | "icse-english-lit" | "icse-hindi" | "icse-marathi" | "icse-sanskrit"
  | "icse-maths" | "icse-physics" | "icse-chemistry" | "icse-biology"
  | "icse-history-civics" | "icse-geography" | "icse-computer"
  // CBSE (NCERT, NCF-SE 2023) — added v4 for BVB Nagpur & other CBSE schools
  | "cbse-maths" | "cbse-english" | "cbse-hindi" | "cbse-evs"
  | "cbse-science" | "cbse-socialscience" | "cbse-sanskrit"
  | "cbse-arts" | "cbse-pe" | "cbse-vocational";

export type Board =
  | "cambridge-primary"
  | "cambridge-igcse"
  | "icse"
  | "cbse";

export type LearnerId = string;

export type ExamDate = {
  id: string;
  /** Optional subject anchor — when set, home banner deep-links into that subject's exam-prep pack. */
  subjectId?: SubjectId;
  title: string;          // e.g. "Physics — Electricity & Magnetism"
  /** ISO date YYYY-MM-DD. Time-of-day, if any, is ignored — countdown is day-grained. */
  date: string;
  notes?: string;
};

/** A short message from a parent to their kid. Persists until the kid acknowledges it. */
export type FamilyNote = {
  body: string;
  postedAt: string;       // ISO timestamp
  seenAt?: string;        // ISO timestamp; set when the kid taps "Got it"
};

export type LearnerProfile = {
  id: LearnerId;
  name: string;
  grade: number;
  board: Board;
  /** School + city — purely descriptive but threaded into AI prompts. */
  school?: string;
  city?: string;
  /** Theme override. If absent, derived from grade band. */
  themeId?: "playful" | "vivid" | "terminal";
  /** Boards that require subject selection — list of chosen subjects. */
  pickedSubjects?: SubjectId[];
  /** True once subject picker has been completed. */
  subjectsLocked?: boolean;
  /** 4-digit local PIN guarding the in-kid-app parent room. Speed bump only —
   *  real auth is the Clerk /sign-in flow. */
  parentPin?: string;
  /** Per-learner upcoming exams. Drives the home-view countdown banner. */
  upcomingExams?: ExamDate[];
  /** A note from the parent to the kid. Shown on the kid's home until acknowledged. */
  familyNote?: FamilyNote;
  /** Capability keys the parent has explicitly turned off for this learner, even
   *  if the rung otherwise allows them. See [[dynamic-guardrails]]. */
  disabledCapabilities?: string[];
  /** Free-form interest tags the kid picked during onboarding (or in profile).
   *  Threaded into AI prompts later so examples / stories / problems are
   *  drawn from worlds the kid cares about. */
  interests?: string[];
  /** Short, parent-authored prose the AI tutor reads in its system prompt.
   *  "Things to know about this kid" — accommodations, sensitivities,
   *  tone preferences, energy levels. NOT medical (medical lives at
   *  rung 3). 500-char limit so it stays as care guidance not a memoir. */
  careNote?: string;
  /** Kid-chosen tone for Miss Vidya. Threads into the AI prompt as a
   *  preference. Parent's careNote can override if it conflicts. */
  aiTone?: "gentle" | "friendly" | "direct";
  createdAt: string;
  state: GameState;
};

export type Subject = {
  id: SubjectId;
  name: string;
  tagline: string;
  gradient: string;
  accent: string;
  soft: string;
  deep: string;
  glow: string;
  icon: LucideIcon;
  isDeva?: boolean;
};

export type Question = {
  q: string;
  a: string;
  opts: string[];
  ex: string;
};

export type Topic = {
  title: string;
  icon: string;
  items: Question[];
};

export type Badge = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  tier: "bronze" | "silver" | "gold";
};

export type Avatar = {
  id: string;
  emoji: string;
  name: string;
  vibe: string;
};

export type TopicProgress = {
  attempts: number;
  correct: number;
  mastery: number;
};

export type GameState = {
  name: string;
  avatarId: string;
  customAvatar: string | null;
  xp: number;
  coins: number;
  streak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  progress: Record<string, Record<string, TopicProgress>>;
  badges: string[];
  inventory: { hint: number; fiftyFifty: number; freeze: number; doubleXp: number };
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    quizzesCompleted: number;
    dailyQuestsCompleted: number;
    fastestQuiz: number | null;
  };
  doubleXpActive: boolean;
  dailyQuest: { date: string | null; completed: boolean };
  comeback: { wasWrong: boolean; sinceWrongCorrect: number };
  seenQuestions: Record<string, Record<string, string[]>>;
  friendStreak: FriendStreak | null;
  lastQuestCorrect: number | null;
  passportStamps: string[];
  notebook: Record<string, string>;
  lastAssemblyDate: string | null;
  assemblyStreak: number;
  readBooks: string[];
  savedMelody: number[] | null;
  savedCompositions: Composition[];
  classRoster: ClassMember[];
  classNotes: ClassNote[];
  buddyId: string | null;
  missedQuestions: MissedQuestion[];
  dailyReflections: DailyReflection[];
  /** Last subject the kid opened. Used for "Pick up where you left off". */
  lastSubjectId?: SubjectId;
  lastSubjectAt?: string;
  settings: {
    sound: boolean;
    music: boolean;
    voice: boolean;
    musicVolume: number;
    sfxVolume: number;
    voiceVolume: number;
  };
  onboarded: boolean;
};

export type ClassMember = {
  id: string;
  name: string;
  kind: "ai" | "friend";
  avatarEmoji: string;
  vibe: string;
  seedXp: number;
  /** XP gained per day for liveness on the leaderboard. */
  weeklyXpRate: number;
  createdAt: string;
};

export type ClassNote = {
  id: string;
  authorId: string;            // "me" for the active learner, else ClassMember.id
  authorName: string;
  text: string;
  createdAt: string;
  kind: "announcement" | "message" | "celebration";
};

export type Composition = {
  id: string;
  name: string;
  notes: number[];
  tempoMs: number;
  createdAt: string;
};

export type FriendStreakDay = {
  date: string;
  by: "me" | "friend";
  points: number;
  note?: string;
};

export type FriendStreak = {
  friendName: string;
  code: string;
  startedOn: string;
  days: FriendStreakDay[];
};

export type ViewName =
  | "home"
  | "subject"
  | "quiz"
  | "match"
  | "friends"
  | "tutor"
  | "field-trip"
  | "assembly"
  | "notebook"
  | "library"
  | "music"
  | "wellness"
  | "exam-prep"
  | "learners"
  | "subject-picker"
  | "daily"
  | "profile"
  | "shop"
  | "parent"
  | "settings"
  | "results"
  | "review";

export type ViewState = { name: ViewName; params?: Record<string, unknown> };

export type QuizMode = "topic" | "daily";

export type WrongAnswer = {
  q: string;
  given: string;
  correct: string;
  ex: string;
  isDeva?: boolean;
};

/** A one-line end-of-day reflection the kid types about what they learned. */
export type DailyReflection = {
  date: string;          // YYYY-MM-DD
  body: string;
  savedAt: string;       // ISO timestamp
  /** When true, the parent's RecentReflections panel hides the body and shows
   *  only the date + a "[kept private]" placeholder. The cadence still counts
   *  toward wellness signals — privacy doesn't break the rhythm picture. */
  private?: boolean;
};

/** A wrong answer persisted into the learner's notebook for later review. */
export type MissedQuestion = {
  id: string;
  q: string;
  given: string;
  correct: string;
  ex: string;
  isDeva?: boolean;
  subjectId?: SubjectId;
  topicId?: string;
  missedAt: string;        // ISO timestamp
};

export type QuizResult = {
  accuracy: number;
  xpEarned: number;
  coinsEarned: number;
  elapsed: number;
  newBadges: string[];
  leveledUp: boolean;
  newLevel: number;
  oldLevel: number;
  score: { correct: number; total: number };
  subjectId?: SubjectId;
  topicId?: string;
  wrong: WrongAnswer[];
  streak: number;
  isDaily: boolean;
};
