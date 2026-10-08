import type { SyllabusTopic } from "../content/exam-pack";

/** A content address, not an assessment or a security identifier. Inserting a
 * different point does not move a saved place. Changed text gets a new ID. */
export function lessonPoints(topic: SyllabusTopic, scope: string) {
  const seen = new Map<string, number>();
  return (topic.syllabus.length ? topic.syllabus : [topic.blurb]).map(text => {
    const occurrence = seen.get(text) ?? 0;
    seen.set(text, occurrence + 1);
    const source = JSON.stringify([scope, topic.id, text, occurrence]);
    let hash = 2166136261;
    for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
    return { id: `point-${(hash >>> 0).toString(36)}`, text };
  });
}

export function resolveLessonPoint(points: { id: string }[], savedId?: string) {
  const index = savedId ? points.findIndex(point => point.id === savedId) : 0;
  return { index: Math.max(0, index), changed: Boolean(savedId && index < 0) };
}
