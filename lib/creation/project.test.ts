import { describe, expect, it } from "vitest";
import { canSaveStudio, familySharedCreations, frameSVG, mergeCreativeStudio, newProject, readCreationProject, shapePosition, storyboardHTML } from "./project";
const project = () => newProject("flipbook", "my-project", "2026-10-08T00:00:00.000Z");
describe("private creation projects and exports", () => {
  it("starts private and excludes drafts/private saved creations from family visibility", () => {
    const privateProject = project(); const shared = { ...project(), id: "shared", visibility: "parent" as const };
    expect(privateProject.visibility).toBe("private");
    expect(familySharedCreations({ version: 1, draft: shared, projects: [privateProject, shared] })).toEqual([shared]);
  });
  it("exports authored captions and story text as escaped text, never scripts", () => {
    const value = { ...project(), mode: "story" as const, title: '<script>alert("x")</script>' };
    value.frames[0].caption = '<img src="x" onerror="steal()">'; value.pages[0].text = "<iframe>";
    const html = storyboardHTML(value);
    expect(html).not.toContain("<script>"); expect(html).not.toContain("<iframe>"); expect(html).not.toContain('<img src="x"');
    expect(html).toContain("&lt;script&gt;"); expect(html).toContain("default-src 'none'");
    expect(html).toContain("not a video");
  });
  it("keeps shapes within the canvas with a keyboard-compatible move function", () => {
    expect(shapePosition({ id: "s", kind: "circle", x: 20, y: 20, size: 80, color: "#0f7f85" }, -400, 1000)).toMatchObject({ x: 40, y: 440 });
  });
  it("guards unsupported, oversized and malformed imported drafts", () => {
    expect(readCreationProject(project())).toEqual(project());
    expect(readCreationProject({ ...project(), frames: [] })).toBeUndefined();
    expect(readCreationProject({ ...project(), visibility: "public" })).toBeUndefined();
    expect(canSaveStudio({ version: 1, projects: Array(21).fill(project()) })).toBe(false);
  });
  it("renders only approved colors even when passed an unsafe runtime object", () => {
    const value = project(); value.frames[0].shapes = [{ id: "s", kind: "circle", x: 40, y: 40, size: 40, color: 'red" onload="bad' }];
    expect(frameSVG(value.frames[0])).not.toContain("onload");
  });
  it("merges newest drafts/projects and prevents removal resurrection", () => {
    const old = project(); const next = { ...old, title: "A new idea", updatedAt: "2026-10-08T01:00:00.000Z" };
    const local = { version: 1 as const, draft: old, projects: [old] };
    const remote = { version: 1 as const, draft: next, projects: [next] };
    expect(mergeCreativeStudio(local, remote)?.draft).toEqual(next);
    expect(mergeCreativeStudio(remote, local)?.projects).toEqual([next]);
    const deleted = { ...remote, projects: [], deletedProjectIds: { [old.id]: "2026-10-08T02:00:00.000Z" } };
    expect(mergeCreativeStudio(deleted, remote)?.projects).toEqual([]);
    expect(mergeCreativeStudio(remote, deleted)?.projects).toEqual([]);
  });
  it("keeps projects an older client does not understand", () => {
    const local = { version: 1 as const, draft: project(), projects: [project()] };
    expect(mergeCreativeStudio(local, undefined)).toEqual(local);
  });
});
