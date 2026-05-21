"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, Sparkles, BookOpen } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Mascot } from "@/components/ui/mascot";
import { DiyaCompanion } from "@/components/effects/diya";
import { SUBJECT_MAP, subjectsForLearner } from "@/lib/content/subjects";
import type { GameState, LearnerProfile, SubjectId } from "@/lib/types";
import { sfx } from "@/lib/audio";
import { useCapability } from "@/lib/capabilities/use-capability";

const SUGGESTED: Partial<Record<SubjectId, string[]>> = {
  maths:    ["What is 25% of 80?", "How do I add 1/2 + 1/4?", "Explain BODMAS in 2 lines"],
  science:  ["Why do magnets attract iron?", "What is upthrust?", "Why does the Moon change shape?"],
  english:  ["Difference between simile and metaphor?", "Use 'although' in a sentence", "Active vs passive voice"],
  hindi:    ["संज्ञा क्या है?", "विलोम और पर्यायवाची में अंतर?", "एक छोटा मुहावरा बताओ"],
  marathi:  ["समानार्थी म्हणजे काय?", "'अति तेथे माती' म्हण समजावा", "नाम म्हणजे काय?"],
  gk:       ["Who founded ISRO?", "Why do we have seasons?", "What is the capital of Maharashtra?"],
  "igcse-cs": [
    "Convert 173 to 8-bit binary, step by step",
    "Pseudocode to find max in array Score[1:20]",
    "What's the difference between validation and verification?",
    "SQL: list Name, Grade from STUDENT where Year=10 order by Grade descending",
    "Truth table for X = (A AND B) OR NOT C",
  ],
  "igcse-maths": ["Solve 3x + 5 = 20", "Pythagoras for 3-4-? triangle", "Factorise x² - 5x + 6"],
  "igcse-physics": ["Define upthrust", "V = IR — give a 2-line example", "Difference between speed and velocity?"],
  "igcse-chemistry": ["What's an ionic bond?", "Why does sodium react fast with water?", "Mole calculation: 5g NaOH → moles?"],
  "igcse-biology": ["Cell vs organ — give a 2-line difference", "Photosynthesis word equation", "What is osmosis?"],
  "igcse-english": ["Plan a descriptive paragraph about Pune monsoon", "Active vs passive voice — exam-style example", "What's a directed-writing task?"],
};

export function TutorView({
  state, learner, initialSubject, onBack,
}: {
  state: GameState;
  learner: LearnerProfile;
  initialSubject?: SubjectId;
  onBack: () => void;
}) {
  const aiTutorAllowed = useCapability("ai.tutor.full").allowed;

  const subjectList = subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade);
  const defaultSubject: SubjectId =
    initialSubject && subjectList.find((s) => s.id === initialSubject)
      ? initialSubject
      : (subjectList[0]?.id || "maths");
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubject);
  const [input, setInput] = useState("");
  const subject = SUBJECT_MAP[subjectId] || subjectList[0];

  // Deep-link defense: if a kid lands here without rung-2 (no parent PIN
  // set on this learner), render a neutral placeholder rather than
  // exposing the AI surface. The kid sees no gate explanation — per
  // [[parent-invisible-config]] the room is simply "preparing".
  if (!aiTutorAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-7xl mb-4 opacity-60">🌒</div>
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            This room isn't open yet
          </h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
            Try the Library, Field Trip, or Music room instead — they're already waiting.
          </p>
          <button
            onClick={() => { sfx.click(); onBack(); }}
            className="rounded-[var(--radius-md)] px-5 py-2.5 text-sm font-semibold active:scale-95"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <ChevronLeft className="w-4 h-4 inline -mt-0.5" /> Back to school
          </button>
        </div>
      </div>
    );
  }
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/tutor",
        body: () => ({
          subject: subjectId,
          name: state.name,
          grade: learner.grade,
          board: learner.board,
          school: learner.school,
          interests: learner.interests,
          careNote: learner.careNote,
          aiTone: learner.aiTone,
        }),
      }),
    [subjectId, state.name, learner.grade, learner.board, learner.interests, learner.careNote, learner.aiTone, learner.school],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({ transport });

  // Reset chat when switching classroom
  useEffect(() => {
    setMessages([]);
  }, [subjectId, setMessages]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 9_999_999, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sfx.click();
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto flex flex-col">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-300" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-fuchsia-300">Miss Vidya AI</span>
        </div>
      </div>

      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${subject.soft} 0%, rgba(34,211,238,0.1) 100%)`,
            border: `1px solid ${subject.accent}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <Mascot avatarId="owl" size="md" />
            <div className="flex-1">
              <div className={`font-display text-2xl font-bold text-white ${subject.isDeva ? "font-deva" : ""}`}>
                Miss Vidya · {subject.name}
              </div>
              <div className="text-sm text-white/70">
                Ask anything. I'll explain at your pace.
              </div>
            </div>
            <DiyaCompanion state={state} size="sm" showNudge={false} />
          </div>

          <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {subjectList.map((s) => {
              const Icon = s.icon;
              const active = s.id === subjectId;
              return (
                <button
                  key={s.id}
                  onClick={() => { sfx.click(); setSubjectId(s.id); }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    active ? "shadow-lg" : "opacity-60 hover:opacity-100"
                  } ${s.isDeva ? "font-deva" : ""}`}
                  style={{
                    background: active ? s.soft : "rgba(255,255,255,0.04)",
                    color: active ? s.accent : "rgba(255,255,255,0.6)",
                    boxShadow: active ? `0 0 12px ${s.glow}` : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.name}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollerRef}
        className="flex-1 px-5 overflow-y-auto"
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-4 mb-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <div className="text-[11px] uppercase tracking-widest font-bold text-white/50">Quick starts</div>
              </div>
              <div className="space-y-2">
                {(SUGGESTED[subjectId] || [`Tell me about ${subject.name} for my next test`, `Give me one practice question on ${subject.name}`, `Quick summary of today's ${subject.name} topic`]).map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className={`w-full text-left rounded-2xl border border-white/5 px-3.5 py-2.5 text-sm text-white/85 hover:bg-white/[0.06] active:scale-[0.99] transition ${subject.isDeva ? "font-deva" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {messages.map((m) => {
            const isUser = m.role === "user";
            const content = m.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    isUser
                      ? "text-white"
                      : "glass text-white/90"
                  } ${subject.isDeva ? "font-deva" : ""}`}
                  style={
                    isUser
                      ? { background: "linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)" }
                      : {}
                  }
                >
                  {content || (m.role === "assistant" && status === "streaming" ? "…" : "")}
                </div>
              </motion.div>
            );
          })}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 text-white/60 text-sm">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  Miss Vidya is thinking…
                </motion.span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-2xl bg-rose-500/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-200">
            Something went wrong. {error.message ? `(${error.message})` : "Try again in a moment."}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-2xl mx-auto px-5 pb-5 pt-2" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,4,32,0.9) 30%, rgba(10,4,32,1) 100%)" }}>
          <form
            onSubmit={(e) => { e.preventDefault(); submit(input); }}
            className="flex items-end gap-2 rounded-3xl glass-strong p-2 pr-1"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder={`Ask Miss Vidya about ${subject.name}…`}
              className={`flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-white/30 resize-none max-h-32 ${subject.isDeva ? "font-deva" : ""}`}
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "streaming" || status === "submitted"}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition"
              style={{ background: "linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)" }}
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] text-white/30">
            Miss Vidya is AI. She tries her best but can make mistakes — always double-check important answers.
          </div>
        </div>
      </div>
    </div>
  );
}
