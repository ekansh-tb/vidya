"use client";
import { useEffect,useState } from "react";
import { INSTALLATION_REMINDER_KEY,INSTALLATION_SESSION_KEY,shouldShowInstallationAlert } from "./installation-alert-model";
export function ParentInstallationAlert({onOpenControls}:{onOpenControls:()=>void}) {
 const [visible,setVisible]=useState(false),[ios,setIos]=useState(false);
 useEffect(()=>{
  const installed=window.matchMedia("(display-mode: standalone)").matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
  setIos(/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1));
  let dismissed:string|null=null,session=false;
  try{dismissed=localStorage.getItem(INSTALLATION_REMINDER_KEY);session=sessionStorage.getItem(INSTALLATION_SESSION_KEY)==="dismissed";}catch{/* Storage may be disabled; dismissal still works in this view. */}
  setVisible(shouldShowInstallationAlert(installed,session,dismissed,Date.now()));
  const complete=()=>setVisible(false);window.addEventListener("appinstalled",complete);return()=>window.removeEventListener("appinstalled",complete);
 },[]);
 if(!visible)return null;
 function dismiss(){setVisible(false);try{localStorage.setItem(INSTALLATION_REMINDER_KEY,String(Date.now()));sessionStorage.setItem(INSTALLATION_SESSION_KEY,"dismissed");}catch{/* No server measurement or identity is stored. */}}
 return <section className="parent-card" aria-labelledby="parent-installation-alert-title"><h2 id="parent-installation-alert-title">Keep Vidya close by</h2><p>{ios?"On iPhone or iPad, open Vidya in Safari and use Share → Add to Home Screen. Open the installed app for supported browser notifications.":"Add Vidya to your device for an easier return. Installation options depend on your browser; the guide explains where to find them."}</p><p>Installation is optional. You can keep exploring and manage notifications separately.</p><div className="parent-header-actions"><button className="parent-primary" type="button" onClick={()=>{onOpenControls();requestAnimationFrame(()=>document.getElementById("parent-installation-guide")?.scrollIntoView({block:"start",behavior:"auto"}));}}>View installation guide</button><button className="parent-secondary" type="button" onClick={dismiss}>Remind me later</button></div></section>;
}
