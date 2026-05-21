"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, RotateCcw, Lock, KeyRound, Eye, EyeOff, CalendarClock, Plus, X, Info, GraduationCap, ShieldCheck, ShieldAlert, Send, Heart, Trash2, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subjectsForLearner } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import type { ExamDate, FamilyNote, GameState, LearnerProfile, SubjectId } from "@/lib/types";
import type { CapabilityKey, VerificationLevel } from "@/lib/auth/types";
import { CAPABILITY_POLICIES } from "@/lib/capabilities/policies";
import { computeRung } from "@/lib/capabilities/use-capability";
import { sfx } from "@/lib/audio";

/**
 * In-kid-app Parent Room.
 *
 * Two boundaries this view enforces:
 *  1. **PIN gate** — speed bump so a kid (or sibling) tapping "Parent" on the
 *     home view can't immediately see or reset analytics. NOT real security;
 *     that lives in /sign-in via Clerk. First open prompts to set a PIN.
 *  2. **Strict subject isolation** — uses subjectsForLearner(...) not SUBJECTS,
 *     so a Cambridge Primary learner never sees IGCSE/ICSE/CBSE subjects, and
 *     vice versa.
 *
 * Surfaces only what this learner has actually attempted. Wraps the headline
 * in an opinion-only frame (window / observation / opinion) — never claims.
 */
