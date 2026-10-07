import { it, expect } from "vitest";
import { parentReturnPath } from "./parent-return";
it("accepts only an internal parent destination", () => {
 for (const value of [null, "https://outside.test", "//outside.test", "/\\outside.test", "/", "/parental", "/administrator", "/admin\\outside.test", "/admin%2F..%2Foutside"]) expect(parentReturnPath(value)).toBe("/parent");
 expect(parentReturnPath("/parent/dashboard")).toBe("/parent/dashboard");
});

it("allows owner destinations without opening external redirects", () => { expect(parentReturnPath("/admin")).toBe("/admin"); expect(parentReturnPath("/admin/content?revision=2")).toBe("/admin/content?revision=2"); });
