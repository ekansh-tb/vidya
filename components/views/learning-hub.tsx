"use client";

import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Footprints, Palette, Play, Settings, Users, Volume2 } from "lucide-react";
import { SensoryControls } from "@/components/learning/sensory-controls";
import { ActivityArt } from "@/components/learning/activity-art";
import { useLearningMotion } from "@/components/learning/use-learning-motion";
import { sfx } from "@/lib/audio";
import { learningHaptic } from "@/lib/learning/sensory";
import { useGameStore } from "@/lib/game-store";
import { placementFor, placementLabel, experienceMode } from "@/lib/learning/placement";
import { recordLocalMeasurement } from "@/lib/learning/local-measurement";
import { placementKey, distinctLearningDays, companionUnlocks, type ActivityDomain } from "@/lib/learning/activity";
import { hubActivities, variedActivities } from "@/lib/learning/hub-selection";
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
  { id: "real-world", en: "Outdoor & together", hi: "बाहर और साथ में", picture: "🌳" },
];
const TABS = [
  { id: "play", en: "Play", hi: "खेलो", icon: Play },
  { id: "stories", en: "Stories", hi: "कहानियाँ", icon: BookOpen },
  { id: "make", en: "Make", hi: "बनाओ", icon: Palette },
  { id: "journey", en: "My Journey", hi: "मेरी यात्रा", icon: Footprints },
] as const;
export type LearningHubTab = typeof TABS[number]["id"];

