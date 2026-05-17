"use client";

import { ChevronLeft, Volume2, VolumeX, Music, Mic } from "lucide-react";
import type { GameState } from "@/lib/types";
import { sfx, startMusic, stopMusic, setMusicVolume, setSfxVolume } from "@/lib/audio";
import { stopSpeaking } from "@/lib/speech";

export function SettingsView({
  state, setState, onBack,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const toggleMusic = () => {
    const next = !state.settings.music;
    setState((p) => ({ ...p, settings: { ...p.settings, music: next } }));
    if (next) startMusic(); else stopMusic();
  };

  const toggleVoice = () => {
    const next = !state.settings.voice;
    setState((p) => ({ ...p, settings: { ...p.settings, voice: next } }));
    if (!next) stopSpeaking();
  };

  const toggleSound = () => {
    setState((p) => ({ ...p, settings: { ...p.settings, sound: !p.settings.sound } }));
  };

  const onMusicVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const db = parseFloat(e.target.value);
    setState((p) => ({ ...p, settings: { ...p.settings, musicVolume: db } }));
    setMusicVolume(db);
  };

  const onSfxVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const db = parseFloat(e.target.value);
    setState((p) => ({ ...p, settings: { ...p.settings, sfxVolume: db } }));
    setSfxVolume(db);
  };

  const onVoiceVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setState((p) => ({ ...p, settings: { ...p.settings, voiceVolume: v } }));
  };

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-white/60 font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Home
        </button>

        <h2 className="font-display text-3xl font-bold text-white mb-5">Settings</h2>

        <div className="space-y-3">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-fuchsia-300" />
                <div className="font-bold text-white">Background Music</div>
              </div>
              <button
                onClick={toggleMusic}
                className={`relative w-12 h-7 rounded-full transition-colors ${state.settings.music ? "gradient-cosmic" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.music ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {state.settings.music && (
              <input
                type="range" min={-40} max={0} step={1}
                value={state.settings.musicVolume}
                onChange={onMusicVol}
                className="w-full accent-fuchsia-400"
              />
            )}
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-cyan-300" />
                <div className="font-bold text-white">Sound Effects</div>
              </div>
              <button
                onClick={toggleSound}
                className={`relative w-12 h-7 rounded-full transition-colors ${state.settings.sound ? "gradient-cosmic" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.sound ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {state.settings.sound && (
              <input
                type="range" min={-40} max={0} step={1}
                value={state.settings.sfxVolume}
                onChange={onSfxVol}
                className="w-full accent-cyan-400"
              />
            )}
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-amber-300" />
                <div>
                  <div className="font-bold text-white">Miss Vidya Voice</div>
                  <div className="text-xs text-white/50">Your in-app teacher</div>
                </div>
              </div>
              <button
                onClick={toggleVoice}
                className={`relative w-12 h-7 rounded-full transition-colors ${state.settings.voice ? "gradient-cosmic" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.voice ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {state.settings.voice && (
              <input
                type="range" min={0} max={1} step={0.05}
                value={state.settings.voiceVolume}
                onChange={onVoiceVol}
                className="w-full accent-amber-400"
              />
            )}
          </div>
        </div>

        <div className="glass-card p-4 mt-6 text-xs text-white/50">
          <div className="font-bold text-white/70 mb-1">About audio</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Music is generated live by your browser, no files needed</li>
            <li>Miss Vidya uses your device's built-in voice synthesis</li>
            <li>Best voice quality on Mac and recent iOS / Android</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
