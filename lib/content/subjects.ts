import {
  Calculator, FlaskConical, BookOpen, Languages, Globe2,
  Atom, Beaker, Sprout, Cpu, Monitor, Briefcase, LineChart,
  Map, Landmark, Palette, Music as MusicIcon, Dumbbell, Drama, Sparkles,
} from "lucide-react";
import type { Board, Subject, SubjectId } from "../types";

// =========================
// Cambridge Primary (Grade 5)
// =========================
export const SUBJECTS_PRIMARY: Subject[] = [
  {
    id: "maths",
    name: "Maths",
    tagline: "Numbers · shapes · logic",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    accent: "#FBBF24",
    soft: "rgba(251, 191, 36, 0.15)",
    deep: "#92400E",
    glow: "rgba(251, 191, 36, 0.5)",
    icon: Calculator,
  },
  {
    id: "science",
    name: "Science",
    tagline: "How the world works",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accent: "#10B981",
    soft: "rgba(16, 185, 129, 0.15)",
    deep: "#065F46",
    glow: "rgba(16, 185, 129, 0.5)",
    icon: FlaskConical,
  },
  {
    id: "english",
    name: "English",
    tagline: "Words · stories · ideas",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    accent: "#F472B6",
    soft: "rgba(244, 114, 182, 0.15)",
    deep: "#9F1239",
    glow: "rgba(244, 114, 182, 0.5)",
    icon: BookOpen,
  },
  {
    id: "hindi",
    name: "हिंदी",
    tagline: "भाषा का जादू",
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    accent: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.15)",
    deep: "#5B21B6",
    glow: "rgba(167, 139, 250, 0.5)",
    icon: Languages,
    isDeva: true,
  },
  {
    id: "marathi",
    name: "मराठी",
    tagline: "आपली भाषा",
    gradient: "from-orange-400 via-red-500 to-rose-500",
    accent: "#EA580C",
    soft: "rgba(234, 88, 12, 0.15)",
    deep: "#9A3412",
    glow: "rgba(234, 88, 12, 0.5)",
    icon: Languages,
    isDeva: true,
  },
  {
    id: "gk",
    name: "GK & World",
    tagline: "People · places · cosmos",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    accent: "#22D3EE",
    soft: "rgba(34, 211, 238, 0.15)",
    deep: "#075985",
    glow: "rgba(34, 211, 238, 0.5)",
    icon: Globe2,
  },
];