export function LearningHub({ onBack, onSettings, onSwitch, onLink, tab = "play", onTabChange, initialActivityId }: {
  onBack: () => void; onSettings: () => void; onSwitch: () => void; onLink: () => void;
  tab?: LearningHubTab; onTabChange: (tab: LearningHubTab) => void;
  initialActivityId?: string;
}) {
  const { learner, state, set, updateLearnerMeta } = useGameStore();
  const reduced = useReducedMotion();
  const calm = !!reduced || state.settings.motion === false;
  const root = useRef<HTMLElement>(null);
  const launchTarget = useRef<{ id: string; scroll: number } | null>(null);
  const placement = placementFor(learner);
  const lang = learner.learningLanguage ?? "en";
  const hi = lang === "hi";
  const early = placement?.kind === "early-years";
  const [domain, chooseDomain] = useState<ActivityDomain | null>(null);
  const [selected, select] = useState<string | null>(initialActivityId ?? null);
  const [expanded, expand] = useState(false);
  const [journeyDay, selectDay] = useState<number | null>(null);
  const activityState = state.activities ?? { completions: [] };
  const completedDays = distinctLearningDays(activityState);
  const day = journeyDay ?? Math.min(14, completedDays.length + (completedDays.includes(todayKey()) ? 0 : 1));
  const available = hubActivities(learner, lang);
  const draft = available.find(activity => activity.id === activityState.draft?.activityId && activity.revision === activityState.draft.revision);
  const chosen = available.find(activity => activity.id === selected);
  const playable = available.filter(activity => activity.interaction !== "offline");
  const next = draft ?? playable[(day - 1) % Math.max(1, playable.length)];
  const outdoors = available.filter(activity => activity.interaction === "offline");
  const offline = outdoors[(day - 1) % Math.max(1, outdoors.length)];
  const filtered = available.filter(activity => tab === "stories" ? activity.domain === "language" : tab === "make" ? activity.interaction === "creation" : !domain || activity.domain === domain);
  const visible = domain || tab !== "play" || expanded ? filtered : variedActivities(filtered, 6);
  const name = learner.name.trim().split(/\s+/)[0];
  useLearningMotion(root, calm, [tab, domain, expanded, selected].join(":"));
  useEffect(() => {
    if (placement) recordLocalMeasurement(learner.id, { placement: placementKey(placement), language: lang, device: window.innerWidth < 600 ? "phone" : window.innerWidth < 1000 ? "tablet" : "desktop" }, todayKey(), "visit");
  }, [learner.id, lang, placement]);
  useEffect(() => {
    if (selected || !launchTarget.current) return;
    const target = launchTarget.current;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: target.scroll, behavior: "instant" });
      document.getElementById(target.id)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  const start = (id: string, buttonId: string) => {
    launchTarget.current = { id: buttonId, scroll: window.scrollY };
    sfx.click(); learningHaptic(); select(id);
    set(current => ({ ...current, activities: { ...(current.activities ?? { completions: [] }), nextActivityId: id } }));
  };
  const changeTab = (value: LearningHubTab) => {
    chooseDomain(null); expand(false); onTabChange(value);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (chosen) return <ActivityPlayer key={chosen.id} activity={chosen} onExit={() => select(null)} />;
  const navigation = <nav className="kids-nav" aria-label={hi ? "सीखने का रास्ता" : "Learning navigation"} data-calm={calm}>
    {TABS.map(item => <button key={item.id} aria-current={tab === item.id ? "page" : undefined} onClick={() => changeTab(item.id)}><item.icon aria-hidden="true" /><span>{hi ? item.hi : item.id === "play" && !early ? "Explore" : item.en}</span></button>)}
  </nav>;
  return <main ref={root} className={"learning-hub kids-world mode-" + experienceMode(learner)} data-calm={calm} lang={hi ? "hi" : "en"}>
    <header className="kids-header">
      <div className="kids-brand">{!early && <button className="kids-icon" onClick={onBack} aria-label={hi ? "सीखने पर लौटो" : "Back to learning"}><ArrowLeft aria-hidden="true" /></button>}<span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span><strong>vidya</strong><span className="kids-level">{placementLabel(learner)}</span></div>
      <div className="kids-header-actions"><button className="kids-language" onClick={() => updateLearnerMeta(learner.id, { learningLanguage: hi ? "en" : "hi" })}>{hi ? "English" : "हिंदी"}</button><button className="kids-icon" onClick={onSwitch} aria-label={hi ? "सीखने वाला बदलो" : "Switch learner"}><Users aria-hidden="true" /></button><button className="kids-icon" onClick={onSettings} aria-label={hi ? "सेटिंग" : "Settings"}><Settings aria-hidden="true" /></button></div>
    </header>
    <div className="kids-heading"><div><p className="learning-eyebrow">{hi ? "नमस्ते, " + name : "Hello, " + name}</p><h1>{hi ? ({ play: "आज क्या खेलें?", stories: "कहानी चुनो", make: "कुछ अपना बनाओ", journey: "तुम्हारी छोटी खोजें" })[tab] : ({ play: early ? "What shall we play?" : "Find your next discovery", stories: "A story starts here", make: "Make it your own", journey: "Look what you tried" })[tab]}</h1></div>{early && <button className="kids-icon" aria-label={hi ? "रास्ते के नाम सुनो" : "Hear the navigation labels"} onClick={() => speak(hi ? "खेलो। कहानियाँ। बनाओ। मेरी यात्रा। अपनी पसंद चुनो।" : "Play. Stories. Make. My Journey. Choose where to go.", { lang: hi ? "hi-IN" : "en-IN", rate: .85 })}><Volume2 aria-hidden="true" /></button>}</div>
    {tab === "play" && next && <section className={"kids-adventure domain-" + next.domain}>
      <div className="kids-adventure-copy"><span className="kids-tag">{draft ? (hi ? "तुम्हारा सहेजा हुआ खेल" : "Right where you left off") : (hi ? "आज का छोटा खेल" : "A little play for today")}</span><h2>{next.title[lang]}</h2><p>{next.objective[lang]}</p><button id="next-activity" className="learning-primary" onClick={() => start(next.id, "next-activity")}><Play aria-hidden="true" fill="currentColor" size={18} />{draft ? (hi ? "मेरा खेल जारी रखो" : "Continue playing") : (hi ? "चलो खेलें" : early ? "Let’s play" : "Start activity")}<ArrowRight aria-hidden="true" size={19} /></button></div>
      <div className="kids-adventure-art" data-activity-art><ActivityArt domain={next.domain} /></div>
    </section>}
    {!available.length && <section className="learning-panel"><h2>{hi ? "यह संग्रह अभी तैयार हो रहा है" : "This collection is being prepared"}</h2><p role="status">{hi ? "इस स्तर की गतिविधियाँ अभी तैयार नहीं हैं। किसी दूसरी कक्षा की सामग्री नहीं दी जाएगी।" : "Activities for this level are not ready yet. Another grade’s content will not be substituted."}</p>{!early && <button onClick={onBack} className="learning-primary">{hi ? "सीखने पर लौटो" : "Back to learning"}</button>}</section>}
    {tab === "make" && <CreationGallery state={activityState} activities={available} language={lang} />}
    {tab !== "journey" && available.length > 0 && <>
      <div className="kids-section-heading"><h2>{hi ? (tab === "play" ? "तुम चुनो" : tab === "make" ? "क्या बनाओगे?" : "शब्द, चित्र और कहानियाँ") : tab === "play" ? "What looks fun?" : tab === "make" ? "What will you make?" : "Words, pictures & stories"}</h2><span>{hi ? "अपनी पसंद से" : "Your choice"}</span></div>
      {tab === "play" && <div className="learning-domain-picker" role="group" aria-label={hi ? "गतिविधि चुनो" : "Choose an activity area"}><button aria-pressed={!domain} onClick={() => { chooseDomain(null); expand(false); }}>{hi ? "सब" : "All"}</button>{DOMAINS.filter(item => available.some(activity => activity.domain === item.id)).map(item => <button key={item.id} aria-pressed={domain === item.id} onClick={() => chooseDomain(domain === item.id ? null : item.id)}><span aria-hidden="true">{item.picture}</span>{item[lang]}</button>)}</div>}
      <div className="kids-activity-grid">{visible.map(activity => {
        const area = DOMAINS.find(item => item.id === activity.domain)!;
        const pictures = activity.steps[0]?.items.slice(0, 3);
        return <button key={activity.id} id={"activity-" + activity.id} className={"kids-activity-card domain-" + activity.domain} onClick={() => start(activity.id, "activity-" + activity.id)}>
          <span className="kids-card-picture" data-activity-art aria-hidden="true">{pictures?.length ? pictures.map(item => <span key={item.id}>{hi ? item.pictureHi ?? item.picture : item.picture}</span>) : <ActivityArt domain={activity.domain} />}</span>
          <span className="kids-card-copy"><small>{area[lang]}</small><strong>{activity.title[lang]}</strong><span className="kids-card-meta">{activity.interaction === "offline" ? (hi ? "बड़े के साथ, स्क्रीन से दूर" : "Together, off screen") : activity.alignment === "ncf-foundational" ? (hi ? "NCF आधारित" : "NCF-based") : (hi ? "सामान्य खोज" : "General exploration")}<ArrowRight aria-hidden="true" size={17} /></span></span>
        </button>;
      })}</div>
      {tab === "play" && !domain && filtered.length > visible.length && <button className="kids-show-all" onClick={() => expand(true)}>{hi ? "सभी गतिविधियाँ देखो" : "See all activities"}<ArrowRight aria-hidden="true" size={18} /></button>}
      {tab === "play" && offline && <button id="offline-next" className="kids-outdoor" onClick={() => start(offline.id, "offline-next")}><span className="kids-outdoor-art" aria-hidden="true"><ActivityArt domain="real-world" /></span><span><small>{hi ? "फिर, स्क्रीन से दूर" : "Then, away from the screen"}</small><strong>{offline.title[lang]}</strong><span>{hi ? "बड़े के साथ असली दुनिया में खेलो" : "A little real-world play with your grown-up"}</span></span><ArrowRight aria-hidden="true" /></button>}
    </>}
    {tab === "journey" && <>
      <LearningCompanion compact decorations={companionUnlocks(activityState)} line={hi ? "जो खोजा और बनाया, वह यहाँ रहता है। छुट्टी लेने पर कुछ नहीं खोता।" : "Your discoveries and creations stay here. Taking a break loses nothing."} />
      <section className="learning-panel learning-history"><h2>{hi ? "तुम्हारे सीखने के दिन" : "Your learning days"}</h2><p>{completedDays.length} {hi ? "अलग दिन" : "distinct days"}</p><div className="learning-week" aria-label={hi ? "पिछले सात दिन" : "Last seven days"}>{Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - 6 + index); const key = dayKeyOf(date); return <span key={key} className={completedDays.includes(key) ? "participated" : ""} title={key}>{date.toLocaleDateString(hi ? "hi-IN" : "en-IN", { weekday: "short" })}<b aria-label={completedDays.includes(key) ? (hi ? "भाग लिया" : "participated") : (hi ? "खाली दिन" : "open day")}>{completedDays.includes(key) ? "●" : "○"}</b></span>; })}</div><p>{hi ? "साथी के पत्ते, स्कार्फ़ और तारे 1, 3 और 7 अलग दिनों पर जुड़ते हैं।" : "Tara’s leaf, scarf, and star appear after 1, 3, and 7 distinct days."}</p></section>
      {early && <section className="learning-panel"><h2>{hi ? "14 दिन की शुरुआती यात्रा" : "Your 14-day starter journey"}</h2><div className="learning-day-picker"><label htmlFor="starter-day">{hi ? "एक दिन चुनो" : "Choose a day"}</label><select id="starter-day" value={day} onChange={event => selectDay(Number(event.target.value))}>{Array.from({ length: 14 }, (_, index) => <option key={index} value={index + 1}>{hi ? "दिन" : "Day"} {index + 1}</option>)}</select><p>{hi ? "छोटी शुरुआत, विकल्प और दोबारा खेलना। फिर असली दुनिया में खेलो। पूरा पाठ्यक्रम नहीं।" : "Short visits, choices and replay, followed by real-world play. A starter collection, not a complete curriculum."}</p></div><button onClick={() => changeTab("play")} className="learning-primary">{hi ? "इस दिन का खेल देखो" : "See this day’s play"}<ArrowRight aria-hidden="true" size={18} /></button></section>}
      <CreationGallery state={activityState} activities={available} language={lang} />
      <details className="learning-panel"><summary>{hi ? "बड़ों के लिए: देखी गई प्रैक्टिस" : "For grown-ups: observed practice"}</summary><p className="learning-caption">{hi ? "ऐप की गतिविधि और बड़े की ऑफ़लाइन रिपोर्ट अलग रिकॉर्ड हैं। पूरा करना समझ का प्रमाण नहीं।" : "App participation and caregiver offline reports stay separate. Completion is not proof of understanding."}</p>{activityState.completions.slice(-7).reverse().map(completion => <p key={completion.key}>{completion.day} · {completion.source === "caregiver" ? (hi ? "बड़े की रिपोर्ट" : "caregiver report") : (hi ? "ऐप" : "app")} · {hi ? "प्रयास" : "attempts"}: {completion.attempts}, {hi ? "स्वतंत्र उत्तर" : "independent responses"}: {completion.independentResponses}, {hi ? "मदद" : "hints"}: {completion.hints}, {hi ? "दोबारा" : "retries"}: {completion.retries}{completion.delayedReview ? (hi ? " · देर से फिर अभ्यास" : " · delayed revisit") : ""}</p>)}<p>{hi ? "यह सीमित संपादकीय समीक्षा वाला शुरुआती संग्रह है। शिक्षक समीक्षा और बच्चों के साथ उपयोगिता शोध अभी बाकी हैं।" : "This starter has source-grounded editorial review. Independent educator validation and child usability research are pending."}</p><button onClick={onLink}>{hi ? "खाते और डिवाइस की मदद" : "Account & device help"}</button></details>
    </>}
    <footer className="kids-footer"><SensoryControls /><span>{hi ? "आवाज़ उपलब्ध न हो तो साथ में पढ़ सकते हैं।" : "No narration? You can read the instructions together."}</span></footer>
    {typeof document === "undefined" ? navigation : createPortal(navigation, document.body)}
  </main>;
}
