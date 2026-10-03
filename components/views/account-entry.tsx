"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { profilePlacementFields } from "@/lib/learning/placement";
import { makeLearner } from "./add-learner-view";
import { deviceLabel } from "@/lib/sync/client";
import { recoverableAccountCache } from "@/lib/sync/account-cache";
import { LearningCompanion } from "@/components/ui/learning-companion";
import { SaveErrorBanner } from "@/components/effects/save-error-banner";

/** Local archives cannot establish account ownership. Only redeem can open play. */
export function AccountEntry({ onCancel }: { onCancel?: () => void }) {
  const [code, codeSet] = useState("");
  const [hi, hindi] = useState(false);
  const [busy, busySet] = useState(false);
  const [error, errorSet] = useState("");
  const submitting = useRef(false);
  const connect = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; busySet(true); errorSet("");
    try {
      const response = await fetch("/api/learner/redeem", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({code:code.trim().toUpperCase(),deviceLabel:deviceLabel()})});
      const data = await response.json();
      const placement = profilePlacementFields.safeParse(data?.learner);
      if (!response.ok) throw new Error(data?.error ?? "Please ask your grown-up for a fresh code.");
      if (!placement.success || typeof data.learner.id !== "string" || typeof data.learner.name !== "string" || typeof data.deviceToken !== "string") throw new Error("We could not connect. Ask for a new code.");
      const store = useGameStore.getState();
      const existing = recoverableAccountCache(Object.values(store.profiles.learners), data.learner.id);
      const profile = {...(existing ?? makeLearner({id:`linked:${data.learner.id}`,name:data.learner.name,...placement.data,avatarId:"peacock",themeId:placement.data.grade===null || placement.data.grade<=2 ? "playful" : "vivid"})),...placement.data,remoteId:data.learner.id,deviceToken:data.deviceToken,verifiedLevel:data.learner.verificationLevel ?? 2,learningLanguage:existing?.learningLanguage ?? (hi ? "hi" as const : "en" as const)};
      store.upsertLearner(profile); store.switchLearner(profile.id); onCancel?.();
    } catch (error) { errorSet(hi ? "जोड़ नहीं पाए। इंटरनेट और कोड बड़े के साथ जाँचो। नया कोड माँग सकते हो।" : error instanceof Error ? error.message : "Check your connection and try again."); }
    finally { submitting.current = false; busySet(false); }
  };
  return <main className="learning-hub account-entry" lang={hi ? "hi" : "en"}>
    <header className="learning-topbar"><strong>Vidya</strong><button onClick={()=>hindi(!hi)}>{hi ? "English" : "हिंदी"}</button></header>
    <p className="learning-eyebrow">{hi ? "तुम्हारा सीखने का साथी" : "Your learning buddy"}</p>
    <h1>{hi ? "चलो, साथ शुरू करें" : "Let’s begin together"}</h1>
    <LearningCompanion line={hi ? "बड़े तुम्हारा स्तर चुनेंगे। फिर एक कोड से यहाँ तुम्हारी जगह खुलेगी।" : "Your grown-up chooses your learning level. One code opens your place here."}/>
    <section className="learning-panel"><h2>{hi ? "पहली बार आए हो?" : "New to Vidya?"}</h2><p>{hi ? "बड़े खाते में सीखने वाला जोड़ें और डिवाइस के लिए कोड बनाएँ।" : "A grown-up adds a learner in their account and creates a device code."}</p><Link className="learning-primary" href="/parent">{hi ? "बड़े यहाँ शुरू करें" : "Grown-ups start here"}</Link></section>
    <form className="learning-panel" onSubmit={connect}><h2>{hi ? "कोड मिल गया?" : "Have a device code?"}</h2><label htmlFor="device-code">{hi ? "बड़े से मिला कोड" : "Code from your grown-up"}</label><input id="device-code" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={12} required minLength={4} value={code} onChange={event=>codeSet(event.target.value)} disabled={busy}/><button className="learning-primary" disabled={busy}>{busy ? (hi ? "जोड़ रहे हैं…" : "Connecting…") : (hi ? "मेरी जगह खोलो" : "Open my learning space")}</button>{error && <p role="alert">{error}</p>}</form>
    <p className="learning-caption">{hi ? "पुराने ब्राउज़र प्रोफ़ाइल अब अपने आप नहीं खुलते। खाते से जोड़ने के बाद इंटरनेट पर प्रगति सहेजी जाती है। किताबें और गतिविधियाँ रखी गई हैं।" : "Old browser profiles no longer open automatically. Connect to an account to save progress online. Books and activities are still here."}</p>
    {onCancel && <button onClick={onCancel}>{hi ? "वापस" : "Back"}</button>}<SaveErrorBanner/>
  </main>;
}
