"use client";

import { useId, useState } from "react";
import { makeLearner } from "@/components/views/add-learner-view";
import { BOARDS, gradesForBoard } from "@/lib/content/boards";
import type { Board, LearnerProfile } from "@/lib/types";
import type { LearningPlacement } from "@/lib/learning/placement";

type Level = "nursery" | "lkg" | "ukg" | "school";
export function ParentEnrollment({ onSave, onBack, busy }: {
  onSave: (learner: LearnerProfile) => void; onBack: () => void; busy: boolean;
}) {
  const prefix = useId();
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [board, setBoard] = useState<Board | "">("");
  const [grade, setGrade] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const complete = name.trim().length > 0 && level && (level !== "school" || (board && grade !== null)) && confirmed;
  return <form className="parent-card parent-enrollment" onSubmit={event => {
    event.preventDefault();
    if (!complete || busy) return;
    const placement: LearningPlacement = level === "school"
      ? { version: 1, kind: "school", board: board as Board, grade: grade! }
      : { version: 1, kind: "early-years", level: level as Exclude<Level, "school"> };
    onSave(makeLearner({ id: crypto.randomUUID(), name: name.trim(), board: placement.kind === "school" ? placement.board : null,
      grade: placement.kind === "school" ? placement.grade : null, placement, avatarId: "peacock", themeId: "vivid" }));
  }}>
    <h2>Add your learner</h2><p>Choose their actual learning level. Optional interests and subjects can follow later.</p>
    <fieldset disabled={busy}>
      <label htmlFor={`${prefix}-name`}>Learner name</label>
      <input id={`${prefix}-name`} maxLength={80} required autoComplete="off" value={name} onChange={event => setName(event.target.value)} />
      <label htmlFor={`${prefix}-level`}>Learning level</label>
      <select id={`${prefix}-level`} required value={level} onChange={event => { setLevel(event.target.value as Level); setConfirmed(false); }}>
        <option value="">Choose a level</option><option value="nursery">Nursery</option><option value="lkg">LKG</option><option value="ukg">UKG</option><option value="school">School grade</option>
      </select>
      {level === "school" && <div className="parent-form-grid"><div>
        <label htmlFor={`${prefix}-board`}>Curriculum</label><select id={`${prefix}-board`} value={board} required onChange={event => { setBoard(event.target.value as Board); setGrade(null); setConfirmed(false); }}>
          <option value="">Choose a curriculum</option>{BOARDS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select></div><div><label htmlFor={`${prefix}-grade`}>Grade</label><select id={`${prefix}-grade`} value={grade ?? ""} required disabled={!board} onChange={event => { setGrade(Number(event.target.value) || null); setConfirmed(false); }}>
          <option value="">Choose a grade</option>{board && gradesForBoard(board).map(value => <option key={value} value={value}>Grade {value}</option>)}
        </select></div></div>}
      {level && <label className="parent-check"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /><span>I confirm this learning level. It does not confirm age or curriculum stage.</span></label>}
      <div className="parent-actions"><button className="parent-primary" type="submit" disabled={!complete}>{busy ? "Saving learner…" : "Save and link a device"}</button><button type="button" onClick={onBack}>Cancel</button></div>
    </fieldset>
  </form>;
}
