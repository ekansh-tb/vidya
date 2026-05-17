"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, NotebookPen, Save, Check } from "lucide-react";
import { SUBJECTS, SUBJECT_MAP } from "@/lib/content/subjects";
import type { GameState, SubjectId } from "@/lib/types";
import { sfx } from "@/lib/audio";

export function NotebookView({
  state, setState, onBack, initialSubject,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  initialSubject?: SubjectId;
}) {
  const [subjectId, setSubjectId] = useState<SubjectId>(initialSubject || "maths");
  const subject = SUBJECT_MAP[subjectId];
  const stored = state.notebook?.[subjectId] || "";
  const [text, setText] = useState(stored);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setText(state.notebook?.[subjectId] || "");
  }, [subjectId, state.notebook]);

  // Auto-save debounced
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (text === (state.notebook?.[subjectId] || "")) return;
    debounceRef.current = window.setTimeout(() => {
      setState((p) => ({
        ...p,
        notebook: { ...(p.notebook || {}), [subjectId]: text },
      }));
      setSavedAt(Date.now());
    }, 600);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, subjectId]);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const charCount = text.length;

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto flex flex-col">
      <div className="px-5 pt-6 pb-3">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-3 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 blur-3xl" style={{ background: subject.accent }} />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: subject.soft }}>
              <NotebookPen className="w-6 h-6" style={{ color: subject.accent }} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/50">Notebook</div>
              <div className={`font-display text-2xl font-bold text-white ${subject.isDeva ? "font-deva" : ""}`}>
                {subject.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Saved</div>
              <div className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                {savedAt ? <><Check className="w-3 h-3" /> Auto</> : "Idle"}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            const active = s.id === subjectId;
            return (
              <button
                key={s.id}
                onClick={() => { sfx.click(); setSubjectId(s.id); }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  active ? "shadow-lg" : "opacity-60"
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
      </div>

      <div className="flex-1 px-5">
        <div className="glass-card p-0 overflow-hidden relative" style={{ minHeight: "55vh" }}>
          {/* Ruled-paper feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "repeating-linear-gradient(180deg, transparent 0, transparent 27px, rgba(255,255,255,0.06) 28px)",
            }}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write your ${subject.name} notes here. They save automatically.`}
            className={`relative w-full h-full min-h-[55vh] bg-transparent outline-none p-5 pt-6 text-white placeholder-white/30 leading-7 resize-none ${subject.isDeva ? "font-deva" : ""}`}
            spellCheck
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
          <div>{wordCount} words · {charCount} characters</div>
          <button
            onClick={() => {
              sfx.click();
              setState((p) => ({ ...p, notebook: { ...(p.notebook || {}), [subjectId]: text } }));
              setSavedAt(Date.now());
            }}
            className="flex items-center gap-1 rounded-full glass px-3 py-1 active:scale-95"
          >
            <Save className="w-3 h-3" /> Save now
          </button>
        </div>
      </div>
    </div>
  );
}
