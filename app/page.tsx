"use client";

import { useEffect, useMemo, useState } from "react";
import { EnrollmentEntry } from "@/components/views/enrollment-entry";
import { LearningHub } from "@/components/views/learning-hub";
import { HomeView, type HomeTab } from "@/components/views/home-view";
import { SubjectView } from "@/components/views/subject-view";
import { QuizView } from "@/components/views/quiz-view";
import { MatchView } from "@/components/views/match-view";
import { ClassroomView } from "@/components/views/classroom-view";
import { TutorView } from "@/components/views/tutor-view";
import { FieldTripView } from "@/components/views/field-trip-view";
import { AssemblyView } from "@/components/views/assembly-view";
import { NotebookView } from "@/components/views/notebook-view";
import { LibraryView } from "@/components/views/library-view";
import { MusicView } from "@/components/views/music-view";
import { WellnessView } from "@/components/views/wellness-view";
import { ResultsView } from "@/components/views/results-view";
import { ProfileView } from "@/components/views/profile-view";
import { ShopView } from "@/components/views/shop-view";
import { ParentView } from "@/components/views/parent-view";
import { SettingsView } from "@/components/views/settings-view";
import { LearnersView } from "@/components/views/learners-view";
import { SubjectPickerView } from "@/components/views/subject-picker-view";
import { ExamPrepView } from "@/components/views/exam-prep-view";
import { AddLearnerView } from "@/components/views/add-learner-view";
import { ReviewView } from "@/components/views/review-view";
import { LinkAccountView } from "@/components/views/link-account-view";
import { CosmicBg, cosmicModeForGrade } from "@/components/effects/cosmic-bg";
import { RoomTransition } from "@/components/effects/room-transition";
import { VoiceBubble } from "@/components/effects/voice-bubble";
import { SaveErrorBanner } from "@/components/effects/save-error-banner";
import { BadgeToast } from "@/components/effects/badge-toast";
import { ThemeApplier, themeForGrade, type ThemeId } from "@/components/theme-applier";
import { useGameStore } from "@/lib/game-store";
import { recommendNextQuest } from "@/lib/adaptive/recommendation";
import type { QuizResult, SubjectId, ViewName } from "@/lib/types";
import { subjectsForLearner } from "@/lib/content/subjects";
import { hasPack } from "@/lib/content/packs/pack-index";
import { startMusic, stopMusic, setMusicVolume, setSfxVolume, setSfxEnabled } from "@/lib/audio";
import { useSync } from "@/lib/sync/use-sync";
import { canSync } from "@/lib/sync/client";
import { AccountEntry } from "@/components/views/account-entry";

