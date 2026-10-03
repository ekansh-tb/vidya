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
  const animate=useRef<()=>void>(()=>{});
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
        const THREE=await import("three");
        if(cancelled || !host.current) return;
        const scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(36,1,0.1,20);camera.position.set(0,0.45,4.9);camera.lookAt(0,0.2,0);
        renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
        scene.add(new THREE.HemisphereLight(0xffffff,0x48756c,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,4,4);scene.add(light);
        const response=await fetch("/learning/tara-model.json");if(!response.ok) throw new Error("Asset unavailable");
        const model=new THREE.ObjectLoader().parse(await response.json());
        if(cancelled){renderer.dispose();return;}
        model.rotation.y=-0.16;scene.add(model);
        const canvas=renderer.domElement;canvas.setAttribute("aria-hidden","true");host.current!.append(canvas);
        const draw=()=>renderer!.render(scene,camera);
        const resize=()=>{const width=host.current?.clientWidth??180;renderer!.setSize(width,width,false);draw();};
        const observer=new ResizeObserver(resize);observer.observe(host.current!);resize();readySet(true);
        let frame=0;
        const stop=()=>{cancelAnimationFrame(frame);model.rotation.y=-0.16;model.position.y=0;draw();};
        animate.current=()=>{stop();if(calm)return;const start=performance.now();const tick=(now:number)=>{if(document.hidden){stop();return;}const t=Math.min(1,(now-start)/700);model.rotation.y=-0.16+Math.sin(t*Math.PI*2)*0.15;model.position.y=Math.sin(t*Math.PI)*0.12;draw();if(t<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);};
        document.addEventListener("visibilitychange",stop);
        cleanup=()=>{animate.current=()=>{};cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener("visibilitychange",stop);scene.traverse(o=>{const mesh=o as Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material){for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material])m.dispose();}});renderer!.dispose();canvas.remove();};
      } catch { renderer?.dispose(); /* Authored SVG remains visible. */ }
    })();
    return ()=>{cancelled=true;cleanup();};
  },[calm]);
  return <div className={`tara-scene ${ready ? "tara-scene-ready" : ""}`}><div ref={host} className="tara-model"/>{children}<button className="tara-hello" onClick={()=>{animate.current();sfx.correct();learningHaptic();}}>{settings.motion===false ? "✦ Tara" : "✦"}<span className="sr-only">{useGameStore.getState().learner.learningLanguage==="hi" ? "तारा को नमस्ते कहो" : "Say hello to Tara"}</span></button></div>;
}
