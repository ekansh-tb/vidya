"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, RotateCcw, Lock, KeyRound, Eye, EyeOff, CalendarClock, Plus, X, Info, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subjectsForLearner } from "@/lib/content/subjects";
import { QUESTIONS } from "@/lib/content/questions";
import type { ExamDate, GameState, LearnerProfile, SubjectId } from "@/lib/types";
import { sfx } from "@/lib/audio";

/**
 * In-kid-app Parent Room.
 *
 * Two boundaries this view enforces:
 *  1. **PIN gate** — speed bump so a kid (or sibling) tapping "Parent" on the
 *     home view can't immediately see or reset analytics. NOT real security;
 *     that lives in /sign-in via Supabase. First open prompts to set a PIN.
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

        {/* Upcoming exams ------------------------------------------------ */}
        <ExamManager
          exams={learner.upcomingExams || []}
          subjects={learnerSubjects.map((s) => ({ id: s.id, name: s.name }))}
          onChange={(next) => onUpdateLearner({ upcomingExams: next })}
        />

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
