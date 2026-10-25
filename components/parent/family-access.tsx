'use client';
import {useCallback,useEffect,useId,useRef,useState} from 'react';
import {useReverification} from '@clerk/nextjs';
import {Users,Copy,UserRoundPlus} from 'lucide-react';
import {guardianAccessSchema,type GuardianAccess} from '@/lib/family/contract';

type Action={action:'invite';learnerId:string;email:string}|{action:'accept';code:string;confirmAccess:true}|{action:'remove';learnerId:string;parentId:string}|{action:'cancel';id:string};
function useFamilyMutation(){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const running=useRef(false);
 const request=useReverification(async (action:Action)=>{
  const response=await fetch('/api/parent/family',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(action)});
  return response.json();
 });
 const mutate=async(action:Action)=>{
  if(running.current)return null;
  running.current=true;setBusy(true);setMessage('');
  try{const result=await request(action);if(result?.error)throw Error(result.error);return result;}
  catch(error){setMessage(error instanceof Error?error.message:'Could not update family access. Please try again.');return null;}
  finally{running.current=false;setBusy(false);}
 };
 return {mutate,busy,message,setMessage};
}
export function JoinFamily({onJoined}:{onJoined:()=>void}){
 const id=useId(),[code,setCode]=useState(''),[confirmed,setConfirmed]=useState(false);
 const {mutate,busy,message,setMessage}=useFamilyMutation();
 return <details className="parent-card family-access"><summary><Users size={20} aria-hidden="true"/>Joining your child’s existing family space?</summary><p>Use the invitation code from their other parent. Sign in with the verified email they invited. Your child keeps one profile and one set of progress.</p><form onSubmit={async e=>{e.preventDefault();const result=await mutate({action:'accept',code:code.trim(),confirmAccess:true});if(result?.learnerId){setCode('');setConfirmed(false);setMessage('You’re connected. The shared learner is now in your family space.');onJoined();}}}>
  <label htmlFor={id}>Family invitation code</label><input id={id} autoComplete="off" autoCapitalize="none" spellCheck={false} required minLength={43} maxLength={43} value={code} onChange={e=>setCode(e.target.value)} disabled={busy}/>
  <label className="parent-check"><input type="checkbox" required checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} disabled={busy}/><span>I am this child’s parent or guardian and accept shared learning, device and safety controls.</span></label>
  <button className="parent-primary" disabled={busy||!confirmed||code.trim().length!==43}>{busy?'Connecting…':'Join the family space'}<UserRoundPlus size={18} aria-hidden="true"/></button>
 </form>{message&&<p role="status">{message}</p>}</details>;
}
export function FamilyAccess({learnerId,learnerName,accountId,refreshToken,onChanged}:{learnerId:string;learnerName:string;accountId:string;refreshToken:number;onChanged:()=>void}){
 const id=useId(),[access,setAccess]=useState<GuardianAccess|null>(null),[email,setEmail]=useState(''),[code,setCode]=useState(''),[confirmRemove,setConfirmRemove]=useState<string|null>(null),[error,setError]=useState('');
 const {mutate,busy,message,setMessage}=useFamilyMutation();
 const load=useCallback(async(signal?:AbortSignal)=>{
  try{const response=await fetch(`/api/parent/family?learnerId=${encodeURIComponent(learnerId)}`,{cache:'no-store',signal});const raw=await response.json();if(signal?.aborted)return;const parsed=response.ok?guardianAccessSchema.safeParse(raw):null;if(!parsed?.success)throw Error('Family access could not be loaded. Refresh and try again.');setAccess(parsed.data);setError('');}
  catch(error){if(!signal?.aborted){setAccess(null);setError(error instanceof Error?error.message:'Could not load family access.');}}
 },[learnerId]);
 useEffect(()=>{const controller=new AbortController();void load(controller.signal);return()=>controller.abort();},[load,refreshToken]);
 const apply=async(action:Action)=>{const result=await mutate(action);if(result){setConfirmRemove(null);setCode(result.code??'');await load();onChanged();}return result;};
 return <section className="parent-card family-access" aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}><Users size={22} aria-hidden="true"/>Together for {learnerName}</h2><p>Both parents use their own login to the same learner. Learning, devices and safety controls are shared. Private reflections and AI conversations stay out of routine reports.</p>
  {error?<><p role="alert">{error}</p><button onClick={()=>void load()}>Try again</button></>:!access?<p role="status">Checking family access…</p>:<>
   <p className="parent-small">{access.owner?'You created this learner. You manage adult invitations and can remove the co-parent’s access.':'You’re a co-parent on this shared profile. The original parent manages adult invitations. You can leave at any time.'}</p>
   {access.members.map(member=><div className="family-member" key={member.parentId}><div><strong>{member.name}</strong><p className="parent-small">Connected co-parent</p></div>{(access.owner||member.parentId===accountId)&&<button disabled={busy} onClick={()=>setConfirmRemove(member.parentId)}>{access.owner?'Remove access':'Leave shared profile'}</button>}</div>)}
   {confirmRemove&&<div className="family-access-confirm" role="group" aria-label="Confirm removal"><p>This removes co-parent access and disconnects devices connected with their device codes. The learner and saved progress stay.</p><div className="parent-actions"><button disabled={busy} onClick={()=>void apply({action:'remove',learnerId,parentId:confirmRemove})}>Confirm {access.owner?'removal':'leave'}</button><button disabled={busy} onClick={()=>setConfirmRemove(null)}>Cancel</button></div></div>}
   {access.owner&&access.members.length===0&&<form onSubmit={async e=>{e.preventDefault();await apply({action:'invite',learnerId,email:email.trim()});}}><label htmlFor={id}>Other parent’s email</label><input id={id} type="email" required maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/><button className="parent-primary" disabled={busy}>{busy?'Creating…':access.invitations.length?'Replace invitation':'Invite a second parent'}</button></form>}
   {code&&<div className="family-invitation-code"><label htmlFor={`${id}-code`}>Share this code privately with the invited parent</label><textarea id={`${id}-code`} readOnly value={code} rows={2}/><button onClick={async()=>{try{await navigator.clipboard.writeText(code);setMessage('Invitation code copied.');}catch{setMessage('Select the code above and copy it.');}}}><Copy size={16} aria-hidden="true"/>Copy invitation code</button><p className="parent-small">Expires after 48 hours. Only the invited verified email can accept it under Children → Join family. No email is sent automatically.</p></div>}
   {access.invitations.map(invite=><div className="family-member" key={invite.id}><div><strong>{invite.email}</strong><p className="parent-small">Waiting for acceptance · expires {new Date(invite.expiresAt).toLocaleString()}</p></div><button disabled={busy} onClick={()=>void apply({action:'cancel',id:invite.id})}>Cancel invitation</button></div>)}
  </>}{message&&<p role="status">{message}</p>}
 </section>;
}