export default function HomePage() {
  const {
    state, learner, profiles, hydrated, set, reset, hydrate,
    switchLearner, upsertLearner, updateLearnerMeta,
  } = useGameStore();
  const [view, setView] = useState<{ name: ViewName; params?: Record<string, unknown> }>({ name: "home" });
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [recommendationNow, setRecommendationNow] = useState(() => Date.now());
  const [showAddLearner, setShowAddLearner] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!quizResult) return;
    const timer = window.setInterval(() => setRecommendationNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [quizResult]);

  // Mirrors the active learner's progress to the server once they are linked.
  // No-op for anonymous device-local profiles, and never blocks play.
  const sync = useSync();

  useEffect(() => {
    if (!hydrated) return;
    setSfxEnabled(state.settings.sound);
    setMusicVolume(state.settings.musicVolume);
    setSfxVolume(state.settings.sfxVolume);
    if (state.settings.music && state.onboarded) startMusic();
    else stopMusic();
  }, [hydrated, state.settings.sound, state.settings.music, state.settings.musicVolume, state.settings.sfxVolume, state.onboarded]);

  useEffect(() => {
    setQuizResult(null);
    setView({ name: "home" });
    setShowAddLearner(false);
  }, [learner.id]);

  // Theme = learner override OR derived from grade
  const themeId: ThemeId = learner.themeId ?? themeForGrade(learner.grade);

  // Compute available exam packs for the current learner
  const learnerSubjects = useMemo(
    () => subjectsForLearner(learner.board, learner.pickedSubjects, learner.grade),
    [learner.board, learner.pickedSubjects, learner.grade],
  );
  const availablePackIds: SubjectId[] = useMemo(
    () => learnerSubjects.filter((s) => hasPack(s.id, learner.grade)).map((s) => s.id),
    [learnerSubjects, learner.grade],
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3 animate-float">🦚</div>
          <div className="text-white/60 text-sm">Loading…</div>
        </div>
      </div>
    );
  }

  // Account-backed enrollment is mandatory for new and legacy local profiles.
  if (!canSync(learner) || showAddLearner) return <><ThemeApplier theme="playful"/><AccountEntry onCancel={canSync(learner) ? () => setShowAddLearner(false) : undefined}/></>;

  // First-time onboarding (only when the active learner has never been named)
  if (!state.onboarded) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <EnrollmentEntry
          defaultName={learner.name || ""}
          onComplete={async (data) => {
            const { name, avatarId, interests, board, grade } = data;
            // Curriculum first, then flip `onboarded`. By the time this render
            // path falls through to the picker gate / home, the learner's board
            // and grade are the ones they actually chose.
            updateLearnerMeta(learner.id, { name, interests, board, grade, ...("placement" in data ? { placement: data.placement, learningLanguage: data.learningLanguage, themeId: "playful" as const } : {}) });
            set((prev) => ({ ...prev, name, avatarId, onboarded: true }));
          }}
        />
        <VoiceBubble />
        <SaveErrorBanner />
      </>
    );
  }

  // Add-learner overlay (multi-step)
  if (showAddLearner) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <CosmicBg mode={cosmicModeForGrade(learner.grade)} intensity={0.7} />
        <AddLearnerView
          existingIds={Object.keys(profiles.learners)}
          onSave={(l) => {
            upsertLearner(l);
            switchLearner(l.id);
            setShowAddLearner(false);
          }}
          onBack={() => setShowAddLearner(false)}
        />
        <VoiceBubble />
        <SaveErrorBanner />
      </>
    );
  }

  // Subject-picker gate — IGCSE, ICSE and Cambridge Lower Secondary all
  // require picking subjects first (Lower Secondary needs the language choice:
  // Hindi vs French vs Spanish).
  const needsPicker =
    (learner.board === "cambridge-igcse" ||
      learner.board === "icse" ||
      learner.board === "cambridge-lower-secondary") && !learner.subjectsLocked;
  if (needsPicker) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <CosmicBg mode={cosmicModeForGrade(learner.grade)} intensity={0.7} />
        <SubjectPickerView
          learner={learner}
          onSave={(picked) => {
            updateLearnerMeta(learner.id, { pickedSubjects: picked, subjectsLocked: true });
            setView({ name: "home" });
          }}
        />
        <VoiceBubble />
        <SaveErrorBanner />
      </>
    );
  }

  const navigate = (name: ViewName, params?: Record<string, unknown>) => {
    setView({ name, params });
  };
  const back = () => setView({ name: "home" });
  const showQuizResult = (result: QuizResult) => {
    setRecommendationNow(Date.now());
    setQuizResult(result);
  };

  let content: React.ReactNode;
  if (quizResult) {
    const recommendation = quizResult.isDaily
      ? undefined
      : recommendNextQuest({
          learner,
          progress: state.progress,
          missedQuestions: state.missedQuestions,
          rotationIndex: state.stats.quizzesCompleted,
          now: recommendationNow,
          recentTopic: quizResult.subjectId && quizResult.topicId
            ? { subjectId: quizResult.subjectId, topicId: quizResult.topicId }
            : undefined,
        });
    const goBack = () => {
      const sId = quizResult.subjectId;
      setQuizResult(null);
      if (!quizResult.isDaily && sId) setView({ name: "subject", params: { subjectId: sId } });
      else back();
    };
    const startRecommendation = !recommendation || recommendation.kind === "unavailable"
      ? undefined
      : () => {
          setQuizResult(null);
          if (recommendation.kind === "due-review") {
            setView({ name: "review" });
            return;
          }
          if (recommendation.kind === "study-pack") {
            setView({ name: "exam-prep", params: { subjectId: recommendation.subjectId } });
            return;
          }
          setView({
            name: "quiz",
            params: {
              subjectId: recommendation.subjectId,
              topicId: recommendation.topicId,
            },
          });
        };
    content = (
      <ResultsView
        result={quizResult}
        state={state}
        recommendation={recommendation}
        onDone={goBack}
        onStartRecommendation={startRecommendation}
      />
    );
  } else if (learner.placement?.kind === "early-years" && !["settings", "parent", "learners", "link-account", "profile"].includes(view.name)) {
    content = <LearningHub onBack={back} onSettings={() => navigate("settings")} onSwitch={() => navigate("learners")} onLink={() => navigate("link-account")}/>;
  } else {
    switch (view.name) {
      case "activities":
        content = <LearningHub onBack={back} onSettings={() => navigate("settings")} onSwitch={() => navigate("learners")} onLink={() => navigate("link-account")}/>;
        break;
      case "home":
        content = <HomeView state={state} learner={learner} onNavigate={navigate} tab={(["today", "explore", "create", "journey"].includes(String(view.params?.tab)) ? view.params?.tab : "today") as HomeTab} />;
        break;
      case "subject":
        content = (
          <SubjectView
            subjectId={view.params!.subjectId as SubjectId}
            state={state}
            learner={learner}
            onNavigate={navigate}
            onBack={back}
            voiceEnabled={state.settings.voice}
          />
        );
        break;
      case "quiz":
        content = (
          <QuizView
            subjectId={view.params!.subjectId as SubjectId}
            topicId={view.params!.topicId as string}
            isDaily={false}
            learner={learner}
            learnerSubjects={learnerSubjects}
            state={state}
            setState={set}
            onFinish={showQuizResult}
            onClose={() => navigate("subject", { subjectId: view.params!.subjectId })}
            voiceEnabled={state.settings.voice}
          />
        );
        break;
      case "match":
        content = (
          <MatchView
            subjectId={view.params!.subjectId as SubjectId}
            topicId={view.params!.topicId as string}
            learner={learner}
            state={state}
            setState={set}
            onFinish={showQuizResult}
            onClose={() => navigate("subject", { subjectId: view.params!.subjectId })}
          />
        );
        break;
      case "daily":
        content = (
          <QuizView
            isDaily={true}
            learner={learner}
            learnerSubjects={learnerSubjects}
            state={state}
            setState={set}
            onFinish={showQuizResult}
            onClose={back}
            voiceEnabled={state.settings.voice}
          />
        );
        break;
      case "profile":
        content = <ProfileView state={state} learner={learner} setState={set} onBack={back} onNavigate={navigate} />;
        break;
      case "shop":
        content = <ShopView state={state} setState={set} onBack={back} />;
        break;
      case "parent":
        content = (
          <ParentView
            state={state}
            learner={learner}
            onBack={back}
            onReset={() => { reset(); back(); }}
            onUpdateLearner={(patch) => updateLearnerMeta(learner.id, patch)}
          />
        );
        break;
      case "settings":
        content = <SettingsView state={state} setState={set} onBack={back} onNavigate={navigate} />;
        break;
      case "review":
        content = <ReviewView learner={learner} state={state} setState={set} onBack={back} />;
        break;
      case "friends":
        content = (
          <ClassroomView
            state={state}
            setState={set}
            learner={learner}
            onBack={back}
          />
        );
        break;
      case "tutor":
        content = (
          <TutorView
            state={state}
            learner={learner}
            initialSubject={view.params?.subjectId as SubjectId | undefined}
            onBack={back}
          />
        );
        break;
      case "field-trip":
        content = <FieldTripView state={state} setState={set} onBack={back} />;
        break;
      case "assembly":
        content = (
          <AssemblyView
            state={state}
            setState={set}
            onBack={back}
            voiceEnabled={state.settings.voice}
            grade={learner.grade ?? undefined}
            board={learner.board ?? undefined}
            school={learner.school}
          />
        );
        break;
      case "notebook":
        content = (
          <NotebookView
            state={state}
            setState={set}
            onBack={back}
            initialSubject={view.params?.subjectId as SubjectId | undefined}
          />
        );
        break;
      case "library":
        content = <LibraryView state={state} setState={set} onBack={back} />;
        break;
      case "music":
        content = <MusicView state={state} setState={set} onBack={back} />;
        break;
      case "wellness":
        content = <WellnessView state={state} setState={set} onBack={back} />;
        break;
      case "exam-prep":
        content = (
          <ExamPrepView
            state={state}
            setState={set}
            onBack={back}
            onNavigate={navigate}
            subjectId={view.params?.subjectId as SubjectId | undefined}
            availablePackIds={availablePackIds}
            grade={learner.grade ?? undefined}
            school={learner.school}
            board={learner.board ?? undefined}
            uploaded={learner.schoolSyllabus}
          />
        );
        break;
      case "learners":
        content = (
          <LearnersView
            learners={Object.values(profiles.learners).filter((l,i,all) => canSync(l) && all.findIndex(other=>other.remoteId===l.remoteId && canSync(other))===i)}
            currentId={learner.id}
            onSwitch={(id) => { switchLearner(id); }}
            onBack={back}
            onAdd={() => setShowAddLearner(true)}
          />
        );
        break;
      case "link-account":
        content = <LinkAccountView learner={learner} onBack={back} />;
        break;
      case "subject-picker":
        content = (
          <SubjectPickerView
            learner={learner}
            onSave={(picked) => {
              updateLearnerMeta(learner.id, { pickedSubjects: picked, subjectsLocked: true });
              back();
            }}
          />
        );
        break;
      default:
        content = <HomeView state={state} learner={learner} onNavigate={navigate} tab={(["today", "explore", "create", "journey"].includes(String(view.params?.tab)) ? view.params?.tab : "today") as HomeTab} />;
    }
  }

  return (
    <>
      <ThemeApplier theme={themeId} />
      <div className="account-save-status" role="status">{learner.learningLanguage === "hi" ? ({idle:"खाता जोड़ें",syncing:"खाते में सहेज रहे हैं…",synced:"खाते में सहेजा",offline:"ऑफ़लाइन: इस डिवाइस पर सहेजा, इंटरनेट पर सिंक होगा",error:"खाते में नहीं सहेजा: फिर जोड़ें या इंटरनेट जाँचें"})[sync.status] : ({idle:"Connect an account",syncing:"Saving to your account…",synced:"Saved to your account",offline:"Offline: saved on this device, waiting to sync",error:"Account save unavailable. Check connection or reconnect"})[sync.status]}</div>
      <CosmicBg mode={cosmicModeForGrade(learner.grade)} intensity={0.7} />
      {/* Each view change reads as stepping into a different room, which is the
          metaphor the whole product is built on (see VISION.md). `door` marks
          the transitions that are genuinely entering a learning space rather
          than flipping a settings panel. */}
      <RoomTransition
        roomKey={quizResult ? "results" : view.name}
        door={!quizResult && ["subject", "classroom", "tutor", "field-trip", "assembly", "library", "music", "exam-prep"].includes(view.name)}
      >
        {content}
      </RoomTransition>
      <VoiceBubble />
      <SaveErrorBanner />
      {/* Mounted once at the root so a badge earned mid-quiz or mid-Move-Break
          is announced wherever the child is standing. */}
      <BadgeToast badges={state.badges} learnerId={learner.id} />
    </>
  );
}
