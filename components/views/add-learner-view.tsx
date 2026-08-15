"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import { ChevronLeft, Sparkles, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Board, LearnerProfile } from "@/lib/types";
import { BOARDS, boardOption } from "@/lib/content/boards";
import { todayKey } from "@/lib/utils";
import { themeForGrade } from "@/components/theme-applier";
import { sfx } from "@/lib/audio";

const AVATAR_CHOICES = [
  { id: "peacock",  emoji: "🦚" },
  { id: "tiger",    emoji: "🐯" },
  { id: "owl",      emoji: "🦉" },
  { id: "elephant", emoji: "🐘" },
  { id: "fox",      emoji: "🦊" },
  { id: "lion",     emoji: "🦁" },
];

/**
 * Anonymous school templates — board/grade/school context only.
 * NO names are ever prefilled. Selecting a template fills the form's
 * board / grade / school / city fields and switches the user into Custom
 * so they type their own name. We never persist a learner without an
 * explicit name typed by the user.
 */
type SchoolTemplate = {
  id: string;
  label: string;          // e.g. "Cambridge Primary · Grade 5"
  emoji: string;          // suggested avatar (kid can override)
  board: Board;
  grade: number;
  school?: string;
  city?: string;
  desc: string;
};

const SCHOOL_TEMPLATES: SchoolTemplate[] = [
  { id: "cam-primary-5", label: "Cambridge Primary · Grade 5",  emoji: "🦚", board: "cambridge-primary", grade: 5,  desc: "Stage 5 · Maths · English · Science" },
  { id: "cam-lsec-6",    label: "Cambridge Lower Sec · Grade 6", emoji: "🦋", board: "cambridge-lower-secondary", grade: 6, desc: "Stage 7 · combined Science · pick a language" },
  { id: "cam-lsec-7",    label: "Cambridge Lower Sec · Grade 7", emoji: "🐬", board: "cambridge-lower-secondary", grade: 7, desc: "Stage 8 · combined Science · pick a language" },
  { id: "cam-lsec-8",    label: "Cambridge Lower Sec · Grade 8", emoji: "🦅", board: "cambridge-lower-secondary", grade: 8, desc: "Stage 9 · Physics · Chemistry · Biology · Checkpoint" },
  { id: "cam-igcse-10",  label: "Cambridge IGCSE · Year 10",    emoji: "🦉", board: "cambridge-igcse",   grade: 10, desc: "Extended · pick your subjects" },
  { id: "icse-6",        label: "ICSE · Class 6",               emoji: "🦊", board: "icse",              grade: 6,  desc: "Selina · CISCE curriculum" },
  { id: "icse-7",        label: "ICSE · Class 7",               emoji: "🦉", board: "icse",              grade: 7,  desc: "Selina · CISCE curriculum" },
  { id: "cbse-3",        label: "CBSE · Grade 3",               emoji: "🦊", board: "cbse",              grade: 3,  desc: "NCERT NCF-SE 2023 · Joyful Mathematics + Marigold" },
  { id: "cbse-4",        label: "CBSE · Grade 4",               emoji: "🐯", board: "cbse",              grade: 4,  desc: "NCERT · Math Magic + Santoor + Veena" },
  { id: "cbse-7",        label: "CBSE · Grade 7",               emoji: "🦉", board: "cbse",              grade: 7,  desc: "NCERT · Ganita Prakash + Curiosity + Poorvi" },
  { id: "cbse-8",        label: "CBSE · Grade 8",               emoji: "🦅", board: "cbse",              grade: 8,  desc: "NCERT · Ganit + Vigyan + Samajik Vigyan" },
];

