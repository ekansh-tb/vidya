import { z } from "zod";
import type { Board, LearnerProfile } from "../types";

export const EARLY_LEVELS = ["nursery", "lkg", "ukg"] as const;
export type EarlyLevel = typeof EARLY_LEVELS[number];
export const boardSchema = z.enum(["cambridge-primary", "cambridge-lower-secondary", "cambridge-igcse", "icse", "cbse"]);
export const placementSchema = z.discriminatedUnion("kind", [
  z.object({ version: z.literal(1), kind: z.literal("school"), board: boardSchema, grade: z.number().int().min(1).max(13) }),
  z.object({ version: z.literal(1), kind: z.literal("early-years"), level: z.enum(EARLY_LEVELS) }),
]);
export type LearningPlacement = z.infer<typeof placementSchema>;
export type SchoolLearner = LearnerProfile & { board: Board; grade: number };
export function isSchoolLearner(learner: Pick<LearnerProfile, "board" | "grade" | "placement">): learner is SchoolLearner {
  return learner.placement?.kind !== "early-years" && boardSchema.safeParse(learner.board).success && z.number().int().min(1).max(13).safeParse(learner.grade).success;
}
export function placementFor(learner: Pick<LearnerProfile, "board" | "grade" | "placement">): LearningPlacement | null {
  if (learner.placement?.kind === "early-years") return learner.grade === null && learner.board === null ? learner.placement : null;
  if (!isSchoolLearner(learner)) return null;
  return { version: 1, kind: "school", board: learner.board, grade: learner.grade };
}
export function placementLabel(learner: Pick<LearnerProfile, "board" | "grade" | "placement">): string {
  const placement = placementFor(learner);
  if (!placement) return "Choose a learning level";
  return placement.kind === "early-years" ? ({ nursery: "Nursery", lkg: "LKG", ukg: "UKG" })[placement.level] : `Grade ${placement.grade}`;
}
export function experienceMode(learner: Pick<LearnerProfile, "board" | "grade" | "placement">): "early-years" | "little" | "discovery" | "studio" | "focused" {
  if (learner.placement?.kind === "early-years") return "early-years";
  if (learner.grade === null || learner.grade <= 2) return "little";
  if (learner.grade <= 5) return "discovery";
  return learner.grade <= 8 ? "studio" : "focused";
}
export const profilePlacementFields = z.union([
  z.object({ board: boardSchema, grade: z.number().int().min(1).max(13), placement: placementSchema.optional() }).refine((p) => !p.placement || (p.placement.kind === "school" && p.placement.board === p.board && p.placement.grade === p.grade)),
  z.object({ board: z.null(), grade: z.null(), placement: placementSchema }).refine((p) => p.placement.kind === "early-years"),
]);

/** An unfinished enrollment is not a placed learner and cannot enter any server API. */
export const storedProfilePlacementFields = z.union([profilePlacementFields, z.object({
  board: boardSchema.nullable(), grade: z.union([z.literal(0), z.null()]), placement:z.undefined().optional(),
  state:z.object({onboarded:z.literal(false)}),
})]);

export function samePlacement(left: LearningPlacement | null, right: LearningPlacement | null): boolean {
  if (!left || !right || left.version !== right.version || left.kind !== right.kind) return false;
  return left.kind === "early-years" && right.kind === "early-years" ? left.level === right.level : left.kind === "school" && right.kind === "school" && left.board === right.board && left.grade === right.grade;
}
