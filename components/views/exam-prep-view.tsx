"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReducedMotionProvider } from "@/components/ui/reduced-motion";
import {
  ChevronLeft, Cpu, Clock, AlertTriangle, BookOpen, Sparkles,
  CircleHelp, Code2, ListChecks, Brain, Check, X, ChevronRight,
  Rocket, NotebookPen, FileText, ExternalLink, Lightbulb, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP } from "@/lib/content/subjects";
import type { Board, GameState, SubjectId, ViewName } from "@/lib/types";
import type { ExamPack, ExamQuestion } from "@/lib/content/exam-pack";
import { hasPack } from "@/lib/content/packs/pack-index";
import { usePack } from "@/lib/content/packs/use-pack";
import { sfx } from "@/lib/audio";
import { shuffle } from "@/lib/utils";
import { useCapability } from "@/lib/capabilities/use-capability";

type SectionId = "overview" | "syllabus" | "flash" | "quiz" | "mistakes" | "cheat";

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview",   label: "Overview",     icon: Rocket },
  { id: "syllabus",   label: "Syllabus",     icon: ListChecks },
  { id: "flash",      label: "Flashcards",   icon: Brain },
  { id: "quiz",       label: "Practice",     icon: CircleHelp },
  { id: "mistakes",   label: "Traps",        icon: AlertTriangle },
  { id: "cheat",      label: "Cheat sheet",  icon: Sparkles },
];