// =========================
// Cambridge IGCSE (Grade 9–10)
// Catalog choices do not establish a learner's school requirements.
// =========================
export const SUBJECTS_IGCSE: Subject[] = [
  // Group 1 Languages
  {
    id: "igcse-english",
    name: "English (First Language)",
    tagline: "0500 · Cambridge IGCSE",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    accent: "#F472B6",
    soft: "rgba(244, 114, 182, 0.15)",
    deep: "#9F1239",
    glow: "rgba(244, 114, 182, 0.5)",
    icon: BookOpen,
  },
  // Group 4 Maths
  {
    id: "igcse-maths",
    name: "Mathematics",
    tagline: "0607 · International Mathematics",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    accent: "#FBBF24",
    soft: "rgba(251, 191, 36, 0.15)",
    deep: "#92400E",
    glow: "rgba(251, 191, 36, 0.5)",
    icon: Calculator,
  },
  // Sciences
  {
    id: "igcse-physics",
    name: "Physics",
    tagline: "0625 · forces · waves · electricity",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    accent: "#22D3EE",
    soft: "rgba(34, 211, 238, 0.15)",
    deep: "#155E75",
    glow: "rgba(34, 211, 238, 0.5)",
    icon: Atom,
  },
  {
    id: "igcse-chemistry",
    name: "Chemistry",
    tagline: "0620 · atoms · reactions · acids",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accent: "#10B981",
    soft: "rgba(16, 185, 129, 0.15)",
    deep: "#065F46",
    glow: "rgba(16, 185, 129, 0.5)",
    icon: Beaker,
  },
  {
    id: "igcse-biology",
    name: "Biology",
    tagline: "0610 · cells · ecology · genetics",
    gradient: "from-lime-400 via-emerald-500 to-teal-500",
    accent: "#84CC16",
    soft: "rgba(132, 204, 22, 0.15)",
    deep: "#3F6212",
    glow: "rgba(132, 204, 22, 0.5)",
    icon: Sprout,
  },
  // Group 5 Creative & Professional
  {
    id: "igcse-cs",
    name: "Computer Science",
    tagline: "0478 · binary · algorithms · code",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
    accent: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.18)",
    deep: "#4C1D95",
    glow: "rgba(167, 139, 250, 0.55)",
    icon: Cpu,
  },
  {
    id: "igcse-ict",
    name: "ICT",
    tagline: "0417 · spreadsheets · web · graphics",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    accent: "#38BDF8",
    soft: "rgba(56, 189, 248, 0.15)",
    deep: "#075985",
    glow: "rgba(56, 189, 248, 0.5)",
    icon: Monitor,
  },
  {
    id: "igcse-business",
    name: "Business Studies",
    tagline: "0450 · how businesses run",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    accent: "#EAB308",
    soft: "rgba(234, 179, 8, 0.15)",
    deep: "#854D0E",
    glow: "rgba(234, 179, 8, 0.5)",
    icon: Briefcase,
  },
  {
    id: "igcse-economics",
    name: "Economics",
    tagline: "0455 · demand · supply · markets",
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    accent: "#F97316",
    soft: "rgba(249, 115, 22, 0.15)",
    deep: "#9A3412",
    glow: "rgba(249, 115, 22, 0.5)",
    icon: LineChart,
  },
  // Humanities
  {
    id: "igcse-geography",
    name: "Geography",
    tagline: "0460 · maps · climate · cities",
    gradient: "from-teal-400 via-cyan-500 to-sky-500",
    accent: "#06B6D4",
    soft: "rgba(6, 182, 212, 0.15)",
    deep: "#155E75",
    glow: "rgba(6, 182, 212, 0.5)",
    icon: Map,
  },
  {
    id: "igcse-history",
    name: "History",
    tagline: "0470 · 20th-century world",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    accent: "#D97706",
    soft: "rgba(217, 119, 6, 0.15)",
    deep: "#7C2D12",
    glow: "rgba(217, 119, 6, 0.5)",
    icon: Landmark,
  },
  {
    id: "igcse-globalperspectives",
    name: "Global Perspectives",
    tagline: "0457 · research · perspectives",
    gradient: "from-fuchsia-400 via-purple-500 to-violet-500",
    accent: "#D946EF",
    soft: "rgba(217, 70, 239, 0.15)",
    deep: "#86198F",
    glow: "rgba(217, 70, 239, 0.5)",
    icon: Globe2,
  },
  // Creative
  {
    id: "igcse-art",
    name: "Art & Design",
    tagline: "0400 · portfolio · drawing",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    accent: "#F43F5E",
    soft: "rgba(244, 63, 94, 0.15)",
    deep: "#9F1239",
    glow: "rgba(244, 63, 94, 0.5)",
    icon: Palette,
  },
  // Languages — optional
  {
    id: "igcse-french",
    name: "French",
    tagline: "0520 · foreign language",
    gradient: "from-blue-400 via-indigo-500 to-violet-500",
    accent: "#6366F1",
    soft: "rgba(99, 102, 241, 0.15)",
    deep: "#3730A3",
    glow: "rgba(99, 102, 241, 0.5)",
    icon: Languages,
  },
  {
    id: "igcse-spanish",
    name: "Spanish",
    tagline: "0530 · foreign language",
    gradient: "from-red-400 via-rose-500 to-pink-500",
    accent: "#EF4444",
    soft: "rgba(239, 68, 68, 0.15)",
    deep: "#991B1B",
    glow: "rgba(239, 68, 68, 0.5)",
    icon: Languages,
  },
  {
    id: "igcse-hindi",
    name: "हिंदी (2nd Language)",
    tagline: "0549 · second language",
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    accent: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.15)",
    deep: "#5B21B6",
    glow: "rgba(167, 139, 250, 0.5)",
    icon: Languages,
    isDeva: true,
  },
  // Additional language choice; no jurisdiction is inferred.
  {
    id: "igcse-marathi",
    name: "मराठी",
    tagline: "Aksharbharati · Marathi",
    gradient: "from-orange-400 via-red-500 to-rose-500",
    accent: "#EA580C",
    soft: "rgba(234, 88, 12, 0.15)",
    deep: "#9A3412",
    glow: "rgba(234, 88, 12, 0.5)",
    icon: Languages,
    isDeva: true,
  },
];

