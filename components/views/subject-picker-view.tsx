"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, GraduationCap, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP, pickerGroupsForBoard } from "@/lib/content/subjects";
import type { SubjectId, LearnerProfile } from "@/lib/types";
import { sfx } from "@/lib/audio";

export function SubjectPickerView({
  learner, onSave,
}: {
  learner: LearnerProfile;
  onSave: (picked: SubjectId[]) => void;
}) {
  const groups = useMemo(() => pickerGroupsForBoard(learner.board, learner.grade), [learner.board, learner.grade]);
  const compulsory = useMemo(
    () => new Set<SubjectId>(groups.flatMap((g) => g.compulsoryIds || [])),
    [groups],
  );
  const [picked, setPicked] = useState<Set<SubjectId>>(
    () => new Set<SubjectId>([...(learner.pickedSubjects || []), ...compulsory]),
  );

  const toggle = (id: SubjectId) => {
    if (compulsory.has(id)) return;
    sfx.click();
    setPicked((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalChosen = picked.size;
  const optionalCount = totalChosen - compulsory.size;
  const boardLabel =
    learner.board === "cambridge-igcse" ? "Cambridge IGCSE"
    : learner.board === "icse" ? "ICSE (CISCE)"
    : "Cambridge Primary";

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto">
      <div className="px-5 pt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-3" style={{ background: "rgba(167,139,250,0.18)", boxShadow: "0 0 30px rgba(167,139,250,0.4)" }}>
            <GraduationCap className="w-8 h-8 text-violet-300" />
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--accent)" }}>{learner.school || boardLabel} · Grade {learner.grade}</div>
          <h1 className="font-display text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>Pick your subjects</h1>
          <p className="text-sm mt-2 px-4" style={{ color: "var(--text-muted)" }}>
            Welcome {learner.name.split(" ")[0]}. Tap the optionals you&apos;re actually taking. The compulsory ones are picked for you.
          </p>
        </motion.div>

        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="text-white/60">
            <span className="text-white font-bold">{totalChosen}</span> chosen
            <span className="text-white/40"> · {optionalCount} optional</span>
          </div>
          <div className="text-white/40">Min 6 · ICE award needs 7 across groups</div>
        </div>

        {groups.map((g, gi) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + gi * 0.04 }}
            className="mb-5"
          >
            <div className="mb-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">{g.label}</div>
              <div className="text-[11px] text-white/50">{g.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {g.subjects.map((sid) => {
                const s = SUBJECT_MAP[sid];
                if (!s) return null;
                const Icon = s.icon;
                const isPicked = picked.has(sid);
                const isCompulsory = compulsory.has(sid);
                return (
                  <button
                    key={sid}
                    onClick={() => toggle(sid)}
                    disabled={isCompulsory}
                    className={`relative rounded-2xl p-3 text-left border transition-all ${
                      isPicked
                        ? "border-violet-400/60 bg-violet-500/15 shadow-[0_0_24px_rgba(167,139,250,0.3)]"
                        : "border-white/10 glass hover:bg-white/[0.06]"
                    } ${isCompulsory ? "cursor-default" : "active:scale-[0.98]"}`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: s.soft }}
                      >
                        <Icon className="w-5 h-5" style={{ color: s.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-display font-bold text-sm leading-tight text-white ${s.isDeva ? "font-deva" : ""}`}>
                          {s.name}
                        </div>
                        <div className="text-[10px] text-white/50 mt-0.5 truncate">{s.tagline}</div>
                      </div>
                    </div>
                    {isCompulsory && (
                      <div className="absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> required
                      </div>
                    )}
                    {isPicked && !isCompulsory && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500/30 ring-1 ring-violet-300 flex items-center justify-center">
                        <Check className="w-3 h-3 text-violet-200" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <div className="glass-card p-3 mt-3 flex items-start gap-2 text-[11px] text-white/60">
          <Info className="w-4 h-4 flex-shrink-0 text-cyan-300 mt-0.5" />
          <div>
            Marathi is mandated by the Maharashtra Compulsory Marathi Act 2020 for all schools in Maharashtra through Std 10. From AY 2025–26 it&apos;s marks-based for IGCSE students. Verify with school office if it&apos;s assessed at CNS.
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-2xl mx-auto px-5 pb-5 pt-3" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,4,32,0.95) 30%, rgba(10,4,32,1) 100%)" }}>
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              sfx.click();
              const chosen = [...picked];
              onSave(chosen);
            }}
            disabled={totalChosen < 4}
          >
            <span className="inline-flex items-center gap-2">
              Open my school <ChevronRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
