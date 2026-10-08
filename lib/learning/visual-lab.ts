import { z } from "zod";
import type { LearnerProfile } from "../types";
import { placementFor } from "./placement";

type Model = "count" | "array" | "fraction" | "equivalent" | "ratio" | "percent" | "line" | "quadratic" | "wave" | "tangent";
type Lab = { model: Model; title: [string, string]; prompt: [string, string]; max: number };
const LABS: Record<string, Lab> = {
  nursery: { model: "count", max: 3, title: ["Little counting garden", "छोटा गिनती बगीचा"], prompt: ["Add a seed. Count together with your grown-up.", "एक बीज जोड़ो। अपने बड़े के साथ गिनो।"] },
  lkg: { model: "count", max: 5, title: ["One more seed", "एक और बीज"], prompt: ["Add one. Take one away. What changes?", "एक जोड़ो। एक हटाओ। क्या बदला?"] },
  ukg: { model: "count", max: 10, title: ["Fill a ten frame", "दस खाने भरो"], prompt: ["Fill some spaces. How many are empty?", "कुछ खाने भरो। कितने खाली हैं?"] },
  1: { model: "count", max: 20, title: ["Build a number", "संख्या बनाओ"], prompt: ["Make a number with counters. Find groups of ten.", "खानों से संख्या बनाओ। दस के समूह खोजो।"] },
  2: { model: "array", max: 5, title: ["Rows and groups", "कतारें और समूह"], prompt: ["Change the rows or columns. Count how many dots you made.", "कतारें या स्तंभ बदलो। सारे बिंदु गिनो।"] },
  3: { model: "fraction", max: 6, title: ["Parts of a whole", "एक पूरे के हिस्से"], prompt: ["Choose equal parts, then change how many are shaded.", "बराबर हिस्से चुनो, फिर रंगे हिस्सों की संख्या बदलो।"] },
  4: { model: "fraction", max: 12, title: ["Explore fractions", "भिन्न खोजो"], prompt: ["Try different equal divisions. Can you shade exactly half?", "बराबर हिस्सों की संख्या बदलो। क्या ठीक आधा रंग सकते हो?"] },
  5: { model: "equivalent", max: 8, title: ["Same amount, more parts", "वही मात्रा, अधिक हिस्से"], prompt: ["Split every part again. Notice that the shaded amount stays the same.", "हर हिस्से को फिर बाँटो। रंगी मात्रा नहीं बदलती।"] },
  6: { model: "ratio", max: 6, title: ["Two groups in balance", "दो समूहों का अनुपात"], prompt: ["Choose a ratio. Scale both groups by the same number.", "अनुपात चुनो। दोनों समूहों को एक ही संख्या से बढ़ाओ।"] },
  7: { model: "percent", max: 100, title: ["A hundred little squares", "सौ छोटे खाने"], prompt: ["Shade a percentage. Compare it with the fraction out of 100.", "प्रतिशत रंगो। उसे सौ में से भिन्न से मिलाओ।"] },
  8: { model: "line", max: 3, title: ["Move a line", "रेखा बदलो"], prompt: ["Change the slope. Which way does the line lean?", "ढलान बदलो। रेखा किस ओर झुकती है?"] },
  9: { model: "line", max: 4, title: ["Slope and intercept", "ढलान और प्रतिच्छेद"], prompt: ["Change one parameter at a time. Watch where the line meets the y axis.", "एक बार में एक मान बदलो। y अक्ष पर रेखा कहाँ मिलती है?"] },
  10: { model: "quadratic", max: 3, title: ["Shape a parabola", "परवलय का आकार बदलो"], prompt: ["Change a and b. Compare the opening and the position of the curve.", "a और b बदलो। वक्र के खुलने और स्थान की तुलना करो।"] },
  11: { model: "wave", max: 3, title: ["Explore a sine wave", "साइन तरंग खोजो"], prompt: ["Change amplitude or frequency. Compare height and repetition.", "आयाम या आवृत्ति बदलो। ऊँचाई और दोहराव की तुलना करो।"] },
  12: { model: "tangent", max: 3, title: ["A slope at one point", "एक बिंदु पर ढलान"], prompt: ["Move the point along y = x². Watch the tangent slope change.", "y = x² पर बिंदु खिसकाओ। स्पर्शरेखा की ढलान देखो।"] },
  13: { model: "tangent", max: 3, title: ["Investigate local change", "स्थानीय बदलाव खोजो"], prompt: ["Compare the tangent at negative, zero and positive x values.", "ऋणात्मक, शून्य और धनात्मक x पर स्पर्शरेखा की तुलना करो।"] },
};

export function visualLabFor(learner: Pick<LearnerProfile, "board" | "grade" | "placement">) {
  const placement = placementFor(learner);
  if (!placement) return undefined;
  const key = placement.kind === "early-years" ? placement.level : String(placement.grade);
  const lab = LABS[key];
  return lab ? { ...lab, id: `visual-${key}-1`, placementKey: placement.kind === "early-years" ? key : `${placement.board}:${key}` } : undefined;
}

export const visualLabStateSchema = z.object({ version: z.literal(1), id: z.string().regex(/^visual-(nursery|lkg|ukg|[1-9]|1[0-3])-1$/), placementKey: z.string().max(70), a: z.number().finite().min(-100).max(100), b: z.number().finite().min(-100).max(100), c: z.number().finite().min(-100).max(100), updatedAt: z.string().datetime() });
export type VisualLabState = z.infer<typeof visualLabStateSchema>;
export function mergeVisualLab(local: unknown, remote: unknown): VisualLabState | undefined {
  const a = visualLabStateSchema.safeParse(local), b = visualLabStateSchema.safeParse(remote);
  return b.success && (!a.success || Date.parse(b.data.updatedAt) > Date.parse(a.data.updatedAt)) ? b.data : a.success ? a.data : undefined;
}
export function labValues(lab: NonNullable<ReturnType<typeof visualLabFor>>, saved?: VisualLabState) {
  const parsed = visualLabStateSchema.safeParse(saved);
  const current = parsed.success && parsed.data.id === lab.id && parsed.data.placementKey === lab.placementKey ? parsed.data : undefined;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value)));
  const defaults = lab.model === "count" ? [1, 1, 2] : lab.model === "percent" ? [25, 1, 2] : lab.model === "fraction" || lab.model === "equivalent" ? [2, 4, 2] : [2, 2, 2];
  let [a, b, c] = current ? [current.a, current.b, current.c] : defaults;
  if (["line", "quadratic"].includes(lab.model)) { a = clamp(a, -lab.max, lab.max); b = clamp(b, -4, 4); }
  else if (lab.model === "tangent") { a = clamp(current?.a ?? 1, -3, 3); }
  else if (["fraction", "equivalent"].includes(lab.model)) { b = clamp(b, 2, lab.max); a = clamp(a, 0, b); }
  else { a = clamp(a, lab.model === "count" || lab.model === "percent" ? 0 : 1, lab.max); b = clamp(b, 1, lab.max); }
  c = clamp(c, 1, 3);
  return { a, b, c };
}
export function graphValue(model: Model, x: number, a: number, b: number) {
  if (model === "line") return a * x + b;
  if (model === "quadratic") return a * x * x + b;
  if (model === "wave") return a * Math.sin(b * x);
  return x * x;
}