// =========================
// ICSE Class 7 (CISCE) catalog
// =========================
export const SUBJECTS_ICSE7: Subject[] = [
  {
    id: "icse-english-lang",
    name: "English Language",
    tagline: "Grammar · comprehension · writing",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    accent: "#F472B6",
    soft: "rgba(244, 114, 182, 0.15)",
    deep: "#9F1239",
    glow: "rgba(244, 114, 182, 0.5)",
    icon: BookOpen,
  },
  {
    id: "icse-english-lit",
    name: "English Literature",
    tagline: "Prose · poetry · drama",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    accent: "#FB7185",
    soft: "rgba(251, 113, 133, 0.15)",
    deep: "#9F1239",
    glow: "rgba(251, 113, 133, 0.5)",
    icon: BookOpen,
  },
  {
    id: "icse-hindi",
    name: "हिंदी",
    tagline: "व्याकरण · पद्य · गद्य",
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    accent: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.15)",
    deep: "#5B21B6",
    glow: "rgba(167, 139, 250, 0.5)",
    icon: Languages,
    isDeva: true,
  },
  {
    id: "icse-marathi",
    name: "मराठी",
    tagline: "बालभारती इ. ७",
    gradient: "from-orange-400 via-red-500 to-rose-500",
    accent: "#EA580C",
    soft: "rgba(234, 88, 12, 0.15)",
    deep: "#9A3412",
    glow: "rgba(234, 88, 12, 0.5)",
    icon: Languages,
    isDeva: true,
  },
  {
    id: "icse-sanskrit",
    name: "संस्कृत",
    tagline: "तृतीयभाषा",
    gradient: "from-amber-400 via-orange-500 to-yellow-500",
    accent: "#D97706",
    soft: "rgba(217, 119, 6, 0.15)",
    deep: "#92400E",
    glow: "rgba(217, 119, 6, 0.45)",
    icon: Languages,
    isDeva: true,
  },
  {
    id: "icse-maths",
    name: "Mathematics",
    tagline: "Selina · integers · algebra · geometry",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    accent: "#FBBF24",
    soft: "rgba(251, 191, 36, 0.15)",
    deep: "#92400E",
    glow: "rgba(251, 191, 36, 0.5)",
    icon: Calculator,
  },
  {
    id: "icse-physics",
    name: "Physics",
    tagline: "Motion · heat · light · sound",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    accent: "#22D3EE",
    soft: "rgba(34, 211, 238, 0.15)",
    deep: "#155E75",
    glow: "rgba(34, 211, 238, 0.5)",
    icon: Atom,
  },
  {
    id: "icse-chemistry",
    name: "Chemistry",
    tagline: "Matter · elements · acids · air & water",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accent: "#10B981",
    soft: "rgba(16, 185, 129, 0.15)",
    deep: "#065F46",
    glow: "rgba(16, 185, 129, 0.5)",
    icon: Beaker,
  },
  {
    id: "icse-biology",
    name: "Biology",
    tagline: "Tissues · photosynthesis · reproduction",
    gradient: "from-lime-400 via-emerald-500 to-teal-500",
    accent: "#84CC16",
    soft: "rgba(132, 204, 22, 0.15)",
    deep: "#3F6212",
    glow: "rgba(132, 204, 22, 0.5)",
    icon: Sprout,
  },
  {
    id: "icse-history-civics",
    name: "History & Civics",
    tagline: "Medieval India · UN · citizenship",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    accent: "#D97706",
    soft: "rgba(217, 119, 6, 0.15)",
    deep: "#7C2D12",
    glow: "rgba(217, 119, 6, 0.5)",
    icon: Landmark,
  },
  {
    id: "icse-geography",
    name: "Geography",
    tagline: "Atmosphere · climate · India",
    gradient: "from-teal-400 via-cyan-500 to-sky-500",
    accent: "#06B6D4",
    soft: "rgba(6, 182, 212, 0.15)",
    deep: "#155E75",
    glow: "rgba(6, 182, 212, 0.5)",
    icon: Map,
  },
  {
    id: "icse-computer",
    name: "Computer Studies",
    tagline: "Number systems · HTML · networks",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
    accent: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.18)",
    deep: "#4C1D95",
    glow: "rgba(167, 139, 250, 0.55)",
    icon: Cpu,
  },
];

