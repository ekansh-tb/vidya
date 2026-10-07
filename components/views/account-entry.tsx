"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { profilePlacementFields } from "@/lib/learning/placement";
import { makeLearner } from "./add-learner-view";
import { deviceLabel } from "@/lib/sync/client";
import { recoverableAccountCache } from "@/lib/sync/account-cache";
import { ArrowRight, BookOpen, Compass, Palette } from "lucide-react";
import { VidyaIntroduction } from "@/components/learning/vidya-introduction";
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
  return <div className="kids-surface"><main className="learning-hub kids-world account-entry" lang={hi ? "hi" : "en"}>
    <header className="kids-header"><div className="kids-brand"><span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span><strong>vidya</strong></div><nav aria-label={hi ? "स्वागत" : "Welcome navigation"} className="welcome-navigation"><Link href="/mission">{hi ? "हमारा उद्देश्य" : "Our mission"}</Link><button className="kids-language" onClick={()=>hindi(!hi)}>{hi ? "English" : "हिंदी"}</button></nav></header>
    <div className="welcome-layout">
      <section className="welcome-story" aria-labelledby="welcome-title">
        <p className="learning-eyebrow">{hi ? "हर बच्चे का सीखने का साथी" : "Every child’s learning buddy"}</p>
        <h1 id="welcome-title">{hi ? <>सवाल से शुरू करो।<br/><span>अपनी दुनिया खोजो।</span></> : <>A question can open<br/><span>a whole new world.</span></>}</h1>
        <p className="welcome-description">{hi ? "विद्या में किताबें, कहानियाँ, प्रैक्टिस और रचनात्मक गतिविधियाँ एक साथ हैं। अपने स्तर पर शुरू करो, कुछ खोजो और अपनी सोच को नया रूप दो।" : "Vidya brings books, stories, practice and creative activities into one learning space. Start at your level, follow your curiosity, and make something of your own."}</p>
        <Link className="welcome-mission" href="/mission">{hi ? "विद्या का उद्देश्य जानो" : "Discover the mission behind Vidya"}<ArrowRight size={18} aria-hidden="true"/></Link>
        <a className="welcome-start" href="#device-code">{hi ? "कोड मिल गया? अपनी जगह खोलो" : "Have a code? Open your learning space"}<ArrowRight size={18} aria-hidden="true"/></a>
        <VidyaIntroduction language={hi ? "hi" : "en"} presentation="visual" />
      </section>
      <section className="welcome-access" aria-labelledby="entry-title">
        <form className="learning-panel welcome-code" onSubmit={connect}>
          <span className="welcome-step">{hi ? "सीखना शुरू करो" : "Your learning space"}</span>
          <h2 id="entry-title">{hi ? "कोड से अपनी जगह खोलो" : "Ready to explore?"}</h2>
          <p className="learning-caption">{hi ? "बड़े से डिवाइस कोड लो। अपनी प्रगति वहीं से जारी रखो।" : "Use the device code from your grown-up to open your profile and saved progress."}</p>
          <label htmlFor="device-code">{hi ? "डिवाइस कोड" : "Device code"}</label>
          <input id="device-code" aria-describedby="code-help" placeholder="XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={12} required minLength={4} value={code} onChange={event=>codeSet(event.target.value)} disabled={busy}/>
          <p id="code-help" className="learning-caption">{hi ? "कोड बड़े के खाते में मिलता है।" : "Your grown-up can make a code in their parent account."}</p>
          <button className="learning-primary" disabled={busy}>{busy ? (hi ? "जोड़ रहे हैं…" : "Connecting…") : (hi ? "मेरी जगह खोलो" : "Open my learning space")}<ArrowRight size={18} aria-hidden="true"/></button>
          {error && <p className="welcome-error" role="alert">{error}</p>}
        </form>
        <section className="account-grown-up"><div><h2>{hi ? "पहली बार आए हो?" : "New to Vidya?"}</h2><p>{hi ? "बड़े खाते में सीखने वाला जोड़ें और डिवाइस के लिए कोड बनाएँ।" : "Create a learner profile, choose their level, then connect their device."}</p></div><Link href="/parent">{hi ? "बड़े यहाँ शुरू करें" : "Grown-ups start here"}<ArrowRight size={18} aria-hidden="true"/></Link></section>
        <details className="account-help"><summary>{hi ? "पुराने ब्राउज़र प्रोफ़ाइल की मदद" : "Returning with an older browser profile?"}</summary><p className="learning-caption">{hi ? "पुराने ब्राउज़र प्रोफ़ाइल अब अपने आप नहीं खुलते। खाते से जोड़ने के बाद इंटरनेट पर प्रगति सहेजी जाती है। किताबें और गतिविधियाँ रखी गई हैं।" : "Old browser profiles no longer open automatically. Connect to an account to save progress online. Books and activities are still here."}</p></details>
        {onCancel && <button className="welcome-back" onClick={onCancel}>{hi ? "वापस" : "Back to learning"}</button>}
      </section>
    </div>
    <section className="welcome-paths" aria-label={hi ? "सीखने के तरीके" : "Ways to learn"}>
      {[{Icon:BookOpen,en:"Read a story",hi:"कहानी पढ़ो",body:"Books and stories to open a new idea.",bodyHi:"किताबों और कहानियों से नई सोच शुरू करो।"},{Icon:Compass,en:"Follow a question",hi:"सवाल खोजो",body:"Practice and exploration at your learning level.",bodyHi:"अपने स्तर पर प्रैक्टिस और नई खोज करो।"},{Icon:Palette,en:"Make it your own",hi:"कुछ अपना बनाओ",body:"Draw, build, or take an idea into real-world play.",bodyHi:"चित्र बनाओ, कुछ बनाओ या असली दुनिया में खेलो।"}].map(item=><div key={item.en}><item.Icon aria-hidden="true"/><h2>{hi ? item.hi : item.en}</h2><p>{hi ? item.bodyHi : item.body}</p></div>)}
    </section>
    <footer className="welcome-footer"><span>{hi ? "अपने स्तर पर, अपनी गति से।" : "Your level. Your pace. Room to be curious."}</span><Link href="/mission">{hi ? "विद्या के बारे में" : "About Vidya"}</Link></footer>
    <SaveErrorBanner/>
  </main></div>;
}
