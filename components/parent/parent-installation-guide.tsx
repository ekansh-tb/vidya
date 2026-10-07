"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
export function ParentInstallationGuide() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const complete = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    return () => { window.removeEventListener("beforeinstallprompt", capture); window.removeEventListener("appinstalled", complete); };
  }, []);
  return <section className="parent-card"><h2>A familiar place to return to</h2>
    <p>Keep the family space on your home screen. Stay signed in only on a device you trust; sign out on shared devices.</p>
    {installed ? <p role="status">You opened Vidya as an installed app.</p> : prompt ? <button type="button" className="parent-primary" onClick={() => void (async () => {
      try { await prompt.prompt(); const choice = await prompt.userChoice; setMessage(choice.outcome === "accepted" ? "Installation requested. Your browser will finish the setup." : "You can install from your browser menu later."); }
      catch { setMessage("Use your browser menu to add Vidya to your home screen."); }
      finally { setPrompt(null); }
    })()}>Add Vidya to this device</button> : <details><summary>How to add Vidya to your home screen</summary><p>On iPhone or iPad, open Vidya in Safari, choose Share, then Add to Home Screen. On Android or a computer, look for Install app or Add to Home screen in your browser menu. Availability depends on your browser.</p></details>}
    {message && <p role="status">{message}</p>}
    <div className="parent-control-note"><h3>Weekly family invitations</h3><p>Choose a quiet moment each week to see what your child wants to share. Invitation preferences are optional in Controls below. Browser notification permission is requested only when you choose Enable on this browser; missing a review never blocks learning.</p></div>
  </section>;
}
