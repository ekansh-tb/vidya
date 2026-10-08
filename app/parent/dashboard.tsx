"use client";
import { makeLearner } from "@/components/views/add-learner-view";
import { PlacementEditor } from "@/components/parent/placement-editor";
import { profilePlacementFields } from "@/lib/learning/placement";
import { placementLabel } from "@/lib/learning/placement";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { readCreationProject, frameSVG } from "@/lib/creation/project";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { FileDown, HeartHandshake, ArrowRight, Bird, House, Users, Settings, LogOut, ArrowUpRight, UserRound } from "lucide-react";
import { dayKeyOf } from "@/lib/utils";
import { ClaimAccountPanel } from "@/components/parent/claim-account-panel";
import { LearnerLinkPanel } from "@/components/parent/learner-link-panel";
import { DevicePanel } from "@/components/parent/device-panel";
import { SyllabusPanel } from "@/components/parent/syllabus-panel";
import { SafetyPanel } from "@/components/parent/safety-panel";
import { AiConnectionsPanel } from "@/components/parent/ai-connections-panel";
import { AiTutorControlsPanel } from "@/components/parent/ai-tutor-controls-panel";
import { LearnerAiTutorAccessPanel } from "@/components/parent/learner-ai-tutor-access-panel";
import { FamilyAiPausePanel } from "@/components/parent/family-ai-pause-panel";
import { LearnerGuidancePanel } from "@/components/parent/learner-guidance-panel";
import { useGameStore } from "@/lib/game-store";
import type { LearnerProfile } from "@/lib/types";
import {
  chooseParentReportState,
  parseParentReportResponse,
  type ParentReportDecision,
  type ParentReportLoadState,
} from "@/lib/parent-report";
import { FamilyNoteComposer, CareNoteComposer } from "@/components/views/parent-view";
import { InfoPopover } from "@/components/ui/info-popover";
import { LearnerPicker } from "@/components/parent/learner-picker";
import { ParentEnrollment } from "@/components/parent/parent-enrollment";
import { ParentCircles } from "@/components/circles/parent-circles";
import { LearningPlanner } from "@/components/planning/learning-planner";
import { ParentInstallationAlert } from "@/components/parent/parent-installation-alert";
import { WeeklyInvitations, WeeklyFamilyInvitation } from "@/components/notifications/weekly-invitations";
import { ParentInstallationGuide } from "@/components/parent/parent-installation-guide";
import { familyParticipation, familyParticipationReport, parseParentAppearance, PARENT_DESTINATIONS, type ParentAppearance, type ParentDestination } from "@/components/parent/parent-experience-model";
import "./family-dashboard.css";

