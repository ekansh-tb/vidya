"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BarChart3, Volume2, Music, Mic } from "lucide-react";
import type { GameState, ViewName } from "@/lib/types";
import { sfx, startMusic, stopMusic, setMusicVolume, setSfxVolume, setSfxEnabled } from "@/lib/audio";
import { speak, stopSpeaking, setVoiceVolume } from "@/lib/speech";

export function SettingsView({
  state, setState, onBack, onNavigate,
}: {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
  onBack: () => void;
  onNavigate?: (v: ViewName, params?: Record<string, unknown>) => void;
}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const refresh = () => setVoices(window.speechSynthesis.getVoices().filter((voice) => /^en(?:-|_|$)/i.test(voice.lang)));
    refresh();
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", refresh);
  }, []);
  // Push the two settings the engines cannot see for themselves. An effect
  // rather than a line in each handler: it also covers mount and a mid-session
  // learner switch, both of which change these values without a toggle press.
  // (The engines still read the persisted values at startup — this screen is
  // usually not mounted when the first sound plays.)
  useEffect(() => {
    setSfxEnabled(state.settings.sound);
  }, [state.settings.sound]);

  useEffect(() => {
    setVoiceVolume(state.settings.voiceVolume);
  }, [state.settings.voiceVolume]);

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
    <div className="learning-hub kids-world kids-settings" data-calm={state.settings.motion === false}>
      <div className="px-5 pt-6">
        <button onClick={() => { sfx.click(); onBack(); }} className="flex items-center gap-1 text-[var(--kid-muted)] font-medium mb-4 active:scale-95">
          <ChevronLeft className="w-5 h-5" /> Back to learning
        </button>

        <h1 className="font-display text-3xl font-bold text-[var(--kid-ink)] mb-5">Settings</h1>

        <div className="space-y-3">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-[var(--kid-purple)]" />
                <div className="font-bold text-[var(--kid-ink)]">Background music</div>
              </div>
              <button
                onClick={toggleMusic}
                role="switch" aria-checked={state.settings.music} aria-label="Background music"
                type="button"
                className="w-12 min-h-11 shrink-0 flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <span aria-hidden="true" className={`relative block w-12 h-7 rounded-full transition-colors ${state.settings.music ? "bg-[#6554c0]" : "bg-[#e5e5f0]"}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.music ? "translate-x-6" : "translate-x-1"}`} />
                </span>
              </button>
            </div>
            {state.settings.music && (
              <input
                type="range" min={-40} max={0} step={1}
                aria-label="Music volume"
                value={state.settings.musicVolume}
                onChange={onMusicVol}
                className="w-full accent-fuchsia-400"
              />
            )}
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-[var(--kid-purple)]" />
                <div className="font-bold text-[var(--kid-ink)]">Sound effects</div>
              </div>
              <button
                onClick={toggleSound}
                role="switch" aria-checked={state.settings.sound} aria-label="Sound effects"
                type="button"
                className="w-12 min-h-11 shrink-0 flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <span aria-hidden="true" className={`relative block w-12 h-7 rounded-full transition-colors ${state.settings.sound ? "bg-[#6554c0]" : "bg-[#e5e5f0]"}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.sound ? "translate-x-6" : "translate-x-1"}`} />
                </span>
              </button>
            </div>
            {state.settings.sound && (
              <input
                type="range" min={-40} max={0} step={1}
                aria-label="Sound effects volume"
                value={state.settings.sfxVolume}
                onChange={onSfxVol}
                className="w-full accent-cyan-400"
              />
            )}
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-[var(--kid-purple)]" />
                <div>
                  <div className="font-bold text-[var(--kid-ink)]">Spoken guidance</div>
                  <div className="text-xs text-[var(--kid-muted)]">Instructions read aloud</div>
                </div>
              </div>
              <button
                onClick={toggleVoice}
                role="switch" aria-checked={state.settings.voice} aria-label="Spoken guidance"
                type="button"
                className="w-12 min-h-11 shrink-0 flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                <span aria-hidden="true" className={`relative block w-12 h-7 rounded-full transition-colors ${state.settings.voice ? "bg-[#6554c0]" : "bg-[#e5e5f0]"}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.settings.voice ? "translate-x-6" : "translate-x-1"}`} />
                </span>
              </button>
            </div>
            {state.settings.voice && (
              <div className="space-y-3">
              <input
                type="range" min={0} max={1} step={0.05}
                aria-label="Voice volume"
                value={state.settings.voiceVolume}
                onChange={onVoiceVol}
                className="w-full accent-amber-400"
              />
              <label className="block text-sm text-[var(--kid-muted)]">
                English guidance voice
                <select
                  value={state.settings.voiceURI ?? ""}
                  onChange={(event) => {
                    stopSpeaking();
                    const voiceURI = event.target.value || undefined;
                    setState((previous) => ({ ...previous, settings: { ...previous.settings, voiceURI } }));
                  }}
                  className="block w-full mt-2 rounded-xl bg-white border border-[#dddcea] p-3 text-[var(--kid-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  <option value="">Automatic: prefer a natural voice</option>
                  {voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
                </select>
              </label>
              <p className="text-xs text-[var(--kid-muted)]">Voices come from this device. Natural or enhanced voices sound clearer when available. This changes spoken guidance, not the lesson language.</p>
              <button type="button" disabled={!voices.length} onClick={() => speak("Hello. I'm Vidya, your learning guide. We can take this one step at a time.")} className="rounded-xl border border-white/30 px-4 py-2 text-sm text-[var(--kid-ink)] disabled:opacity-50">Preview voice</button>
              <button type="button" onClick={stopSpeaking} className="rounded-xl px-4 py-2 text-sm text-[var(--kid-muted)]">Stop preview</button>
              {!voices.length && <p role="status" className="text-xs text-[var(--kid-muted)]">No English device voice is available yet. You can keep learning with text.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Grown-ups. The parent surface used to be a tile on the child's home
            screen; it now lives here, one step out of the child's main flow,
            and full analytics live at vidyagyan.study/parent. */}
        {onNavigate && (
          <button
            onClick={() => { sfx.click(); onNavigate("parent"); }}
            className="w-full glass-card p-4 mt-6 flex items-center gap-3 text-left active:scale-[0.99] transition"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-cyan-400/15">
              <BarChart3 className="w-5 h-5 text-[var(--kid-purple)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-[var(--kid-ink)] text-sm">For grown-ups</div>
              <div className="text-xs text-[var(--kid-muted)] mt-0.5">
                Progress, exam dates, backups and account linking.
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--kid-muted)] flex-shrink-0" />
          </button>
        )}

        <Link href="/mission" className="mt-6 flex min-h-11 items-center rounded-xl px-4 text-sm text-[var(--kid-ink)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2">
          Our shared learning mission
        </Link>

        <div className="glass-card p-4 mt-6 text-xs text-[var(--kid-muted)]">
          <div className="font-bold text-[var(--kid-muted)] mb-1">About audio</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Music is generated live by your browser, no files needed</li>
            <li>Miss Vidya uses your device&apos;s built-in voice synthesis</li>
            <li>Voice quality depends on the voices installed on this device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