export function AddLearnerView({
  existingIds, onSave, onBack,
}: {
  existingIds: string[];
  onSave: (learner: LearnerProfile) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<"template" | "custom">("custom");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");
  const [board, setBoard] = useState<Board>("cambridge-primary");
  const [grade, setGrade] = useState<number>(5);
  const [avatar, setAvatar] = useState<string>("peacock");
  const reduced = useReducedMotion();

  // Selecting a template fills the form fields and switches to Custom so the
  // user types their own name. No template ever pre-fills a name.
  const applyTemplate = (t: SchoolTemplate) => {
    sfx.click();
    setBoard(t.board);
    setGrade(t.grade);
    if (t.school) setSchool(t.school);
    if (t.city) setCity(t.city);
    if (t.emoji === "🦚") setAvatar("peacock");
    else if (t.emoji === "🐯") setAvatar("tiger");
    else if (t.emoji === "🦉") setAvatar("owl");
    else if (t.emoji === "🦊") setAvatar("fox");
    else if (t.emoji === "🦅") setAvatar("owl");
    setStep("custom");
  };

  const onCreate = () => {
    if (!name.trim()) return;
    sfx.click();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "learner";
    let id = slug;
    let n = 1;
    while (existingIds.includes(id)) { id = `${slug}-${++n}`; }
    onSave(makeLearner({
      id, name: name.trim(), board, grade,
      school: school.trim() || undefined, city: city.trim() || undefined,
      avatarId: avatar, themeId: themeForGrade(grade),
    }));
  };

  const selectedBoard = boardOption(board);

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-6">
          <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-4 active:scale-95">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <motion.div initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-lg)] mb-3" style={{ background: "var(--accent-soft)", boxShadow: `0 0 30px var(--accent-glow)` }}>
              <Plus className="w-8 h-8" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>Add a learner</h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Type the learner&apos;s name. A template can pre-fill the curriculum.
            </p>
          </motion.div>

          <div className="flex gap-1.5 mb-5">
            <button onClick={() => { sfx.click(); setStep("custom"); }}
              aria-pressed={step === "custom"}
              className="flex-1 rounded-[var(--radius-pill)] px-3 min-h-11 text-xs font-bold"
              style={{
                background: step === "custom" ? "var(--accent-soft)" : "var(--surface)",
                color: step === "custom" ? "var(--accent)" : "var(--text-muted)",
                boxShadow: step === "custom" ? `0 0 12px var(--accent-glow)` : "none",
              }}>Type details</button>
            <button onClick={() => { sfx.click(); setStep("template"); }}
              aria-pressed={step === "template"}
              className="flex-1 rounded-[var(--radius-pill)] px-3 min-h-11 text-xs font-bold"
              style={{
                background: step === "template" ? "var(--accent-soft)" : "var(--surface)",
                color: step === "template" ? "var(--accent)" : "var(--text-muted)",
                boxShadow: step === "template" ? `0 0 12px var(--accent-glow)` : "none",
              }}>School template</button>
          </div>

          {step === "template" ? (
            <div className="space-y-3">
              <div className="text-[11px] italic mb-2 px-1" style={{ color: "var(--text-faint)" }}>
                Tapping a template fills the curriculum below. You still type the learner&apos;s name.
              </div>
              {SCHOOL_TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => applyTemplate(t)}
                  className="w-full rounded-[var(--radius-lg)] p-4 flex items-center gap-4 text-left active:scale-[0.99] transition"
                  style={{
                    background: "var(--surface)",
                    border: "1px dashed var(--border-strong)",
                  }}
                >
                  <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "var(--accent-soft)" }}>{t.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg truncate" style={{ color: "var(--text)" }}>{t.label}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{t.desc}</div>
                  </div>
                  <Sparkles className="w-5 h-5" style={{ color: "var(--accent)" }} />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Name" htmlFor="learner-name">
                <input
                  id="learner-name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aanya Verma"
                  className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[var(--radius-md)] text-[15px]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="School (optional)" htmlFor="learner-school">
                  <input id="learner-school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name"
                    className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[var(--radius-md)] text-[15px]"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </Field>
                <Field label="City (optional)" htmlFor="learner-city">
                  <input id="learner-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"
                    className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[var(--radius-md)] text-[15px]"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </Field>
              </div>

              <Field label="Board">
                <div className="grid grid-cols-2 gap-2">
                  {BOARDS.map((b) => {
                    const active = board === b.id;
                    return (
                      <button key={b.id}
                        onClick={() => { sfx.click(); setBoard(b.id); setGrade(b.defaultGrade); }}
                        // Selection shows only as a tinted background and border.
                        aria-pressed={active}
                        className="rounded-[var(--radius-md)] p-3 text-left transition"
                        style={{
                          background: active ? "var(--accent-soft)" : "var(--surface)",
                          border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                        }}>
                        <div className="font-display font-bold text-sm" style={{ color: active ? "var(--accent)" : "var(--text)" }}>{b.label}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{b.description}</div>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label={`Grade · ${grade}`} htmlFor="learner-grade">
                <input type="range" id="learner-grade"
                  min={selectedBoard.gradeRange[0]} max={selectedBoard.gradeRange[1]} step={1}
                  value={grade} onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                  className="w-full accent-[color:var(--accent)]" />
                <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>
                  <span>{selectedBoard.gradeRange[0]}</span>
                  <span>{selectedBoard.gradeRange[1]}</span>
                </div>
              </Field>

              <Field label="Avatar">
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_CHOICES.map((a) => {
                    const active = a.id === avatar;
                    return (
                      <button key={a.id} onClick={() => { sfx.click(); setAvatar(a.id); }}
                        aria-pressed={active}
                        aria-label={`${a.id} avatar`}
                        className="w-12 h-12 rounded-[var(--radius-md)] text-2xl transition flex items-center justify-center"
                        style={{
                          background: active ? "var(--accent-soft)" : "var(--surface)",
                          border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                        }}>{a.emoji}</button>
                    );
                  })}
                </div>
              </Field>

              <div className="text-[11px] mt-2 px-1" style={{ color: "var(--text-faint)" }}>
                Theme auto-set to <strong style={{ color: "var(--accent)" }}>{themeForGrade(grade)}</strong> based on grade. (Playful ≤ 5 · Vivid 6–8 · Terminal 9+)
              </div>

              <Button size="lg" className="w-full" onClick={onCreate} disabled={!name.trim()}>
                Create learner →
              </Button>
            </div>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}

/**
 * A labelled control. The caption used to be a plain <div>, so none of these
 * inputs actually had an accessible name — a screen reader read the placeholder
 * or nothing at all.
 *
 * Pass `htmlFor` when the field wraps one input, so a real <label> can point at
 * it. The board and avatar fields are groups of buttons with no single control
 * to point at, so there the caption becomes the group's accessible name.
 */
function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  const uid = useId();
  const captionId = htmlFor ? undefined : `${uid}-label`;
  const caption = "text-[10px] uppercase tracking-widest font-bold mb-1.5 px-1";
  return (
    <div role={htmlFor ? undefined : "group"} aria-labelledby={captionId}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={`block ${caption}`} style={{ color: "var(--text-faint)" }}>{label}</label>
      ) : (
        <div id={captionId} className={caption} style={{ color: "var(--text-faint)" }}>{label}</div>
      )}
      {children}
    </div>
  );
}

function makeLearner({
  id, name, board, grade, school, city, avatarId, themeId,
}: {
  id: string; name: string; board: Board; grade: number;
  school?: string; city?: string; avatarId: string;
  themeId: "playful" | "vivid" | "terminal";
}): LearnerProfile {
  return {
    id, name, board, grade, school, city, themeId,
    pickedSubjects: undefined,
    subjectsLocked: false,
    createdAt: new Date().toISOString(),
    state: {
      name, avatarId, customAvatar: null,
      xp: 0, coins: 50, streak: 0, longestStreak: 0, lastPlayedDate: null,
      progress: {}, badges: [],
      inventory: { hint: 1, fiftyFifty: 1, freeze: 0, doubleXp: 0 },
      stats: { totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0, dailyQuestsCompleted: 0, fastestQuiz: null },
      doubleXpActive: false,
      dailyQuest: { date: todayKey(), completed: false },
      comeback: { wasWrong: false, sinceWrongCorrect: 0 },
      seenQuestions: {},
      friendStreak: null, lastQuestCorrect: null,
      passportStamps: [], notebook: {}, lastAssemblyDate: null,
      assemblyStreak: 0, readBooks: [], readingProgress: {}, savedMelody: null, savedCompositions: [],
      classRoster: [], classNotes: [], buddyId: null, missedQuestions: [], dailyReflections: [],
      settings: { sound: true, music: false, voice: true, musicVolume: -16, sfxVolume: -8, voiceVolume: 0.9 },
      onboarded: true,
    },
  };
}