export function ParentView({
  state, learner, onBack, onReset, onUpdateLearner,
}: {
  state: GameState;
  learner: LearnerProfile;
  onBack: () => void;
  onReset: () => void;
  onUpdateLearner: (patch: Partial<Omit<LearnerProfile, "state" | "id">>) => void;
}) {
  const hasPin = !!learner.parentPin;
  const [phase, setPhase] = useState<"gate" | "set" | "unlocked">(hasPin ? "gate" : "set");
  const [pinInput, setPinInput] = useState("");
  const [setPinValue, setSetPinValue] = useState("");
  const [confirmPinValue, setConfirmPinValue] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [showSetPin, setShowSetPin] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (phase === "set") {
    return (
      <PinScaffold onBack={onBack} title="Set a parent PIN" subtitle={`For ${learner.name}'s parent view`}>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          4 digits. The kid won't see this. Use it whenever you open the parent room.
          <br />
          <span style={{ color: "var(--text-faint)" }}>
            This is a local speed bump — not real security. Real auth is the Supabase sign-in flow.
          </span>
        </p>
        <PinField label="New PIN" value={setPinValue} onChange={setSetPinValue} show={showSetPin} onToggleShow={() => setShowSetPin((s) => !s)} />
        <div className="h-3" />
        <PinField label="Confirm PIN" value={confirmPinValue} onChange={setConfirmPinValue} show={showSetPin} onToggleShow={() => setShowSetPin((s) => !s)} />
        {pinError && (
          <div className="text-xs mt-3" style={{ color: "var(--error)" }}>{pinError}</div>
        )}
        <Button
          className="mt-4 w-full"
          onClick={() => {
            if (!/^\d{4}$/.test(setPinValue)) { setPinError("PIN must be exactly 4 digits."); return; }
            if (setPinValue !== confirmPinValue) { setPinError("PINs don't match. Try again."); return; }
            onUpdateLearner({ parentPin: setPinValue });
            sfx.coin();
            setPhase("unlocked");
            setPinError(null);
          }}
        >
          Save PIN and unlock
        </Button>
      </PinScaffold>
    );
  }

  if (phase === "gate") {
    return (
      <PinScaffold onBack={onBack} title="Parent PIN" subtitle={`Unlock ${learner.name}'s analytics`}>
        <PinField label="Enter PIN" value={pinInput} onChange={setPinInput} show={false} autoFocus />
        {pinError && (
          <div className="text-xs mt-3" style={{ color: "var(--error)" }}>{pinError}</div>
        )}
        <Button
          className="mt-4 w-full"
          onClick={() => {
            if (pinInput === learner.parentPin) {
              setPhase("unlocked");
              setPinError(null);
              sfx.coin();
            } else {
              setPinError("That PIN doesn't match. Try again.");
              setPinInput("");
            }
          }}
        >
          Unlock
        </Button>
        <button
          className="mt-3 w-full text-[11px] uppercase tracking-widest font-bold"
          style={{ color: "var(--text-faint)" }}
          onClick={() => {
            if (confirm(`Reset PIN? You'll lose access to ${learner.name}'s analytics until you set a new one.`)) {
              onUpdateLearner({ parentPin: undefined });
              setPhase("set");
              setPinInput("");
              setPinError(null);
            }
          }}
        >
          Forgot PIN · reset
        </button>
      </PinScaffold>
    );
  }

  // ----- UNLOCKED ------------------------------------------------------------

  const accuracy = state.stats.totalAnswered > 0
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
    : null;

  // STRICT ISOLATION: only this learner's curriculum.
  const learnerSubjects = subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade);
  const subjectStats = learnerSubjects.map((s) => {
    const topics = Object.keys(QUESTIONS[s.id] || {});
    let attempts = 0, correct = 0, masterySum = 0;
    topics.forEach((t) => {
      const p = state.progress?.[s.id]?.[t];
      if (p) { attempts += p.attempts || 0; correct += p.correct || 0; masterySum += p.mastery || 0; }
    });
    return { ...s, attempts, correct, mastery: topics.length ? Math.round(masterySum / topics.length) : 0 };
  });

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 font-medium mb-4 active:scale-95" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <h2 className="font-display text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>Parent Room</h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          {learner.name} · Grade {learner.grade} · {boardLabel(learner.board)}
        </p>

        {/* OPINION-ONLY headline ----------------------------------------- */}
        <OpinionFrame
          windowText={`Across ${state.stats.totalAnswered || 0} answered question${state.stats.totalAnswered === 1 ? "" : "s"}`}
          observation={
            accuracy == null
              ? "Not enough data yet — this learner hasn't answered any quiz questions."
              : `Overall accuracy ${accuracy}%. Current streak ${state.streak} day${state.streak === 1 ? "" : "s"}.`
          }
          opinion={
            accuracy == null
              ? "This might mean the app is brand new on this device, or the kid is exploring non-quiz rooms first."
              : accuracy >= 80
                ? "This might mean the difficulty is currently a good fit — the kid is mostly getting things right but still being challenged."
                : accuracy >= 60
                  ? "This might mean the kid is in their stretch zone — getting most things right but pushing into harder material."
                  : "This might mean specific topics need a parent-side conversation or a slower re-walk — not a sign of effort."
          }
          escalation={
            accuracy != null && accuracy < 50 && state.stats.totalAnswered >= 20
              ? "Worth a calm chat with the class teacher to compare notes — this is the kind of pattern that's better untangled together than guessed at alone."
              : undefined
          }
        />

        {/* Family note --------------------------------------------------- */}
        <FamilyNoteComposer
          name={learner.name || "your learner"}
          note={learner.familyNote}
          onChange={(next) => onUpdateLearner({ familyNote: next })}
        />

        {/* Kid's recent reflections (verbatim) --------------------------- */}
        <RecentReflections state={state} name={learner.name || "your learner"} />

        {/* Wellness signals ---------------------------------------------- */}
        <WellnessSignals state={state} subjectStats={subjectStats} />

        {/* Upcoming exams ------------------------------------------------ */}
        <ExamManager
          exams={learner.upcomingExams || []}
          subjects={learnerSubjects.map((s) => ({ id: s.id, name: s.name }))}
          onChange={(next) => onUpdateLearner({ upcomingExams: next })}
        />

        {/* Capability map ------------------------------------------------ */}
        <CapabilityMap learner={learner} onUpdateLearner={onUpdateLearner} />


        {/* Stat grid (filtered to this kid) ----------------------------- */}
        <h3 className="font-display text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Snapshot</h3>
        <div className="glass-card p-5 mb-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Questions", value: state.stats.totalAnswered },
              { label: "Accuracy", value: accuracy == null ? "—" : `${accuracy}%` },
              { label: "Quizzes Done", value: state.stats.quizzesCompleted },
              { label: "Daily Quests", value: state.stats.dailyQuestsCompleted },
              { label: "Current Streak", value: `${state.streak} d` },
              { label: "Longest Streak", value: `${state.longestStreak || 0} d` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-faint)" }}>{label}</div>
                <div className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject mastery — learner's curriculum only ------------------ */}
        <h3 className="font-display text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Subject mastery</h3>
        <div className="space-y-2 mb-6">
          {subjectStats.length === 0 && (
            <div className="glass-card p-4 text-xs" style={{ color: "var(--text-muted)" }}>
              No subjects picked yet for this learner.
            </div>
          )}
          {subjectStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.soft }}>
                    <Icon className="w-5 h-5" style={{ color: s.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold ${s.isDeva ? "font-deva" : ""}`} style={{ color: "var(--text)" }}>{s.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.attempts} attempts · {s.correct} correct</div>
                  </div>
                  <div className="font-bold font-display text-lg" style={{ color: "var(--text)" }}>{s.mastery}%</div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.mastery}%`, background: s.accent, boxShadow: `0 0 6px ${s.glow}` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset (last) -------------------------------------------------- */}
        <div className="glass-card p-4" style={{ border: "1px solid rgba(244, 114, 182, 0.35)" }}>
          <div className="font-bold mb-2 flex items-center gap-1.5" style={{ color: "#F472B6" }}>
            <RotateCcw className="w-4 h-4" /> Reset {learner.name}'s progress
          </div>
          <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            Clears XP, badges, missed-questions, streaks — for this learner only. Other learners are untouched. Cannot be undone.
          </div>
          {!resetConfirm ? (
            <Button variant="danger" size="sm" onClick={() => setResetConfirm(true)}>Reset this learner</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={onReset}>Yes, reset {learner.name}</Button>
              <Button variant="ghost" size="sm" onClick={() => setResetConfirm(false)}>Cancel</Button>
            </div>
          )}
        </div>

        {/* PIN management ----------------------------------------------- */}
        <button
          className="mt-4 text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5"
          style={{ color: "var(--text-faint)" }}
          onClick={() => {
            if (confirm("Change the parent PIN? You'll be prompted to set a new one.")) {
              onUpdateLearner({ parentPin: undefined });
              setPhase("set");
              setSetPinValue("");
              setConfirmPinValue("");
            }
          }}
        >
          <KeyRound className="w-3 h-3" /> Change PIN
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PIN scaffold + field
// -----------------------------------------------------------------------------

function PinScaffold({
  onBack, title, subtitle, children,
}: {
  onBack: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 font-medium mb-6 active:scale-95" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft className="w-5 h-5" /> Home
        </button>
        <div className="glass-card p-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--accent-soft)" }}>
            <Lock className="w-6 h-6" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-display text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>{title}</h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function PinField({
  label, value, onChange, show, onToggleShow, autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow?: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="flex items-center gap-2">
        <input
          type={show ? "text" : "password"}
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="flex-1 px-4 py-3 rounded-xl text-center text-2xl font-display font-bold tracking-[0.4em]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          placeholder="••••"
        />
        {onToggleShow && (
          <button
            type="button"
            onClick={onToggleShow}
            className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-95"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            aria-label={show ? "Hide PIN" : "Show PIN"}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Opinion frame (inline; mirrors the /parent OpinionCard primitive)
// -----------------------------------------------------------------------------

function OpinionFrame({
  windowText, observation, opinion, escalation,
}: {
  windowText: string;
  observation: string;
  opinion: string;
  escalation?: string;
}) {
  return (
    <div className="glass-card p-5 mb-5" style={{ borderTop: "2px solid var(--accent)" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <Info className="w-3 h-3" style={{ color: "var(--accent)" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Opinion · {windowText}
        </span>
      </div>
      <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{observation}</div>
      <div className="text-sm italic" style={{ color: "var(--text-muted)" }}>{opinion}</div>
      {escalation && (
        <div className="mt-3 pt-3 text-xs" style={{ borderTop: "1px dashed var(--border)", color: "var(--text-muted)" }}>
          <span className="font-bold" style={{ color: "var(--text)" }}>What to do next: </span>{escalation}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Exam manager
// -----------------------------------------------------------------------------

function ExamManager({
  exams, subjects, onChange,
}: {
  exams: ExamDate[];
  subjects: { id: SubjectId; name: string }[];
  onChange: (next: ExamDate[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftSubject, setDraftSubject] = useState<SubjectId | "">("");

  const sorted = useMemo(
    () => [...exams].sort((a, b) => a.date.localeCompare(b.date)),
    [exams],
  );

  const add = () => {
    if (!draftTitle.trim() || !draftDate) return;
    const id = `exam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    onChange([
      ...exams,
      { id, title: draftTitle.trim(), date: draftDate, subjectId: draftSubject || undefined },
    ]);
    setDraftTitle(""); setDraftDate(""); setDraftSubject("");
    setAdding(false);
    sfx.coin();
  };

  const remove = (id: string) => {
    onChange(exams.filter((e) => e.id !== id));
    sfx.click();
  };

  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
            Upcoming exams
          </span>
        </div>
        {!adding && (
          <button
            onClick={() => { sfx.click(); setAdding(true); }}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest font-bold active:scale-95"
            style={{ color: "var(--text-muted)" }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {sorted.length === 0 && !adding && (
        <div className="text-xs italic" style={{ color: "var(--text-faint)" }}>
          No exams logged. Add one and the kid sees a countdown on the home screen.
        </div>
      )}

      <div className="space-y-2">
        {sorted.map((e) => {
          const daysAway = daysUntil(e.date);
          return (
            <div key={e.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "var(--surface)" }}>
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                style={{
                  background: daysAway <= 1 ? "rgba(244, 114, 182, 0.2)" : daysAway <= 7 ? "rgba(251, 191, 36, 0.18)" : "var(--accent-soft)",
                  color: daysAway <= 1 ? "#F472B6" : daysAway <= 7 ? "#FBBF24" : "var(--accent)",
                }}
              >
                <div className="font-display text-base font-bold leading-none">{daysAway < 0 ? "—" : daysAway}</div>
                <div className="text-[9px] uppercase tracking-widest font-bold leading-none mt-0.5">
                  {daysAway < 0 ? "past" : daysAway === 1 ? "day" : "days"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{e.title}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{prettyDate(e.date)}</div>
              </div>
              <button
                onClick={() => remove(e.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-95"
                style={{ background: "transparent", color: "var(--text-faint)" }}
                aria-label="Remove exam"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {adding && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: "1px dashed var(--border)" }}>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Title (e.g. Physics — Electricity)"
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <input
            type="date"
            value={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          {subjects.length > 0 && (
            <select
              value={draftSubject}
              onChange={(e) => setDraftSubject(e.target.value as SubjectId | "")}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <option value="">No subject link (optional)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={add} disabled={!draftTitle.trim() || !draftDate}>
              <GraduationCap className="w-3.5 h-3.5" /> Save exam
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setDraftTitle(""); setDraftDate(""); setDraftSubject(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + "T00:00:00");
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function prettyDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function boardLabel(board: LearnerProfile["board"]): string {
  switch (board) {
    case "cambridge-primary": return "Cambridge Primary";
    case "cambridge-igcse": return "Cambridge IGCSE";
    case "icse": return "ICSE / CISCE";
    case "cbse": return "CBSE / NCERT";
    default: return board;
  }
}

// -----------------------------------------------------------------------------
// Recent reflections — the kid's verbatim end-of-day thoughts (last 3).
// This is the most intimate surface; treat it with care.
// -----------------------------------------------------------------------------

export function RecentReflections({ state, name }: { state: GameState; name: string }) {
  const reflections = state.dailyReflections || [];
  const recent = useMemo(
    () => [...reflections].sort((a, b) => b.savedAt.localeCompare(a.savedAt)).slice(0, 3),
    [reflections],
  );

  if (recent.length === 0) return null;

  return (
    <div className="glass-card p-5 mb-5" style={{ borderTop: "2px solid #A78BFA" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <NotebookPen className="w-3.5 h-3.5" style={{ color: "#A78BFA" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#A78BFA" }}>
          {name}'s recent reflections
        </span>
      </div>
      <div className="text-xs italic mb-4" style={{ color: "var(--text-muted)" }}>
        End-of-day thoughts the kid wrote themselves. Read once, gently. Don't quote back.
      </div>
      <div className="space-y-3">
        {recent.map((r, i) => (
          <div
            key={i}
            className="pl-3 py-1"
            style={{ borderLeft: "2px solid rgba(167,139,250,0.4)" }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: "var(--text-faint)" }}>
              {prettyDate(r.date)} · {prettyRelative(r.savedAt)}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {r.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Family note composer — parent writes one message; kid sees it on home
// and dismisses with "Got it". Only the most recent note is kept (saving
// overwrites). This is the first explicit human-to-human surface inside
// Vidya — not configuration, but a real message.
// -----------------------------------------------------------------------------

export function FamilyNoteComposer({
  name, note, onChange,
}: {
  name: string;
  note?: FamilyNote;
  onChange: (next: FamilyNote | undefined) => void;
}) {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(!note);

  const save = () => {
    const body = draft.trim();
    if (!body) return;
    sfx.coin();
    onChange({ body, postedAt: new Date().toISOString(), seenAt: undefined });
    setDraft("");
    setEditing(false);
  };

  const clear = () => {
    sfx.click();
    onChange(undefined);
    setDraft("");
    setEditing(true);
  };

  return (
    <div className="glass-card p-4 mb-5" style={{ borderTop: "2px solid #F472B6" }}>
      <div className="flex items-center gap-1.5 mb-3">
        <Heart className="w-3.5 h-3.5" style={{ color: "#F472B6" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#F472B6" }}>
          Note to {name}
        </span>
      </div>

      {note && !editing ? (
        <div>
          <div
            className="rounded-[var(--radius-md)] px-4 py-3 mb-3"
            style={{ background: "rgba(244, 114, 182, 0.10)", border: "1px solid rgba(244,114,182,0.25)" }}
          >
            <div className="text-sm whitespace-pre-wrap" style={{ color: "var(--text)" }}>
              {note.body}
            </div>
            <div className="text-[11px] mt-2" style={{ color: "var(--text-faint)" }}>
              Sent {prettyRelative(note.postedAt)} ·{" "}
              {note.seenAt
                ? <span style={{ color: "var(--success)" }}>seen {prettyRelative(note.seenAt)}</span>
                : <span style={{ color: "var(--text-muted)" }}>not seen yet</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { setEditing(true); setDraft(note.body); }}>
              <Send className="w-3.5 h-3.5" /> Replace
            </Button>
            <Button size="sm" variant="ghost" onClick={clear}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 280))}
            placeholder={`A short message ${name} will see at the top of their home screen. (280 chars)`}
            rows={3}
            className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm resize-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{draft.length}/280</span>
            <div className="flex gap-2">
              {note && (
                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDraft(""); }}>
                  Cancel
                </Button>
              )}
              <Button size="sm" onClick={save} disabled={!draft.trim()}>
                <Send className="w-3.5 h-3.5" /> {note ? "Replace note" : "Send to home"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function prettyRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

// -----------------------------------------------------------------------------
// Wellness signals — Counsellor-style opinion-only digest.
//
// Soft observations computed from local state. Each finding is wrapped
// in the same window / observation / opinion shape as the headline.
// All language is non-judgemental — the kid is never "behind", they
// have a "rhythm" or a "stretch zone" or a "backlog worth a slower
// walk-through". Per [[analytics-opinion-only]] we never claim.
// -----------------------------------------------------------------------------

type SignalTone = "warm" | "neutral" | "concern";

type Signal = {
  windowText: string;
  observation: string;
  opinion: string;
  tone: SignalTone;
};

export function WellnessSignals({
  state, subjectStats,
}: {
  state: GameState;
  subjectStats: { id: SubjectId; name: string; attempts: number; correct: number; mastery: number }[];
}) {
  const signals = useMemo<Signal[]>(() => {
    const out: Signal[] = [];

    // Signal 1 — Streak rhythm
    const cur = state.streak ?? 0;
    const longest = state.longestStreak ?? 0;
    if (longest > 0 || cur > 0) {
      const ratio = longest > 0 ? cur / longest : 0;
      out.push({
        windowText: "Streak · current vs longest",
        observation: `Current streak: ${cur} day${cur === 1 ? "" : "s"}. Longest ever: ${longest} day${longest === 1 ? "" : "s"}.`,
        opinion:
          longest === 0
            ? "This might mean it's still early — give it a week or two of light use before reading anything into the numbers."
            : ratio >= 0.7
              ? "This might mean a strong steady rhythm — keep doing what you're doing."
              : ratio >= 0.3
                ? "This might mean a typical week. Streaks rise and fall; nothing here calls for action."
                : "This might mean a recent pause — busy week, illness, or just a break. Worth a gentle check-in, not a push.",
        tone: longest === 0 ? "neutral" : ratio >= 0.3 ? "warm" : "concern",
      });
    }

    // Signal 2 — Review backlog (Wrong-Answer Notebook)
    const misses = state.missedQuestions?.length ?? 0;
    out.push({
      windowText: "Wrong-Answer Notebook",
      observation:
        misses === 0
          ? "Zero questions waiting for a second try."
          : `${misses} question${misses === 1 ? "" : "s"} waiting for a second try.`,
      opinion:
        misses === 0
          ? "This might mean either no quizzes attempted yet OR every miss has been answered correctly later — both are healthy."
          : misses <= 5
            ? "This might mean the kid is in their stretch zone — a small backlog of 1–5 is normal and a sign of learning, not falling behind."
            : "This might mean a few specific topics need a slower walk-through together rather than another quiz attempt.",
      tone: misses === 0 ? "warm" : misses <= 5 ? "neutral" : "concern",
    });

    // Signal 3 — Daily quest engagement
    const dq = state.stats?.dailyQuestsCompleted ?? 0;
    if (state.stats?.totalAnswered && state.stats.totalAnswered > 0) {
      out.push({
        windowText: "Daily quest engagement",
        observation: `${dq} daily quest${dq === 1 ? "" : "s"} completed lifetime.`,
        opinion:
          dq === 0
            ? "This might mean daily quests aren't on their radar yet — try walking them through it once together."
            : dq < 7
              ? "This might mean it's becoming a habit — the second week tends to be when it sticks."
              : "This might mean a real ritual has formed. Worth celebrating out loud now and then.",
        tone: dq === 0 ? "concern" : dq < 7 ? "neutral" : "warm",
      });
    }

    // Signal 4 — Reflection cadence
    const reflections = state.dailyReflections || [];
    if (reflections.length > 0) {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recent = reflections.filter((r) => new Date(r.savedAt).getTime() >= cutoff).length;
      out.push({
        windowText: "Reflection cadence · last 7 days",
        observation: `${recent} reflection${recent === 1 ? "" : "s"} written in the last week.`,
        opinion:
          recent >= 5
            ? "This might mean a real journaling habit is forming. They're processing the day in their own words."
            : recent >= 2
              ? "This might mean reflection is becoming part of the rhythm — keep noticing it out loud."
              : "This might mean today's prompt was a one-off. Let it land naturally, no need to push.",
        tone: recent >= 2 ? "warm" : "neutral",
      });
    }

    // Signal 5 — Subject concentration
    const totalAttempts = subjectStats.reduce((s, x) => s + x.attempts, 0);
    if (totalAttempts >= 20) {
      const top = subjectStats.slice().sort((a, b) => b.attempts - a.attempts)[0];
      if (top && top.attempts > 0) {
        const pct = Math.round((top.attempts / totalAttempts) * 100);
        if (pct >= 60) {
          out.push({
            windowText: "Subject spread",
            observation: `${pct}% of attempts have been in ${top.name}.`,
            opinion:
              "This might mean a current passion (great!) or quiet avoidance of other subjects. Worth checking — both are useful to know.",
            tone: "neutral",
          });
        }
      }
    }

    return out;
  }, [state, subjectStats]);

  if (signals.length === 0) return null;

  return (
    <div className="glass-card p-5 mb-5" style={{ borderTop: "2px solid var(--accent)" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <Info className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Wellness signals
        </span>
      </div>
      <div className="text-xs italic mb-4" style={{ color: "var(--text-muted)" }}>
        Soft observations from the last few sessions. Read together with your kid, not at them.
        Nothing here is a verdict.
      </div>
      <div className="space-y-3">
        {signals.map((s, i) => (
          <SignalRow key={i} signal={s} />
        ))}
      </div>
    </div>
  );
}

function SignalRow({ signal }: { signal: Signal }) {
  const palette =
    signal.tone === "warm"
      ? { dot: "var(--success)", bar: "rgba(52, 211, 153, 0.35)" }
      : signal.tone === "concern"
        ? { dot: "#FBBF24", bar: "rgba(251, 191, 36, 0.35)" }
        : { dot: "var(--accent)", bar: "var(--border-strong)" };
  return (
    <div className="pl-3 py-1" style={{ borderLeft: `2px solid ${palette.bar}` }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.dot }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: palette.dot }}>
          {signal.windowText}
        </span>
      </div>
      <div className="text-sm font-medium mb-0.5" style={{ color: "var(--text)" }}>
        {signal.observation}
      </div>
      <div className="text-xs italic" style={{ color: "var(--text-muted)" }}>
        {signal.opinion}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Capability map — parent-visible only. Shows what this learner can use right
// now and what's queued at higher rungs. The kid never sees this surface.
// See [[verification-ladder]] and [[parent-invisible-config]].
// -----------------------------------------------------------------------------

const CAPABILITY_LABEL: Record<CapabilityKey, string> = {
  "ai.tutor.limited":    "AI tutor — rate-limited",
  "ai.tutor.full":       "Miss Vidya — full AI tutor",
  "share.crossNetwork":  "Share streaks across networks",
  "byok.openai":         "Bring your own OpenAI key",
  "byok.anthropic":      "Bring your own Anthropic key",
  "byok.google":         "Bring your own Gemini key",
  "byok.grok":           "Bring your own Grok key",
  "byok.openrouter":     "Bring your own OpenRouter key",
  "incognito.enabled":   "Incognito learner mode",
  "health.profile":      "Health profile & care layer",
  "exam.alertsToParent": "Exam-day alerts to your dashboard",
};

const RUNG_NAME: Record<VerificationLevel, string> = {
  0: "open",
  1: "same-network",
  2: "parent-verified",
  3: "strict-verified",
};

const RUNG_HOW_TO_PROMOTE: Record<VerificationLevel, string> = {
  0: "Default — available the moment a profile exists.",
  1: "Auto-promotes when the kid's session matches your Wi-Fi. Coming soon.",
  2: "Set a parent PIN on this learner. You're already here.",
  3: "Strict review by our team. Coming when BYOK / medical features ship.",
};

export function CapabilityMap({
  learner, onUpdateLearner,
}: {
  learner: LearnerProfile;
  onUpdateLearner: (patch: Partial<Omit<LearnerProfile, "state" | "id">>) => void;
}) {
  const rung = computeRung(learner);
  const disabled = new Set(learner.disabledCapabilities || []);
  const grouped = useMemo(() => {
    const m: Record<VerificationLevel, CapabilityKey[]> = { 0: [], 1: [], 2: [], 3: [] };
    for (const key of Object.keys(CAPABILITY_POLICIES) as CapabilityKey[]) {
      const r = CAPABILITY_POLICIES[key].minRung as VerificationLevel;
      m[r].push(key);
    }
    return m;
  }, []);

  const toggle = (key: CapabilityKey) => {
    sfx.click();
    const next = new Set(disabled);
    if (next.has(key)) next.delete(key); else next.add(key);
    onUpdateLearner({ disabledCapabilities: Array.from(next) });
  };

  return (
    <div className="glass-card p-5 mb-5" style={{ borderTop: "2px solid var(--accent)" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
          Capabilities · this learner is at rung {rung} · {RUNG_NAME[rung]}
        </span>
      </div>
      <div className="text-xs italic mb-4" style={{ color: "var(--text-muted)" }}>
        Each capability has a verification rung. Rooms appear in the kid's lobby only when their rung meets the rule.
        The kid never sees a locked door — features are simply present or absent.
      </div>

      <div className="space-y-4">
        {([0, 1, 2, 3] as VerificationLevel[]).map((r) => {
          const keys = grouped[r];
          if (keys.length === 0) return null;
          const open = rung >= r;
          return (
            <div key={r}>
              <div className="flex items-center gap-2 mb-1.5">
                {open ? (
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
                )}
                <span
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: open ? "var(--success)" : "var(--text-faint)" }}
                >
                  Rung {r} · {RUNG_NAME[r]} {open ? "· active" : "· not yet"}
                </span>
              </div>
              <div className="text-[11px] italic mb-2 pl-5" style={{ color: "var(--text-faint)" }}>
                {RUNG_HOW_TO_PROMOTE[r]}
              </div>
              <ul className="space-y-1.5 pl-5">
                {keys.map((k) => {
                  const isDisabled = disabled.has(k);
                  const effectiveOn = open && !isDisabled;
                  return (
                    <li key={k} className="text-xs flex items-center gap-2 justify-between">
                      <div className="flex items-baseline gap-2 min-w-0 flex-1">
                        <span className="text-[10px]" style={{ color: effectiveOn ? "var(--success)" : "var(--text-faint)" }}>
                          {effectiveOn ? "✓" : isDisabled ? "✗" : "·"}
                        </span>
                        <span
                          className="truncate"
                          style={{
                            color: effectiveOn ? "var(--text)" : isDisabled ? "var(--text-muted)" : "var(--text-muted)",
                            opacity: open ? 1 : 0.55,
                            textDecoration: isDisabled ? "line-through" : "none",
                          }}
                        >
                          {CAPABILITY_LABEL[k]}
                        </span>
                      </div>
                      {open ? (
                        <button
                          onClick={() => toggle(k)}
                          className="text-[9px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 flex-shrink-0 active:scale-95"
                          style={{
                            background: isDisabled ? "var(--surface)" : "rgba(52, 211, 153, 0.15)",
                            color: isDisabled ? "var(--text-faint)" : "var(--success)",
                            border: `1px solid ${isDisabled ? "var(--border)" : "rgba(52, 211, 153, 0.4)"}`,
                          }}
                        >
                          {isDisabled ? "Off" : "On"}
                        </button>
                      ) : (
                        <span className="text-[9px] uppercase tracking-widest font-bold flex-shrink-0" style={{ color: "var(--text-faint)" }}>
                          —
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
