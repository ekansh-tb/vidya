"use client";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { SensoryControls } from "@/components/learning/sensory-controls";
import { sfx } from "@/lib/audio";
import { learningHaptic } from "@/lib/learning/sensory";
import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/game-store";
import { placementFor, placementLabel, experienceMode } from "@/lib/learning/placement";
import { recordLocalMeasurement } from "@/lib/learning/local-measurement";
import { placementKey } from "@/lib/learning/activity";
import { PUBLISHED_SCHOOL_GRADES } from "@/lib/learning/release";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
import { eligibleActivities, distinctLearningDays, companionUnlocks, type ActivityDomain } from "@/lib/learning/activity";
import { ActivityPlayer } from "./activity-player";
import { LearningCompanion } from "@/components/ui/learning-companion";
import { CreationGallery } from "@/components/learning/creation-gallery";
import { speak } from "@/lib/speech";
import { todayKey, dayKeyOf } from "@/lib/utils";
const DOMAINS: { id: ActivityDomain; en: string; hi: string; picture: string }[] = [
  { id: "language", en: "Words & stories", hi: "शब्द और कहानियाँ", picture: "📖" },
  { id: "numeracy", en: "Numbers & shapes", hi: "संख्या और आकार", picture: "🔷" },
  { id: "discovery", en: "Discover", hi: "खोज", picture: "🍃" },
  { id: "creative", en: "Make", hi: "बनाओ", picture: "🎨" },
  { id: "social", en: "Feel & share", hi: "भाव और बातें", picture: "🙂" },
  { id: "real-world", en: "Away from the screen", hi: "स्क्रीन से दूर", picture: "🌳" },
];
export function LearningHub({ onBack, onSettings, onSwitch, onLink }: { onBack: () => void; onSettings: () => void; onSwitch: () => void; onLink: () => void }) {
  const { learner, state, set, updateLearnerMeta } = useGameStore();
  const reduced = useReducedMotion();
  const calm = reduced || state.settings.motion === false;
  const placement = placementFor(learner);
  const lang = learner.learningLanguage ?? "en";
  const hi = lang === "hi";
  const early = placement?.kind === "early-years";
  const mode = experienceMode(learner);
  useEffect(() => { if (placement) recordLocalMeasurement(learner.id, { placement:placementKey(placement), language:lang, device:window.innerWidth<600 ? "phone" : window.innerWidth<1000 ? "tablet" : "desktop" }, todayKey(), "visit"); }, [learner.id, lang, placement]);
  const [tab, changeTab] = useState<"play" | "stories" | "make">("play");
  const [domain, chooseDomain] = useState<ActivityDomain | null>(null);
  const [selected, select] = useState<string | null>(null);
  const [journeyDay, selectDay] = useState<number | null>(null);
  const activityState = state.activities ?? { completions: [] };
  const completedDays = distinctLearningDays(activityState);
  const day = journeyDay ?? Math.min(14, completedDays.length + (completedDays.includes(todayKey()) ? 0 : 1));
  const available = placement && (placement.kind === "early-years" || PUBLISHED_SCHOOL_GRADES.includes(placement.grade)) ? eligibleActivities(ACTIVITY_CATALOG, placement, lang) : [];
  const last = activityState.completions.filter(c => c.source === "app").at(-1);
  const remembered = last && available.find(a => a.id === last.activityId);
  const draft = available.find(a => a.id === activityState.draft?.activityId && a.revision === activityState.draft.revision);
  const chosen = available.find(a => a.id === selected);
  const playable = available.filter(a => a.interaction !== "offline");
  const suggested = playable[(day - 1) % Math.max(1, playable.length)];
  const offline = available.filter(a => a.interaction === "offline")[(day - 1) % 5];
  const filtered = available.filter(a => tab === "stories" ? a.domain === "language" : tab === "make" ? a.interaction === "creation" : !domain || a.domain === domain);
  const start = (id: string) => { sfx.click(); learningHaptic(); select(id); set(s => ({ ...s, activities: { ...(s.activities ?? { completions: [] }), nextActivityId: id } })); };
  if (chosen) return <ActivityPlayer key={chosen.id} activity={chosen} onExit={() => select(null)}/>;
  return <MotionConfig reducedMotion={calm ? "always" : "user"}><main className={`learning-hub mode-${mode}`} lang={hi ? "hi" : "en"}>
    <header className="learning-topbar"><button onClick={early ? onSwitch : onBack}>{early ? (hi ? "सीखने वाला बदलो" : "Switch learner") : (hi ? "आज" : "Today")}</button><div><button onClick={() => updateLearnerMeta(learner.id, { learningLanguage: hi ? "en" : "hi" })}>{hi ? "English" : "हिंदी"}</button><button onClick={onSettings}>{hi ? "सेटिंग" : "Settings"}</button></div></header>
    <p className="learning-eyebrow">{placementLabel(learner)} · {hi ? "तुम्हारी सीखने की जगह" : "Your place to discover"}</p>
    <h1>{hi ? `नमस्ते, ${learner.name}` : `Hello, ${learner.name}`}</h1>
    <LearningCompanion decorations={companionUnlocks(activityState)} line={remembered ? (hi ? `मुझे तुम्हारी पिछली गतिविधि याद है: ${remembered.title.hi}। आज क्या खोजें?` : `I remember you tried ${remembered.title.en}. What shall we explore today?`) : (hi ? "हम साथ खेलेंगे, बनाएँगे और खोजेंगे। तुम चुनो।" : "We can play, make, and discover together. You choose.")}/>
    <SensoryControls/>
    <nav className="learning-tabs" aria-label={hi ? "सीखने का रास्ता" : "Learning navigation"}>{(["play", "stories", "make"] as const).map(t => <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => { changeTab(t); chooseDomain(null); }} onContextMenu={e => { e.preventDefault(); speak(hi ? ({play:"खेलो",stories:"कहानियाँ",make:"बनाओ"})[t] : ({play:"Play",stories:"Stories",make:"Make"})[t], { lang: hi ? "hi-IN" : "en-IN" }); }}>{hi ? ({play:"खेलो",stories:"कहानियाँ",make:"बनाओ"})[t] : ({play:early ? "Play" : "Explore",stories:"Stories",make:"Make"})[t]}</button>)}</nav>
    {early && <button onClick={() => speak(hi ? "खेलो। कहानियाँ। बनाओ। अपनी पसंद का रास्ता चुनो।" : "Play. Stories. Make. Choose where to go.", { lang:hi ? "hi-IN" : "en-IN", rate:0.85 })}>{hi ? "🔊 रास्ते के नाम सुनो" : "🔊 Hear the navigation labels"}</button>}
    {early && <div className="learning-day-picker"><label htmlFor="starter-day">{hi ? "14 दिन की शुरुआती यात्रा" : "14-day starter journey"}</label><select id="starter-day" value={day} onChange={e => selectDay(Number(e.target.value))}>{Array.from({ length: 14 }, (_,i) => <option key={i} value={i+1}>{hi ? "दिन" : "Day"} {i+1}</option>)}</select><p>{hi ? "छोटी शुरुआत, विकल्प और दोबारा खेलना। फिर असली दुनिया में खेलो। पूरा पाठ्यक्रम नहीं।" : "A short start, choices, and replay. Then real-world play. This is a starter, not a complete curriculum."}</p></div>}
    {tab === "play" && <>
      <section className="learning-panel learning-next"><div><p className="learning-eyebrow">{hi ? "अगला छोटा खेल" : "A little next adventure"}</p><h2>{(draft ?? suggested)?.title[lang] ?? (hi ? "यहाँ अभी गतिविधियाँ नहीं हैं" : "Activities are not ready here yet")}</h2><p>{(draft ?? suggested)?.objective[lang]}</p></div>{(draft ?? suggested) && <button className="learning-primary" onClick={() => start((draft ?? suggested)!.id)}>{draft ? (hi ? "जहाँ रुके थे वहाँ लौटो" : "Resume my activity") : (hi ? "चलो खेलें" : "Let’s try it")}</button>}</section>
      {offline && <button className="learning-offline" onClick={() => start(offline.id)}><span aria-hidden="true">🌳</span><div><strong>{hi ? "साथ में, स्क्रीन से दूर" : "Together, away from the screen"}</strong><p>{offline.title[lang]}</p></div></button>}
      <div className="learning-domain-picker" role="group" aria-label={hi ? "गतिविधि चुनो" : "Choose an activity area"}>{DOMAINS.filter(d => available.some(a => a.domain === d.id)).map(d => <button key={d.id} aria-pressed={domain === d.id} onClick={() => chooseDomain(domain === d.id ? null : d.id)}>{d.picture} {d[lang]}</button>)}</div>
    </>}
    {!available.length && <p role="status">{hi ? "इस स्तर की गतिविधियाँ अभी तैयार नहीं हैं। किसी दूसरी कक्षा की सामग्री नहीं दी जाएगी।" : "Activities for this level are not ready yet. Another grade’s content will not be substituted."}</p>}
    {tab === "make" && <CreationGallery state={activityState} activities={available} language={lang}/>}
    <h2>{hi ? "कुछ और चुनो" : "Choose something else"}</h2>
    <div className="learning-card-grid">{filtered.slice(0, domain || tab !== "play" ? 10 : 4).map(a => <motion.button key={a.id} initial={calm ? false : {opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}} whileHover={calm ? undefined : {y:-3}} whileTap={calm ? undefined : {scale:0.98}} transition={{duration:0.22}} className="learning-card" onClick={() => start(a.id)}><span aria-hidden="true">{DOMAINS.find(d => d.id === a.domain)?.picture}</span><div><strong>{a.title[lang]}</strong><p>{a.objective[lang]}</p><small>{a.alignment === "ncf-foundational" ? (hi ? "NCF आधारित" : "NCF-based") : (hi ? "सामान्य खोज" : "General exploration")}</small></div></motion.button>)}</div>
    <section className="learning-panel learning-history"><h2>{hi ? "तुम्हारे सीखने के दिन" : "Your learning days"}</h2><p>{completedDays.length} {hi ? "अलग दिन · छुट्टी लेने पर कुछ नहीं खोता" : "distinct days · taking a break loses nothing"}</p><div className="learning-week" aria-label={hi ? "पिछले सात दिन" : "Last seven days"}>{Array.from({ length: 7 }, (_,i) => { const date = new Date(); date.setDate(date.getDate()-6+i); const key = dayKeyOf(date); return <span key={key} className={completedDays.includes(key) ? "participated" : ""} title={key}>{date.toLocaleDateString(hi ? "hi-IN" : "en-IN", { weekday: "short" })}<b aria-label={completedDays.includes(key) ? (hi ? "भाग लिया" : "participated") : (hi ? "खाली दिन" : "open day")}>{completedDays.includes(key) ? "●" : "○"}</b></span>; })}</div><p>{hi ? "साथी के पत्ते, स्कार्फ़ और तारे 1, 3 और 7 अलग दिनों पर जुड़ते हैं।" : "Tara’s leaf, scarf, and star appear after 1, 3, and 7 distinct days."}</p><p className="learning-caption">{hi ? "ऐप की गतिविधि और बड़े की ऑफ़लाइन रिपोर्ट अलग रिकॉर्ड हैं। पूरा करना समझ का प्रमाण नहीं।" : "App participation and caregiver offline reports stay separate. Completion is not proof of understanding."}</p><details><summary>{hi ? "देखी गई प्रैक्टिस और सीमाएँ" : "Observed practice and limits"}</summary><p>{hi ? "हाल की गतिविधियाँ" : "Recent activities"}: {activityState.completions.length}</p>{activityState.completions.slice(-7).reverse().map(c => <p key={c.key}>{c.day} · {c.source === "caregiver" ? (hi ? "बड़े की रिपोर्ट" : "caregiver report") : (hi ? "ऐप" : "app")} · {hi ? "प्रयास" : "attempts"}: {c.attempts}, {hi ? "स्वतंत्र उत्तर" : "independent responses"}: {c.independentResponses}, {hi ? "मदद" : "hints"}: {c.hints}, {hi ? "दोबारा" : "retries"}: {c.retries}{c.delayedReview ? (hi ? " · देर से फिर अभ्यास" : " · delayed revisit") : ""}</p>)}<p>{hi ? "यह सीमित संपादकीय समीक्षा वाला शुरुआती संग्रह है। शिक्षक समीक्षा और बच्चों के साथ उपयोगिता शोध अभी बाकी हैं।" : "This starter has source-grounded editorial review. Independent educator validation and child usability research are pending."}</p></details></section>
    <footer><button onClick={onLink}>{hi ? "बड़े के खाते से जोड़ो" : "Connect with a grown-up"}</button><p>{hi ? "ऑनलाइन होने पर प्रगति आपके खाते में सहेजी जाती है। सहेजने की स्थिति देखें। आवाज़ न मिले तो बड़े निर्देश पढ़ सकते हैं।" : "Progress syncs to your account when online. Watch the save status. A grown-up can read instructions when narration is unavailable."}</p></footer>
  </main></MotionConfig>;
}