// ICSE upper-primary catalog. Language choices do not establish a jurisdiction.
// Subject areas: https://www.cisce.org/wp-content/uploads/2022/10/UpperPrimary.pdf
export type IcseGroup = {
  id: string;
  label: string;
  description: string;
  subjects: SubjectId[];
  compulsoryIds?: SubjectId[];
};

export const ICSE7_GROUPS: IcseGroup[] = [
  {
    id: "languages",
    label: "Languages",
    description: "English and additional language choices. Select the languages you study.",
    subjects: ["icse-english-lang", "icse-english-lit", "icse-hindi", "icse-marathi", "icse-sanskrit"],
    compulsoryIds: ["icse-english-lang", "icse-english-lit"],
  },
  {
    id: "core",
    label: "Core Academics",
    description: "Compulsory at ICSE middle school.",
    subjects: ["icse-maths", "icse-physics", "icse-chemistry", "icse-biology", "icse-history-civics", "icse-geography"],
    compulsoryIds: ["icse-maths", "icse-physics", "icse-chemistry", "icse-biology", "icse-history-civics", "icse-geography"],
  },
  {
    id: "skills",
    label: "Skills",
    description: "Computer Studies in the upper-primary pathway.",
    subjects: ["icse-computer"],
    compulsoryIds: ["icse-computer"],
  },
];

// =========================
// CBSE (NCERT) — Bharatiya Vidya Bhavan Nagpur & other CBSE schools
// Source: NCERT NCF-SE 2023 textbook lineup (verified May 2026)
//   Grade 3: Joyful Mathematics, Marigold (English), Rimjhim (Hindi), Our Wondrous World (EVS)
//   Grade 4: Maths Mela, Santoor (English), Veena (Hindi), Our Wondrous World (EVS)
//   Grade 7: Ganita Prakash, Curiosity (Science), Poorvi (English), Exploring Society: India & Beyond (SST), Malhar (Hindi), Deepakam (Sanskrit), Kriti (Arts), Khel Yatra (PE), Kaushal Bodh (Vocational)
//   Grade 8: NCF books rolling out 2026-27 — Ganit, Vigyan (Science), Samajik Vigyan (SST), English, Hindi, Sanskrit
// =========================

const CBSE_MATHS: Subject = {
  id: "cbse-maths",
  name: "Mathematics",
  tagline: "Joyful Mathematics · Maths Mela · Ganita Prakash",
  gradient: "from-amber-400 via-orange-500 to-rose-500",
  accent: "#FBBF24",
  soft: "rgba(251, 191, 36, 0.15)",
  deep: "#92400E",
  glow: "rgba(251, 191, 36, 0.5)",
  icon: Calculator,
};
const CBSE_ENGLISH: Subject = {
  id: "cbse-english",
  name: "English",
  tagline: "Marigold · Santoor · Poorvi",
  gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
  accent: "#F472B6",
  soft: "rgba(244, 114, 182, 0.15)",
  deep: "#9F1239",
  glow: "rgba(244, 114, 182, 0.5)",
  icon: BookOpen,
};
const CBSE_HINDI: Subject = {
  id: "cbse-hindi",
  name: "हिंदी",
  tagline: "रिमझिम · वीणा · मल्हार",
  gradient: "from-violet-400 via-purple-500 to-indigo-500",
  accent: "#A78BFA",
  soft: "rgba(167, 139, 250, 0.15)",
  deep: "#5B21B6",
  glow: "rgba(167, 139, 250, 0.5)",
  icon: Languages,
  isDeva: true,
};
const CBSE_EVS: Subject = {
  id: "cbse-evs",
  name: "EVS",
  tagline: "Our Wondrous World",
  gradient: "from-lime-400 via-emerald-500 to-teal-500",
  accent: "#84CC16",
  soft: "rgba(132, 204, 22, 0.15)",
  deep: "#3F6212",
  glow: "rgba(132, 204, 22, 0.5)",
  icon: Sprout,
};
const CBSE_SCIENCE: Subject = {
  id: "cbse-science",
  name: "Science",
  tagline: "Curiosity · Vigyan · integrated PCB",
  gradient: "from-emerald-400 via-teal-500 to-cyan-500",
  accent: "#10B981",
  soft: "rgba(16, 185, 129, 0.15)",
  deep: "#065F46",
  glow: "rgba(16, 185, 129, 0.5)",
  icon: FlaskConical,
};
const CBSE_SOCIALSCIENCE: Subject = {
  id: "cbse-socialscience",
  name: "Social Science",
  tagline: "Exploring Society: India & Beyond · H/G/C/E merged",
  gradient: "from-amber-500 via-orange-600 to-red-600",
  accent: "#D97706",
  soft: "rgba(217, 119, 6, 0.15)",
  deep: "#7C2D12",
  glow: "rgba(217, 119, 6, 0.5)",
  icon: Landmark,
};
const CBSE_SANSKRIT: Subject = {
  id: "cbse-sanskrit",
  name: "संस्कृत",
  tagline: "दीपकम् · तृतीयभाषा",
  gradient: "from-amber-400 via-orange-500 to-yellow-500",
  accent: "#D97706",
  soft: "rgba(217, 119, 6, 0.15)",
  deep: "#92400E",
  glow: "rgba(217, 119, 6, 0.45)",
  icon: Languages,
  isDeva: true,
};
const CBSE_ARTS: Subject = {
  id: "cbse-arts",
  name: "Arts",
  tagline: "Kriti · drawing & craft",
  gradient: "from-pink-400 via-rose-500 to-red-500",
  accent: "#F43F5E",
  soft: "rgba(244, 63, 94, 0.15)",
  deep: "#9F1239",
  glow: "rgba(244, 63, 94, 0.5)",
  icon: Palette,
};
const CBSE_PE: Subject = {
  id: "cbse-pe",
  name: "PE & Wellbeing",
  tagline: "Khel Yatra",
  gradient: "from-cyan-400 via-sky-500 to-blue-500",
  accent: "#22D3EE",
  soft: "rgba(34, 211, 238, 0.15)",
  deep: "#075985",
  glow: "rgba(34, 211, 238, 0.45)",
  icon: MusicIcon,
};
const CBSE_VOCATIONAL: Subject = {
  id: "cbse-vocational",
  name: "Vocational Skills",
  tagline: "Kaushal Bodh",
  gradient: "from-yellow-400 via-amber-500 to-orange-500",
  accent: "#EAB308",
  soft: "rgba(234, 179, 8, 0.15)",
  deep: "#854D0E",
  glow: "rgba(234, 179, 8, 0.5)",
  icon: Briefcase,
};

