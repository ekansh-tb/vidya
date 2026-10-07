"use client";

import { useEffect, useId, useState } from "react";
import { Volume2, VolumeX, SlidersHorizontal } from "lucide-react";
import type { AudioSettings } from "@/lib/audio-bootstrap";
import { enableAudioFromGesture, isAudioStarted, setMasterMuted, subscribeAudio, syncAudioSettings } from "@/lib/audio";
import { setVoiceVolume, stopSpeaking } from "@/lib/speech";

export function SoundControl({ settings, onChange }: { settings: AudioSettings; onChange: (settings: Partial<AudioSettings>) => void }) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  const panelId = useId();
  useEffect(() => { setEnabled(isAudioStarted()); return subscribeAudio(() => setEnabled(isAudioStarted())); }, []);
  const muted = settings.audioMuted ?? false;
  async function toggleSound() {
    try {
      if (enabled && !muted) {
        setMasterMuted(true); stopSpeaking(); onChange({ audioMuted: true });
      } else {
        syncAudioSettings({ ...settings, audioMuted: false });
        await enableAudioFromGesture();
        setMasterMuted(false); onChange({ audioMuted: false });
      }
      setError("");
    } catch { setError("Sound could not start. Try again."); }
  }
  const label = muted ? "Unmute sound" : enabled ? "Mute sound" : "Enable sound";
  return <div className="relative inline-flex gap-1 items-center">
    <button type="button" onClick={toggleSound} aria-label={label} className="min-h-11 rounded-lg px-3 inline-flex items-center gap-2" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
      {muted || !enabled ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}<span className="text-xs font-bold">{label}</span>
    </button>
    <button type="button" aria-label="Sound controls" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)} className="min-h-11 min-w-11 rounded-lg inline-flex items-center justify-center" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}><SlidersHorizontal size={18} aria-hidden="true" /></button>
    {open && <div id={panelId} className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl p-4 shadow-lg" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
      <strong className="text-sm">Sound, your way</strong>
      {([['music', 'Ambience'], ['sound', 'Effects'], ['voice', 'Narration']] as const).map(([key, name]) => <label key={key} className="flex items-center justify-between min-h-11 gap-3 text-sm"><span>{name}</span><input type="checkbox" checked={settings[key]} onChange={(e) => { const next = { ...settings, [key]: e.target.checked }; syncAudioSettings(next); if (key === 'voice' && !e.target.checked) stopSpeaking(); onChange({ [key]: e.target.checked }); }} /></label>)}
      {([['musicVolume', 'Ambience volume', -60, 0], ['sfxVolume', 'Effects and instruments volume', -60, 0], ['voiceVolume', 'Narration volume', 0, 1]] as const).map(([key, name, min, max]) => <label key={key} className="block text-xs mt-3">{name}<input className="block w-full mt-2 min-h-8" aria-label={name} type="range" min={min} max={max} step={key === 'voiceVolume' ? 0.05 : 1} value={settings[key]} onChange={(e) => { const value = Number(e.target.value); syncAudioSettings({ ...settings, [key]: value }); if (key === 'voiceVolume') setVoiceVolume(value); onChange({ [key]: value }); }} /></label>)}
      <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>Sound starts when you choose. Ambience rests while you make music.</p>
      <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold">Close sound controls</button>
    </div>}
    {error && <span role="status" className="text-xs">{error}</span>}
  </div>;
}
