"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { profilePlacementFields } from "@/lib/learning/placement";
import { makeLearner } from "./add-learner-view";
import { deviceLabel } from "@/lib/sync/client";
import { recoverableAccountCache } from "@/lib/sync/account-cache";
import { ArrowRight, ArrowLeft, BookOpen, Compass, Palette, KeyRound, Users } from "lucide-react";
import { VidyaIntroduction } from "@/components/learning/vidya-introduction";
import { SaveErrorBanner } from "@/components/effects/save-error-banner";
import { LearningInstallationAlert } from "@/components/pwa/learning-installation-alert";

/** Local archives cannot establish account ownership. Only redeem can open play. */
export function AccountEntry({ onCancel }: { onCancel?: () => void }) {
  const [studentEntry, showStudentEntry] = useState(false);
  const codeInput = useRef<HTMLInputElement>(null);
  const learnerButton = useRef<HTMLButtonElement>(null);
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
  return <div className="kids-surface"><main className="learning-hub kids-world account-entry" lang={hi ? "hi" : "en"}>
    <header className="kids-header"><div className="kids-brand"><span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span><strong>vidya</strong></div><nav aria-label={hi ? "स्वागत" : "Welcome navigation"} className="welcome-navigation"><Link href="/mission">{hi ? "हमारा उद्देश्य" : "Our mission"}</Link><button className="kids-language" onClick={()=>hindi(!hi)}>{hi ? "English" : "हिंदी"}</button></nav></header>
    <div className="welcome-layout studio-welcome">
      <section className="welcome-story" aria-labelledby="welcome-title">
        <h1 id="welcome-title">{hi ? <>सोचो। बनाओ।<br/><span>अपनी दुनिया खोजो।</span></> : <>Big questions.<br/><span>Your own discoveries.</span></>}</h1>
        <p className="welcome-description">{hi ? "कहानियाँ, विज्ञान, संगीत और कुछ अपना बनाने की जगह। अपने स्तर पर, अपनी गति से।" : "Stories, science, music and room to make something of your own. Learning at your level, at your pace."}</p>
        <Link className="welcome-mission" href="/mission">{hi ? "विद्या का उद्देश्य" : "Why we’re building Vidya"}<ArrowRight size={18} aria-hidden="true"/></Link>
        <div className="studio-introduction"><VidyaIntroduction language={hi ? "hi" : "en"} presentation="visual" /></div>
      </section>
      <section className="welcome-access studio-entry" aria-labelledby="entry-title">
        {!studentEntry ? <>
          <h2 id="entry-title">{hi ? "यहाँ से शुरू करो" : "Find your way in"}</h2>
          <p className="learning-caption">{hi ? "सीखने वाला या बड़ा? अपनी जगह चुनो।" : "A space for learners. A helping hand for grown-ups."}</p>
          <button ref={learnerButton} className="entry-route entry-student" onClick={() => { showStudentEntry(true); requestAnimationFrame(() => codeInput.current?.focus()); }}>
            <span className="entry-route-icon"><Compass aria-hidden="true" size={28}/></span><span><strong>{hi ? "मैं सीखने आया हूँ" : "I’m a learner"}</strong><small>{hi ? "बड़े का कोड लेकर शुरू करो" : "Open my space with a code"}</small></span><ArrowRight aria-hidden="true"/>
          </button>
          <Link className="entry-route entry-parent" href="/parent">
            <span className="entry-route-icon"><Users aria-hidden="true" size={28}/></span><span><strong>{hi ? "मैं अभिभावक हूँ" : "I’m a parent or guardian"}</strong><small>{hi ? "साइन इन करें या परिवार जोड़ें" : "Sign in or set up my family"}</small></span><ArrowRight aria-hidden="true"/>
          </Link>
          <p className="entry-reassurance"><KeyRound size={16} aria-hidden="true"/>{hi ? "बच्चों को ईमेल या पासवर्ड नहीं चाहिए।" : "Children don’t need an email or password."}</p>
        </> : <form className="welcome-code" onSubmit={connect}>
          <button type="button" className="entry-back" disabled={busy} onClick={() => { showStudentEntry(false); errorSet(""); requestAnimationFrame(() => learnerButton.current?.focus()); }}><ArrowLeft size={18} aria-hidden="true"/>{hi ? "वापस" : "Back"}</button>
          <h2 id="entry-title">{hi ? "तुम्हारी जगह तैयार है" : "Your space is waiting"}</h2>
          <p className="learning-caption">{hi ? "बड़े से मिला कोड यहाँ डालो।" : "Enter the code your grown-up gave you."}</p>
          <label htmlFor="device-code">{hi ? "डिवाइस कोड" : "Device code"}</label>
          <input ref={codeInput} id="device-code" aria-describedby="code-help" placeholder="XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={12} required minLength={4} value={code} onChange={event=>codeSet(event.target.value)} disabled={busy}/>
          <p id="code-help" className="learning-caption">{hi ? "एक बार जोड़ने के बाद, इसी डिवाइस पर फिर से शुरू कर सकते हो।" : "Connect once. Come back to your saved learning on this device."}</p>
          <button className="learning-primary" disabled={busy}>{busy ? (hi ? "जोड़ रहे हैं…" : "Connecting…") : (hi ? "मेरी जगह खोलो" : "Open my learning space")}<ArrowRight size={18} aria-hidden="true"/></button>
          {error && <p className="welcome-error" role="alert">{error}</p>}
          <details className="account-help"><summary>{hi ? "कोड नहीं है?" : "Don’t have a code?"}</summary><p>{hi ? "बड़े अपने खाते में तुम्हारा नाम और स्तर जोड़कर कोड बनाएँगे।" : "Ask your grown-up to sign in, add your name and learning level, then choose Connect a device."}</p><Link href="/parent">{hi ? "अभिभावक का खाता खोलें" : "Open parent account"}<ArrowRight size={16} aria-hidden="true"/></Link></details>
        </form>}
        {onCancel && <button className="welcome-back" onClick={onCancel}>{hi ? "सीखने पर लौटो" : "Back to learning"}</button>}
      </section>
    </div>
    <section className="welcome-paths" aria-label={hi ? "सीखने के तरीके" : "Ways to learn"}>
      {[{Icon:BookOpen,en:"Read a story",hi:"कहानी पढ़ो",body:"Books and stories to open a new idea.",bodyHi:"किताबों और कहानियों से नई सोच शुरू करो।"},{Icon:Compass,en:"Follow a question",hi:"सवाल खोजो",body:"Practice and exploration at your learning level.",bodyHi:"अपने स्तर पर प्रैक्टिस और नई खोज करो।"},{Icon:Palette,en:"Make it your own",hi:"कुछ अपना बनाओ",body:"Draw, build, or take an idea into real-world play.",bodyHi:"चित्र बनाओ, कुछ बनाओ या असली दुनिया में खेलो।"}].map(item=><div key={item.en}><item.Icon aria-hidden="true"/><h2>{hi ? item.hi : item.en}</h2><p>{hi ? item.bodyHi : item.body}</p></div>)}
    </section>
    <LearningInstallationAlert language={hi ? "hi" : "en"}/>
    <footer className="welcome-footer"><span>{hi ? "अपने स्तर पर, अपनी गति से।" : "Your level. Your pace. Room to be curious."}</span><Link href="/mission">{hi ? "विद्या के बारे में" : "About Vidya"}</Link></footer>
    <SaveErrorBanner/>
  </main></div>;
}
