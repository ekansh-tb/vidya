"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Board, LearnerProfile } from "@/lib/types";
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

const BOARDS: { id: Board; label: string; description: string; defaultGrade: number; gradeRange: [number, number] }[] = [
  { id: "cambridge-primary", label: "Cambridge Primary",  description: "Stages 1–6 · ages 6–11",                 defaultGrade: 5,  gradeRange: [1, 6] },
  { id: "cambridge-igcse",   label: "Cambridge IGCSE",    description: "Year 9–10 · Upper Secondary · ages 14–16", defaultGrade: 10, gradeRange: [9, 10] },
  { id: "icse",              label: "ICSE (CISCE)",       description: "Indian Council · grades 1–10",            defaultGrade: 7,  gradeRange: [1, 10] },
  { id: "cbse",              label: "CBSE (NCERT NCF-SE 2023)", description: "Central Board · grades 1–12 · NCERT books", defaultGrade: 7, gradeRange: [1, 12] },
];

type Preset = {
  id: string;
  name: string;
  emoji: string;
  board: Board;
  grade: number;
  school: string;
  city: string;
  desc: string;
};

const PRESETS: Preset[] = [
  { id: "advika", name: "Advika Jain",  emoji: "🦚", board: "cambridge-primary", grade: 5,  school: "CNS Pune",                       city: "Pune", desc: "Grade 5 · Cambridge Primary" },
  { id: "nevaan", name: "Nevaan Jain",  emoji: "🐯", board: "cambridge-igcse",   grade: 10, school: "CNS Pune",                       city: "Pune", desc: "Grade 10 · IGCSE · CS exam tomorrow" },
  { id: "wws6",   name: "WWS Class 6 scholar",  emoji: "🦊", board: "icse",      grade: 6,  school: "Wisdom World School, Hadapsar", city: "Pune", desc: "Class 6 ICSE · Selina + Ancient India" },
  { id: "wws7",   name: "WWS Class 7 scholar",  emoji: "🦉", board: "icse",      grade: 7,  school: "Wisdom World School, Hadapsar", city: "Pune", desc: "Class 7 ICSE · Selina + Medieval India" },
  // Bharatiya Vidya Bhavan, Nagpur — 4 CBSE-affiliated branches under Nagpur Kendra
  // Sources verified May 2026: bvmcl.edu.in (Civil Lines, est. 1982), bvmskn.edu.in (Srikrishna Nagar, Aff. # 1130059)
  { id: "bvb-cl-7",  name: "BVB Civil Lines · Gr 7",   emoji: "🦉", board: "cbse", grade: 7, school: "Bharatiya Vidya Bhavan, Civil Lines", city: "Nagpur", desc: "CBSE · Ganita Prakash + Curiosity + Poorvi" },
  { id: "bvb-skn-3", name: "BVB Srikrishna Nagar · Gr 3", emoji: "🦊", board: "cbse", grade: 3, school: "Bharatiya Vidya Bhavan, Srikrishna Nagar", city: "Nagpur", desc: "CBSE Preparatory · Joyful Mathematics + Marigold" },
  { id: "bvb-tn-4",  name: "BVB Trimurti Nagar · Gr 4", emoji: "🐯", board: "cbse", grade: 4, school: "Bharatiya Vidya Bhavan, Trimurti Nagar", city: "Nagpur", desc: "CBSE · Maths Mela + Santoor + Veena" },
  { id: "bvb-as-8",  name: "BVB Ashti · Gr 8",          emoji: "🦅", board: "cbse", grade: 8, school: "Bharatiya Vidya Bhavan, Ashti", city: "Nagpur", desc: "CBSE · Ganit + Vigyan + Samajik Vigyan (NCF 26-27)" },
];

export function AddLearnerView({
  existingIds, onSave, onBack,
}: {
  existingIds: string[];
  onSave: (learner: LearnerProfile) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<"preset" | "custom">("preset");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("Pune");
  const [board, setBoard] = useState<Board>("cambridge-primary");
  const [grade, setGrade] = useState<number>(5);
  const [avatar, setAvatar] = useState<string>("peacock");

  const usePreset = (p: Preset) => {
    if (existingIds.includes(p.id)) return;
    sfx.click();
    const themeId = themeForGrade(p.grade);
    onSave(makeLearner({
      id: p.id, name: p.name, board: p.board, grade: p.grade,
      school: p.school, city: p.city,
      avatarId: p.emoji === "🦚" ? "peacock" : p.emoji === "🐯" ? "tiger" : "owl",
      themeId,
    }));
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

  const selectedBoard = BOARDS.find((b) => b.id === board)!;

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-lg)] mb-3" style={{ background: "var(--accent-soft)", boxShadow: `0 0 30px var(--accent-glow)` }}>
            <Plus className="w-8 h-8" style={{ color: "var(--accent)" }} />
          </div>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>Add a learner</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            Quick preset or custom — any school, any board, any grade.
          </p>
        </motion.div>

        <div className="flex gap-1.5 mb-5">
          <button onClick={() => { sfx.click(); setStep("preset"); }}
            className="flex-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-bold"
            style={{
              background: step === "preset" ? "var(--accent-soft)" : "var(--surface)",
              color: step === "preset" ? "var(--accent)" : "var(--text-muted)",
              boxShadow: step === "preset" ? `0 0 12px var(--accent-glow)` : "none",
            }}>Quick presets</button>
          <button onClick={() => { sfx.click(); setStep("custom"); }}
            className="flex-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-bold"
            style={{
              background: step === "custom" ? "var(--accent-soft)" : "var(--surface)",
              color: step === "custom" ? "var(--accent)" : "var(--text-muted)",
              boxShadow: step === "custom" ? `0 0 12px var(--accent-glow)` : "none",
            }}>Custom</button>
        </div>

        {step === "preset" ? (
          <div className="space-y-3">
            {PRESETS.map((p) => {
              const exists = existingIds.includes(p.id);
              return (
                <button key={p.id} disabled={exists} onClick={() => usePreset(p)}
                  className="w-full rounded-[var(--radius-lg)] p-4 flex items-center gap-4 text-left active:scale-[0.99] transition disabled:opacity-50"
                  style={{
                    background: "var(--surface)",
                    border: "1px dashed var(--border-strong)",
                  }}
                >
                  <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "var(--accent-soft)" }}>{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg truncate" style={{ color: "var(--text)" }}>{p.name}</div>
                    <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{p.school}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{p.desc}</div>
                  </div>
                  {exists ? (
                    <div className="rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                      <Check className="w-3 h-3" /> added
                    </div>
                  ) : (
                    <Sparkles className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Name">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aanya Verma"
                className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[var(--radius-md)] text-[15px]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="School">
                <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name"
                  className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[var(--radius-md)] text-[15px]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </Field>
              <Field label="City">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Pune"
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

            <Field label={`Grade · ${grade}`}>
              <input type="range"
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
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold mb-1.5 px-1" style={{ color: "var(--text-faint)" }}>{label}</div>
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
      assemblyStreak: 0, readBooks: [], savedMelody: null, savedCompositions: [],
      classRoster: [], classNotes: [], buddyId: null,
      settings: { sound: true, music: false, voice: true, musicVolume: -16, sfxVolume: -8, voiceVolume: 0.9 },
      onboarded: true,
    },
  };
}
