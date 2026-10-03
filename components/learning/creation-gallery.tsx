"use client";
import type { LearningActivity, LearningActivityState, LearningLanguage } from "@/lib/learning/activity";

export function CreationGallery({ state, activities, language }: { state: LearningActivityState; activities: LearningActivity[]; language: LearningLanguage }) {
  const hi = language === "hi";
  const pictures = state.completions.filter(c => c.creation && c.source === "app" && state.creations?.[c.key]?.some(Boolean) && activities.some(a => a.id === c.activityId)).slice(-8).reverse();
  if (!pictures.length) return null;
  return <section className="learning-panel">
    <h2>{hi ? "तुम्हारे सहेजे हुए चित्र" : "Your saved pictures"}</h2>
    <p>{hi ? "हाल के आठ चित्र यहाँ देख सकते हो। हर गतिविधि के हर दिन का आख़िरी सहेजा हुआ चित्र रखा जाता है।" : "Revisit your eight most recent pictures. We keep the latest saved picture for each activity and day."}</p>
    <div className="learning-gallery">{pictures.map(c => {
      const activity = activities.find(a => a.id === c.activityId)!;
      return <details key={c.key}><summary>{activity.title[language]} · {c.day}</summary><div className="learning-saved-canvas" style={{gridTemplateColumns:`repeat(${Math.sqrt(state.creations![c.key].length)},1fr)`}} role="img" aria-label={`${activity.title[language]}, ${c.day}, ${hi ? "सहेजा हुआ रंगों का चित्र" : "saved colour picture"}`}>{state.creations![c.key].map((colour,i) => <span key={i} style={{background:colour || "#f5f4ed"}}/>)}</div></details>;
    })}</div>
  </section>;
}