// Foundational + Preparatory Stage (Grades 1–5): Maths, English, Hindi, EVS, Arts
export const SUBJECTS_CBSE_PRIMARY: Subject[] = [
  CBSE_MATHS, CBSE_ENGLISH, CBSE_HINDI, CBSE_EVS, CBSE_ARTS,
];

// Middle Stage (Grades 6–8): Maths, Science, SST, English, Hindi, Sanskrit, Arts, PE, Vocational
export const SUBJECTS_CBSE_MIDDLE: Subject[] = [
  CBSE_MATHS, CBSE_SCIENCE, CBSE_SOCIALSCIENCE,
  CBSE_ENGLISH, CBSE_HINDI, CBSE_SANSKRIT,
  CBSE_ARTS, CBSE_PE, CBSE_VOCATIONAL,
];

const ALL_CBSE: Subject[] = [
  CBSE_MATHS, CBSE_ENGLISH, CBSE_HINDI, CBSE_EVS,
  CBSE_SCIENCE, CBSE_SOCIALSCIENCE, CBSE_SANSKRIT,
  CBSE_ARTS, CBSE_PE, CBSE_VOCATIONAL,
];

// CBSE picker groupings — Middle Stage offers electives
export const CBSE_MIDDLE_GROUPS: IcseGroup[] = [
  {
    id: "core",
    label: "Core Academics",
    description: "Compulsory at CBSE middle school.",
    subjects: ["cbse-maths", "cbse-science", "cbse-socialscience"],
    compulsoryIds: ["cbse-maths", "cbse-science", "cbse-socialscience"],
  },
  {
    id: "languages",
    label: "Languages",
    description: "Select the languages you study. This catalog is not a complete list of language options.",
    subjects: ["cbse-english", "cbse-hindi", "cbse-sanskrit"],
  },
  {
    id: "co",
    label: "Co-curricular",
    description: "NCF-SE 2023 adds Arts, PE & Wellbeing, Vocational Skills.",
    subjects: ["cbse-arts", "cbse-pe", "cbse-vocational"],
  },
];

// =========================
// Cambridge Lower Secondary (Grades 6–8 = Stages 7–9)
// =========================
// The app retains its existing grade/stage mapping for content lookup.
// A grade alone does not establish a school timetable or subject mandate.

