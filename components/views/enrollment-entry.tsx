"use client";
import { useState } from "react";
import { OnboardingView } from "./onboarding-view";
import { EarlyYearsEnrollment, type EarlyEnrollmentData } from "./early-years-enrollment";
import type { Board } from "@/lib/types";
import { LearningCompanion } from "@/components/ui/learning-companion";
type SchoolData = { name: string; avatarId: string; interests: string[]; board: Board; grade: number };
export function EnrollmentEntry({ defaultName, onComplete }: { defaultName: string; onComplete: (data: SchoolData | EarlyEnrollmentData) => void | Promise<void> }) {
  const [kind, choose] = useState<"school" | "early" | null>(null);
  if (kind === "school") return <OnboardingView defaultName={defaultName} onComplete={onComplete}/>;
  if (kind === "early") return <EarlyYearsEnrollment defaultName={defaultName} onComplete={onComplete} onBack={() => choose(null)}/>;
  return <main className="learning-hub mode-early-years"><p className="learning-eyebrow">Vidya · विद्या</p><h1>A place for every little discovery</h1><LearningCompanion line="Welcome. Choose a learning level together. We will keep your progress here."/><section className="learning-panel"><h2>Where shall we start? · कहाँ से शुरू करें?</h2><div className="learning-card-grid"><button className="learning-card" onClick={() => choose("early")}><span aria-hidden="true">🌱</span><div><strong>Nursery, LKG & UKG</strong><p>Play, stories, making, and real-world play with a grown-up.</p><p>खेल, कहानियाँ और बड़े के साथ असली दुनिया में खोज।</p></div></button><button className="learning-card" onClick={() => choose("school")}><span aria-hidden="true">🔎</span><div><strong>School learners</strong><p>Choose your school board and exact grade.</p><p>स्कूल बोर्ड और अपनी कक्षा चुनें।</p></div></button></div></section></main>;
}
