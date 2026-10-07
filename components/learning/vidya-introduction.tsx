"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import { ArrowRight, Play } from "lucide-react";

/** Optional motion graphic. The learning journey never waits for playback. */
export function VidyaIntroduction({ language = "en", presentation = "compact" }: { language?: "en" | "hi"; presentation?: "visual" | "compact" }) {
  const hi = language === "hi";
  const reduced = useReducedMotion();
  const motion = useGameStore(state => state.state.settings.motion);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const canPlay = reduced === false && motion !== false && !failed;
  const visual = <div className="vidya-intro-visual">
    {playing && canPlay ? <video key="welcome" controls autoPlay muted playsInline preload="none" poster="/learning/vidya-welcome.svg" onError={event=>{if(event.target === event.currentTarget){setFailed(true);setPlaying(false);}}} aria-label={hi ? "सवाल से खोज और रचना तक, छह सेकंड का चित्र" : "From a question to discovery and creation, a six-second motion graphic"}><source src="/learning/vidya-welcome.webm" type="video/webm"/><source src="/learning/vidya-welcome.mp4" type="video/mp4" onError={()=>{setFailed(true);setPlaying(false);}}/></video> : <Image unoptimized src="/learning/vidya-welcome.svg" width="720" height="360" alt={hi ? "एक सवाल से किताब, खोज और रचना का रास्ता खुलता है।" : "A question opens a path through reading, exploration and creation."}/>}
    {!playing && canPlay && <button className="vidya-intro-play" onClick={()=>setPlaying(true)}><Play size={16} aria-hidden="true"/>{hi ? "चित्र चलाओ · 6 सेकंड" : "Play the idea · 6 seconds"}</button>}
    {failed && <p role="status" className="learning-caption">{hi ? "चित्र उपलब्ध है। वीडियो अभी नहीं खुल सका।" : "The illustration is here. The video could not load."}</p>}
  </div>;
  if (presentation === "visual") return visual;
  return <details className="vidya-about"><summary>{hi ? "विद्या क्या है?" : "What is Vidya?"}</summary><div className="vidya-about-content"><div><h2>{hi ? "अपनी जिज्ञासा को जगह दो" : "A space for your curiosity"}</h2><p>{hi ? "किताबें, कहानियाँ, प्रैक्टिस और रचना। अपने स्तर पर सीखो और असली दुनिया में खोज जारी रखो।" : "Books, stories, practice and creation. Learn at your level, then take your discoveries into the world around you."}</p><Link href="/mission">{hi ? "हमारा उद्देश्य" : "Read our mission"}<ArrowRight size={17} aria-hidden="true"/></Link></div>{visual}</div></details>;
}
