import {z} from 'zod';
import {readScienceRevision} from './progress';
import {SCIENCE_COURSE_ID,SCIENCE_MOCK_IDS,SCIENCE_UNITS} from './outline';
export const sciencePreparationSummarySchema=z.object({
 papers:z.array(z.object({id:z.string().uuid(),createdAt:z.number().int().nonnegative(),submitted:z.boolean(),questionIds:z.array(z.string().regex(/^[cmf](?:[1-9]|1[0-2])$/)).length(15),answered:z.number().int().min(0).max(15),marked:z.number().int().min(0).max(15),marks:z.number().int().min(0).max(30)})).optional(),
 courseId:z.literal(SCIENCE_COURSE_ID),
 practiceAnswered:z.number().int().min(0).max(36),
 mockAnswered:z.number().int().min(0).max(15),
 mockMarked:z.number().int().min(0).max(15),
 selfAssessedMarks:z.number().int().min(0).max(30),
 mockSubmitted:z.boolean(),
 units:z.array(z.object({unit:z.enum(['cells','materials','forces']),practiceAnswered:z.number().int().min(0).max(12),mockAnswered:z.number().int().min(0).max(5),mockMarked:z.number().int().min(0).max(5),selfAssessedMarks:z.number().int().min(0).max(10)})).length(3),
});
export type SciencePreparationSummary=z.infer<typeof sciencePreparationSummarySchema>;
/** Summaries contain no typed answers, question text, click history or transcripts. */
export function sciencePreparationSummary(raw:unknown):SciencePreparationSummary|undefined{
 const progress=readScienceRevision(raw);if(!progress)return undefined;
 const units=SCIENCE_UNITS.map((unit,i)=>{
  const prefix=['c','m','f'][i];
  const practice=Array.from({length:12},(_,n)=>progress.answers[`practice:${prefix}${n+1}`]);
  const mock=SCIENCE_MOCK_IDS.filter(id=>id.startsWith(prefix)).map(id=>progress.answers[`mock:${id}`]);
  return {unit:unit.id,practiceAnswered:practice.filter(a=>a?.text.trim()).length,mockAnswered:mock.filter(a=>a?.text.trim()).length,mockMarked:mock.filter(a=>a?.selfScore!==undefined).length,selfAssessedMarks:mock.reduce((total,a)=>total+(a?.selfScore??0),0)};
 });
 const papers=Object.values(progress.mockAttempts??{}).sort((a,b)=>a.createdAt-b.createdAt||a.id.localeCompare(b.id)).map(paper=>{const answers=paper.questionIds.map(id=>paper.answers[id]);return {id:paper.id,createdAt:paper.createdAt,submitted:!!paper.submittedAt,questionIds:paper.questionIds,answered:answers.filter(a=>a?.text.trim()).length,marked:answers.filter(a=>a?.selfScore!==undefined).length,marks:answers.reduce((n,a)=>n+(a?.selfScore??0),0)};});
 return {...(papers.length?{papers}:{}),courseId:SCIENCE_COURSE_ID,practiceAnswered:units.reduce((n,u)=>n+u.practiceAnswered,0),mockAnswered:units.reduce((n,u)=>n+u.mockAnswered,0),mockMarked:units.reduce((n,u)=>n+u.mockMarked,0),selfAssessedMarks:units.reduce((n,u)=>n+u.selfAssessedMarks,0),mockSubmitted:!!progress.submittedAt,units};
}