export const SUBJECTS_CLS: Subject[] = [
  {
    id: "cls-english", name: "English", tagline: "Language & literature",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    accent: "#F472B6", soft: "rgba(244, 114, 182, 0.15)", deep: "#9D174D",
    glow: "rgba(244, 114, 182, 0.5)", icon: BookOpen,
  },
  {
    id: "cls-maths", name: "Maths", tagline: "Algebra · ratio · geometry",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    accent: "#FBBF24", soft: "rgba(251, 191, 36, 0.15)", deep: "#92400E",
    glow: "rgba(251, 191, 36, 0.5)", icon: Calculator,
  },
  {
    id: "cls-science", name: "Science", tagline: "Biology · chemistry · physics",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accent: "#10B981", soft: "rgba(16, 185, 129, 0.15)", deep: "#065F46",
    glow: "rgba(16, 185, 129, 0.5)", icon: FlaskConical,
  },
  {
    id: "cls-history", name: "History", tagline: "Empires · evidence · change",
    gradient: "from-amber-500 via-yellow-600 to-orange-700",
    accent: "#D97706", soft: "rgba(217, 119, 6, 0.15)", deep: "#78350F",
    glow: "rgba(217, 119, 6, 0.5)", icon: Landmark,
  },
  {
    id: "cls-geography", name: "Geography", tagline: "Places · people · planet",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    accent: "#84CC16", soft: "rgba(132, 204, 22, 0.15)", deep: "#3F6212",
    glow: "rgba(132, 204, 22, 0.5)", icon: Map,
  },
  {
    id: "cls-globalperspectives", name: "Global Perspectives", tagline: "Research · reflect · collaborate",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    accent: "#38BDF8", soft: "rgba(56, 189, 248, 0.15)", deep: "#075985",
    glow: "rgba(56, 189, 248, 0.5)", icon: Globe2,
  },
  {
    id: "cls-ict", name: "ICT", tagline: "Computing & digital literacy",
    gradient: "from-slate-400 via-gray-500 to-zinc-600",
    accent: "#94A3B8", soft: "rgba(148, 163, 184, 0.15)", deep: "#334155",
    glow: "rgba(148, 163, 184, 0.5)", icon: Monitor,
  },
  {
    id: "cls-art", name: "Art", tagline: "Draw · design · make",
    gradient: "from-fuchsia-400 via-purple-500 to-violet-600",
    accent: "#E879F9", soft: "rgba(232, 121, 249, 0.15)", deep: "#701A75",
    glow: "rgba(232, 121, 249, 0.5)", icon: Palette,
  },
  {
    id: "cls-hindi", name: "हिंदी", tagline: "भाषा · व्याकरण · रचना",
    gradient: "from-orange-400 via-red-500 to-rose-600",
    accent: "#FB923C", soft: "rgba(251, 146, 60, 0.15)", deep: "#7C2D12",
    glow: "rgba(251, 146, 60, 0.5)", icon: Languages, isDeva: true,
  },
  {
    id: "cls-marathi", name: "मराठी", tagline: "भाषा · व्याकरण · लेखन",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    accent: "#A78BFA", soft: "rgba(167, 139, 250, 0.15)", deep: "#4C1D95",
    glow: "rgba(167, 139, 250, 0.5)", icon: Languages, isDeva: true,
  },
  {
    id: "cls-french", name: "French", tagline: "Bonjour · grammaire · culture",
    gradient: "from-blue-400 via-indigo-500 to-violet-600",
    accent: "#818CF8", soft: "rgba(129, 140, 248, 0.15)", deep: "#3730A3",
    glow: "rgba(129, 140, 248, 0.5)", icon: Languages,
  },
  {
    id: "cls-spanish", name: "Spanish", tagline: "Hola · gramática · cultura",
    gradient: "from-red-400 via-orange-500 to-amber-500",
    accent: "#F87171", soft: "rgba(248, 113, 113, 0.15)", deep: "#7F1D1D",
    glow: "rgba(248, 113, 113, 0.5)", icon: Languages,
  },
  // Optional activity subjects retain their existing IDs and progress.
  {
    id: "cls-pe", name: "Physical Education", tagline: "Move · play · train",
    gradient: "from-red-400 via-rose-500 to-pink-600",
    accent: "#F87171", soft: "rgba(248, 113, 113, 0.15)", deep: "#7F1D1D",
    glow: "rgba(248, 113, 113, 0.5)", icon: Dumbbell,
  },
  {
    id: "cls-music", name: "Music, Dance & Drama", tagline: "Perform · compose · stage",
    gradient: "from-purple-400 via-fuchsia-500 to-pink-600",
    accent: "#C084FC", soft: "rgba(192, 132, 252, 0.15)", deep: "#581C87",
    glow: "rgba(192, 132, 252, 0.5)", icon: Drama,
  },
  {
    id: "cls-hobby", name: "Hobby", tagline: "Your pick · your project",
    gradient: "from-teal-400 via-cyan-500 to-sky-600",
    accent: "#2DD4BF", soft: "rgba(45, 212, 191, 0.15)", deep: "#134E4A",
    glow: "rgba(45, 212, 191, 0.5)", icon: Sparkles,
  },
  // Separate science choices retained alongside combined Science.
  {
    id: "cls-physics", name: "Physics", tagline: "Forces · energy · waves",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    accent: "#22D3EE", soft: "rgba(34, 211, 238, 0.15)", deep: "#164E63",
    glow: "rgba(34, 211, 238, 0.5)", icon: Atom,
  },
  {
    id: "cls-chemistry", name: "Chemistry", tagline: "Atoms · reactions · matter",
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    accent: "#2DD4BF", soft: "rgba(45, 212, 191, 0.15)", deep: "#134E4A",
    glow: "rgba(45, 212, 191, 0.5)", icon: Beaker,
  },
  {
    id: "cls-biology", name: "Biology", tagline: "Cells · bodies · ecosystems",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    accent: "#4ADE80", soft: "rgba(74, 222, 128, 0.15)", deep: "#14532D",
    glow: "rgba(74, 222, 128, 0.5)", icon: Sprout,
  },
];

