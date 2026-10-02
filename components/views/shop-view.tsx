"use client";
import type { GameState } from "@/lib/types";
export function ShopView({ state, onBack }: { state: GameState; setState: (updater: (s: GameState) => GameState) => void; onBack: () => void }) {
  return <main className="max-w-xl mx-auto p-6 text-[var(--text)]"><button className="buddy-action" onClick={onBack}>Back</button><h1 className="font-display text-3xl mt-6">Learning help is free</h1><p className="my-4">Hints and narrowing the choices are always available during practice. You do not need coins to ask for help.</p><p>Your saved balance is {state.coins} coins. Your earlier inventory and achievements are preserved.</p></main>;
}
