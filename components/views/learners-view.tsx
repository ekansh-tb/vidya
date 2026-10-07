"use client";

import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { placementLabel } from "@/lib/learning/placement";
import { sfx } from "@/lib/audio";
import type { LearnerProfile, LearnerId } from "@/lib/types";

const AVATAR_EMOJI: Record<string, string> = {
  peacock: "🦚", tiger: "🐯", owl: "🦉", elephant: "🐘", fox: "🦊", lion: "🦁",
};

export function LearnersView({ learners, currentId, onSwitch, onBack, onAdd }: {
  learners: LearnerProfile[]; currentId: LearnerId;
  onSwitch: (id: LearnerId) => void; onBack: () => void; onAdd: () => void;
}) {
  return <main className="learning-hub kids-world kids-switcher">
    <header className="kids-header"><div className="kids-brand"><span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span><strong>vidya</strong></div><button onClick={() => { sfx.click(); onBack(); }} className="kids-return"><ArrowLeft aria-hidden="true" size={18} />Back to learning</button></header>
    <div className="kids-heading"><div><h1>Choose your learning space</h1><p className="kids-subtitle">Linked learners on this device</p></div></div>
    <div className="kids-learner-list">
      {/* Show identity only. Practice and activity history stay with the active learner. */}
      {learners.map(learner => <button key={learner.id} className="kids-learner-card" aria-label={"Open learning space for " + learner.name} onClick={() => { sfx.click(); onSwitch(learner.id); }}>
        <span className="kids-learner-avatar" aria-hidden="true">{AVATAR_EMOJI[learner.state.avatarId || "peacock"] || "🦚"}</span>
        <span className="kids-learner-name"><strong>{learner.name}</strong><small>{placementLabel(learner)}{learner.school ? " · " + learner.school : ""}</small></span>
        {learner.id === currentId ? <span className="kids-learner-active"><Check aria-hidden="true" size={15} />Here now</span> : <ArrowRight aria-hidden="true" size={20} />}
      </button>)}
      <button className="kids-learner-card kids-learner-add" onClick={() => { sfx.click(); onAdd(); }}><span className="kids-learner-avatar"><Plus aria-hidden="true" /></span><span className="kids-learner-name"><strong>{learners.length ? "Link another learner" : "Link a learner"}</strong><small>Use a device code from your grown-up.</small></span><ArrowRight aria-hidden="true" size={20} /></button>
    </div>
  </main>;
}
