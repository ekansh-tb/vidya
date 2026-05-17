"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Users, Flame, Sparkles, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState, FriendStreak } from "@/lib/types";
import { todayKey } from "@/lib/utils";
import { sfx } from "@/lib/audio";

function randomCode() {
  const letters = "BCDFGHJKLMNPQRSTVWXYZ";
  let s = "";
  for (let i = 0; i < 4; i++) s += letters[Math.floor(Math.random() * letters.length)];
  return s;
}

export function FriendsView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const fs = state.friendStreak;

  if (!fs) {
    return <SetupView state={state} setState={setState} onBack={onBack} />;
  }

  return <DashboardView state={state} setState={setState} onBack={onBack} fs={fs} />;
}

function SetupView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [friendName, setFriendName] = useState("");
  const [code, setCode] = useState(() => randomCode());

  const start = () => {
    const name = friendName.trim();
    if (!name) return;
    sfx.coin();
    const newStreak: FriendStreak = {
      friendName: name,
      code: code.toUpperCase(),
      startedOn: todayKey(),
      days: [],
    };
    setState((p) => ({ ...p, friendStreak: newStreak }));
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-5 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ background: "rgba(244, 114, 182, 0.18)" }}>
            <Users className="w-8 h-8" style={{ color: "#F472B6" }} />
          </div>
          <div className="font-display text-3xl font-bold text-gradient-sunset">Friend Streak</div>
          <div className="text-white/70 text-sm mt-2 max-w-xs mx-auto">
            Pair up with a friend. Each day one of you checks in — your combined days build a shared streak.
          </div>
        </motion.div>

        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/50 block mb-2">
              Friend&apos;s Name
            </label>
            <input
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="e.g. Ananya"
              className="w-full rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-fuchsia-400"
              maxLength={32}
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/50 block mb-2">
              Shared Code
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                className="flex-1 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 text-white font-mono text-lg tracking-[0.4em] outline-none focus:border-fuchsia-400"
              />
              <button
                onClick={() => { sfx.click(); setCode(randomCode()); }}
                className="rounded-2xl glass px-4 text-white/70 active:scale-95"
                aria-label="New code"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-white/40 mt-2">
              Share this code with {friendName || "your friend"} so you remember which streak is yours.
            </div>
          </div>
          <Button size="lg" className="w-full" onClick={start} disabled={!friendName.trim()}>
            Start streak
          </Button>
          <div className="text-[11px] text-white/30 text-center leading-relaxed">
            Saved on this device. Cloud sync coming soon — for now both of you can each track on your own device.
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  state, setState, onBack, fs,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  fs: FriendStreak;
}) {
  const today = todayKey();
  const [friendPoints, setFriendPoints] = useState<string>("");
  const [friendNote, setFriendNote] = useState<string>("");
  const todayDay = fs.days.find((d) => d.date === today);
  const totalPoints = useMemo(() => fs.days.reduce((s, d) => s + d.points, 0), [fs.days]);

  const consecutiveStreak = useMemo(() => {
    if (fs.days.length === 0) return 0;
    const dates = new Set(fs.days.map((d) => d.date));
    let count = 0;
    const cursor = new Date(today);
    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (dates.has(key)) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [fs.days, today]);

  const checkInMe = () => {
    if (todayDay) return;
    const pts = state.lastQuestCorrect ?? 1;
    sfx.coin();
    setState((p) => ({
      ...p,
      friendStreak: p.friendStreak
        ? { ...p.friendStreak, days: [...p.friendStreak.days, { date: today, by: "me", points: pts }] }
        : p.friendStreak,
    }));
  };

  const checkInFriend = () => {
    if (todayDay) return;
    const pts = Math.max(0, Math.min(50, parseInt(friendPoints, 10) || 0));
    sfx.coin();
    setState((p) => ({
      ...p,
      friendStreak: p.friendStreak
        ? { ...p.friendStreak, days: [...p.friendStreak.days, { date: today, by: "friend", points: pts, note: friendNote.trim() || undefined }] }
        : p.friendStreak,
    }));
    setFriendPoints("");
    setFriendNote("");
  };

  const endStreak = () => {
    if (!confirm("End this friend streak? Days won't carry over.")) return;
    setState((p) => ({ ...p, friendStreak: null }));
  };

  const sorted = [...fs.days].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: "#F472B6" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-fuchsia-300" />
                <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">
                  You &amp; {fs.friendName}
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/40 bg-white/5 rounded-full px-2 py-0.5 tracking-widest">{fs.code}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div>
                <div className="text-4xl font-display font-bold text-orange-300 flex items-center gap-1">
                  <Flame className="w-6 h-6" /> {consecutiveStreak}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Streak</div>
              </div>
              <div className="border-x border-white/10 pl-3">
                <div className="text-4xl font-display font-bold text-gradient-cosmic">{totalPoints}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Combined pts</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-emerald-300">{fs.days.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Days</div>
              </div>
            </div>
          </div>
        </motion.div>

        {todayDay ? (
          <div className="glass-card p-4 mb-5 flex items-center gap-3 border border-emerald-400/30">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 text-lg">
              ✓
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Today is checked in</div>
              <div className="text-xs text-white/60">
                {todayDay.by === "me" ? "You" : fs.friendName} added {todayDay.points} point{todayDay.points === 1 ? "" : "s"}.
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-4 mb-5">
            <div className="text-[11px] uppercase tracking-widest font-bold text-white/50 mb-3">Today&apos;s check-in</div>
            <button
              onClick={checkInMe}
              className="w-full flex items-center justify-between rounded-2xl px-4 py-3 mb-2 active:scale-[0.99] transition"
              style={{ background: "linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(244, 114, 182, 0.25))" }}
            >
              <div className="text-left">
                <div className="font-bold text-white">I did today</div>
                <div className="text-xs text-white/70">
                  Adds {state.lastQuestCorrect ?? 1} point{(state.lastQuestCorrect ?? 1) === 1 ? "" : "s"} from your last quest
                </div>
              </div>
              <Plus className="w-5 h-5 text-white" />
            </button>
            <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 mt-2">
              <div className="text-xs font-semibold text-white/70 mb-2">{fs.friendName} did today</div>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={friendPoints}
                  onChange={(e) => setFriendPoints(e.target.value)}
                  placeholder="Points"
                  className="w-24 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-fuchsia-400"
                />
                <input
                  value={friendNote}
                  onChange={(e) => setFriendNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="flex-1 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-fuchsia-400"
                  maxLength={48}
                />
              </div>
              <button
                onClick={checkInFriend}
                disabled={!friendPoints}
                className="w-full rounded-xl glass-strong text-white text-sm font-semibold py-2 active:scale-[0.99] disabled:opacity-40"
              >
                Log {fs.friendName}&apos;s day
              </button>
            </div>
          </div>
        )}

        <div className="text-[11px] uppercase tracking-widest font-bold text-white/50 mb-2">Recent days</div>
        <AnimatePresence initial={false}>
          {sorted.length === 0 && (
            <div className="glass-card p-4 text-center text-sm text-white/50">
              No check-ins yet. Today is day one!
            </div>
          )}
          {sorted.slice(0, 14).map((d) => (
            <motion.div
              key={d.date + d.by}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-3 mb-2 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${d.by === "me" ? "bg-violet-500/20 text-violet-200" : "bg-fuchsia-500/20 text-fuchsia-200"}`}>
                {d.by === "me" ? "M" : fs.friendName[0]?.toUpperCase() || "F"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{d.by === "me" ? "You" : fs.friendName}</div>
                <div className="text-xs text-white/50">{d.date}{d.note ? ` · ${d.note}` : ""}</div>
              </div>
              <div className="text-lg font-display font-bold text-amber-300">+{d.points}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={endStreak}
          className="mt-6 w-full flex items-center justify-center gap-2 text-rose-300/80 text-sm font-semibold py-3 rounded-2xl glass active:scale-[0.99]"
        >
          <Trash2 className="w-4 h-4" /> End streak
        </button>
      </div>
    </div>
  );
}
