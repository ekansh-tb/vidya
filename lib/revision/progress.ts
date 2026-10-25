import { z } from 'zod';
const timestamp = z.number().int().nonnegative().max(8_640_000_000_000_000);
const response = z.object({ text:z.string().max(2000), revealed:z.boolean(), selfScore:z.number().int().min(0).max(2).optional(), updatedAt:timestamp });
const schema = z.object({ version:z.literal(1), mode:z.enum(['learn','practice','mock']), unit:z.enum(['cells','materials','forces']), index:z.number().int().min(0).max(35), updatedAt:timestamp, submittedAt:timestamp.optional(), answers:z.record(z.string().regex(/^(practice|mock):[cmf](?:[1-9]|1[0-2])$/), response) });
export type ScienceRevisionProgress = z.infer<typeof schema>;
export type ScienceRevisionAnswer = z.infer<typeof response>;
export function readScienceRevision(value:unknown):ScienceRevisionProgress|undefined { const p=schema.safeParse(value);return p.success?p.data:undefined; }
export function initialScienceRevision():ScienceRevisionProgress {return {version:1,mode:'learn',unit:'cells',index:0,updatedAt:0,answers:{}};}
/** Each question merges separately so one device cannot discard another answer. */
export function mergeScienceRevision(local:unknown,remote:unknown):ScienceRevisionProgress|undefined {
 const a=readScienceRevision(local),b=readScienceRevision(remote);if(!a)return b;if(!b)return a;
 const newest=b.updatedAt>a.updatedAt?b:a;const answers={...a.answers};
 for(const [id,value] of Object.entries(b.answers)) if(!answers[id]||value.updatedAt>answers[id].updatedAt)answers[id]=value;
 return {...newest,answers,submittedAt:Math.max(a.submittedAt??0,b.submittedAt??0)||undefined};
}
