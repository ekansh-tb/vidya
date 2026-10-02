import { it, expect } from "vitest";
import { parentReturnPath } from "./parent-return";
it("accepts only an internal parent destination", () => {
 for (const value of [null, "https://outside.test", "//outside.test", "/\\outside.test", "/", "/parental"]) expect(parentReturnPath(value)).toBe("/parent");
 expect(parentReturnPath("/parent/dashboard")).toBe("/parent/dashboard");
});
