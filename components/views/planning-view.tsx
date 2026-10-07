"use client";
import type { LearnerProfile } from "@/lib/types";
import { LearningPlanner } from "@/components/planning/learning-planner";
export function PlanningView({ learner, onBack, onOpenActivity }: { learner: LearnerProfile; onBack:()=>void; onOpenActivity?:(id:string,revision:number)=>void }) {
  return <div className="max-w-5xl mx-auto px-4 py-6"><button type="button" onClick={onBack} className="min-h-11 px-4 rounded-xl border border-[var(--border)]">Back</button>{learner.remoteId ? <LearningPlanner key={learner.id} endpoint="/api/learner/plan" deviceToken={learner.deviceToken} onOpenActivity={onOpenActivity} /> : <section className="vidya-plan"><h2>Your day, your choices</h2><p>Ask a parent to link this learner to save a family plan across devices. You can keep exploring without a schedule.</p></section>}</div>;
}
