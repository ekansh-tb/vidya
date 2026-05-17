"use client";

import { useEffect, useMemo, useState } from "react";
import { OnboardingView } from "@/components/views/onboarding-view";
import { HomeView } from "@/components/views/home-view";
import { SubjectView } from "@/components/views/subject-view";
import { QuizView } from "@/components/views/quiz-view";
import { MatchView } from "@/components/views/match-view";
import { FriendsView } from "@/components/views/friends-view";
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
import { ParticleField } from "@/components/effects/particles";
import { VoiceBubble } from "@/components/effects/voice-bubble";
import { ThemeApplier, themeForGrade, type ThemeId } from "@/components/theme-applier";
import { useGameStore } from "@/lib/game-store";
import type { QuizResult, SubjectId, ViewName } from "@/lib/types";
import { subjectsForLearner } from "@/lib/content/subjects";
import { PACK_BY_SUBJECT } from "@/lib/content/packs";
import { startMusic, stopMusic, setMusicVolume, setSfxVolume } from "@/lib/audio";

export default function HomePage() {
  const {
    state, learner, profiles, hydrated, set, reset, hydrate,
    switchLearner, upsertLearner, updateLearnerMeta,
  } = useGameStore();
  const [view, setView] = useState<{ name: ViewName; params?: Record<string, unknown> }>({ name: "home" });
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showAddLearner, setShowAddLearner] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    setMusicVolume(state.settings.musicVolume);
    setSfxVolume(state.settings.sfxVolume);
    if (state.settings.music && state.onboarded) startMusic();
    else stopMusic();
  }, [hydrated, state.settings.music, state.settings.musicVolume, state.settings.sfxVolume, state.onboarded]);

  useEffect(() => {
    setQuizResult(null);
    setView({ name: "home" });
    setShowAddLearner(false);
  }, [learner.id]);

  // Theme = learner override OR derived from grade
  const themeId: ThemeId = learner.themeId ?? themeForGrade(learner.grade);

  // Compute available exam packs for the current learner
  const learnerSubjects = useMemo(
    () => subjectsForLearner(learner.board, learner.pickedSubjects),
    [learner.board, learner.pickedSubjects],
  );
  const availablePackIds: SubjectId[] = useMemo(
    () => learnerSubjects.filter((s) => PACK_BY_SUBJECT[s.id]).map((s) => s.id),
    [learnerSubjects],
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

  // First-time onboarding (only when the active learner has never been named)
  if (!state.onboarded) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <ParticleField />
        <OnboardingView
          defaultName={learner.name || "Advika Jain"}
          onComplete={async ({ name, avatarId }) => {
            set((prev) => ({ ...prev, name, avatarId, onboarded: true }));
            updateLearnerMeta(learner.id, { name });
          }}
        />
        <VoiceBubble />
      </>
    );
  }

  // Add-learner overlay (multi-step)
  if (showAddLearner) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <ParticleField />
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
      </>
    );
  }

  // Subject-picker gate — IGCSE & ICSE both require picking subjects first
  const needsPicker =
    (learner.board === "cambridge-igcse" || learner.board === "icse") && !learner.subjectsLocked;
  if (needsPicker) {
    return (
      <>
        <ThemeApplier theme={themeId} />
        <ParticleField />
        <SubjectPickerView
          learner={learner}
          onSave={(picked) => {
            updateLearnerMeta(learner.id, { pickedSubjects: picked, subjectsLocked: true });
            setView({ name: "home" });
          }}
        />
        <VoiceBubble />
      </>
    );
  }

  const navigate = (name: ViewName, params?: Record<string, unknown>) => {
    setView({ name, params });
  };
  const back = () => setView({ name: "home" });

  let content: React.ReactNode;
  if (quizResult) {
    const goBack = () => {
      const sId = quizResult.subjectId;
      setQuizResult(null);
      if (!quizResult.isDaily && sId) setView({ name: "subject", params: { subjectId: sId } });
      else back();
    };
    const nextQuest = quizResult.isDaily || !quizResult.subjectId
      ? undefined
      : () => {
          const sId = quizResult.subjectId!;
          setQuizResult(null);
          setView({ name: "subject", params: { subjectId: sId } });
        };
    content = (
      <ResultsView
        result={quizResult}
        state={state}
        onDone={goBack}
        onNextQuest={nextQuest}
      />
    );
  } else {
    switch (view.name) {
      case "home":
        content = <HomeView state={state} learner={learner} onNavigate={navigate} />;
        break;
      case "subject":
        content = (
          <SubjectView
            subjectId={view.params!.subjectId as SubjectId}
            state={state}
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
            state={state}
            setState={set}
            onFinish={(r) => setQuizResult(r)}
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
            state={state}
            setState={set}
            onFinish={(r) => setQuizResult(r)}
            onClose={() => navigate("subject", { subjectId: view.params!.subjectId })}
          />
        );
        break;
      case "daily":
        content = (
          <QuizView
            isDaily={true}
            state={state}
            setState={set}
            onFinish={(r) => setQuizResult(r)}
            onClose={back}
            voiceEnabled={state.settings.voice}
          />
        );
        break;
      case "profile":
        content = <ProfileView state={state} setState={set} onBack={back} />;
        break;
      case "shop":
        content = <ShopView state={state} setState={set} onBack={back} />;
        break;
      case "parent":
        content = <ParentView state={state} onBack={back} onReset={() => { reset(); back(); }} />;
        break;
      case "settings":
        content = <SettingsView state={state} setState={set} onBack={back} />;
        break;
      case "friends":
        content = <FriendsView state={state} setState={set} onBack={back} />;
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
            grade={learner.grade}
            board={learner.board}
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
          />
        );
        break;
      case "learners":
        content = (
          <LearnersView
            learners={Object.values(profiles.learners)}
            currentId={learner.id}
            onSwitch={(id) => { switchLearner(id); }}
            onBack={back}
            onAddNevaan={() => setShowAddLearner(true)}
            onAddOther={() => setShowAddLearner(true)}
          />
        );
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
        content = <HomeView state={state} learner={learner} onNavigate={navigate} />;
    }
  }

  return (
    <>
      <ThemeApplier theme={themeId} />
      <ParticleField />
      {content}
      <VoiceBubble />
    </>
  );
}
