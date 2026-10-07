import { z } from "zod";
export const CIRCLE_ALIASES = ["Curious Crane", "Bright Maple", "Gentle Dolphin", "Clever Comet", "Brave Sparrow", "Thoughtful Turtle"] as const;
export const CIRCLE_REACTIONS = ["interesting", "creative", "good-effort"] as const;
export const CIRCLE_REPORT_REASONS = ["unwanted-contact", "unsafe-content", "pressure", "other-concern"] as const;
export const parentCircleRequest = z.discriminatedUnion("action", [
  z.object({ action: z.literal("invite"), learnerId: z.uuid(), alias: z.enum(CIRCLE_ALIASES) }).strict(),
  z.object({ action: z.literal("accept"), learnerId: z.uuid(), alias: z.enum(CIRCLE_ALIASES), code: z.string().regex(/^[A-Za-z0-9_-]{32}$/) }).strict(),
  z.object({ action: z.enum(["leave", "block"]), circleId: z.uuid() }).strict(),
  z.object({ action: z.literal("review"), cardId: z.uuid(), approved: z.boolean() }).strict(),
]);
export const learnerCircleRequest = z.discriminatedUnion("action", [
  z.object({ action: z.literal("share"), circleId: z.uuid(), projectId: z.string().min(1).max(80) }).strict(),
  z.object({ action: z.literal("unshare"), cardId: z.uuid() }).strict(),
  z.object({ action: z.literal("react"), cardId: z.uuid(), reaction: z.enum(CIRCLE_REACTIONS) }).strict(),
  z.object({ action: z.enum(["leave", "block"]), circleId: z.uuid() }).strict(),
  z.object({ action: z.literal("report"), circleId: z.uuid(), reason: z.enum(CIRCLE_REPORT_REASONS) }).strict(),
]);
export type CircleSummary = { id: string; status: "pending" | "active" | "left" | "blocked"; alias: string; friendAlias: string | null; expiresAt: string };
export type CircleCard = { id: string; circleId: string; alias: string; title: string; svg: string; status: "pending" | "approved" | "declined"; own: boolean; reactions: { reaction: typeof CIRCLE_REACTIONS[number]; count: number }[] };
