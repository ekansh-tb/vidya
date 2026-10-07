import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({parent:vi.fn(),configured:vi.fn(),owned:vi.fn(),origin:vi.fn(),load:vi.fn(),save:vi.fn()}));
vi.mock("@/lib/auth/session",()=>({requireParent:mocks.parent}));
vi.mock("@/lib/db/client",()=>({dbConfigured:mocks.configured}));
vi.mock("@/lib/db/queries",()=>({getLearnerForParent:mocks.owned}));
vi.mock("@/lib/api/guard",()=>({isSameOrigin:mocks.origin}));
vi.mock("@/lib/planning/service",()=>({loadPlanResponse:mocks.load,savePlanResponse:mocks.save,planResponse:(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"private, no-store"}})}));
import { GET, PUT } from "./route";
const id="00000000-0000-4000-8000-000000000001";
const context=()=>({params:Promise.resolve({id})});
beforeEach(()=>{vi.clearAllMocks();mocks.configured.mockReturnValue(true);mocks.parent.mockResolvedValue({userId:"actual-parent"});mocks.origin.mockReturnValue(true);mocks.owned.mockResolvedValue({id,parentId:"actual-parent"});mocks.load.mockResolvedValue(Response.json({plan:{version:1}}));mocks.save.mockResolvedValue(Response.json({revision:1}));});
describe("family plan endpoint ownership",()=>{
 it("does not read or save without authenticated parent",async()=>{mocks.parent.mockResolvedValue(null);expect((await GET(new Request("https://vidya.example/plan"),context())).status).toBe(401);expect((await PUT(new Request("https://vidya.example/plan",{method:"PUT"}),context())).status).toBe(401);expect(mocks.owned).not.toHaveBeenCalled();expect(mocks.load).not.toHaveBeenCalled();expect(mocks.save).not.toHaveBeenCalled();});
 it("scopes both reads and writes to signed-in family",async()=>{await GET(new Request("https://vidya.example/plan"),context());await PUT(new Request("https://vidya.example/plan",{method:"PUT"}),context());expect(mocks.owned).toHaveBeenCalledWith("actual-parent",id);expect(mocks.load).toHaveBeenCalledWith({id,parentId:"actual-parent"});expect(mocks.save).toHaveBeenCalledWith(expect.any(Request),{id,parentId:"actual-parent"});});
 it("keeps another family inaccessible and responses uncached",async()=>{mocks.owned.mockResolvedValue(null);const response=await GET(new Request("https://vidya.example/plan"),context());expect(response.status).toBe(404);expect(response.headers.get("cache-control")).toContain("no-store");expect(mocks.load).not.toHaveBeenCalled();});
 it("rejects cross-origin writes before reading identity",async()=>{mocks.origin.mockReturnValue(false);expect((await PUT(new Request("https://other.example/plan",{method:"PUT"}),context())).status).toBe(403);expect(mocks.parent).not.toHaveBeenCalled();expect(mocks.save).not.toHaveBeenCalled();});
});
