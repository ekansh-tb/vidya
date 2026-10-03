"use client";
import { useState } from "react";
import { BOARDS, gradesForBoard } from "@/lib/content/boards";
import { EARLY_LEVELS, placementLabel, type EarlyLevel, type LearningPlacement } from "@/lib/learning/placement";
import type { Board, LearnerProfile } from "@/lib/types";
export function PlacementEditor({ learner, onChange }: { learner: LearnerProfile; onChange: (patch: Partial<LearnerProfile>) => void }) {
  const [editing, edit] = useState(false);
  const [kind, chooseKind] = useState<"school"|"early-years">(learner.placement?.kind ?? "school");
  const [level, chooseLevel] = useState<EarlyLevel | null>(learner.placement?.kind === "early-years" ? learner.placement.level : null);
  const [board, chooseBoard] = useState<Board | null>(learner.board);
  const [grade, chooseGrade] = useState<number | null>(learner.grade);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    const placement: LearningPlacement | null = kind === "early-years" ? (level ? {version:1,kind,level} : null) : board && grade ? {version:1,kind,board,grade} : null;
    if (!placement) return;
    const patch = { placement, board:kind === "school" ? board : null, grade:kind === "school" ? grade : null };
    setBusy(true); setMessage("");
    try {
      if (learner.remoteId) {
        const res = await fetch(`/api/parent/learners/${encodeURIComponent(learner.remoteId)}`, {method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify(patch)});
        if (!res.ok) { setMessage(res.status === 401 || res.status === 404 ? "Sign in as the owning parent to change this linked profile." : "Could not save the learning level. Try again."); return; }
      }
      onChange(patch); edit(false); setMessage("Learning level saved. Identity and historical progress retained.");
    } catch { setMessage("Could not reach Vidya. Your existing placement remains saved."); } finally { setBusy(false); }
  };
  return <section className="buddy-panel my-4"><h2 className="font-bold">Learning placement</h2><p>{placementLabel(learner)}</p><p>Placement guides content. It does not establish age, reading ability, permissions, or a complete curriculum.</p>{!editing ? <button className="buddy-action mt-3" onClick={() => edit(true)}>Edit learning placement</button> : <div className="space-y-3 mt-3"><div className="flex gap-3"><button aria-pressed={kind === "early-years"} onClick={() => chooseKind("early-years")}>Nursery / LKG / UKG</button><button aria-pressed={kind === "school"} onClick={() => chooseKind("school")}>School</button></div>{kind === "early-years" ? <label>Level<select className="w-full p-3 bg-[var(--bg-base)]" value={level ?? ""} onChange={e => chooseLevel(e.target.value ? e.target.value as EarlyLevel : null)}><option value="">Choose level</option>{EARLY_LEVELS.map(l => <option key={l} value={l}>{l === "nursery" ? "Nursery" : l.toUpperCase()}</option>)}</select></label> : <><label>Board<select className="w-full p-3 bg-[var(--bg-base)]" value={board ?? ""} onChange={e => { chooseBoard(e.target.value ? e.target.value as Board : null); chooseGrade(null); }}><option value="">Choose board</option>{BOARDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}</select></label><label>Grade<select className="w-full p-3 bg-[var(--bg-base)]" value={grade ?? ""} onChange={e => chooseGrade(e.target.value ? Number(e.target.value) : null)}><option value="">Choose grade</option>{board && gradesForBoard(board).map(g => <option key={g} value={g}>Grade {g}</option>)}</select></label></>}<button className="buddy-action" disabled={busy || (kind === "school" ? !board || grade === null : !level)} onClick={save}>Save placement</button><button className="buddy-action" onClick={() => edit(false)}>Cancel</button></div>}{message && <p role="status">{message}</p>}</section>;
}
