import type {ExamPack} from '../content/exam-pack';
import {preparationQuestionSchema,type PreparationQuestion} from './contracts';
export const plainStudyText=(text:string)=>text.replace(/\s*\u2014\s*/g,': ');
export function choiceFields(options:string[]|undefined,answer:string|undefined){const choices=options?[...new Set(options.map(plainStudyText))]:[];const correct=answer?plainStudyText(answer):undefined;return choices.length>=2&&choices.length<=6&&choices.every(o=>o.length<=300)&&correct&&choices.includes(correct)?{choices,correctChoice:correct}:{};}
export function questionWithChoices(prompt:string,options?:string[]){return prompt+(options?.length?'\n'+options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n'):'');}
export function preparationQuestionsForPack(pack:ExamPack):PreparationQuestion[]{
 return pack.questions.map((q,i)=>{const choices=choiceFields(q.opts,q.a);return preparationQuestionSchema.safeParse({id:`question-${i+1}`,topic:plainStudyText(pack.topics.find(t=>t.id===q.topic)?.title??q.topic),prompt:plainStudyText(choices.choices?q.q:questionWithChoices(q.q,q.opts)),guide:plainStudyText(q.model),hint:plainStudyText(q.hint??''),marks:2,...choices});}).filter(p=>p.success).map(p=>p.data!);
}
/** Content identity changes with authored questions, not the learner's answers. */
export function preparationBankRevision(questions:PreparationQuestion[]){let revision=2166136261;for(const char of JSON.stringify(questions))revision=Math.imul(revision^char.charCodeAt(0),16777619)>>>0;return revision||1;}
