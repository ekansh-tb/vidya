import { z } from "zod";
import type { LearningActivity } from "@/lib/learning/activity";
const bilingual = z.object({ en: z.string().trim().min(1).max(2000), hi: z.string().trim().min(1).max(2000) }).strict();
const item = z.object({ id: z.string().regex(/^[a-z0-9_-]{1,80}$/i), picture: z.string().min(1).max(120), pictureHi: z.string().max(120).optional(), label: bilingual }).strict();
export const activitySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,100}$/), revision: z.number().int().min(1).max(100000),
  placements: z.array(z.string().regex(/^(nursery|lkg|ukg|school:([1-9]|1[0-3]))$/)).min(1).max(16),
  domain: z.enum(["language", "numeracy", "discovery", "creative", "social", "real-world"]), title: bilingual, objective: bilingual,
  interaction: z.enum(["matching", "sorting", "counting", "sequence", "creation", "investigation", "simulation", "offline"]),
  steps: z.array(z.object({ instruction: bilingual, hint: bilingual, items: z.array(item).max(30), answer: z.string().max(80).optional(), feedback: bilingual, countingObjects: z.array(z.object({ picture: z.string().max(120), label: bilingual }).strict()).max(30).optional() }).strict()).min(1).max(30),
  offline: bilingual, caregiver: bilingual, alignment: z.enum(["ncf-foundational", "general-exploration"]), source: z.string().min(1).max(1000), rights: z.literal("original-text-and-system-emoji"),
  review: z.object({ status: z.literal("reviewed"), method: z.literal("source-grounded-editorial"), date: z.iso.date(), checks: z.array(z.string().max(500)).max(20), limits: z.string().min(1).max(2000) }).strict(),
  completion: z.enum(["participated-in-all-steps", "saved-creation", "caregiver-reported"]),
}).strict().superRefine((a, context) => {
  if (new Set(a.placements).size !== a.placements.length) context.addIssue({ code: "custom", message: "Repeated placement" });
  for (const [index, step] of a.steps.entries()) {
    if (new Set(step.items.map(i => i.id)).size !== step.items.length) context.addIssue({ code: "custom", message: `Repeated item in step ${index + 1}` });
    if (step.answer && !step.answer.split(a.interaction === "sequence" ? "|" : "\u0000").every(answer => step.items.some(i => i.id === answer))) context.addIssue({ code: "custom", message: `Answer absent from step ${index + 1}` });
  }
});
export const REVIEW_CHECKS = ["factual", "developmental", "language", "accessibility", "rights"] as const;
export const reviewSchema = z.object({ checks: z.array(z.enum(REVIEW_CHECKS)).length(5), limitations: z.string().trim().min(20).max(2000) }).strict().refine(v => new Set(v.checks).size === 5, { message: "Every review dimension is required" });
export type ReviewRecord = z.infer<typeof reviewSchema>;
export type ContentRevision = { id: string; revision: number; status: "draft" | "review" | "published" | "archived"; payload: LearningActivity; reviewedBy: string | null; reviewedAt: string | null; reviewRecord: ReviewRecord | null; createdAt: string; publishedAt: string | null };
export const contentMutation = z.discriminatedUnion("action", [
  z.object({ action: z.literal("seed") }).strict(),
  z.object({ action: z.literal("draft"), payload: activitySchema }).strict(),
  z.object({ action: z.literal("review"), id: z.string().max(100), revision: z.number().int().positive(), record: reviewSchema }).strict(),
  z.object({ action: z.enum(["publish", "archive"]), id: z.string().max(100), revision: z.number().int().positive() }).strict(),
]);
export const supportSchema = z.object({ organization: z.string().trim().min(1).max(120), channel: z.enum(["email", "form", "conversation"]), status: z.enum(["prepared", "sent", "submitted", "reply-received", "approved", "declined"]), contribution: z.string().trim().min(1).max(500), evidence: z.string().trim().min(1).max(1000), occurredOn: z.iso.date(), nextAction: z.string().trim().max(500), expiry: z.iso.date().nullable(), amount: z.number().nonnegative().max(1e9).nullable(), currency: z.enum(["INR", "USD"]).nullable() }).strict().refine(v => v.status !== "approved" || v.evidence.length >= 20, { message: "Approval needs documented evidence" });
export function coverage(revisions: ContentRevision[]) {
  const live = revisions.filter(r => r.status === "published");
  const placements = ["nursery", "lkg", "ukg", ...Array.from({ length: 13 }, (_, i) => `school:${i + 1}`)];
  const titles = new Map<string, string[]>();
  for (const r of live) { const key = r.payload.title.en.trim().toLowerCase(); titles.set(key, [...(titles.get(key) ?? []), `${r.id}@${r.revision}`]); }
  return { placements: placements.map(placement => ({ placement, activities: new Set(live.filter(r => r.payload.placements.includes(placement)).map(r => r.id)).size })), duplicates: [...titles.entries()].filter(([, ids]) => new Set(ids.map(id => id.split("@")[0])).size > 1).map(([title, ids]) => ({ title, ids })) };
}
