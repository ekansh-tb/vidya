import type { LucideIcon } from "lucide-react";

export type SubjectId =
  // Cambridge Primary (Grade 5) — existing
  | "maths" | "science" | "english" | "hindi" | "marathi" | "gk"
  // Cambridge Lower Secondary (Grades 6–8 = Stages 7–9) — added v5.
  // CNS Amanora maps Cambridge Primary to Grades 1–5 and Cambridge Lower
  // Secondary to Grades 6–8, so a Grade 6 learner sits at Stage 7.
  | "cls-english" | "cls-maths" | "cls-science" | "cls-history" | "cls-geography"
  | "cls-globalperspectives" | "cls-ict" | "cls-art"
  | "cls-hindi" | "cls-french" | "cls-spanish" | "cls-marathi"
  // Timetabled at CNS Amanora in Grades 6–7 but previously unmodelled, so a
  // learner could not see them at all. PE and Music are real Cambridge Lower
  // Secondary frameworks (0081, 0078); Hobby is a CNS timetable slot with no
  // framework behind it.
  | "cls-pe" | "cls-music" | "cls-hobby"
  // Grade 8 (Stage 9) splits combined Science into the three sciences
  | "cls-physics" | "cls-chemistry" | "cls-biology"
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

/** One unit of a school's own scheme of work, as read off a document the
 *  parent uploaded. Deliberately structural (no import from lib/content) so
 *  types.ts stays at the bottom of the dependency graph. */
export type LearnerSyllabusTopic = {
  id: string;
  title: string;
  blurb: string;
  syllabus: string[];
  /** Term label if the document assigns one, e.g. "Term 1". */
  term?: string;
};

/** A school scheme of work attached to ONE learner, parsed from a document and
 *  accepted by a parent. Never shared between learners — see the
 *  strict-isolation rule. Only the parent surface can write it. */
export type LearnerSyllabus = {
  /** As printed on the document, e.g. "2026-27". */
  academicYear: string;
  /** What the parent uploaded, for their own audit trail. */
  sourceLabel: string;
  /** ISO timestamp the parent accepted the extraction. */
  uploadedAt: string;
  subjects: Partial<Record<SubjectId, {
    topics: LearnerSyllabusTopic[];
    textbooks?: string[];
  }>>;
};

export type Board =
  | "cambridge-primary"
  | "cambridge-lower-secondary"
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
  /** The school's own scheme of work, uploaded and accepted by a parent on the
   *  Clerk-gated /parent surface. Replaces the exam packs' generic content
   *  topics for this learner only. See lib/content/school-syllabus.ts. */
  schoolSyllabus?: LearnerSyllabus;
  /** 4-digit local PIN guarding the in-kid-app parent room. A speed bump that
   *  keeps a younger sibling out of the analytics screen — nothing more. It
   *  used to grant verification rung 2 (and therefore the AI tutor), which a
   *  child could self-award; see computeRung in lib/capabilities/use-capability. */
  parentPin?: string;
  /** Read-only mirror of `learners.verification_level` from the server, written
   *  when this device links to a real account. The ONLY source of a rung above
   *  0. Absent means anonymous device-local play. */
  verifiedLevel?: 0 | 1 | 2 | 3;
  /** Server learner id, once linked. Enables state sync. */
  remoteId?: string;
  /** Credential minted when a claim code was redeemed on THIS device. Stands in
   *  for a session because the child has no login — see redeemClaimCode. It is
   *  per-device and per-learner, so two siblings on one browser each hold their
   *  own, and a parent can revoke it from the dashboard. Never leaves this
   *  profile except as the x-vidya-device header on a sync request. */
  deviceToken?: string;
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
  /** Books that have EVER paid out XP/coins. Separate from `readBooks` so
   *  un-marking and re-marking a book cannot farm rewards. */
  rewardedBooks?: string[];
  savedMelody: number[] | null;
  savedCompositions: Composition[];
  classRoster: ClassMember[];
  classNotes: ClassNote[];
  buddyId: string | null;
  missedQuestions: MissedQuestion[];
  dailyReflections: DailyReflection[];
  /** Move Break activity ids finished at least once. Union-merged across
   *  devices — see lib/sync/merge.ts. */
  completedActivities?: string[];
  /** How many guided Move Breaks have been finished, ever. */
  moveBreaks?: number;
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
  | "link-account"
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
  /** Leitner box, 0..5. Absent on entries written before spaced repetition
   *  shipped, which read as box 0 — due now. See lib/spaced-repetition.ts. */
  box?: number;
  /** ISO timestamp this card is next askable. Absent means due now. */
  dueAt?: string;
  lastReviewedAt?: string;
  /** How many times it has been answered since the original miss. */
  reviews?: number;
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
