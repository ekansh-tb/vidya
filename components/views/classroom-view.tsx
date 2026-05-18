"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Users, Trophy, Megaphone, Heart, Send, Sparkles, Flame } from "lucide-react";
import type { GameState, LearnerProfile, ClassMember, ClassNote, FriendStreak } from "@/lib/types";
import {
  seedClassRoster,
  seedClassNotes,
  liveXpForPeer,
  weeklyXpForPeer,
  randomEncouragement,
} from "@/lib/content/classmates";
import { Button } from "@/components/ui/button";
import { todayKey } from "@/lib/utils";
import { sfx } from "@/lib/audio";

type Tab = "class" | "streak";

export function ClassroomView({
  state,
  setState,
  learner,
  siblings,
  onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  learner: LearnerProfile;
  siblings: LearnerProfile[];
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>("class");

  useEffect(() => {
    if (state.classRoster.length === 0) {
      const roster = seedClassRoster(learner.grade);
      const notes = seedClassNotes(learner.grade, learner.name.split(" ")[0] || "scholar");
      setState((p) => ({ ...p, classRoster: roster, classNotes: notes }));
    }
  }, [state.classRoster.length, learner.grade, learner.name, setState]);

  const sectionLetter = sectionForLearner(learner);

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button
          onClick={() => {
            sfx.click();
            onBack();
          }}
          className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <ClassHeader learner={learner} section={sectionLetter} />

        <div className="grid grid-cols-2 gap-2 my-4 p-1 rounded-2xl bg-white/[0.04] border border-white/5">
          <TabPill active={tab === "class"} onClick={() => setTab("class")} icon={<Users className="w-4 h-4" />} label="Class" />
          <TabPill active={tab === "streak"} onClick={() => setTab("streak")} icon={<Flame className="w-4 h-4" />} label="Friend Streak" />
        </div>

        {tab === "class" ? (
          <ClassTab state={state} setState={setState} learner={learner} siblings={siblings} />
        ) : (
          <StreakTab state={state} setState={setState} />
        )}
      </div>
    </div>
  );
}

function sectionForLearner(learner: LearnerProfile): string {
  const sum = (learner.id + learner.name).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return String.fromCharCode(65 + (sum % 4));
}

function TabPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={() => {
        sfx.click();
        onClick();
      }}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
        active ? "bg-white/15 text-white" : "text-white/55 hover:text-white/80"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ClassHeader({ learner, section }: { learner: LearnerProfile; section: string }) {
  const board =
    learner.board === "cambridge-primary"
      ? "Cambridge Primary"
      : learner.board === "cambridge-igcse"
      ? "Cambridge IGCSE"
      : learner.board === "icse"
      ? "ICSE / CISCE"
      : "CBSE";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-25 blur-3xl" style={{ background: "var(--accent, #A78BFA)" }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-white/50">Your Classroom</div>
            <div className="font-display text-2xl font-bold text-white mt-0.5">
              Grade {learner.grade} · Section {section}
            </div>
            <div className="text-sm text-white/60 mt-1">{board}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">School</div>
            <div className="text-sm font-semibold text-white/90 max-w-[12rem] truncate" title={learner.school || ""}>
              {learner.school || "Vidya School"}
            </div>
            {learner.city ? <div className="text-[11px] text-white/40 mt-0.5">{learner.city}</div> : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClassTab({
  state,
  setState,
  learner,
  siblings,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  learner: LearnerProfile;
  siblings: LearnerProfile[];
}) {
  const peerRows = useMemo(() => {
    const me = {
      id: "me",
      name: `${learner.name.split(" ")[0]} (You)`,
      emoji: "🌟",
      vibe: "That's you!",
      xpWeek: weeklyXpForMe(state),
      xpLive: state.xp,
      isMe: true as const,
    };
    const sibs = siblings
      .filter((s) => s.id !== learner.id)
      .map((s) => ({
        id: s.id,
        name: s.name.split(" ")[0],
        emoji: "👤",
        vibe: `Grade ${s.grade} · ${s.name.split(" ").slice(-1)[0]}`,
        xpWeek: weeklyXpForMe(s.state),
        xpLive: s.state.xp,
        isMe: false as const,
      }));
    const peers = state.classRoster.map((p) => ({
      id: p.id,
      name: p.name,
      emoji: p.avatarEmoji,
      vibe: p.vibe,
      xpWeek: weeklyXpForPeer(p),
      xpLive: liveXpForPeer(p),
      isMe: false as const,
    }));
    return [me, ...sibs, ...peers];
  }, [state, learner, siblings]);

  const leaderboard = [...peerRows].sort((a, b) => b.xpWeek - a.xpWeek).slice(0, 5);

  const setBuddy = (id: string) => {
    sfx.coin();
    setState((p) => ({ ...p, buddyId: p.buddyId === id ? null : id }));
  };

  return (
    <div className="space-y-5 mt-2">
      <Leaderboard rows={leaderboard} buddyId={state.buddyId} />
      <Roster
        peers={peerRows.filter((r) => !r.isMe)}
        buddyId={state.buddyId}
        onPickBuddy={setBuddy}
      />
      <Noticeboard state={state} setState={setState} learner={learner} />
    </div>
  );
}

function weeklyXpForMe(s: GameState): number {
  const recentDailies = Math.min(7, s.stats?.dailyQuestsCompleted ?? 0);
  return recentDailies * 30 + Math.round((s.xp ?? 0) * 0.1);
}

function Leaderboard({
  rows,
  buddyId,
}: {
  rows: { id: string; name: string; emoji: string; xpWeek: number; isMe: boolean }[];
  buddyId: string | null;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-amber-300" />
        <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">Weekly Leaderboard</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const isBuddy = r.id === buddyId;
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
          return (
            <div
              key={r.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                r.isMe
                  ? "bg-violet-500/15 border border-violet-300/30"
                  : isBuddy
                  ? "bg-rose-500/10 border border-rose-300/30"
                  : "bg-white/[0.04]"
              }`}
            >
              <div className="w-7 text-center font-bold text-white/70 text-sm">{medal}</div>
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">{r.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{r.name}</div>
              </div>
              <div className="text-sm font-display font-bold text-amber-200">{r.xpWeek} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Roster({
  peers,
  buddyId,
  onPickBuddy,
}: {
  peers: { id: string; name: string; emoji: string; vibe: string; xpLive: number }[];
  buddyId: string | null;
  onPickBuddy: (id: string) => void;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-300" />
          <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">Classmates</div>
        </div>
        <div className="text-[10px] text-white/40">Tap to set as study buddy</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {peers.map((p) => {
          const isBuddy = p.id === buddyId;
          return (
            <button
              key={p.id}
              onClick={() => onPickBuddy(p.id)}
              className={`text-left p-3 rounded-2xl transition active:scale-[0.99] ${
                isBuddy
                  ? "bg-gradient-to-br from-rose-500/25 to-pink-500/15 border border-rose-300/40"
                  : "bg-white/[0.04] border border-white/5 hover:bg-white/[0.08]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate flex items-center gap-1">
                    {p.name}
                    {isBuddy ? <Heart className="w-3 h-3 fill-rose-300 text-rose-300" /> : null}
                  </div>
                  <div className="text-[10px] text-white/50">{p.xpLive} XP</div>
                </div>
              </div>
              <div className="text-[11px] text-white/55 leading-snug line-clamp-2">{p.vibe}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Noticeboard({
  state,
  setState,
  learner,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  learner: LearnerProfile;
}) {
  const [draft, setDraft] = useState("");

  const post = (text: string, authorId: string, authorName: string, emoji?: string) => {
    const note: ClassNote = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      authorId,
      authorName: emoji ? `${emoji} ${authorName}` : authorName,
      text,
      createdAt: new Date().toISOString(),
      kind: "message",
    };
    setState((p) => ({ ...p, classNotes: [note, ...p.classNotes].slice(0, 30) }));
  };

  const sendMine = () => {
    const text = draft.trim();
    if (!text) return;
    sfx.coin();
    post(text, "me", learner.name.split(" ")[0] || "Me", "🙋");
    setDraft("");
  };

  const aiSay = () => {
    if (state.classRoster.length === 0) return;
    const speaker = state.classRoster[Math.floor(Math.random() * state.classRoster.length)];
    sfx.click();
    post(randomEncouragement(), speaker.id, speaker.name, speaker.avatarEmoji);
  };

  const notes = state.classNotes.slice(0, 12);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-emerald-300" />
          <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">Class Noticeboard</div>
        </div>
        <button
          onClick={aiSay}
          className="text-[10px] uppercase tracking-widest font-bold text-violet-200/80 bg-violet-500/10 hover:bg-violet-500/20 px-2 py-1 rounded-md flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Tap me
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMine();
          }}
          placeholder="Share something with the class…"
          maxLength={140}
          className="flex-1 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-violet-400 placeholder-white/30"
        />
        <button
          onClick={sendMine}
          disabled={!draft.trim()}
          className="rounded-xl bg-violet-500/30 text-white px-3 disabled:opacity-40 active:scale-95"
          aria-label="Post"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {notes.length === 0 && (
          <div className="text-center text-sm text-white/40 py-4">No notes yet — say hi to your class!</div>
        )}
        {notes.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl mb-2 ${
              n.kind === "announcement"
                ? "bg-emerald-500/10 border border-emerald-300/20"
                : n.authorId === "me"
                ? "bg-violet-500/10 border border-violet-300/20"
                : "bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-bold text-white/80">{n.authorName}</div>
              <div className="text-[10px] text-white/40">{prettyTime(n.createdAt)}</div>
            </div>
            <div className="text-sm text-white/85 leading-snug">{n.text}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function prettyTime(iso: string): string {
  const d = new Date(iso);
  const today = todayKey();
  const dayKey = d.toISOString().slice(0, 10);
  if (dayKey === today) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ── 1:1 Friend Streak tab (preserves prior streak feature) ──────────────────

function StreakTab({
  state,
  setState,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
}) {
  const fs = state.friendStreak;
  if (!fs) return <StreakSetup setState={setState} />;
  return <StreakDashboard fs={fs} state={state} setState={setState} />;
}

function randomCode() {
  const letters = "BCDFGHJKLMNPQRSTVWXYZ";
  let s = "";
  for (let i = 0; i < 4; i++) s += letters[Math.floor(Math.random() * letters.length)];
  return s;
}

function StreakSetup({ setState }: { setState: (updater: (s: GameState) => GameState) => void }) {
  const [friendName, setFriendName] = useState("");
  const [code, setCode] = useState(() => randomCode());

  const start = () => {
    const name = friendName.trim();
    if (!name) return;
    sfx.coin();
    const newStreak: FriendStreak = { friendName: name, code: code.toUpperCase(), startedOn: todayKey(), days: [] };
    setState((p) => ({ ...p, friendStreak: newStreak }));
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="glass-card p-5 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-2 bg-rose-500/20">
          <Flame className="w-7 h-7 text-rose-300" />
        </div>
        <div className="font-display text-xl font-bold text-white">Start a 1:1 streak</div>
        <div className="text-sm text-white/60 mt-1 max-w-xs mx-auto">
          Pair with one friend outside class. Each day one of you checks in — your shared days build a streak.
        </div>
      </div>
      <div className="glass-card p-4 space-y-3">
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/50 block mb-1.5">Friend&apos;s name</label>
          <input
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="e.g. Ananya"
            maxLength={32}
            className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 text-white text-sm outline-none focus:border-rose-400 placeholder-white/30"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/50 block mb-1.5">Shared code</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              className="flex-1 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 text-white font-mono tracking-[0.3em] text-sm outline-none focus:border-rose-400"
            />
            <button
              onClick={() => {
                sfx.click();
                setCode(randomCode());
              }}
              className="rounded-xl glass px-3 text-white/70 active:scale-95"
              aria-label="New code"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Button size="lg" className="w-full" onClick={start} disabled={!friendName.trim()}>
          Start streak
        </Button>
      </div>
    </div>
  );
}

function StreakDashboard({
  fs,
  state,
  setState,
}: {
  fs: FriendStreak;
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
}) {
  const today = todayKey();
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
      } else break;
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

  const endStreak = () => {
    if (!confirm("End this friend streak? Days won't carry over.")) return;
    setState((p) => ({ ...p, friendStreak: null }));
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest font-bold text-white/60">
            You &amp; {fs.friendName}
          </div>
          <div className="text-[10px] font-mono text-white/40 bg-white/5 rounded-full px-2 py-0.5 tracking-widest">{fs.code}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Streak" value={consecutiveStreak} accent="text-orange-300" icon={<Flame className="w-4 h-4" />} />
          <Stat label="Points" value={totalPoints} accent="text-violet-200" />
          <Stat label="Days" value={fs.days.length} accent="text-emerald-300" />
        </div>
      </div>

      {todayDay ? (
        <div className="glass-card p-3 flex items-center gap-3 border border-emerald-400/30">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-base">✓</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Today is checked in</div>
            <div className="text-xs text-white/60">
              {todayDay.by === "me" ? "You" : fs.friendName} added {todayDay.points} pt{todayDay.points === 1 ? "" : "s"}.
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={checkInMe}
          className="w-full flex items-center justify-between rounded-2xl px-4 py-3 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, rgba(244,114,182,0.25), rgba(251,146,60,0.25))" }}
        >
          <div className="text-left">
            <div className="font-bold text-white text-sm">I did today</div>
            <div className="text-xs text-white/70">
              Adds {state.lastQuestCorrect ?? 1} pt from your last quest
            </div>
          </div>
          <Flame className="w-5 h-5 text-white" />
        </button>
      )}

      <button
        onClick={endStreak}
        className="w-full text-rose-300/70 text-xs font-semibold py-2 rounded-xl glass active:scale-[0.99]"
      >
        End streak
      </button>
    </div>
  );
}

function Stat({ label, value, accent, icon }: { label: string; value: number; accent: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className={`text-2xl font-display font-bold flex items-center gap-1 ${accent}`}>
        {icon} {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">{label}</div>
    </div>
  );
}
