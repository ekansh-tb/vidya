'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,ClipboardList,History,Lightbulb,Pause,Shuffle,Sparkles} from 'lucide-react';
import type {GameState,LearnerProfile,ViewName} from '@/lib/types';
import {placementFor,placementLabel,samePlacement} from '@/lib/learning/placement';
import {subjectsForLearner,SUBJECT_MAP} from '@/lib/content/subjects';
import {hasPack,loadPack} from '@/lib/content/packs/pack-index';
import {starterFor,STARTER_REVIEW} from '@/lib/preparation/starters';
import {createPreparationAttempt,emptyPreparation,preparationObservation,readPreparation,savedPreparationSetsSchema,type PreparationAttempt,type PreparationQuestion} from '@/lib/preparation/contracts';
import {questionsForLearner} from '@/lib/content/questions/availability';
import {preparationQuestionSchema} from '@/lib/preparation/contracts';
import {preparationQuestionsForPack,preparationBankRevision,questionWithChoices,choiceFields,plainStudyText} from '@/lib/preparation/study-bank';
import {learningHaptic} from '@/lib/learning/sensory';
import {scienceCourseAvailable} from '@/lib/revision/availability';
import {MathsWorkbench} from './maths-workbench';
import './preparation.css';
type Bank={id:string;revision:number;title:string;subject:string;source:PreparationAttempt['source'];language:'en'|'hi';questions:PreparationQuestion[]};
export function PreparationStudio({learner,state,setState,onBack,onNavigate}:{learner:LearnerProfile;state:GameState;setState:(f:(s:GameState)=>GameState)=>void;onBack:()=>void;onNavigate:(v:ViewName,p?:Record<string,unknown>)=>void}){
 const {board,grade,placement:declaredPlacement,pickedSubjects}=learner;
 const placement=useMemo(()=>placementFor({board,grade,placement:declaredPlacement}),[board,grade,declaredPlacement]);
 const progress=readPreparation(state.preparation)??emptyPreparation();
 const [family,setFamily]=useState<Bank[]>([]),[loaded,setLoaded]=useState<Bank>(),[selection,select]=useState('starter'),[count,setCount]=useState(5),[loading,setLoading]=useState(false),[error,setError]=useState(''),[familyError,setFamilyError]=useState(''),[reload,setReload]=useState(0),[selectedTopics,setSelectedTopics]=useState<string[]>();
 const early=placement?.kind==='early-years';
 const starter=placement?starterFor(placement):undefined;
 const packIds=useMemo(()=>subjectsForLearner(board,pickedSubjects,grade).filter(s=>hasPack(s.id,grade)).map(s=>s.id),[board,pickedSubjects,grade]);
 const conventional=useMemo(()=>{
  const pools=questionsForLearner({board,grade});
  return subjectsForLearner(board,pickedSubjects,grade).flatMap(subject=>{
   const questions=Object.entries(pools[subject.id]??{}).flatMap(([topicId,topic])=>topic.items.map((q,i)=>preparationQuestionSchema.safeParse({id:`${topicId}-${i+1}`,topic:topic.title,prompt:plainStudyText(choiceFields(q.opts,q.a).choices?q.q:questionWithChoices(q.q,[...new Set(q.opts)])),guide:plainStudyText(`${q.a}. ${q.ex}`),hint:'',marks:2,...choiceFields(q.opts,q.a)}))).filter(p=>p.success).map(p=>p.data!);
   return questions.length?[{id:`bank:${subject.id}`,revision:preparationBankRevision(questions),title:subject.name,subject:subject.name,source:'study-pack' as const,language:subject.id==='hindi'?'hi' as const:'en' as const,questions}]:[];
  });
 },[board,grade,pickedSubjects]);
 const starterBank:Bank|undefined=starter?{...starter,revision:1,subject:'Maths',source:'starter',language:'en'}:undefined;
 const bank=selection==='starter'?starterBank:selection.startsWith('family:')?family.find(b=>`family:${b.id}`===selection):selection.startsWith('bank:')?conventional.find(b=>b.id===selection):loaded?.id===selection?loaded:undefined;
 const topics=[...new Set(bank?.questions.map(q=>q.topic)??[])];
 const eligibleQuestions=bank?.questions.filter(q=>selectedTopics===undefined||selectedTopics.includes(q.topic))??[];
 const active=progress.activeId?progress.attempts[progress.activeId]:undefined;
 const attempts=Object.values(progress.attempts).filter(a=>samePlacement(placement,a.placement)).sort((a,b)=>b.createdAt-a.createdAt||a.id.localeCompare(b.id));
 useEffect(()=>{
  if(!learner.remoteId)return;
  const controller=new AbortController();let generation=0;
  const load=async()=>{const current=++generation;if(document.hidden){setFamily([]);return;}try{
   const response=await fetch('/api/learner/preparation',{credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:learner.deviceToken?{'x-vidya-device':learner.deviceToken}:{}});
   const body=await response.json();if(!response.ok)throw Error(body.error??'Family sets could not be loaded.');
   const sets=savedPreparationSetsSchema.parse(body.sets);
   if(current!==generation||controller.signal.aborted||document.hidden)return;
   setFamily(sets.filter(s=>!s.set.archived&&samePlacement(placement,s.set.placement)).map(({set,revision})=>({id:set.id,revision,title:set.title,subject:set.subject,language:set.language,source:'family',questions:set.questions})));setFamilyError('');
  }catch(e){if(!controller.signal.aborted&&current===generation)setFamilyError(e instanceof Error?e.message:'Could not load family sets.');}};
  void load();document.addEventListener('visibilitychange',load);return()=>{controller.abort();generation++;document.removeEventListener('visibilitychange',load);};
 },[learner.remoteId,learner.deviceToken,placement,reload]);
 useEffect(()=>{
  let cancelled=false;setLoaded(undefined);setError('');setLoading(false);
  if(!selection.startsWith('pack:'))return;
  const id=packIds.find(id=>`pack:${id}`===selection);if(!id||!placement||placement.kind!=='school')return;
  setLoading(true);loadPack(id,placement.grade).then(pack=>{
   if(cancelled)return;if(!pack)throw Error('This study collection is unavailable.');
   const questions=preparationQuestionsForPack(pack),revision=preparationBankRevision(questions);
   setLoaded({id:selection,revision:revision||1,title:`${SUBJECT_MAP[id]?.name??id} · Grade ${placement.grade}`.slice(0,100),subject:SUBJECT_MAP[id]?.name??id,source:'study-pack',language:id.endsWith('hindi')?'hi':'en',questions});
  }).catch(()=>{if(!cancelled)setError('Could not open this collection. Try again or choose another.');}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true;};
 },[selection,packIds,placement,reload,learner.learningLanguage]);
 const update=(fn:(p:ReturnType<typeof emptyPreparation>)=>ReturnType<typeof emptyPreparation>)=>setState(s=>({...s,preparation:fn(readPreparation(s.preparation)??emptyPreparation())}));
 const open=(id?:string)=>{setError('');update(p=>({...p,activeId:id,updatedAt:Date.now()}));};
 const start=(mode:'practice'|'mock'|'play')=>{
  if(!bank||!placement||!eligibleQuestions.length)return;
  if(Object.keys(progress.attempts).length>=20){setError('You have 20 saved sessions. Revisit a saved paper below; none of your work has been removed.');return;}
  const now=Date.now();const attempt=createPreparationAttempt({id:crypto.randomUUID(),setId:bank.id,revision:bank.revision,title:bank.title,subject:bank.subject,source:bank.source,language:bank.language,placement,mode,questions:eligibleQuestions,createdAt:now,updatedAt:now},attempts,count);
  const next={...progress,activeId:attempt.id,updatedAt:now,attempts:{...progress.attempts,[attempt.id]:attempt}};
  // Keep room for answers under the shared sync quota; never delete old work to make space.
  if(new TextEncoder().encode(JSON.stringify({...state,preparation:next})).length+attempt.questions.length*6000>850000){setError('Saved work is close to the sync storage limit. Continue a saved session; this new session has not replaced anything.');return;}
  update(p=>({...p,activeId:attempt.id,updatedAt:now,attempts:{...p.attempts,[attempt.id]:attempt}}));learningHaptic();
 };
 const changeAttempt=(fn:(a:PreparationAttempt)=>PreparationAttempt)=>{if(!active)return;update(p=>{const current=p.attempts[active.id];return current?{...p,updatedAt:Date.now(),attempts:{...p.attempts,[active.id]:fn(current)}}:p;});};
 if(active&&samePlacement(placement,active.placement))return <PreparationPlayer key={active.id} attempt={active} change={changeAttempt} onClose={()=>open()} calm={state.settings.motion===false}/>;
 return <main className="prep-studio" data-calm={state.settings.motion===false}>
  <header className="prep-toolbar"><button onClick={onBack}><ArrowLeft size={18} aria-hidden="true"/>Back</button><span>{placementLabel(learner)}</span></header>
  <section className="prep-welcome"><div><h1>{early?'Little things, big discoveries.':'A little practice. A fresh perspective.'}</h1><p>{early?'Play, talk and explore with a grown-up. No timer. No exam.':'Choose your collection, make a short practice session, or rehearse a paper. Your pace, your next step.'}</p></div><PracticeArtwork/></section>
  {scienceCourseAvailable(learner.board,learner.grade)&&<button className="prep-science-link" onClick={()=>onNavigate('exam-prep',{subjectId:'cls-science'})}><span><strong>Science Term 1</strong><small>Your saved revision, practice and 30-mark papers</small></span><ArrowRight aria-hidden="true"/></button>}
  {!placement?<section className="prep-panel"><h2>Choose your learning level first</h2><p>Ask your grown-up to confirm your placement in Children.</p></section>:<section className="prep-panel" aria-labelledby="prep-choose"><h2 id="prep-choose">{early?'Choose something to explore':'Make it your session'}</h2>
   <label>Collection<select value={selection} onChange={e=>{select(e.target.value);setSelectedTopics(undefined);}}>{starter&&<option value="starter">Maths exploration · {starter.questions.length} questions</option>}{!starter&&<option value="starter">Choose a family collection below</option>}{family.map(b=><option key={b.id} value={`family:${b.id}`}>{b.title} · family-created</option>)}{conventional.map(b=><option key={b.id} value={b.id}>{b.title} · grade question bank</option>)}{packIds.map(id=><option key={id} value={`pack:${id}`}>{SUBJECT_MAP[id]?.name??id} · study collection</option>)}</select></label>
   {loading&&<p role="status">Opening your collection…</p>}{error&&<p role="alert">{error}<button onClick={()=>setReload(n=>n+1)}>Try loading again</button></p>}
   {bank&&<><div className="prep-bank-note"><BookOpen size={20} aria-hidden="true"/><p>{bank.source==='family'?'Questions and answer guides supplied by your family. They have not been independently checked by Vidya.':bank.source==='starter'?'Original Maths exploration, not your school syllabus or a full exam bank. English content.':'Original Vidya study questions for this exact grade. Check your teacher’s scope; this is not an official exam paper.'} {bank.questions.length} available {bank.questions.length===1?'question':'questions'}. New selections can repeat questions.</p></div>{topics.length>1&&<details className="prep-topic-picker"><summary>Choose topics ({topics.filter(t=>selectedTopics===undefined||selectedTopics.includes(t)).length}/{topics.length})</summary><button onClick={()=>setSelectedTopics(undefined)}>Use all topics</button><div>{topics.map(topic=><label key={topic}><input type="checkbox" checked={selectedTopics===undefined||selectedTopics.includes(topic)} onChange={e=>setSelectedTopics(current=>e.target.checked?[...(current??topics),topic]:(current??topics).filter(t=>t!==topic))}/>{topic}</label>)}</div></details>}{!eligibleQuestions.length&&<p role="status">Choose at least one topic to start a session.</p>}<label>Questions this time<select value={Math.min(count,eligibleQuestions.length)} onChange={e=>setCount(Number(e.target.value))}>{[...new Set([3,5,10,20].map(n=>Math.min(n,eligibleQuestions.length)))].map(n=><option key={n} value={n}>{n}</option>)}</select></label><div className="prep-start-actions"><button className="prep-primary" disabled={!eligibleQuestions.length||loading} onClick={()=>start(early?'play':'practice')}><Lightbulb size={20} aria-hidden="true"/>{early?'Explore together':'Quick practice'}<small>Hints and feedback as you go</small></button>{!early&&<button disabled={!eligibleQuestions.length||loading} onClick={()=>start('mock')}><ClipboardList size={20} aria-hidden="true"/>Make a mock paper<small>Review your answers when you finish</small></button>}</div></>}
   {!bank&&!loading&&<p>{early?'Your grown-up can add short talking, counting or observation prompts here. Choose Play for the reviewed preschool activities.':'Ask a grown-up to add school questions in Children → Preparation sets, or choose a study collection.'}</p>}
   {early&&<button onClick={()=>onNavigate('activities')}>Open playful activities<ArrowRight size={18} aria-hidden="true"/></button>}
   {learner.remoteId?<p className="prep-small">Family sets come from your linked family space. <button onClick={()=>setReload(n=>n+1)}>Refresh family sets</button>{familyError&&<span role="status"> {familyError} Saved sessions below still work.</span>}</p>:<p className="prep-small">Link this learner to receive private family sets and sync saved work across devices.</p>}
  </section>}
  <section className="prep-history" aria-labelledby="prep-saved"><h2 id="prep-saved"><History size={22} aria-hidden="true"/> Your saved sessions</h2>{attempts.length?<div className="prep-saved-grid">{attempts.map(a=>{const summary=preparationObservation(a);return <button key={a.id} onClick={()=>open(a.id)}><span className="prep-session-icon">{a.submittedAt?<Check aria-hidden="true"/>:<Pause aria-hidden="true"/>}</span><span><strong>{a.title}</strong><small>{a.mode==='mock'?'Mock paper':a.mode==='play'?'Explore together':'Practice'} · {new Date(a.createdAt).toLocaleDateString()} · {summary.answered}/{summary.total} saved answers</small><small>{a.submittedAt?'Finished, ready to review':`Continue at question ${a.index+1}`}</small></span><ArrowRight size={18} aria-hidden="true"/></button>;})}</div>:<p>Your first session will appear here. Leaving or taking a break loses nothing.</p>}</section>
  <details className="prep-small"><summary>About the starter collection</summary><p>{STARTER_REVIEW.limitations} {STARTER_REVIEW.rights}</p></details>
 </main>;
}
function PreparationPlayer({attempt,change,onClose,calm}:{attempt:PreparationAttempt;change:(f:(a:PreparationAttempt)=>PreparationAttempt)=>void;onClose:()=>void;calm:boolean}){
 const [hint,setHint]=useState(false),[editing,setEditing]=useState(false);
 const questionHeading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{questionHeading.current?.focus();},[attempt.index]);
 const question=attempt.questions[attempt.index],answer=attempt.answers[question.id],summary=preparationObservation(attempt);
 const mock=attempt.mode==='mock',early=attempt.mode==='play',revealed=mock?!!attempt.submittedAt:!!answer?.revealed;
 const respond=(patch:Partial<PreparationAttempt['answers'][string]>)=>change(a=>({...a,updatedAt:Date.now(),answers:{...a.answers,[question.id]:{...(a.answers[question.id]??{text:'',revealed:false}),...patch,updatedAt:Date.now()}}}));
 const move=(index:number)=>{setHint(false);setEditing(false);change(a=>({...a,index,updatedAt:Date.now()}));learningHaptic();};
 return <main className="prep-studio prep-player" data-calm={calm}><header className="prep-toolbar"><button onClick={onClose}><Pause size={18} aria-hidden="true"/>Save and leave</button><span>{early?'Explore together':mock?'Mock paper':'Quick practice'}</span></header><h1>{attempt.title}</h1><p className="prep-small">{attempt.source==='family'?'Family-created material':attempt.source==='starter'?'General exploration, not school-syllabus coverage':'Original Vidya study collection'} · {attempt.source==='study-pack'?'Collection language varies':attempt.language==='hi'?'Hindi':'English'}</p><label className="prep-progress">Question {attempt.index+1} of {attempt.questions.length}<progress value={attempt.index+1} max={attempt.questions.length}/></label>
  {attempt.submittedAt&&<div className="prep-complete" role="status"><Sparkles size={22} aria-hidden="true"/><div><strong>Ready to look back.</strong><p>Saved answers: {summary.answered}. {summary.marked>0?`${summary.marks} self-assessed marks across ${summary.possibleMarked} possible in marked questions.`:'You can review the guide at your own pace.'} Oral answers and work on paper may not appear here.</p></div></div>}
  <section className="prep-question" key={question.id}><p className="prep-topic">{question.topic}{!early&&` · ${question.marks} suggested marks`}</p><h2 ref={questionHeading} tabIndex={-1}>{question.prompt}</h2>
   {!early&&question.choices?<div className="prep-choices" role="group" aria-label="Answer choices">{question.choices.map(choice=><button key={choice} disabled={mock?!!attempt.submittedAt&&!editing:revealed} aria-pressed={answer?.text===choice} onClick={()=>respond({text:choice,revealed:!mock,selfScore:undefined})}><span>{choice}</span>{revealed&&choice===question.correctChoice&&<Check size={20} aria-label="Correct choice"/>}</button>)}</div>:!early&&<label>Your thinking<textarea maxLength={1000} rows={4} value={answer?.text??''} readOnly={mock&&!!attempt.submittedAt&&!editing} placeholder="Try it in your own words, or work on paper." onChange={e=>respond({text:e.target.value,revealed:false,selfScore:undefined})}/></label>}
   {early&&<p>Talk, point, draw or use real objects with your grown-up. You do not need to type.</p>}
   {mock&&attempt.submittedAt&&<button aria-pressed={editing} onClick={()=>setEditing(!editing)}>{editing?'Done editing':'Improve this answer'}</button>}
   {!mock&&!revealed&&<div className="prep-inline-actions">{question.hint&&<button aria-expanded={hint} onClick={()=>setHint(!hint)}><Lightbulb size={18} aria-hidden="true"/>A hint</button>}<button className="prep-primary" onClick={()=>respond({revealed:true})}>{early?'Grown-up guidance':'Compare with the guide'}</button></div>}
   {hint&&!revealed&&<p className="prep-hint" role="status">{question.hint}</p>}
   {revealed&&<div className="prep-guide"><h3>{early?'Try it together':question.choices?(answer?.text===question.correctChoice?'That’s it. Here’s why.':'Let’s look at the idea.'):'An explanation to compare'}</h3>{question.correctChoice&&<p><strong>Correct choice:</strong> {question.correctChoice}</p>}<p>{question.guide}</p>{!early&&<><p className="prep-small">Compare the ideas, not exact wording. These are editable self-assessed marks, not a teacher’s assessment.</p><div className="prep-inline-actions" role="group" aria-label="Self-assessed marks">{Array.from({length:question.marks+1},(_,n)=><button key={n} aria-pressed={answer?.selfScore===n} onClick={()=>respond({selfScore:n})}>{n} / {question.marks}</button>)}</div></>}{!mock&&<button onClick={()=>respond({text:'',revealed:false,selfScore:undefined})}><Shuffle size={16} aria-hidden="true"/>Try this idea again</button>}</div>}
   {revealed&&attempt.source==='starter'&&attempt.placement.kind==='school'&&<MathsWorkbench grade={attempt.placement.grade}/>}
  </section><nav className="prep-pagination" aria-label="Questions"><button disabled={attempt.index===0} onClick={()=>move(attempt.index-1)}><ArrowLeft size={18} aria-hidden="true"/>Previous</button><span>{attempt.index+1} / {attempt.questions.length}</span><button disabled={attempt.index===attempt.questions.length-1} onClick={()=>move(attempt.index+1)}>Next<ArrowRight size={18} aria-hidden="true"/></button></nav>
  <details className="prep-question-map"><summary>Choose a question</summary><div>{attempt.questions.map((q,i)=><button key={q.id} aria-label={`Question ${i+1}`} aria-pressed={attempt.index===i} onClick={()=>move(i)}>{i+1}{attempt.answers[q.id]?.text.trim()&&<Check size={12} aria-hidden="true"/>}</button>)}</div></details>
  {!attempt.submittedAt&&<button className="prep-primary prep-finish" onClick={()=>{setHint(false);setEditing(false);change(a=>({...a,index:0,submittedAt:Date.now(),updatedAt:Date.now()}));}}>{early?'Finish this little visit':'Finish and review'}{!early&&` · ${summary.answered}/${summary.total} saved answers`}</button>}
  <p className="prep-small">Pause whenever you need. {early?'Follow with real-world play.':'After a break, explain one idea without the guide.'} Your typed answers stay in your learning space. Grown-ups can see session counts and self-assessed marks.</p>
 </main>;
}
function PracticeArtwork(){return <svg className="prep-artwork" viewBox="0 0 260 210" role="img" aria-label="A notebook with a number line, blocks and a pencil"><rect x="36" y="20" width="174" height="165" rx="12" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2"/><path d="M57 58H185M57 89H185M57 120H185M57 151H185" stroke="var(--border)" strokeWidth="2"/><path d="M68 120H180M76 114V126M108 114V126M140 114V126M172 114V126" stroke="var(--accent)" strokeWidth="3"/><circle cx="140" cy="120" r="7" fill="var(--accent)"/><rect x="70" y="66" width="20" height="20" rx="4" fill="var(--accent)"/><rect x="97" y="66" width="20" height="20" rx="4" fill="var(--accent-2)"/><rect x="124" y="66" width="20" height="20" rx="4" fill="var(--accent)"/><path d="M188 153L227 69L239 75L200 159L187 166Z" fill="var(--accent-2)"/><path d="M187 166L190 153L200 159Z" fill="var(--text)"/></svg>;}
