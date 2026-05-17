"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowLeft, MapPin, Stamp, Sparkles, Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESTINATIONS, type Destination } from "@/lib/content/destinations";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";
import { shuffle } from "@/lib/utils";

const REGIONS: { id: Destination["region"]; label: string; color: string }[] = [
  { id: "space",  label: "Space",       color: "#A78BFA" },
  { id: "india",  label: "India",       color: "#F59E0B" },
  { id: "world",  label: "World",       color: "#22D3EE" },
  { id: "nature", label: "Nature",      color: "#34D399" },
];

export function FieldTripView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const dest = activeId ? DESTINATIONS.find((d) => d.id === activeId) : null;

  if (dest) {
    return (
      <TripView
        dest={dest}
        state={state}
        setState={setState}
        onBack={() => setActiveId(null)}
        onClose={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#22D3EE" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.15)" }}>
              <MapPin className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-cyan-300">Field Trip</div>
              <div className="font-display text-2xl font-bold text-white">Pick where to go</div>
              <div className="text-sm text-white/60">
                {state.passportStamps?.length || 0} of {DESTINATIONS.length} stamps · {(state.passportStamps?.length || 0) * 30} explorer XP earned
              </div>
            </div>
          </div>
        </motion.div>

        {REGIONS.map((r) => {
          const list = DESTINATIONS.filter((d) => d.region === r.id);
          if (list.length === 0) return null;
          return (
            <div key={r.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 rounded-full" style={{ background: r.color }} />
                <h3 className="font-display text-xl font-bold text-white">{r.label}</h3>
              </div>
              <div className="space-y-3">
                {list.map((d, i) => {
                  const visited = state.passportStamps?.includes(d.id);
                  return (
                    <motion.button
                      key={d.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { sfx.click(); setActiveId(d.id); }}
                      className="w-full glass-card p-4 flex items-center gap-4 text-left active:scale-[0.99] transition"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden"
                        style={{ background: `${r.color}25` }}
                      >
                        {d.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={d.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          d.emoji
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-lg text-white truncate">{d.name}</div>
                        <div className="text-xs text-white/55 truncate">{d.tagline}</div>
                      </div>
                      {visited ? (
                        <Stamp className="w-5 h-5 text-amber-300 flex-shrink-0" />
                      ) : (
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visit</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TripView({
  dest, state, setState, onBack, onClose,
}: {
  dest: Destination;
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"learn" | "quiz" | "stamp">("learn");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>([]);

  const q = dest.quiz[qIdx];
  const alreadyStamped = state.passportStamps?.includes(dest.id);

  const startQuiz = () => {
    sfx.click();
    setPhase("quiz");
    setQIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setShuffledOpts(shuffle(dest.quiz[0].opts));
  };

  const choose = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    const right = opt === q.a;
    if (right) {
      sfx.correct();
      setCorrectCount((c) => c + 1);
    } else {
      sfx.wrong();
    }
  };

  const nextQuestion = () => {
    sfx.click();
    if (qIdx + 1 < dest.quiz.length) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setRevealed(false);
      setShuffledOpts(shuffle(dest.quiz[qIdx + 1].opts));
    } else {
      finishTrip();
    }
  };

  const finishTrip = () => {
    const xpGain = 30;
    const coinGain = 10 + correctCount * 5;
    setState((p) => ({
      ...p,
      xp: p.xp + xpGain,
      coins: p.coins + coinGain,
      passportStamps: p.passportStamps?.includes(dest.id) ? p.passportStamps : [...(p.passportStamps || []), dest.id],
    }));
    setPhase("stamp");
    sfx.coin();
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-3 active:scale-95">
          <ArrowLeft className="w-5 h-5" /> Atlas
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden relative">
          {dest.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={dest.imageUrl} alt={dest.name} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-8xl" style={{ background: "rgba(34,211,238,0.15)" }}>
              {dest.emoji}
            </div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,4,32,0.9) 100%)" }} />
          <div className="absolute bottom-0 inset-x-0 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-cyan-300">Field Trip</div>
            <div className="font-display text-3xl font-bold text-white drop-shadow">{dest.name}</div>
            <div className="text-sm text-white/80">{dest.tagline}</div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">Did you know?</div>
                </div>
                <ul className="space-y-3">
                  {dest.facts.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex gap-3 text-sm text-white/85 leading-relaxed"
                    >
                      <span className="w-6 h-6 flex-shrink-0 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-white/60">
                        {i + 1}
                      </span>
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>

                <a
                  href={`https://en.wikipedia.org${dest.wikipediaPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl glass py-2 text-sm font-semibold text-cyan-300 active:scale-[0.99]"
                >
                  Read more on Wikipedia <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <Button size="lg" className="w-full mt-4" onClick={startQuiz}>
                Take the quiz · {dest.quiz.length} questions
              </Button>
            </motion.div>
          )}

          {phase === "quiz" && q && (
            <motion.div key={`quiz-${qIdx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
              <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
                Question {qIdx + 1} of {dest.quiz.length}
              </div>
              <div className="glass-card p-5 mb-3">
                <div className="font-display text-xl font-bold text-white leading-snug">{q.q}</div>
              </div>
              <div className="space-y-2">
                {shuffledOpts.map((opt, i) => {
                  const isSel = selected === opt;
                  const isAns = opt === q.a;
                  let style = "glass border-white/10 text-white";
                  if (revealed) {
                    if (isAns) style = "bg-emerald-500/15 border-emerald-400/60 text-white ring-2 ring-emerald-400";
                    else if (isSel) style = "bg-rose-500/15 border-rose-400/60 text-white ring-2 ring-rose-400";
                    else style = "glass border-white/5 text-white/40";
                  }
                  return (
                    <button
                      key={opt + i}
                      onClick={() => choose(opt)}
                      disabled={revealed}
                      className={`w-full p-4 rounded-2xl border text-left font-semibold transition-all flex items-center gap-3 ${style}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/[0.08] flex items-center justify-center text-sm font-bold text-white/70">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1">{opt}</div>
                      {revealed && isAns && <Check className="w-4 h-4 text-emerald-400" />}
                      {revealed && isSel && !isAns && <X className="w-4 h-4 text-rose-400" />}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <Button size="lg" className="w-full mt-4" onClick={nextQuestion}>
                  {qIdx + 1 < dest.quiz.length ? "Next" : "Finish trip"}
                </Button>
              )}
            </motion.div>
          )}

          {phase === "stamp" && (
            <motion.div
              key="stamp"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="mt-6 text-center"
            >
              <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-4 relative" style={{ background: "rgba(251,191,36,0.15)", boxShadow: "0 0 60px rgba(251,191,36,0.35)" }}>
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 8, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                >
                  <Stamp className="w-16 h-16 text-amber-300" />
                </motion.div>
              </div>
              <div className="font-display text-3xl font-bold text-gradient-sunset">Passport stamped!</div>
              <div className="text-white/70 mt-2">
                {dest.name} · {correctCount}/{dest.quiz.length} correct
              </div>
              <div className="mt-4 inline-flex items-center gap-3 glass rounded-2xl px-5 py-3">
                <div className="text-amber-300 font-display font-bold">+{10 + correctCount * 5}🪙</div>
                <div className="text-cyan-300 font-display font-bold">+30 XP</div>
                {alreadyStamped && <div className="text-white/40 text-xs">Already in your passport</div>}
              </div>
              <Button size="lg" className="w-full mt-6" onClick={() => { sfx.click(); onBack(); }}>
                Back to Atlas
              </Button>
              <button onClick={() => { sfx.click(); onClose(); }} className="block mx-auto mt-3 text-sm text-white/50 active:scale-95">
                Back to school
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
