"use client";
import { useGameStore } from "@/lib/game-store";
import { setSfxEnabled, initAudio } from "@/lib/audio";
export function SensoryControls() {
  const {state,set,learner}=useGameStore(); const hi=learner.learningLanguage==="hi";
  const toggle=(key:"sound"|"music"|"motion"|"haptics")=>{
    const value=key==="motion" ? state.settings.motion!==false : !!state.settings[key];
    if(key==="sound") setSfxEnabled(!value);
    if((key==="music"||key==="sound")&&!value) void initAudio().catch(()=>{});
    set(s=>({...s,settings:{...s.settings,[key]:!value}}));
  };
  return <details className="learning-sensory"><summary>{hi ? "आवाज़ और गतिविधि" : "Sound & movement"}</summary><div>{(["sound","music","motion","haptics"] as const).map(key=><button key={key} role="switch" aria-checked={key==="motion" ? state.settings.motion!==false : !!state.settings[key]} onClick={()=>toggle(key)}>{(hi ? {sound:"खेल की आवाज़",music:"संगीत",motion:"एनिमेशन",haptics:"हल्का कंपन"} : {sound:"Sound effects",music:"Music",motion:"Animations",haptics:"Gentle vibration"})[key]} · {(key==="motion" ? state.settings.motion!==false : !!state.settings[key]) ? (hi ? "चालू" : "On") : (hi ? "बंद" : "Off")}</button>)}</div><p>{hi ? "डिवाइस की कम गति वाली सेटिंग का सम्मान होता है। कंपन केवल समर्थित डिवाइस पर।" : "Reduced motion follows your device setting. Vibration works on supported devices."}</p></details>;
}