export function ExamPrepView({
  state, setState, onBack, onNavigate, subjectId, availablePackIds, grade, school, board,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  onNavigate: (name: ViewName, params?: Record<string, unknown>) => void;
  subjectId?: SubjectId;
  /** If provided, lets the learner switch between exam packs they own. */
  availablePackIds?: SubjectId[];
  /** Learner's grade — for grade-aware pack lookup. */
  grade?: number;
  /** Learner's school + board — lets a registered school scheme of work replace
   *  the pack's generic content topics. See lib/content/school-syllabus.ts. */
  school?: string;
  board?: Board;
}) {
  const initialId = subjectId && hasPack(subjectId, grade)
    ? subjectId
    : (availablePackIds?.find((id) => hasPack(id, grade)));

  const [currentId, setCurrentId] = useState<SubjectId | undefined>(initialId);
  // Pack bodies are large and load as their own chunk — see pack-index.ts.
  const { exists: packExists, pack } = usePack(
    currentId,
    grade,
    board ? { school, board } : undefined,
  );
  const subject = currentId ? SUBJECT_MAP[currentId] : undefined;
  const [section, setSection] = useState<SectionId>("overview");
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;

  // Reset section when pack changes
  useEffect(() => { setSection("overview"); }, [currentId]);

  // Distinguish "no pack written yet" from "pack still downloading" — the
  // first is a real empty state, the second must not look like one.
  if (!packExists || !subject) {
    return (
      <div className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>
        <div className="glass-card p-6 text-center text-white/70">
          No exam pack found for this subject yet. We&apos;re still writing it.
        </div>
      </div>
    );
  }

  // Tabs only need identity, so they render from the light index without
  // pulling in any other subject's pack body.
  const switchableIds = (availablePackIds || []).filter((id) => hasPack(id, grade));

  return (
    <ReducedMotionProvider>
      <div className="min-h-screen pb-24 max-w-2xl mx-auto">
        <div className="px-5 pt-6">
          <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-4 active:scale-95">
            <ChevronLeft className="w-5 h-5" /> Home
          </button>

          {switchableIds.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 no-scrollbar">
              {switchableIds.map((id) => {
                const s = SUBJECT_MAP[id];
                const active = id === currentId;
                const Icon = s?.icon ?? Sparkles;
                return (
                  <button
                    key={id}
                    onClick={() => { sfx.click(); setCurrentId(id); }}
                    aria-pressed={active}
                    className={`flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 min-h-11 text-xs font-bold whitespace-nowrap transition-all ${
                      active ? "ring-1" : "opacity-65 hover:opacity-100"
                    }`}
                    style={{
                      background: active ? "var(--accent-soft)" : "var(--surface)",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                      boxShadow: active ? `0 0 12px var(--accent-glow)` : "none",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className={s?.isDeva ? "font-deva" : ""}>{s?.name ?? id}</span>
                  </button>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[var(--radius-lg)] p-5 mb-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--surface) 100%)",
              border: "1px solid var(--border-strong)",
            }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-30 blur-3xl" style={{ background: "var(--accent)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>
                  {pack ? pack.context : "Loading\u2026"}
                </span>
              </div>
              <div className="font-display text-3xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                {pack ? pack.title : subject.name}
              </div>
              {pack?.highlights && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pack.highlights.map((h, i) => (
                    <div key={i} className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[11px] font-semibold glass">
                      <span style={{ color: "var(--text-muted)" }}>{h.label}</span>
                      <span style={{ color: "var(--text)" }}>{h.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 no-scrollbar">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = s.id === section;
              return (
                <button
                  key={s.id}
                  onClick={() => { sfx.click(); setSection(s.id); }}
                  className={`flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    active ? "ring-1" : ""
                  }`}
                  style={{
                    background: active ? "var(--accent-soft)" : "var(--surface)",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    boxShadow: active ? `0 0 12px var(--accent-glow)` : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* The pack is fetched, so the skeleton swapping for content is a
              silent change unless it is announced. */}
          <div aria-live="polite" className="sr-only">
            {pack ? "Exam pack ready." : "Loading exam pack."}
          </div>

          {!pack ? (
            <div className="glass-card p-6 space-y-3 animate-pulse" aria-busy="true" aria-label="Loading exam pack">
              <div className="h-3.5 rounded bg-white/10 w-1/2" />
              <div className="h-2.5 rounded bg-white/[0.07] w-full" />
              <div className="h-2.5 rounded bg-white/[0.07] w-5/6" />
              <div className="h-2.5 rounded bg-white/[0.07] w-2/3" />
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {section === "overview" && (
              <OverviewSection
                key="overview"
                pack={pack}
                onJump={(s) => setSection(s)}
                onAskMissVidya={() => onNavigate("tutor", { subjectId: pack.subjectId })}
                onOpenNotebook={() => onNavigate("notebook", { subjectId: pack.subjectId })}
                aiTutorAllowed={aiTutorAllowed}
              />
            )}
            {section === "syllabus" && <SyllabusSection key="syllabus" pack={pack} state={state} setState={setState} />}
            {section === "flash" && <FlashSection key="flash" pack={pack} />}
            {section === "quiz" && <QuizSection key="quiz" pack={pack} />}
            {section === "mistakes" && <MistakesSection key="mistakes" pack={pack} />}
            {section === "cheat" && <CheatSheetSection key="cheat" pack={pack} />}
          </AnimatePresence>
          )}
        </div>
      </div>
    </ReducedMotionProvider>
  );
}

// =====================
// Overview
// =====================
function OverviewSection({
  pack, onJump, onAskMissVidya, onOpenNotebook, aiTutorAllowed,
}: {
  pack: ExamPack;
  onJump: (s: SectionId) => void;
  onAskMissVidya: () => void;
  onOpenNotebook: () => void;
  aiTutorAllowed: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {pack.pinnedRule && (
        <div className="glass-card p-4 mb-4 border" style={{ borderColor: "var(--warning)", background: "color-mix(in oklab, var(--warning) 8%, transparent)" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
            <div>
              <div className="font-display font-bold" style={{ color: "var(--warning)" }}>{pack.pinnedRule.heading}</div>
              <div className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>{pack.pinnedRule.body}</div>
            </div>
          </div>
        </div>
      )}

      <h3 className="font-display text-xl font-bold mb-3 mt-1" style={{ color: "var(--text)" }}>Tonight&apos;s plan</h3>
      <div className="space-y-2">
        {pack.plan.map((p, i) => (
          <Step key={i} n={i + 1} title={p.title} hint={p.hint} onClick={() =>
            onJump(i === 0 ? "syllabus" : i === 1 ? "flash" : i === 2 ? "quiz" : i === 3 ? "mistakes" : "cheat"
            )} />
        ))}
      </div>

      <div className={`grid ${aiTutorAllowed ? "grid-cols-2" : "grid-cols-1"} gap-2 mt-4`}>
        {aiTutorAllowed && (
          <button
            onClick={onAskMissVidya}
            className="rounded-[var(--radius-md)] p-3 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <MessageCircle className="w-4 h-4" /> Ask Miss Vidya
          </button>
        )}
        <button onClick={onOpenNotebook} className="rounded-[var(--radius-md)] p-3 flex items-center justify-center gap-2 text-sm font-semibold glass active:scale-95" style={{ color: "var(--text)" }}>
          <NotebookPen className="w-4 h-4" /> Notebook
        </button>
      </div>

      {pack.reference && (
        <div className="mt-4 text-center">
          <a href={pack.reference.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs active:scale-95" style={{ color: "var(--accent-2)" }}>
            <FileText className="w-3.5 h-3.5" /> {pack.reference.label} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

function Step({ n, title, hint, onClick }: { n: number; title: string; hint: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full glass-card p-3 flex items-center gap-3 text-left active:scale-[0.99] transition">
      <div className="w-8 h-8 rounded-[var(--radius-sm)] font-bold flex items-center justify-center text-sm"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>{title}</div>
        <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{hint}</div>
      </div>
      <ChevronRight className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
    </button>
  );
}

// =====================
// Syllabus checklist
// =====================
function SyllabusSection({ pack, state, setState }: { pack: ExamPack; state: GameState; setState: (u: (s: GameState) => GameState) => void }) {
  const [openId, setOpenId] = useState<string | null>(pack.topics[0]?.id ?? null);
  type Conf = "unknown" | "weak" | "ok" | "strong";
  const storageKey = `__cs-confidence-${pack.subjectId}`;
  const map = useMemo(() => {
    try { return JSON.parse(state.notebook?.[storageKey] || "{}") as Record<string, Conf>; }
    catch { return {} as Record<string, Conf>; }
  }, [state.notebook, storageKey]);
  const setConf = (id: string, c: Conf) => {
    sfx.click();
    setState((p) => ({
      ...p,
      notebook: { ...(p.notebook || {}), [storageKey]: JSON.stringify({ ...map, [id]: c }) },
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="text-[11px] mb-3 px-1" style={{ color: "var(--text-faint)" }}>
        Tap each topic. Tag your confidence — weak topics get priority tomorrow morning.
      </div>
      {pack.topics.map((t) => {
        const c = map[t.id] || "unknown";
        const isOpen = openId === t.id;
        return (
          <div key={t.id} className="mb-2">
            <button
              onClick={() => { sfx.click(); setOpenId(isOpen ? null : t.id); }}
              className="w-full glass-card p-3 flex items-center gap-3 text-left active:scale-[0.99] transition"
            >
              <div className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                {t.num ?? "•"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>{t.title}</div>
                <div className="text-[11px] truncate" style={{ color: "var(--text-faint)" }}>{t.blurb}</div>
              </div>
              <ConfPill conf={c} />
            </button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 mt-1 glass rounded-[var(--radius-md)]">
                  <ul className="space-y-1.5">
                    {t.syllabus.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--accent)" }}>•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-bold mr-1" style={{ color: "var(--text-faint)" }}>Confidence</span>
                    {(["weak", "ok", "strong"] as const).map((opt) => {
                      const bg =
                        c === opt
                          ? opt === "weak" ? "rgba(244,114,182,0.18)"
                            : opt === "ok" ? "rgba(251,191,36,0.18)"
                            : "var(--accent-soft)"
                          : "var(--surface)";
                      const color =
                        c === opt
                          ? opt === "weak" ? "#FBA5C9"
                            : opt === "ok" ? "#FCD34D"
                            : "var(--accent)"
                          : "var(--text-faint)";
                      return (
                        <button
                          key={opt}
                          onClick={() => setConf(t.id, opt)}
                          className="text-[11px] rounded-[var(--radius-pill)] px-2.5 py-1 font-bold uppercase tracking-wider"
                          style={{ background: bg, color }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

function ConfPill({ conf }: { conf: "unknown" | "weak" | "ok" | "strong" }) {
  if (conf === "weak") return <span className="text-[10px] font-bold uppercase tracking-wider rounded-[var(--radius-pill)] px-2 py-0.5" style={{ background: "rgba(244,114,182,0.15)", color: "#FBA5C9" }}>weak</span>;
  if (conf === "ok") return <span className="text-[10px] font-bold uppercase tracking-wider rounded-[var(--radius-pill)] px-2 py-0.5" style={{ background: "rgba(251,191,36,0.15)", color: "#FCD34D" }}>ok</span>;
  if (conf === "strong") return <span className="text-[10px] font-bold uppercase tracking-wider rounded-[var(--radius-pill)] px-2 py-0.5" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>strong</span>;
  return <ChevronRight className="w-4 h-4" style={{ color: "var(--text-faint)" }} />;
}

// =====================
// Flashcards
// =====================
function FlashSection({ pack }: { pack: ExamPack }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = pack.flashcards[idx];
  if (!card) return <div className="text-center text-white/50 py-8">No flashcards yet.</div>;
  const next = () => { sfx.click(); setIdx((i) => (i + 1) % pack.flashcards.length); setFlipped(false); };
  const prev = () => { sfx.click(); setIdx((i) => (i - 1 + pack.flashcards.length) % pack.flashcards.length); setFlipped(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="text-[11px] mb-3 px-1" style={{ color: "var(--text-faint)" }}>
        {pack.flashcards.length} must-know definitions. Tap to flip.
      </div>
      <div className="text-center mb-2 text-xs font-semibold" style={{ color: "var(--text-faint)" }}>{idx + 1} / {pack.flashcards.length}</div>
      {/* The card swaps term for definition in place; without this a screen
          reader gets no signal that the button is a two-state control. */}
      <button
        onClick={() => { sfx.click(); setFlipped((f) => !f); }}
        aria-pressed={flipped}
        className="w-full min-h-[260px] rounded-[var(--radius-lg)] p-6 flex items-center justify-center text-center relative overflow-hidden active:scale-[0.99] transition"
        style={{
          background: flipped
            ? "linear-gradient(135deg, var(--accent-soft) 0%, var(--surface) 100%)"
            : "var(--surface)",
          border: "1px solid var(--border-strong)",
        }}
      >
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-faint)" }}>{flipped ? "Definition" : "Term"}</div>
        {!flipped ? (
          <div className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>{card.term}</div>
        ) : (
          <div className="text-base leading-relaxed" style={{ color: "var(--text)" }}>{card.def}</div>
        )}
      </button>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button onClick={prev} variant="ghost" className="w-full">← Prev</Button>
        <Button onClick={next} variant="primary" className="w-full">Next →</Button>
      </div>
    </motion.div>
  );
}

// =====================
// Quiz / practice
// =====================
function QuizSection({ pack }: { pack: ExamPack }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>(() => {
    const q = pack.questions[0];
    return q?.opts ? shuffle(q.opts) : [];
  });
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const q = pack.questions[idx];
  if (!q) return <div className="text-center text-white/50 py-8">No practice questions yet.</div>;

  const choose = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setAttempted((a) => a + 1);
    if (opt === q.a) { sfx.correct(); setScore((s) => s + 1); }
    else sfx.wrong();
  };

  const next = () => {
    sfx.click();
    if (!q.opts && !revealed) {
      setRevealed(true);
      setAttempted((a) => a + 1);
      return;
    }
    const nextIdx = (idx + 1) % pack.questions.length;
    setIdx(nextIdx);
    setSelected(null);
    setRevealed(false);
    const nq = pack.questions[nextIdx];
    setShuffledOpts(nq.opts ? shuffle(nq.opts) : []);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-3 px-1 text-xs">
        <div style={{ color: "var(--text-faint)" }}>Question <span className="font-bold" style={{ color: "var(--text)" }}>{idx + 1}</span> / {pack.questions.length}</div>
        <div className="font-semibold" style={{ color: "var(--text-muted)" }}>Score {score} / {attempted}</div>
      </div>

      <div className="glass-card p-4 mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--accent)" }}>
          {topicLabelOf(pack, q.topic)}
        </div>
        <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>{q.q}</div>
      </div>

      {q.opts && shuffledOpts.length > 0 ? (
        <div className="space-y-2">
          {shuffledOpts.map((opt, i) => {
            const isSel = selected === opt;
            const isAns = opt === q.a;
            const baseStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" };
            let style: React.CSSProperties = baseStyle;
            if (revealed) {
              if (isAns) style = { ...baseStyle, background: "color-mix(in oklab, var(--accent) 14%, transparent)", borderColor: "var(--accent)", boxShadow: `0 0 0 1px var(--accent)` };
              else if (isSel) style = { ...baseStyle, background: "rgba(244, 114, 182, 0.14)", borderColor: "var(--error)", boxShadow: `0 0 0 1px var(--error)`, color: "var(--text)" };
              else style = { ...baseStyle, color: "var(--text-faint)" };
            }
            return (
              <button
                key={opt + i}
                onClick={() => choose(opt)}
                disabled={revealed}
                className="w-full p-3 rounded-[var(--radius-md)] text-left text-sm transition-all flex items-center gap-3"
                style={style}
              >
                <div className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--surface-elevated)", color: "var(--text-muted)" }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">{opt}</div>
                {revealed && isAns && <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />}
                {revealed && isSel && !isAns && <X className="w-4 h-4 flex-shrink-0" style={{ color: "var(--error)" }} />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {!revealed ? (
            <button
              onClick={() => { sfx.click(); setRevealed(true); setAttempted((a) => a + 1); }}
              className="w-full glass-card p-3 text-left text-sm active:scale-[0.99] transition"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="font-semibold" style={{ color: "var(--accent)" }}>Tap to reveal model answer →</span>
            </button>
          ) : null}
        </div>
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-[var(--radius-md)] p-4"
          style={{ border: "1px solid var(--border-strong)", background: "color-mix(in oklab, var(--accent) 6%, transparent)" }}
        >
          <div className="text-[10px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
            <Lightbulb className="w-3 h-3" /> Model answer
          </div>
          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-body" style={{ color: "var(--text)" }}>{q.model}</pre>
          {q.hint && (
            <div className="mt-2 text-[11px]" style={{ color: "var(--warning)" }}>
              <span className="font-bold uppercase tracking-wider">Tip · </span>{q.hint}
            </div>
          )}
        </motion.div>
      )}

      <Button onClick={next} variant="primary" size="lg" className="w-full mt-4">
        {idx + 1 === pack.questions.length ? "Wrap around →" : "Next question →"}
      </Button>
    </motion.div>
  );
}

function topicLabelOf(pack: ExamPack, id: ExamQuestion["topic"]): string {
  const t = pack.topics.find((x) => x.id === id);
  return t ? `${t.num ? `Topic ${t.num} · ` : ""}${t.title}` : "Topic";
}

// =====================
// Mistakes
// =====================
function MistakesSection({ pack }: { pack: ExamPack }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="text-[11px] mb-3 px-1" style={{ color: "var(--text-faint)" }}>
        Recurring traps where students lose marks.
      </div>
      <div className="space-y-3">
        {pack.mistakes.map((m, i) => (
          <div key={i} className="glass-card p-4" style={{ border: "1px solid color-mix(in oklab, var(--error) 30%, transparent)" }}>
            <div className="flex items-start gap-3 mb-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--error)" }} />
              <div className="text-sm" style={{ color: "var(--text)" }}>{m.mistake}</div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{m.fix}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// =====================
// Cheat sheet
// =====================
function CheatSheetSection({ pack }: { pack: ExamPack }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="rounded-[var(--radius-md)] p-4 mb-3 flex items-start gap-3" style={{ border: "1px solid var(--border-strong)", background: "color-mix(in oklab, var(--warning) 8%, transparent)" }}>
        <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
        <div className="text-sm" style={{ color: "var(--text)" }}>
          <strong style={{ color: "var(--warning)" }}>Read morning of the test.</strong> Compressed brain-dump — 8–10 minutes end-to-end.
        </div>
      </div>
      <div className="space-y-3">
        {pack.cheat.map((sec) => (
          <div key={sec.heading} className="glass-card p-4">
            <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--accent)" }}>{sec.heading}</div>
            <ul className="space-y-1.5">
              {sec.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>
                  <span className="flex-shrink-0" style={{ color: "var(--accent)" }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