/** Ownership-scoped parent space. Navigation never changes the active learner device. */
export function ParentDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { profiles, hydrated, hydrate, updateLearnerMeta } = useGameStore();
  const heading = useRef<HTMLHeadingElement>(null);
  const [touchPreference, setTouchPreference] = useState<{ parentId: string | null; enabled: boolean }>({ parentId: null, enabled: false });
  const [adding, add] = useState(false);
  const [destination, setDestination] = useState<ParentDestination>("Overview");
  const [appearanceState, setAppearance] = useState<{ parentId: string | null; value: ParentAppearance }>({ parentId: null, value: "light" });
  const [savingLearner, saving] = useState(false);
  const [enrollmentError, enrollmentErrorSet] = useState("");
  const [pendingEnrollment, pendingEnrollmentSet] = useState<LearnerProfile | null>(null);
  const [rosterRefresh, refreshRoster] = useState(0);
  const [rosterLoad, setRosterLoad] = useState<{ parentId: string | null; status: "loading" | "ready" | "error" }>({ parentId: null, status: "loading" });
  const [ownedRoster, roster] = useState<{parentId:string|null; learners:LearnerProfile[]}>({parentId:null,learners:[]});
  const updateProfile = (id:string, patch:Partial<LearnerProfile>) => {
    if (useGameStore.getState().profiles.learners[id]) updateLearnerMeta(id,patch);
    else roster(current => ({...current,learners:current.learners.map(l => l.id === id ? {...l,...patch} : l)}));
  };
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiPolicyRevision, setAiPolicyRevision] = useState(0);
  const [remoteReportCache, setRemoteReportCache] = useState<{
    parentId: string | null;
    reports: Record<string, ParentReportLoadState | { status: "denied" }>;
  }>({ parentId: null, reports: {} });

  useEffect(() => { hydrate(); }, [hydrate]);

  const activeParentId = isSignedIn ? user?.id ?? null : null;
  useEffect(() => {
    setSelectedId(null);
    pendingEnrollmentSet(null);
    enrollmentErrorSet("");
    add(false);
    setDestination("Overview");
  }, [activeParentId]);
  const hapticsEnabled = touchPreference.parentId === activeParentId && touchPreference.enabled;
  const touchFeedback = () => {
    if (!hapticsEnabled || typeof navigator.vibrate !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { navigator.vibrate(12); } catch { /* Unsupported hardware needs no fallback. */ }
  };
  const navigate = (next: ParentDestination) => {
    if (next === destination) return;
    touchFeedback();
    setDestination(next);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  };
  const appearance = appearanceState.parentId === activeParentId ? appearanceState.value : "light";
  useEffect(() => {
    if (!activeParentId) return;
    let value: ParentAppearance = "light";
    try { value = parseParentAppearance(localStorage.getItem(`vidya:parent:appearance:v1:${activeParentId}`)); } catch { /* Storage is optional. */ }
    setAppearance({ parentId: activeParentId, value });
    let enabled = false;
    try { enabled = localStorage.getItem(`vidya:parent:haptics:v1:${activeParentId}`) === "true"; } catch { /* Optional preference. */ }
    setTouchPreference({ parentId: activeParentId, enabled });
  }, [activeParentId]);
  const changeAppearance = (value: ParentAppearance) => {
    setAppearance({ parentId: activeParentId, value });
    if (activeParentId) try { localStorage.setItem(`vidya:parent:appearance:v1:${activeParentId}`, value); } catch { /* Continue for this visit. */ }
  };
  const localLearners = useMemo(() => {
    const remote = ownedRoster.parentId === activeParentId ? ownedRoster.learners : [];
    return remote.map(r => Object.values(profiles.learners).find(l => l.remoteId === r.remoteId && l.deviceToken) ?? r);
  }, [profiles.learners, ownedRoster, activeParentId]);
  useEffect(() => {
    if (!activeParentId) { roster({parentId:null,learners:[]}); return; }
    const controller = new AbortController();
    setRosterLoad({ parentId: activeParentId, status: "loading" });
    void (async () => {
      try {
        const response = await fetch("/api/parent/learners", {signal:controller.signal,cache:"no-store"});
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || !Array.isArray(data.learners)) { setRosterLoad({ parentId: activeParentId, status: "error" }); return; }
        const entries: LearnerProfile[] = [];
        for (const row of data.learners) {
          const context = profilePlacementFields.safeParse(row);
          if (!context.success || typeof row.id !== "string" || typeof row.name !== "string") continue;
          entries.push({...makeLearner({id:`remote:${row.id}`,name:row.name,...context.data,avatarId:"peacock",themeId:row.grade===null || row.grade<=2 ? "playful" : "vivid"}),remoteId:row.id,createdAt:row.createdAt});
        }
        roster({parentId:activeParentId,learners:entries});
        setRosterLoad({ parentId: activeParentId, status: "ready" });
      } catch { if (!controller.signal.aborted) setRosterLoad({ parentId: activeParentId, status: "error" }); }
    })();
    return () => controller.abort();
  }, [activeParentId, rosterRefresh]);
  const activeReports = useMemo(
    () => remoteReportCache.parentId === activeParentId ? remoteReportCache.reports : {},
    [activeParentId, remoteReportCache],
  );
  // A linked local profile is not parent-visible until the ownership-scoped
  // endpoint confirms it for this Clerk account. This prevents an account
  // switch on a shared browser from briefly revealing another parent's child.
  const learners = useMemo(() => localLearners.filter((learner) => {
    if (!learner.remoteId) return true;
    const report = activeReports[learner.remoteId];
    return report?.status !== "loading" && report?.status !== "denied" && Boolean(report);
  }), [activeReports, localLearners]);
  const selected = useMemo(
    () => learners.find((learner) => learner.id === selectedId) || learners[0] || null,
    [learners, selectedId],
  );
  const linkedRemoteIdsKey = useMemo(
    () => [...new Set(localLearners.map((learner) => learner.remoteId).filter((id): id is string => Boolean(id)))]
      .sort()
      .join(","),
    [localLearners],
  );

  useEffect(() => {
    if (!isLoaded || !hydrated) return;
    if (!activeParentId) {
      setRemoteReportCache({ parentId: null, reports: {} });
      return;
    }
    if (!linkedRemoteIdsKey) {
      setRemoteReportCache({ parentId: activeParentId, reports: {} });
      return;
    }

    const controller = new AbortController();
    const capturedParentId = activeParentId;
    const remoteIds = linkedRemoteIdsKey.split(",");
    setRemoteReportCache({
      parentId: capturedParentId,
      reports: Object.fromEntries(remoteIds.map((id) => [id, { status: "loading" }])),
    });

    remoteIds.forEach((remoteId) => {
      void (async () => {
        try {
          const response = await fetch(`/api/parent/learners/${encodeURIComponent(remoteId)}/state`, {
            signal: controller.signal,
            cache: "no-store",
          });
          const raw: unknown = await response.json().catch(() => null);
          const parsed = response.ok ? parseParentReportResponse(raw) : null;
          if (controller.signal.aborted) return;

          let next: ParentReportLoadState | { status: "denied" } = { status: "unavailable" };
          if (parsed?.status === "ready") {
            next = {
              status: "ready",
              state: parsed.state,
              revision: parsed.revision,
              updatedAt: parsed.updatedAt,
            };
          } else if (parsed?.status === "absent") {
            next = { status: "absent" };
          } else if ([401, 403, 404].includes(response.status)) {
            next = { status: "denied" };
          }

          setRemoteReportCache((current) => current.parentId === capturedParentId
            ? { ...current, reports: { ...current.reports, [remoteId]: next } }
            : current);
        } catch {
          if (controller.signal.aborted) return;
          setRemoteReportCache((current) => current.parentId === capturedParentId
            ? {
                ...current,
                reports: {
                  ...current.reports,
                  [remoteId]: { status: "unavailable" },
                },
              }
            : current);
        }
      })();
    });

    return () => controller.abort();
  }, [activeParentId, hydrated, isLoaded, linkedRemoteIdsKey]);

  const selectedReport = useMemo(() => {
    if (!selected) return null;
    const remote = selected.remoteId
      ? activeReports[selected.remoteId]
      : { status: "unlinked" as const };
    if (!remote || remote.status === "denied") return null;
    return chooseParentReportState(selected.state, remote);
  }, [activeReports, selected]);

  const pendingLinkedLearners = localLearners.filter((learner) =>
    learner.remoteId && (!activeReports[learner.remoteId] || activeReports[learner.remoteId].status === "loading"),
  ).length;
  const deniedLinkedLearners = localLearners.filter((learner) =>
    learner.remoteId && activeReports[learner.remoteId]?.status === "denied",
  ).length;

  const displayName =
    user?.firstName?.trim() ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Parent";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  const saveEnrollment = async (candidate: LearnerProfile) => {
    if (savingLearner) return;
    const l = {...candidate,id:pendingEnrollment?.id ?? candidate.id};
    pendingEnrollmentSet(l); saving(true); enrollmentErrorSet("");
    try {
      const response = await fetch("/api/parent/learners", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({name:l.name,board:l.board,grade:l.grade,placement:l.placement,localId:l.id,school:l.school,city:l.city,pickedSubjects:l.pickedSubjects,subjectsLocked:l.subjectsLocked}) });
      const data = await response.json();
      if (!response.ok || !data?.learner?.id) throw new Error(response.status === 401 ? "Your session expired. Sign in again." : data?.error ?? "Could not save. Please try again.");
      const context = profilePlacementFields.parse(data.learner);
      const saved = {...l,...context,name:data.learner.name,id:`remote:${data.learner.id}`,remoteId:data.learner.id};
      roster(current => ({parentId:activeParentId,learners:[...current.learners.filter(r=>r.remoteId!==saved.remoteId),saved]}));
      setSelectedId(saved.id); pendingEnrollmentSet(null); add(false); setDestination("Children");
    } catch (error) { enrollmentErrorSet(error instanceof Error ? error.message : "Check your connection and try again."); }
    finally { saving(false); }
  };

  if (!isLoaded || !hydrated) return <main className="parent-dashboard parent-family" data-parent-appearance={appearance}><div className="parent-loading" role="status">Opening your family space…</div></main>;
  if (!isSignedIn) return <main className="parent-dashboard parent-family" data-parent-appearance="light"><div className="parent-loading"><Link href="/sign-in?next=/parent">Sign in to open your family space</Link></div></main>;

  const rosterPending = rosterLoad.parentId !== activeParentId || rosterLoad.status === "loading";
  const rosterFailed = rosterLoad.parentId === activeParentId && rosterLoad.status === "error";
  const report = selectedReport ?? (selected ? chooseParentReportState(selected.state, { status: "unlinked" }) : null);
  const reportLearner = selected && report ? { ...selected, state: report.state } : null;
  const startEnrollment = () => { pendingEnrollmentSet(null); enrollmentErrorSet(""); add(true); navigate("Children"); };

  return <main className="parent-dashboard parent-family" data-parent-appearance={appearance}>
    <a className="parent-skip" href="#parent-content">Skip to family content</a>
    <header className="parent-header"><div className="parent-header-inner">
      <Link href="/parent" className="parent-brand"><Bird size={28} aria-hidden="true" /><span>Vidya<span className="parent-brand-caption">Family space</span></span></Link>
      <div className="parent-header-actions"><Link href="https://vidyagyan.study" className="compact-control" aria-label="Open learner app" title="Open learner app"><ArrowUpRight size={20} aria-hidden="true" /><span className="mobile-control-label">Open learner app</span></Link><SignOutButton><button type="button" className="compact-control" aria-label="Sign out" title="Sign out"><LogOut size={20} aria-hidden="true" /><span className="mobile-control-label">Sign out</span></button></SignOutButton></div>
    </div></header>
    <div className="parent-layout">
      <aside className="parent-sidebar"><nav aria-label="Parent navigation">{PARENT_DESTINATIONS.map(item => <button key={item} type="button" aria-label={item} title={item} aria-current={destination === item ? "page" : undefined} onClick={() => navigate(item)}>{item === "Overview" ? <House size={20} aria-hidden="true" /> : item === "Children" ? <Users size={20} aria-hidden="true" /> : <Settings size={20} aria-hidden="true" />}<span>{item}</span></button>)}</nav><p>Room to explore.<br />Someone to come back to.</p></aside>
      <section className="parent-content" id="parent-content" aria-label={destination}>
        <div className="parent-page-title"><div><p className="parent-eyebrow">{destination === "Overview" ? "Stay connected" : destination === "Children" ? "One learner, one learning space" : "Your family choices"}</p><h1 ref={heading} tabIndex={-1}>{destination}</h1></div><InfoPopover key={destination} className="parent-account" label="Your parent account" summary={<><UserRound size={20} aria-hidden="true" /><span className="mobile-control-label">{displayName}</span></>}><strong>{displayName}</strong>{email && email !== displayName && <p>{email}</p>}</InfoPopover></div>
        {learners.length > 0 && <LearnerPicker key={activeParentId} learners={learners} selectedId={selected?.id ?? ""} onChange={setSelectedId} onFeedback={touchFeedback} />}
        {selected && !adding && <SafetyPanel key={`safety-${selected.id}`} learner={selected} />}
        {learners.length === 0 && (pendingLinkedLearners > 0 || rosterPending) && <div className="parent-card" role="status"><h2>Checking your learners</h2><p>Confirming which saved profiles belong to your account.</p></div>}
        {rosterFailed && <div className="parent-card" role="alert"><h2>Your saved learners could not be loaded</h2><p>Check your connection and try again. Existing learner profiles have not been changed.</p><button onClick={() => refreshRoster(value => value + 1)}>Try again</button></div>}
        {learners.length === 0 && pendingLinkedLearners === 0 && !rosterPending && !rosterFailed && <div className="parent-card parent-welcome"><h2>A little setup. A world to explore.</h2><p>{deniedLinkedLearners > 0 ? "The profiles on this browser belong to another account. Add a learner to your own family space." : "Add your learner, confirm their level, then connect their device with a single-use code."}</p><ol><li>Sign in <span>Done</span></li><li>Add a learner and confirm their level</li><li>Link their device</li></ol><button className="parent-primary" onClick={startEnrollment}>Add a learner <ArrowRight size={16} aria-hidden="true" /></button></div>}
        {destination === "Overview" && <>
          <ParentInstallationAlert onOpenControls={()=>navigate("Controls")} />
          <WeeklyFamilyInvitation />
          {reportLearner && report && <><ReportSourceNotice source={report} /><FamilyOverview learner={reportLearner} /><SharedCreations learner={reportLearner} />
          <details className="parent-card"><summary>More practice observations</summary><ParticipationDetails learner={reportLearner} /><ReportExport learner={reportLearner} reportSource={report} /></details></>}
          <div className="parent-card parent-family-invitation"><HeartHandshake size={30} aria-hidden="true" /><div><p className="parent-eyebrow">An invitation, whenever you have time</p><h2>Let them lead the conversation.</h2><p>Ask, “What would you like to show me today?” Let your child choose a story, a creation or something they noticed away from the screen. A few unhurried minutes can be enough.</p><p className="parent-small">Missing a family review never blocks learning or removes rewards.</p></div></div>
          <div className="parent-card"><h2>What your child shares</h2><p>Routine reports contain practice observations. Private reflections and AI conversations do not appear here. Children choose what to show you themselves. Specific safeguarding concerns may need a separate response.</p></div>
        </>}
        <div hidden={destination !== "Children"}>
          <div className="parent-actions parent-section-actions"><p>Keep each learner’s level and devices together.</p><button className="parent-primary" onClick={startEnrollment}>Add a learner</button></div>
          {adding && <div aria-busy={savingLearner}>{enrollmentError && <p className="parent-error" role="alert">{enrollmentError} Your details are still here. Try saving again.</p>}<ParentEnrollment busy={savingLearner} onBack={() => { add(false); pendingEnrollmentSet(null); }} onSave={learner => void saveEnrollment(learner)} /></div>}
          {selected && !adding && <><div className="parent-card"><h2>{selected.name || "Your learner"}</h2><p>{placementLabel(selected)}{selected.school ? ` · ${selected.school}` : ""}</p><PlacementEditor learner={selected} onChange={patch => updateProfile(selected.id, patch)} /></div>
            <ClaimAccountPanel key={`claim-${selected.id}`} learner={selected} onClaimed={remoteId => updateLearnerMeta(selected.id, { remoteId })} />
            <LearnerLinkPanel key={`link-${selected.id}`} learner={selected} />
            <DevicePanel key={`devices-${selected.id}`} learner={selected} />
            {selected.remoteId && <details className="parent-card"><summary>Plan learning together</summary><LearningPlanner key={`plan-${selected.remoteId}`} endpoint={`/api/parent/learners/${selected.remoteId}/plan`} /></details>}
            <details className="parent-card"><summary>Optional learning setup</summary>{selected.board && <SyllabusPanel key={`syllabus-${selected.id}`} learner={selected} onSave={patch => updateLearnerMeta(selected.id, patch)} />}
              {profiles.learners[selected.id] ? <><FamilyNoteComposer name={selected.name || "your learner"} note={selected.familyNote} onChange={next => updateProfile(selected.id, { familyNote: next })} />{selected.placement?.kind !== "early-years" && <CareNoteComposer name={selected.name || "your learner"} note={selected.careNote} onChange={next => updateProfile(selected.id, { careNote: next })} />}</> : <p>Family and care notes can be edited on the enrolled learner device. This linked report does not save note edits across devices.</p>}
            </details></>}
        </div>
        <div hidden={destination !== "Controls"}>
          <section className="parent-card"><h2>Appearance</h2><p>Choose how this family space looks. This does not change your child’s theme.</p><div className="parent-appearance" role="group" aria-label="Family space appearance">{(["light", "dark", "system"] as const).map(value => <button key={value} type="button" aria-pressed={appearance === value} onClick={() => changeAppearance(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>)}</div></section>
          <section className="parent-card"><h2>Touch feedback</h2><label className="parent-touch-preference"><input type="checkbox" checked={hapticsEnabled} onChange={event => {
            const enabled = event.target.checked;
            setTouchPreference({ parentId: activeParentId, enabled });
            if (activeParentId) try { localStorage.setItem(`vidya:parent:haptics:v1:${activeParentId}`, String(enabled)); } catch { /* Continue for this visit. */ }
          }} />Gentle vibration when navigating</label><p className="parent-small">Optional on supported devices. Respects reduced motion and stays separate from your child’s settings.</p></section>
          <ParentInstallationGuide />
          <WeeklyInvitations key={`weekly-invitations-${activeParentId}`} />
          <ParentCircles learnerId={selected?.remoteId} />
          <details className="parent-card"><summary>Optional AI settings</summary><p>Linking a device does not enable AI tutoring. These settings remain separate.</p>
            <AiConnectionsPanel key={`ai-connections-${activeParentId}`} onConnectionsChanged={() => setAiPolicyRevision(revision => revision + 1)} />
            <AiTutorControlsPanel key={`ai-tutors-${activeParentId}`} refreshToken={aiPolicyRevision} onProfilesChanged={() => setAiPolicyRevision(revision => revision + 1)} />
            <FamilyAiPausePanel key={`family-ai-pause-${activeParentId}`} onPaused={() => setAiPolicyRevision(revision => revision + 1)} />
            {selected && (selected.placement?.kind === "early-years" ? <div className="learning-panel"><h2>Preschool guidance</h2><p>Nursery, LKG and UKG use authored guidance and scripted companion reactions. AI tutoring stays unavailable.</p></div> : <><LearnerAiTutorAccessPanel key={`learner-ai-access-${activeParentId}`} learner={selected} refreshToken={aiPolicyRevision} />{selected.remoteId && <LearnerGuidancePanel key={`guidance-${selected.remoteId}`} learnerId={selected.remoteId} />}</>)}
          </details>
        </div>
        <footer className="parent-footer">Practice observations describe the available evidence. A completed activity does not prove understanding. No recorded activity does not mean no learning.<Link href="/mission">Our mission</Link></footer>
      </section>
    </div>
  </main>;
}

function FamilyOverview({ learner }: { learner: LearnerProfile }) {
  const report = familyParticipation(learner.state);
  return <section className="parent-card"><div className="parent-summary-title"><div><p className="parent-eyebrow">Last seven calendar days</p><h2>{learner.name || "Your learner"}’s participation</h2></div><span className="parent-small">{report.window}</span></div>
    <div className="parent-week" aria-label="Recorded participation by day">{report.days.map(day => <div key={day.day}><span>{day.label}</span><span className={`parent-day ${day.app ? "has-app" : day.caregiver ? "has-caregiver" : ""}`} aria-label={`${day.day}: ${day.app ? "app participation" : day.caregiver ? "caregiver-reported activity" : "no recorded activity"}`}>{day.app ? "●" : day.caregiver ? "○" : "·"}</span></div>)}</div>
    <p className="parent-small">Filled circles: app participation. Outlined circles: caregiver reports. Both are shown separately in the totals.</p>
    <dl className="parent-stats"><div><dt>App completions</dt><dd>{report.appCompletions}</dd></div><div><dt>Caregiver reports</dt><dd>{report.caregiverReports}</dd></div><div><dt>Creation activities completed</dt><dd>{report.completedCreations}</dd></div></dl>
    {report.appCompletions + report.caregiverReports === 0 && <p>No activity completion records in this window. Older rooms may not record this evidence, and offline changes may still need to sync.</p>}
  </section>;
}

function SharedCreations({ learner }: { learner: LearnerProfile }) {
  const projects = (learner.state.creativeStudio?.projects ?? []).map(readCreationProject).filter(project => project?.visibility === "parent").slice(-6);
  return <section className="parent-card"><h2>Creations they chose to share</h2><p>Your child controls which saved creations appear here. Private projects and unfinished drafts stay out of this view.</p>
    {projects.length ? <div className="parent-shared-grid">{projects.map(project => project && <details key={project.id} className="parent-shared-project"><summary>{project.title || "Untitled creation"}<span className="parent-small"> · {project.mode}</span></summary><Image src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(frameSVG(project.frames[0]))}`} width={720} height={480} unoptimized alt={`First frame of ${project.title || "their shared creation"}`} /><p>{project.frames[0].caption}</p>{project.mode === "story" && project.pages.map(page => <p key={page.id}>{page.text}</p>)}</details>)}</div> : <p>No shared creations yet. There is no expectation to share everything.</p>}
  </section>;
}

function ParticipationDetails({ learner }: { learner: LearnerProfile }) {
  const report = familyParticipation(learner.state);
  return <><dl className="parent-stats"><div><dt>Response attempts</dt><dd>{report.attempts}</dd></div><div><dt>Independent responses</dt><dd>{report.independentResponses}</dd></div><div><dt>Hints / retries</dt><dd>{report.hints} / {report.retries}</dd></div></dl><p>A hinted response is different from an independent answer. These figures do not score ability or personality.</p></>;
}

function ReportExport({ learner, reportSource }: { learner: LearnerProfile; reportSource: ParentReportDecision }) {
  return <button className="parent-secondary" onClick={() => {
    const source = reportSource.source === "remote" ? `Synced progress: ${reportSource.updatedAt}` : "Source: progress available on this device; synced records may be unavailable.";
    const report = familyParticipationReport(learner.name || "Learner", placementLabel(learner), learner.state) + `\n${source}\n`;
    const url = URL.createObjectURL(new Blob([report], { type: "text/markdown" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `vidya-practice-${dayKeyOf(new Date())}.md`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }}><FileDown size={16} aria-hidden="true" /> Download practice observations</button>;
}

function ReportSourceNotice({ source }: { source: ParentReportDecision }) {
  if (source.source === "remote") {
    const updated = source.updatedAt
      ? new Date(source.updatedAt).toLocaleString()
      : "the latest sync";
    return (
      <div
        className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-300">
          Synced progress
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Reporting uses the learner&apos;s validated server sync from {updated}.
        </p>
      </div>
    );
  }

  const isFallback = source.fallbackReason !== "unlinked";
  const detail = source.fallbackReason === "loading"
    ? "Showing progress stored on this device while synced progress loads."
    : source.fallbackReason === "absent"
      ? "No synced progress has been saved yet. Showing progress stored on this device."
      : source.fallbackReason === "unavailable"
        ? "Synced progress is unavailable right now. Showing progress stored on this device."
        : "This profile is not linked. Reporting uses progress stored on this device.";

  return (
    <div
      className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="text-[10px] uppercase tracking-widest font-bold text-amber-300">
        {isFallback ? "Local fallback" : "Local report"}
      </div>
      <p className="mt-1 text-xs text-neutral-400">{detail}</p>
    </div>
  );
}
