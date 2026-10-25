import { z } from 'zod';
import {revisionTimestamp,revisionAnswerSchema,scienceMocksSchema,mergeScienceMocks} from './mock-attempts';
const timestamp = revisionTimestamp;
const response = revisionAnswerSchema;
const schema = z.object({ version:z.literal(1), mode:z.enum(['learn','practice','mock']), unit:z.enum(['cells','materials','forces']), index:z.number().int().min(0).max(35), updatedAt:timestamp, originalMockIndex:z.number().int().min(0).max(14).optional(), activeMockId:z.string().uuid().optional(), mockAttempts:scienceMocksSchema.optional(), submittedAt:timestamp.optional(), answers:z.record(z.string().regex(/^(practice|mock):[cmf](?:[1-9]|1[0-2])$/), response) });
export type ScienceRevisionProgress = z.infer<typeof schema>;
export type ScienceRevisionAnswer = z.infer<typeof response>;
export function readScienceRevision(value:unknown):ScienceRevisionProgress|undefined { const p=schema.safeParse(value);return p.success?p.data:undefined; }
export function initialScienceRevision():ScienceRevisionProgress {return {version:1,mode:'learn',unit:'cells',index:0,updatedAt:0,answers:{}};}
/** Each question merges separately so one device cannot discard another answer. */
export function mergeScienceRevision(local:unknown,remote:unknown):ScienceRevisionProgress|undefined {
 const a=readScienceRevision(local),b=readScienceRevision(remote);if(!a)return b;if(!b)return a;
 const newest=b.updatedAt>a.updatedAt?b:a;const answers={...a.answers};
 for(const [id,value] of Object.entries(b.answers)) if(!answers[id]||value.updatedAt>answers[id].updatedAt)answers[id]=value;
 const mockAttempts=mergeScienceMocks(a.mockAttempts,b.mockAttempts);
 return {...newest,...(Object.keys(mockAttempts).length?{mockAttempts}:{}),answers,submittedAt:Math.max(a.submittedAt??0,b.submittedAt??0)||undefined};
}

/** A destination paper's cursor must never be written into the paper being left. */
export function navigateScienceRevision(progress:ScienceRevisionProgress,patch:Partial<ScienceRevisionProgress>,now:number):ScienceRevisionProgress {
 const next={...progress,...patch,updatedAt:now};
 if(progress.mode!=='mock'||patch.mode!==undefined||patch.index===undefined||Object.hasOwn(patch,'activeMockId'))return next;
 const paper=progress.activeMockId?progress.mockAttempts?.[progress.activeMockId]:undefined;
 if(!paper)return {...next,originalMockIndex:patch.index};
 return {...next,mockAttempts:{...progress.mockAttempts,[paper.id]:{...paper,index:patch.index,updatedAt:now}}};
}
