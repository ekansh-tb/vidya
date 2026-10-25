'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Lightbulb, Printer } from 'lucide-react';
import type { GameState } from '@/lib/types';
import { SCIENCE_UNITS, SCIENCE_LESSONS, SCIENCE_QUESTIONS, SCIENCE_MOCK_IDS, SCIENCE_SOURCE, type RevisionUnit } from '@/lib/revision/science-term-one';
import { initialScienceRevision, readScienceRevision, type ScienceRevisionProgress, type ScienceRevisionAnswer } from '@/lib/revision/progress';
import { ScienceVisual } from './science-visual';
import './science-revision.css';

export function ScienceRevision({state,setState,onBack,onFullYear}:{state:GameState;setState:(f:(s:GameState)=>GameState)=>void;onBack:()=>void;onFullYear:()=>void}) {
 const progress=readScienceRevision(state.scienceRevision)??initialScienceRevision();
 const [hint,setHint]=useState(false),[recall,setRecall]=useState(false),[editingMock,setEditingMock]=useState(false);
 const save=(patch:Partial<ScienceRevisionProgress>)=>setState(s=>({...s,scienceRevision:{...(readScienceRevision(s.scienceRevision)??initialScienceRevision()),...patch,updatedAt:Date.now()}}));
 const change=(patch:Partial<ScienceRevisionProgress>)=>{setHint(false);setRecall(false);setEditingMock(false);save(patch);};
 const mode=progress.mode, mock=mode==='mock';
 const lessons=SCIENCE_LESSONS.filter(l=>l.unit===progress.unit);
 const questions=mock?SCIENCE_MOCK_IDS.map(id=>SCIENCE_QUESTIONS.find(q=>q.id===id)!):SCIENCE_QUESTIONS.filter(q=>q.unit===progress.unit);
 const length=mode==='learn'?lessons.length:questions.length,index=Math.min(progress.index,length-1),lesson=lessons[index],question=questions[index];
 const key=`${mode}:${question.id}`;
 const answer=progress.answers[key];
 const updateAnswer=(patch:Partial<ScienceRevisionAnswer>)=>setState(s=>{const p=readScienceRevision(s.scienceRevision)??initialScienceRevision();return {...s,scienceRevision:{...p,updatedAt:Date.now(),answers:{...p.answers,[key]:{...(p.answers[key]??{text:'',revealed:false}),...patch,updatedAt:Date.now()}}}};});
 const revealed=mock?!!progress.submittedAt:!!answer?.revealed;
 const advance=(delta:number)=>change({index:Math.max(0,Math.min(length-1,index+delta))});
 const mockAnswered=SCIENCE_MOCK_IDS.filter(id=>progress.answers[`mock:${id}`]?.text.trim()).length;
 const marked=SCIENCE_MOCK_IDS.filter(id=>progress.answers[`mock:${id}`]?.selfScore!==undefined);
 const marks=marked.reduce((sum,id)=>sum+(progress.answers[`mock:${id}`]?.selfScore??0),0);
 return <main className="science-revision" aria-labelledby="science-revision-title">
   <header className="revision-header"><button onClick={onBack}><ArrowLeft size={18} aria-hidden="true"/>Back</button><button onClick={onFullYear}>Full-year science</button></header>
   <section className="revision-intro"><h1 id="science-revision-title">Science, one idea at a time.</h1><p>Term 1 revision · Grade 6 · Units 1, 2 and 3</p><p className="revision-small">Cells · Materials and their structure · Forces and energy</p><details><summary>About this revision collection</summary><p>Prepared for the CNS Pune scope supplied by a parent. Unit order matches Cambridge Lower Secondary Science Learner’s Book 7. These are original Vidya questions, not an official school or Cambridge paper. Check your teacher’s notes for exclusions and the marking convention.</p><a href={SCIENCE_SOURCE} target="_blank" rel="noreferrer">Publisher’s unit contents</a></details></section>
   <nav className="revision-modes" aria-label="Science revision modes">{([{id:'learn',label:'Revise',Icon:BookOpen},{id:'practice',label:'Practise',Icon:Lightbulb},{id:'mock',label:'Mock paper',Icon:ClipboardList}] as const).map(({id,label,Icon})=><button key={id} aria-current={mode===id?'page':undefined} onClick={()=>change({mode:id,index:0})}><Icon size={20} aria-hidden="true"/>{label}</button>)}</nav>
   {!mock&&<div className="revision-units" role="group" aria-label="Choose a science unit">{SCIENCE_UNITS.map(unit=><button key={unit.id} aria-pressed={progress.unit===unit.id} onClick={()=>change({unit:unit.id as RevisionUnit,index:0})}>{unit.number}. {unit.title}</button>)}</div>}
   {mode==='learn'?<section className="revision-page" key={lesson.id}>
     <p className="revision-position">Idea {index+1} of {lessons.length}</p><h2>{lesson.title}</h2>
     {lesson.visual&&<ScienceVisual kind={lesson.visual}/>}
     <ul className="revision-points">{lesson.points.map(point=><li key={point}>{point}</li>)}</ul>
     <div className="revision-recall"><h3>Try without looking</h3><p>{lesson.check}</p><button aria-expanded={recall} onClick={()=>setRecall(!recall)}>{recall?'Hide explanation':'Check your explanation'}</button>{recall&&<p role="status">{lesson.answer}</p>}</div>
   </section>:<section className="revision-page" key={key}>
     {mock&&<div className="revision-mock-info"><h2>{progress.submittedAt?'Review your mock paper':'A 30-mark rehearsal'}</h2><p>15 questions · suggested 30 minutes · take a break whenever you need. Write or type your answers before revealing the guide.</p><p>{mockAnswered} of 15 answers entered{progress.submittedAt?` · ${marked.length} self-marked · ${marks}/30 self-assessed marks`:''}</p><button onClick={()=>window.print()}><Printer size={16} aria-hidden="true"/>Print all questions</button></div>}
     <p className="revision-position">Question {index+1} of {questions.length} · {question.marks} {question.marks===1?'mark':'marks'} · Unit {SCIENCE_UNITS.find(u=>u.id===question.unit)!.number}</p>
     <h2>{question.question}</h2>
     {question.options?<div className="revision-options">{question.options.map(option=><button key={option} disabled={revealed} aria-pressed={answer?.text===option} onClick={()=>updateAnswer({text:option,revealed:true})}>{option}{revealed&&option===question.correct&&<Check aria-label="Correct answer" size={18}/>}</button>)}</div>:<label className="revision-answer">Your answer<textarea maxLength={2000} rows={4} value={answer?.text??''} readOnly={mock&&!!progress.submittedAt&&!editingMock} onChange={e=>updateAnswer({text:e.target.value,revealed:false,selfScore:undefined})} placeholder="Explain your thinking. For calculations, show the working and units."/></label>}
     {mock&&progress.submittedAt&&<div className="revision-actions"><button aria-pressed={editingMock} onClick={()=>setEditingMock(!editingMock)}>{editingMock?"Done editing":"Edit this answer"}</button><p className="revision-small">You can improve your answer after reviewing. Editing clears its self-assessed mark.</p></div>}
     {!mock&&!revealed&&<div className="revision-actions"><button aria-expanded={hint} onClick={()=>setHint(!hint)}><Lightbulb size={18} aria-hidden="true"/>A hint</button><button className="revision-primary" onClick={()=>updateAnswer({revealed:true})}>Show answer guide</button></div>}
     {hint&&!mock&&<p className="revision-feedback">{question.hint}</p>}
     {revealed&&<div className="revision-feedback"><h3>{question.options?(answer?.text===question.correct?'That’s correct':'Let’s look at the answer'):'Answer guide'}</h3><ul>{question.points.map(point=><li key={point}>{point}</li>)}</ul>{!mock&&<button onClick={()=>updateAnswer({text:'',revealed:false,selfScore:undefined})}>Try this question again</button>}{!question.options&&<><p>Compare the science in your answer, not the exact words. This is self-assessment, not a teacher’s mark.</p><div className="revision-actions" role="group" aria-label="Self-assessed marks">{Array.from({length:question.marks+1},(_,mark)=><button key={mark} aria-pressed={answer?.selfScore===mark} onClick={()=>updateAnswer({selfScore:mark})}>{mark} / {question.marks}</button>)}</div></>}</div>}
   </section>}
   <div className="revision-pagination"><button disabled={index===0} onClick={()=>advance(-1)}><ArrowLeft size={18} aria-hidden="true"/>Previous</button><span>{index+1} / {length}</span><button disabled={index===length-1} onClick={()=>advance(1)}>Next<ArrowRight size={18} aria-hidden="true"/></button></div>
   <div className="revision-jump" role="group" aria-label={mode==='learn'?'Choose an idea':'Choose a question'}>{Array.from({length},(_,i)=><button key={i} aria-label={`${mode==='learn'?'Idea':'Question'} ${i+1}`} aria-pressed={i===index} onClick={()=>change({index:i})}>{i+1}</button>)}</div>
   {mock&&!progress.submittedAt&&<button className="revision-primary revision-submit" onClick={()=>{setHint(false);save({submittedAt:Date.now(),index:0});}}>Finish and review {mockAnswered<15?`(${15-mockAnswered} unanswered)`:''}</button>}
   {mode==='learn'&&index===length-1&&<button className="revision-primary revision-submit" onClick={()=>change({mode:'practice',index:0})}>Practise this unit<ArrowRight size={18} aria-hidden="true"/></button>}
   <p className="revision-small revision-save">Your place and typed answers are saved with your learner progress. Use a short revision block, take a break, then try explaining the idea without looking.</p>
   <section className="revision-print"><h1>Science Term 1: practice paper</h1><p>Units 1–3 · 30 marks · Original Vidya rehearsal, not an official paper.</p>{SCIENCE_MOCK_IDS.map((id,i)=>{const q=SCIENCE_QUESTIONS.find(item=>item.id===id)!;return <div key={id}><h2>{i+1}. {q.question} [{q.marks}]</h2><div className="revision-writing-space"/></div>;})}</section>
 </main>;
}