/** Generic catalog choices, not a particular school's timetable.
 * Cambridge allows any combination of Lower Secondary subjects:
 * https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum
 */
export const CLS_GROUPS_6_7: IcseGroup[] = [
  {
    id: "core",
    label: "English, Mathematics & Science",
    description: "Choose the subjects in your learning plan.",
    subjects: ["cls-english", "cls-maths", "cls-science"],
  },
  {
    id: "humanities",
    label: "Humanities",
    description: "Choose the humanities subjects you study.",
    subjects: ["cls-history", "cls-geography", "cls-globalperspectives"],
  },
  {
    id: "languages",
    label: "Languages",
    description: "Choose from the available language options.",
    subjects: ["cls-hindi", "cls-french", "cls-spanish"],
  },
  {
    id: "state",
    label: "Additional language",
    description: "Choose Marathi if it is part of your learning plan.",
    subjects: ["cls-marathi"],
  },
  {
    id: "creative",
    label: "ICT & Art",
    description: "Choose technology and creative subjects you study.",
    subjects: ["cls-ict", "cls-art"],
  },
  {
    id: "wellbeing",
    label: "PE, Performing Arts & Hobby",
    description: "Choose movement, performance or project activities.",
    subjects: ["cls-pe", "cls-music", "cls-hobby"],
  },
];

/** Grade 8 keeps the same choices, with separate science options also offered. */
export const CLS_GROUPS_8: IcseGroup[] = [
  ...CLS_GROUPS_6_7,
  {
    id: "sciences",
    label: "Sciences",
    description: "Choose separate sciences if you study them. Combined Science remains available.",
    subjects: ["cls-physics", "cls-chemistry", "cls-biology"],
  },
];

/** Picks the right Lower Secondary grouping for a grade. Grade 8 = Stage 9. */
export function clsGroupsForGrade(grade?: number): IcseGroup[] {
  return (grade ?? 6) >= 8 ? CLS_GROUPS_8 : CLS_GROUPS_6_7;
}

/** Cambridge stage number for a Lower Secondary grade — Grade 6 → Stage 7. */
export function cambridgeStageForGrade(board: Board, grade?: number): number | undefined {
  if (grade == null) return undefined;
  if (board === "cambridge-primary") return grade;           // Grades 1–5 → Stages 1–5
  if (board === "cambridge-lower-secondary") return grade + 1; // Grades 6–8 → Stages 7–9
  return undefined;
}

// Combined map for lookups
export const SUBJECTS: Subject[] = [...SUBJECTS_PRIMARY, ...SUBJECTS_CLS, ...SUBJECTS_IGCSE, ...SUBJECTS_ICSE7, ...ALL_CBSE];
export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s])) as Record<string, Subject>;

