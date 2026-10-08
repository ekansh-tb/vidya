import { it, expect } from "vitest";
import { parentReturnPath } from "./parent-return";
it("accepts only an internal parent destination", () => {
 for (const value of [null, "https://outside.test", "//outside.test", "/\\outside.test", "/", "/parental", "/administrator", "/admin\\outside.test", "/admin%2F..%2Foutside"]) expect(parentReturnPath(value)).toBe("/parent");
 expect(parentReturnPath("/parent/dashboard")).toBe("/parent/dashboard");
});

it("allows owner destinations without opening external redirects", () => { expect(parentReturnPath("/admin")).toBe("/admin"); expect(parentReturnPath("/admin/content?revision=2")).toBe("/admin/content?revision=2"); });

it.each(["/parent/../sign-in", "/parent/%2e%2e/", "/parent/%2f%2foutside.test", "/admin/./content", "/parent\n", "/parent\t", "/parent%00", "/parent//../..", "/parent/..\\outside"])("rejects ambiguous return path %s", value => {
 expect(parentReturnPath(value)).toBe("/parent");
});

it("keeps legitimate internal query and fragment values", () => {
 expect(parentReturnPath("/parent?section=children#devices")).toBe("/parent?section=children#devices");
 expect(parentReturnPath("/admin/content?title=hello%20there")).toBe("/admin/content?title=hello%20there");
});
