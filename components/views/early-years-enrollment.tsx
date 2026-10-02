"use client";
import { useState } from "react";
import { EARLY_LEVELS, type EarlyLevel, type LearningPlacement } from "@/lib/learning/placement";
export type EarlyEnrollmentData = { name: string; board: null; grade: null; placement: LearningPlacement; learningLanguage: "en" | "hi"; avatarId: string; interests: string[] };
export function EarlyYearsEnrollment({ defaultName = "", onComplete, onBack }: { defaultName?: string; onComplete: (data: EarlyEnrollmentData) => void | Promise<void>; onBack: () => void }) {
  const [name, changeName] = useState(defaultName);
  const [level, chooseLevel] = useState<EarlyLevel | null>(null);
  const [lang, language] = useState<"en" | "hi" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hi = lang === "hi";
  return <main className="learning-hub mode-early-years"><button onClick={onBack}>{hi ? "वापस" : "Back"}</button><p className="learning-eyebrow">{hi ? "बड़े के साथ शुरुआत" : "Start together with a grown-up"}</p><h1>{hi ? "खेलते हुए सीखें" : "Little discoveries start here"}</h1><p>{hi ? "कक्षा से उम्र, पढ़ने की क्षमता या अनुमति तय नहीं होती। छोटी शुरुआत करें, फिर स्क्रीन से दूर खेलें।" : "Level does not tell us age, reading ability, or permissions. Start briefly together, then play away from the screen."}</p>
    <section className="learning-panel"><label htmlFor="early-name">{hi ? "बच्चे का नाम या उपनाम" : "Child’s name or nickname"}</label><input id="early-name" maxLength={80} value={name} onChange={e => changeName(e.target.value)} autoComplete="off"/>
      <fieldset><legend>{hi ? "शुरुआती स्तर चुनें" : "Choose their early-years level"}</legend><div className="learning-tabs">{EARLY_LEVELS.map(l => <button key={l} aria-pressed={l === level} onClick={() => chooseLevel(l)}>{({nursery:"Nursery",lkg:"LKG",ukg:"UKG"})[l]}</button>)}</div></fieldset>
      <fieldset><legend>Language / भाषा</legend><div className="learning-tabs"><button aria-pressed={lang === "en"} onClick={() => language("en")}>English</button><button aria-pressed={lang === "hi"} onClick={() => language("hi")}>हिंदी</button></div></fieldset>
      <p>{hi ? "NCF आधारित गतिविधियाँ और स्पष्ट रूप से बताई गई सामान्य खोज। यह सीमित शुरुआती संग्रह है, पूरा पाठ्यक्रम नहीं।" : "NCF-based activities and clearly labeled general exploration. This is a bounded starter, not a complete curriculum."}</p>
      <p>{hi ? "खाते के बिना प्रगति इस डिवाइस पर रहेगी। परिवार से जोड़ना मापने या व्यवहार की ट्रैकिंग की सहमति नहीं है।" : "Without an account, progress stays on this device. Family linking is not consent to behavioural analytics."}</p>
      {error && <p role="alert">{error}</p>}<button className="learning-primary" disabled={!name.trim() || !level || !lang || busy} onClick={async () => { if (!level || !lang) return; setBusy(true); try { await onComplete({ name: name.trim(), board: null, grade: null, placement: { version: 1, kind: "early-years", level }, learningLanguage: lang, avatarId: "peacock", interests: [] }); } catch { setError(hi ? "सहेज नहीं पाए। फिर कोशिश करें।" : "Could not save. Please try again."); } finally { setBusy(false); } }}>{hi ? "हम तैयार हैं" : "Start our little journey"}</button>
    </section></main>;
}
