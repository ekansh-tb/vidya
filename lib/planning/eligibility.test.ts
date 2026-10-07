import { describe, expect, it } from "vitest";
import { assignmentActivities } from "./eligibility";
import { ACTIVITY_CATALOG } from "@/lib/learning/catalog";
import type { ContentRevision } from "@/lib/admin/contracts";
const content = ACTIVITY_CATALOG.find(item => item.placements.includes("school:1"))!;
const record: ContentRevision = { id: content.id, revision: content.revision, payload: content, status: "published", publishedAt:"2026-10-08",reviewedAt:"2026-10-08",reviewedBy:"actual-editor",createdAt:"2026-10-08",reviewRecord:{checks:["factual","developmental","language","accessibility","rights"],limitations:"Bounded authored editorial review; no independent child usability evidence."} };
const school = {version:1,kind:"school",board:"cbse",grade:1} as const;
describe("assignment publication and placement",()=>{
 it("offers reviewed current published content for exact server placement",()=>expect(assignmentActivities([record],school)).toEqual([content]));
 it("does not substitute school content for Nursery",()=>expect(assignmentActivities([record],{version:1,kind:"early-years",level:"nursery"})).toEqual([]));
 it("requires an actual published and reviewed record",()=>{for(const status of ["draft","review","archived"] as const) expect(assignmentActivities([{...record,status}],school)).toEqual([]);expect(assignmentActivities([{...record,reviewedBy:null}],school)).toEqual([]);expect(assignmentActivities([{...record,reviewRecord:null}],school)).toEqual([]);});
 it("rejects malformed published payload identity",()=>expect(assignmentActivities([{...record,id:"another-id"}],school)).toEqual([]));
 it("does not let unavailable placement broaden the scope",()=>expect(assignmentActivities([record],null)).toEqual([]));
 it("keeps unlaunched school collections unavailable",()=>expect(assignmentActivities([{...record,payload:{...content,placements:["school:13"]}}],{...school,grade:13})).toEqual([]));
});
