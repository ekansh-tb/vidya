"use client";

import { ChevronLeft, Coins, Lightbulb, ScanLine, Snowflake, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { StatPill } from "@/components/ui/indicators";
import { POWER_UPS } from "@/lib/economy";
import type { GameState } from "@/lib/types";
import { sfx } from "@/lib/audio";
import type { LucideIcon } from "lucide-react";

const POWER_DETAILS: Record<string, { Icon: LucideIcon; accent: string; desc: string }> = {
  hint: { Icon: Lightbulb, accent: "#FBBF24", desc: "Reveal a clue for any question" },
  fiftyFifty: { Icon: ScanLine, accent: "#A78BFA", desc: "Eliminate two wrong options" },
  freeze: { Icon: Snowflake, accent: "#22D3EE", desc: "Protects your streak for one missed day" },
  doubleXp: { Icon: Zap, accent: "#F472B6", desc: "Double XP on your next quiz" },
};

export function ShopView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const buy = (key: keyof typeof POWER_UPS) => {
    const cost = POWER_UPS[key].cost;
    if (state.coins < cost) return;
    setState((p) => ({
      ...p,
      coins: p.coins - cost,
      inventory: { ...p.inventory, [key]: (p.inventory[key as keyof typeof p.inventory] as number) + 1 },
    }));
    sfx.coin();
  };

  const activateDoubleXp = () => {
    if (state.inventory.doubleXp < 1 || state.doubleXpActive) return;
    setState((p) => ({
      ...p,
      inventory: { ...p.inventory, doubleXp: p.inventory.doubleXp - 1 },
      doubleXpActive: true,
    }));
    sfx.click();
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-3xl font-bold text-white">Power-ups</h2>
          <StatPill icon={Coins} value={state.coins} accent="#FBBF24" />
        </div>

        {state.doubleXpActive && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-3 text-white mb-4 flex items-center gap-2 gradient-sunset shadow-lg shadow-rose-500/30"
          >
            <Zap className="w-5 h-5" fill="currentColor" />
            <span className="font-bold">Double XP active for next quiz!</span>
          </motion.div>
        )}

        <div className="space-y-3">
          {(Object.keys(POWER_UPS) as Array<keyof typeof POWER_UPS>).map((key, i) => {
            const item = POWER_UPS[key];
            const detail = POWER_DETAILS[key];
            const owned = state.inventory[key as keyof typeof state.inventory] as number;
            const canAfford = state.coins >= item.cost;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: detail.accent + "22", boxShadow: `0 0 20px ${detail.accent}55` }}>
                  <detail.Icon className="w-7 h-7" style={{ color: detail.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-bold text-white">{item.name}</div>
                  <div className="text-xs text-white/50">{detail.desc}</div>
                  <div className="text-xs font-semibold text-white/70 mt-0.5">Owned: {owned}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => buy(key)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 transition ${
                      canAfford ? "glass-strong text-white" : "bg-white/5 text-white/30"
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    {item.cost}
                  </motion.button>
                  {key === "doubleXp" && owned > 0 && !state.doubleXpActive && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={activateDoubleXp}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500 text-white"
                    >
                      Activate
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 glass-card p-4 text-sm">
          <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-300">
            <Lightbulb className="w-4 h-4" /> Earn more coins
          </div>
          <ul className="space-y-1 list-disc list-inside text-white/70 text-xs">
            <li>Each correct answer: +5 coins</li>
            <li>Daily Quest: +25 bonus coins</li>
            <li>Streak milestones unlock surprise rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
