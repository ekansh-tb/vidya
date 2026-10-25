import {z} from 'zod';
export const guardianAccessSchema=z.object({
 owner:z.boolean(),
 members:z.array(z.object({parentId:z.string(),name:z.string(),joinedAt:z.string()})).max(1),
 invitations:z.array(z.object({id:z.uuid(),email:z.email(),expiresAt:z.string()})).max(1),
});
export type GuardianAccess=z.infer<typeof guardianAccessSchema>;