// IGCSE catalog grouping, not a school or award enrollment policy.
// Cambridge offers subjects in any combination:
// https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/curriculum/
export type IgcseGroup = {
  id: string;
  label: string;
  description: string;
  subjects: SubjectId[];
  compulsoryIds?: SubjectId[];
};

export const IGCSE_GROUPS: IgcseGroup[] = [
  {
    id: "g1",
    label: "Group 1 · Languages",
    description: "Choose the language subjects you study.",
    subjects: ["igcse-english", "igcse-hindi", "igcse-french", "igcse-spanish"],
  },
  {
    id: "g2",
    label: "Group 2 · Humanities & Social Sciences",
    description: "Choose the humanities and social sciences you study.",
    subjects: ["igcse-history", "igcse-geography", "igcse-economics", "igcse-globalperspectives"],
  },
  {
    id: "g3",
    label: "Group 3 · Sciences",
    description: "Choose the sciences you study.",
    subjects: ["igcse-physics", "igcse-chemistry", "igcse-biology"],
  },
  {
    id: "g4",
    label: "Group 4 · Mathematics",
    description: "Choose this syllabus if you study International Mathematics (0607).",
    subjects: ["igcse-maths"],
  },
  {
    id: "g5",
    label: "Group 5 · Creative & Professional",
    description: "Pick the optionals you actually take. Computer Science is here.",
    subjects: ["igcse-cs", "igcse-ict", "igcse-business", "igcse-art"],
  },
  {
    id: "state",
    label: "Additional language",
    description: "Choose Marathi if it is part of your learning plan.",
    subjects: ["igcse-marathi"],
  },
];

/** Subjects shown to a learner, given their board + (for IGCSE/ICSE/CBSE) picked subjects. */
export function subjectsForLearner(
  board: Board | null,
  pickedSubjects?: SubjectId[],
  grade?: number | null,
): Subject[] {
  if (board === null || grade === null) return [];
  if (board === "cambridge-primary") return SUBJECTS_PRIMARY;
  if (board === "cambridge-lower-secondary") {
    const groups = clsGroupsForGrade(grade);
    const compulsory = groups.flatMap((g) => g.compulsoryIds || []);
    const chosen = new Set<SubjectId>([...compulsory, ...(pickedSubjects || [])]);
    // Retained selections must remain visible even after a grade change.
    return SUBJECTS_CLS.filter((s) => chosen.has(s.id));
  }
  if (board === "cambridge-igcse") {
    const compulsory = IGCSE_GROUPS.flatMap((g) => g.compulsoryIds || []);
    const chosen = new Set<SubjectId>([...compulsory, ...(pickedSubjects || [])]);
    return SUBJECTS_IGCSE.filter((s) => chosen.has(s.id));
  }
  if (board === "icse") {
    const compulsory = ICSE7_GROUPS.flatMap((g) => g.compulsoryIds || []);
    const chosen = new Set<SubjectId>([...compulsory, ...(pickedSubjects || [])]);
    return SUBJECTS_ICSE7.filter((s) => chosen.has(s.id));
  }
  if (board === "cbse") {
    // Primary stage (Gr 1–5) — fixed lineup, no picker
    if (grade != null && grade <= 5) return SUBJECTS_CBSE_PRIMARY;
    // Middle stage (Gr 6–8) — core + chosen languages/co-curriculars
    const compulsory = CBSE_MIDDLE_GROUPS.flatMap((g) => g.compulsoryIds || []);
    const chosen = new Set<SubjectId>([...compulsory, ...(pickedSubjects || [])]);
    return SUBJECTS_CBSE_MIDDLE.filter((s) => chosen.has(s.id));
  }
  return [];
}

/** Returns the picker grouping for a board, if any. */
export function pickerGroupsForBoard(
  board: Board | null,
  grade?: number | null,
): { id: string; label: string; description: string; subjects: SubjectId[]; compulsoryIds?: SubjectId[] }[] {
  if (board === "cambridge-igcse") return IGCSE_GROUPS;
  if (board === "cambridge-lower-secondary") return clsGroupsForGrade(grade ?? undefined);
  if (board === "icse") return ICSE7_GROUPS;
  if (board === "cbse" && grade != null && grade >= 6) return CBSE_MIDDLE_GROUPS;
  return [];
}
