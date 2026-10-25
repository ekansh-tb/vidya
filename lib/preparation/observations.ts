import {z} from 'zod';
import {readPreparation,preparationObservation} from './contracts';
import {placementSchema} from '../learning/placement';
export const preparationObservationsSchema=z.array(z.object({
 id:z.string().uuid(),title:z.string().max(100),subject:z.string().max(60),source:z.enum(['family','starter','study-pack']),mode:z.enum(['practice','mock','play']),placement:placementSchema,
 createdAt:z.number().int().nonnegative(),submitted:z.boolean(),total:z.number().int().min(1).max(20),answered:z.number().int().min(0).max(20),marked:z.number().int().min(0).max(20),marks:z.number().int().min(0).max(100),possibleMarked:z.number().int().min(0).max(100),
}));
export type PreparationObservation=z.infer<typeof preparationObservationsSchema>[number];
/** Session counts only. Never return learner responses, question snapshots or hints. */
export function preparationObservations(raw:unknown):PreparationObservation[]{
 const progress=readPreparation(raw);if(!progress)return [];
 return Object.values(progress.attempts).sort((a,b)=>b.createdAt-a.createdAt||a.id.localeCompare(b.id)).map(a=>({...preparationObservation(a),placement:a.placement}));
}
