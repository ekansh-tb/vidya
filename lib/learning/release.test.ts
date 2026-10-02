import { it, expect } from "vitest";
import { PUBLISHED_SCHOOL_GRADES } from "./release";
import { ACTIVITY_CATALOG } from "./catalog";
import { eligibleActivities } from "./activity";
it("every published grade has reviewed content in both languages", () => {
 expect(new Set(PUBLISHED_SCHOOL_GRADES).size).toBe(PUBLISHED_SCHOOL_GRADES.length);
 for (const grade of PUBLISHED_SCHOOL_GRADES) for (const language of ["en","hi"] as const) expect(eligibleActivities(ACTIVITY_CATALOG,{version:1,kind:"school",board:"cbse",grade},language)).toHaveLength(3);
});
