"use client";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { sfx } from "@/lib/audio";
import { learningHaptic } from "@/lib/learning/sensory";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import { recordLocalMeasurement } from "@/lib/learning/local-measurement";
import { placementKey } from "@/lib/learning/activity";
import { placementFor } from "@/lib/learning/placement";
import { completeActivity, type ActivityDraft, type LearningActivity } from "@/lib/learning/activity";
import { speakFromGesture, stopSpeaking } from "@/lib/speech";
import { todayKey } from "@/lib/utils";
import { CompanionCelebration } from "@/components/learning/companion-celebration";
import { LearningCompanion } from "@/components/ui/learning-companion";
const EMPTY = { completions: [] };
export function ActivityPlayer({ activity, onExit }: { activity: LearningActivity; onExit: () => void }) {
  const { learner, state, set, updateLearnerMeta } = useGameStore();
  const reduced = useReducedMotion();
  const calm = reduced || state.settings.motion === false;
  const canvasSize = learner.placement?.kind === "early-years" ? ({nursery:16,lkg:25,ukg:36})[learner.placement.level] : 64;
  const placement = placementFor(learner);
  const lang = learner.learningLanguage ?? "en";
  const hi = lang === "hi";
  const existing = state.activities?.draft;
  const fresh = (): ActivityDraft => ({ activityId: activity.id, revision: activity.revision, step: 0, picks: [], marks: Array(canvasSize).fill(""), attempts: 0, independentResponses: 0, hints: 0, retries: 0, hinted: false, updatedAt: new Date().toISOString(), startedDay: todayKey() });
  const draft = existing?.activityId === activity.id && existing.revision === activity.revision ? existing : fresh();
  const finished = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, []);
  const [desire, desireSet] = useState(false);
  const measure = useCallback((event: "start"|"complete"|"abandon"|"yes"|"later") => { if (placement) recordLocalMeasurement(learner.id, { placement:placementKey(placement), language:lang, device:window.innerWidth<600 ? "phone" : window.innerWidth<1000 ? "tablet" : "desktop" }, todayKey(), event); }, [learner.id, lang, placement]);
  const visitRecorded = useRef(false);
  useEffect(() => { if (!visitRecorded.current) { visitRecorded.current = true; if (!existing || existing.activityId !== activity.id) measure("start"); } }, [activity.id, existing, measure]);
  const [paused, pause] = useState(existing?.paused ?? false);
  const [done, doneSet] = useState(false);
  const [colour, chooseColour] = useState("#248781");
  const [caregiverDone, reportDone] = useState(false);
  const [narration, narrationSet] = useState("");
  const [simulationInput, simulate] = useState<number | null>(null);
  const step = activity.steps[Math.min(draft.step, activity.steps.length - 1)];
  const answered = draft.picks.length > 0 && (!step.answer || (activity.interaction === "sequence" ? draft.picks.join("|") === step.answer : draft.picks[0] === step.answer));
  const responseStatus = draft.responseStatus ?? (answered ? "correct" : undefined);
  const feedback = responseStatus === "correct" ? step.feedback[lang] : responseStatus === "retry" ? (hi ? "फिर देख सकते हो। मदद हमेशा मुफ़्त है।" : "Take another look. Help is always free.") : "";
  useEffect(() => () => stopSpeaking(), []);
  const save = (change: Partial<ActivityDraft>) => {
    set(s => ({ ...s, activities: { ...(s.activities ?? EMPTY), draft: { ...draft, ...change, updatedAt: new Date().toISOString() } } }));
  };
  const finishStep = (change: Partial<ActivityDraft> = {}) => {
    if (finished.current) return;
    stopSpeaking(); narrationSet("");
    const next = { ...draft, ...change, step: draft.step + 1, picks: [], counted: [], hinted: false, responseStatus: undefined, stepRetries: 0, paused: false, updatedAt: new Date().toISOString() };
    if (next.step >= activity.steps.length && placement) {
      finished.current = true;
      set(s => ({ ...s, activities: completeActivity(s.activities ?? EMPTY, activity, next, { placement, language: lang, day: todayKey(), source: activity.interaction === "offline" ? "caregiver" : "app" }) }));
      sfx.badge(); learningHaptic(); measure("complete"); doneSet(true); stopSpeaking();
    } else { save(next); }
  };
  const pick = (id: string) => {
    if (feedback || paused || done) return;
    const attempts = draft.attempts + 1;
    if (activity.interaction === "simulation") { simulate(Number(id)); save({ attempts }); return; }
    const picks = activity.interaction === "sequence" ? [...draft.picks, id] : [id];
    if (activity.interaction === "sequence" && picks.length < step.items.length) { save({ picks }); return; }
    const correct = !step.answer || (activity.interaction === "sequence" ? picks.join("|") === step.answer : id === step.answer);
    if (correct) { sfx.correct(); learningHaptic(); save({ attempts, picks, responseStatus:"correct", independentResponses: draft.independentResponses + (!draft.hinted && (draft.stepRetries ?? 0) === 0 && !!step.answer ? 1 : 0) }); }
    else { save({ attempts, picks: [], responseStatus:"retry", retries: draft.retries + 1, stepRetries: (draft.stepRetries ?? 0) + 1 }); }
  };
  const read = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) { narrationSet(hi ? "यहाँ आवाज़ उपलब्ध नहीं है। बड़े निर्देश पढ़ सकते हैं।" : "Narration is unavailable here. A grown-up can read the instruction."); return; }
    const voices = window.speechSynthesis.getVoices();
    if (!voices.some(v => v.lang.toLowerCase().startsWith(lang))) { narrationSet(hi ? "हिंदी आवाज़ नहीं मिली। बड़े दिखाई दे रहे निर्देश पढ़ सकते हैं।" : "An English voice is unavailable. Read the visible instruction together."); return; }
    narrationSet(""); speakFromGesture(step.instruction[lang], { lang: hi ? "hi-IN" : "en-IN", rate: 0.85 });
  };
  const correctFeedback = feedback === step.feedback[lang];
  const safeExit = () => { if (!done && !existing) save({}); if (!done) measure("abandon"); stopSpeaking(); onExit(); };
  return <MotionConfig reducedMotion={calm ? "always" : "user"}><main className="activity-shell kids-player" data-calm={calm} lang={hi ? "hi" : "en"}>
    <header className="learning-topbar"><button onClick={safeExit}>{hi ? "वापस और प्रगति सहेजो" : "Exit & save progress"}</button><button onClick={() => { stopSpeaking(); updateLearnerMeta(learner.id, { learningLanguage: hi ? "en" : "hi" }); narrationSet(""); }}>{hi ? "English" : "हिंदी"}</button></header>
    <h1 ref={heading} tabIndex={-1}>{activity.title[lang]}</h1>
    <p className="learning-caption">{activity.alignment === "ncf-foundational" ? (hi ? "NCF आधारित शुरुआती गतिविधि" : "NCF-based starter activity") : (hi ? "सामान्य खोज · स्कूल के पाठ्यक्रम का दावा नहीं" : "General exploration · no school syllabus claim")}</p>
    {done ? <section className="learning-panel"><CompanionCelebration/><LearningCompanion line={hi ? "तुमने हिस्सा लिया। अब असली दुनिया में कुछ खेलें?" : "You took part. Shall we try something away from the screen?"}/>{!desire && <div><p>{hi ? "कभी फिर खेलना चाहोगे?" : "Would you like to try this again another day?"}</p><button onClick={() => { measure("yes"); desireSet(true); }}>{hi ? "हाँ" : "Yes"}</button><button onClick={() => { measure("later"); desireSet(true); }}>{hi ? "बाद में" : "Maybe later"}</button></div>}<h2>{hi ? "अगला छोटा कदम" : "A little next step"}</h2><p>{activity.offline[lang]}</p><p>{hi ? "यह भागीदारी का रिकॉर्ड है, समझ का प्रमाण नहीं।" : "This records participation, not proof of understanding."}</p><button className="learning-primary" onClick={onExit}>{hi ? "मेरे खेल पर लौटो" : "Back to my activities"}</button></section> : paused ? <section className="learning-panel"><h2>{hi ? "विराम" : "Paused"}</h2><p>{hi ? "तुम्हारी जगह याद है।" : "Your place is saved."}</p><button className="learning-primary" onClick={() => { save({ paused: false }); pause(false); }}>{hi ? "फिर शुरू करो" : "Resume"}</button></section> : <section className="learning-panel">
      <div className="learning-player-bar"><span>{hi ? "कदम" : "Step"} {draft.step + 1}/{activity.steps.length}</span><button onClick={() => { save({ paused: true }); pause(true); stopSpeaking(); }}>{hi ? "विराम" : "Pause"}</button></div>
      <div className="kids-step-progress" role="progressbar" aria-label={hi ? "गतिविधि के कदम" : "Activity steps"} aria-valuemin={0} aria-valuemax={activity.steps.length} aria-valuenow={draft.step} style={{ "--step-progress": String(draft.step / activity.steps.length * 100) + "%" } as React.CSSProperties}><span /></div>
      <h2>{step.instruction[lang]}</h2>
      <button onClick={read}>{hi ? "🔊 निर्देश सुनो" : "🔊 Read instruction aloud"}</button>
      {narration && <p role="status">{narration}</p>}
      <p className="learning-caption">{activity.caregiver[lang]}</p>
      {activity.interaction === "creation" ? <><div className="learning-colours" role="group" aria-label={hi ? "रंग" : "Colours"}>{["#248781", "#d64d46", "#c09619", "#7351ba"].map((c,i) => <button key={c} aria-pressed={colour === c} aria-label={(hi ? ["हरा", "लाल", "पीला", "बैंगनी"] : ["Teal", "Red", "Gold", "Purple"])[i]} onClick={() => chooseColour(c)} style={{ background: c }}/>)}</div><div className="learning-canvas" style={{gridTemplateColumns:`repeat(${Math.sqrt(draft.marks.length)},1fr)`}} role="group" aria-label={hi ? "चित्र बनाओ" : "Picture canvas"}>{draft.marks.map((mark,i) => <button key={i} aria-label={`${hi ? "खाना" : "Cell"} ${i+1}${mark ? (hi ? " रंगा हुआ" : " painted") : ""}`} aria-pressed={!!mark} style={{ background: mark || "#f5f4ed" }} onClick={() => { const marks = [...draft.marks]; marks[i] = mark ? "" : colour; save({ marks }); }}/>)}</div><button onClick={() => save({ marks: Array(draft.marks.length).fill("") })}>{hi ? "मिटाओ" : "Clear picture"}</button><button className="learning-primary" disabled={!draft.marks.some(Boolean)} onClick={() => finishStep({ attempts: draft.attempts + 1 })}>{hi ? "मेरा चित्र सहेजो" : "Save my creation"}</button></> : activity.interaction === "offline" ? <><p>{hi ? "अब स्क्रीन से दूर खेलो। लौटने पर बड़े यह रिकॉर्ड कर सकते हैं।" : "Play away from the screen now. A grown-up can record participation when you return."}</p><label><input type="checkbox" checked={caregiverDone} onChange={e => reportDone(e.target.checked)}/>{hi ? "बड़े का रिकॉर्ड: हमने इसमें हिस्सा लिया" : "Caregiver report: we took part"}</label><button className="learning-primary" disabled={!caregiverDone} onClick={() => finishStep()}>{hi ? "रिपोर्ट सहेजो" : "Save caregiver report"}</button></> : <>
        {step.countingObjects && <div><div className="learning-counting-objects" role="group" aria-label={hi ? "हर चीज़ एक बार गिनो" : "Count each object once"}>{step.countingObjects.map((object,i) => <button key={i} aria-label={`${object.label[lang]} ${i+1}`} aria-pressed={draft.counted?.includes(i) ?? false} disabled={!!feedback || draft.counted?.includes(i)} onClick={() => save({ counted:[...(draft.counted ?? []),i] })}><span aria-hidden="true">{object.picture}</span>{draft.counted?.includes(i) && <strong>{draft.counted.indexOf(i)+1}</strong>}</button>)}</div><p role="status">{hi ? "तुमने गिने" : "You counted"}: {draft.counted?.length ?? 0}</p></div>}
        <div className="learning-picture-choices">{step.items.map(item => <motion.button whileHover={calm ? undefined : {y:-3}} whileTap={calm ? undefined : {scale:0.96}} transition={{type:"spring",stiffness:350,damping:26}} key={item.id} disabled={!!feedback || draft.picks.includes(item.id)} onClick={() => pick(item.id)}><span aria-hidden="true">{hi ? item.pictureHi ?? item.picture : item.picture}</span><strong>{item.label[lang]}</strong>{draft.picks.includes(item.id) && <small>{draft.picks.indexOf(item.id)+1}</small>}</motion.button>)}</div>
        {activity.interaction === "sequence" && <button onClick={() => save({ picks: [] })}>{hi ? "क्रम फिर से चुनो" : "Start the order again"}</button>}
        {simulationInput !== null && <div role="status" className="learning-feedback">{hi ? "इनपुट" : "Input"}: {simulationInput} → {hi ? "मॉडल आउटपुट" : "Model output"}: {simulationInput * 2}<p>{hi ? "यह सरल मॉडल है। इसमें वास्तविक मौसम या ऊर्जा हानि नहीं है।" : "This is a simplified model. Real weather and energy losses are excluded."}</p><button className="learning-primary" onClick={() => finishStep()}>{hi ? "मैंने मॉडल देखा" : "I explored the model"}</button></div>}
        {feedback && <div role="status" className="learning-feedback"><p>{feedback}</p><button className="learning-primary" onClick={() => correctFeedback ? finishStep() : save({ responseStatus:undefined, picks:[] })}>{correctFeedback ? (hi ? "आगे" : "Continue") : (hi ? "फिर कोशिश करो" : "Try again")}</button></div>}
      </>}
      <button onClick={() => { save({ hints: draft.hints + 1, hinted: true }); narrationSet(step.hint[lang]); speakFromGesture(step.hint[lang], { lang:hi ? "hi-IN" : "en-IN", rate:0.85 }); }}>{hi ? "मुफ़्त मदद" : "Free hint"}</button>
      <p className="learning-caption">{activity.objective[lang]}</p>
    </section>}
  </main></MotionConfig>;
}
