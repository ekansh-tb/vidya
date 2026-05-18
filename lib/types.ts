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
  | "results";

export type ViewState = { name: ViewName; params?: Record<string, unknown> };

export type QuizMode = "topic" | "daily";

export type WrongAnswer = {
  q: string;
  given: string;
  correct: string;
  ex: string;
  isDeva?: boolean;
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
