"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Mesh, WebGLRenderer } from "three";
import { useGameStore } from "@/lib/game-store";
import { sfx } from "@/lib/audio";
import { learningHaptic } from "@/lib/learning/sensory";

/** Original mesh asset. Draw on demand, with SVG fallback on unsupported devices. */
export function TaraScene({ children }: {children:React.ReactNode}) {
  const host=useRef<HTMLDivElement>(null);
  const animate=useRef<(reaction?:"hello"|"peek")=>void>(()=>{});
  const [ready,readySet]=useState(false);
  const settings=useGameStore(s=>s.state.settings);
  const reduced=useReducedMotion();
  const calm=reduced || settings.motion===false;
  useEffect(()=>{
    readySet(false);
    let cancelled=false; let cleanup=()=>{};
    void (async()=>{
      let renderer:WebGLRenderer|undefined;
      try {
        const [THREE,{gsap}]=await Promise.all([import("three"),import("gsap")]);
        if(cancelled || !host.current) return;
        const scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(36,1,0.1,20);camera.position.set(0,0.55,5.4);camera.lookAt(0,0.4,0);
        renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
        scene.add(new THREE.HemisphereLight(0xffffff,0x48756c,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,4,4);scene.add(light);
        const response=await fetch("/learning/tara-model-v2.json");if(!response.ok) throw new Error("Asset unavailable");
        const model=new THREE.ObjectLoader().parse(await response.json());
        if(cancelled){renderer.dispose();return;}
        model.rotation.y=-0.16;scene.add(model);
        const canvas=renderer.domElement;canvas.setAttribute("aria-hidden","true");
        const lost=()=>{stop();readySet(false);};canvas.addEventListener("webglcontextlost",lost);host.current!.append(canvas);
        const draw=()=>renderer!.render(scene,camera);
        const resize=()=>{const width=host.current?.clientWidth??180;renderer!.setSize(width,width,false);draw();};
        const observer=new ResizeObserver(resize);observer.observe(host.current!);resize();readySet(true);
        let reaction:{kill:()=>void}|null=null;
        const stop=()=>{reaction?.kill();reaction=null;model.rotation.y=-0.16;model.position.y=0;model.scale.setScalar(1);if(!renderer!.getContext().isContextLost())draw();};
        animate.current=(kind="hello")=>{
          stop();if(calm || document.hidden || renderer!.getContext().isContextLost())return;
          const timeline=gsap.timeline({onUpdate:draw,onComplete:()=>{reaction=null;}});reaction=timeline;
          if(kind==="peek") {
            timeline.to(model.rotation,{y:-0.04,duration:0.14,ease:"power2.out"}).to(model.rotation,{y:-0.16,duration:0.18,ease:"power2.out"});
          } else {
            timeline.to(model.position,{y:-0.025,duration:0.09,ease:"power2.in"}).to(model.position,{y:0.14,duration:0.22,ease:"power2.out"}).to(model.position,{y:0,duration:0.28,ease:"power2.inOut"});
            timeline.to(model.rotation,{y:0.02,duration:0.22,ease:"sine.out"},0.09).to(model.rotation,{y:-0.16,duration:0.28,ease:"sine.inOut"},0.31);
          }
        };
        document.addEventListener("visibilitychange",stop);
        cleanup=()=>{animate.current=()=>{};reaction?.kill();observer.disconnect();document.removeEventListener("visibilitychange",stop);scene.traverse(o=>{const mesh=o as Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material){for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material])m.dispose();}});canvas.removeEventListener("webglcontextlost",lost);renderer!.dispose();canvas.remove();};
      } catch { renderer?.dispose(); /* Authored SVG remains visible. */ }
    })();
    return ()=>{cancelled=true;cleanup();};
  },[calm]);
  return <div className={`tara-scene ${ready ? "tara-scene-ready" : ""}`}><div ref={host} className="tara-model"/>{children}<button className="tara-hello" onPointerEnter={event=>{if(event.pointerType==="mouse")animate.current("peek");}} onFocus={()=>animate.current("peek")} onClick={()=>{animate.current("hello");sfx.correct();learningHaptic();}}>{settings.motion===false ? "✦ Tara" : "✦"}<span className="sr-only">{useGameStore.getState().learner.learningLanguage==="hi" ? "तारा को नमस्ते कहो" : "Say hello to Tara"}</span></button></div>;
}
