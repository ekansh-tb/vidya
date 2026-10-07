"use client";
import { useEffect, useState } from "react";
import type { LearnerProfile } from "@/lib/types";
import type { LearningActivity, LearningLanguage } from "./activity";
import { placementKey } from "./activity";
import { placementFor } from "./placement";
import { hubActivities } from "./hub-selection";
import { PUBLISHED_SCHOOL_GRADES } from "./release";
import { parsePublicActivities, readPublicActivities, writePublicActivities } from "./published-content-cache";
/** Static authored content is the offline/unavailable-service fallback. A valid empty publication stays empty. */
export function usePublishedActivities(learner: Pick<LearnerProfile, "board" | "grade" | "placement">, language: LearningLanguage, saved?: { activityId: string; revision: number }) {
  const placement = placementFor(learner);
  const key = placement ? placementKey(placement) : "";
  const released = !!placement && (placement.kind === "early-years" || PUBLISHED_SCHOOL_GRADES.includes(placement.grade));
  const queryKey = `${key}:${language}`;
  const [remote, setRemote] = useState<{ key: string; activities: LearningActivity[] } | null>(null);
  const [historical, setHistorical] = useState<{ key: string; activity: LearningActivity } | null>(null);
  const savedKey = `${queryKey}:${saved?.activityId ?? ""}@${saved?.revision ?? ""}`;
  useEffect(() => {
    if (!released) return;
    const cached = readPublicActivities(queryKey, key);
    if (cached) setRemote({ key: queryKey, activities: cached });
    const controller = new AbortController();
    fetch(`/api/content/activities?placement=${encodeURIComponent(key)}&language=${language}`, { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) return; const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("activities" in data) || !Array.isArray(data.activities)) return;
      const activities = parsePublicActivities(data.activities, key);
      if (!activities || controller.signal.aborted) return;
      writePublicActivities(queryKey, activities);
      setRemote({ key: queryKey, activities });
    }).catch(() => {});
    return () => controller.abort();
  }, [released, key, language, queryKey]);
  useEffect(() => {
    if (!released || !saved?.activityId || !saved.revision) return;
    const cached = readPublicActivities(savedKey, key)?.[0];
    if (cached?.id === saved.activityId && cached.revision === saved.revision) setHistorical({ key: savedKey, activity: cached });
    const controller = new AbortController();
    fetch(`/api/content/activities?placement=${encodeURIComponent(key)}&language=${language}&id=${encodeURIComponent(saved.activityId)}&revision=${saved.revision}`, { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) return; const data = await response.json(); const activity = parsePublicActivities(data.activities, key)?.[0];
      if (activity?.id === saved.activityId && activity.revision === saved.revision && !controller.signal.aborted) { writePublicActivities(savedKey, [activity]); setHistorical({ key: savedKey, activity }); }
    }).catch(() => {});
    return () => controller.abort();
  }, [released, key, language, saved?.activityId, saved?.revision, savedKey]);
  return { activities: remote?.key === queryKey ? remote.activities : hubActivities(learner, language), savedActivity: historical?.key === savedKey ? historical.activity : undefined };
}
