"use client";

import { useEffect, useState } from "react";
import { shouldShowInstallationAlert } from "@/components/parent/installation-alert-model";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
const REMINDER_KEY = "vidya-learning-installation-dismissed-v1";
const SESSION_KEY = "vidya-learning-installation-session-v1";

/** An optional device convenience, with no notification permission or tracking. */
export function LearningInstallationAlert({ language = "en" }: { language?: "en" | "hi" }) {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const hi = language === "hi";

  useEffect(() => {
    const installed = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    let dismissed: string | null = null;
    let sessionDismissed = false;
    try {
      dismissed = localStorage.getItem(REMINDER_KEY);
      sessionDismissed = sessionStorage.getItem(SESSION_KEY) === "dismissed";
    } catch { /* The notice can still be dismissed when storage is unavailable. */ }
    setVisible(shouldShowInstallationAlert(installed, sessionDismissed, dismissed, Date.now()));
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const complete = () => { setVisible(false); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", complete);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(REMINDER_KEY, String(Date.now()));
      sessionStorage.setItem(SESSION_KEY, "dismissed");
    } catch { /* Dismissal remains effective for this mounted view. */ }
  }

  async function install() {
    if (!prompt || busy) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") dismiss();
      else setMessage(hi ? "बाद में ब्राउज़र के मेन्यू से जोड़ सकते हो।" : "You can add Vidya from your browser menu later.");
    } catch {
      setMessage(hi ? "ब्राउज़र के मेन्यू से होम स्क्रीन पर जोड़ें।" : "Use your browser menu to add Vidya to your home screen.");
    } finally { setPrompt(null); setBusy(false); }
  }

  if (!visible) return null;
  return <section className="learning-panel mx-auto my-4 w-full max-w-5xl" aria-labelledby="learning-installation-title">
    <h2 id="learning-installation-title" className="text-lg font-bold">{hi ? "विद्या को पास रखो" : "Keep your learning space close"}</h2>
    <p className="learning-caption mt-2">{hi ? "अपने बड़े के साथ विद्या को होम स्क्रीन पर जोड़ सकते हो। यह ज़रूरी नहीं है; सीखना जारी रखो।" : "With your grown-up, add Vidya to your home screen for an easier return. It’s optional; keep exploring whenever you like."}</p>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {prompt ? <button className="learning-primary" type="button" disabled={busy} onClick={() => void install()}>{hi ? "डिवाइस पर जोड़ें" : "Add Vidya to this device"}</button> : <details>
        <summary className="min-h-11 cursor-pointer py-3 font-semibold">{hi ? "कैसे जोड़ें" : "How to add Vidya"}</summary>
        <p className="learning-caption max-w-xl">{ios
          ? hi ? "iPhone या iPad पर Safari में खोलें। Share चुनें, फिर Add to Home Screen।" : "On iPhone or iPad, open Vidya in Safari. Choose Share, then Add to Home Screen."
          : hi ? "ब्राउज़र के मेन्यू में Install app या Add to Home screen देखें। सुविधा ब्राउज़र पर निर्भर करती है।" : "In your browser menu, look for Install app or Add to Home screen. Availability depends on your browser."}</p>
      </details>}
      <button className="min-h-11 rounded-xl px-4 py-2 font-semibold focus-visible:outline focus-visible:outline-2" type="button" onClick={dismiss}>{hi ? "बाद में याद दिलाओ" : "Remind me later"}</button>
    </div>
    {message && <p className="learning-caption mt-2" role="status">{message}</p>}
  </section>;
}
