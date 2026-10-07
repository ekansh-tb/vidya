"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { LearningActivity } from "@/lib/learning/activity";
import { EMPTY_LEARNING_PLAN, WEEKDAYS, learningPlanSchema, planConflicts, proposeSession, type LearningPlan, type PlanInterval } from "@/lib/planning/contracts";
import "./learning-planner.css";

type Props = { endpoint: string; deviceToken?: string; onOpenActivity?: (id: string, revision: number) => void };
export function LearningPlanner({ endpoint, deviceToken, onOpenActivity }: Props) {
  const prefix = useId();
  const [plan, setPlan] = useState<LearningPlan>(() => structuredClone(EMPTY_LEARNING_PLAN));
  const [revision, setRevision] = useState(0);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [assignedActivities, setAssignedActivities] = useState<LearningActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [changedRemotely, setChangedRemotely] = useState(false);
  const [chosen, setChosen] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(10);
  const [proposal, setProposal] = useState<{start:string;end:string} | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(endpoint, { credentials: "same-origin", cache: "no-store", headers: deviceToken ? { "x-vidya-device": deviceToken } : {}, signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The plan could not be loaded.");
      const checked = learningPlanSchema.safeParse(data.plan);
      if (!checked.success) throw new Error("The saved plan could not be read. Please ask for support.");
      if (signal?.aborted) return;
      setPlan(checked.data); setRevision(data.revision); setActivities(data.activities); setAssignedActivities(data.assignedActivities); setDirty(false); setChangedRemotely(false); setProposal(null); setMessage("");
    } catch (cause) { if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "The plan could not be loaded."); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [endpoint, deviceToken]);
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load]);
  function edit(update: (current: LearningPlan) => LearningPlan) { setPlan(update); setDirty(true); setMessage(""); setProposal(null); }
  async function save() {
    const checked = learningPlanSchema.safeParse(plan);
    if (!checked.success) { setError(checked.error.issues[0]?.message || "Check the plan’s times and labels."); return; }
    if (planConflicts(plan).some(item => item.blocking)) { setError("Resolve the activity time conflicts before saving."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(endpoint, { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json", ...(deviceToken ? { "x-vidya-device": deviceToken } : {}) }, body: JSON.stringify({ expectedRevision: revision, plan }) });
      const data = await response.json();
      if (!response.ok) { if (response.status === 409) setChangedRemotely(true); throw new Error(data.error || "The plan could not be saved."); }
      setRevision(data.revision); setDirty(false); setMessage("Saved for this learner and their family.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Your edits are still here. Try saving again when you are online."); }
    finally { setSaving(false); }
  }
  function schedule() {
    const activity = activities.find(item => `${item.id}@${item.revision}` === chosen);
    if (!activity || !proposal) return;
    edit(current => ({ ...current, sessions: [...current.sessions, { id: crypto.randomUUID(), activityId: activity.id, revision: activity.revision, date, ...proposal }] }));
    setMessage("Added to your draft. Save when you are ready.");
  }
  const preview = activities.find(item => `${item.id}@${item.revision}` === chosen);
  const conflicts = planConflicts(plan);
  return <section className="vidya-plan" aria-labelledby={`${prefix}-title`} aria-busy={loading || saving}>
    <header><div><p className="plan-kicker">Time you choose</p><h2 id={`${prefix}-title`}>A plan that fits your day</h2><p>Enter real commitments and the time you want to make available. Suggestions are optional. Missing a session never blocks learning.</p></div><button type="button" className="plan-print" onClick={() => window.print()} disabled={loading}>Print plan</button></header>
    <p className="plan-disclosure">This plan is shared with this learner’s linked family. It records planned time, not attendance, ability or private reflections.</p>
    {error && <p role="alert" className="plan-error">{error}</p>}
    {message && <p role="status" className="plan-message">{message}</p>}
    {loading ? <p role="status">Loading your saved plan…</p> : <>
      {error && !dirty && <button type="button" onClick={() => void load()}>Retry loading</button>}
      {changedRemotely && <div className="plan-conflict"><p>Your unsaved edits remain here. The saved plan or available activities changed.</p><button type="button" onClick={() => { if (window.confirm("Discard these unsaved edits and load the saved plan?")) void load(); }}>Load saved plan</button></div>}
      <label className="plan-timezone">Plan timezone<input value={plan.timezone} onChange={event => edit(current => ({ ...current, timezone: event.target.value }))} placeholder="For example, Asia/Kolkata" maxLength={80} disabled={saving} /></label>
      <div className="plan-columns"><IntervalEditor title="Actual commitments" note="School, travel, clubs, family time or anything already planned." items={plan.commitments} maximum={40} disabled={saving} onChange={items => edit(current => ({ ...current, commitments: items }))} /><IntervalEditor title="Available windows" note="Choose when learning would feel comfortable. Leave space for rest and play." items={plan.windows} maximum={21} disabled={saving} onChange={items => edit(current => ({ ...current, windows: items }))} /></div>
      <div className="plan-schedule"><h3>Choose a reviewed activity</h3><p>Only published activities for this learner’s saved level appear. General exploration is labelled separately from a school curriculum.</p>
        {!activities.length ? <p className="plan-empty">No reviewed activities are available for this placement yet. Your commitments and available time can still be saved.</p> : <>
          <div className="plan-form-row"><label>Activity<select value={chosen} onChange={event => { setChosen(event.target.value); setProposal(null); }} disabled={saving}><option value="">Choose an activity</option>{activities.map(item => <option key={`${item.id}@${item.revision}`} value={`${item.id}@${item.revision}`}>{item.title[language]}</option>)}</select></label><label>Preview language<select value={language} onChange={event => setLanguage(event.target.value as "en"|"hi")}><option value="en">English</option><option value="hi">हिन्दी</option></select></label></div>
          {preview && <details className="plan-preview"><summary>Preview: {preview.title[language]}</summary><p lang={language}>{preview.objective[language]}</p><p>{preview.alignment === "general-exploration" ? "General exploration" : "NCF foundational alignment"} · Revision {preview.revision}</p><ol>{preview.steps.map((step,index) => <li key={index} lang={language}><p>{step.instruction[language]}</p><p className="plan-small">Free hint: {step.hint[language]}</p></li>)}</ol><p lang={language}>{preview.offline[language]}</p><p className="plan-small">Editorial review limitations: {preview.review.limits}</p></details>}
          <div className="plan-form-row"><label>Actual date<input type="date" value={date} onChange={event => { setDate(event.target.value); setProposal(null); }} disabled={saving} /></label><label>Time to reserve (minutes)<input type="number" min={5} max={60} step={1} value={duration} onChange={event => { setDuration(Number(event.target.value)); setProposal(null); }} disabled={saving} /></label><button type="button" disabled={!preview || !date || saving || plan.sessions.length >= 24} onClick={() => { const next = proposeSession(plan,date,duration); setProposal(next); setMessage(next ? "Review this suggestion and adjust its time if you wish." : "No gap fits that date and duration. Enter an available window or choose another date."); }}>Suggest a time</button></div>
          {proposal && <div className="plan-form-row"><label>Suggested start<input type="time" value={proposal.start} onChange={event => setProposal(current => current && ({ ...current, start:event.target.value }))} /></label><label>Suggested end<input type="time" value={proposal.end} onChange={event => setProposal(current => current && ({ ...current, end:event.target.value }))} /></label><button type="button" disabled={saving || proposal.start >= proposal.end} onClick={schedule}>Add to draft</button></div>}
        </>}
      </div>
      <div className="plan-sessions"><h3>Your planned activities</h3>{!plan.sessions.length && <p>No activities scheduled. You can explore freely whenever you wish.</p>}{plan.sessions.map(session => {
        const activity = assignedActivities.find(item => item.id === session.activityId && item.revision === session.revision) ?? activities.find(item => item.id === session.activityId && item.revision === session.revision);
        return <div className="plan-session" key={session.id}><div><strong>{activity?.title[language] ?? "Activity unavailable for this placement"}</strong><p className="plan-small">{activity?.alignment === "general-exploration" ? "General exploration · " : ""}Revision {session.revision}</p></div><label>Date<input type="date" value={session.date} disabled={saving} onChange={event => edit(current => ({...current,sessions:current.sessions.map(item => item.id === session.id ? {...item,date:event.target.value} : item)}))} /></label><label>Start<input type="time" value={session.start} disabled={saving} onChange={event => edit(current => ({...current,sessions:current.sessions.map(item => item.id === session.id ? {...item,start:event.target.value} : item)}))} /></label><label>End<input type="time" value={session.end} disabled={saving} onChange={event => edit(current => ({...current,sessions:current.sessions.map(item => item.id === session.id ? {...item,end:event.target.value} : item)}))} /></label>{onOpenActivity && activity && <button type="button" onClick={() => onOpenActivity(session.activityId,session.revision)}>Open activity</button>}<button type="button" disabled={saving} onClick={() => edit(current => ({...current,sessions:current.sessions.filter(item => item.id !== session.id)}))}>Remove</button></div>;
      })}</div>
      {conflicts.length > 0 && <div className="plan-conflict" role="status"><h3>Check these times</h3><ul>{conflicts.map((conflict,index) => <li key={index}>{conflict.message}{!conflict.blocking && " You can keep this record, but check the commitments together."}</li>)}</ul></div>}
      <footer><span>{dirty ? "Unsaved changes" : `Saved revision ${revision}`}</span><button type="button" className="plan-save" disabled={!dirty || saving || conflicts.some(item=>item.blocking)} onClick={() => void save()}>{saving ? "Saving…" : "Save family plan"}</button></footer>
    </>}
  </section>;
}
function IntervalEditor({ title, note, items, maximum, disabled, onChange }: { title:string;note:string;items:PlanInterval[];maximum:number;disabled:boolean;onChange:(items:PlanInterval[])=>void }) {
  function patch(id:string, values:Partial<PlanInterval>) { onChange(items.map(item => item.id === id ? {...item,...values} : item)); }
  return <section><h3>{title}</h3><p>{note}</p>{items.map(item => <fieldset className="plan-interval" key={item.id} disabled={disabled}><legend>{item.label || "New time"}</legend><label>Label<input maxLength={80} value={item.label} onChange={event=>patch(item.id,{label:event.target.value})} placeholder="Describe your time" /></label><label>Day<select value={Number.isNaN(item.day) ? "" : item.day} onChange={event=>patch(item.id,{day:Number(event.target.value)})}><option value="">Choose a day</option>{WEEKDAYS.map((day,index)=><option value={index} key={day}>{day}</option>)}</select></label><div className="plan-form-row"><label>Start<input type="time" value={item.start} onChange={event=>patch(item.id,{start:event.target.value})} /></label><label>End<input type="time" value={item.end} onChange={event=>patch(item.id,{end:event.target.value})} /></label><button type="button" onClick={()=>onChange(items.filter(interval=>interval.id!==item.id))}>Remove</button></div></fieldset>)}<button type="button" disabled={disabled || items.length >= maximum} onClick={()=>onChange([...items,{id:crypto.randomUUID(),label:"",day:Number.NaN,start:"",end:""}])}>Add {title.toLowerCase() === "actual commitments" ? "commitment" : "available window"}</button></section>;
}
